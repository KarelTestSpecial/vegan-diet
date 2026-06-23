/**
 * Logic for calculating nutritional completeness and generating insights.
 */

export const RDI = {
  protein: 75,      // g (placeholder, calculated by weight)
  b12: 2.8,        // mcg
  ala: 1600,       // mg
  epa_dha: 250,    // mg
  iron: 14,        // mg
  zinc: 11,        // mg
  calcium: 1000,   // mg
  iodine: 150,     // mcg
  selenium: 55,    // mcg
  magnesium: 400,  // mg
  potassium: 3500, // mg
  phosphorus: 700, // mg
  vit_a: 800,      // mcg RE
  vit_d: 20,       // mcg (800 IU)
  vit_e: 15,       // mg
  vit_k1: 120,     // mcg
  vit_k2: 100,     // mcg (AI)
  vit_b1: 1.2,     // mg
  vit_b2: 1.3,     // mg
  vit_b3: 16,      // mg
  vit_b5: 5,       // mg
  vit_b6: 1.5,     // mg
  vit_b7: 30,      // mcg
  vit_b9: 400,     // mcg
  vitc: 90,        // mg
  choline: 550,    // mg
  lysine: 2500,    // mg
  methionine: 1000,// mg
  copper: 0.9,     // mg
  manganese: 2.3,  // mg
  omega6_limit: 10 // g (limit for competition)
};

export function calculateProteinGoal(weight) {
  return weight * 1.08;
}

export function analyzeNutrients(log, weight) {
  const totals = {};
  Object.keys(RDI).forEach(key => totals[key] = 0);
  
  // Extra fields for non-RDI tracking
  totals.omega6 = 0;
  totals.brazil_nuts = 0;
  totals.soy_milk_volume = 0;

  log.forEach(item => {
    const factor = item.amount / (item.unit === 'g' || item.unit === 'ml' ? 100 : 1);
    
    Object.keys(item.nutrients).forEach(key => {
      if (totals.hasOwnProperty(key)) {
        totals[key] += item.nutrients[key] * factor;
      }
    });

    if (item.id === 'brazil-nut') totals.brazil_nuts += item.amount;
    if (item.id === 'soy-milk-enriched') totals.soy_milk_volume += item.amount;
  });

  // Special logic: EPA/DHA contribution to Omega-3 status
  if (totals.epa_dha > 0) {
    const epaContribution = (totals.epa_dha / RDI.epa_dha) * RDI.ala;
    totals.ala += epaContribution;
  }

  const proteinGoal = calculateProteinGoal(weight);
  totals.protein_goal = proteinGoal; 
  
  const insights = [];

  // B12 Logic
  if (totals.b12 < RDI.b12) {
    insights.push({
      type: 'warning',
      text: `B12 tekort (${Math.round(totals.b12 / RDI.b12 * 100)}%). Gebruik verrijkte melk of een supplement (cyanocobalamine).`,
      nutrient: 'b12'
    });
  }

  // Omega-3 Competition
  if (totals.omega6 > RDI.omega6_limit) {
    insights.push({
      type: 'info',
      text: 'Hoge Omega-6 inname (competitie). Je hebt extra ALA nodig (lijnzaadolie!) voor optimale conversie.',
      nutrient: 'ala'
    });
  }

  if (totals.ala < RDI.ala && totals.epa_dha < RDI.epa_dha) {
    insights.push({
      type: 'warning',
      text: 'Omega-3 is laag. Voeg lijnzaadolie (ALA) of algenolie (EPA/DHA) toe.',
      nutrient: 'ala'
    });
  }

  // Iron Synergy
  if (totals.iron > 0 && totals.vitc < 30) {
    insights.push({
      type: 'tip',
      text: 'Verbeter ijzeropname: combineer je maaltijd met vitamine C (bijv. paprika of citroensap).',
      nutrient: 'iron'
    });
  }

  // Selenium toxicity
  if (totals.brazil_nuts > 2) {
    insights.push({
      type: 'danger',
      text: 'Te veel paranoten! Beperk tot maximaal 2 per dag om seleniumvergiftiging te voorkomen.',
      nutrient: 'selenium'
    });
  }

  // K2
  if (totals.vit_k2 === 0) {
    insights.push({
      type: 'info',
      text: 'Geen Vitamine K2 gedetecteerd. Overweeg rauwe zuurkool of een K2 (MK-7) supplement voor botgezondheid.',
      nutrient: 'vit_k2'
    });
  }

  return { totals, proteinGoal, insights };
}

