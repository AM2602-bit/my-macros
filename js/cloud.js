// Email/password accounts and per-user cloud storage via Supabase.
// Each user's data lives in the user_data table as one JSON document.
(function () {
  const config = window.SUPABASE_CONFIG;
  const enabled = !!(config && config.url && config.anonKey && window.supabase);
  let client = null;
  let saveTimer = null;
  let lastUid;

  // A friendlier version of Supabase's auth error messages.
  function friendly(error) {
    const msg = (error && error.message) || String(error);
    if (/invalid login credentials/i.test(msg)) return 'Incorrect email or password.';
    if (/email not confirmed/i.test(msg)) return 'Please confirm your email first. Check your inbox for the link.';
    if (/banned/i.test(msg)) return 'This account has been disabled. Contact the app administrator.';
    if (/already registered/i.test(msg)) return 'An account with this email already exists. Try signing in.';
    if (/rate limit/i.test(msg)) return 'Too many attempts. Please wait a minute and try again.';
    if (/failed to fetch|network/i.test(msg)) return "Can't reach the server. Check your connection.";
    return msg;
  }

  function fail(error) {
    const e = new Error(friendly(error));
    e.original = error;
    throw e;
  }

  // onUser(user|null) fires on sign-in/out (not token refreshes);
  // onRecovery() fires when the user arrives from a password-reset email.
  async function init(onUser, onRecovery) {
    client = window.supabase.createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'mm-auth' },
    });
    client.auth.onAuthStateChange((event, session) => {
      const user = session ? session.user : null;
      // Supabase advises not calling other client methods inside this callback.
      setTimeout(() => {
        if (event === 'PASSWORD_RECOVERY' && onRecovery) onRecovery();
        const uid = user ? user.id : null;
        if (uid === lastUid) return;
        lastUid = uid;
        onUser(user ? toUser(user) : null);
      }, 0);
    });
  }

  function toUser(u) {
    const meta = u.user_metadata || {};
    return { uid: u.id, email: u.email, displayName: meta.display_name || '' };
  }

  async function signIn(email, password) {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) fail(error);
  }

  // Returns { needsConfirmation } when the project requires email confirmation.
  async function signUp(email, password, displayName) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName }, emailRedirectTo: location.origin + location.pathname },
    });
    if (error) fail(error);
    return { needsConfirmation: !data.session };
  }

  async function signOut() {
    await client.auth.signOut();
  }

  async function resetPassword(email) {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    if (error) fail(error);
  }

  async function updatePassword(password) {
    const { error } = await client.auth.updateUser({ password });
    if (error) fail(error);
  }

  async function updateDisplayName(name) {
    const { data: { user } } = await client.auth.getUser();
    const [a, b] = await Promise.all([
      client.auth.updateUser({ data: { display_name: name } }),
      client.from('profiles').update({ display_name: name }).eq('id', user.id),
    ]);
    if (a.error) fail(a.error);
    if (b.error) fail(b.error);
  }

  async function profile(uid) {
    const { data, error } = await client.from('profiles').select('display_name, role, disabled').eq('id', uid).maybeSingle();
    if (error) fail(error);
    return data;
  }

  async function load(uid) {
    const { data, error } = await client.from('user_data').select('data').eq('user_id', uid).maybeSingle();
    if (error) fail(error);
    return data ? data.data : null;
  }

  // Debounced so rapid changes (e.g. toggling several foods) write once.
  function save(uid, data) {
    if (!client) return;
    clearTimeout(saveTimer);
    const copy = JSON.parse(JSON.stringify(data));
    saveTimer = setTimeout(() => {
      client.from('user_data')
        .upsert({ user_id: uid, data: copy, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.warn('Cloud save failed', error); });
    }, 800);
  }

  window.Cloud = {
    enabled,
    allowSignup: !!(config && config.allowSignup),
    allowGuest: !!(config && config.allowGuest),
    init, signIn, signUp, signOut, resetPassword, updatePassword, updateDisplayName,
    profile, load, save,
  };
})();
