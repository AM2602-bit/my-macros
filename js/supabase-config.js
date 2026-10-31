// Supabase project settings: enables accounts and syncing across devices.
// Find these in Supabase dashboard -> Project Settings -> API. See README
// "Set up accounts (Supabase)". Leave as null to run without accounts.
// The anon key is designed to be public; data is protected by the
// row-level security rules in supabase/schema.sql.
window.SUPABASE_CONFIG = null;
// Example:
// window.SUPABASE_CONFIG = {
//   url: 'https://abcdefghijklmnop.supabase.co',
//   anonKey: 'eyJhbGciOi...',
//   allowSignup: true,   // show "Create account" on the sign-in screen
//   allowGuest: false,   // allow using the app without an account
// };
