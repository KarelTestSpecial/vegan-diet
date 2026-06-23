/**
 * Nutritional database based on the "Vegan Gids" and common Colruyt (Boni/Everyday) products.
 * Values are mostly per 100g unless specified.
 */
export const foods = [
  {
    id: 'soy-milk-enriched',
    name: 'Sojamelk (Enriched - Everyday/Boni)',
    unit: 'ml',
    nutrients: {
      calories: 39,
      protein: 3.3,
      b12: 0.38,
      iron: 0.5,
      calcium: 120,
      ala: 0.1,
      vit_d: 0.75,
      vit_b2: 0.21,
      magnesium: 15,
      potassium: 120,
      iodine: 22.5
    },
    category: 'Drinks'
  },
  {
    id: 'lentils-brown-boni',
    name: 'Boni Plan\'t Bruine Linzen (Blik)',
    unit: 'g',
    nutrients: {
      calories: 89,
      protein: 8.8,
      iron: 2.1,
      zinc: 1.1,
      vitc: 0,
      b12: 0,
      magnesium: 36,
      potassium: 369,
      phosphorus: 180,
      vit_b1: 0.17,
      vit_b6: 0.18,
      vit_b9: 181,
      copper: 0.25,
      manganese: 0.5
    },
    category: 'Legumes'
  },
  {
    id: 'tofu-natural-boni',
    name: 'Boni Plan\'t Tofu Natuur',
    unit: 'g',
    nutrients: {
      calories: 146,
      protein: 15.0,
      calcium: 350,
      iron: 1.9,
      zinc: 1.1,
      b12: 0,
      magnesium: 60,
      selenium: 17,
      vit_b1: 0.1,
      vit_b3: 0.2,
      lysine: 1000,
      methionine: 200
    },
    category: 'Protein'
  },
  {
    id: 'seitan-boni',
    name: 'Boni Plan\'t Seitan',
    unit: 'g',
    nutrients: {
      calories: 120,
      protein: 25.0,
      iron: 1.2,
      b12: 0,
      selenium: 22,
      magnesium: 15,
      phosphorus: 120,
      copper: 0.1,
      manganese: 0.1
    },
    category: 'Protein'
  },
  {
    id: 'walnuts',
    name: 'Walnoten (Handje 30g)',
    unit: 'portion',
    nutrients: {
      calories: 196,
      protein: 4.5,
      ala: 2700,
      iron: 0.8,
      magnesium: 47,
      zinc: 0.9,
      vit_b6: 0.16,
      vit_b9: 29,
      copper: 0.4,
      manganese: 1.0,
      vit_e: 0.2
    },
    category: 'Nuts'
  },
  {
    id: 'flaxseed-oil',
    name: 'Lijnzaadolie (Boni Bio - 1 el)',
    unit: 'portion',
    nutrients: {
      calories: 120,
      ala: 7100,
      vit_e: 2.5,
      vit_k1: 1
    },
    category: 'Fats'
  },
  {
    id: 'algae-oil',
    name: 'Algenolie (1 Capsule)',
    unit: 'portion',
    nutrients: {
      epa_dha: 450,
      b12: 0,
      vit_d: 10,
      vit_e: 5
    },
    category: 'Supplements'
  },
  {
    id: 'sauerkraut-raw',
    name: 'Zuurkool (Rauw/Ongepasteuriseerd)',
    unit: 'g',
    nutrients: {
      calories: 19,
      vit_k2: 5,
      vitc: 15,
      iron: 1.5,
      magnesium: 13,
      potassium: 170,
      vit_b6: 0.1
    },
    category: 'Vegetables'
  },
  {
    id: 'brazil-nut',
    name: 'Paranoot (1 stuk)',
    unit: 'portion',
    nutrients: {
      calories: 33,
      selenium: 70,
      magnesium: 15,
      phosphorus: 35,
      vit_e: 0.3
    },
    category: 'Nuts'
  },
  {
    id: 'nori-sheet',
    name: 'Nori Vel (1 vel)',
    unit: 'portion',
    nutrients: {
      calories: 5,
      iodine: 75,
      iron: 0.5,
      vit_a: 50,
      b12: 1.0,
      vitc: 1.0
    },
    category: 'Vegetables'
  },
  {
    id: 'bell-pepper-red',
    name: 'Rode Paprika',
    unit: 'g',
    nutrients: {
      calories: 31,
      vitc: 127,
      vit_a: 150,
      vit_b6: 0.3,
      vit_b9: 46,
      vit_e: 1.6,
      potassium: 211
    },
    category: 'Vegetables'
  },
  {
    id: 'pumpkin-seeds',
    name: 'Pompoenpitten (30g)',
    unit: 'portion',
    nutrients: {
      calories: 170,
      protein: 9,
      zinc: 2.3,
      iron: 2.5,
      magnesium: 150,
      phosphorus: 350,
      potassium: 240,
      manganese: 1.3,
      copper: 0.4
    },
    category: 'Nuts'
  },

  // --- Generieke whole foods (basiscatalogus uitgebreid 2026-06-23) ---
  // Waarden per 100 g (unit 'g') of per 100 ml (unit 'ml'), gangbare referentiewaarden.

  // Granen
  {
    id: 'oats-rolled',
    name: 'Havermout (droog)',
    unit: 'g',
    nutrients: {
      calories: 379, protein: 13.2, iron: 4.7, zinc: 4.0, magnesium: 177,
      phosphorus: 523, potassium: 429, vit_b1: 0.46, vit_b6: 0.12, vit_b9: 32,
      manganese: 4.9, copper: 0.6, selenium: 28, ala: 100
    },
    category: 'Grains'
  },
  {
    id: 'quinoa-cooked',
    name: 'Quinoa (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 120, protein: 4.4, iron: 1.5, zinc: 1.1, magnesium: 64,
      phosphorus: 152, potassium: 172, vit_b9: 42, manganese: 0.6, copper: 0.2, ala: 90
    },
    category: 'Grains'
  },
  {
    id: 'brown-rice-cooked',
    name: 'Zilvervliesrijst (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 123, protein: 2.7, iron: 0.6, zinc: 0.6, magnesium: 39,
      phosphorus: 103, potassium: 86, vit_b1: 0.1, vit_b3: 1.5, manganese: 0.9, selenium: 6
    },
    category: 'Grains'
  },
  {
    id: 'wholewheat-bread',
    name: 'Volkorenbrood',
    unit: 'g',
    nutrients: {
      calories: 247, protein: 13.0, iron: 2.5, zinc: 1.8, magnesium: 75,
      phosphorus: 200, potassium: 250, vit_b1: 0.4, vit_b3: 4.4, vit_b9: 42,
      manganese: 2.2, selenium: 30
    },
    category: 'Grains'
  },

  // Peulvruchten
  {
    id: 'chickpeas-cooked',
    name: 'Kikkererwten (gekookt/blik)',
    unit: 'g',
    nutrients: {
      calories: 139, protein: 8.4, iron: 2.1, zinc: 1.5, calcium: 45, magnesium: 48,
      phosphorus: 168, potassium: 291, vit_b9: 172, manganese: 1.0, copper: 0.35, lysine: 600
    },
    category: 'Legumes'
  },
  {
    id: 'black-beans-cooked',
    name: 'Zwarte bonen (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 132, protein: 8.9, iron: 2.1, zinc: 1.1, calcium: 27, magnesium: 70,
      phosphorus: 140, potassium: 355, vit_b9: 149, manganese: 0.4, copper: 0.2, lysine: 600
    },
    category: 'Legumes'
  },
  {
    id: 'kidney-beans-cooked',
    name: 'Kidneybonen (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 127, protein: 8.7, iron: 2.2, zinc: 1.0, calcium: 35, magnesium: 45,
      phosphorus: 138, potassium: 405, vit_b9: 130, manganese: 0.5, copper: 0.2, lysine: 600
    },
    category: 'Legumes'
  },
  {
    id: 'edamame-cooked',
    name: 'Edamame (gekookte sojabonen)',
    unit: 'g',
    nutrients: {
      calories: 121, protein: 11.9, iron: 2.3, zinc: 1.4, calcium: 63, magnesium: 64,
      phosphorus: 169, potassium: 436, vit_b9: 311, vit_k1: 26, manganese: 1.0, copper: 0.3,
      ala: 360, lysine: 900, methionine: 200
    },
    category: 'Legumes'
  },
  {
    id: 'red-lentils-cooked',
    name: 'Rode linzen (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 116, protein: 9.0, iron: 3.3, zinc: 1.3, magnesium: 36, phosphorus: 180,
      potassium: 369, vit_b9: 181, vit_b1: 0.17, vit_b6: 0.18, copper: 0.25, manganese: 0.5, lysine: 650
    },
    category: 'Legumes'
  },

  // Eiwitbronnen
  {
    id: 'tempeh',
    name: 'Tempeh',
    unit: 'g',
    nutrients: {
      calories: 192, protein: 20.3, iron: 2.7, zinc: 1.1, calcium: 111, magnesium: 81,
      phosphorus: 266, potassium: 412, vit_b2: 0.36, vit_b3: 2.6, manganese: 1.3, copper: 0.6,
      ala: 200, lysine: 1100, methionine: 250
    },
    category: 'Protein'
  },
  {
    id: 'soy-tvp-dry',
    name: 'Sojavlokken / TVP (droog)',
    unit: 'g',
    nutrients: {
      calories: 333, protein: 52.0, iron: 9.0, zinc: 4.0, calcium: 240, magnesium: 290,
      phosphorus: 670, potassium: 2100, vit_b2: 0.6, vit_b9: 305, copper: 1.5, manganese: 2.5,
      lysine: 3200, methionine: 600
    },
    category: 'Protein'
  },

  // Groenten
  {
    id: 'broccoli-cooked',
    name: 'Broccoli (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 35, protein: 2.4, iron: 0.7, zinc: 0.4, calcium: 40, magnesium: 21,
      potassium: 293, vitc: 65, vit_a: 77, vit_k1: 141, vit_b9: 108, manganese: 0.2
    },
    category: 'Vegetables'
  },
  {
    id: 'spinach-cooked',
    name: 'Spinazie (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 23, protein: 3.0, iron: 3.6, zinc: 0.8, calcium: 136, magnesium: 87,
      potassium: 466, vitc: 10, vit_a: 524, vit_k1: 494, vit_b9: 146, manganese: 0.9
    },
    category: 'Vegetables'
  },
  {
    id: 'kale-raw',
    name: 'Boerenkool (rauw)',
    unit: 'g',
    nutrients: {
      calories: 49, protein: 4.3, iron: 1.5, zinc: 0.4, calcium: 150, magnesium: 47,
      potassium: 491, vitc: 120, vit_a: 500, vit_k1: 705, vit_b6: 0.3, manganese: 0.7
    },
    category: 'Vegetables'
  },
  {
    id: 'sweet-potato-cooked',
    name: 'Zoete aardappel (gekookt)',
    unit: 'g',
    nutrients: {
      calories: 90, protein: 2.0, iron: 0.7, calcium: 38, magnesium: 27, potassium: 475,
      vitc: 20, vit_a: 961, vit_b6: 0.3, manganese: 0.5, copper: 0.2
    },
    category: 'Vegetables'
  },

  // Fruit
  {
    id: 'banana',
    name: 'Banaan',
    unit: 'g',
    nutrients: {
      calories: 89, protein: 1.1, iron: 0.3, calcium: 5, magnesium: 27, potassium: 358,
      vitc: 8.7, vit_b6: 0.4, vit_b9: 20, manganese: 0.3
    },
    category: 'Fruits'
  },
  {
    id: 'orange',
    name: 'Sinaasappel',
    unit: 'g',
    nutrients: {
      calories: 47, protein: 0.9, calcium: 40, magnesium: 10, potassium: 181,
      vitc: 53, vit_b9: 30, vit_b1: 0.09
    },
    category: 'Fruits'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    unit: 'g',
    nutrients: {
      calories: 160, protein: 2.0, iron: 0.6, magnesium: 29, potassium: 485, vitc: 10,
      vit_e: 2.1, vit_k1: 21, vit_b5: 1.4, vit_b6: 0.3, vit_b9: 81, copper: 0.2, manganese: 0.1
    },
    category: 'Fruits'
  },
  {
    id: 'dates-medjoul',
    name: 'Dadels (Medjoul)',
    unit: 'g',
    nutrients: {
      calories: 277, protein: 1.8, iron: 0.9, calcium: 64, magnesium: 54, potassium: 696,
      vit_b6: 0.2, manganese: 0.3, copper: 0.4
    },
    category: 'Fruits'
  },

  // Noten & zaden
  {
    id: 'almonds',
    name: 'Amandelen',
    unit: 'g',
    nutrients: {
      calories: 579, protein: 21.2, iron: 3.7, zinc: 3.1, calcium: 269, magnesium: 270,
      phosphorus: 481, potassium: 733, vit_e: 25.6, vit_b2: 1.1, manganese: 2.2, copper: 1.0
    },
    category: 'Nuts'
  },
  {
    id: 'chia-seeds',
    name: 'Chiazaad',
    unit: 'g',
    nutrients: {
      calories: 486, protein: 16.5, iron: 7.7, zinc: 4.6, calcium: 631, magnesium: 335,
      phosphorus: 860, potassium: 407, ala: 17800, manganese: 2.7, copper: 0.9, selenium: 55
    },
    category: 'Nuts'
  },
  {
    id: 'hemp-seeds',
    name: 'Hennepzaad (gepeld)',
    unit: 'g',
    nutrients: {
      calories: 553, protein: 31.6, iron: 7.9, zinc: 9.9, calcium: 70, magnesium: 700,
      phosphorus: 1650, potassium: 1200, ala: 8700, omega6: 28.7, vit_e: 0.8,
      manganese: 7.6, copper: 1.6
    },
    category: 'Nuts'
  },
  {
    id: 'tahini',
    name: 'Tahin (sesampasta)',
    unit: 'g',
    nutrients: {
      calories: 595, protein: 17.0, iron: 8.9, zinc: 4.6, calcium: 426, magnesium: 95,
      phosphorus: 732, potassium: 414, vit_b1: 1.2, vit_b3: 5.5, manganese: 1.5, copper: 1.5,
      methionine: 560, ala: 380
    },
    category: 'Nuts'
  },

  // Dranken & verrijkt
  {
    id: 'oat-milk-enriched',
    name: 'Haverdrink (verrijkt)',
    unit: 'ml',
    nutrients: {
      calories: 46, protein: 0.3, calcium: 120, vit_d: 1.5, b12: 0.38, vit_b2: 0.21,
      iodine: 22.5, potassium: 130, phosphorus: 90
    },
    category: 'Drinks'
  },
  {
    id: 'nutritional-yeast-fortified',
    name: 'Voedingsgist (verrijkt)',
    unit: 'g',
    nutrients: {
      calories: 355, protein: 50.0, b12: 120, iron: 5.0, zinc: 18.0, vit_b1: 10.0,
      vit_b2: 9.0, vit_b3: 50.0, vit_b6: 8.0, vit_b9: 250, selenium: 10, magnesium: 120,
      potassium: 2000, phosphorus: 1300, lysine: 3000
    },
    category: 'Supplements'
  },

  // --- Geporteerd van main-branch (Belgische/merkproducten, rauwe groenten/fruit, fiber) — 2026-06-23 ---
  {
    id: "almond-milk-enriched",
    name: "Amandelmelk (Enriched)",
    unit: "ml",
    nutrients: { calories: 15, protein: 0.5, b12: 0.38, calcium: 120, iron: 0.1 },
    category: "Drinks"
  },
  {
    id: "tomato-raw",
    name: "Tomaat (Rauw)",
    unit: "g",
    nutrients: { calories: 19, protein: 1, iron: 0.2, calcium: 14, fiber: 1, vitc: 14 },
    category: "Vegetables"
  },
  {
    id: "cucumber-raw",
    name: "Komkommer (Rauw)",
    unit: "g",
    nutrients: { calories: 14, protein: 0.6, iron: 0.5, calcium: 15, fiber: 0.9 },
    category: "Vegetables"
  },
  {
    id: "chicory-raw",
    name: "Witloof (Rauw)",
    unit: "g",
    nutrients: { calories: 15, protein: 1.1, iron: 0.6, calcium: 23, fiber: 2.3 },
    category: "Vegetables"
  },
  {
    id: "whole-wheat-bread",
    name: "Volkorenbrood",
    unit: "g",
    nutrients: { calories: 234, protein: 11.1, iron: 2, calcium: 34, fiber: 6.7 },
    category: "Grains"
  },
  {
    id: "oatmeal-everyday",
    name: "Havermout (Everyday/Boni)",
    unit: "g",
    nutrients: { calories: 370, protein: 13, iron: 4, zinc: 3, fiber: 10 },
    category: "Grains"
  },
  {
    id: "chickpeas-boni",
    name: "Boni Plan't Kikkererwten (Blik)",
    unit: "g",
    nutrients: { calories: 120, protein: 7, iron: 2.1, zinc: 1, fiber: 6 },
    category: "Legumes"
  },
  {
    id: "peas-canned-boni",
    name: "Boni Erwten (Blik)",
    unit: "g",
    nutrients: { calories: 88, protein: 6.5, iron: 1.5, fiber: 5.2 },
    category: "Legumes"
  },
  {
    id: "white-beans-tomato-everyday",
    name: "Everyday Witte Bonen in Tomatensaus",
    unit: "g",
    nutrients: { calories: 87, protein: 3.7, iron: 1.8, fiber: 4.4 },
    category: "Legumes"
  },
  {
    id: "tempeh-boni",
    name: "Boni Plan't Tempeh",
    unit: "g",
    nutrients: { calories: 190, protein: 19, calcium: 110, iron: 2.7, zinc: 1.1 },
    category: "Protein"
  },
  {
    id: "nutritional-yeast",
    name: "Edelgistvlokken (1 el - 5g)",
    unit: "portion",
    nutrients: { calories: 17, protein: 2.5, b12: 2.2, zinc: 1 },
    category: "Supplements"
  },
  {
    id: "peanut-butter-everyday",
    name: "Pindakaas (Everyday/Boni)",
    unit: "g",
    nutrients: { calories: 600, protein: 25, iron: 2, zinc: 2.5 },
    category: "Fats"
  },
  {
    id: "broccoli-raw",
    name: "Broccoli (Rauw)",
    unit: "g",
    nutrients: { calories: 34, protein: 2.8, vitc: 89, calcium: 47, iron: 0.7 },
    category: "Vegetables"
  },
  {
    id: "spinach-raw",
    name: "Spinazie (Rauw)",
    unit: "g",
    nutrients: { calories: 23, protein: 2.9, iron: 2.7, calcium: 99, fiber: 2.2, vitc: 28, vit_k1: 483 },
    category: "Vegetables"
  },
  {
    id: "red-cabbage-raw",
    name: "Rodekool (Rauw)",
    unit: "g",
    nutrients: { calories: 31, protein: 1.4, iron: 0.8, calcium: 45, fiber: 2.5, vitc: 57, vit_k1: 38 },
    category: "Vegetables"
  },
  {
    id: "arugula-raw",
    name: "Rucola (Rauw)",
    unit: "g",
    nutrients: { calories: 25, protein: 2.6, iron: 1.5, calcium: 160, fiber: 1.6, vitc: 15, vit_k1: 109 },
    category: "Vegetables"
  },
  {
    id: "butterhead-lettuce-raw",
    name: "Kropsla (Rauw)",
    unit: "g",
    nutrients: { calories: 13, protein: 1.2, iron: 1.2, calcium: 35, fiber: 1.1, vitc: 10, vit_k1: 126 },
    category: "Vegetables"
  },
  {
    id: "tahini-boni",
    name: "Boni Bio Tahin",
    unit: "g",
    nutrients: { calories: 600, protein: 18, calcium: 420, iron: 9, zinc: 4.6 },
    category: "Fats"
  },
  {
    id: "rapeseed-oil-everyday",
    name: "Koolzaadolie (Everyday/Boni)",
    unit: "ml",
    nutrients: { calories: 828, ala: 9100, omega6: 18000 },
    category: "Fats"
  },
  {
    id: "white-cabbage-grated",
    name: "Geraspte Witte Kool (Boni)",
    unit: "g",
    nutrients: { calories: 25, vitc: 36, fiber: 2.5 },
    category: "Vegetables"
  },
  {
    id: "apple-syrup-boni",
    name: "Appelstroop (Boni)",
    unit: "g",
    nutrients: { calories: 270, iron: 15 },
    category: "Supplements"
  },
  {
    id: "apple-raw",
    name: "Appel (met schil)",
    unit: "g",
    nutrients: { calories: 52, protein: 0.3, iron: 0.1, fiber: 2.4, vitc: 4.6 },
    category: "Fruit"
  },
  {
    id: "orange-raw",
    name: "Appelsien",
    unit: "g",
    nutrients: { calories: 47, protein: 0.9, iron: 0.1, fiber: 2.4, vitc: 53.2 },
    category: "Fruit"
  },
  {
    id: "banana-raw",
    name: "Banaan",
    unit: "g",
    nutrients: { calories: 89, protein: 1.1, iron: 0.3, fiber: 2.6, vitc: 8.7, selenium: 1 },
    category: "Fruit"
  },
  {
    id: "supplement-b12",
    name: "B12 Supplement (100μg)",
    unit: "portion",
    nutrients: { b12: 100 },
    category: "Supplements"
  },
  {
    id: "supplement-k2",
    name: "K2 Supplement (100μg)",
    unit: "portion",
    nutrients: { vit_k2: 100 },
    category: "Supplements"
  },
  {
    id: "supplement-seleen",
    name: "Seleen Supplement (50μg)",
    unit: "portion",
    nutrients: { selenium: 50 },
    category: "Supplements"
  },
];
