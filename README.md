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
- **Google sign-in:** your targets, favourites, preferences and current plan sync to your account across devices. Without sign-in, everything is saved on the device
- Installs to your phone's home screen (PWA) and works offline

## Run locally

It's plain HTML, CSS and JS with no build step. Start the bundled server:

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open http://localhost:8000. Google sign-in and offline mode both need the app served this way, not opened as a file.

## Set up Google sign-in

Sign-in uses Firebase (free tier) for Google login and a small per-user database. Until it's configured, the app runs without accounts.

1. Go to https://console.firebase.google.com and click **Create a project** (Google Analytics isn't needed).
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**. Choose a support email and save.
3. **Build → Firestore Database → Create database**. Pick a nearby location and start in **production mode**.
4. In Firestore, open the **Rules** tab, paste in the contents of [`firestore.rules`](firestore.rules) and click **Publish**. This lets each user read and write only their own data.
5. Go to **Project settings** (cog icon) → **Your apps** → click the web icon `</>` and register the app (Firebase Hosting isn't needed). Copy the `firebaseConfig` object.
6. Paste it into [`js/firebase-config.js`](js/firebase-config.js), replacing `null`:
   ```js
   window.FIREBASE_CONFIG = {
     apiKey: '...',
     authDomain: 'your-project.firebaseapp.com',
     projectId: 'your-project',
     storageBucket: '...',
     messagingSenderId: '...',
     appId: '...',
   };
   ```
7. When you host the app (e.g. on GitHub Pages), add that domain under **Authentication → Settings → Authorized domains**, e.g. `am2602-bit.github.io`. `localhost` is allowed by default.

The config values identify your project but aren't secret, so they're safe to commit. Access is controlled by the Firestore rules.

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
| `js/cloud.js` | Google sign-in and Firestore sync (loads the Firebase SDK only when configured) |
| `js/firebase-config.js` | Your Firebase project config |
| `js/app.js` | UI, storage and accounts |
| `sw.js` | Offline caching. Bump `VERSION` when you change app files |
| `firestore.rules` | Database security rules to paste into Firebase |
| `serve.ps1` | Local dev server |

## Adding a recipe

Add an entry to `js/recipes.js`. Any ingredient you use must already exist in `js/foods.js`, with the correct allergen `flags`, listed in `FOOD_GROUPS`, and with a pack size in `js/packs.js`. Tag each ingredient with its role:
`p` (protein), `c` (carbs) or `f` (fat) for ingredients the planner may scale, or `v` for ones that stay fixed.

Nutrition values are estimates. Always check product labels for allergens.
