// Base recipes. Each ingredient is [foodKey, grams, role]:
//   p = protein source, c = carb source, f = fat source — scaled independently
//       by the planner to fit the user's macros;
//   v = vegetables/flavour — kept at the base amount.
// Steps avoid quantities so they read correctly at any portion size.
// cuisine: shown on meal cards (e.g. 'Thai · 25 min').
window.RECIPES = [
  // ---------- Breakfast ----------
  {
    id: 'overnight-oats', slot: 'breakfast', cuisine: 'Everyday', name: 'Blueberry protein overnight oats', mins: 5,
    items: [['oats', 60, 'c'], ['whey', 25, 'p'], ['milk', 200, 'v'], ['chia', 10, 'f'], ['blueberries', 75, 'v']],
    extras: 'Pinch of cinnamon',
    steps: ['Stir oats, protein powder, chia and cinnamon together in a jar.', 'Pour in the milk, mix well, cover and refrigerate overnight.', 'Top with blueberries in the morning.'],
  },
  {
    id: 'veggie-omelette', slot: 'breakfast', cuisine: 'French', name: 'Spinach & mushroom omelette with toast', mins: 15,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['spinach', 40, 'v'], ['mushrooms', 60, 'v'], ['oliveOil', 4, 'v'], ['bread', 80, 'c']],
    extras: 'Salt, pepper, chives',
    steps: ['Whisk eggs and egg whites with salt and pepper.', 'Sauté mushrooms in the oil until golden, then wilt in the spinach.', 'Pour over the eggs and cook gently until just set; fold.', 'Serve with toasted bread.'],
  },
  {
    id: 'yogurt-parfait', slot: 'breakfast', cuisine: 'Everyday', name: 'Greek yoghurt berry parfait', mins: 5,
    items: [['greekYogurt', 250, 'p'], ['granola', 40, 'c'], ['honey', 10, 'c'], ['strawberries', 100, 'v'], ['almonds', 15, 'f']],
    extras: '',
    steps: ['Slice the strawberries and roughly chop the almonds.', 'Layer yoghurt, granola and strawberries in a glass or bowl.', 'Finish with almonds and a drizzle of honey.'],
  },
  {
    id: 'salmon-avo-toast', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Smoked salmon & avocado toast', mins: 10,
    items: [['bread', 80, 'c'], ['smokedSalmon', 80, 'p'], ['avocado', 50, 'f'], ['egg', 50, 'v'], ['lemon', 5, 'v'], ['spinach', 20, 'v']],
    extras: 'Cracked pepper, chilli flakes',
    steps: ['Toast the bread and poach the egg (3–4 minutes in simmering water).', 'Mash avocado with lemon juice and pepper; spread on toast.', 'Top with spinach, smoked salmon and the poached egg.'],
  },
  {
    id: 'banana-pancakes', slot: 'breakfast', cuisine: 'American', name: 'Banana oat protein pancakes', mins: 20,
    items: [['oats', 50, 'c'], ['banana', 100, 'c'], ['egg', 50, 'f'], ['eggWhite', 100, 'p'], ['whey', 15, 'p'], ['greekYogurt', 80, 'v'], ['blueberries', 50, 'v']],
    extras: 'Cinnamon, ½ tsp baking powder, cooking spray',
    steps: ['Blend oats, banana, egg, egg whites, protein powder, cinnamon and baking powder into a batter.', 'Cook small pancakes in a lightly sprayed non-stick pan, about 2 minutes per side.', 'Serve topped with yoghurt and blueberries.'],
  },
  {
    id: 'breakfast-burrito', slot: 'breakfast', cuisine: 'Mexican', name: 'Egg & black bean breakfast burrito', mins: 15,
    items: [['wrap', 60, 'c'], ['egg', 100, 'f'], ['eggWhite', 80, 'p'], ['blackBeans', 60, 'c'], ['cheddar', 15, 'f'], ['capsicum', 50, 'v'], ['passata', 30, 'v']],
    extras: 'Smoked paprika, cumin, hot sauce',
    steps: ['Soften diced capsicum in a non-stick pan; add beans and spices to warm through.', 'Add whisked eggs and egg whites and scramble until just set.', 'Warm the wrap, fill with the egg mix, cheese and passata (or salsa), then roll up.'],
  },
  {
    id: 'tofu-scramble', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Tofu scramble on toast', mins: 15,
    items: [['tofu', 200, 'p'], ['bread', 80, 'c'], ['spinach', 50, 'v'], ['cherryTomato', 80, 'v'], ['oliveOil', 5, 'f'], ['avocado', 40, 'f']],
    extras: 'Turmeric, garlic powder, salt, pepper',
    steps: ['Crumble the tofu and fry in the oil with turmeric, garlic powder, salt and pepper for 5 minutes.', 'Add halved tomatoes and spinach; cook until wilted.', 'Serve on toast with sliced avocado.'],
  },
  {
    id: 'pb-smoothie', slot: 'breakfast', cuisine: 'Everyday', name: 'Peanut butter banana smoothie', mins: 5,
    items: [['milk', 300, 'v'], ['banana', 120, 'c'], ['oats', 30, 'c'], ['whey', 30, 'p'], ['peanutButter', 15, 'f']],
    extras: 'Handful of ice',
    steps: ['Add everything to a blender with the ice.', 'Blend until smooth and serve straight away.'],
  },
  {
    id: 'sweet-potato-hash', slot: 'breakfast', cuisine: 'American', name: 'Sweet potato & capsicum hash with eggs', mins: 20,
    items: [['sweetPotato', 150, 'c'], ['egg', 100, 'f'], ['eggWhite', 80, 'p'], ['capsicum', 60, 'v'], ['spinach', 40, 'v'], ['oliveOil', 5, 'v']],
    extras: 'Smoked paprika, salt, pepper',
    steps: ['Dice sweet potato small and fry in the oil with paprika for 10–12 minutes until tender.', 'Add diced capsicum and spinach; cook 2 minutes.', 'Make wells, crack in the eggs, pour egg whites around and cover until set.'],
  },
  {
    id: 'chia-pudding', slot: 'breakfast', cuisine: 'Everyday', name: 'Berry chia protein pudding', mins: 5,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 25, 'p'], ['chia', 20, 'f'], ['banana', 80, 'c'], ['blueberries', 80, 'c'], ['strawberries', 60, 'v']],
    extras: 'Vanilla, cinnamon',
    steps: ['Whisk soy milk, protein powder, vanilla and cinnamon until smooth.', 'Stir in chia seeds and mashed banana; refrigerate at least 2 hours or overnight.', 'Top with blueberries and sliced strawberries.'],
  },
  {
    id: 'vegan-pb-smoothie', slot: 'breakfast', cuisine: 'Everyday', name: 'Vegan peanut butter oat smoothie', mins: 5,
    items: [['soyMilk', 300, 'v'], ['banana', 120, 'c'], ['oats', 30, 'c'], ['plantProtein', 30, 'p'], ['peanutButter', 15, 'f']],
    extras: 'Handful of ice, cinnamon',
    steps: ['Add everything to a blender with the ice.', 'Blend until smooth and serve straight away.'],
  },

  // ---------- Lunch ----------
  {
    id: 'chicken-burrito-bowl', slot: 'lunch', cuisine: 'Mexican', name: 'Chicken burrito bowl', mins: 25,
    items: [['chicken', 150, 'p'], ['brownRice', 150, 'c'], ['blackBeans', 80, 'c'], ['capsicum', 60, 'v'], ['cherryTomato', 60, 'v'], ['avocado', 50, 'f'], ['lemon', 10, 'v']],
    extras: 'Cumin, smoked paprika, chilli, coriander',
    steps: ['Season chicken with the spices and pan-fry or grill until cooked through; slice.', 'Warm the rice and beans.', 'Build a bowl with rice, beans, chicken, capsicum, tomatoes and avocado.', 'Squeeze over lime juice and scatter with coriander.'],
  },
  {
    id: 'tuna-quinoa-salad', slot: 'lunch', cuisine: 'Mediterranean', name: 'Tuna, quinoa & feta salad', mins: 15,
    items: [['tuna', 120, 'p'], ['quinoa', 150, 'c'], ['cucumber', 80, 'v'], ['cherryTomato', 80, 'v'], ['saladLeaves', 40, 'v'], ['feta', 30, 'f'], ['oliveOil', 8, 'f'], ['lemon', 10, 'v']],
    extras: 'Salt, pepper, dried oregano',
    steps: ['Whisk olive oil, lemon juice, oregano, salt and pepper into a dressing.', 'Toss quinoa, leaves, diced cucumber and halved tomatoes with the dressing.', 'Top with flaked tuna and crumbled feta.'],
  },
  {
    id: 'turkey-hummus-wrap', slot: 'lunch', cuisine: 'Middle Eastern', name: 'Turkey & hummus wrap with apple', mins: 10,
    items: [['wrap', 60, 'c'], ['turkey', 100, 'p'], ['hummus', 40, 'f'], ['saladLeaves', 30, 'v'], ['cucumber', 50, 'v'], ['cherryTomato', 50, 'v'], ['apple', 150, 'c']],
    extras: 'Cracked pepper',
    steps: ['Spread hummus over the wrap.', 'Layer turkey, leaves, sliced cucumber and tomatoes; season and roll tightly.', 'Serve with the apple on the side.'],
  },
  {
    id: 'chicken-veg-pasta', slot: 'lunch', cuisine: 'Italian', name: 'Chicken & vegetable tomato pasta', mins: 25,
    items: [['pasta', 70, 'c'], ['chicken', 130, 'p'], ['passata', 150, 'v'], ['zucchini', 80, 'v'], ['mushrooms', 60, 'v'], ['oliveOil', 6, 'f'], ['parmesan', 12, 'f']],
    extras: 'Garlic, basil, chilli flakes',
    steps: ['Cook pasta until al dente.', 'Brown diced chicken in the oil, then add zucchini, mushrooms and garlic.', 'Pour in passata with basil and chilli; simmer 5 minutes.', 'Toss with the pasta and top with parmesan.'],
  },
  {
    id: 'chickpea-lentil-curry', slot: 'lunch', cuisine: 'Indian', name: 'Chickpea & lentil curry with rice', mins: 30,
    items: [['lentils', 150, 'p'], ['chickpeas', 100, 'c'], ['brownRice', 120, 'c'], ['coconutMilk', 100, 'f'], ['passata', 100, 'v'], ['onion', 50, 'v'], ['spinach', 50, 'v']],
    extras: 'Curry powder, garlic, ginger, salt',
    steps: ['Soften diced onion with garlic and ginger in a splash of water.', 'Stir in curry powder for 1 minute, then add passata, coconut milk, lentils and chickpeas.', 'Simmer 10–15 minutes; stir through spinach until wilted.', 'Serve over rice.'],
  },
  {
    id: 'salmon-poke', slot: 'lunch', cuisine: 'Japanese', name: 'Salmon poke bowl', mins: 20,
    items: [['salmon', 130, 'p'], ['whiteRice', 150, 'c'], ['edamame', 60, 'v'], ['cucumber', 60, 'v'], ['avocado', 40, 'f'], ['soySauce', 15, 'v']],
    extras: 'Spring onion, sriracha',
    steps: ['Bake or pan-sear the salmon until just cooked; flake into chunks.', 'Toss salmon in soy sauce.', 'Arrange rice, salmon, edamame, cucumber and avocado in a bowl.', 'Finish with spring onion and sriracha.'],
  },
  {
    id: 'tofu-quinoa-bowl', slot: 'lunch', cuisine: 'Asian', name: 'Crispy tofu & quinoa power bowl', mins: 25,
    items: [['tofu', 180, 'p'], ['quinoa', 150, 'c'], ['broccoli', 80, 'v'], ['capsicum', 60, 'v'], ['saladLeaves', 30, 'v'], ['peanutButter', 12, 'f'], ['soySauce', 10, 'v'], ['lemon', 10, 'v']],
    extras: 'Garlic, chilli, water to loosen sauce',
    steps: ['Cube tofu and bake at 200°C (or air-fry) for 20 minutes until crisp.', 'Steam broccoli; slice capsicum.', 'Whisk peanut butter, soy sauce, lime juice, garlic and a little water into a sauce.', 'Assemble quinoa, veg and tofu; drizzle with the sauce.'],
  },

  // ---------- Snacks ----------
  {
    id: 'yogurt-berries', slot: 'snack', cuisine: 'Everyday', name: 'Greek yoghurt with berries & almonds', mins: 2,
    items: [['greekYogurt', 200, 'p'], ['blueberries', 80, 'c'], ['honey', 8, 'c'], ['almonds', 10, 'f']],
    extras: '',
    steps: ['Spoon yoghurt into a bowl.', 'Top with blueberries, chopped almonds and honey.'],
  },
  {
    id: 'apple-pb-shake', slot: 'snack', cuisine: 'Everyday', name: 'Apple & peanut butter with protein shake', mins: 3,
    items: [['apple', 150, 'c'], ['peanutButter', 20, 'f'], ['whey', 25, 'p']],
    extras: 'Water or ice for the shake',
    steps: ['Shake protein powder with cold water.', 'Slice the apple and serve with peanut butter for dipping.'],
  },
  {
    id: 'rice-cake-cottage', slot: 'snack', cuisine: 'Everyday', name: 'Rice cakes with cottage cheese & tomato', mins: 3,
    items: [['riceCakes', 20, 'c'], ['cottage', 150, 'p'], ['cherryTomato', 60, 'v'], ['cucumber', 40, 'v'], ['avocado', 20, 'f']],
    extras: 'Cracked pepper, chives',
    steps: ['Spread cottage cheese over the rice cakes.', 'Top with sliced tomato, cucumber and avocado; season with pepper.'],
  },
  {
    id: 'eggs-hummus-veg', slot: 'snack', cuisine: 'Middle Eastern', name: 'Boiled eggs, hummus & veggie sticks', mins: 12,
    items: [['egg', 100, 'p'], ['hummus', 50, 'f'], ['capsicum', 80, 'v'], ['cucumber', 80, 'v'], ['riceCakes', 20, 'c']],
    extras: 'Salt, pepper',
    steps: ['Boil eggs for 8–9 minutes, cool in cold water and peel.', 'Cut capsicum and cucumber into sticks.', 'Serve with hummus and rice cakes.'],
  },
  {
    id: 'berry-smoothie', slot: 'snack', cuisine: 'Everyday', name: 'Strawberry protein smoothie', mins: 5,
    items: [['milk', 250, 'v'], ['whey', 30, 'p'], ['strawberries', 100, 'v'], ['banana', 80, 'c'], ['chia', 10, 'f']],
    extras: 'Handful of ice',
    steps: ['Blend everything with the ice until smooth.'],
  },
  {
    id: 'edamame-choc', slot: 'snack', cuisine: 'Everyday', name: 'Edamame, strawberries & dark chocolate', mins: 5,
    items: [['edamame', 120, 'p'], ['strawberries', 120, 'c'], ['darkChoc', 15, 'f']],
    extras: 'Sea salt',
    steps: ['Steam or microwave the edamame and sprinkle with sea salt.', 'Serve with strawberries and a few squares of dark chocolate.'],
  },
  {
    id: 'tuna-rice-cakes', slot: 'snack', cuisine: 'Everyday', name: 'Tuna & avocado rice cakes', mins: 5,
    items: [['tuna', 90, 'p'], ['riceCakes', 30, 'c'], ['avocado', 30, 'f'], ['lemon', 5, 'v']],
    extras: 'Pepper, chilli flakes',
    steps: ['Mash avocado with lemon juice and pepper; spread over rice cakes.', 'Top with tuna and a pinch of chilli flakes.'],
  },
  {
    id: 'choc-pb-shake', slot: 'snack', cuisine: 'Everyday', name: 'Chocolate peanut butter protein shake', mins: 3,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 30, 'p'], ['banana', 80, 'c'], ['peanutButter', 10, 'f']],
    extras: '1 tsp cocoa powder, ice',
    steps: ['Blend everything with the ice until smooth.'],
  },

  // ---------- Dinner ----------
  {
    id: 'lemon-salmon', slot: 'dinner', cuisine: 'Mediterranean', name: 'Lemon garlic salmon with sweet potato & greens', mins: 35,
    items: [['salmon', 150, 'p'], ['sweetPotato', 200, 'c'], ['greenBeans', 100, 'v'], ['broccoli', 80, 'v'], ['oliveOil', 5, 'f'], ['lemon', 10, 'v'], ['garlic', 5, 'v']],
    extras: 'Salt, pepper, dill or parsley',
    steps: ['Cube sweet potato, toss with half the oil and roast at 200°C for 25 minutes.', 'Rub salmon with garlic, lemon juice and the rest of the oil; roast for the last 12–15 minutes.', 'Steam green beans and broccoli.', 'Plate up and finish with fresh herbs.'],
  },
  {
    id: 'beef-bolognese', slot: 'dinner', cuisine: 'Italian', name: 'Lean beef bolognese', mins: 35,
    items: [['pasta', 80, 'c'], ['beefMince', 150, 'p'], ['passata', 200, 'v'], ['onion', 60, 'v'], ['mushrooms', 60, 'v'], ['garlic', 5, 'v'], ['oliveOil', 5, 'f'], ['parmesan', 10, 'f']],
    extras: 'Dried oregano, basil, salt, pepper',
    steps: ['Soften diced onion, garlic and mushrooms in the oil.', 'Add mince and brown, breaking it up.', 'Stir in passata and herbs; simmer 15–20 minutes.', 'Cook pasta, toss with the sauce and top with parmesan.'],
  },
  {
    id: 'chicken-stir-fry', slot: 'dinner', cuisine: 'Chinese', name: 'Garlic chicken stir-fry with rice', mins: 20,
    items: [['chicken', 160, 'p'], ['whiteRice', 180, 'c'], ['stirFryVeg', 200, 'v'], ['soySauce', 15, 'v'], ['garlic', 5, 'v'], ['oliveOil', 8, 'f']],
    extras: 'Ginger, chilli, spring onion',
    steps: ['Slice chicken thinly and stir-fry in hot oil until browned.', 'Add garlic, ginger and vegetables; toss 3–4 minutes.', 'Add soy sauce and a splash of water to coat.', 'Serve over rice with spring onion.'],
  },
  {
    id: 'satay-tofu', slot: 'dinner', cuisine: 'Asian', name: 'Satay tofu & veg with brown rice', mins: 25,
    items: [['tofu', 200, 'p'], ['brownRice', 180, 'c'], ['stirFryVeg', 200, 'v'], ['soySauce', 15, 'v'], ['peanutButter', 15, 'f'], ['lemon', 10, 'v']],
    extras: 'Garlic, chilli, hot water to loosen sauce',
    steps: ['Cube tofu and pan-fry until golden on all sides.', 'Stir-fry the vegetables for 3–4 minutes.', 'Whisk peanut butter, soy sauce, lime juice, garlic, chilli and hot water into a sauce.', 'Toss tofu and veg in the sauce; serve over rice.'],
  },
  {
    id: 'prawn-fried-rice', slot: 'dinner', cuisine: 'Chinese', name: 'Prawn & egg fried rice', mins: 20,
    items: [['prawns', 150, 'p'], ['whiteRice', 180, 'c'], ['egg', 50, 'f'], ['stirFryVeg', 150, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Garlic, ginger, spring onion',
    steps: ['Scramble the egg in a little oil; set aside.', 'Stir-fry prawns with garlic and ginger until pink; set aside.', 'Fry vegetables and rice (day-old works best) in the remaining oil.', 'Return egg and prawns, add soy sauce and toss through.'],
  },
  {
    id: 'beef-chilli', slot: 'dinner', cuisine: 'Mexican', name: 'Beef & black bean chilli with rice', mins: 35,
    items: [['beefMince', 140, 'p'], ['blackBeans', 100, 'c'], ['brownRice', 120, 'c'], ['passata', 200, 'v'], ['onion', 60, 'v'], ['capsicum', 80, 'v'], ['cheddar', 15, 'f']],
    extras: 'Chilli powder, cumin, smoked paprika, garlic',
    steps: ['Brown the mince with onion and capsicum.', 'Add garlic and spices; cook 1 minute.', 'Stir in passata and beans; simmer 15–20 minutes.', 'Serve over rice topped with grated cheese.'],
  },
  {
    id: 'baked-fish', slot: 'dinner', cuisine: 'Mediterranean', name: 'Herb-baked fish with crispy potatoes', mins: 40,
    items: [['cod', 180, 'p'], ['potato', 250, 'c'], ['broccoli', 100, 'v'], ['greenBeans', 80, 'v'], ['oliveOil', 10, 'f'], ['lemon', 10, 'v']],
    extras: 'Parsley, garlic, paprika, salt',
    steps: ['Cube potatoes, toss with most of the oil and paprika; roast at 210°C for 30 minutes.', 'Place fish on a tray, drizzle with remaining oil, lemon, garlic and parsley; bake 12 minutes.', 'Steam broccoli and beans.', 'Serve together with extra lemon.'],
  },
  {
    id: 'chicken-traybake', slot: 'dinner', cuisine: 'Mediterranean', name: 'Chicken, sweet potato & feta traybake', mins: 40,
    items: [['chicken', 160, 'p'], ['sweetPotato', 200, 'c'], ['zucchini', 100, 'v'], ['capsicum', 100, 'v'], ['onion', 50, 'v'], ['oliveOil', 8, 'f'], ['feta', 20, 'f']],
    extras: 'Oregano, smoked paprika, salt, pepper',
    steps: ['Chop sweet potato, zucchini, capsicum and onion; toss with oil and spices on a tray.', 'Nestle in the seasoned chicken.', 'Roast at 200°C for 30–35 minutes until chicken is cooked through.', 'Crumble over feta to serve.'],
  },
  {
    id: 'lentil-bolognese', slot: 'dinner', cuisine: 'Italian', name: 'Lentil & mushroom bolognese', mins: 30,
    items: [['pasta', 80, 'c'], ['lentils', 180, 'p'], ['passata', 200, 'v'], ['mushrooms', 100, 'v'], ['onion', 60, 'v'], ['garlic', 5, 'v'], ['oliveOil', 8, 'f']],
    extras: 'Dried oregano, basil, chilli flakes, salt, pepper',
    steps: ['Soften diced onion, garlic and chopped mushrooms in the oil.', 'Add lentils, passata and herbs; simmer 15 minutes until thick.', 'Cook pasta and toss through the sauce.'],
  },
  {
    id: 'tofu-chickpea-traybake', slot: 'dinner', cuisine: 'Mediterranean', name: 'Smoky tofu & chickpea traybake', mins: 40,
    items: [['tofu', 200, 'p'], ['sweetPotato', 180, 'c'], ['chickpeas', 80, 'c'], ['zucchini', 100, 'v'], ['capsicum', 100, 'v'], ['oliveOil', 8, 'f'], ['spinach', 40, 'v']],
    extras: 'Smoked paprika, cumin, garlic powder, salt',
    steps: ['Cube tofu and sweet potato; chop zucchini and capsicum.', 'Toss everything except spinach with oil and spices on a tray, including drained chickpeas.', 'Roast at 210°C for 30–35 minutes, turning once.', 'Fold through spinach to wilt before serving.'],
  },

  // ---------- Breakfast (set 2) ----------
  {
    id: 'choc-protein-porridge', slot: 'breakfast', cuisine: 'Everyday', name: 'Chocolate peanut protein porridge', mins: 8,
    items: [['oats', 50, 'c'], ['milk', 250, 'v'], ['whey', 25, 'p'], ['cocoa', 8, 'v'], ['banana', 60, 'c'], ['peanutButter', 10, 'f']],
    extras: 'Pinch of salt',
    steps: ['Simmer oats in the milk for 4–5 minutes, stirring, until creamy.', 'Take off the heat and whisk in protein powder and cocoa (add a splash of water if thick).', 'Top with sliced banana and a swirl of peanut butter.'],
  },
  {
    id: 'mango-yogurt-bowl', slot: 'breakfast', cuisine: 'Everyday', name: 'Mango & chia yoghurt bowl', mins: 5,
    items: [['greekYogurt', 250, 'p'], ['mango', 120, 'c'], ['granola', 30, 'c'], ['chia', 10, 'f']],
    extras: 'Lime zest',
    steps: ['Dice the mango.', 'Spoon yoghurt into a bowl and top with mango, granola and chia seeds.', 'Finish with a little lime zest.'],
  },
  {
    id: 'turkey-breakfast-tacos', slot: 'breakfast', cuisine: 'Mexican', name: 'Turkey & egg breakfast tacos', mins: 15,
    items: [['cornTortilla', 52, 'c'], ['turkeyMince', 80, 'p'], ['egg', 50, 'f'], ['capsicum', 50, 'v'], ['spinach', 30, 'v'], ['avocado', 30, 'f']],
    extras: 'Smoked paprika, cumin, hot sauce',
    steps: ['Brown the turkey mince with paprika and cumin, breaking it up.', 'Add diced capsicum and spinach; cook 2 minutes.', 'Push to one side and scramble the egg in the same pan.', 'Warm tortillas and fill with turkey, egg and sliced avocado.'],
  },
  {
    id: 'cottage-cheese-pancakes', slot: 'breakfast', cuisine: 'Everyday', name: 'Cottage cheese & oat pancakes', mins: 15,
    items: [['cottage', 150, 'p'], ['oats', 50, 'c'], ['egg', 50, 'f'], ['blueberries', 80, 'v'], ['honey', 10, 'c']],
    extras: '½ tsp baking powder, vanilla, cooking spray',
    steps: ['Blend cottage cheese, oats, egg, baking powder and vanilla until smooth.', 'Cook small pancakes in a sprayed non-stick pan, about 2 minutes per side.', 'Serve with blueberries and a drizzle of honey.'],
  },
  {
    id: 'salmon-scramble-ricecakes', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Smoked salmon scramble on rice cakes', mins: 10,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['smokedSalmon', 50, 'p'], ['riceCakes', 30, 'c'], ['spinach', 30, 'v']],
    extras: 'Chives, cracked pepper',
    steps: ['Whisk eggs and egg whites with pepper.', 'Wilt spinach in a non-stick pan, then add the eggs and stir gently until just set.', 'Fold through torn smoked salmon and chives.', 'Pile onto rice cakes.'],
  },
  {
    id: 'pb-banana-toast', slot: 'breakfast', cuisine: 'Everyday', name: 'Peanut butter banana toast with yoghurt', mins: 5,
    items: [['bread', 80, 'c'], ['peanutButter', 15, 'f'], ['banana', 80, 'c'], ['greekYogurt', 150, 'p']],
    extras: 'Cinnamon',
    steps: ['Toast the bread and spread with peanut butter.', 'Top with sliced banana and a dusting of cinnamon.', 'Serve with a bowl of Greek yoghurt on the side.'],
  },
  {
    id: 'pumpkin-spice-oats', slot: 'breakfast', cuisine: 'Everyday', name: 'Pumpkin spice overnight oats', mins: 10,
    items: [['oats', 50, 'c'], ['pumpkin', 80, 'v'], ['greekYogurt', 150, 'p'], ['milk', 120, 'v'], ['almonds', 12, 'f'], ['honey', 8, 'c']],
    extras: 'Cinnamon, nutmeg, ginger',
    steps: ['Microwave diced pumpkin with a splash of water for 4–5 minutes until soft, then mash.', 'Stir mashed pumpkin, oats, yoghurt, milk, honey and spices together in a jar.', 'Refrigerate overnight and top with chopped almonds.'],
  },
  {
    id: 'tofu-breakfast-wrap', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Tofu scramble breakfast wrap', mins: 15,
    items: [['wrap', 60, 'c'], ['tofu', 150, 'p'], ['capsicum', 50, 'v'], ['spinach', 30, 'v'], ['avocado', 40, 'f'], ['passata', 30, 'v']],
    extras: 'Turmeric, smoked paprika, garlic powder',
    steps: ['Crumble tofu into a non-stick pan with the spices and cook for 5 minutes.', 'Add diced capsicum and spinach; cook until soft.', 'Warm the wrap, spread with passata, fill with the scramble and avocado, and roll up.'],
  },

  // ---------- Lunch (set 2) ----------
  {
    id: 'chicken-noodle-salad', slot: 'lunch', cuisine: 'Vietnamese', name: 'Chicken rice-noodle salad with peanut dressing', mins: 20,
    items: [['chicken', 140, 'p'], ['riceNoodles', 150, 'c'], ['carrot', 50, 'v'], ['cucumber', 60, 'v'], ['saladLeaves', 30, 'v'], ['peanutButter', 12, 'f'], ['lemon', 10, 'v'], ['soySauce', 10, 'v']],
    extras: 'Fresh mint, coriander, chilli',
    steps: ['Poach or grill the chicken, then shred.', 'Soak or boil the noodles per the packet; rinse under cold water.', 'Whisk peanut butter, lime juice, soy sauce and a little warm water into a dressing.', 'Toss noodles, grated carrot, cucumber, leaves and herbs with the chicken and dressing.'],
  },
  {
    id: 'turkey-taco-bowl', slot: 'lunch', cuisine: 'Mexican', name: 'Turkey taco rice bowl', mins: 20,
    items: [['turkeyMince', 130, 'p'], ['brownRice', 150, 'c'], ['corn', 60, 'c'], ['capsicum', 50, 'v'], ['cherryTomato', 60, 'v'], ['avocado', 40, 'f'], ['lemon', 10, 'v']],
    extras: 'Taco spice (cumin, paprika, oregano, chilli)',
    steps: ['Brown the turkey mince with the taco spices and a splash of water.', 'Warm the rice and corn.', 'Build bowls with rice, turkey, corn, capsicum, tomatoes and avocado.', 'Squeeze over lime juice.'],
  },
  {
    id: 'tuna-corn-pasta-salad', slot: 'lunch', cuisine: 'Italian', name: 'Tuna, corn & spinach pasta salad', mins: 15,
    items: [['pasta', 70, 'c'], ['tuna', 120, 'p'], ['corn', 50, 'v'], ['cherryTomato', 60, 'v'], ['greekYogurt', 50, 'v'], ['oliveOil', 6, 'f'], ['spinach', 30, 'v']],
    extras: 'Lemon zest, dill, salt, pepper',
    steps: ['Cook pasta, then cool under cold water.', 'Mix yoghurt, olive oil, lemon zest, dill and seasoning into a dressing.', 'Toss pasta with tuna, corn, halved tomatoes, spinach and the dressing.'],
  },
  {
    id: 'prawn-mango-quinoa', slot: 'lunch', cuisine: 'Modern Australian', name: 'Prawn, mango & quinoa salad', mins: 20,
    items: [['prawns', 140, 'p'], ['quinoa', 130, 'c'], ['mango', 80, 'c'], ['cucumber', 60, 'v'], ['saladLeaves', 30, 'v'], ['avocado', 40, 'f'], ['lemon', 10, 'v']],
    extras: 'Chilli flakes, coriander',
    steps: ['Pan-fry prawns for 2–3 minutes until pink.', 'Dice mango, cucumber and avocado.', 'Toss quinoa, leaves, mango and cucumber with lime juice.', 'Top with prawns, avocado, chilli and coriander.'],
  },
  {
    id: 'pork-noodle-stir-fry', slot: 'lunch', cuisine: 'Asian', name: 'Pork & veg rice-noodle stir-fry', mins: 20,
    items: [['porkLoin', 140, 'p'], ['riceNoodles', 160, 'c'], ['stirFryVeg', 150, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f'], ['garlic', 5, 'v']],
    extras: 'Ginger, chilli, spring onion',
    steps: ['Slice pork thinly and stir-fry in hot oil until browned; set aside.', 'Stir-fry vegetables with garlic and ginger for 3 minutes.', 'Add noodles, pork and soy sauce; toss until hot.', 'Finish with spring onion.'],
  },
  {
    id: 'chicken-caesar-wrap', slot: 'lunch', cuisine: 'American', name: 'Chicken caesar-style wrap', mins: 15,
    items: [['wrap', 60, 'c'], ['chicken', 120, 'p'], ['saladLeaves', 40, 'v'], ['parmesan', 10, 'f'], ['greekYogurt', 40, 'v'], ['lemon', 5, 'v']],
    extras: 'Garlic powder, Dijon mustard, pepper',
    steps: ['Grill and slice the chicken.', 'Mix yoghurt, lemon juice, a little mustard, garlic powder and grated parmesan into a creamy dressing.', 'Toss leaves in the dressing, then fill the wrap with leaves and chicken and roll up.'],
  },
  {
    id: 'pumpkin-lentil-feta-salad', slot: 'lunch', cuisine: 'Mediterranean', name: 'Roast pumpkin, lentil & feta salad', mins: 35,
    items: [['lentils', 150, 'p'], ['pumpkin', 200, 'c'], ['spinach', 40, 'v'], ['feta', 30, 'f'], ['oliveOil', 6, 'f'], ['lemon', 10, 'v']],
    extras: 'Cumin, salt, pepper',
    steps: ['Cube pumpkin, toss with half the oil and cumin, and roast at 200°C for 25 minutes.', 'Whisk the remaining oil with lemon juice and seasoning.', 'Toss lentils, spinach and warm pumpkin with the dressing.', 'Crumble over feta.'],
  },
  {
    id: 'chickpea-hummus-bowl', slot: 'lunch', cuisine: 'Middle Eastern', name: 'Smashed chickpea & hummus quinoa bowl', mins: 15,
    items: [['chickpeas', 120, 'p'], ['quinoa', 120, 'c'], ['cucumber', 60, 'v'], ['cherryTomato', 60, 'v'], ['hummus', 40, 'f'], ['saladLeaves', 30, 'v'], ['lemon', 10, 'v']],
    extras: 'Smoked paprika, parsley',
    steps: ['Roughly smash chickpeas with lemon juice, paprika and a pinch of salt.', 'Arrange quinoa, leaves, cucumber and tomatoes in a bowl.', 'Top with the smashed chickpeas and a spoonful of hummus.'],
  },

  // ---------- Snacks (set 2) ----------
  {
    id: 'choc-peanut-bites', slot: 'snack', cuisine: 'Everyday', name: 'Choc peanut protein bites', mins: 10,
    items: [['oats', 30, 'c'], ['whey', 20, 'p'], ['peanutButter', 15, 'f'], ['honey', 10, 'c'], ['cocoa', 5, 'v']],
    extras: 'Splash of milk or water to bind',
    steps: ['Mix everything in a bowl, adding liquid a teaspoon at a time until it holds together.', 'Roll into small balls.', 'Chill for 20 minutes (keeps 5 days in the fridge).'],
  },
  {
    id: 'cottage-pineapple', slot: 'snack', cuisine: 'Everyday', name: 'Cottage cheese with pineapple & almonds', mins: 2,
    items: [['cottage', 180, 'p'], ['pineapple', 100, 'c'], ['almonds', 8, 'f']],
    extras: '',
    steps: ['Spoon cottage cheese into a bowl.', 'Top with pineapple pieces and chopped almonds.'],
  },
  {
    id: 'turkey-roll-ups', slot: 'snack', cuisine: 'Everyday', name: 'Turkey, mozzarella & cucumber roll-ups', mins: 5,
    items: [['turkey', 100, 'p'], ['mozzarella', 20, 'f'], ['cucumber', 80, 'v'], ['riceCakes', 20, 'c']],
    extras: 'Mustard (optional)',
    steps: ['Lay out turkey slices and sprinkle with mozzarella.', 'Add cucumber sticks and roll up tightly.', 'Serve with rice cakes.'],
  },
  {
    id: 'mango-lassi', slot: 'snack', cuisine: 'Indian', name: 'Mango protein lassi', mins: 5,
    items: [['greekYogurt', 200, 'p'], ['mango', 120, 'c'], ['milk', 100, 'v'], ['chia', 5, 'f']],
    extras: 'Cardamom, ice',
    steps: ['Blend yoghurt, mango, milk, cardamom and ice until smooth.', 'Pour and sprinkle with chia seeds.'],
  },
  {
    id: 'choc-yogurt-pot', slot: 'snack', cuisine: 'Everyday', name: 'Chocolate yoghurt pot with strawberries', mins: 3,
    items: [['greekYogurt', 200, 'p'], ['cocoa', 6, 'v'], ['honey', 10, 'c'], ['strawberries', 100, 'v'], ['almonds', 10, 'f']],
    extras: '',
    steps: ['Stir cocoa and honey through the yoghurt until smooth.', 'Top with sliced strawberries and chopped almonds.'],
  },
  {
    id: 'veggie-egg-muffins', slot: 'snack', cuisine: 'Everyday', name: 'Veggie egg muffins', mins: 25,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['capsicum', 40, 'v'], ['spinach', 30, 'v'], ['mozzarella', 15, 'f'], ['riceCakes', 20, 'c']],
    extras: 'Salt, pepper, cooking spray',
    steps: ['Whisk eggs and egg whites with seasoning.', 'Divide diced capsicum, spinach and mozzarella between sprayed muffin holes; pour over the egg.', 'Bake at 180°C for 18–20 minutes.', 'Serve with rice cakes (muffins keep 4 days in the fridge).'],
  },
  {
    id: 'vegan-choc-smoothie', slot: 'snack', cuisine: 'Everyday', name: 'Vegan chocolate banana smoothie', mins: 5,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 25, 'p'], ['banana', 100, 'c'], ['cocoa', 6, 'v'], ['peanutButter', 8, 'f']],
    extras: 'Ice',
    steps: ['Blend everything with ice until smooth.'],
  },
  {
    id: 'edamame-carrot-hummus', slot: 'snack', cuisine: 'Everyday', name: 'Edamame, carrot sticks & hummus', mins: 5,
    items: [['edamame', 100, 'p'], ['carrot', 100, 'v'], ['hummus', 40, 'f'], ['riceCakes', 20, 'c']],
    extras: 'Sea salt, chilli flakes',
    steps: ['Steam or microwave the edamame and season.', 'Cut carrots into sticks.', 'Serve with hummus and rice cakes.'],
  },

  // ---------- Dinner (set 2) ----------
  {
    id: 'turkey-meatball-pasta', slot: 'dinner', cuisine: 'Italian', name: 'Turkey meatballs in tomato sauce with pasta', mins: 35,
    items: [['turkeyMince', 150, 'p'], ['pasta', 75, 'c'], ['passata', 200, 'v'], ['onion', 40, 'v'], ['garlic', 5, 'v'], ['parmesan', 10, 'f'], ['spinach', 40, 'v']],
    extras: 'Dried oregano, basil, chilli flakes',
    steps: ['Mix turkey mince with half the garlic, oregano and seasoning; roll into small meatballs.', 'Brown meatballs in a non-stick pan, then add diced onion and the rest of the garlic.', 'Pour in passata and simmer 12 minutes; stir through spinach.', 'Serve over pasta with parmesan.'],
  },
  {
    id: 'pork-pineapple-rice', slot: 'dinner', cuisine: 'Chinese', name: 'Sweet & sour pork with pineapple rice', mins: 25,
    items: [['porkLoin', 150, 'p'], ['whiteRice', 170, 'c'], ['pineapple', 80, 'c'], ['capsicum', 80, 'v'], ['onion', 40, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 8, 'f']],
    extras: '1 tbsp vinegar, 1 tsp cornflour, ginger',
    steps: ['Stir-fry sliced pork in the oil until browned.', 'Add capsicum and onion; cook 3 minutes.', 'Mix soy sauce, vinegar, cornflour, ginger and a splash of pineapple juice; add with the pineapple and simmer until glossy.', 'Serve over rice.'],
  },
  {
    id: 'chicken-fajitas', slot: 'dinner', cuisine: 'Mexican', name: 'Chicken fajitas with corn tortillas', mins: 25,
    items: [['chicken', 150, 'p'], ['cornTortilla', 78, 'c'], ['capsicum', 120, 'v'], ['onion', 60, 'v'], ['avocado', 40, 'f'], ['greekYogurt', 40, 'v'], ['lemon', 10, 'v']],
    extras: 'Fajita spice (paprika, cumin, garlic, chilli)',
    steps: ['Slice chicken, capsicum and onion into strips and toss with the spice.', 'Cook in a hot pan until chicken is done and veg is charred at the edges.', 'Warm tortillas and fill with the chicken mix, avocado and a dollop of yoghurt.', 'Squeeze over lime.'],
  },
  {
    id: 'chicken-cauli-fried-rice', slot: 'dinner', cuisine: 'Chinese', name: 'Chicken cauliflower fried rice', mins: 25,
    items: [['chicken', 150, 'p'], ['cauliflower', 200, 'v'], ['whiteRice', 80, 'c'], ['egg', 50, 'f'], ['carrot', 50, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Garlic, ginger, spring onion',
    steps: ['Pulse cauliflower in a food processor until rice-sized (or grate it).', 'Stir-fry diced chicken in the oil until cooked; push aside and scramble the egg.', 'Add cauliflower, rice, diced carrot, garlic and ginger; stir-fry 5 minutes.', 'Season with soy sauce and top with spring onion.'],
  },
  {
    id: 'teriyaki-salmon-noodles', slot: 'dinner', cuisine: 'Japanese', name: 'Teriyaki-style salmon noodle bowl', mins: 25,
    items: [['salmon', 140, 'p'], ['riceNoodles', 150, 'c'], ['broccoli', 100, 'v'], ['carrot', 50, 'v'], ['soySauce', 15, 'v'], ['honey', 8, 'c'], ['oliveOil', 4, 'f']],
    extras: 'Ginger, garlic, sesame seeds (optional)',
    steps: ['Mix soy sauce, honey, grated ginger and garlic into a glaze.', 'Pan-fry salmon in the oil for 3 minutes per side, then brush with glaze for the last minute.', 'Steam broccoli and carrot; cook noodles per the packet.', 'Serve salmon over noodles and veg with any remaining glaze.'],
  },
  {
    id: 'beef-broccoli-stir-fry', slot: 'dinner', cuisine: 'Chinese', name: 'Beef & broccoli garlic stir-fry', mins: 20,
    items: [['beefMince', 150, 'p'], ['brownRice', 160, 'c'], ['broccoli', 150, 'v'], ['soySauce', 15, 'v'], ['garlic', 5, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Ginger, chilli, spring onion',
    steps: ['Brown the beef mince in the oil, breaking it up.', 'Add broccoli florets, garlic and ginger with a splash of water; cover for 3 minutes.', 'Stir in soy sauce and toss.', 'Serve over rice with spring onion.'],
  },
  {
    id: 'stuffed-sweet-potato', slot: 'dinner', cuisine: 'Mexican', name: 'Black bean & cheese stuffed sweet potato', mins: 45,
    items: [['sweetPotato', 250, 'c'], ['blackBeans', 120, 'p'], ['corn', 50, 'v'], ['mozzarella', 30, 'f'], ['cherryTomato', 60, 'v'], ['greekYogurt', 40, 'v']],
    extras: 'Cumin, smoked paprika, coriander',
    steps: ['Prick sweet potato and bake at 200°C for 40 minutes (or microwave 8–10 minutes) until soft.', 'Warm beans and corn with the spices.', 'Split the potato, pile in the beans, top with mozzarella and grill until melted.', 'Finish with tomatoes, yoghurt and coriander.'],
  },
  {
    id: 'pumpkin-tofu-curry', slot: 'dinner', cuisine: 'Indian', name: 'Pumpkin, tofu & chickpea curry', mins: 35,
    items: [['tofu', 150, 'p'], ['pumpkin', 200, 'v'], ['chickpeas', 80, 'c'], ['brownRice', 120, 'c'], ['coconutMilk', 100, 'f'], ['spinach', 50, 'v'], ['onion', 40, 'v']],
    extras: 'Curry powder, garlic, ginger',
    steps: ['Soften diced onion with garlic and ginger in a splash of water; stir in curry powder.', 'Add cubed pumpkin, coconut milk and a little water; simmer 15 minutes.', 'Add cubed tofu and chickpeas; simmer 5 minutes, then stir through spinach.', 'Serve over rice.'],
  },

  // ---------- Breakfast (set 3) ----------
  {
    id: 'berry-yogurt-smoothie-bowl', slot: 'breakfast', cuisine: 'Everyday', name: 'Berry yoghurt smoothie bowl', mins: 5,
    items: [['greekYogurt', 200, 'p'], ['strawberries', 100, 'v'], ['banana', 80, 'c'], ['granola', 25, 'c'], ['chia', 10, 'f']],
    extras: 'Ice',
    steps: ['Blend yoghurt, half the strawberries, the banana and a little ice until thick.', 'Pour into a bowl and top with the remaining strawberries, granola and chia.'],
  },
  {
    id: 'vegan-pb-overnight-oats', slot: 'breakfast', cuisine: 'Everyday', name: 'Vegan peanut butter overnight oats', mins: 5,
    items: [['oats', 50, 'c'], ['soyMilk', 200, 'v'], ['plantProtein', 20, 'p'], ['peanutButter', 12, 'f'], ['banana', 50, 'c']],
    extras: 'Cinnamon, vanilla',
    steps: ['Stir oats, protein powder, cinnamon and vanilla into the soy milk.', 'Swirl through the peanut butter, cover and refrigerate overnight.', 'Top with sliced banana.'],
  },
  {
    id: 'tofu-potato-hash', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Tofu, potato & capsicum hash', mins: 25,
    items: [['tofu', 180, 'p'], ['potato', 150, 'c'], ['capsicum', 50, 'v'], ['spinach', 30, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Smoked paprika, turmeric, salt, pepper',
    steps: ['Dice potato small and microwave 4 minutes to par-cook.', 'Fry potato in the oil until golden, about 8 minutes.', 'Add crumbled tofu, diced capsicum and spices; cook 5 minutes.', 'Stir through spinach until wilted.'],
  },
  {
    id: 'edamame-avo-toast', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Smashed edamame & avocado toast', mins: 10,
    items: [['bread', 80, 'c'], ['edamame', 80, 'p'], ['avocado', 50, 'f'], ['lemon', 5, 'v'], ['cherryTomato', 50, 'v']],
    extras: 'Chilli flakes, sea salt',
    steps: ['Microwave edamame until hot, then roughly mash with avocado, lemon juice and salt.', 'Toast the bread and pile on the mash.', 'Top with halved tomatoes and chilli flakes.'],
  },
  {
    id: 'apple-cinnamon-protein-oats', slot: 'breakfast', cuisine: 'Everyday', name: 'Apple cinnamon protein oats', mins: 8,
    items: [['oats', 50, 'c'], ['milk', 200, 'v'], ['whey', 20, 'p'], ['apple', 100, 'c'], ['almonds', 10, 'f']],
    extras: 'Cinnamon',
    steps: ['Simmer oats and grated apple in the milk for 4–5 minutes.', 'Stir in protein powder and cinnamon off the heat.', 'Top with chopped almonds.'],
  },
  {
    id: 'egg-white-feta-wrap', slot: 'breakfast', cuisine: 'Mediterranean', name: 'Egg white, mushroom & feta wrap', mins: 12,
    items: [['wrap', 60, 'c'], ['eggWhite', 150, 'p'], ['egg', 50, 'f'], ['spinach', 30, 'v'], ['mushrooms', 50, 'v'], ['feta', 15, 'f']],
    extras: 'Pepper, chives',
    steps: ['Cook sliced mushrooms in a non-stick pan until golden; add spinach.', 'Pour in whisked egg and egg whites and cook as a thin omelette.', 'Crumble over feta, slide onto the wrap and roll up.'],
  },
  {
    id: 'quinoa-berry-bowl', slot: 'breakfast', cuisine: 'Everyday', name: 'Warm quinoa & blueberry breakfast bowl', mins: 10,
    items: [['quinoa', 120, 'c'], ['soyMilk', 150, 'v'], ['plantProtein', 20, 'p'], ['blueberries', 80, 'v'], ['almonds', 12, 'f']],
    extras: 'Cinnamon, vanilla',
    steps: ['Warm cooked quinoa with the soy milk, cinnamon and vanilla for 3–4 minutes.', 'Stir in protein powder off the heat.', 'Top with blueberries and chopped almonds.'],
  },
  {
    id: 'pb-banana-rice-cakes', slot: 'breakfast', cuisine: 'Everyday', name: 'Peanut butter banana rice cakes with yoghurt', mins: 5,
    items: [['riceCakes', 30, 'c'], ['peanutButter', 15, 'f'], ['banana', 80, 'c'], ['greekYogurt', 150, 'p']],
    extras: 'Cinnamon',
    steps: ['Spread rice cakes with peanut butter and top with sliced banana.', 'Dust with cinnamon and serve with Greek yoghurt.'],
  },
  {
    id: 'corn-spinach-fritters', slot: 'breakfast', cuisine: 'Modern Australian', name: 'Corn & spinach fritters', mins: 20,
    items: [['corn', 100, 'c'], ['egg', 50, 'f'], ['eggWhite', 60, 'p'], ['oats', 25, 'c'], ['spinach', 30, 'v'], ['greekYogurt', 50, 'v']],
    extras: 'Paprika, salt, cooking spray',
    steps: ['Blitz oats to a flour, then mix with egg, egg white, corn, chopped spinach and paprika.', 'Cook spoonfuls in a sprayed non-stick pan, 2–3 minutes per side.', 'Serve with a dollop of yoghurt.'],
  },
  {
    id: 'tropical-vegan-smoothie', slot: 'breakfast', cuisine: 'Everyday', name: 'Tropical mango protein smoothie', mins: 5,
    items: [['soyMilk', 250, 'v'], ['plantProtein', 25, 'p'], ['mango', 100, 'c'], ['pineapple', 60, 'v'], ['chia', 10, 'f']],
    extras: 'Ice, lime juice',
    steps: ['Blend everything with ice and a squeeze of lime until smooth.'],
  },

  // ---------- Lunch (set 3) ----------
  {
    id: 'black-bean-quinoa-salad', slot: 'lunch', cuisine: 'Mexican', name: 'Black bean, corn & quinoa salad', mins: 15,
    items: [['blackBeans', 130, 'p'], ['quinoa', 120, 'c'], ['corn', 50, 'v'], ['capsicum', 50, 'v'], ['avocado', 40, 'f'], ['lemon', 10, 'v']],
    extras: 'Cumin, coriander, chilli',
    steps: ['Rinse beans and dice capsicum and avocado.', 'Toss quinoa, beans, corn and capsicum with lime juice, cumin and salt.', 'Top with avocado and coriander.'],
  },
  {
    id: 'tofu-noodle-salad', slot: 'lunch', cuisine: 'Vietnamese', name: 'Crispy tofu noodle salad', mins: 25,
    items: [['tofu', 150, 'p'], ['riceNoodles', 150, 'c'], ['carrot', 50, 'v'], ['cucumber', 60, 'v'], ['peanutButter', 12, 'f'], ['soySauce', 10, 'v'], ['lemon', 10, 'v']],
    extras: 'Mint, chilli, garlic',
    steps: ['Cube tofu and pan-fry or air-fry until crisp.', 'Cook noodles and rinse under cold water.', 'Whisk peanut butter, soy sauce, lime juice, garlic and warm water into a dressing.', 'Toss noodles, grated carrot and cucumber with the dressing; top with tofu and mint.'],
  },
  {
    id: 'lentil-vegetable-soup', slot: 'lunch', cuisine: 'European', name: 'Hearty lentil & vegetable soup', mins: 35,
    items: [['lentils', 180, 'p'], ['potato', 120, 'c'], ['carrot', 60, 'v'], ['onion', 40, 'v'], ['passata', 150, 'v'], ['oliveOil', 6, 'f'], ['spinach', 30, 'v']],
    extras: 'Garlic, cumin, smoked paprika, stock cube, water',
    steps: ['Soften diced onion and carrot in the oil with garlic and spices.', 'Add diced potato, passata, stock and enough water to cover; simmer 20 minutes.', 'Stir in lentils and spinach and heat through.', 'Season to taste (freezes well).'],
  },
  {
    id: 'egg-salad-wrap', slot: 'lunch', cuisine: 'Everyday', name: 'Creamy egg salad wrap', mins: 15,
    items: [['wrap', 60, 'c'], ['egg', 100, 'f'], ['greekYogurt', 60, 'p'], ['saladLeaves', 30, 'v'], ['cucumber', 50, 'v']],
    extras: 'Dijon mustard, chives, pepper',
    steps: ['Boil eggs for 9 minutes, cool and peel.', 'Mash eggs with yoghurt, a little mustard, chives and pepper.', 'Fill the wrap with leaves, cucumber and egg salad, then roll up.'],
  },
  {
    id: 'mediterranean-chickpea-salad', slot: 'lunch', cuisine: 'Mediterranean', name: 'Mediterranean chickpea & feta salad', mins: 15,
    items: [['chickpeas', 130, 'p'], ['quinoa', 100, 'c'], ['cucumber', 60, 'v'], ['cherryTomato', 80, 'v'], ['feta', 30, 'f'], ['oliveOil', 6, 'f'], ['lemon', 10, 'v']],
    extras: 'Dried oregano, red onion, parsley',
    steps: ['Whisk olive oil, lemon juice and oregano into a dressing.', 'Toss chickpeas, quinoa, cucumber, tomatoes and herbs with the dressing.', 'Crumble over feta.'],
  },
  {
    id: 'chicken-pumpkin-quinoa', slot: 'lunch', cuisine: 'Modern Australian', name: 'Chicken, roast pumpkin & quinoa bowl', mins: 35,
    items: [['chicken', 130, 'p'], ['pumpkin', 150, 'v'], ['quinoa', 120, 'c'], ['spinach', 40, 'v'], ['feta', 20, 'f'], ['oliveOil', 5, 'f']],
    extras: 'Paprika, cumin, lemon',
    steps: ['Roast cubed pumpkin with the oil and spices at 200°C for 25 minutes.', 'Grill or pan-fry the seasoned chicken and slice.', 'Toss quinoa, spinach and pumpkin; top with chicken and crumbled feta.'],
  },
  {
    id: 'tuna-rice-bowl', slot: 'lunch', cuisine: 'Japanese', name: 'Tuna, edamame & avocado rice bowl', mins: 10,
    items: [['tuna', 120, 'p'], ['whiteRice', 160, 'c'], ['edamame', 50, 'v'], ['cucumber', 60, 'v'], ['avocado', 40, 'f'], ['soySauce', 10, 'v']],
    extras: 'Sriracha, spring onion',
    steps: ['Warm the rice and edamame.', 'Arrange rice, tuna, edamame, cucumber and avocado in a bowl.', 'Drizzle with soy sauce and a little sriracha.'],
  },
  {
    id: 'turkey-avo-sandwich', slot: 'lunch', cuisine: 'Everyday', name: 'Turkey, avocado & tomato sandwich', mins: 5,
    items: [['bread', 80, 'c'], ['turkey', 100, 'p'], ['saladLeaves', 30, 'v'], ['cherryTomato', 50, 'v'], ['avocado', 40, 'f']],
    extras: 'Mustard, pepper',
    steps: ['Spread one slice with mashed avocado and the other with mustard.', 'Layer turkey, leaves and sliced tomato, season and close.'],
  },
  {
    id: 'beef-nacho-bowl', slot: 'lunch', cuisine: 'Mexican', name: 'Baked tortilla beef nacho bowl', mins: 20,
    items: [['beefMince', 120, 'p'], ['cornTortilla', 52, 'c'], ['blackBeans', 60, 'c'], ['cherryTomato', 60, 'v'], ['cheddar', 15, 'f'], ['greekYogurt', 30, 'v'], ['lemon', 5, 'v']],
    extras: 'Taco spice, coriander',
    steps: ['Cut tortillas into wedges and bake at 190°C for 8 minutes until crisp.', 'Brown the mince with taco spice; stir in beans.', 'Pile chips into a bowl, top with mince, cheese, tomatoes and yoghurt.', 'Finish with lime and coriander.'],
  },
  {
    id: 'satay-chickpea-wrap', slot: 'lunch', cuisine: 'Asian', name: 'Satay chickpea & carrot wrap', mins: 10,
    items: [['wrap', 60, 'c'], ['chickpeas', 120, 'p'], ['carrot', 50, 'v'], ['saladLeaves', 30, 'v'], ['peanutButter', 12, 'f'], ['lemon', 5, 'v']],
    extras: 'Soy sauce, chilli, warm water',
    steps: ['Whisk peanut butter, lime juice, a splash of soy sauce and warm water into a satay sauce.', 'Roughly mash chickpeas into half the sauce.', 'Fill the wrap with leaves, grated carrot and chickpeas; drizzle the rest of the sauce and roll up.'],
  },

  // ---------- Snacks (set 3) ----------
  {
    id: 'roasted-chickpeas-apple', slot: 'snack', cuisine: 'Everyday', name: 'Crunchy roasted chickpeas & apple', mins: 30,
    items: [['chickpeas', 120, 'p'], ['oliveOil', 5, 'f'], ['apple', 120, 'c']],
    extras: 'Smoked paprika, salt',
    steps: ['Pat chickpeas dry, toss with oil, paprika and salt.', 'Roast at 200°C (or air-fry) for 25 minutes until crunchy.', 'Serve with a sliced apple.'],
  },
  {
    id: 'iced-coffee-protein-shake', slot: 'snack', cuisine: 'Everyday', name: 'Iced coffee protein shake', mins: 3,
    items: [['milk', 250, 'v'], ['whey', 30, 'p'], ['banana', 70, 'c'], ['almonds', 8, 'f']],
    extras: '1 shot cold espresso or 1 tsp instant coffee, ice',
    steps: ['Blend milk, protein powder, banana, coffee and ice until frothy.', 'Serve with almonds on the side.'],
  },
  {
    id: 'pb-apple-rice-cakes', slot: 'snack', cuisine: 'Everyday', name: 'Peanut butter apple rice cakes & edamame', mins: 5,
    items: [['riceCakes', 20, 'c'], ['peanutButter', 15, 'f'], ['apple', 80, 'c'], ['edamame', 80, 'p']],
    extras: 'Cinnamon, sea salt',
    steps: ['Spread rice cakes with peanut butter and top with thin apple slices and cinnamon.', 'Serve with salted, warmed edamame.'],
  },
  {
    id: 'frozen-yogurt-bark', slot: 'snack', cuisine: 'Everyday', name: 'Blueberry & dark chocolate yoghurt bark', mins: 10,
    items: [['greekYogurt', 200, 'p'], ['blueberries', 60, 'v'], ['honey', 10, 'c'], ['darkChoc', 10, 'f']],
    extras: 'Vanilla',
    steps: ['Mix yoghurt with honey and vanilla and spread thinly on a lined tray.', 'Scatter with blueberries and chopped chocolate.', 'Freeze for 2 hours, then break into pieces.'],
  },
  {
    id: 'tuna-cucumber-boats', slot: 'snack', cuisine: 'Everyday', name: 'Tuna cucumber boats with rice cakes', mins: 5,
    items: [['tuna', 95, 'p'], ['cucumber', 120, 'v'], ['greekYogurt', 30, 'v'], ['riceCakes', 20, 'c'], ['avocado', 25, 'f']],
    extras: 'Lemon, dill, pepper',
    steps: ['Halve a cucumber lengthways and scoop out the seeds.', 'Mix tuna with yoghurt, mashed avocado, lemon and dill.', 'Fill the cucumber and serve with rice cakes.'],
  },
  {
    id: 'eggs-almonds-apple', slot: 'snack', cuisine: 'Everyday', name: 'Boiled eggs, almonds & apple', mins: 12,
    items: [['egg', 100, 'p'], ['almonds', 10, 'f'], ['apple', 120, 'c']],
    extras: 'Salt, pepper',
    steps: ['Boil eggs for 9 minutes, cool and peel.', 'Season and serve with almonds and a sliced apple.'],
  },
  {
    id: 'cottage-herb-dip', slot: 'snack', cuisine: 'Everyday', name: 'Herby cottage cheese dip with veggie sticks', mins: 5,
    items: [['cottage', 150, 'p'], ['carrot', 80, 'v'], ['cucumber', 80, 'v'], ['riceCakes', 20, 'c'], ['hummus', 20, 'f']],
    extras: 'Chives, dill, lemon zest',
    steps: ['Stir chopped herbs and lemon zest through the cottage cheese, then swirl in the hummus.', 'Serve with carrot and cucumber sticks and rice cakes.'],
  },
  {
    id: 'vegan-chia-protein-pudding', slot: 'snack', cuisine: 'Everyday', name: 'Strawberry chia protein pudding', mins: 5,
    items: [['soyMilk', 200, 'v'], ['plantProtein', 25, 'p'], ['chia', 15, 'f'], ['banana', 50, 'c'], ['strawberries', 60, 'v']],
    extras: 'Vanilla',
    steps: ['Whisk soy milk, protein powder and vanilla, then stir in chia and mashed banana.', 'Chill at least 2 hours.', 'Top with sliced strawberries.'],
  },
  {
    id: 'smoked-salmon-rice-cakes', slot: 'snack', cuisine: 'Everyday', name: 'Smoked salmon & avocado rice cakes', mins: 5,
    items: [['riceCakes', 30, 'c'], ['smokedSalmon', 60, 'p'], ['avocado', 30, 'f'], ['cucumber', 40, 'v']],
    extras: 'Lemon, cracked pepper, capers',
    steps: ['Spread rice cakes with mashed avocado.', 'Top with smoked salmon, cucumber slices, lemon and pepper.'],
  },
  {
    id: 'banana-protein-mug-cake', slot: 'snack', cuisine: 'Everyday', name: 'Banana oat protein mug cake', mins: 5,
    items: [['oats', 35, 'c'], ['banana', 60, 'c'], ['eggWhite', 60, 'p'], ['whey', 10, 'p'], ['peanutButter', 8, 'f']],
    extras: '½ tsp baking powder, cinnamon',
    steps: ['Mash banana in a large mug, then mix in oats, egg white, protein powder, baking powder and cinnamon.', 'Microwave 90 seconds to 2 minutes until set.', 'Top with peanut butter.'],
  },

  // ---------- Dinner (set 3) ----------
  {
    id: 'tofu-teriyaki-bowl', slot: 'dinner', cuisine: 'Japanese', name: 'Sticky teriyaki tofu rice bowl', mins: 25,
    items: [['tofu', 200, 'p'], ['brownRice', 160, 'c'], ['broccoli', 100, 'v'], ['carrot', 50, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Ginger, garlic, 1 tsp maple syrup or sugar, 1 tsp cornflour',
    steps: ['Cube tofu and pan-fry in the oil until golden.', 'Mix soy sauce, ginger, garlic, sweetener, cornflour and a splash of water; pour over tofu and toss until sticky.', 'Steam broccoli and carrot.', 'Serve over rice.'],
  },
  {
    id: 'lentil-shepherds-pie', slot: 'dinner', cuisine: 'British', name: 'Lentil shepherd’s pie', mins: 45,
    items: [['lentils', 180, 'p'], ['potato', 250, 'c'], ['carrot', 60, 'v'], ['onion', 40, 'v'], ['passata', 100, 'v'], ['oliveOil', 8, 'f'], ['soyMilk', 50, 'v']],
    extras: 'Garlic, thyme, stock cube',
    steps: ['Boil potatoes until soft, then mash with soy milk and half the oil.', 'Soften onion, carrot and garlic in the rest of the oil; add lentils, passata, thyme and stock and simmer 10 minutes.', 'Spoon into a dish, top with mash and bake at 200°C for 20 minutes.'],
  },
  {
    id: 'black-bean-burrito-bowl', slot: 'dinner', cuisine: 'Mexican', name: 'Black bean burrito bowl', mins: 20,
    items: [['blackBeans', 150, 'p'], ['brownRice', 150, 'c'], ['corn', 60, 'v'], ['capsicum', 60, 'v'], ['avocado', 50, 'f'], ['cherryTomato', 50, 'v'], ['lemon', 10, 'v']],
    extras: 'Cumin, smoked paprika, garlic, coriander',
    steps: ['Warm beans with cumin, paprika, garlic and a splash of water.', 'Char capsicum and corn in a hot pan.', 'Build bowls with rice, beans, veg, tomatoes and avocado.', 'Finish with lime and coriander.'],
  },
  {
    id: 'lentil-pasta-bake', slot: 'dinner', cuisine: 'Italian', name: 'Lentil & zucchini pasta bake', mins: 40,
    items: [['pasta', 80, 'c'], ['lentils', 120, 'p'], ['passata', 200, 'v'], ['zucchini', 100, 'v'], ['mozzarella', 30, 'f'], ['spinach', 40, 'v']],
    extras: 'Garlic, oregano, basil',
    steps: ['Cook pasta until just under done.', 'Simmer passata with garlic, herbs, diced zucchini and lentils for 10 minutes; stir in spinach.', 'Mix with pasta, top with mozzarella and bake at 200°C for 15 minutes.'],
  },
  {
    id: 'lemon-herb-chicken-potatoes', slot: 'dinner', cuisine: 'Mediterranean', name: 'Lemon herb chicken with crispy potatoes', mins: 40,
    items: [['chicken', 170, 'p'], ['potato', 250, 'c'], ['greenBeans', 100, 'v'], ['oliveOil', 10, 'f'], ['lemon', 10, 'v'], ['garlic', 5, 'v']],
    extras: 'Rosemary, thyme, salt, pepper',
    steps: ['Cube potatoes, toss with most of the oil and rosemary, and roast at 210°C for 30 minutes.', 'Rub chicken with garlic, lemon, thyme and the remaining oil; add to the tray for the last 20 minutes.', 'Steam green beans and serve together.'],
  },
  {
    id: 'pork-sweet-potato-traybake', slot: 'dinner', cuisine: 'Modern Australian', name: 'Pork, sweet potato & broccoli traybake', mins: 40,
    items: [['porkLoin', 160, 'p'], ['sweetPotato', 200, 'c'], ['broccoli', 100, 'v'], ['capsicum', 80, 'v'], ['oliveOil', 8, 'f']],
    extras: 'Fennel seeds or paprika, garlic, salt',
    steps: ['Cube sweet potato, toss with half the oil and roast at 200°C for 15 minutes.', 'Add sliced pork, broccoli and capsicum tossed in the rest of the oil and spices.', 'Roast 15–20 minutes more until the pork is cooked through.'],
  },
  {
    id: 'prawn-mango-tacos', slot: 'dinner', cuisine: 'Mexican', name: 'Prawn tacos with mango salsa', mins: 20,
    items: [['prawns', 160, 'p'], ['cornTortilla', 78, 'c'], ['saladLeaves', 40, 'v'], ['mango', 50, 'v'], ['avocado', 40, 'f'], ['greekYogurt', 30, 'v'], ['lemon', 10, 'v']],
    extras: 'Chilli, garlic, coriander',
    steps: ['Dice mango and mix with lime juice, chilli and coriander.', 'Pan-fry prawns with garlic and chilli for 2–3 minutes.', 'Warm tortillas and fill with leaves, prawns, salsa, avocado and yoghurt.'],
  },
  {
    id: 'sweet-potato-cottage-pie', slot: 'dinner', cuisine: 'British', name: 'Beef cottage pie with sweet potato mash', mins: 45,
    items: [['beefMince', 150, 'p'], ['sweetPotato', 250, 'c'], ['carrot', 50, 'v'], ['onion', 40, 'v'], ['passata', 100, 'v'], ['cheddar', 15, 'f']],
    extras: 'Garlic, Worcestershire sauce, thyme',
    steps: ['Boil sweet potato until soft and mash.', 'Brown the mince with onion, carrot and garlic; add passata, thyme and a dash of Worcestershire and simmer 10 minutes.', 'Top with mash and cheese and bake at 200°C for 20 minutes.'],
  },
  {
    id: 'salmon-quinoa-greens', slot: 'dinner', cuisine: 'Modern Australian', name: 'Pan-seared salmon with quinoa & greens', mins: 25,
    items: [['salmon', 150, 'p'], ['quinoa', 140, 'c'], ['broccoli', 80, 'v'], ['spinach', 40, 'v'], ['lemon', 10, 'v'], ['oliveOil', 3, 'f']],
    extras: 'Garlic, dill, salt, pepper',
    steps: ['Sear salmon skin-side down in the oil for 4 minutes, flip and cook 2–3 more.', 'Steam broccoli and wilt spinach with garlic.', 'Serve on quinoa with lemon and dill.'],
  },
  {
    id: 'turkey-stuffed-capsicums', slot: 'dinner', cuisine: 'Mediterranean', name: 'Turkey & rice stuffed capsicums', mins: 45,
    items: [['turkeyMince', 150, 'p'], ['brownRice', 120, 'c'], ['capsicum', 200, 'v'], ['passata', 100, 'v'], ['onion', 40, 'v'], ['mozzarella', 25, 'f']],
    extras: 'Garlic, oregano, paprika',
    steps: ['Halve and deseed capsicums.', 'Brown turkey with onion, garlic and spices; stir in rice and passata.', 'Fill the capsicums, top with mozzarella, cover with foil and bake at 190°C for 30 minutes (uncover for the last 10).'],
  },

  // ---------- World cuisines: breakfast ----------
  {
    id: 'japanese-egg-rice-bowl', slot: 'breakfast', cuisine: 'Japanese', name: 'Japanese-style egg & rice breakfast bowl', mins: 10,
    items: [['whiteRice', 120, 'c'], ['egg', 100, 'f'], ['eggWhite', 60, 'p'], ['spinach', 40, 'v'], ['edamame', 40, 'v'], ['soySauce', 10, 'v']],
    extras: 'Spring onion, nori (optional)',
    steps: ['Warm the rice and edamame.', 'Soft-scramble the eggs and egg whites with a dash of soy sauce.', 'Wilt the spinach in the same pan.', 'Serve eggs and spinach over rice with edamame and spring onion.'],
  },
  {
    id: 'shakshuka', slot: 'breakfast', cuisine: 'Middle Eastern', name: 'Shakshuka with toast', mins: 25,
    items: [['egg', 100, 'f'], ['eggWhite', 80, 'p'], ['passata', 200, 'v'], ['capsicum', 60, 'v'], ['onion', 40, 'v'], ['bread', 60, 'c']],
    extras: 'Cumin, smoked paprika, chilli, garlic, parsley',
    steps: ['Soften sliced onion and capsicum in a non-stick pan with garlic and spices.', 'Add passata and simmer 8 minutes until thick.', 'Pour in egg whites, then make wells and crack in the eggs; cover and cook until set.', 'Scatter with parsley and serve with toast.'],
  },
  {
    id: 'greek-omelette-pita', slot: 'breakfast', cuisine: 'Greek', name: 'Greek feta & tomato omelette with pita', mins: 12,
    items: [['egg', 100, 'f'], ['eggWhite', 100, 'p'], ['cherryTomato', 60, 'v'], ['spinach', 30, 'v'], ['feta', 20, 'f'], ['pitaBread', 32, 'c']],
    extras: 'Dried oregano, pepper',
    steps: ['Whisk eggs and egg whites with oregano and pepper.', 'Cook halved tomatoes and spinach briefly, then pour over the eggs.', 'Crumble over feta, fold and serve with warm pita.'],
  },
  {
    id: 'chicken-ginger-congee', slot: 'breakfast', cuisine: 'Chinese', name: 'Chicken & ginger rice congee', mins: 25,
    items: [['whiteRice', 150, 'c'], ['chicken', 100, 'p'], ['spinach', 30, 'v'], ['soySauce', 10, 'v'], ['egg', 50, 'f']],
    extras: 'Fresh ginger, spring onion, white pepper, stock cube',
    steps: ['Simmer cooked rice with stock, sliced ginger and plenty of water for 15 minutes, stirring, until porridge-like.', 'Add thinly sliced chicken and cook 5 minutes.', 'Stir through spinach; top with a soft-boiled egg, soy sauce and spring onion.'],
  },
  {
    id: 'huevos-rancheros', slot: 'breakfast', cuisine: 'Mexican', name: 'Huevos rancheros', mins: 15,
    items: [['cornTortilla', 52, 'c'], ['egg', 100, 'f'], ['blackBeans', 80, 'p'], ['passata', 80, 'v'], ['avocado', 30, 'f'], ['capsicum', 40, 'v']],
    extras: 'Cumin, chilli, coriander, lime',
    steps: ['Simmer passata with diced capsicum, cumin and chilli to make a quick salsa; stir in the beans.', 'Fry the eggs in a non-stick pan.', 'Warm tortillas, top with beans, eggs and avocado.', 'Finish with coriander and lime.'],
  },
  {
    id: 'bircher-muesli', slot: 'breakfast', cuisine: 'European', name: 'Swiss bircher muesli', mins: 5,
    items: [['oats', 50, 'c'], ['greekYogurt', 150, 'p'], ['apple', 80, 'c'], ['milk', 80, 'v'], ['almonds', 10, 'f']],
    extras: 'Cinnamon, lemon juice',
    steps: ['Grate the apple and toss with a little lemon juice.', 'Mix oats, yoghurt, milk, apple and cinnamon; refrigerate overnight.', 'Top with chopped almonds.'],
  },
  {
    id: 'masala-omelette-wrap', slot: 'breakfast', cuisine: 'Indian', name: 'Masala omelette wrap', mins: 12,
    items: [['egg', 100, 'f'], ['eggWhite', 80, 'p'], ['onion', 30, 'v'], ['cherryTomato', 40, 'v'], ['spinach', 20, 'v'], ['wrap', 60, 'c']],
    extras: 'Turmeric, garam masala, green chilli, coriander',
    steps: ['Whisk eggs and egg whites with turmeric, garam masala, chopped onion, tomato, chilli and coriander.', 'Cook as a thin omelette in a non-stick pan.', 'Lay on a warm wrap with spinach and roll up.'],
  },
  {
    id: 'blueberry-protein-pancakes', slot: 'breakfast', cuisine: 'American', name: 'Fluffy blueberry protein pancakes', mins: 15,
    items: [['oats', 50, 'c'], ['eggWhite', 100, 'p'], ['egg', 50, 'f'], ['greekYogurt', 60, 'v'], ['blueberries', 60, 'v'], ['honey', 10, 'c']],
    extras: '1 tsp baking powder, vanilla, cooking spray',
    steps: ['Blend oats, egg, egg whites, yoghurt, baking powder and vanilla into a thick batter.', 'Fold in half the blueberries.', 'Cook in a sprayed pan, 2 minutes per side.', 'Serve with the remaining blueberries and honey.'],
  },

  // ---------- World cuisines: lunch ----------
  {
    id: 'chicken-souvlaki-pita', slot: 'lunch', cuisine: 'Greek', name: 'Chicken souvlaki pita with tzatziki', mins: 20,
    items: [['chicken', 140, 'p'], ['pitaBread', 64, 'c'], ['greekYogurt', 50, 'v'], ['cucumber', 50, 'v'], ['cherryTomato', 50, 'v'], ['oliveOil', 5, 'f'], ['lemon', 5, 'v']],
    extras: 'Oregano, garlic, mint, red onion',
    steps: ['Marinate cubed chicken in lemon, oil, garlic and oregano; grill or pan-fry until charred.', 'Mix yoghurt with grated cucumber, garlic and mint for tzatziki.', 'Warm the pita and fill with chicken, tomato, onion and tzatziki.'],
  },
  {
    id: 'lamb-kofta-couscous', slot: 'lunch', cuisine: 'Middle Eastern', name: 'Lamb kofta with herbed couscous', mins: 25,
    items: [['lambLean', 130, 'p'], ['couscous', 150, 'c'], ['cucumber', 50, 'v'], ['cherryTomato', 50, 'v'], ['greekYogurt', 40, 'v'], ['oliveOil', 5, 'f']],
    extras: 'Cumin, coriander, cinnamon, garlic, parsley, mint',
    steps: ['Mince or finely chop the lamb and mix with garlic and spices; shape onto skewers or into fingers.', 'Grill or pan-fry in the oil for 8–10 minutes.', 'Stir chopped herbs, cucumber and tomato through the couscous.', 'Serve kofta on couscous with a spoon of yoghurt.'],
  },
  {
    id: 'beef-pho', slot: 'lunch', cuisine: 'Vietnamese', name: 'Quick beef pho', mins: 25,
    items: [['beefSteak', 120, 'p'], ['riceNoodles', 160, 'c'], ['spinach', 30, 'v'], ['onion', 30, 'v'], ['lemon', 10, 'v'], ['soySauce', 10, 'v'], ['oliveOil', 3, 'f']],
    extras: 'Beef stock, star anise, cinnamon stick, ginger, fish sauce, Thai basil, chilli',
    steps: ['Simmer stock with star anise, cinnamon, ginger and sliced onion for 15 minutes; season with fish sauce and soy.', 'Sear the steak quickly in the oil, rest, then slice very thinly.', 'Put noodles and spinach in a bowl, pour over the hot broth.', 'Top with beef, basil, chilli and lime.'],
  },
  {
    id: 'chicken-pad-thai', slot: 'lunch', cuisine: 'Thai', name: 'Lighter chicken pad Thai', mins: 20,
    items: [['chicken', 130, 'p'], ['riceNoodles', 150, 'c'], ['egg', 50, 'f'], ['carrot', 40, 'v'], ['cabbage', 50, 'v'], ['peanutButter', 8, 'f'], ['soySauce', 10, 'v'], ['lemon', 10, 'v']],
    extras: 'Fish sauce, garlic, chilli, spring onion, coriander',
    steps: ['Mix soy sauce, fish sauce, lime juice and peanut butter into a sauce.', 'Stir-fry sliced chicken with garlic until cooked; push aside and scramble the egg.', 'Add noodles, shredded cabbage and carrot with the sauce; toss until hot.', 'Top with spring onion, coriander and chilli.'],
  },
  {
    id: 'korean-beef-bowl', slot: 'lunch', cuisine: 'Korean', name: 'Korean beef bulgogi-style rice bowl', mins: 20,
    items: [['beefMince', 130, 'p'], ['whiteRice', 160, 'c'], ['carrot', 40, 'v'], ['cucumber', 50, 'v'], ['cabbage', 40, 'v'], ['soySauce', 15, 'v'], ['oliveOil', 4, 'f']],
    extras: 'Garlic, ginger, 1 tsp brown sugar, gochujang or chilli flakes, sesame seeds',
    steps: ['Brown the mince in the oil with garlic and ginger.', 'Add soy sauce, sugar and gochujang; cook until sticky.', 'Serve over rice with shredded cabbage, carrot and cucumber.'],
  },
  {
    id: 'chicken-katsu-bowl', slot: 'lunch', cuisine: 'Japanese', name: 'Baked chicken katsu rice bowl', mins: 30,
    items: [['chicken', 140, 'p'], ['whiteRice', 150, 'c'], ['oats', 15, 'c'], ['egg', 50, 'f'], ['cabbage', 60, 'v'], ['soySauce', 10, 'v']],
    extras: 'Paprika, garlic powder, cooking spray; katsu sauce: tomato sauce, Worcestershire, soy',
    steps: ['Blitz oats into crumbs with paprika and garlic powder.', 'Dip chicken in beaten egg, then crumbs; spray and bake at 210°C for 18–20 minutes.', 'Slice and serve over rice with shredded cabbage.', 'Drizzle with a quick katsu sauce.'],
  },
  {
    id: 'tuscan-tuna-chickpea-salad', slot: 'lunch', cuisine: 'Italian', name: 'Tuscan tuna, chickpea & tomato salad', mins: 10,
    items: [['tuna', 120, 'p'], ['chickpeas', 80, 'c'], ['cherryTomato', 80, 'v'], ['saladLeaves', 30, 'v'], ['oliveOil', 8, 'f'], ['lemon', 10, 'v'], ['onion', 20, 'v']],
    extras: 'Basil, red wine vinegar, garlic',
    steps: ['Whisk olive oil, lemon, a splash of vinegar and garlic.', 'Toss chickpeas, halved tomatoes, thinly sliced red onion and leaves with the dressing.', 'Flake over tuna and finish with basil.'],
  },
  {
    id: 'halloumi-couscous-salad', slot: 'lunch', cuisine: 'Mediterranean', name: 'Grilled halloumi & roast veg couscous', mins: 30,
    items: [['halloumi', 80, 'p'], ['couscous', 150, 'c'], ['zucchini', 80, 'v'], ['capsicum', 60, 'v'], ['eggplant', 60, 'v'], ['oliveOil', 6, 'f'], ['lemon', 10, 'v']],
    extras: 'Mint, oregano, chilli flakes',
    steps: ['Cube zucchini, capsicum and eggplant, toss with the oil and roast at 210°C for 20 minutes.', 'Grill sliced halloumi for 1–2 minutes per side.', 'Toss couscous with the veg, lemon and mint.', 'Top with halloumi.'],
  },
  {
    id: 'chana-masala', slot: 'lunch', cuisine: 'Indian', name: 'Chana masala with rice', mins: 25,
    items: [['chickpeas', 150, 'p'], ['whiteRice', 140, 'c'], ['passata', 120, 'v'], ['onion', 40, 'v'], ['spinach', 30, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Garlic, ginger, cumin seeds, garam masala, turmeric, chilli, coriander',
    steps: ['Fry cumin seeds in the oil, then add onion, garlic and ginger until soft.', 'Stir in the ground spices, then passata and chickpeas; simmer 12 minutes.', 'Stir through spinach.', 'Serve with rice and coriander.'],
  },
  {
    id: 'chicken-bean-quesadilla', slot: 'lunch', cuisine: 'Mexican', name: 'Chicken & black bean quesadilla', mins: 15,
    items: [['wrap', 60, 'c'], ['chicken', 110, 'p'], ['blackBeans', 50, 'c'], ['mozzarella', 25, 'f'], ['capsicum', 40, 'v'], ['passata', 30, 'v']],
    extras: 'Cumin, smoked paprika, jalapeños',
    steps: ['Cook sliced chicken with the spices; mash the beans lightly.', 'Spread beans over half the wrap and top with chicken, capsicum and mozzarella.', 'Fold and toast in a dry pan until golden on both sides.', 'Serve with passata as salsa.'],
  },
  {
    id: 'nicoise-salad', slot: 'lunch', cuisine: 'French', name: 'Niçoise salad', mins: 20,
    items: [['tuna', 110, 'p'], ['potato', 150, 'c'], ['egg', 50, 'f'], ['greenBeans', 80, 'v'], ['cherryTomato', 60, 'v'], ['saladLeaves', 30, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Dijon mustard, red wine vinegar, olives (optional)',
    steps: ['Boil baby potatoes until tender; add beans for the last 3 minutes; boil the egg for 8 minutes.', 'Whisk oil, mustard and vinegar.', 'Arrange leaves, potatoes, beans, tomatoes, tuna and halved egg; drizzle with dressing.'],
  },
  {
    id: 'jacket-potato-tuna', slot: 'lunch', cuisine: 'British', name: 'Jacket potato with tuna & corn', mins: 15,
    items: [['potato', 250, 'c'], ['tuna', 110, 'p'], ['corn', 40, 'v'], ['greekYogurt', 40, 'v'], ['cheddar', 15, 'f'], ['saladLeaves', 30, 'v']],
    extras: 'Pepper, spring onion',
    steps: ['Prick the potato and microwave 8–10 minutes until soft (or bake 1 hour at 200°C).', 'Mix tuna, corn, yoghurt and pepper.', 'Split the potato, fill with tuna mix and grated cheddar.', 'Serve with a side salad.'],
  },

  // ---------- World cuisines: snacks ----------
  {
    id: 'tuna-onigiri', slot: 'snack', cuisine: 'Japanese', name: 'Tuna & avocado onigiri', mins: 10,
    items: [['whiteRice', 120, 'c'], ['tuna', 70, 'p'], ['avocado', 20, 'f'], ['soySauce', 5, 'v']],
    extras: 'Nori sheet, salt',
    steps: ['Mash tuna with avocado and soy sauce.', 'Wet your hands, take a ball of warm rice and press a well in the middle.', 'Fill with tuna, close and shape into a triangle.', 'Wrap the base with nori.'],
  },
  {
    id: 'tzatziki-pita-veg', slot: 'snack', cuisine: 'Greek', name: 'Tzatziki with pita & veggie sticks', mins: 10,
    items: [['greekYogurt', 150, 'p'], ['cucumber', 80, 'v'], ['pitaBread', 32, 'c'], ['oliveOil', 4, 'f'], ['carrot', 60, 'v']],
    extras: 'Garlic, dill or mint, lemon',
    steps: ['Grate half the cucumber, squeeze out the water and mix into yoghurt with garlic, herbs, lemon and the oil.', 'Cut the rest of the cucumber and the carrot into sticks.', 'Toast pita and cut into wedges for dipping.'],
  },
  {
    id: 'spanish-tortilla-bites', slot: 'snack', cuisine: 'Spanish', name: 'Spanish potato tortilla bites', mins: 25,
    items: [['egg', 100, 'f'], ['eggWhite', 60, 'p'], ['potato', 100, 'c'], ['onion', 30, 'v'], ['oliveOil', 3, 'v']],
    extras: 'Smoked paprika, salt',
    steps: ['Thinly slice potato and onion; microwave 4 minutes until just tender.', 'Fry briefly in the oil, then pour over whisked eggs and egg whites with paprika.', 'Cook gently, covered, until set; flip or finish under the grill.', 'Cool slightly and cut into squares.'],
  },
  {
    id: 'prawn-rice-paper-rolls', slot: 'snack', cuisine: 'Vietnamese', name: 'Prawn rice paper rolls', mins: 20,
    items: [['prawns', 80, 'p'], ['riceNoodles', 60, 'c'], ['carrot', 40, 'v'], ['cucumber', 40, 'v'], ['saladLeaves', 20, 'v'], ['peanutButter', 8, 'f']],
    extras: '4 rice paper sheets, mint, coriander; dipping sauce: peanut butter, lime, soy, warm water',
    steps: ['Cook prawns for 2 minutes and halve lengthways.', 'Soften each rice paper sheet in warm water for a few seconds.', 'Fill with noodles, julienned veg, herbs and prawns; roll tightly.', 'Whisk the peanut butter into a dipping sauce.'],
  },
  {
    id: 'black-bean-dip-chips', slot: 'snack', cuisine: 'Mexican', name: 'Black bean dip with baked tortilla chips', mins: 15,
    items: [['blackBeans', 100, 'p'], ['cornTortilla', 26, 'c'], ['avocado', 30, 'f'], ['cherryTomato', 40, 'v'], ['lemon', 5, 'v']],
    extras: 'Cumin, garlic, chilli, coriander',
    steps: ['Cut the tortilla into wedges and bake at 190°C for 8 minutes.', 'Blend beans with lime, cumin, garlic and a splash of water until smooth.', 'Top with diced tomato, avocado and coriander; serve with the chips.'],
  },
  {
    id: 'caprese-rice-cakes', slot: 'snack', cuisine: 'Italian', name: 'Caprese rice cake stacks', mins: 5,
    items: [['riceCakes', 20, 'c'], ['mozzarella', 40, 'p'], ['cherryTomato', 60, 'v'], ['oliveOil', 3, 'f'], ['spinach', 10, 'v']],
    extras: 'Fresh basil, balsamic, cracked pepper',
    steps: ['Top rice cakes with baby spinach, sliced mozzarella and tomato.', 'Drizzle with oil and balsamic; finish with basil and pepper.'],
  },

  // ---------- World cuisines: dinner ----------
  {
    id: 'chicken-tikka-masala', slot: 'dinner', cuisine: 'Indian', name: 'Lighter chicken tikka masala', mins: 35,
    items: [['chicken', 160, 'p'], ['whiteRice', 150, 'c'], ['passata', 150, 'v'], ['greekYogurt', 50, 'v'], ['onion', 40, 'v'], ['oliveOil', 6, 'f'], ['spinach', 30, 'v']],
    extras: 'Garlic, ginger, garam masala, cumin, paprika, turmeric, chilli, coriander',
    steps: ['Marinate chicken in half the yoghurt and spices (10 minutes or overnight); grill or pan-sear until charred.', 'Soften onion, garlic and ginger in the oil; add the rest of the spices and passata and simmer 10 minutes.', 'Stir in the chicken, remaining yoghurt and spinach.', 'Serve with basmati rice and coriander.'],
  },
  {
    id: 'thai-green-chicken-curry', slot: 'dinner', cuisine: 'Thai', name: 'Thai green chicken curry', mins: 25,
    items: [['chicken', 150, 'p'], ['whiteRice', 150, 'c'], ['coconutMilk', 100, 'f'], ['greenBeans', 60, 'v'], ['zucchini', 60, 'v'], ['capsicum', 40, 'v']],
    extras: '1–2 tbsp green curry paste, fish sauce, lime leaves, Thai basil',
    steps: ['Fry the curry paste in a dry pan for 1 minute.', 'Add sliced chicken and stir to coat, then pour in coconut milk and a little water.', 'Add beans, zucchini and capsicum; simmer 8–10 minutes.', 'Season with fish sauce and lime; serve with jasmine rice and basil.'],
  },
  {
    id: 'kung-pao-chicken', slot: 'dinner', cuisine: 'Chinese', name: 'Kung pao-style chicken', mins: 20,
    items: [['chicken', 160, 'p'], ['whiteRice', 160, 'c'], ['capsicum', 80, 'v'], ['zucchini', 60, 'v'], ['soySauce', 15, 'v'], ['peanutButter', 10, 'f']],
    extras: 'Dried chillies, Sichuan pepper, garlic, ginger, rice vinegar, 1 tsp cornflour',
    steps: ['Mix soy sauce, vinegar, peanut butter, cornflour and a splash of water.', 'Stir-fry diced chicken with chillies, garlic and ginger in a hot pan.', 'Add capsicum and zucchini for 3 minutes, then the sauce; toss until glossy.', 'Serve over rice.'],
  },
  {
    id: 'miso-glazed-fish', slot: 'dinner', cuisine: 'Japanese', name: 'Miso-glazed fish with rice & greens', mins: 20,
    items: [['cod', 180, 'p'], ['whiteRice', 150, 'c'], ['broccoli', 80, 'v'], ['edamame', 50, 'v'], ['soySauce', 10, 'v'], ['oliveOil', 5, 'f'], ['honey', 6, 'c']],
    extras: '1 tbsp white miso paste, ginger',
    steps: ['Mix miso, honey, soy sauce and grated ginger into a glaze.', 'Brush over the fish and grill or bake at 220°C for 10–12 minutes.', 'Stir-fry broccoli and edamame in the oil.', 'Serve fish over rice with the greens.'],
  },
  {
    id: 'korean-gochujang-pork', slot: 'dinner', cuisine: 'Korean', name: 'Korean gochujang pork with rice', mins: 25,
    items: [['porkLoin', 150, 'p'], ['whiteRice', 160, 'c'], ['cabbage', 60, 'v'], ['carrot', 40, 'v'], ['soySauce', 10, 'v'], ['oliveOil', 6, 'f'], ['honey', 5, 'c']],
    extras: '1 tbsp gochujang, garlic, ginger, sesame seeds, spring onion',
    steps: ['Mix gochujang, soy sauce, honey, garlic and ginger.', 'Stir-fry thinly sliced pork in the oil until browned, then add the sauce and cook until sticky.', 'Quickly stir-fry shredded cabbage and carrot.', 'Serve over rice with spring onion.'],
  },
  {
    id: 'chicken-prawn-paella', slot: 'dinner', cuisine: 'Spanish', name: 'Chicken & prawn paella', mins: 35,
    items: [['chicken', 100, 'p'], ['prawns', 60, 'p'], ['whiteRice', 170, 'c'], ['peas', 50, 'v'], ['capsicum', 60, 'v'], ['onion', 30, 'v'], ['passata', 50, 'v'], ['oliveOil', 8, 'f']],
    extras: 'Smoked paprika, saffron or turmeric, garlic, chicken stock, lemon wedges',
    steps: ['Brown diced chicken in the oil; add onion, capsicum, garlic and spices.', 'Stir in rice, passata and a splash of stock; cook 5 minutes without stirring.', 'Add prawns and peas, cover and cook 5–8 minutes until the prawns are pink.', 'Serve with lemon.'],
  },
  {
    id: 'chicken-cacciatore', slot: 'dinner', cuisine: 'Italian', name: 'Chicken cacciatore with pasta', mins: 35,
    items: [['chicken', 160, 'p'], ['pasta', 70, 'c'], ['passata', 200, 'v'], ['capsicum', 60, 'v'], ['mushrooms', 60, 'v'], ['onion', 40, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Garlic, rosemary, oregano, splash of red wine vinegar',
    steps: ['Brown chicken pieces in the oil; set aside.', 'Soften onion, capsicum, mushrooms and garlic; add passata, herbs and vinegar.', 'Return the chicken and simmer 20 minutes.', 'Serve over pasta.'],
  },
  {
    id: 'lighter-moussaka', slot: 'dinner', cuisine: 'Greek', name: 'Lighter beef & eggplant moussaka', mins: 50,
    items: [['beefMince', 140, 'p'], ['eggplant', 150, 'v'], ['potato', 150, 'c'], ['passata', 120, 'v'], ['greekYogurt', 60, 'v'], ['parmesan', 10, 'f'], ['onion', 30, 'v']],
    extras: 'Cinnamon, oregano, garlic, 1 egg yolk (optional, for the topping)',
    steps: ['Slice eggplant and potato thinly and roast at 200°C for 15 minutes.', 'Brown the mince with onion, garlic, cinnamon and oregano; add passata and simmer 10 minutes.', 'Layer potato, mince and eggplant in a dish.', 'Top with yoghurt mixed with parmesan and bake 20 minutes until golden.'],
  },
  {
    id: 'moroccan-chickpea-tagine', slot: 'dinner', cuisine: 'Moroccan', name: 'Moroccan chickpea & pumpkin tagine', mins: 35,
    items: [['chickpeas', 140, 'p'], ['couscous', 150, 'c'], ['pumpkin', 100, 'v'], ['carrot', 50, 'v'], ['passata', 100, 'v'], ['oliveOil', 6, 'f'], ['onion', 30, 'v']],
    extras: 'Ras el hanout or cumin + cinnamon, garlic, ginger, coriander, lemon',
    steps: ['Soften onion, garlic and ginger in the oil with the spices.', 'Add cubed pumpkin, carrot, passata and a cup of water; simmer 15 minutes.', 'Stir in chickpeas and cook 5 minutes more.', 'Serve over couscous with coriander and lemon.'],
  },
  {
    id: 'chicken-shawarma-plate', slot: 'dinner', cuisine: 'Middle Eastern', name: 'Chicken shawarma plate with garlic yoghurt', mins: 30,
    items: [['chicken', 160, 'p'], ['pitaBread', 64, 'c'], ['cabbage', 50, 'v'], ['cucumber', 50, 'v'], ['cherryTomato', 50, 'v'], ['greekYogurt', 50, 'v'], ['oliveOil', 6, 'f']],
    extras: 'Shawarma spice (cumin, paprika, coriander, cinnamon, turmeric), garlic, lemon, parsley',
    steps: ['Toss sliced chicken with oil, lemon and shawarma spice; roast at 220°C for 15–18 minutes.', 'Mix yoghurt with crushed garlic and lemon.', 'Serve chicken with warm pita, shredded cabbage, cucumber, tomato and garlic yoghurt.'],
  },
  {
    id: 'chicken-provencal', slot: 'dinner', cuisine: 'French', name: 'Chicken provençal with roast potatoes', mins: 40,
    items: [['chicken', 160, 'p'], ['potato', 220, 'c'], ['zucchini', 80, 'v'], ['cherryTomato', 80, 'v'], ['onion', 30, 'v'], ['oliveOil', 8, 'f'], ['garlic', 5, 'v']],
    extras: 'Herbes de Provence, olives (optional), salt, pepper',
    steps: ['Cube potatoes, toss with half the oil and roast at 210°C for 15 minutes.', 'Add chicken, zucchini, tomatoes, onion and garlic tossed with the rest of the oil and herbs.', 'Roast 20–25 minutes until the chicken is cooked and the tomatoes have burst.'],
  },
  {
    id: 'pork-schnitzel-cabbage', slot: 'dinner', cuisine: 'German', name: 'Oven pork schnitzel with cabbage & potatoes', mins: 35,
    items: [['porkLoin', 160, 'p'], ['potato', 220, 'c'], ['cabbage', 120, 'v'], ['oats', 15, 'c'], ['egg', 50, 'f']],
    extras: 'Paprika, caraway seeds, apple cider vinegar, mustard, cooking spray',
    steps: ['Pound pork thin; dip in beaten egg then oat crumbs with paprika. Spray and bake at 210°C for 15–18 minutes.', 'Boil potatoes until tender.', 'Braise shredded cabbage with caraway, a splash of vinegar and water for 10 minutes.', 'Serve with mustard.'],
  },
  {
    id: 'baked-fish-and-chips', slot: 'dinner', cuisine: 'British', name: 'Oven-baked fish & chips with peas', mins: 35,
    items: [['cod', 180, 'p'], ['potato', 280, 'c'], ['peas', 80, 'v'], ['oats', 15, 'c'], ['oliveOil', 8, 'f'], ['lemon', 10, 'v']],
    extras: 'Paprika, salt, mint (for the peas)',
    steps: ['Cut potatoes into chips, toss with most of the oil and salt; bake at 220°C for 30 minutes, turning once.', 'Coat fish in oat crumbs with paprika, drizzle with the rest of the oil and bake for the last 12 minutes.', 'Boil peas and lightly crush with mint.', 'Serve with lemon wedges.'],
  },
  {
    id: 'steak-tacos-slaw', slot: 'dinner', cuisine: 'Mexican', name: 'Steak tacos with lime slaw', mins: 20,
    items: [['beefSteak', 150, 'p'], ['cornTortilla', 78, 'c'], ['cabbage', 60, 'v'], ['avocado', 40, 'f'], ['greekYogurt', 30, 'v'], ['lemon', 10, 'v']],
    extras: 'Chilli powder, cumin, garlic, coriander',
    steps: ['Rub steak with the spices and sear 3 minutes per side; rest and slice thinly.', 'Toss shredded cabbage with lime juice and coriander.', 'Warm tortillas and fill with steak, slaw, avocado and yoghurt.'],
  },
  {
    id: 'thai-red-tofu-curry', slot: 'dinner', cuisine: 'Thai', name: 'Thai red curry with tofu', mins: 25,
    items: [['tofu', 180, 'p'], ['whiteRice', 150, 'c'], ['coconutMilk', 100, 'f'], ['capsicum', 60, 'v'], ['zucchini', 60, 'v'], ['spinach', 30, 'v']],
    extras: '1–2 tbsp red curry paste (check it is vegan), lime, Thai basil',
    steps: ['Fry the curry paste for 1 minute, then add coconut milk and a little water.', 'Add cubed tofu, capsicum and zucchini; simmer 8 minutes.', 'Stir through spinach and lime juice.', 'Serve with jasmine rice and basil.'],
  },
];
