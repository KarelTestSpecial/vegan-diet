/**
 * Logic for calculating nutritional completeness and generating insights.
 */

export const RDI = {
  b12: 2.8,        // mcg
  ala: 1600,       // mg
  epa_dha: 250,    // mg
  iron: 14,        // mg
  zinc: 11,        // mg
  calcium: 1000,   // mg
  iodine: 150,     // mcg
  selenium: 55,    // mcg
  vitc: 90,        // mg
  omega6_limit: 10 // g (for competition warning)
};

export function calculateProteinGoal(weight) {
  return weight * 1.08;
}

export function analyzeNutrients(log, weight) {
  const totals = {
    calories: 0,
    protein: 0,
    b12: 0,
    ala: 0,
    epa_dha: 0,
    k2: 0,
    iron: 0,
    zinc: 0,
    calcium: 0,
    vitc: 0,
    iodine: 0,
    selenium: 0,
    omega6: 0,
    brazil_nuts: 0,
    soy_milk_volume: 0
  };

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

  // Special logic: EPA/DHA counts towards the main Omega-3 (ALA) chart 
  // if it's superior or equivalent. We add its ALA-equivalence to totals.ala 
  // so the chart reflects the overall Omega-3 status.
  if (totals.epa_dha > 0) {
    // If EPA/DHA goal is met, it should fill the Omega-3 ring.
    // We add enough 'virtual ALA' to represent the EPA/DHA contribution.
    const epaContribution = (totals.epa_dha / RDI.epa_dha) * RDI.ala;
    // We don't want to double count, but since Algenolie usually has 0 ALA, 
    // this just adds the equivalent status.
    totals.ala += epaContribution;
  }

  const proteinGoal = calculateProteinGoal(weight);
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
  if (totals.k2 === 0) {
    insights.push({
      type: 'info',
      text: 'Geen Vitamine K2 gedetecteerd. Overweeg rauwe zuurkool of een K2 (MK-7) supplement voor botgezondheid.',
      nutrient: 'k2'
    });
  }

  return { totals, proteinGoal, insights };
}
