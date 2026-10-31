// My Mac-ro's admin app: manage user accounts and their saved macros/preferences.
// Account changes go through the admin-users Edge Function (service role stays
// on Supabase's servers); user data is read and written directly, allowed for
// admins by the row-level security rules in supabase/schema.sql.
(function () {
  const P = window.Planner;
  const config = window.SUPABASE_CONFIG;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const MACRO_FIELDS = [
    { key: 'kcal', label: 'Calories', unit: 'kcal', min: 800, max: 6000 },
    { key: 'p', label: 'Protein', unit: 'g', min: 20, max: 500 },
    { key: 'c', label: 'Carbs', unit: 'g', min: 0, max: 900 },
    { key: 'f', label: 'Fat', unit: 'g', min: 10, max: 400 },
  ];
  // The main app lives one folder up; password-reset emails link there.
  const appUrl = new URL('../', document.baseURI).href;

  const state = { me: null, users: [], current: null, currentData: null };
  let sb = null;

  // ---------- Helpers ----------
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2600);
  }

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  function ago(iso) {
    if (!iso) return '–';
    const secs = (new Date(iso).getTime() - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, s] of units) {
      if (Math.abs(secs) >= s) return rtf.format(Math.round(secs / s), unit);
    }
    return 'just now';
  }
  const dateOnly = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '–');

  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const bytes = new Uint32Array(14);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => chars[b % chars.length]).join('');
  }

  function badges(u) {
    const out = [];
    if (u.role === 'admin') out.push('<span class="badge-pill admin">Admin</span>');
    if (u.disabled) out.push('<span class="badge-pill off">Disabled</span>');
    else if (!u.confirmed) out.push('<span class="badge-pill warn">Unconfirmed</span>');
    else out.push('<span class="badge-pill ok">Active</span>');
    return out.join(' ');
  }

  async function api(action, payload) {
    const { data, error } = await sb.functions.invoke('admin-users', { body: Object.assign({ action }, payload) });
    if (error) {
      let msg = error.message;
      try {
        const body = await error.context.json();
        if (body && body.error) msg = body.error;
      } catch (e) { /* not JSON */ }
      if (/failed to send a request/i.test(msg)) msg = "Can't reach the admin-users function. Has it been deployed? (README step 4)";
      throw new Error(msg);
    }
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  function show(id) {
    $('#admin-loading').hidden = true;
    ['#admin-setup', '#admin-signin', '#admin-users'].forEach((s) => { $(s).hidden = s !== id; });
    $('#admin-me').hidden = id !== '#admin-users';
  }

  // ---------- Sign-in ----------
  async function checkAdmin(user) {
    const { data, error } = await sb.from('profiles').select('role, disabled').eq('id', user.id).maybeSingle();
    if (error) throw error;
    return !!data && data.role === 'admin' && !data.disabled;
  }

  async function onSession(session) {
    if (!session) {
      state.me = null;
      show('#admin-signin');
      return;
    }
    try {
      if (!(await checkAdmin(session.user))) {
        await sb.auth.signOut();
        $('#admin-signin-error').textContent = "This account doesn't have admin access.";
        show('#admin-signin');
        return;
      }
    } catch (e) {
      $('#admin-signin-error').textContent = e.message;
      show('#admin-signin');
      return;
    }
    state.me = session.user;
    $('#admin-email').textContent = session.user.email;
    show('#admin-users');
    loadUsers();
  }

  $('#admin-signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const err = $('#admin-signin-error');
    err.textContent = '';
    const { error } = await sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.password.value });
    if (error) err.textContent = /invalid login/i.test(error.message) ? 'Incorrect email or password.' : error.message;
    else f.password.value = '';
  });

  $('#btn-admin-signout').addEventListener('click', () => sb.auth.signOut());

  // ---------- User list ----------
  async function loadUsers() {
    $('#user-empty').hidden = false;
    $('#user-empty').textContent = 'Loading users…';
    $('#user-rows').innerHTML = '';
    try {
      const { users } = await api('list');
      state.users = users.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      renderUsers();
    } catch (e) {
      $('#user-empty').textContent = e.message;
    }
  }

  function renderStats() {
    const u = state.users;
    const weekAgo = Date.now() - 7 * 86400000;
    const recent = u.filter((x) => [x.last_sign_in_at, x.data_updated_at].some((d) => d && new Date(d).getTime() > weekAgo)).length;
    const stats = [
      ['Users', u.length],
      ['Active in last 7 days', recent],
      ['Disabled', u.filter((x) => x.disabled).length],
      ['Admins', u.filter((x) => x.role === 'admin').length],
    ];
    $('#stats').innerHTML = stats.map(([label, n]) => `<div class="stat"><strong>${n}</strong><span>${label}</span></div>`).join('');
  }

  function renderUsers() {
    renderStats();
    const q = $('#user-search').value.trim().toLowerCase();
    const filter = $('#user-filter').value;
    const rows = state.users.filter((u) => {
      if (q && !`${u.display_name} ${u.email}`.toLowerCase().includes(q)) return false;
      if (filter === 'active') return !u.disabled && u.confirmed;
      if (filter === 'disabled') return u.disabled;
      if (filter === 'admin') return u.role === 'admin';
      if (filter === 'unconfirmed') return !u.confirmed;
      return true;
    });
    $('#user-rows').innerHTML = rows.map((u) => `<tr tabindex="0" data-id="${u.id}">
        <td><div class="u-name">${esc(u.display_name || u.email.split('@')[0])}${u.id === state.me.id ? ' <span class="hint">(you)</span>' : ''}</div><div class="u-email">${esc(u.email)}</div></td>
        <td>${u.role === 'admin' ? '<span class="badge-pill admin">Admin</span>' : 'User'}</td>
        <td>${u.disabled ? '<span class="badge-pill off">Disabled</span>' : u.confirmed ? '<span class="badge-pill ok">Active</span>' : '<span class="badge-pill warn">Unconfirmed</span>'}</td>
        <td>${ago(u.last_sign_in_at)}</td>
        <td>${ago(u.data_updated_at)}</td>
        <td>${dateOnly(u.created_at)}</td>
      </tr>`).join('');
    $('#user-empty').hidden = rows.length > 0;
    $('#user-empty').textContent = state.users.length ? 'No users match.' : 'No users yet.';
  }

  $('#user-search').addEventListener('input', renderUsers);
  $('#user-filter').addEventListener('change', renderUsers);
  $('#btn-refresh').addEventListener('click', loadUsers);
  $('#user-rows').addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-id]');
    if (tr) openUser(tr.dataset.id);
  });
  $('#user-rows').addEventListener('keydown', (e) => {
    const tr = e.target.closest('tr[data-id]');
    if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openUser(tr.dataset.id); }
  });

  // ---------- User detail ----------
  const drawer = $('#drawer');

  async function openUser(id) {
    const u = state.users.find((x) => x.id === id);
    state.current = u;
    state.currentData = null;
    renderDrawerHead();
    $('#drawer-body').innerHTML = '<p class="hint">Loading…</p>';
    if (!drawer.open) drawer.showModal();
    try {
      const { data, error } = await sb.from('user_data').select('data, updated_at').eq('user_id', id).maybeSingle();
      if (error) throw error;
      state.currentData = data ? data.data : {};
    } catch (e) {
      state.currentData = {};
      toast("Couldn't load this user's app data: " + e.message);
    }
    renderDrawerBody();
  }

  function renderDrawerHead() {
    const u = state.current;
    $('#d-name').textContent = u.display_name || u.email.split('@')[0];
    $('#d-email').textContent = u.email;
    $('#d-badges').innerHTML = badges(u);
  }

  function recipeName(id) {
    const r = P.recipeById(id);
    return r ? r.name : id;
  }

  function renderDrawerBody() {
    const u = state.current;
    const d = state.currentData || {};
    const self = u.id === state.me.id;
    const targets = d.targets || {};
    const prefs = P.normalizePrefs(d.prefs);
    const favs = (d.favourites || []).filter((id) => P.recipeById(id));
    const cartMeals = d.cart && Array.isArray(d.cart.entries) ? d.cart.entries.reduce((n, e) => n + (e.times || 0), 0) : 0;
    const foodNames = (keys) => keys.map((k) => P.FOODS[k].name).join(', ') || '–';

    $('#drawer-body').innerHTML = `
      <div class="section">
        <h3>Account</h3>
        <form id="f-account" class="form-grid" novalidate>
          <div class="row">
            <label class="field"><span>Name</span><input type="text" name="display_name" value="${esc(u.display_name)}"></label>
            <label class="field"><span>Role</span>
              <select name="role"${self ? ' disabled' : ''}>
                <option value="user"${u.role === 'user' ? ' selected' : ''}>User</option>
                <option value="admin"${u.role === 'admin' ? ' selected' : ''}>Admin</option>
              </select>
            </label>
          </div>
          <button class="btn btn-ghost" type="submit">Save account details</button>
        </form>
        <dl class="kv" style="margin-top:12px">
          <dt>Joined</dt><dd>${dateOnly(u.created_at)}</dd>
          <dt>Last sign-in</dt><dd>${ago(u.last_sign_in_at)}</dd>
          <dt>Last active</dt><dd>${ago(u.data_updated_at)}</dd>
          <dt>Email confirmed</dt><dd>${u.confirmed ? 'Yes' : 'No'}</dd>
        </dl>
      </div>

      <div class="section">
        <h3>Password</h3>
        <form id="f-password" class="form-grid" novalidate>
          <label class="field"><span>Set a new password (at least 8 characters)</span>
            <div class="input-row">
              <input type="text" name="password" autocomplete="off" spellcheck="false">
              <button class="btn btn-ghost btn-sm" type="button" data-generate="password">Generate</button>
            </div>
          </label>
          <div class="row">
            <button class="btn btn-ghost" type="submit">Set password</button>
            <button class="btn btn-link" type="button" id="btn-reset-email">Email a reset link instead</button>
          </div>
        </form>
      </div>

      <div class="section">
        <h3>Access</h3>
        <p class="hint">${u.disabled ? 'This account is disabled: the user can’t sign in or load their data.' : 'Disabling blocks sign-in and access to their data. Nothing is deleted.'}</p>
        <button class="btn ${u.disabled ? 'btn-primary' : 'btn-ghost'}" type="button" id="btn-toggle-disabled"${self ? ' disabled title="You can’t disable your own account"' : ''}>
          ${u.disabled ? 'Enable account' : 'Disable account'}
        </button>
      </div>

      <div class="section">
        <h3>Macros &amp; preferences</h3>
        <form id="f-prefs" class="form-grid" novalidate>
          <div class="macro-grid">
            ${MACRO_FIELDS.map((m) => `<label class="field"><span>${m.label} (${m.unit})</span>
              <input type="number" inputmode="numeric" name="${m.key}" min="${m.min}" max="${m.max}" value="${targets[m.key] != null ? targets[m.key] : ''}"></label>`).join('')}
          </div>
          <div>
            <span class="field-label">Diet</span>
            <div class="pills">
              <label class="pill"><input type="checkbox" name="vegetarian"${prefs.diet.vegetarian ? ' checked' : ''}><span>Vegetarian</span></label>
              <label class="pill"><input type="checkbox" name="vegan"${prefs.diet.vegan ? ' checked' : ''}><span>Vegan</span></label>
            </div>
          </div>
          <div>
            <span class="field-label">Allergies &amp; intolerances</span>
            <div class="pills pills-warn">
              ${P.ALLERGENS.map((a) => `<label class="pill"><input type="checkbox" name="allergy" value="${a.key}"${prefs.allergies.includes(a.key) ? ' checked' : ''}><span>${a.label}</span></label>`).join('')}
            </div>
          </div>
          <dl class="kv">
            <dt>Likes</dt><dd>${esc(foodNames(prefs.likes))}</dd>
            <dt>Dislikes</dt><dd>${esc(foodNames(prefs.dislikes))}</dd>
            <dt>Favourites</dt><dd>${esc(favs.map(recipeName).join(', ') || '–')}</dd>
            <dt>Shopping cart</dt><dd>${cartMeals ? `${cartMeals} meal${cartMeals === 1 ? '' : 's'}` : 'Empty'}</dd>
          </dl>
          <p class="hint">The user sees these changes the next time they open the app.</p>
          <button class="btn btn-ghost" type="submit">Save macros &amp; preferences</button>
        </form>
      </div>

      ${self ? '' : `<div class="section">
        <h3>Delete account</h3>
        <div class="danger form-grid">
          <p class="hint">Permanently deletes this user and all their saved data. This can’t be undone.</p>
          <label class="field"><span>Type <b>${esc(u.email)}</b> to confirm</span><input type="text" id="delete-confirm" autocomplete="off" spellcheck="false"></label>
          <button class="btn btn-danger" type="button" id="btn-delete" disabled>Delete user</button>
        </div>
      </div>`}`;
  }

  async function updateUser(changes, okMsg) {
    const u = state.current;
    await api('update', Object.assign({ id: u.id }, changes));
    Object.assign(u, changes);
    delete u.password;
    renderDrawerHead();
    renderUsers();
    toast(okMsg);
  }

  drawer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const f = form.elements;
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      if (form.id === 'f-account') {
        const changes = { display_name: f.display_name.value.trim() };
        if (!f.role.disabled) changes.role = f.role.value;
        await updateUser(changes, 'Account details saved');
      } else if (form.id === 'f-password') {
        const pw = f.password.value;
        if (pw.length < 8) throw new Error('Password must be at least 8 characters.');
        await api('update', { id: state.current.id, password: pw });
        toast('Password set. Share it with the user securely');
      } else if (form.id === 'f-prefs') {
        await savePrefs(f);
      }
    } catch (ex) {
      toast(ex.message);
    } finally {
      btn.disabled = false;
    }
  });

  async function savePrefs(f) {
    const targets = {};
    for (const m of MACRO_FIELDS) {
      const raw = f[m.key].value;
      if (raw === '') continue;
      const v = parseFloat(raw);
      if (isNaN(v) || v < m.min || v > m.max) throw new Error(`${m.label} must be between ${m.min} and ${m.max}.`);
      targets[m.key] = v;
    }
    const hasTargets = Object.keys(targets).length;
    if (hasTargets && hasTargets < 4) throw new Error('Fill in all four targets, or leave them all empty.');
    const data = Object.assign({}, state.currentData || {});
    const prefs = P.normalizePrefs(data.prefs);
    prefs.diet = { vegetarian: f.vegetarian.checked || f.vegan.checked, vegan: f.vegan.checked };
    prefs.allergies = Array.from(f.allergy).filter((x) => x.checked).map((x) => x.value);
    data.prefs = prefs;
    if (hasTargets) data.targets = targets;
    const now = new Date().toISOString();
    const { error } = await sb.from('user_data').upsert({ user_id: state.current.id, data, updated_at: now });
    if (error) throw error;
    state.currentData = data;
    state.current.data_updated_at = now;
    renderUsers();
    renderDrawerBody();
    toast('Macros & preferences saved');
  }

  drawer.addEventListener('click', async (e) => {
    const t = e.target;
    if (t === drawer || t.closest('[data-close]')) return drawer.close();
    const gen = t.closest('[data-generate]');
    if (gen) {
      gen.closest('.input-row').querySelector('input').value = generatePassword();
      return;
    }
    try {
      if (t.closest('#btn-reset-email')) {
        const { error } = await sb.auth.resetPasswordForEmail(state.current.email, { redirectTo: appUrl });
        if (error) throw error;
        toast(`Reset link sent to ${state.current.email}`);
      } else if (t.closest('#btn-toggle-disabled')) {
        const disabled = !state.current.disabled;
        await updateUser({ disabled }, disabled ? 'Account disabled' : 'Account enabled');
        renderDrawerBody();
      } else if (t.closest('#btn-delete')) {
        const u = state.current;
        await api('delete', { id: u.id });
        state.users = state.users.filter((x) => x.id !== u.id);
        drawer.close();
        renderUsers();
        toast(`${u.email} deleted`);
      }
    } catch (ex) {
      toast(ex.message);
    }
  });

  drawer.addEventListener('input', (e) => {
    if (e.target.id === 'delete-confirm') {
      $('#btn-delete').disabled = e.target.value.trim().toLowerCase() !== state.current.email.toLowerCase();
    }
  });

  // ---------- Add user ----------
  const addDialog = $('#add-dialog');
  $('#btn-add-user').addEventListener('click', () => {
    $('#add-form').reset();
    $('#add-error').textContent = '';
    $('#add-form').elements.password.value = generatePassword();
    addDialog.showModal();
  });
  addDialog.addEventListener('click', (e) => {
    if (e.target === addDialog || e.target.closest('[data-close]')) addDialog.close();
    const gen = e.target.closest('[data-generate]');
    if (gen) $('#add-form').elements.password.value = generatePassword();
  });
  $('#add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const err = $('#add-error');
    const btn = e.target.querySelector('[type="submit"]');
    err.textContent = '';
    const email = f.email.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = 'Enter a valid email address.');
    if (f.password.value.length < 8) return (err.textContent = 'Password must be at least 8 characters.');
    btn.disabled = true;
    try {
      await api('create', { email, password: f.password.value, display_name: f.display_name.value.trim(), role: f.role.value });
      addDialog.close();
      toast(`${email} created`);
      loadUsers();
    } catch (ex) {
      err.textContent = ex.message;
    } finally {
      btn.disabled = false;
    }
  });

  // ---------- Boot ----------
  if (!config || !config.url || !config.anonKey || !window.supabase) {
    show('#admin-setup');
    return;
  }
  sb = window.supabase.createClient(config.url, config.anonKey, {
    // Separate from the main app's session so admin sign-in doesn't affect it.
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'mm-admin-auth', detectSessionInUrl: false },
  });
  let lastUid;
  sb.auth.onAuthStateChange((event, session) => {
    const uid = session ? session.user.id : null;
    if (uid === lastUid) return;
    lastUid = uid;
    // Supabase advises not calling other client methods inside this callback.
    setTimeout(() => onSession(session), 0);
  });
})();
