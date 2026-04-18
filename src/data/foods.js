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
      omega6: 0.8, // From report analysis
      vitc: 0
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
      b12: 0
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
      calcium: 350, // Typical for calcium-set tofu
      iron: 1.9,
      zinc: 1.1,
      b12: 0
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
      b12: 0
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
      omega6: 11.4,
      iron: 0.8
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
      omega6: 1.8
    },
    category: 'Fats'
  },
  {
    id: 'algae-oil',
    name: 'Algenolie (1 Capsule)',
    unit: 'portion',
    nutrients: {
      epa_dha: 450,
      b12: 0
    },
    category: 'Supplements'
  },
  {
    id: 'sauerkraut-raw',
    name: 'Zuurkool (Rauw/Ongepasteuriseerd)',
    unit: 'g',
    nutrients: {
      calories: 19,
      k2: 5, // ~5-10mcg per 100g
      vitc: 15
    },
    category: 'Vegetables'
  },
  {
    id: 'brazil-nut',
    name: 'Paranoot (1 stuk)',
    unit: 'portion',
    nutrients: {
      calories: 33,
      selenium: 70 // ~50-90mcg
    },
    category: 'Nuts'
  },
  {
    id: 'nori-sheet',
    name: 'Nori Vel (1 vel)',
    unit: 'portion',
    nutrients: {
      calories: 5,
      iodine: 75, // ~50% of ADH
      iron: 0.5
    },
    category: 'Vegetables'
  },
  {
    id: 'bell-pepper-red',
    name: 'Rode Paprika',
    unit: 'g',
    nutrients: {
      calories: 31,
      vitc: 127
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
      iron: 2.5
    },
    category: 'Nuts'
  }
];
