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
    vegetarian: ['meat', 'fish', 'shellfish'],
    vegan:      ['meat', 'fish', 'shellfish', 'dairy', 'egg', 'honey'],
  };

  const ALLERGENS = [
    { key: 'gluten',    label: 'Gluten' },
    { key: 'dairy',     label: 'Dairy' },
    { key: 'egg',       label: 'Eggs' },
    { key: 'fish',      label: 'Fish' },
    { key: 'shellfish', label: 'Shellfish' },
    { key: 'peanut',    label: 'Peanuts' },
    { key: 'treenut',   label: 'Tree nuts' },
    { key: 'soy',       label: 'Soy' },
    { key: 'sesame',    label: 'Sesame' },
  ];

  // Relative importance of hitting each target.
  const WEIGHTS = { kcal: 1.5, p: 1.3, c: 1, f: 1 };
  const KEYS = ['kcal', 'p', 'c', 'f'];
  const SCALE_MIN = 0.35;
  const SCALE_MAX = 3.5;
  const HISTORY_MAX = 10;
  // How much worse than the best-fitting recipe a candidate may be (in error
  // units, roughly a few % off per macro) and still be picked.
  // 0.03 keeps daily totals within ~2% of target while letting most recipes rotate in.
  const FIT_TOLERANCE = 0.03;

  // Accepts the current shape or the original flat one ({ vegetarian, dairyFree, ... }).
  function normalizePrefs(p) {
    p = p || {};
    if (Array.isArray(p.allergies)) {
      return {
        diet: { vegetarian: !!(p.diet && p.diet.vegetarian), vegan: !!(p.diet && p.diet.vegan) },
        allergies: p.allergies.filter((a) => ALLERGENS.some((x) => x.key === a)),
        likes: (p.likes || []).filter((f) => FOODS[f]),
        dislikes: (p.dislikes || []).filter((f) => FOODS[f]),
      };
    }
    const allergies = [];
    if (p.dairyFree) allergies.push('dairy');
    if (p.glutenFree) allergies.push('gluten');
    return { diet: { vegetarian: !!p.vegetarian, vegan: !!p.vegan }, allergies, likes: [], dislikes: [] };
  }

  function blockedFlags(prefs) {
    const out = new Set(prefs.allergies);
    Object.keys(DIETS).forEach((d) => { if (prefs.diet[d]) DIETS[d].forEach((f) => out.add(f)); });
    return out;
  }

  function recipeAllowed(recipe, prefs) {
    const bad = blockedFlags(prefs);
    return recipe.items.every(([food]) =>
      !prefs.dislikes.includes(food) && FOODS[food].flags.every((fl) => !bad.has(fl)));
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

  // Liked ingredients and favourites give a recipe more leeway on fit and a
  // higher chance of being picked.
  function preferenceBoost(recipe, prefs, favourites) {
    const liked = new Set(recipe.items.map(([food]) => food).filter((f) => prefs.likes.includes(f))).size;
    return Math.min(liked, 2) + (favourites.includes(recipe.id) ? 1 : 0);
  }

  // Pick at random among recipes that fit nearly as well as the best one,
  // so plans vary between days.
  function pickMeal(slot, targets, prefs, favourites, avoid) {
    const target = slotTarget(targets, slot.share);
    const allowed = RECIPES.filter((r) => r.slot === slot.key && recipeAllowed(r, prefs));
    if (!allowed.length) return null;
    // Avoid recently shown recipes, relaxing that if it would leave nothing.
    let pool = allowed.filter((r) => !avoid.includes(r.id));
    if (!pool.length) pool = allowed.filter((r) => r.id !== avoid[0]);
    if (!pool.length) pool = allowed;

    const fits = pool.map((r) => ({ fit: fitRecipe(r, target), boost: preferenceBoost(r, prefs, favourites) }));
    const best = Math.min(...fits.map((x) => x.fit.error));
    const good = fits.filter((x) => x.fit.error <= best + FIT_TOLERANCE * (1 + 2 * x.boost));
    const weights = good.map((x) => 1 + 1.5 * x.boost);
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < good.length; i++) {
      r -= weights[i];
      if (r <= 0) return good[i].fit;
    }
    return good[good.length - 1].fit;
  }

  function emptyHistory() {
    const h = {};
    SLOTS.forEach((s) => { h[s.key] = []; });
    return h;
  }

  function generateDay(targets, prefs, favourites) {
    const meals = {};
    SLOTS.forEach((slot) => { meals[slot.key] = pickMeal(slot, targets, prefs, favourites || [], []); });
    return { createdAt: new Date().toISOString(), meals, history: emptyHistory() };
  }

  function pushHistory(plan, slotKey) {
    plan.history = plan.history || emptyHistory();
    const h = plan.history[slotKey] = plan.history[slotKey] || [];
    const current = plan.meals[slotKey];
    if (current) h.push(current);
    if (h.length > HISTORY_MAX) h.shift();
  }

  function swapMeal(plan, slotKey, targets, prefs, favourites) {
    const slot = SLOTS.find((s) => s.key === slotKey);
    const current = plan.meals[slotKey];
    const recent = (plan.history && plan.history[slotKey] || []).slice(-2).map((m) => m.id);
    const avoid = [current && current.id].concat(recent).filter(Boolean);
    pushHistory(plan, slotKey);
    plan.meals[slotKey] = pickMeal(slot, targets, prefs, favourites || [], avoid);
    return plan;
  }

  function undoSwap(plan, slotKey) {
    const h = plan.history && plan.history[slotKey];
    if (h && h.length) plan.meals[slotKey] = h.pop();
    return plan;
  }

  // Fit a specific recipe to its meal's share of the targets.
  function fitFor(recipeId, targets) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    const slot = SLOTS.find((s) => s.key === recipe.slot);
    return fitRecipe(recipe, slotTarget(targets, slot.share));
  }

  function setMeal(plan, recipeId, targets) {
    const slotKey = RECIPES.find((r) => r.id === recipeId).slot;
    pushHistory(plan, slotKey);
    plan.meals[slotKey] = fitFor(recipeId, targets);
    return plan;
  }

  // Replace meals (and undo history) that no longer match the user's preferences.
  // Returns the number of meals replaced.
  function enforcePrefs(plan, targets, prefs, favourites) {
    let changed = 0;
    SLOTS.forEach((slot) => {
      const ok = (m) => m && recipeAllowed(RECIPES.find((r) => r.id === m.id), prefs);
      if (plan.history && plan.history[slot.key]) plan.history[slot.key] = plan.history[slot.key].filter(ok);
      const m = plan.meals[slot.key];
      if ((m && !ok(m)) || (!m && RECIPES.some((r) => r.slot === slot.key && recipeAllowed(r, prefs)))) {
        plan.meals[slot.key] = pickMeal(slot, targets, prefs, favourites || [], []);
        changed++;
      }
    });
    return changed;
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
    SLOTS, FOODS, RECIPES, ALLERGENS,
    recipeById: (id) => RECIPES.find((r) => r.id === id),
    normalizePrefs, recipeAllowed,
    generateDay, swapMeal, undoSwap, setMeal, fitFor, enforcePrefs,
    dayTotals, calculateTargets,
  };
})();
