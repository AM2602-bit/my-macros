// Shopping cart → list → price comparison. Pure functions over plain data so
// they can be stored and synced like the rest of the user's data.
//
// cart = { entries: [{ key, recipeId, items: [{food, g}], kcal, times }],
//          have: [foodKey], final: null | { createdAt, signature, items: [{food, need, packs, got}] } }
// prices = { foodKey: { woolworths: {price, special, updated}, coles: {...} } }  (price per pack)
(function () {
  const FOODS = window.FOODS;
  const PACKS = window.PACKS;
  const GROUP_OF = {};
  window.FOOD_GROUPS.forEach(([group, keys], i) => keys.forEach((k) => { GROUP_OF[k] = { group, order: i }; }));

  const STORES = [
    {
      key: 'woolworths', label: 'Woolworths', short: 'W',
      search: (q) => 'https://www.woolworths.com.au/shop/search/products?searchTerm=' + encodeURIComponent(q),
      specials: 'https://www.woolworths.com.au/shop/browse/specials',
    },
    {
      key: 'coles', label: 'Coles', short: 'C',
      search: (q) => 'https://www.coles.com.au/search/products?q=' + encodeURIComponent(q),
      specials: 'https://www.coles.com.au/on-special',
    },
  ];
  // Supermarket specials roll over weekly, so older prices are flagged.
  const STALE_DAYS = 7;

  function emptyCart() {
    return { entries: [], have: [], final: null, editing: false };
  }

  function sanitizeCart(c, recipeExists) {
    c = c || {};
    const okItems = (items) => Array.isArray(items) && items.every((it) => FOODS[it.food] && it.g > 0);
    const out = {
      entries: (c.entries || []).filter((e) => recipeExists(e.recipeId) && okItems(e.items) && e.times >= 1),
      have: (c.have || []).filter((f) => FOODS[f]),
      final: null,
      editing: !!c.editing,
    };
    if (c.final && Array.isArray(c.final.items) && c.final.items.every((it) => FOODS[it.food])) out.final = c.final;
    return out;
  }

  function sanitizePrices(p) {
    const out = {};
    Object.keys(p || {}).forEach((food) => {
      if (!FOODS[food]) return;
      STORES.forEach((s) => {
        const v = p[food][s.key];
        if (v && (v.price > 0 || v.special)) {
          out[food] = out[food] || {};
          out[food][s.key] = { price: v.price > 0 ? v.price : null, special: !!v.special, updated: v.updated || null };
        }
      });
    });
    return out;
  }

  const sameItems = (a, b) => a.length === b.length && a.every((x, i) => x.food === b[i].food && x.g === b[i].g);

  // Adds a fitted meal; the same recipe at the same portion just bumps the count.
  function addMeal(cart, meal) {
    const hit = cart.entries.find((e) => e.recipeId === meal.id && sameItems(e.items, meal.items));
    if (hit) {
      hit.times += 1;
      return hit;
    }
    const entry = {
      key: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      recipeId: meal.id,
      items: meal.items.map((it) => ({ food: it.food, g: it.g })),
      kcal: Math.round(meal.macros.kcal),
      times: 1,
    };
    cart.entries.push(entry);
    return entry;
  }

  const mealCount = (cart) => cart.entries.reduce((n, e) => n + e.times, 0);

  // Total needed per food (portion × times), with whole packs to buy, in aisle order.
  function aggregate(cart) {
    const need = {};
    cart.entries.forEach((e) => e.items.forEach((it) => { need[it.food] = (need[it.food] || 0) + it.g * e.times; }));
    return Object.keys(need)
      .map((food) => ({
        food,
        need: need[food],
        // Small tolerance so 1,010 g of a 1 kg pack doesn't round up to two.
        packs: Math.max(1, Math.ceil(need[food] / PACKS[food].size - 0.02)),
      }))
      .sort((a, b) => GROUP_OF[a.food].order - GROUP_OF[b.food].order || FOODS[a.food].name.localeCompare(FOODS[b.food].name));
  }

  function toBuy(cart) {
    return aggregate(cart).filter((it) => !cart.have.includes(it.food));
  }

  const signature = (items) => items.map((it) => `${it.food}:${it.need}`).join('|');

  // Snapshot the list to buy; keeps "got it" ticks for items still on it.
  function finalize(cart) {
    const prev = {};
    if (cart.final) cart.final.items.forEach((it) => { prev[it.food] = it.got; });
    const items = toBuy(cart).map((it) => Object.assign(it, { got: !!prev[it.food] }));
    cart.final = { createdAt: new Date().toISOString(), signature: signature(items), items };
    cart.editing = false;
    return cart.final;
  }

  const finalOutOfDate = (cart) => !!cart.final && cart.final.signature !== signature(toBuy(cart));

  function formatQty(food, g) {
    const n = FOODS[food];
    if (n.unit) {
      const count = Math.round((g / n.unit.g) * 2) / 2;
      return `${count} ${count === 1 ? n.unit.one : n.unit.many}`;
    }
    const unit = n.ml ? ['ml', 'L'] : ['g', 'kg'];
    if (g >= 1000) return `${+(g / 1000).toFixed(2)} ${unit[1]}`;
    return `${Math.round(g)} ${unit[0]}`;
  }

  function daysOld(iso) {
    return iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : null;
  }

  // Cheapest store for one item, or null if not comparable (missing or tied).
  const priced = (v) => !!v && v.price > 0;

  function cheaperStore(food, prices) {
    const p = prices[food];
    if (!p || !priced(p.woolworths) || !priced(p.coles) || p.woolworths.price === p.coles.price) return null;
    return p.woolworths.price < p.coles.price ? 'woolworths' : 'coles';
  }

  // Totals per store, plus "best of both" buying each item where it's cheapest.
  function compare(items, prices) {
    const res = { split: { total: 0, missing: 0, picks: {} } };
    STORES.forEach((s) => {
      res[s.key] = { total: 0, missing: 0, specials: 0 };
      res.split.picks[s.key] = 0;
    });
    items.forEach((it) => {
      const p = prices[it.food] || {};
      let best = null;
      STORES.forEach((s) => {
        const v = p[s.key];
        if (!priced(v)) { res[s.key].missing++; return; }
        res[s.key].total += v.price * it.packs;
        if (v.special) res[s.key].specials++;
        if (!best || v.price < best.price) best = { store: s.key, price: v.price };
      });
      if (best) {
        res.split.total += best.price * it.packs;
        res.split.picks[best.store]++;
      } else {
        res.split.missing++;
      }
    });
    return res;
  }

  window.Shopping = {
    STORES, PACKS, STALE_DAYS, GROUP_OF,
    emptyCart, sanitizeCart, sanitizePrices,
    addMeal, mealCount, aggregate, toBuy, finalize, finalOutOfDate,
    formatQty, daysOld, cheaperStore, compare,
  };
})();
