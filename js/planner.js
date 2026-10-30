// Meal planning engine: picks a recipe for each meal and scales its protein,
// carb and fat ingredients independently so the meal lands on its macro share.
(function () {
  const FOODS = window.FOODS;
  const RECIPES = window.RECIPES;

  const SLOTS = [
    { key: 'breakfast', label: 'Breakfast', share: 0.25 },
    { key: 'lunch',     label: 'Lunch',     share: 0.30 },
    { key: 'snack',     label: 'Snack',     share: 0.15 },
    { key: 'dinner',    label: 'Dinner',    share: 0.30 },
  ];

  const DIETS = {
    vegetarian: ['meat', 'fish'],
    vegan:      ['meat', 'fish', 'dairy', 'egg', 'honey'],
    dairyFree:  ['dairy'],
    glutenFree: ['gluten'],
  };

  // Relative importance of hitting each target.
  const WEIGHTS = { kcal: 1.5, p: 1.3, c: 1, f: 1 };
  const KEYS = ['kcal', 'p', 'c', 'f'];
  const SCALE_MIN = 0.35;
  const SCALE_MAX = 3.5;

  function blocked(prefs) {
    const out = new Set();
    Object.keys(DIETS).forEach((d) => { if (prefs[d]) DIETS[d].forEach((f) => out.add(f)); });
    return out;
  }

  function recipeAllowed(recipe, prefs) {
    const bad = blocked(prefs);
    return recipe.items.every(([food]) => FOODS[food].flags.every((fl) => !bad.has(fl)));
  }

  function macrosOf(items) {
    const m = { kcal: 0, p: 0, c: 0, f: 0 };
    items.forEach(({ food, g }) => {
      const n = FOODS[food];
      KEYS.forEach((k) => { m[k] += (n[k] * g) / 100; });
    });
    return m;
  }

  // Sum of macros contributed by each role at base amounts.
  function roleTotals(recipe) {
    const totals = {};
    recipe.items.forEach(([food, g, role]) => {
      totals[role] = totals[role] || { kcal: 0, p: 0, c: 0, f: 0 };
      const n = FOODS[food];
      KEYS.forEach((k) => { totals[role][k] += (n[k] * g) / 100; });
    });
    return totals;
  }

  // Box-constrained least squares on relative error, by coordinate descent.
  function solveScales(recipe, target) {
    const totals = roleTotals(recipe);
    const fixed = totals.v || { kcal: 0, p: 0, c: 0, f: 0 };
    const roles = ['p', 'c', 'f'].filter((r) => totals[r]);
    const s = { p: 1, c: 1, f: 1 };
    const t = {};
    KEYS.forEach((k) => { t[k] = Math.max(target[k], 1); });

    for (let iter = 0; iter < 40; iter++) {
      roles.forEach((r) => {
        let num = 0;
        let den = 0;
        KEYS.forEach((k) => {
          let rest = fixed[k];
          roles.forEach((o) => { if (o !== r) rest += s[o] * totals[o][k]; });
          const w = WEIGHTS[k] / (t[k] * t[k]);
          num += w * totals[r][k] * (target[k] - rest);
          den += w * totals[r][k] * totals[r][k];
        });
        if (den > 0) s[r] = Math.min(SCALE_MAX, Math.max(SCALE_MIN, num / den));
      });
    }
    return s;
  }

  function roundAmount(food, g) {
    const n = FOODS[food];
    if (n.unit) {
      const count = Math.max(n.unit.step, Math.round(g / n.unit.g / n.unit.step) * n.unit.step);
      return count * n.unit.g;
    }
    if (g < 20) return Math.max(1, Math.round(g));
    return Math.round(g / 5) * 5;
  }

  function errorOf(m, target) {
    let e = 0;
    KEYS.forEach((k) => {
      const rel = (m[k] - target[k]) / Math.max(target[k], 1);
      e += WEIGHTS[k] * rel * rel;
    });
    return e;
  }

  function fitRecipe(recipe, target) {
    const s = solveScales(recipe, target);
    const items = recipe.items.map(([food, g, role]) => ({
      food,
      g: roundAmount(food, role === 'v' ? g : g * s[role]),
    }));
    const macros = macrosOf(items);
    return { id: recipe.id, items, macros, error: errorOf(macros, target) };
  }

  function slotTarget(targets, share) {
    return { kcal: targets.kcal * share, p: targets.p * share, c: targets.c * share, f: targets.f * share };
  }

  // Pick one of the best few fits at random so plans vary between days.
  function pickMeal(slot, targets, prefs, excludeId) {
    const target = slotTarget(targets, slot.share);
    let pool = RECIPES.filter((r) => r.slot === slot.key && recipeAllowed(r, prefs));
    if (pool.length > 1 && excludeId) pool = pool.filter((r) => r.id !== excludeId);
    if (!pool.length) return null;

    const fits = pool.map((r) => fitRecipe(r, target)).sort((a, b) => a.error - b.error);
    const top = fits.slice(0, Math.min(3, fits.length));
    const best = top[0].error;
    // Only consider alternatives that fit nearly as well as the best one.
    const good = top.filter((f) => f.error <= best * 2.5 + 0.02);
    return good[Math.floor(Math.random() * good.length)];
  }

  function generateDay(targets, prefs) {
    const meals = {};
    SLOTS.forEach((slot) => { meals[slot.key] = pickMeal(slot, targets, prefs); });
    return { createdAt: new Date().toISOString(), meals };
  }

  function swapMeal(plan, slotKey, targets, prefs) {
    const slot = SLOTS.find((s) => s.key === slotKey);
    const current = plan.meals[slotKey];
    plan.meals[slotKey] = pickMeal(slot, targets, prefs, current && current.id);
    return plan;
  }

  function dayTotals(plan) {
    const t = { kcal: 0, p: 0, c: 0, f: 0 };
    Object.values(plan.meals).forEach((m) => { if (m) KEYS.forEach((k) => { t[k] += m.macros[k]; }); });
    return t;
  }

  // Mifflin–St Jeor BMR, activity multiplier, then goal-based macro split.
  function calculateTargets({ sex, age, height, weight, activity, goal }) {
    const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
    const tdee = bmr * activity;
    const adjust = { lose: -500, maintain: 0, gain: 300 }[goal];
    const kcal = Math.round((tdee + adjust) / 10) * 10;
    const p = Math.round(weight * ({ lose: 2.2, maintain: 1.8, gain: 2.0 }[goal]));
    const f = Math.round((kcal * 0.25) / 9);
    const c = Math.max(50, Math.round((kcal - p * 4 - f * 9) / 4));
    return { kcal, p, c, f };
  }

  window.Planner = {
    SLOTS, FOODS, RECIPES,
    recipeById: (id) => RECIPES.find((r) => r.id === id),
    generateDay, swapMeal, dayTotals, calculateTargets, recipeAllowed,
  };
})();
