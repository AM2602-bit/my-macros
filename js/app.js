(function () {
  const P = window.Planner;
  const S = window.Shopping;
  const { SLOTS, FOODS } = P;
  const Cloud = window.Cloud;

  const MACROS = [
    { key: 'p', label: 'Protein', color: 'var(--protein)' },
    { key: 'c', label: 'Carbs',   color: 'var(--carbs)' },
    { key: 'f', label: 'Fat',     color: 'var(--fat)' },
  ];

  const $ = (sel) => document.querySelector(sel);
  const form = $('#targets-form');

  // ---------- Local storage (fails soft in private mode) ----------
  const local = {
    get(key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    },
  };

  // ---------- State ----------
  // Data is kept per user: 'guest' or a Firebase uid.
  const state = { user: null, ns: 'guest', data: null, prefsChanged: false, view: null };

  function planValid(plan) {
    const okMeal = (m) => !m || (P.recipeById(m.id) && m.items.every((it) => FOODS[it.food]));
    return plan && plan.meals && SLOTS.every((s) => okMeal(plan.meals[s.key]));
  }

  function sanitize(d) {
    d = d || {};
    const out = {
      targets: d.targets || null,
      prefs: P.normalizePrefs(d.prefs),
      favourites: (d.favourites || []).filter((id) => P.recipeById(id)),
      plan: planValid(d.plan) ? d.plan : null,
      cart: S.sanitizeCart(d.cart, (id) => !!P.recipeById(id)),
      prices: S.sanitizePrices(d.prices),
    };
    if (out.plan) {
      const h = out.plan.history || {};
      SLOTS.forEach((s) => { h[s.key] = (h[s.key] || []).filter((m) => planValid({ meals: { [s.key]: m } })); });
      out.plan.history = h;
    }
    if (!out.plan && out.targets) out.plan = P.generateDay(out.targets, out.prefs, out.favourites);
    return out;
  }

  function loadLocal(ns) {
    let d = local.get('mm.data.' + ns);
    if (!d && ns === 'guest' && local.get('mm.targets')) {
      // Data saved by the first version of the app.
      d = { targets: local.get('mm.targets'), prefs: local.get('mm.prefs'), plan: local.get('mm.plan') };
    }
    return sanitize(d);
  }

  function save() {
    local.set('mm.data.' + state.ns, state.data);
    if (state.user && !state.user.offline) Cloud.save(state.user.uid, state.data);
  }

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const r0 = (n) => Math.round(n);
  const slotLabel = (key) => SLOTS.find((s) => s.key === key).label;
  const isFav = (id) => state.data.favourites.includes(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function toast(msg, action) {
    const el = $('#toast');
    el.innerHTML = '';
    el.append(document.createTextNode(msg));
    if (action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = action.label;
      b.addEventListener('click', () => { el.classList.remove('show'); action.run(); });
      el.append(b);
    }
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), action ? 5000 : 2200);
  }

  function formatAmount(food, g) {
    const n = FOODS[food];
    const unit = n.ml ? 'ml' : 'g';
    if (n.unit) {
      const count = g / n.unit.g;
      const label = count === 1 ? n.unit.one : n.unit.many;
      const shown = Number.isInteger(count) ? count : count.toFixed(1).replace('.5', '½').replace(/^0/, '');
      return `${shown} ${label} (${g} ${unit})`;
    }
    return `${g} ${unit}`;
  }

  function chips(m) {
    return `<span class="chip kcal-chip">${r0(m.kcal)} kcal</span>` +
      MACROS.map((x) => `<span class="chip" style="--c:${x.color}">${x.label[0]} ${r0(m[x.key])}g</span>`).join('');
  }

  const ICONS = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h13l-3-3M20 17H7l3 3" /></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" /></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>',
  };

  // ---------- Views ----------
  function show(view) {
    if (view === 'plan' && !state.data.plan) view = 'targets';
    state.view = view;
    if (view === 'plan' && state.prefsChanged) applyPrefsToPlan();
    document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== 'view-' + view; });
    $('#tabbar').hidden = view === 'signin';
    $('#avatar').hidden = view === 'signin';
    document.querySelectorAll('#tabbar button').forEach((b) => {
      if (b.dataset.view === view) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    if (view === 'favourites') renderFavourites();
    if (view === 'me') renderMe();
    if (view === 'shop') renderShop();
    window.scrollTo(0, 0);
  }

  $('#tabbar').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    if (btn.dataset.view === 'plan' && !state.data.plan) {
      toast('Enter your targets first');
      return;
    }
    show(btn.dataset.view);
  });
  $('#avatar').addEventListener('click', () => show('me'));

  function renderAvatar() {
    const el = $('#avatar');
    const u = state.user;
    if (u) {
      el.textContent = (u.displayName || u.email || '?')[0].toUpperCase();
    } else {
      el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>';
    }
  }

  // ---------- Targets form ----------
  function fillForm() {
    ['kcal', 'p', 'c', 'f'].forEach((k) => { form.elements[k].value = state.data.targets ? state.data.targets[k] : ''; });
    $('#intro').hidden = !!state.data.targets;
    checkMacros();
  }

  function readTargets() {
    const t = {};
    ['kcal', 'p', 'c', 'f'].forEach((k) => { t[k] = parseFloat(form.elements[k].value); });
    return t;
  }

  function checkMacros() {
    const t = readTargets();
    const el = $('#macro-check');
    el.classList.remove('warn');
    if ([t.p, t.c, t.f].some(isNaN)) { el.textContent = ''; return; }
    const fromMacros = r0(t.p * 4 + t.c * 4 + t.f * 9);
    if (isNaN(t.kcal)) {
      el.textContent = `Your macros add up to ${fromMacros} kcal.`;
      return;
    }
    const diff = fromMacros - t.kcal;
    if (Math.abs(diff) > t.kcal * 0.1) {
      el.classList.add('warn');
      el.textContent = `Heads up: your macros add up to ${fromMacros} kcal, ${Math.abs(diff)} ${diff > 0 ? 'more' : 'less'} than your calorie target.`;
    } else {
      el.textContent = `Your macros add up to ${fromMacros} kcal. Looks good.`;
    }
  }

  form.addEventListener('input', (e) => {
    if (['kcal', 'p', 'c', 'f'].includes(e.target.name)) checkMacros();
  });

  $('#btn-calc').addEventListener('click', () => {
    const el = form.elements;
    const input = {
      sex: el.sex.value,
      age: parseFloat(el.age.value),
      height: parseFloat(el.height.value),
      weight: parseFloat(el.weight.value),
      activity: parseFloat(el.activity.value),
      goal: el.goal.value,
    };
    if ([input.age, input.height, input.weight].some((n) => isNaN(n) || n <= 0)) {
      toast('Please fill in age, height and weight');
      return;
    }
    const t = P.calculateTargets(input);
    ['kcal', 'p', 'c', 'f'].forEach((k) => { el[k].value = t[k]; });
    checkMacros();
    $('#calc').open = false;
    toast('Targets filled in. Adjust if you like');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = readTargets();
    const bad = ['kcal', 'p', 'c', 'f'].find((k) => {
      const inp = form.elements[k];
      return isNaN(t[k]) || t[k] < parseFloat(inp.min) || t[k] > parseFloat(inp.max);
    });
    if (bad) {
      form.elements[bad].focus();
      toast('Please check your ' + { kcal: 'calories', p: 'protein', c: 'carbs', f: 'fat' }[bad]);
      return;
    }
    const d = state.data;
    d.targets = t;
    d.plan = P.generateDay(d.targets, d.prefs, d.favourites);
    state.prefsChanged = false;
    save();
    $('#intro').hidden = true;
    renderPlan();
    show('plan');
  });

  // ---------- Plan ----------
  function renderSummary() {
    const { plan, targets: t } = state.data;
    const totals = P.dayTotals(plan);
    $('#sum-kcal').textContent = r0(totals.kcal).toLocaleString();
    $('#sum-kcal-target').textContent = `/ ${r0(t.kcal).toLocaleString()} kcal`;
    $('#plan-date').textContent = new Date(plan.createdAt).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
    $('#sum-bars').innerHTML = MACROS.map((m) => {
      const pct = Math.min(100, (totals[m.key] / Math.max(t[m.key], 1)) * 100);
      return `<div class="bar-row" style="--c:${m.color}">
        <b>${m.label}</b>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="val">${r0(totals[m.key])} / ${r0(t[m.key])} g</span>
      </div>`;
    }).join('');
  }

  function recipeDetails(recipe, meal) {
    const ingredients = meal.items.map((it) =>
      `<li><span>${esc(FOODS[it.food].name)}</span><span class="amt">${esc(formatAmount(it.food, it.g))}</span></li>`
    ).join('');
    return `<details>
      <summary>Ingredients &amp; method</summary>
      <div class="recipe">
        <h4>Ingredients</h4>
        <ul class="ingredients">${ingredients}</ul>
        ${recipe.extras ? `<p class="extras">Plus: ${esc(recipe.extras)}</p>` : ''}
        <h4>Method</h4>
        <ol class="steps">${recipe.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      </div>
    </details>`;
  }

  function heartButton(id) {
    const on = isFav(id);
    return `<button class="icon-btn heart" type="button" data-fav="${id}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} favourites">${ICONS.heart}</button>`;
  }

  function mealCard(slot, meal) {
    const history = (state.data.plan.history || {})[slot.key] || [];
    const hasFavs = state.data.favourites.some((id) => P.recipeById(id).slot === slot.key && (!meal || id !== meal.id));
    if (!meal) {
      return `<article class="card empty">
        <p class="eyebrow">${slot.label}</p>
        <p>No ${slot.label.toLowerCase()} recipes match your diet, allergies and dislikes. Try relaxing your food dislikes under <b>Me</b>.</p>
      </article>`;
    }
    const recipe = P.recipeById(meal.id);
    return `<article class="card meal" data-slot="${slot.key}">
      <div class="meal-head">
        <div class="meal-slot"><span class="eyebrow">${slot.label}</span><span class="time">${esc(recipe.cuisine)} · ${recipe.mins} min</span></div>
        <div class="meal-title"><h3>${esc(recipe.name)}</h3>
          <div class="title-actions">
            <button class="icon-btn" type="button" data-cart="${slot.key}" aria-label="Add to shopping cart">${ICONS.cart}</button>
            ${heartButton(recipe.id)}
          </div>
        </div>
        <div class="chips">${chips(meal.macros)}</div>
      </div>
      ${recipeDetails(recipe, meal)}
      <div class="meal-actions">
        ${history.length ? `<button class="btn" type="button" data-undo="${slot.key}">${ICONS.back} Back</button>` : ''}
        <button class="btn" type="button" data-swap="${slot.key}">${ICONS.swap} Swap</button>
        ${hasFavs ? `<button class="btn" type="button" data-pick="${slot.key}">${ICONS.heart} Favourites</button>` : ''}
      </div>
    </article>`;
  }

  function renderPlan() {
    if (!state.data.plan) return;
    renderSummary();
    $('#meals').innerHTML = SLOTS.map((s) => mealCard(s, state.data.plan.meals[s.key])).join('');
  }

  function applyPrefsToPlan() {
    state.prefsChanged = false;
    const d = state.data;
    if (!d.plan) return;
    const n = P.enforcePrefs(d.plan, d.targets, d.prefs, d.favourites);
    if (n) {
      save();
      renderPlan();
      toast(`Updated ${n} meal${n > 1 ? 's' : ''} to match your preferences`);
    }
  }

  function toggleFavourite(id) {
    const favs = state.data.favourites;
    const i = favs.indexOf(id);
    if (i >= 0) favs.splice(i, 1);
    else favs.unshift(id);
    save();
    toast(i >= 0 ? 'Removed from favourites' : 'Saved to favourites');
  }

  function useRecipe(id) {
    const d = state.data;
    P.setMeal(d.plan, id, d.targets);
    save();
    renderPlan();
  }

  $('#meals').addEventListener('click', (e) => {
    const d = state.data;
    const fav = e.target.closest('[data-fav]');
    const swap = e.target.closest('[data-swap]');
    const undo = e.target.closest('[data-undo]');
    const pick = e.target.closest('[data-pick]');
    const cart = e.target.closest('[data-cart]');
    if (cart) {
      addToCart([d.plan.meals[cart.dataset.cart]]);
    } else if (fav) {
      toggleFavourite(fav.dataset.fav);
      renderPlan();
    } else if (swap) {
      P.swapMeal(d.plan, swap.dataset.swap, d.targets, d.prefs, d.favourites);
      save();
      renderPlan();
    } else if (undo) {
      P.undoSwap(d.plan, undo.dataset.undo);
      save();
      renderPlan();
      toast('Previous ' + slotLabel(undo.dataset.undo).toLowerCase() + ' restored');
    } else if (pick) {
      openFavouritePicker(pick.dataset.pick);
    }
  });

  $('#btn-day-cart').addEventListener('click', () => {
    addToCart(SLOTS.map((s) => state.data.plan.meals[s.key]).filter(Boolean));
  });

  $('#btn-new-plan').addEventListener('click', () => {
    const d = state.data;
    const previous = clone(d.plan);
    d.plan = P.generateDay(d.targets, d.prefs, d.favourites);
    save();
    renderPlan();
    toast('Fresh plan generated', {
      label: 'Undo',
      run: () => { d.plan = previous; save(); renderPlan(); },
    });
  });

  // ---------- Favourites ----------
  function favRow(id, actionsHtml) {
    const recipe = P.recipeById(id);
    const allowed = P.recipeAllowed(recipe, state.data.prefs);
    const fit = state.data.targets ? P.fitFor(id, state.data.targets) : null;
    return `<div class="fav-row${allowed ? '' : ' blocked'}">
      <div class="fav-main">
        <p class="fav-name">${esc(recipe.name)}</p>
        <p class="fav-meta">${esc(recipe.cuisine)} · ${recipe.mins} min${allowed ? '' : ' · <span class="warn-text">doesn\'t match your current preferences</span>'}</p>
        ${fit ? `<div class="chips">${chips(fit.macros)}</div>` : ''}
      </div>
      <div class="fav-actions">${actionsHtml(allowed)}</div>
    </div>`;
  }

  function renderFavourites() {
    const favs = state.data.favourites;
    const el = $('#fav-list');
    if (!favs.length) {
      el.innerHTML = `<div class="card empty">
        <p class="empty-icon">${ICONS.heart}</p>
        <p>No favourites yet. Tap the heart on any meal in your plan to save it here for quick recall.</p>
      </div>`;
      return;
    }
    el.innerHTML = SLOTS.map((slot) => {
      const ids = favs.filter((id) => P.recipeById(id).slot === slot.key);
      if (!ids.length) return '';
      return `<div class="card fav-group">
        <h2>${slot.label}</h2>
        ${ids.map((id) => favRow(id, (allowed) =>
          `${state.data.plan && allowed ? `<button class="btn btn-ghost btn-sm" type="button" data-use="${id}">Add to plan</button>` : ''}
           ${state.data.targets ? `<button class="icon-btn" type="button" data-cart-fav="${id}" aria-label="Add to shopping cart">${ICONS.cart}</button>` : ''}
           ${heartButton(id)}`)).join('')}
      </div>`;
    }).join('');
  }

  $('#fav-list').addEventListener('click', (e) => {
    const use = e.target.closest('[data-use]');
    const fav = e.target.closest('[data-fav]');
    const cart = e.target.closest('[data-cart-fav]');
    if (cart) {
      addToCart([P.fitFor(cart.dataset.cartFav, state.data.targets)]);
    } else if (use) {
      const slot = P.recipeById(use.dataset.use).slot;
      useRecipe(use.dataset.use);
      show('plan');
      toast(`Added to ${slotLabel(slot).toLowerCase()}`);
    } else if (fav) {
      toggleFavourite(fav.dataset.fav);
      renderFavourites();
    }
  });

  // Bottom sheet listing favourites for one meal slot.
  const sheet = $('#sheet');
  function openFavouritePicker(slotKey) {
    const current = state.data.plan.meals[slotKey];
    const ids = state.data.favourites.filter((id) => P.recipeById(id).slot === slotKey && (!current || id !== current.id));
    $('#sheet-title').textContent = 'Favourite ' + slotLabel(slotKey).toLowerCase() + 's';
    $('#sheet-body').innerHTML = ids.map((id) => favRow(id, (allowed) =>
      allowed ? `<button class="btn btn-ghost btn-sm" type="button" data-use="${id}">Use</button>` : '')).join('');
    sheet.showModal();
  }
  $('#sheet-body').addEventListener('click', (e) => {
    const use = e.target.closest('[data-use]');
    if (!use) return;
    useRecipe(use.dataset.use);
    sheet.close();
  });
  $('#sheet-close').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });

  // ---------- Shopping ----------
  const money = (n) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });

  function addToCart(meals) {
    const cart = state.data.cart;
    let entry = null;
    meals.forEach((m) => { entry = S.addMeal(cart, m); });
    save();
    updateShopBadge();
    const msg = meals.length > 1
      ? `${meals.length} meals added to cart`
      : `${P.recipeById(entry.recipeId).name} added${entry.times > 1 ? ` (×${entry.times})` : ''}`;
    toast(msg, { label: 'View', run: () => show('shop') });
  }

  function updateShopBadge() {
    const n = S.mealCount(state.data.cart);
    const el = $('#shop-badge');
    el.textContent = n;
    el.hidden = n === 0;
  }

  function groupRows(items, rowHtml) {
    let last = null;
    return items.map((it) => {
      const g = S.GROUP_OF[it.food].group;
      const head = g !== last ? `<h3 class="food-group">${g}</h3>` : '';
      last = g;
      return head + rowHtml(it);
    }).join('');
  }

  const buyText = (it) => `Buy ${it.packs} × ${S.PACKS[it.food].label} · need ${S.formatQty(it.food, it.need)}`;

  function renderCartBuilder() {
    const cart = state.data.cart;
    if (!cart.entries.length) {
      return `<div class="card empty">
        <p class="empty-icon">${ICONS.cart}</p>
        <p>Your cart is empty. Tap the cart icon on a meal, or <b>Add whole day to cart</b> on your plan.</p>
      </div>`;
    }
    const all = S.aggregate(cart);
    const buy = all.filter((it) => !cart.have.includes(it.food));
    const home = all.filter((it) => cart.have.includes(it.food));
    const entries = cart.entries.map((e) => {
      const r = P.recipeById(e.recipeId);
      return `<div class="cart-row">
        <div class="fav-main">
          <p class="fav-name">${esc(r.name)}</p>
          <p class="fav-meta">${slotLabel(r.slot)} · ${e.kcal} kcal per serve</p>
        </div>
        <div class="stepper" role="group" aria-label="Times to eat ${esc(r.name)}">
          <button type="button" data-dec="${e.key}" aria-label="One fewer">${ICONS.minus}</button>
          <span>${e.times}×</span>
          <button type="button" data-inc="${e.key}" aria-label="One more">${ICONS.plus}</button>
        </div>
        <button class="icon-btn" type="button" data-remove="${e.key}" aria-label="Remove ${esc(r.name)}">${ICONS.close}</button>
      </div>`;
    }).join('');
    const listRow = (it) => {
      const have = cart.have.includes(it.food);
      return `<div class="check-row${have ? ' done' : ''}">
        <div class="check-main">
          <span class="check-name">${esc(FOODS[it.food].name)}</span>
          <span class="check-meta">${buyText(it)}</span>
        </div>
        <button class="have-btn" type="button" data-have="${it.food}" aria-pressed="${have}">${have ? '✓ At home' : 'Have it?'}</button>
      </div>`;
    };
    return `<div class="card">
        <div class="card-head"><h2>Meals</h2><button class="btn btn-link btn-sm" type="button" data-act="clear">Clear</button></div>
        <p class="hint">How many times will you eat each meal? Quantities below multiply automatically.</p>
        ${entries}
      </div>
      <div class="card">
        <div class="card-head"><h2>Shopping list</h2><span class="hint">${buy.length} to buy · ${home.length} at home</span></div>
        <p class="hint">Tap <b>Have it?</b> for anything you already have at home.</p>
        ${groupRows(buy, listRow)}
        ${home.length ? `<h3 class="food-group">Already at home</h3>${home.map(listRow).join('')}` : ''}
      </div>
      <button class="btn btn-primary btn-block" type="button" data-act="finalise"${buy.length ? '' : ' disabled'}>
        Finalise shopping list (${buy.length} item${buy.length === 1 ? '' : 's'})
      </button>`;
  }

  function priceCell(food, store) {
    const v = (state.data.prices[food] || {})[store.key] || {};
    const age = S.daysOld(v.updated);
    return `<div class="price-cell">
      <div class="price-head">
        <span>${store.label}</span>
        <a href="${S.STORES.find((s) => s.key === store.key).search(S.PACKS[food].search)}" target="_blank" rel="noopener">Search ↗</a>
      </div>
      <div class="price-input">
        <span>$</span>
        <input type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00"
          data-price="${food}" data-store="${store.key}" value="${v.price > 0 ? v.price : ''}" aria-label="${store.label} price per pack">
      </div>
      <label class="sale"><input type="checkbox" data-special="${food}" data-store="${store.key}"${v.special ? ' checked' : ''}> On special</label>
      ${age !== null && age >= S.STALE_DAYS ? `<span class="stale">Price is ${age} days old</span>` : ''}
    </div>`;
  }

  function renderCompareSummary() {
    const items = state.data.cart.final.items;
    const res = S.compare(items, state.data.prices);
    const [w, c] = S.STORES;
    const complete = res[w.key].missing === 0 && res[c.key].missing === 0;
    const cheapest = complete && res[w.key].total !== res[c.key].total
      ? (res[w.key].total < res[c.key].total ? w : c) : null;
    const tile = (store) => {
      const r = res[store.key];
      const meta = [r.missing ? `${r.missing} missing` : 'All priced', r.specials ? `${r.specials} on special` : ''].filter(Boolean).join(' · ');
      return `<div class="tile${cheapest === store ? ' best' : ''}">
        <span class="tile-label">${store.label}</span>
        <strong>${r.total ? money(r.total) : '–'}</strong>
        <span class="tile-meta">${meta}</span>
      </div>`;
    };
    let verdict;
    const unpriced = items.filter((it) => {
      const p = state.data.prices[it.food] || {};
      return !(p[w.key] && p[w.key].price > 0) || !(p[c.key] && p[c.key].price > 0);
    }).length;
    if (complete) {
      const lower = Math.min(res[w.key].total, res[c.key].total);
      const saveSplit = lower - res.split.total;
      verdict = cheapest
        ? `<b>${cheapest.label}</b> is ${money(Math.abs(res[w.key].total - res[c.key].total))} cheaper for this list.`
        : 'Both stores cost the same for this list.';
      if (saveSplit >= 0.5) verdict += ` Splitting the shop saves another ${money(saveSplit)}.`;
    } else {
      verdict = `Enter both prices for ${unpriced} more item${unpriced === 1 ? '' : 's'} to compare the full list.`;
    }
    return `<h2>Compare prices</h2>
      <div class="tiles">
        ${tile(w)}${tile(c)}
        <div class="tile">
          <span class="tile-label">Best of both</span>
          <strong>${res.split.total ? money(res.split.total) : '–'}</strong>
          <span class="tile-meta">${res.split.picks[w.key]} at ${w.short} · ${res.split.picks[c.key]} at ${c.short}</span>
        </div>
      </div>
      <p class="verdict">${verdict}</p>
      <p class="hint">Enter the shelf price per pack. Prices are saved for next time, and specials change every Wednesday.
        <a href="${w.specials}" target="_blank" rel="noopener">Woolworths specials ↗</a> ·
        <a href="${c.specials}" target="_blank" rel="noopener">Coles specials ↗</a></p>`;
  }

  function bestBadge(food) {
    const s = S.cheaperStore(food, state.data.prices);
    return s ? `Cheaper at ${S.STORES.find((x) => x.key === s).label}` : '';
  }

  function renderFinal() {
    const cart = state.data.cart;
    const items = cart.final.items;
    const got = items.filter((it) => it.got).length;
    const created = new Date(cart.final.createdAt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    const row = (it) => `<div class="buy-row${it.got ? ' done' : ''}">
      <label class="buy-top">
        <input type="checkbox" data-got="${it.food}"${it.got ? ' checked' : ''}>
        <span class="check-main">
          <span class="check-name">${esc(FOODS[it.food].name)}</span>
          <span class="check-meta">${buyText(it)}</span>
        </span>
      </label>
      <span class="best-badge" data-best-for="${it.food}">${bestBadge(it.food)}</span>
      <div class="price-grid">${S.STORES.map((s) => priceCell(it.food, s)).join('')}</div>
    </div>`;
    return `${S.finalOutOfDate(cart) ? `<div class="notice">
          Your cart has changed since you finalised this list.
          <button class="btn btn-ghost btn-sm" type="button" data-act="refinalise">Update list</button>
        </div>` : ''}
      <div class="card">
        <div class="card-head"><h2>Shopping list</h2><span class="hint">${got} of ${items.length} in trolley</span></div>
        <p class="hint">Finalised ${created}. Tick items off as you shop.</p>
        <button class="btn btn-ghost btn-block" type="button" data-act="edit">Edit list</button>
      </div>
      <div class="card" id="compare-summary">${renderCompareSummary()}</div>
      <div class="card">${groupRows(items, row)}</div>
      <button class="btn btn-link btn-block" type="button" data-act="clear">Clear cart &amp; start again</button>`;
  }

  function renderShop() {
    const cart = state.data.cart;
    $('#shop').innerHTML = cart.final && !cart.editing ? renderFinal() : renderCartBuilder();
    updateShopBadge();
  }

  $('#shop').addEventListener('click', (e) => {
    const cart = state.data.cart;
    const t = e.target;
    const btn = (attr) => t.closest('[' + attr + ']');
    const entry = (key) => cart.entries.find((x) => x.key === key);
    let b;
    if ((b = btn('data-inc'))) {
      entry(b.dataset.inc).times++;
    } else if ((b = btn('data-dec'))) {
      const en = entry(b.dataset.dec);
      if (en.times > 1) en.times--;
      else cart.entries = cart.entries.filter((x) => x !== en);
    } else if ((b = btn('data-remove'))) {
      cart.entries = cart.entries.filter((x) => x.key !== b.dataset.remove);
    } else if ((b = btn('data-have'))) {
      const f = b.dataset.have;
      cart.have = cart.have.includes(f) ? cart.have.filter((x) => x !== f) : cart.have.concat(f);
    } else if ((b = btn('data-act'))) {
      const act = b.dataset.act;
      if (act === 'finalise' || act === 'refinalise') {
        S.finalize(cart);
        window.scrollTo(0, 0);
      } else if (act === 'edit') {
        cart.editing = true;
      } else if (act === 'clear') {
        const previous = clone(cart);
        state.data.cart = S.emptyCart();
        save();
        renderShop();
        toast('Cart cleared', { label: 'Undo', run: () => { state.data.cart = previous; save(); renderShop(); } });
        return;
      }
    } else {
      return;
    }
    save();
    renderShop();
  });

  $('#shop').addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.got) {
      const it = state.data.cart.final.items.find((x) => x.food === t.dataset.got);
      it.got = t.checked;
      save();
      renderShop();
    } else if (t.dataset.special) {
      setPrice(t.dataset.special, t.dataset.store, { special: t.checked });
    }
  });

  // Prices update in place so typing isn't interrupted by a re-render.
  $('#shop').addEventListener('input', (e) => {
    const t = e.target;
    if (!t.dataset.price) return;
    const v = parseFloat(t.value);
    setPrice(t.dataset.price, t.dataset.store, { price: v > 0 ? Math.round(v * 100) / 100 : null });
  });

  function setPrice(food, store, change) {
    const prices = state.data.prices;
    prices[food] = prices[food] || {};
    const cur = prices[food][store] || { price: null, special: false };
    prices[food][store] = Object.assign({}, cur, change, { updated: new Date().toISOString() });
    save();
    $('#compare-summary').innerHTML = renderCompareSummary();
    const badge = document.querySelector(`[data-best-for="${food}"]`);
    if (badge) badge.textContent = bestBadge(food);
  }

  // ---------- Me: account & preferences ----------
  function renderAccount() {
    const el = $('#account');
    const u = state.user;
    if (!Cloud.enabled) {
      el.innerHTML = `<h2>Account</h2>
        <p class="hint">You're using My Mac-ro's on this device only. Accounts haven't been set up for this app yet (see the README).</p>`;
    } else if (u) {
      el.innerHTML = `<div class="account-row">
          <div class="avatar avatar-lg">${esc((u.displayName || u.email || '?')[0].toUpperCase())}</div>
          <div class="account-info">
            <p class="fav-name">${esc(u.displayName || 'Signed in')}</p>
            <p class="fav-meta">${esc(u.email || '')}${u.offline ? ' · offline' : ''}</p>
          </div>
        </div>
        <p class="hint">Your targets, favourites, preferences and shopping list are saved to your account.</p>
        <details class="calc" id="pw-change">
          <summary>Change password</summary>
          <form id="pw-form" novalidate>
            <label class="field"><span>New password (at least 8 characters)</span><input type="password" name="pw1" autocomplete="new-password"></label>
            <label class="field"><span>Confirm new password</span><input type="password" name="pw2" autocomplete="new-password"></label>
            <button class="btn btn-ghost btn-block" type="submit">Update password</button>
          </form>
        </details>
        <button class="btn btn-ghost btn-block" type="button" id="btn-signout">Sign out</button>`;
    } else {
      el.innerHTML = `<h2>Account</h2>
        <p class="hint">You're not signed in, so your data is saved on this device only.</p>
        <button class="btn btn-primary btn-block" type="button" id="btn-signin-me">Sign in or create an account</button>`;
    }
  }

  function renderPrefs() {
    const prefs = state.data.prefs;
    document.querySelectorAll('[data-diet]').forEach((inp) => { inp.checked = !!prefs.diet[inp.dataset.diet]; });
    $('#allergy-pills').innerHTML = P.ALLERGENS.map((a) =>
      `<label class="pill"><input type="checkbox" data-allergy="${a.key}"${prefs.allergies.includes(a.key) ? ' checked' : ''}><span>${a.label}</span></label>`
    ).join('');
    renderFoods();
  }

  function renderFoods() {
    const prefs = state.data.prefs;
    const q = $('#food-search').value.trim().toLowerCase();
    $('#food-count').textContent = `${prefs.likes.length} liked · ${prefs.dislikes.length} disliked`;
    const html = window.FOOD_GROUPS.map(([group, keys]) => {
      const rows = keys.filter((k) => !q || FOODS[k].name.toLowerCase().includes(q)).map((k) => {
        const liked = prefs.likes.includes(k);
        const disliked = prefs.dislikes.includes(k);
        return `<div class="food-row">
          <span>${esc(FOODS[k].name)}</span>
          <div class="seg">
            <button type="button" data-like="${k}" aria-pressed="${liked}" aria-label="Like ${esc(FOODS[k].name)}">👍</button>
            <button type="button" data-dislike="${k}" aria-pressed="${disliked}" aria-label="Dislike ${esc(FOODS[k].name)}">👎</button>
          </div>
        </div>`;
      }).join('');
      return rows ? `<h3 class="food-group">${group}</h3>${rows}` : '';
    }).join('');
    $('#food-list').innerHTML = html || '<p class="hint">No foods match your search.</p>';
  }

  function renderMe() {
    renderAccount();
    renderPrefs();
  }

  function prefsUpdated() {
    state.prefsChanged = true;
    save();
  }

  $('#view-me').addEventListener('change', (e) => {
    const prefs = state.data.prefs;
    const t = e.target;
    if (t.dataset.diet) {
      prefs.diet[t.dataset.diet] = t.checked;
      // Vegan implies vegetarian; un-ticking vegetarian removes vegan.
      if (t.dataset.diet === 'vegan' && t.checked) prefs.diet.vegetarian = true;
      if (t.dataset.diet === 'vegetarian' && !t.checked) prefs.diet.vegan = false;
      document.querySelectorAll('[data-diet]').forEach((inp) => { inp.checked = !!prefs.diet[inp.dataset.diet]; });
      prefsUpdated();
    } else if (t.dataset.allergy) {
      const a = t.dataset.allergy;
      prefs.allergies = t.checked ? prefs.allergies.concat(a) : prefs.allergies.filter((x) => x !== a);
      prefsUpdated();
    }
  });

  $('#view-me').addEventListener('click', async (e) => {
    const prefs = state.data.prefs;
    const like = e.target.closest('[data-like]');
    const dislike = e.target.closest('[data-dislike]');
    if (like || dislike) {
      const food = (like || dislike).dataset[like ? 'like' : 'dislike'];
      const [list, other] = like ? ['likes', 'dislikes'] : ['dislikes', 'likes'];
      const on = prefs[list].includes(food);
      prefs[list] = on ? prefs[list].filter((f) => f !== food) : prefs[list].concat(food);
      if (!on) prefs[other] = prefs[other].filter((f) => f !== food);
      prefsUpdated();
      renderFoods();
    } else if (e.target.closest('#btn-signout')) {
      // Don't leave this user's data behind on a shared device.
      const uid = state.user && state.user.uid;
      await Cloud.signOut();
      if (uid) local.remove('mm.data.' + uid);
    } else if (e.target.closest('#btn-signin-me')) {
      showSignin('');
    }
  });

  $('#view-me').addEventListener('submit', async (e) => {
    if (e.target.id !== 'pw-form') return;
    e.preventDefault();
    const f = e.target.elements;
    if (f.pw1.value.length < 8) return toast('Password must be at least 8 characters');
    if (f.pw1.value !== f.pw2.value) return toast("Passwords don't match");
    try {
      await Cloud.updatePassword(f.pw1.value);
      e.target.reset();
      $('#pw-change').open = false;
      toast('Password updated');
    } catch (ex) {
      toast(ex.message);
    }
  });

  $('#food-search').addEventListener('input', renderFoods);

  // ---------- Sign-in ----------
  const authForm = $('#auth-form');
  const AUTH_TEXT = {
    signin: { title: 'Welcome back', sub: 'Sign in to see your meal plans, favourites and shopping list.', submit: 'Sign in', pw: 'Password', ac: 'current-password' },
    signup: { title: 'Create your account', sub: 'Save your macros, preferences and favourites, and use them on any device.', submit: 'Create account', pw: 'Password (at least 8 characters)', ac: 'new-password' },
    forgot: { title: 'Reset your password', sub: "Enter your email and we'll send you a link to set a new password.", submit: 'Send reset link' },
    recover: { title: 'Set a new password', sub: 'Choose a new password for your account.', submit: 'Save new password', pw: 'New password (at least 8 characters)', ac: 'new-password' },
  };
  let authMode = 'signin';
  let recovering = false;

  function setAuthMode(mode) {
    authMode = mode;
    const t = AUTH_TEXT[mode];
    $('#auth-title').textContent = t.title;
    $('#auth-sub').textContent = t.sub;
    $('#auth-submit').textContent = t.submit;
    if (t.pw) {
      $('#pw-label').textContent = t.pw;
      authForm.elements.password.autocomplete = t.ac;
    }
    document.querySelectorAll('#view-signin [data-for]').forEach((el) => {
      el.hidden = !el.dataset.for.split(' ').includes(mode) || (el.hasAttribute('data-signup-only') && !Cloud.allowSignup);
    });
    $('#btn-guest').hidden = !Cloud.allowGuest || mode === 'recover';
    $('#auth-error').textContent = '';
  }

  $('#view-signin').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    setAuthMode(b.dataset.mode);
    $('#signin-status').textContent = '';
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = authForm.elements;
    const email = f.email.value.trim();
    const password = f.password.value;
    const err = (m) => { $('#auth-error').textContent = m; };
    if (authMode !== 'recover' && !/^\S+@\S+\.\S+$/.test(email)) return err('Enter a valid email address.');
    if ((authMode === 'signup' || authMode === 'recover') && password.length < 8) return err('Password must be at least 8 characters.');
    if (authMode === 'signin' && !password) return err('Enter your password.');
    const btn = $('#auth-submit');
    btn.disabled = true;
    err('');
    $('#signin-status').textContent = '';
    try {
      if (authMode === 'signin') {
        await Cloud.signIn(email, password);
      } else if (authMode === 'signup') {
        const r = await Cloud.signUp(email, password, f.name.value.trim());
        if (r.needsConfirmation) {
          setAuthMode('signin');
          $('#signin-status').textContent = `We've sent a confirmation link to ${email}. Open it, then sign in.`;
        }
      } else if (authMode === 'forgot') {
        await Cloud.resetPassword(email);
        setAuthMode('signin');
        $('#signin-status').textContent = `If ${email} has an account, a reset link is on its way.`;
      } else if (authMode === 'recover') {
        await Cloud.updatePassword(password);
        recovering = false;
        f.password.value = '';
        toast('Password updated');
        show(state.data.targets ? 'plan' : 'targets');
      }
    } catch (ex) {
      err(ex.message);
    } finally {
      btn.disabled = false;
    }
  });

  $('#btn-guest').addEventListener('click', () => {
    local.set('mm.guestChosen', true);
    startSession(null);
  });

  // Switch the app to a user's data (or guest data when user is null).
  function startSession(user, data) {
    state.user = user;
    state.ns = user ? user.uid : 'guest';
    state.data = data || loadLocal(state.ns);
    state.prefsChanged = false;
    if (data) save();
    fillForm();
    renderAvatar();
    renderPlan();
    updateShopBadge();
    if (recovering) {
      setAuthMode('recover');
      show('signin');
    } else {
      show(state.data.targets ? 'plan' : 'targets');
    }
  }

  // Shown on the sign-in screen after we sign someone out (e.g. a disabled account).
  let signOutMessage = '';

  async function onAuthChanged(user) {
    if (!user) {
      local.set('mm.lastUser', null);
      if (Cloud.allowGuest && local.get('mm.guestChosen')) startSession(null);
      else showSignin(signOutMessage);
      signOutMessage = '';
      return;
    }
    let data = null;
    try {
      const prof = await Cloud.profile(user.uid);
      if (prof && prof.disabled) {
        signOutMessage = 'This account has been disabled. Contact the app administrator.';
        await Cloud.signOut();
        return;
      }
      if (prof && prof.display_name) user.displayName = prof.display_name;
      const cloud = await Cloud.load(user.uid);
      if (cloud) data = sanitize(cloud);
    } catch (e) {
      console.warn('Cloud load failed', e);
    }
    local.set('mm.lastUser', user);
    // New account: start fresh, or carry over guest data where guest mode is allowed.
    if (!data) {
      if (local.get('mm.data.' + user.uid)) data = loadLocal(user.uid);
      else data = Cloud.allowGuest ? loadLocal('guest') : sanitize(null);
    }
    startSession(user, data);
  }

  function showSignin(status) {
    $('#signin-actions').hidden = false;
    setAuthMode('signin');
    $('#signin-status').textContent = status;
    show('signin');
  }

  // ---------- Boot ----------
  if (!Cloud.enabled) {
    startSession(null);
  } else {
    // Start with whatever is cached so the app is usable immediately, then let auth confirm.
    const last = local.get('mm.lastUser');
    if (last) startSession(last);
    else if (Cloud.allowGuest && local.get('mm.guestChosen')) startSession(null);
    else { $('#signin-actions').hidden = true; $('#signin-status').textContent = 'Loading…'; show('signin'); }

    Cloud.init(onAuthChanged, () => { recovering = true; }).catch((e) => {
      console.warn('Accounts unavailable', e);
      if (last) {
        state.user = Object.assign({}, last, { offline: true });
        renderAccount();
      } else {
        showSignin("Can't reach the server right now. Check your connection and try again.");
      }
    });
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
