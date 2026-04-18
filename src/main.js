import { analyzeNutrients, RDI, calculateProteinGoal } from './logic/analyzer.js';
import { getCustomFoods, saveCustomFood, saveCustomFoods, deleteCustomFood, updateCustomFood } from './logic/customStore.js';
import { parseNutrientText, parseTSVProducts } from './logic/parser.js';
import Chart from 'chart.js/auto';

// State
let state = {
  weight: 75,
  log: [],
  charts: {}
};

// DOM Elements
const selectors = {
  foodSearch: document.getElementById('food-search'),
  foodList: document.getElementById('food-list'),
  addSelectedBtn: document.getElementById('add-selected-btn'),
  logList: document.getElementById('food-log-list'),
  weightInput: document.getElementById('weight-input'),
  insightsContainer: document.getElementById('insights-container'),
  customToggle: document.getElementById('toggle-custom-form'),
  tsvToggle: document.getElementById('toggle-tsv-form'),
  customForm: document.getElementById('custom-food-form'),
  tsvForm: document.getElementById('tsv-import-form'),
  smartParseBtn: document.getElementById('smart-parse-btn'),
  aiImportText: document.getElementById('ai-import-text'),
  saveCustomBtn: document.getElementById('save-custom-btn'),
  tsvImportText: document.getElementById('tsv-import-text'),
  processTsvBtn: document.getElementById('process-tsv-btn'),
  navDashboardBtn: document.getElementById('nav-dashboard-btn'),
  navDatabaseBtn: document.getElementById('nav-database-btn'),
  dashboardView: document.getElementById('dashboard-view'),
  databaseView: document.getElementById('database-view')
};

// UI Elements for Custom Form
const customInputs = {
  editId: document.getElementById('custom-edit-id'),
  name: document.getElementById('custom-name'),
  ingredients: document.getElementById('custom-ingredients'),
  protein: document.getElementById('custom-protein'),
  b12: document.getElementById('custom-b12'),
  ala: document.getElementById('custom-ala'),
  iron: document.getElementById('custom-iron'),
  calcium: document.getElementById('custom-calcium'),
  zinc: document.getElementById('custom-zinc'),
  iodine: document.getElementById('custom-iodine'),
  selenium: document.getElementById('custom-selenium')
};

// Initialize app
function init() {
  renderFoodList();
  initCharts();
  setupEventListeners();
  loadState();
  updateUI();
  switchView('dashboard');
}

