(function () {
  const { SLOTS, FOODS } = window.Planner;
  const P = window.Planner;

  const MACROS = [
    { key: 'p', label: 'Protein', color: 'var(--protein)' },
    { key: 'c', label: 'Carbs',   color: 'var(--carbs)' },
    { key: 'f', label: 'Fat',     color: 'var(--fat)' },
  ];
  const DIET_KEYS = ['vegetarian', 'vegan', 'dairyFree', 'glutenFree'];

  const $ = (sel) => document.querySelector(sel);
  const form = $('#targets-form');

  // ---------- Storage (fails soft in private mode) ----------
  const store = {
    get(key) {
      try { return JSON.parse(localStorage.getItem('mm.' + key)); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem('mm.' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
  };

  const state = {
    targets: store.get('targets'),
    prefs: store.get('prefs') || {},
    plan: store.get('plan'),
  };

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const r0 = (n) => Math.round(n);

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2200);
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

  // ---------- Views ----------
  function show(view) {
    document.querySelectorAll('.view').forEach((v) => { v.hidden = v.id !== 'view-' + view; });
    document.querySelectorAll('#tabbar button').forEach((b) => {
      if (b.dataset.view === view) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }

  $('#tabbar').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    if (btn.dataset.view === 'plan' && !state.plan) {
      toast('Enter your targets first');
      return;
    }
    show(btn.dataset.view);
  });

  // ---------- Targets form ----------
  function fillForm() {
    if (state.targets) ['kcal', 'p', 'c', 'f'].forEach((k) => { form.elements[k].value = state.targets[k]; });
    DIET_KEYS.forEach((k) => { form.elements[k].checked = !!state.prefs[k]; });
    $('#intro').hidden = !!state.targets;
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

  // Vegan implies vegetarian + dairy-free; keep the pills consistent.
  form.addEventListener('change', (e) => {
    if (e.target.name === 'vegan' && e.target.checked) {
      form.elements.vegetarian.checked = true;
      form.elements.dairyFree.checked = true;
    }
    if ((e.target.name === 'vegetarian' || e.target.name === 'dairyFree') && !e.target.checked) {
      form.elements.vegan.checked = false;
    }
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
    state.targets = t;
    state.prefs = {};
    DIET_KEYS.forEach((k) => { state.prefs[k] = form.elements[k].checked; });
    state.plan = P.generateDay(state.targets, state.prefs);
    save();
    renderPlan();
    show('plan');
  });

  // ---------- Plan ----------
  function save() {
    store.set('targets', state.targets);
    store.set('prefs', state.prefs);
    store.set('plan', state.plan);
  }

  function renderSummary() {
    const totals = P.dayTotals(state.plan);
    const t = state.targets;
    $('#sum-kcal').textContent = r0(totals.kcal).toLocaleString();
    $('#sum-kcal-target').textContent = `/ ${r0(t.kcal).toLocaleString()} kcal`;
    $('#plan-date').textContent = new Date(state.plan.createdAt).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
    $('#sum-bars').innerHTML = MACROS.map((m) => {
      const pct = Math.min(100, (totals[m.key] / Math.max(t[m.key], 1)) * 100);
      return `<div class="bar-row" style="--c:${m.color}">
        <b>${m.label}</b>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="val">${r0(totals[m.key])} / ${r0(t[m.key])} g</span>
      </div>`;
    }).join('');
  }

  function mealCard(slot, meal) {
    if (!meal) {
      return `<article class="card empty">
        <p class="eyebrow">${slot.label}</p>
        <p>No ${slot.label.toLowerCase()} recipes match your dietary preferences yet.</p>
      </article>`;
    }
    const recipe = P.recipeById(meal.id);
    const m = meal.macros;
    const ingredients = meal.items.map((it) =>
      `<li><span>${esc(FOODS[it.food].name)}</span><span class="amt">${esc(formatAmount(it.food, it.g))}</span></li>`
    ).join('');
    return `<article class="card meal" data-slot="${slot.key}">
      <div class="meal-head">
        <div class="meal-slot"><span class="eyebrow">${slot.label}</span><span class="time">${recipe.mins} min</span></div>
        <h3>${esc(recipe.name)}</h3>
        <div class="chips">
          <span class="chip kcal-chip">${r0(m.kcal)} kcal</span>
          ${MACROS.map((x) => `<span class="chip" style="--c:${x.color}">${x.label[0]} ${r0(m[x.key])}g</span>`).join('')}
        </div>
      </div>
      <details>
        <summary>Ingredients &amp; method</summary>
        <div class="recipe">
          <h4>Ingredients</h4>
          <ul class="ingredients">${ingredients}</ul>
          ${recipe.extras ? `<p class="extras">Plus: ${esc(recipe.extras)}</p>` : ''}
          <h4>Method</h4>
          <ol class="steps">${recipe.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        </div>
      </details>
      <div class="meal-actions">
        <button class="btn" type="button" data-swap="${slot.key}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h13l-3-3M20 17H7l3 3" /></svg>
          Swap ${slot.label.toLowerCase()}
        </button>
      </div>
    </article>`;
  }

  function renderPlan() {
    if (!state.plan) return;
    renderSummary();
    $('#meals').innerHTML = SLOTS.map((s) => mealCard(s, state.plan.meals[s.key])).join('');
  }

  $('#meals').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-swap]');
    if (!btn) return;
    const slot = btn.dataset.swap;
    P.swapMeal(state.plan, slot, state.targets, state.prefs);
    save();
    renderPlan();
    toast('New ' + slot + ' picked');
  });

  $('#btn-new-plan').addEventListener('click', () => {
    state.plan = P.generateDay(state.targets, state.prefs);
    save();
    renderPlan();
    toast('Fresh plan generated');
  });

  // ---------- Boot ----------
  // Drop saved plans that reference recipes or foods which no longer exist.
  if (state.plan && !SLOTS.every((s) => {
    const m = state.plan.meals[s.key];
    return !m || (P.recipeById(m.id) && m.items.every((it) => FOODS[it.food]));
  })) {
    state.plan = state.targets ? P.generateDay(state.targets, state.prefs) : null;
    save();
  }

  fillForm();
  if (state.plan && state.targets) {
    renderPlan();
    show('plan');
  } else {
    show('targets');
  }

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
