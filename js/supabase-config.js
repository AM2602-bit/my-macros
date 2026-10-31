// Supabase project settings: enables accounts and syncing across devices.
// Find these in Supabase dashboard -> Project Settings -> API Keys (Legacy tab).
// See README "Set up accounts (Supabase)". Set to null to run without accounts.
// The anon key is designed to be public; data is protected by the
// row-level security rules in supabase/schema.sql.
window.SUPABASE_CONFIG = {
  url: 'https://hqjzkrtlwhozrnsxzhdt.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxanprcnRsd2hvenJuc3h6aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzOTIxODQsImV4cCI6MjEwODk2ODE4NH0.vGeLCJRIWPX1SmoyzllVj33L5xbWpX1DZXy9iaQzhd0',
  allowSignup: true,   // show "Create account" on the sign-in screen
  allowGuest: false,   // allow using the app without an account
};
