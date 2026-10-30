# My Mac-ro's

A mobile-first web app. You enter your daily calories, protein, carbs and fat, and it builds a **breakfast, lunch, snack and dinner** plan whose recipes are portioned to match those targets.

## Features

- Daily macro targets, plus an optional calculator (Mifflin–St Jeor) that fills them in for you
- Dietary filters: vegetarian, vegan, dairy-free and gluten-free
- Splits the day as breakfast 25%, lunch 30%, snack 15% and dinner 30%
- Each recipe's protein, carb and fat ingredients are scaled separately to fit its meal's share, then rounded to practical amounts (whole eggs, slices, 5 g steps)
- Swap a single meal or generate a whole new day
- Installs to your phone's home screen (PWA) and works offline
- Saves your targets and current plan on your device. No account needed.

## Run locally

It's plain HTML, CSS and JS with no build step. Either:

- open `index.html` in a browser, or
- serve the folder, e.g. `python -m http.server 8000`, then visit `http://localhost:8000`. Offline mode only works when the app is served this way.

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | App shell and markup |
| `css/styles.css` | Mobile-first styles, light and dark themes |
| `js/foods.js` | Nutrition per 100 g for each ingredient |
| `js/recipes.js` | Base recipes; ingredients are tagged with a role (protein, carb, fat or veg) |
| `js/planner.js` | Recipe selection, portion fitting and the targets calculator |
| `js/app.js` | UI and storage |
| `sw.js` | Offline caching. Bump `VERSION` when you change app files |

## Adding a recipe

Add an entry to `js/recipes.js`. Any ingredient you use must already exist in `js/foods.js`. Tag each ingredient with its role:
`p` (protein), `c` (carbs) or `f` (fat) for ingredients the planner may scale, or `v` for ones that stay fixed.