function switchView(view) {
  const activeClasses = ['bg-slate-800', 'text-emerald-400', 'font-bold', 'ring-1', 'ring-emerald-500/50', 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'];
  const inactiveClasses = ['text-slate-400', 'font-medium', 'hover:bg-slate-800/50', 'hover:text-slate-300'];

  if (view === 'dashboard') {
    selectors.dashboardView.classList.remove('hidden');
    selectors.databaseView.classList.add('hidden');
    
    selectors.navDashboardBtn.classList.add(...activeClasses);
    selectors.navDashboardBtn.classList.remove(...inactiveClasses);
    
    selectors.navDatabaseBtn.classList.remove(...activeClasses);
    selectors.navDatabaseBtn.classList.add(...inactiveClasses);
  } else if (view === 'database') {
    selectors.dashboardView.classList.add('hidden');
    selectors.databaseView.classList.remove('hidden');
    
    selectors.navDashboardBtn.classList.remove(...activeClasses);
    selectors.navDashboardBtn.classList.add(...inactiveClasses);
    
    selectors.navDatabaseBtn.classList.add(...activeClasses);
    selectors.navDatabaseBtn.classList.remove(...inactiveClasses);
  }
}

function loadState() {
  const saved = localStorage.getItem('veganAnalyzerState');
  if (saved) {
    const parsed = JSON.parse(saved);
    state.weight = parsed.weight || 75;
    state.log = parsed.log || [];
    selectors.weightInput.value = state.weight;
    updateUI();
  }
}

function saveState() {
  localStorage.setItem('veganAnalyzerState', JSON.stringify({
    weight: state.weight,
    log: state.log
  }));
}

function renderFoodList(searchTerm = '') {
  const allFoods = getCustomFoods();
  allFoods.sort((a, b) => a.name.localeCompare(b.name));
  
  selectors.foodList.innerHTML = '';
  let matchCount = 0;

  allFoods.forEach(food => {
    if (searchTerm && !food.name.toLowerCase().includes(searchTerm.toLowerCase())) return;
    matchCount++;

    const li = document.createElement('li');
    li.className = 'py-1 px-2 flex items-center justify-between hover:bg-slate-800/50 transition-colors group gap-2 min-h-[32px]';
    
    li.innerHTML = `
      <div class="flex items-center flex-1 min-w-0">
        <input type="checkbox" class="food-checkbox w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 flex-shrink-0" data-id="${food.id}">
        <div class="ml-2 flex items-center gap-2 min-w-0">
          <span class="text-xs font-medium truncate text-slate-200">${food.name}</span>
          ${food.isDefault ? '' : '<span class="text-[9px] text-emerald-500 uppercase tracking-tighter flex-shrink-0">Eigen</span>'}
        </div>
      </div>
      <div class="flex items-center gap-1 flex-shrink-0">
        <input type="number" class="food-amount w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-center focus:ring-1 focus:ring-emerald-500 outline-none hidden" placeholder="${food.unit === 'g' || food.unit === 'ml' ? '100' : '1'}" data-unit="${food.unit}">
        <span class="text-[10px] text-slate-500 hidden amount-unit">${food.unit}</span>
        <button class="edit-btn p-1 text-slate-400 hover:text-amber-400 rounded transition-colors" title="Bewerk" data-id="${food.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
        </button>
        <button class="delete-btn p-1 text-slate-400 hover:text-red-400 rounded transition-colors" title="Verwijder" data-id="${food.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    // Show amount input when checkbox is checked
    const checkbox = li.querySelector('.food-checkbox');
    const amountInput = li.querySelector('.food-amount');
    const amountUnit = li.querySelector('.amount-unit');
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        amountInput.classList.remove('hidden');
        amountUnit.classList.remove('hidden');
        amountInput.focus();
      } else {
        amountInput.classList.add('hidden');
        amountUnit.classList.add('hidden');
      }
      updateAddSelectedButton();
    });

    // Actions for all items
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      if (confirm('Product verwijderen?')) {
        deleteCustomFood(food.id);
        renderFoodList(selectors.foodSearch.value);
      }
    });

    li.querySelector('.edit-btn').addEventListener('click', (e) => {
      populateEditForm(food);
    });

    selectors.foodList.appendChild(li);
  });

  if (matchCount === 0) {
    selectors.foodList.innerHTML = '<li class="p-4 text-center text-sm text-slate-500 italic">Geen producten gevonden...</li>';
  }
  updateAddSelectedButton();
}

function updateAddSelectedButton() {
  const checked = document.querySelectorAll('.food-checkbox:checked');
  selectors.addSelectedBtn.disabled = checked.length === 0;
  selectors.addSelectedBtn.textContent = checked.length > 0 ? `Voeg ${checked.length} Item(s) Toe` : 'Voeg Geselecteerde Toe';
}

function populateEditForm(food) {
  switchView('database');
  selectors.customForm.classList.remove('hidden');
  selectors.tsvForm.classList.add('hidden');
  
  customInputs.editId.value = food.id;
  customInputs.name.value = food.name || '';
  customInputs.ingredients.value = food.ingredients || '';
  customInputs.protein.value = food.nutrients?.protein || '';
  customInputs.b12.value = food.nutrients?.b12 || '';
  customInputs.ala.value = food.nutrients?.ala || '';
  customInputs.iron.value = food.nutrients?.iron || '';
  customInputs.calcium.value = food.nutrients?.calcium || '';
  customInputs.zinc.value = food.nutrients?.zinc || '';
  customInputs.iodine.value = food.nutrients?.iodine || '';
  customInputs.selenium.value = food.nutrients?.selenium || '';
  
  selectors.saveCustomBtn.textContent = 'Wijzigingen Opslaan';
  selectors.saveCustomBtn.classList.replace('bg-emerald-600/20', 'bg-amber-600/20');
  selectors.saveCustomBtn.classList.replace('text-emerald-400', 'text-amber-400');
  selectors.saveCustomBtn.classList.replace('border-emerald-500/30', 'border-amber-500/30');
}

function resetEditForm() {
  Object.values(customInputs).forEach(input => input.value = '');
  selectors.aiImportText.value = '';
  selectors.saveCustomBtn.textContent = 'Opslaan in Mijn Lijst';
  selectors.saveCustomBtn.classList.replace('bg-amber-600/20', 'bg-emerald-600/20');
  selectors.saveCustomBtn.classList.replace('text-amber-400', 'text-emerald-400');
  selectors.saveCustomBtn.classList.replace('border-amber-500/30', 'border-emerald-500/30');
}

function setupEventListeners() {
  selectors.navDashboardBtn.addEventListener('click', () => switchView('dashboard'));
  selectors.navDatabaseBtn.addEventListener('click', () => switchView('database'));

  selectors.foodSearch.addEventListener('input', (e) => {
    renderFoodList(e.target.value);
  });

  selectors.addSelectedBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.food-checkbox:checked');
    const allFoods = [...foods, ...getCustomFoods()];
    
    checkboxes.forEach(cb => {
      const foodId = cb.getAttribute('data-id');
      const food = allFoods.find(f => f.id === foodId);
      if (food) {
        const li = cb.closest('li');
        const amountInput = li.querySelector('.food-amount');
        let amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
          amount = (food.unit === 'g' || food.unit === 'ml') ? 100 : 1;
        }
        state.log.push({ ...food, amount, logId: Date.now() + Math.random() });
      }
    });

    // Reset checkboxes
    checkboxes.forEach(cb => {
      cb.checked = false;
      const li = cb.closest('li');
      li.querySelector('.food-amount').classList.add('hidden');
      li.querySelector('.amount-unit').classList.add('hidden');
    });
    updateAddSelectedButton();

    saveState();
    updateUI();
  });

  selectors.weightInput.addEventListener('input', (e) => {
    state.weight = parseFloat(e.target.value) || 0;
    saveState();
    updateUI();
  });

  // Custom Food Events
  selectors.tsvToggle.addEventListener('click', () => {
    selectors.tsvForm.classList.toggle('hidden');
  });

  selectors.smartParseBtn.addEventListener('click', () => {
    const text = selectors.aiImportText.value;
    if (!text) return;
    const parsed = parseNutrientText(text);
    // Fill inputs
    customInputs.protein.value = parsed.protein || '';
    customInputs.b12.value = parsed.b12 || '';
    customInputs.ala.value = parsed.ala || '';
    customInputs.iron.value = parsed.iron || '';
    customInputs.calcium.value = parsed.calcium || '';
    customInputs.zinc.value = parsed.zinc || '';
    customInputs.iodine.value = parsed.iodine || '';
    customInputs.selenium.value = parsed.selenium || '';
    selectors.smartParseBtn.textContent = 'Geparsed! ✓';
    setTimeout(() => selectors.smartParseBtn.textContent = 'Smart Import (Scan Tekst)', 1000);
  });

  selectors.saveCustomBtn.addEventListener('click', () => {
    const name = customInputs.name.value;
    if (!name) {
      alert('Geef het product een naam');
      return;
    }

    const newFood = {
      name,
      ingredients: customInputs.ingredients.value,
      unit: 'g',
      nutrients: {
        protein: parseFloat(customInputs.protein.value) || 0,
        b12: parseFloat(customInputs.b12.value) || 0,
        ala: parseFloat(customInputs.ala.value) || 0,
        iron: parseFloat(customInputs.iron.value) || 0,
        calcium: parseFloat(customInputs.calcium.value) || 0,
        zinc: parseFloat(customInputs.zinc.value) || 0,
        iodine: parseFloat(customInputs.iodine.value) || 0,
        selenium: parseFloat(customInputs.selenium.value) || 0,
        calories: 0 // Placeholder
      }
    };

    const editId = customInputs.editId.value;
    if (editId) {
      updateCustomFood(editId, newFood);
      alert('Wijzigingen opgeslagen!');
    } else {
      saveCustomFood(newFood);
      alert('Opgeslagen in je eigen lijst!');
    }

    renderFoodList(selectors.foodSearch.value);
    selectors.customForm.classList.add('hidden');
    resetEditForm();
  });

  selectors.processTsvBtn.addEventListener('click', () => {
    const tsv = selectors.tsvImportText.value;
    if (!tsv) return;
    const products = parseTSVProducts(tsv);
    if (products.length === 0) {
      alert('Geen geldige data gevonden. Gebruik tabs als scheidingsteken.');
      return;
    }
    saveCustomFoods(products);
    renderFoodList(selectors.foodSearch.value);
    selectors.tsvImportText.value = '';
    selectors.tsvForm.classList.add('hidden');
    alert(`${products.length} producten toegevoegd!`);
  });
}

function initCharts() {
  const nutrientIds = ['protein', 'b12', 'ala', 'iron'];
  const colors = {
    protein: '#10b981',
    b12: '#0ea5e9',
    ala: '#f59e0b',
    iron: '#6366f1'
  };

  nutrientIds.forEach(id => {
    const ctx = document.getElementById(`${id}-chart`).getContext('2d');
    state.charts[id] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [colors[id], 'rgba(30, 41, 59, 0.5)'],
          borderWidth: 0,
          circumference: 360,
          rotation: 0,
          cutout: '85%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        events: []
      }
    });
  });
}

function updateUI() {
  const { totals, proteinGoal, insights } = analyzeNutrients(state.log, state.weight);

  // Update Charts
  updateChart('protein', totals.protein, proteinGoal);
  updateChart('b12', totals.b12, RDI.b12);
  updateChart('ala', totals.ala, RDI.ala);
  updateChart('iron', totals.iron, RDI.iron);

  // Update Linear Bars
  updateBar('calcium', totals.calcium, RDI.calcium, 'mg');
  updateBar('zinc', totals.zinc, RDI.zinc, 'mg');
  updateBar('iodine', totals.iodine, RDI.iodine, 'μg');
  updateBar('selenium', totals.selenium, RDI.selenium, 'μg');

  // Update Log List
  renderLog();

  // Update Insights
  renderInsights(insights);
}

function updateChart(id, value, goal) {
  const percent = Math.min(100, Math.round((value / goal) * 100) || 0);
  const chart = state.charts[id];
  chart.data.datasets[0].data = [percent, 100 - percent];
  chart.update();

  document.getElementById(`${id}-percent`).textContent = `${percent}%`;
  const unit = id === 'b12' ? 'μg' : 'mg';
  const displayValue = id === 'ala' ? value / 1000 : value;
  const displayGoal = id === 'ala' ? goal / 1000 : goal;
  const displayUnit = id === 'ala' ? 'g' : (id === 'b12' ? 'μg' : (id === 'protein' ? 'g' : 'mg'));
  
  // Custom fix for ALA unit and values
  if (id === 'ala') {
    document.getElementById(`${id}-value`).textContent = `${(value/1000).toFixed(2)} / ${(goal/1000).toFixed(1)}g`;
  } else if (id === 'protein') {
    document.getElementById(`${id}-value`).textContent = `${value.toFixed(1)} / ${goal.toFixed(0)}g`;
  } else {
    document.getElementById(`${id}-value`).textContent = `${value.toFixed(1)} / ${goal.toFixed(1)}${unit}`;
  }
}

function updateBar(id, value, goal, unit) {
  const percent = Math.min(100, (value / goal) * 100);
  document.getElementById(`${id}-bar`).style.width = `${percent}%`;
  document.getElementById(`${id}-summary`).textContent = `${value.toFixed(1)} / ${goal}${unit}`;
}

function renderLog() {
  selectors.logList.innerHTML = '';
  state.log.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center py-1 px-2 hover:bg-slate-800/50 transition-colors gap-2 min-h-[32px]';
    li.innerHTML = `
      <div class="flex items-center gap-2 overflow-hidden flex-1">
        <span class="text-xs font-medium text-slate-200 truncate" title="${item.name}">${item.name}</span>
        <span class="text-[10px] text-emerald-400 font-mono bg-emerald-950/30 px-1.5 py-0.5 rounded flex-shrink-0">${item.amount}${item.unit || ''}</span>
      </div>
      <button class="remove-btn text-slate-500 hover:text-red-400 p-1 flex-shrink-0 transition-colors rounded hover:bg-slate-800" data-index="${index}" title="Verwijder">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    `;
    li.querySelector('.remove-btn').addEventListener('click', () => {
      state.log.splice(index, 1);
      saveState();
      updateUI();
    });
    selectors.logList.appendChild(li);
  });
}

function renderInsights(insights) {
  if (insights.length === 0 && state.log.length > 0) {
    selectors.insightsContainer.innerHTML = `
      <div class="p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-emerald-400 flex items-center">
        <span class="text-2xl mr-4">🎉</span>
        <div>
          <p class="font-bold">Perfecte Balans!</p>
          <p class="text-sm">Je dieet bevat op dit moment alle essentiële kritieke markers.</p>
        </div>
      </div>
    `;
    return;
  }

  if (state.log.length === 0) {
    selectors.insightsContainer.innerHTML = '<div class="p-6 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-center text-slate-500 italic">Voeg voeding toe om een analyse te genereren...</div>';
    return;
  }

  selectors.insightsContainer.innerHTML = '';
  insights.forEach(insight => {
    const div = document.createElement('div');
    div.className = `p-5 rounded-2xl border-l-4 insight-${insight.type} flex items-start gap-4 mb-3`;
    const icon = insight.type === 'warning' ? '⚠️' : (insight.type === 'danger' ? '🚫' : (insight.type === 'tip' ? '💡' : 'ℹ️'));
    div.innerHTML = `
      <span class="text-xl mt-1">${icon}</span>
      <p class="text-sm leading-relaxed">${insight.text}</p>
    `;
    selectors.insightsContainer.appendChild(div);
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
