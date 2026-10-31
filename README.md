# My Mac-ro's

A mobile-first web app. You enter your daily calories, protein, carbs and fat, and it builds a **breakfast, lunch, snack and dinner** plan whose recipes are portioned to match those targets.

## Features

- Daily macro targets, plus an optional calculator (Mifflin–St Jeor) that fills them in for you
- Each recipe's protein, carb and fat ingredients are scaled separately to fit its meal's share of the day (breakfast 25%, lunch 30%, snack 15%, dinner 30%), then rounded to practical amounts
- **Favourites:** heart any meal. Recall it from the Favourites tab or from the "Favourites" button on a meal card. Favourites also come up more often in new plans
- **Preferences** (Me tab):
  - Diet: vegetarian or vegan
  - Allergies: gluten, dairy, eggs, fish, shellfish, peanuts, tree nuts, soy and sesame. Recipes containing them are never suggested
  - 👍/👎 on every ingredient. Disliked foods are left out; liked foods appear more often
- **Undo:** "Back" on a meal restores what it was before you swapped it (up to 10 steps), and "New plan" can be undone from the pop-up message
- **Shopping** (Shop tab):
  - Add a meal (cart icon), a whole day, or a favourite to the cart, and set how many times you'll eat each one
  - The shopping list multiplies portions by those counts, combines ingredients shared between meals, sorts them by aisle and rounds up to real pack sizes (`js/packs.js`)
  - Tap **Have it?** for anything already at home, then **Finalise** to get a checklist to tick off as you shop. If the cart changes later, the list offers to update and keeps your ticks
  - **Woolworths vs Coles:** enter each item's shelf price per pack and tick "On special". You get totals for each store and for buying each item wherever it's cheapest. Prices are remembered and flagged after 7 days, since specials change weekly. Each item links to a search on both stores' sites, and there are links to both specials pages. Neither supermarket offers a public pricing API, so prices are entered by hand rather than fetched live
- **Accounts:** email and password sign-in, with self sign-up, forgotten-password emails and password change under Me. Each user's targets, preferences, favourites, plan, shopping list and prices sync to their account across devices. Without accounts configured, everything is saved on the device
- **Admin app** at `/admin/`: list and search users; create users with a password; set or email-reset passwords; disable or re-enable accounts; promote admins; delete users; view and edit each user's macros, diet and allergies
- Installs to your phone's home screen (PWA) and works offline

## Run locally

It's plain HTML, CSS and JS with no build step. Start the bundled server:

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open http://localhost:8000 (admin app: http://localhost:8000/admin/). Accounts and offline mode both need the app served this way, not opened as a file.

## Set up accounts (Supabase)

Accounts and per-user data use [Supabase](https://supabase.com) (free tier). Until it's configured, the app runs without accounts and the admin app shows a setup message.

1. **Create a project:** sign up at supabase.com → **New project**. Pick a region near you (e.g. Sydney) and save the database password somewhere safe.
2. **Create the tables:** **SQL Editor** → **New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**. This creates the `profiles` and `user_data` tables and the security rules that let each user see only their own data, while admins can see everyone's.
3. **Set the sign-in links:** **Authentication → URL Configuration**:
   - **Site URL:** `https://mymac-ro.nvsolutions.net/`
   - **Redirect URLs:** add `https://mymac-ro.nvsolutions.net/**` and `http://localhost:8000/**`

   Under **Authentication → Providers → Email**, choose whether new users must confirm their email (**Confirm email**).
4. **Deploy the admin function:** **Edge Functions → Deploy a new function → Via Editor**. Name it `admin-users`, replace the sample code with [`supabase/functions/admin-users/index.ts`](supabase/functions/admin-users/index.ts), and click **Deploy**. It handles creating, disabling and deleting users and setting passwords, using a key that never leaves Supabase.
5. **Connect the app:** **Project Settings → API**. Copy the **Project URL** and the **anon public** key into [`js/supabase-config.js`](js/supabase-config.js):
   ```js
   window.SUPABASE_CONFIG = {
     url: 'https://abcdefghijklmnop.supabase.co',
     anonKey: 'eyJhbGciOi...',
     allowSignup: true,   // show "Create account" on the sign-in screen
     allowGuest: false,   // allow using the app without an account
   };
   ```
   The anon key is designed to be public, so it's fine in the repo. Never put the **service_role** key in the app.
6. **Make yourself an admin:** deploy (`deploy.ps1`), create your account in the app, then run this in the SQL Editor with your email:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   Then sign in at `https://mymac-ro.nvsolutions.net/admin/`.

**Emails:** Supabase's built-in email service is limited to a few emails per hour, which is fine for testing. For real users, set up your own SMTP under **Project Settings → Authentication → SMTP Settings**. A mailbox from your cPanel hosting works.

## Testing

Run `serve.ps1`, then open http://localhost:8000/tests/accounts-test.html. It runs the main app and the admin app against an in-memory stand-in for Supabase and lists PASS/FAIL for each sign-in, sync and admin flow.
## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | App shell and markup |
| `css/styles.css` | Mobile-first styles, light and dark themes |
| `js/foods.js` | Nutrition per 100 g, allergen flags and groups for each ingredient |
| `js/recipes.js` | Base recipes; ingredients are tagged with a role (protein, carb, fat or veg) |
| `js/planner.js` | Recipe selection, portion fitting, swap/undo and the targets calculator |
| `js/packs.js` | Typical Australian pack sizes and store search terms for each food |
| `js/shopping.js` | Cart, shopping list totals, pack rounding and the price comparison |
| `js/cloud.js` | Email/password accounts and per-user sync via Supabase |
| `js/supabase-config.js` | Your Supabase project URL and anon key |
| `js/vendor/` | Pinned copy of the Supabase JS library (so the app works offline) |
| `js/app.js` | UI, storage and accounts |
| `sw.js` | Offline caching. Bump `VERSION` when you change app files |
| `admin/` | Admin app (user management) |
| `supabase/schema.sql` | Tables and row-level security rules to run in Supabase |
| `supabase/functions/admin-users/` | Edge Function for admin-only account changes |
| `tests/` | Browser test suite for accounts and the admin app |
| `deploy.ps1` | FTPS deploy to the web host |
| `serve.ps1` | Local dev server |

## Adding a recipe

Add an entry to `js/recipes.js`. Any ingredient you use must already exist in `js/foods.js`, with the correct allergen `flags`, listed in `FOOD_GROUPS`, and with a pack size in `js/packs.js`. Tag each ingredient with its role:
`p` (protein), `c` (carbs) or `f` (fat) for ingredients the planner may scale, or `v` for ones that stay fixed.

Nutrition values are estimates. Always check product labels for allergens.
