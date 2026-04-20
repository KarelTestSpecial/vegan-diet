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
      vit_b12: 1.0,
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
  }
];
