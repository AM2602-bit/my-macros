// Google sign-in and per-user cloud storage via Firebase (loaded on demand).
// Each user's data lives in Firestore at users/{uid} as a JSON string.
(function () {
  const config = window.FIREBASE_CONFIG;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const enabled = !!(config && config.apiKey);
  let auth = null;
  let db = null;
  let saveTimer = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Could not load ' + src));
      document.head.appendChild(s);
    });
  }

  async function init(onUser) {
    await loadScript(SDK + 'firebase-app-compat.js');
    await Promise.all([loadScript(SDK + 'firebase-auth-compat.js'), loadScript(SDK + 'firebase-firestore-compat.js')]);
    firebase.initializeApp(config);
    auth = firebase.auth();
    db = firebase.firestore();
    db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    auth.getRedirectResult().catch(() => {});
    auth.onAuthStateChanged(onUser);
  }

  async function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await auth.signInWithPopup(provider);
    } catch (e) {
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
        return auth.signInWithRedirect(provider);
      }
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
      throw e;
    }
  }

  function signOut() {
    return auth.signOut();
  }

  async function load(uid) {
    const snap = await db.collection('users').doc(uid).get();
    return snap.exists ? JSON.parse(snap.data().data) : null;
  }

  // Debounced so rapid changes (e.g. toggling several foods) write once.
  function save(uid, data) {
    if (!db) return;
    clearTimeout(saveTimer);
    const json = JSON.stringify(data);
    saveTimer = setTimeout(() => {
      db.collection('users').doc(uid)
        .set({ data: json, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .catch((e) => console.warn('Cloud save failed', e));
    }, 800);
  }

  window.Cloud = { enabled, init, signIn, signOut, load, save };
})();
