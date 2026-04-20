/**
 * Simple parser to extract nutritional data from pasted text.
 */

export function parseNutrientText(text) {
  const nutrients = {
    calories: 0,
    protein: 0,
    b12: 0,
    ala: 0,
    epa_dha: 0,
    iron: 0,
    zinc: 0,
    calcium: 0,
    vitc: 0,
    iodine: 0,
    selenium: 0,
    omega6: 0,
    fiber: 0
  };

  const patterns = {
    calories: /calorie|kcal|energie/i,
    protein: /eiwit|prote\w*|protein/i,
    b12: /b12|cobalamine/i,
    ala: /ala|alfa-linoleen/i,
    epa_dha: /epa|dha|algenolie/i,
    iron: /ijzer|iron/i,
    zinc: /zink|zinc/i,
    calcium: /calcium/i,
    vitc: /vitamine c|ascorbine/i,
    iodine: /jodium|iodine/i,
    selenium: /selenium/i,
    omega6: /omega-6|linolzuur/i,
    fiber: /vezel|fibre|fiber/i
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
 * Expected format: Naam\tIngrediënten\tUnit\tCalories\tProtein\tB12\tALA\tIron\tCalcium\tZinc\tIodine\tSelenium\tFiber
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
          'vezel': 'fiber',
          'fiber': 'fiber',
          'fibre': 'fiber'
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
