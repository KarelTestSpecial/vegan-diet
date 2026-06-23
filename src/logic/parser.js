/**
 * Simple parser to extract nutritional data from pasted text.
 */

export function parseNutrientText(text) {
  const nutrients = {};

  const patterns = {
    calories: /calorie|kcal|energie/i,
    protein: /eiwit|prote\w*|protein/i,
    b12: /b12|cobalamine/i,
    ala: /ala|alfa-linoleen/i,
    epa_dha: /epa|dha|algenolie/i,
    iron: /ijzer|iron/i,
    zinc: /zink|zinc/i,
    calcium: /calcium/i,
    iodine: /jodium|iodine/i,
    selenium: /selenium/i,
    magnesium: /magnesium/i,
    potassium: /kalium|potassium/i,
    phosphorus: /fosfor|phosphorus/i,
    vit_a: /vitamine a|retinol/i,
    vit_d: /vitamine d|calciferol/i,
    vit_e: /vitamine e|tocoferol/i,
    vit_k1: /vitamine k1/i,
    vit_k2: /vitamine k2|menaquinone/i,
    vit_b1: /vitamine b1|thiamine/i,
    vit_b2: /vitamine b2|riboflavine/i,
    vit_b3: /vitamine b3|niacin/i,
    vit_b5: /vitamine b5|pantotheen/i,
    vit_b6: /vitamine b6|pyridoxine/i,
    vit_b7: /biotine|vitamine b7/i,
    vit_b9: /foliumzuur|folate|b9/i,
    vitc: /vitamine c|ascorbine/i,
    choline: /choline/i,
    lysine: /lysine/i,
    methionine: /methionine/i,
    copper: /koper|copper/i,
    manganese: /mangaan|manganese/i
  };

  const lines = text.split('\n');
  lines.forEach(line => {
    Object.entries(patterns).forEach(([key, pattern]) => {
      const pMatch = line.match(pattern);
      if (pMatch) {
        // Find index after the keyword to avoid matching "12" in "B12"
        const afterKeyword = line.substring(pMatch.index + pMatch[0].length);
        const match = afterKeyword.match(/(\d+[.,]?\d*)/);
        if (match) {
          let val = parseFloat(match[1].replace(',', '.'));
          nutrients[key] = val;
        } else {
          // Check before keyword as fallback
          const beforeKeyword = line.substring(0, pMatch.index);
          const matchBefore = beforeKeyword.match(/(\d+[.,]?\d*)/);
          if (matchBefore) {
            nutrients[key] = parseFloat(matchBefore[1].replace(',', '.'));
          }
        }
      }
    });
  });

  return nutrients;
}

/**
 * Parse TSV data into product objects.
 */
export function parseTSVProducts(tsv) {
  const lines = tsv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const product = {
      name: '',
      ingredients: '',
      unit: 'g',
      nutrients: {}
    };

    headers.forEach((header, index) => {
      const val = cols[index] ? cols[index].trim() : '';
      if (header === 'naam' || header === 'name') product.name = val;
      else if (header === 'ingrediënten' || header === 'ingredients') product.ingredients = val;
      else if (header === 'unit') product.unit = val;
      else {
        // Map header to nutrient key
        const keyMap = {
          'eiwit': 'protein',
          'protein': 'protein',
          'b12': 'b12',
          'ala': 'ala',
          'ijzer': 'iron',
          'iron': 'iron',
          'calcium': 'calcium',
          'zink': 'zinc',
          'zinc': 'zinc',
          'jodium': 'iodine',
          'iodine': 'iodine',
          'selenium': 'selenium',
          'kcal': 'calories',
          'calories': 'calories',
          'energie': 'calories',
          'magnesium': 'magnesium',
          'kalium': 'potassium',
          'potassium': 'potassium',
          'fosfor': 'phosphorus',
          'phosphorus': 'phosphorus',
          'vitamine a': 'vit_a',
          'vitamin a': 'vit_a',
          'vitamine d': 'vit_d',
          'vitamin d': 'vit_d',
          'vitamine e': 'vit_e',
          'vitamin e': 'vit_e',
          'vitamine k1': 'vit_k1',
          'vitamin k1': 'vit_k1',
          'vitamine k2': 'vit_k2',
          'vitamin k2': 'vit_k2',
          'vitamine b1': 'vit_b1',
          'vitamin b1': 'vit_b1',
          'vitamine b2': 'vit_b2',
          'vitamin b2': 'vit_b2',
          'vitamine b3': 'vit_b3',
          'vitamin b3': 'vit_b3',
          'vitamine b5': 'vit_b5',
          'vitamin b5': 'vit_b5',
          'vitamine b6': 'vit_b6',
          'vitamin b6': 'vit_b6',
          'biotine': 'vit_b7',
          'biotin': 'vit_b7',
          'foliumzuur': 'vit_b9',
          'folate': 'vit_b9',
          'vitamine c': 'vitc',
          'vitamin c': 'vitc',
          'choline': 'choline',
          'lysine': 'lysine',
          'methionine': 'methionine',
          'koper': 'copper',
          'copper': 'copper',
          'mangaan': 'manganese',
          'manganese': 'manganese'
        };
        const key = keyMap[header] || header;
        if (val) {
          product.nutrients[key] = parseFloat(val.replace(',', '.')) || 0;
        }
      }
    });

    if (product.name) products.push(product);
  }

  return products;
}
