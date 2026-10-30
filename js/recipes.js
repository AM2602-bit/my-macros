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
    extras: 'Sesame seeds, spring onion, sriracha',
    steps: ['Bake or pan-sear the salmon until just cooked; flake into chunks.', 'Toss salmon in soy sauce.', 'Arrange rice, salmon, edamame, cucumber and avocado in a bowl.', 'Finish with sesame seeds, spring onion and sriracha.'],
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
];
