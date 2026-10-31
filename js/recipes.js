// Base recipes. Each ingredient is [foodKey, grams, role]:
//   p = protein source, c = carb source, f = fat source — scaled independently
//       by the planner to fit the user's macros;
//   v = vegetables/flavour — kept at the base amount.
// Steps avoid quantities so they read correctly at any portion size.
window.RECIPES = [
  // ---------- Breakfast ----------
  {
    id: 'overnight-oats', slot: 'breakfast', name: 'Blueberry protein overnight oats', mins: 5,
    items: [['oats', 60, 'c'], ['whey', 25, 'p'], ['milk', 200, 'v'], ['chia', 10, 'f'], ['blueberries', 75, 'v']],
    extras: 'Pinch of cinnamon',
    steps: ['Stir oats, protein powder, chia and cinnamon together in a jar.', 'Pour in the milk, mix well, cover and refrigerate overnight.', 'Top with blueberries in the morning.'],
  },
  {
    id: 'veggie-omelette', slot: 'breakfast', name: 'Spinach & mushroom omelette with toast', mins: 15,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['spinach', 40, 'v'], ['mushrooms', 60, 'v'], ['oliveOil', 4, 'v'], ['bread', 80, 'c']],
    extras: 'Salt, pepper, chives',
    steps: ['Whisk eggs and egg whites with salt and pepper.', 'Sauté mushrooms in the oil until golden, then wilt in the spinach.', 'Pour over the eggs and cook gently until just set; fold.', 'Serve with toasted bread.'],
  },
  {
    id: 'yogurt-parfait', slot: 'breakfast', name: 'Greek yoghurt berry parfait', mins: 5,
    items: [['greekYogurt', 250, 'p'], ['granola', 40, 'c'], ['honey', 10, 'c'], ['strawberries', 100, 'v'], ['almonds', 15, 'f']],
    extras: '',
    steps: ['Slice the strawberries and roughly chop the almonds.', 'Layer yoghurt, granola and strawberries in a glass or bowl.', 'Finish with almonds and a drizzle of honey.'],
  },
  {
    id: 'salmon-avo-toast', slot: 'breakfast', name: 'Smoked salmon & avocado toast', mins: 10,
    items: [['bread', 80, 'c'], ['smokedSalmon', 80, 'p'], ['avocado', 50, 'f'], ['egg', 50, 'v'], ['lemon', 5, 'v'], ['spinach', 20, 'v']],
    extras: 'Cracked pepper, chilli flakes',
    steps: ['Toast the bread and poach the egg (3–4 minutes in simmering water).', 'Mash avocado with lemon juice and pepper; spread on toast.', 'Top with spinach, smoked salmon and the poached egg.'],
  },
  {
    id: 'banana-pancakes', slot: 'breakfast', name: 'Banana oat protein pancakes', mins: 20,
    items: [['oats', 50, 'c'], ['banana', 100, 'c'], ['egg', 50, 'f'], ['eggWhite', 100, 'p'], ['whey', 15, 'p'], ['greekYogurt', 80, 'v'], ['blueberries', 50, 'v']],
    extras: 'Cinnamon, ½ tsp baking powder, cooking spray',
    steps: ['Blend oats, banana, egg, egg whites, protein powder, cinnamon and baking powder into a batter.', 'Cook small pancakes in a lightly sprayed non-stick pan, about 2 minutes per side.', 'Serve topped with yoghurt and blueberries.'],
  },
  {
    id: 'breakfast-burrito', slot: 'breakfast', name: 'Egg & black bean breakfast burrito', mins: 15,
    items: [['wrap', 60, 'c'], ['egg', 100, 'f'], ['eggWhite', 80, 'p'], ['blackBeans', 60, 'c'], ['cheddar', 15, 'f'], ['capsicum', 50, 'v'], ['passata', 30, 'v']],
    extras: 'Smoked paprika, cumin, hot sauce',
    steps: ['Soften diced capsicum in a non-stick pan; add beans and spices to warm through.', 'Add whisked eggs and egg whites and scramble until just set.', 'Warm the wrap, fill with the egg mix, cheese and passata (or salsa), then roll up.'],
  },
  {
    id: 'tofu-scramble', slot: 'breakfast', name: 'Tofu scramble on toast', mins: 15,
    items: [['tofu', 200, 'p'], ['bread', 80, 'c'], ['spinach', 50, 'v'], ['cherryTomato', 80, 'v'], ['oliveOil', 5, 'f'], ['avocado', 40, 'f']],
    extras: 'Turmeric, garlic powder, salt, pepper',
    steps: ['Crumble the tofu and fry in the oil with turmeric, garlic powder, salt and pepper for 5 minutes.', 'Add halved tomatoes and spinach; cook until wilted.', 'Serve on toast with sliced avocado.'],
  },
  {
    id: 'pb-smoothie', slot: 'breakfast', name: 'Peanut butter banana smoothie', mins: 5,
    items: [['milk', 300, 'v'], ['banana', 120, 'c'], ['oats', 30, 'c'], ['whey', 30, 'p'], ['peanutButter', 15, 'f']],
    extras: 'Handful of ice',
    steps: ['Add everything to a blender with the ice.', 'Blend until smooth and serve straight away.'],
  },
  {
    id: 'sweet-potato-hash', slot: 'breakfast', name: 'Sweet potato & capsicum hash with eggs', mins: 20,
    items: [['sweetPotato', 150, 'c'], ['egg', 100, 'f'], ['eggWhite', 80, 'p'], ['capsicum', 60, 'v'], ['spinach', 40, 'v'], ['oliveOil', 5, 'v']],
    extras: 'Smoked paprika, salt, pepper',
    steps: ['Dice sweet potato small and fry in the oil with paprika for 10–12 minutes until tender.', 'Add diced capsicum and spinach; cook 2 minutes.', 'Make wells, crack in the eggs, pour egg whites around and cover until set.'],
  },
  {
    id: 'chia-pudding', slot: 'breakfast', name: 'Berry chia protein pudding', mins: 5,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 25, 'p'], ['chia', 20, 'f'], ['banana', 80, 'c'], ['blueberries', 80, 'c'], ['strawberries', 60, 'v']],
    extras: 'Vanilla, cinnamon',
    steps: ['Whisk soy milk, protein powder, vanilla and cinnamon until smooth.', 'Stir in chia seeds and mashed banana; refrigerate at least 2 hours or overnight.', 'Top with blueberries and sliced strawberries.'],
  },
  {
    id: 'vegan-pb-smoothie', slot: 'breakfast', name: 'Vegan peanut butter oat smoothie', mins: 5,
    items: [['soyMilk', 300, 'v'], ['banana', 120, 'c'], ['oats', 30, 'c'], ['plantProtein', 30, 'p'], ['peanutButter', 15, 'f']],
    extras: 'Handful of ice, cinnamon',
    steps: ['Add everything to a blender with the ice.', 'Blend until smooth and serve straight away.'],
  },

  // ---------- Lunch ----------
  {
    id: 'chicken-burrito-bowl', slot: 'lunch', name: 'Chicken burrito bowl', mins: 25,
    items: [['chicken', 150, 'p'], ['brownRice', 150, 'c'], ['blackBeans', 80, 'c'], ['capsicum', 60, 'v'], ['cherryTomato', 60, 'v'], ['avocado', 50, 'f'], ['lemon', 10, 'v']],
    extras: 'Cumin, smoked paprika, chilli, coriander',
    steps: ['Season chicken with the spices and pan-fry or grill until cooked through; slice.', 'Warm the rice and beans.', 'Build a bowl with rice, beans, chicken, capsicum, tomatoes and avocado.', 'Squeeze over lime juice and scatter with coriander.'],
  },
  {
    id: 'tuna-quinoa-salad', slot: 'lunch', name: 'Tuna, quinoa & feta salad', mins: 15,
    items: [['tuna', 120, 'p'], ['quinoa', 150, 'c'], ['cucumber', 80, 'v'], ['cherryTomato', 80, 'v'], ['saladLeaves', 40, 'v'], ['feta', 30, 'f'], ['oliveOil', 8, 'f'], ['lemon', 10, 'v']],
    extras: 'Salt, pepper, dried oregano',
    steps: ['Whisk olive oil, lemon juice, oregano, salt and pepper into a dressing.', 'Toss quinoa, leaves, diced cucumber and halved tomatoes with the dressing.', 'Top with flaked tuna and crumbled feta.'],
  },
  {
    id: 'turkey-hummus-wrap', slot: 'lunch', name: 'Turkey & hummus wrap with apple', mins: 10,
    items: [['wrap', 60, 'c'], ['turkey', 100, 'p'], ['hummus', 40, 'f'], ['saladLeaves', 30, 'v'], ['cucumber', 50, 'v'], ['cherryTomato', 50, 'v'], ['apple', 150, 'c']],
    extras: 'Cracked pepper',
    steps: ['Spread hummus over the wrap.', 'Layer turkey, leaves, sliced cucumber and tomatoes; season and roll tightly.', 'Serve with the apple on the side.'],
  },
  {
    id: 'chicken-veg-pasta', slot: 'lunch', name: 'Chicken & vegetable tomato pasta', mins: 25,
    items: [['pasta', 70, 'c'], ['chicken', 130, 'p'], ['passata', 150, 'v'], ['zucchini', 80, 'v'], ['mushrooms', 60, 'v'], ['oliveOil', 6, 'f'], ['parmesan', 12, 'f']],
    extras: 'Garlic, basil, chilli flakes',
    steps: ['Cook pasta until al dente.', 'Brown diced chicken in the oil, then add zucchini, mushrooms and garlic.', 'Pour in passata with basil and chilli; simmer 5 minutes.', 'Toss with the pasta and top with parmesan.'],
  },
  {
    id: 'chickpea-lentil-curry', slot: 'lunch', name: 'Chickpea & lentil curry with rice', mins: 30,
    items: [['lentils', 150, 'p'], ['chickpeas', 100, 'c'], ['brownRice', 120, 'c'], ['coconutMilk', 100, 'f'], ['passata', 100, 'v'], ['onion', 50, 'v'], ['spinach', 50, 'v']],
    extras: 'Curry powder, garlic, ginger, salt',
    steps: ['Soften diced onion with garlic and ginger in a splash of water.', 'Stir in curry powder for 1 minute, then add passata, coconut milk, lentils and chickpeas.', 'Simmer 10–15 minutes; stir through spinach until wilted.', 'Serve over rice.'],
  },
  {
    id: 'salmon-poke', slot: 'lunch', name: 'Salmon poke bowl', mins: 20,
    items: [['salmon', 130, 'p'], ['whiteRice', 150, 'c'], ['edamame', 60, 'v'], ['cucumber', 60, 'v'], ['avocado', 40, 'f'], ['soySauce', 15, 'v']],
    extras: 'Spring onion, sriracha',
    steps: ['Bake or pan-sear the salmon until just cooked; flake into chunks.', 'Toss salmon in soy sauce.', 'Arrange rice, salmon, edamame, cucumber and avocado in a bowl.', 'Finish with spring onion and sriracha.'],
  },
  {
    id: 'tofu-quinoa-bowl', slot: 'lunch', name: 'Crispy tofu & quinoa power bowl', mins: 25,
    items: [['tofu', 180, 'p'], ['quinoa', 150, 'c'], ['broccoli', 80, 'v'], ['capsicum', 60, 'v'], ['saladLeaves', 30, 'v'], ['peanutButter', 12, 'f'], ['soySauce', 10, 'v'], ['lemon', 10, 'v']],
    extras: 'Garlic, chilli, water to loosen sauce',
    steps: ['Cube tofu and bake at 200°C (or air-fry) for 20 minutes until crisp.', 'Steam broccoli; slice capsicum.', 'Whisk peanut butter, soy sauce, lime juice, garlic and a little water into a sauce.', 'Assemble quinoa, veg and tofu; drizzle with the sauce.'],
  },

  // ---------- Snacks ----------
  {
    id: 'yogurt-berries', slot: 'snack', name: 'Greek yoghurt with berries & almonds', mins: 2,
    items: [['greekYogurt', 200, 'p'], ['blueberries', 80, 'c'], ['honey', 8, 'c'], ['almonds', 10, 'f']],
    extras: '',
    steps: ['Spoon yoghurt into a bowl.', 'Top with blueberries, chopped almonds and honey.'],
  },
  {
    id: 'apple-pb-shake', slot: 'snack', name: 'Apple & peanut butter with protein shake', mins: 3,
    items: [['apple', 150, 'c'], ['peanutButter', 20, 'f'], ['whey', 25, 'p']],
    extras: 'Water or ice for the shake',
    steps: ['Shake protein powder with cold water.', 'Slice the apple and serve with peanut butter for dipping.'],
  },
  {
    id: 'rice-cake-cottage', slot: 'snack', name: 'Rice cakes with cottage cheese & tomato', mins: 3,
    items: [['riceCakes', 20, 'c'], ['cottage', 150, 'p'], ['cherryTomato', 60, 'v'], ['cucumber', 40, 'v'], ['avocado', 20, 'f']],
    extras: 'Cracked pepper, chives',
    steps: ['Spread cottage cheese over the rice cakes.', 'Top with sliced tomato, cucumber and avocado; season with pepper.'],
  },
  {
    id: 'eggs-hummus-veg', slot: 'snack', name: 'Boiled eggs, hummus & veggie sticks', mins: 12,
    items: [['egg', 100, 'p'], ['hummus', 50, 'f'], ['capsicum', 80, 'v'], ['cucumber', 80, 'v'], ['riceCakes', 20, 'c']],
    extras: 'Salt, pepper',
    steps: ['Boil eggs for 8–9 minutes, cool in cold water and peel.', 'Cut capsicum and cucumber into sticks.', 'Serve with hummus and rice cakes.'],
  },
  {
    id: 'berry-smoothie', slot: 'snack', name: 'Strawberry protein smoothie', mins: 5,
    items: [['milk', 250, 'v'], ['whey', 30, 'p'], ['strawberries', 100, 'v'], ['banana', 80, 'c'], ['chia', 10, 'f']],
    extras: 'Handful of ice',
    steps: ['Blend everything with the ice until smooth.'],
  },
  {
    id: 'edamame-choc', slot: 'snack', name: 'Edamame, strawberries & dark chocolate', mins: 5,
    items: [['edamame', 120, 'p'], ['strawberries', 120, 'c'], ['darkChoc', 15, 'f']],
    extras: 'Sea salt',
    steps: ['Steam or microwave the edamame and sprinkle with sea salt.', 'Serve with strawberries and a few squares of dark chocolate.'],
  },
  {
    id: 'tuna-rice-cakes', slot: 'snack', name: 'Tuna & avocado rice cakes', mins: 5,
    items: [['tuna', 90, 'p'], ['riceCakes', 30, 'c'], ['avocado', 30, 'f'], ['lemon', 5, 'v']],
    extras: 'Pepper, chilli flakes',
    steps: ['Mash avocado with lemon juice and pepper; spread over rice cakes.', 'Top with tuna and a pinch of chilli flakes.'],
  },
  {
    id: 'choc-pb-shake', slot: 'snack', name: 'Chocolate peanut butter protein shake', mins: 3,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 30, 'p'], ['banana', 80, 'c'], ['peanutButter', 10, 'f']],
    extras: '1 tsp cocoa powder, ice',
    steps: ['Blend everything with the ice until smooth.'],
  },

  // ---------- Dinner ----------
  {
    id: 'lemon-salmon', slot: 'dinner', name: 'Lemon garlic salmon with sweet potato & greens', mins: 35,
    items: [['salmon', 150, 'p'], ['sweetPotato', 200, 'c'], ['greenBeans', 100, 'v'], ['broccoli', 80, 'v'], ['oliveOil', 5, 'f'], ['lemon', 10, 'v'], ['garlic', 5, 'v']],
    extras: 'Salt, pepper, dill or parsley',
    steps: ['Cube sweet potato, toss with half the oil and roast at 200°C for 25 minutes.', 'Rub salmon with garlic, lemon juice and the rest of the oil; roast for the last 12–15 minutes.', 'Steam green beans and broccoli.', 'Plate up and finish with fresh herbs.'],
  },
  {
    id: 'beef-bolognese', slot: 'dinner', name: 'Lean beef bolognese', mins: 35,
    items: [['pasta', 80, 'c'], ['beefMince', 150, 'p'], ['passata', 200, 'v'], ['onion', 60, 'v'], ['mushrooms', 60, 'v'], ['garlic', 5, 'v'], ['oliveOil', 5, 'f'], ['parmesan', 10, 'f']],
    extras: 'Dried oregano, basil, salt, pepper',
    steps: ['Soften diced onion, garlic and mushrooms in the oil.', 'Add mince and brown, breaking it up.', 'Stir in passata and herbs; simmer 15–20 minutes.', 'Cook pasta, toss with the sauce and top with parmesan.'],
  },
  {
    id: 'chicken-stir-fry', slot: 'dinner', name: 'Garlic chicken stir-fry with rice', mins: 20,
    items: [['chicken', 160, 'p'], ['whiteRice', 180, 'c'], ['stirFryVeg', 200, 'v'], ['soySauce', 15, 'v'], ['garlic', 5, 'v'], ['oliveOil', 8, 'f']],
    extras: 'Ginger, chilli, spring onion',
    steps: ['Slice chicken thinly and stir-fry in hot oil until browned.', 'Add garlic, ginger and vegetables; toss 3–4 minutes.', 'Add soy sauce and a splash of water to coat.', 'Serve over rice with spring onion.'],
  },
  {
    id: 'satay-tofu', slot: 'dinner', name: 'Satay tofu & veg with brown rice', mins: 25,
    items: [['tofu', 200, 'p'], ['brownRice', 180, 'c'], ['stirFryVeg', 200, 'v'], ['soySauce', 15, 'v'], ['peanutButter', 15, 'f'], ['lemon', 10, 'v']],
    extras: 'Garlic, chilli, hot water to loosen sauce',
    steps: ['Cube tofu and pan-fry until golden on all sides.', 'Stir-fry the vegetables for 3–4 minutes.', 'Whisk peanut butter, soy sauce, lime juice, garlic, chilli and hot water into a sauce.', 'Toss tofu and veg in the sauce; serve over rice.'],
  },
  {
    id: 'prawn-fried-rice', slot: 'dinner', name: 'Prawn & egg fried rice', mins: 20,
    items: [['prawns', 150, 'p'], ['whiteRice', 180, 'c'], ['egg', 50, 'f'], ['stirFryVeg', 150, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Garlic, ginger, spring onion',
    steps: ['Scramble the egg in a little oil; set aside.', 'Stir-fry prawns with garlic and ginger until pink; set aside.', 'Fry vegetables and rice (day-old works best) in the remaining oil.', 'Return egg and prawns, add soy sauce and toss through.'],
  },
  {
    id: 'beef-chilli', slot: 'dinner', name: 'Beef & black bean chilli with rice', mins: 35,
    items: [['beefMince', 140, 'p'], ['blackBeans', 100, 'c'], ['brownRice', 120, 'c'], ['passata', 200, 'v'], ['onion', 60, 'v'], ['capsicum', 80, 'v'], ['cheddar', 15, 'f']],
    extras: 'Chilli powder, cumin, smoked paprika, garlic',
    steps: ['Brown the mince with onion and capsicum.', 'Add garlic and spices; cook 1 minute.', 'Stir in passata and beans; simmer 15–20 minutes.', 'Serve over rice topped with grated cheese.'],
  },
  {
    id: 'baked-fish', slot: 'dinner', name: 'Herb-baked fish with crispy potatoes', mins: 40,
    items: [['cod', 180, 'p'], ['potato', 250, 'c'], ['broccoli', 100, 'v'], ['greenBeans', 80, 'v'], ['oliveOil', 10, 'f'], ['lemon', 10, 'v']],
    extras: 'Parsley, garlic, paprika, salt',
    steps: ['Cube potatoes, toss with most of the oil and paprika; roast at 210°C for 30 minutes.', 'Place fish on a tray, drizzle with remaining oil, lemon, garlic and parsley; bake 12 minutes.', 'Steam broccoli and beans.', 'Serve together with extra lemon.'],
  },
  {
    id: 'chicken-traybake', slot: 'dinner', name: 'Chicken, sweet potato & feta traybake', mins: 40,
    items: [['chicken', 160, 'p'], ['sweetPotato', 200, 'c'], ['zucchini', 100, 'v'], ['capsicum', 100, 'v'], ['onion', 50, 'v'], ['oliveOil', 8, 'f'], ['feta', 20, 'f']],
    extras: 'Oregano, smoked paprika, salt, pepper',
    steps: ['Chop sweet potato, zucchini, capsicum and onion; toss with oil and spices on a tray.', 'Nestle in the seasoned chicken.', 'Roast at 200°C for 30–35 minutes until chicken is cooked through.', 'Crumble over feta to serve.'],
  },
  {
    id: 'lentil-bolognese', slot: 'dinner', name: 'Lentil & mushroom bolognese', mins: 30,
    items: [['pasta', 80, 'c'], ['lentils', 180, 'p'], ['passata', 200, 'v'], ['mushrooms', 100, 'v'], ['onion', 60, 'v'], ['garlic', 5, 'v'], ['oliveOil', 8, 'f']],
    extras: 'Dried oregano, basil, chilli flakes, salt, pepper',
    steps: ['Soften diced onion, garlic and chopped mushrooms in the oil.', 'Add lentils, passata and herbs; simmer 15 minutes until thick.', 'Cook pasta and toss through the sauce.'],
  },
  {
    id: 'tofu-chickpea-traybake', slot: 'dinner', name: 'Smoky tofu & chickpea traybake', mins: 40,
    items: [['tofu', 200, 'p'], ['sweetPotato', 180, 'c'], ['chickpeas', 80, 'c'], ['zucchini', 100, 'v'], ['capsicum', 100, 'v'], ['oliveOil', 8, 'f'], ['spinach', 40, 'v']],
    extras: 'Smoked paprika, cumin, garlic powder, salt',
    steps: ['Cube tofu and sweet potato; chop zucchini and capsicum.', 'Toss everything except spinach with oil and spices on a tray, including drained chickpeas.', 'Roast at 210°C for 30–35 minutes, turning once.', 'Fold through spinach to wilt before serving.'],
  },

  // ---------- Breakfast (set 2) ----------
  {
    id: 'choc-protein-porridge', slot: 'breakfast', name: 'Chocolate peanut protein porridge', mins: 8,
    items: [['oats', 50, 'c'], ['milk', 250, 'v'], ['whey', 25, 'p'], ['cocoa', 8, 'v'], ['banana', 60, 'c'], ['peanutButter', 10, 'f']],
    extras: 'Pinch of salt',
    steps: ['Simmer oats in the milk for 4–5 minutes, stirring, until creamy.', 'Take off the heat and whisk in protein powder and cocoa (add a splash of water if thick).', 'Top with sliced banana and a swirl of peanut butter.'],
  },
  {
    id: 'mango-yogurt-bowl', slot: 'breakfast', name: 'Mango & chia yoghurt bowl', mins: 5,
    items: [['greekYogurt', 250, 'p'], ['mango', 120, 'c'], ['granola', 30, 'c'], ['chia', 10, 'f']],
    extras: 'Lime zest',
    steps: ['Dice the mango.', 'Spoon yoghurt into a bowl and top with mango, granola and chia seeds.', 'Finish with a little lime zest.'],
  },
  {
    id: 'turkey-breakfast-tacos', slot: 'breakfast', name: 'Turkey & egg breakfast tacos', mins: 15,
    items: [['cornTortilla', 52, 'c'], ['turkeyMince', 80, 'p'], ['egg', 50, 'f'], ['capsicum', 50, 'v'], ['spinach', 30, 'v'], ['avocado', 30, 'f']],
    extras: 'Smoked paprika, cumin, hot sauce',
    steps: ['Brown the turkey mince with paprika and cumin, breaking it up.', 'Add diced capsicum and spinach; cook 2 minutes.', 'Push to one side and scramble the egg in the same pan.', 'Warm tortillas and fill with turkey, egg and sliced avocado.'],
  },
  {
    id: 'cottage-cheese-pancakes', slot: 'breakfast', name: 'Cottage cheese & oat pancakes', mins: 15,
    items: [['cottage', 150, 'p'], ['oats', 50, 'c'], ['egg', 50, 'f'], ['blueberries', 80, 'v'], ['honey', 10, 'c']],
    extras: '½ tsp baking powder, vanilla, cooking spray',
    steps: ['Blend cottage cheese, oats, egg, baking powder and vanilla until smooth.', 'Cook small pancakes in a sprayed non-stick pan, about 2 minutes per side.', 'Serve with blueberries and a drizzle of honey.'],
  },
  {
    id: 'salmon-scramble-ricecakes', slot: 'breakfast', name: 'Smoked salmon scramble on rice cakes', mins: 10,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['smokedSalmon', 50, 'p'], ['riceCakes', 30, 'c'], ['spinach', 30, 'v']],
    extras: 'Chives, cracked pepper',
    steps: ['Whisk eggs and egg whites with pepper.', 'Wilt spinach in a non-stick pan, then add the eggs and stir gently until just set.', 'Fold through torn smoked salmon and chives.', 'Pile onto rice cakes.'],
  },
  {
    id: 'pb-banana-toast', slot: 'breakfast', name: 'Peanut butter banana toast with yoghurt', mins: 5,
    items: [['bread', 80, 'c'], ['peanutButter', 15, 'f'], ['banana', 80, 'c'], ['greekYogurt', 150, 'p']],
    extras: 'Cinnamon',
    steps: ['Toast the bread and spread with peanut butter.', 'Top with sliced banana and a dusting of cinnamon.', 'Serve with a bowl of Greek yoghurt on the side.'],
  },
  {
    id: 'pumpkin-spice-oats', slot: 'breakfast', name: 'Pumpkin spice overnight oats', mins: 10,
    items: [['oats', 50, 'c'], ['pumpkin', 80, 'v'], ['greekYogurt', 150, 'p'], ['milk', 120, 'v'], ['almonds', 12, 'f'], ['honey', 8, 'c']],
    extras: 'Cinnamon, nutmeg, ginger',
    steps: ['Microwave diced pumpkin with a splash of water for 4–5 minutes until soft, then mash.', 'Stir mashed pumpkin, oats, yoghurt, milk, honey and spices together in a jar.', 'Refrigerate overnight and top with chopped almonds.'],
  },
  {
    id: 'tofu-breakfast-wrap', slot: 'breakfast', name: 'Tofu scramble breakfast wrap', mins: 15,
    items: [['wrap', 60, 'c'], ['tofu', 150, 'p'], ['capsicum', 50, 'v'], ['spinach', 30, 'v'], ['avocado', 40, 'f'], ['passata', 30, 'v']],
    extras: 'Turmeric, smoked paprika, garlic powder',
    steps: ['Crumble tofu into a non-stick pan with the spices and cook for 5 minutes.', 'Add diced capsicum and spinach; cook until soft.', 'Warm the wrap, spread with passata, fill with the scramble and avocado, and roll up.'],
  },

  // ---------- Lunch (set 2) ----------
  {
    id: 'chicken-noodle-salad', slot: 'lunch', name: 'Chicken rice-noodle salad with peanut dressing', mins: 20,
    items: [['chicken', 140, 'p'], ['riceNoodles', 150, 'c'], ['carrot', 50, 'v'], ['cucumber', 60, 'v'], ['saladLeaves', 30, 'v'], ['peanutButter', 12, 'f'], ['lemon', 10, 'v'], ['soySauce', 10, 'v']],
    extras: 'Fresh mint, coriander, chilli',
    steps: ['Poach or grill the chicken, then shred.', 'Soak or boil the noodles per the packet; rinse under cold water.', 'Whisk peanut butter, lime juice, soy sauce and a little warm water into a dressing.', 'Toss noodles, grated carrot, cucumber, leaves and herbs with the chicken and dressing.'],
  },
  {
    id: 'turkey-taco-bowl', slot: 'lunch', name: 'Turkey taco rice bowl', mins: 20,
    items: [['turkeyMince', 130, 'p'], ['brownRice', 150, 'c'], ['corn', 60, 'c'], ['capsicum', 50, 'v'], ['cherryTomato', 60, 'v'], ['avocado', 40, 'f'], ['lemon', 10, 'v']],
    extras: 'Taco spice (cumin, paprika, oregano, chilli)',
    steps: ['Brown the turkey mince with the taco spices and a splash of water.', 'Warm the rice and corn.', 'Build bowls with rice, turkey, corn, capsicum, tomatoes and avocado.', 'Squeeze over lime juice.'],
  },
  {
    id: 'tuna-corn-pasta-salad', slot: 'lunch', name: 'Tuna, corn & spinach pasta salad', mins: 15,
    items: [['pasta', 70, 'c'], ['tuna', 120, 'p'], ['corn', 50, 'v'], ['cherryTomato', 60, 'v'], ['greekYogurt', 50, 'v'], ['oliveOil', 6, 'f'], ['spinach', 30, 'v']],
    extras: 'Lemon zest, dill, salt, pepper',
    steps: ['Cook pasta, then cool under cold water.', 'Mix yoghurt, olive oil, lemon zest, dill and seasoning into a dressing.', 'Toss pasta with tuna, corn, halved tomatoes, spinach and the dressing.'],
  },
  {
    id: 'prawn-mango-quinoa', slot: 'lunch', name: 'Prawn, mango & quinoa salad', mins: 20,
    items: [['prawns', 140, 'p'], ['quinoa', 130, 'c'], ['mango', 80, 'c'], ['cucumber', 60, 'v'], ['saladLeaves', 30, 'v'], ['avocado', 40, 'f'], ['lemon', 10, 'v']],
    extras: 'Chilli flakes, coriander',
    steps: ['Pan-fry prawns for 2–3 minutes until pink.', 'Dice mango, cucumber and avocado.', 'Toss quinoa, leaves, mango and cucumber with lime juice.', 'Top with prawns, avocado, chilli and coriander.'],
  },
  {
    id: 'pork-noodle-stir-fry', slot: 'lunch', name: 'Pork & veg rice-noodle stir-fry', mins: 20,
    items: [['porkLoin', 140, 'p'], ['riceNoodles', 160, 'c'], ['stirFryVeg', 150, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f'], ['garlic', 5, 'v']],
    extras: 'Ginger, chilli, spring onion',
    steps: ['Slice pork thinly and stir-fry in hot oil until browned; set aside.', 'Stir-fry vegetables with garlic and ginger for 3 minutes.', 'Add noodles, pork and soy sauce; toss until hot.', 'Finish with spring onion.'],
  },
  {
    id: 'chicken-caesar-wrap', slot: 'lunch', name: 'Chicken caesar-style wrap', mins: 15,
    items: [['wrap', 60, 'c'], ['chicken', 120, 'p'], ['saladLeaves', 40, 'v'], ['parmesan', 10, 'f'], ['greekYogurt', 40, 'v'], ['lemon', 5, 'v']],
    extras: 'Garlic powder, Dijon mustard, pepper',
    steps: ['Grill and slice the chicken.', 'Mix yoghurt, lemon juice, a little mustard, garlic powder and grated parmesan into a creamy dressing.', 'Toss leaves in the dressing, then fill the wrap with leaves and chicken and roll up.'],
  },
  {
    id: 'pumpkin-lentil-feta-salad', slot: 'lunch', name: 'Roast pumpkin, lentil & feta salad', mins: 35,
    items: [['lentils', 150, 'p'], ['pumpkin', 200, 'c'], ['spinach', 40, 'v'], ['feta', 30, 'f'], ['oliveOil', 6, 'f'], ['lemon', 10, 'v']],
    extras: 'Cumin, salt, pepper',
    steps: ['Cube pumpkin, toss with half the oil and cumin, and roast at 200°C for 25 minutes.', 'Whisk the remaining oil with lemon juice and seasoning.', 'Toss lentils, spinach and warm pumpkin with the dressing.', 'Crumble over feta.'],
  },
  {
    id: 'chickpea-hummus-bowl', slot: 'lunch', name: 'Smashed chickpea & hummus quinoa bowl', mins: 15,
    items: [['chickpeas', 120, 'p'], ['quinoa', 120, 'c'], ['cucumber', 60, 'v'], ['cherryTomato', 60, 'v'], ['hummus', 40, 'f'], ['saladLeaves', 30, 'v'], ['lemon', 10, 'v']],
    extras: 'Smoked paprika, parsley',
    steps: ['Roughly smash chickpeas with lemon juice, paprika and a pinch of salt.', 'Arrange quinoa, leaves, cucumber and tomatoes in a bowl.', 'Top with the smashed chickpeas and a spoonful of hummus.'],
  },

  // ---------- Snacks (set 2) ----------
  {
    id: 'choc-peanut-bites', slot: 'snack', name: 'Choc peanut protein bites', mins: 10,
    items: [['oats', 30, 'c'], ['whey', 20, 'p'], ['peanutButter', 15, 'f'], ['honey', 10, 'c'], ['cocoa', 5, 'v']],
    extras: 'Splash of milk or water to bind',
    steps: ['Mix everything in a bowl, adding liquid a teaspoon at a time until it holds together.', 'Roll into small balls.', 'Chill for 20 minutes (keeps 5 days in the fridge).'],
  },
  {
    id: 'cottage-pineapple', slot: 'snack', name: 'Cottage cheese with pineapple & almonds', mins: 2,
    items: [['cottage', 180, 'p'], ['pineapple', 100, 'c'], ['almonds', 8, 'f']],
    extras: '',
    steps: ['Spoon cottage cheese into a bowl.', 'Top with pineapple pieces and chopped almonds.'],
  },
  {
    id: 'turkey-roll-ups', slot: 'snack', name: 'Turkey, mozzarella & cucumber roll-ups', mins: 5,
    items: [['turkey', 100, 'p'], ['mozzarella', 20, 'f'], ['cucumber', 80, 'v'], ['riceCakes', 20, 'c']],
    extras: 'Mustard (optional)',
    steps: ['Lay out turkey slices and sprinkle with mozzarella.', 'Add cucumber sticks and roll up tightly.', 'Serve with rice cakes.'],
  },
  {
    id: 'mango-lassi', slot: 'snack', name: 'Mango protein lassi', mins: 5,
    items: [['greekYogurt', 200, 'p'], ['mango', 120, 'c'], ['milk', 100, 'v'], ['chia', 5, 'f']],
    extras: 'Cardamom, ice',
    steps: ['Blend yoghurt, mango, milk, cardamom and ice until smooth.', 'Pour and sprinkle with chia seeds.'],
  },
  {
    id: 'choc-yogurt-pot', slot: 'snack', name: 'Chocolate yoghurt pot with strawberries', mins: 3,
    items: [['greekYogurt', 200, 'p'], ['cocoa', 6, 'v'], ['honey', 10, 'c'], ['strawberries', 100, 'v'], ['almonds', 10, 'f']],
    extras: '',
    steps: ['Stir cocoa and honey through the yoghurt until smooth.', 'Top with sliced strawberries and chopped almonds.'],
  },
  {
    id: 'veggie-egg-muffins', slot: 'snack', name: 'Veggie egg muffins', mins: 25,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['capsicum', 40, 'v'], ['spinach', 30, 'v'], ['mozzarella', 15, 'f'], ['riceCakes', 20, 'c']],
    extras: 'Salt, pepper, cooking spray',
    steps: ['Whisk eggs and egg whites with seasoning.', 'Divide diced capsicum, spinach and mozzarella between sprayed muffin holes; pour over the egg.', 'Bake at 180°C for 18–20 minutes.', 'Serve with rice cakes (muffins keep 4 days in the fridge).'],
  },
  {
    id: 'vegan-choc-smoothie', slot: 'snack', name: 'Vegan chocolate banana smoothie', mins: 5,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 25, 'p'], ['banana', 100, 'c'], ['cocoa', 6, 'v'], ['peanutButter', 8, 'f']],
    extras: 'Ice',
    steps: ['Blend everything with ice until smooth.'],
  },
  {
    id: 'edamame-carrot-hummus', slot: 'snack', name: 'Edamame, carrot sticks & hummus', mins: 5,
    items: [['edamame', 100, 'p'], ['carrot', 100, 'v'], ['hummus', 40, 'f'], ['riceCakes', 20, 'c']],
    extras: 'Sea salt, chilli flakes',
    steps: ['Steam or microwave the edamame and season.', 'Cut carrots into sticks.', 'Serve with hummus and rice cakes.'],
  },

  // ---------- Dinner (set 2) ----------
  {
    id: 'turkey-meatball-pasta', slot: 'dinner', name: 'Turkey meatballs in tomato sauce with pasta', mins: 35,
    items: [['turkeyMince', 150, 'p'], ['pasta', 75, 'c'], ['passata', 200, 'v'], ['onion', 40, 'v'], ['garlic', 5, 'v'], ['parmesan', 10, 'f'], ['spinach', 40, 'v']],
    extras: 'Dried oregano, basil, chilli flakes',
    steps: ['Mix turkey mince with half the garlic, oregano and seasoning; roll into small meatballs.', 'Brown meatballs in a non-stick pan, then add diced onion and the rest of the garlic.', 'Pour in passata and simmer 12 minutes; stir through spinach.', 'Serve over pasta with parmesan.'],
  },
  {
    id: 'pork-pineapple-rice', slot: 'dinner', name: 'Sweet & sour pork with pineapple rice', mins: 25,
    items: [['porkLoin', 150, 'p'], ['whiteRice', 170, 'c'], ['pineapple', 80, 'c'], ['capsicum', 80, 'v'], ['onion', 40, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 8, 'f']],
    extras: '1 tbsp vinegar, 1 tsp cornflour, ginger',
    steps: ['Stir-fry sliced pork in the oil until browned.', 'Add capsicum and onion; cook 3 minutes.', 'Mix soy sauce, vinegar, cornflour, ginger and a splash of pineapple juice; add with the pineapple and simmer until glossy.', 'Serve over rice.'],
  },
  {
    id: 'chicken-fajitas', slot: 'dinner', name: 'Chicken fajitas with corn tortillas', mins: 25,
    items: [['chicken', 150, 'p'], ['cornTortilla', 78, 'c'], ['capsicum', 120, 'v'], ['onion', 60, 'v'], ['avocado', 40, 'f'], ['greekYogurt', 40, 'v'], ['lemon', 10, 'v']],
    extras: 'Fajita spice (paprika, cumin, garlic, chilli)',
    steps: ['Slice chicken, capsicum and onion into strips and toss with the spice.', 'Cook in a hot pan until chicken is done and veg is charred at the edges.', 'Warm tortillas and fill with the chicken mix, avocado and a dollop of yoghurt.', 'Squeeze over lime.'],
  },
  {
    id: 'chicken-cauli-fried-rice', slot: 'dinner', name: 'Chicken cauliflower fried rice', mins: 25,
    items: [['chicken', 150, 'p'], ['cauliflower', 200, 'v'], ['whiteRice', 80, 'c'], ['egg', 50, 'f'], ['carrot', 50, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Garlic, ginger, spring onion',
    steps: ['Pulse cauliflower in a food processor until rice-sized (or grate it).', 'Stir-fry diced chicken in the oil until cooked; push aside and scramble the egg.', 'Add cauliflower, rice, diced carrot, garlic and ginger; stir-fry 5 minutes.', 'Season with soy sauce and top with spring onion.'],
  },
  {
    id: 'teriyaki-salmon-noodles', slot: 'dinner', name: 'Teriyaki-style salmon noodle bowl', mins: 25,
    items: [['salmon', 140, 'p'], ['riceNoodles', 150, 'c'], ['broccoli', 100, 'v'], ['carrot', 50, 'v'], ['soySauce', 15, 'v'], ['honey', 8, 'c'], ['oliveOil', 4, 'f']],
    extras: 'Ginger, garlic, sesame seeds (optional)',
    steps: ['Mix soy sauce, honey, grated ginger and garlic into a glaze.', 'Pan-fry salmon in the oil for 3 minutes per side, then brush with glaze for the last minute.', 'Steam broccoli and carrot; cook noodles per the packet.', 'Serve salmon over noodles and veg with any remaining glaze.'],
  },
  {
    id: 'beef-broccoli-stir-fry', slot: 'dinner', name: 'Beef & broccoli garlic stir-fry', mins: 20,
    items: [['beefMince', 150, 'p'], ['brownRice', 160, 'c'], ['broccoli', 150, 'v'], ['soySauce', 15, 'v'], ['garlic', 5, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Ginger, chilli, spring onion',
    steps: ['Brown the beef mince in the oil, breaking it up.', 'Add broccoli florets, garlic and ginger with a splash of water; cover for 3 minutes.', 'Stir in soy sauce and toss.', 'Serve over rice with spring onion.'],
  },
  {
    id: 'stuffed-sweet-potato', slot: 'dinner', name: 'Black bean & cheese stuffed sweet potato', mins: 45,
    items: [['sweetPotato', 250, 'c'], ['blackBeans', 120, 'p'], ['corn', 50, 'v'], ['mozzarella', 30, 'f'], ['cherryTomato', 60, 'v'], ['greekYogurt', 40, 'v']],
    extras: 'Cumin, smoked paprika, coriander',
    steps: ['Prick sweet potato and bake at 200°C for 40 minutes (or microwave 8–10 minutes) until soft.', 'Warm beans and corn with the spices.', 'Split the potato, pile in the beans, top with mozzarella and grill until melted.', 'Finish with tomatoes, yoghurt and coriander.'],
  },
  {
    id: 'pumpkin-tofu-curry', slot: 'dinner', name: 'Pumpkin, tofu & chickpea curry', mins: 35,
    items: [['tofu', 150, 'p'], ['pumpkin', 200, 'v'], ['chickpeas', 80, 'c'], ['brownRice', 120, 'c'], ['coconutMilk', 100, 'f'], ['spinach', 50, 'v'], ['onion', 40, 'v']],
    extras: 'Curry powder, garlic, ginger',
    steps: ['Soften diced onion with garlic and ginger in a splash of water; stir in curry powder.', 'Add cubed pumpkin, coconut milk and a little water; simmer 15 minutes.', 'Add cubed tofu and chickpeas; simmer 5 minutes, then stir through spinach.', 'Serve over rice.'],
  },
];
