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
      omega6: 0.8,
      vitc: 0
    },
    category: 'Drinks'
  },
  {
    id: 'oat-milk-enriched',
    name: 'Havermelk (Enriched)',
    unit: 'ml',
    nutrients: {
      calories: 45,
      protein: 1.0,
      b12: 0.38,
      calcium: 120,
      iron: 0.2
    },
    category: 'Drinks'
  },
  {
    id: 'almond-milk-enriched',
    name: 'Amandelmelk (Enriched)',
    unit: 'ml',
    nutrients: {
      calories: 15,
      protein: 0.5,
      b12: 0.38,
      calcium: 120,
      iron: 0.1
    },
    category: 'Drinks'
  },
  {
    id: 'tomato-raw',
    name: 'Tomaat (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 19,
      protein: 1.0,
      iron: 0.2,
      calcium: 14,
      fiber: 1.0,
      vitc: 14
    },
    category: 'Vegetables'
  },
  {
    id: 'cucumber-raw',
    name: 'Komkommer (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 14,
      protein: 0.6,
      iron: 0.5,
      calcium: 15,
      fiber: 0.9
    },
    category: 'Vegetables'
  },
  {
    id: 'chicory-raw',
    name: 'Witloof (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 15,
      protein: 1.1,
      iron: 0.6,
      calcium: 23,
      fiber: 2.3
    },
    category: 'Vegetables'
  },
  {
    id: 'whole-wheat-bread',
    name: 'Volkorenbrood',
    unit: 'g',
    nutrients: {
      calories: 234,
      protein: 11.1,
      iron: 2.0,
      calcium: 34,
      fiber: 6.7
    },
    category: 'Grains'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    unit: 'g',
    nutrients: {
      calories: 160,
      protein: 2.0,
      iron: 0.4,
      calcium: 10,
      fiber: 6.7
    },
    category: 'Vegetables'
  },
  {
    id: 'oatmeal-everyday',
    name: 'Havermout (Everyday/Boni)',
    unit: 'g',
    nutrients: {
      calories: 370,
      protein: 13.0,
      iron: 4.0,
      zinc: 3.0,
      fiber: 10.0
    },
    category: 'Grains'
  },
  {
    id: 'chickpeas-boni',
    name: 'Boni Plan\'t Kikkererwten (Blik)',
    unit: 'g',
    nutrients: {
      calories: 120,
      protein: 7.0,
      iron: 2.1,
      zinc: 1.0,
      fiber: 6.0
    },
    category: 'Legumes'
  },
  {
    id: 'peas-canned-boni',
    name: 'Boni Erwten (Blik)',
    unit: 'g',
    nutrients: {
      calories: 88,
      protein: 6.5,
      iron: 1.5,
      fiber: 5.2
    },
    category: 'Legumes'
  },
  {
    id: 'white-beans-tomato-everyday',
    name: 'Everyday Witte Bonen in Tomatensaus',
    unit: 'g',
    nutrients: {
      calories: 87,
      protein: 3.7,
      iron: 1.8,
      fiber: 4.4
    },
    category: 'Legumes'
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
      calcium: 350,
      iron: 1.9,
      zinc: 1.1,
      b12: 0
    },
    category: 'Protein'
  },
  {
    id: 'tempeh-boni',
    name: 'Boni Plan\'t Tempeh',
    unit: 'g',
    nutrients: {
      calories: 190,
      protein: 19.0,
      calcium: 110,
      iron: 2.7,
      zinc: 1.1
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
    id: 'nutritional-yeast',
    name: 'Edelgistvlokken (1 el - 5g)',
    unit: 'portion',
    nutrients: {
      calories: 17,
      protein: 2.5,
      b12: 2.2, // Assuming fortified
      zinc: 1.0
    },
    category: 'Supplements'
  },
  {
    id: 'peanut-butter-everyday',
    name: 'Pindakaas (Everyday/Boni)',
    unit: 'g',
    nutrients: {
      calories: 600,
      protein: 25.0,
      iron: 2.0,
      zinc: 2.5
    },
    category: 'Fats'
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
    id: 'chia-seeds',
    name: 'Chiazaad (1 el - 15g)',
    unit: 'portion',
    nutrients: {
      calories: 70,
      protein: 2.5,
      ala: 2700,
      calcium: 95,
      iron: 1.1
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
      k2: 5,
      vitc: 15
    },
    category: 'Vegetables'
  },
  {
    id: 'broccoli-raw',
    name: 'Broccoli (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 34,
      protein: 2.8,
      vitc: 89,
      calcium: 47,
      iron: 0.7
    },
    category: 'Vegetables'
  },
  {
    id: 'spinach-raw',
    name: 'Spinazie (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 23,
      protein: 2.9,
      iron: 2.7,
      calcium: 99,
      fiber: 2.2,
      vitc: 28,
      k1: 483
    },
    category: 'Vegetables'
  },
  {
    id: 'kale-raw',
    name: 'Boerenkool (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 49,
      protein: 4.3,
      iron: 1.5,
      calcium: 150,
      fiber: 3.6,
      vitc: 120,
      k1: 705
    },
    category: 'Vegetables'
  },
  {
    id: 'red-cabbage-raw',
    name: 'Rodekool (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 31,
      protein: 1.4,
      iron: 0.8,
      calcium: 45,
      fiber: 2.5,
      vitc: 57,
      k1: 38
    },
    category: 'Vegetables'
  },
  {
    id: 'arugula-raw',
    name: 'Rucola (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 25,
      protein: 2.6,
      iron: 1.5,
      calcium: 160,
      fiber: 1.6,
      vitc: 15,
      k1: 109
    },
    category: 'Vegetables'
  },
  {
    id: 'butterhead-lettuce-raw',
    name: 'Kropsla (Rauw)',
    unit: 'g',
    nutrients: {
      calories: 13,
      protein: 1.2,
      iron: 1.2,
      calcium: 35,
      fiber: 1.1,
      vitc: 10,
      k1: 126
    },
    category: 'Vegetables'
  },
  {
    id: 'brazil-nut',
    name: 'Paranoot (1 stuk)',
    unit: 'portion',
    nutrients: {
      calories: 33,
      selenium: 70
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
  },
  {
    id: 'tahini-boni',
    name: 'Boni Bio Tahin',
    unit: 'g',
    nutrients: {
      calories: 600,
      protein: 18.0,
      calcium: 420,
      iron: 9.0,
      zinc: 4.6
    },
    category: 'Fats'
  },
  {
    id: 'rapeseed-oil-everyday',
    name: 'Koolzaadolie (Everyday/Boni)',
    unit: 'ml',
    nutrients: {
      calories: 828,
      ala: 9100,
      omega6: 18000
    },
    category: 'Fats'
  },
  {
    id: 'white-cabbage-grated',
    name: 'Geraspte Witte Kool (Boni)',
    unit: 'g',
    nutrients: {
      calories: 25,
      vitc: 36,
      fiber: 2.5
    },
    category: 'Vegetables'
  },
  {
    id: 'apple-syrup-boni',
    name: 'Appelstroop (Boni)',
    unit: 'g',
    nutrients: {
      calories: 270,
      iron: 15.0
    },
    category: 'Supplements'
  },
  {
    id: 'apple-raw',
    name: 'Appel (met schil)',
    unit: 'g',
    nutrients: {
      calories: 52,
      protein: 0.3,
      iron: 0.1,
      fiber: 2.4,
      vitc: 4.6
    },
    category: 'Fruit'
  },
  {
    id: 'orange-raw',
    name: 'Appelsien',
    unit: 'g',
    nutrients: {
      calories: 47,
      protein: 0.9,
      iron: 0.1,
      fiber: 2.4,
      vitc: 53.2
    },
    category: 'Fruit'
  },
  {
    id: 'banana-raw',
    name: 'Banaan',
    unit: 'g',
    nutrients: {
      calories: 89,
      protein: 1.1,
      iron: 0.3,
      fiber: 2.6,
      vitc: 8.7,
      selenium: 1.0
    },
    category: 'Fruit'
  },
  {
    id: 'supplement-b12',
    name: 'B12 Supplement (100μg)',
    unit: 'portion',
    nutrients: {
      b12: 100
    },
    category: 'Supplements'
  },
  {
    id: 'supplement-k2',
    name: 'K2 Supplement (100μg)',
    unit: 'portion',
    nutrients: {
      k2: 100
    },
    category: 'Supplements'
  },
  {
    id: 'supplement-seleen',
    name: 'Seleen Supplement (50μg)',
    unit: 'portion',
    nutrients: {
      selenium: 50
    },
    category: 'Supplements'
  }
];
