import { analyzeNutrients, RDI, calculateProteinGoal } from './logic/analyzer.js';
import { getCloudCustomFoods, saveCloudCustomFood, saveCloudCustomFoodsBulk, deleteCloudCustomFood, updateCloudCustomFood, getCloudLog, saveCloudLog } from './logic/db.js';
import { setupAuthListeners, loginUser, registerUser, logoutUser, resetPassword } from './logic/auth.js';
import { parseNutrientText, parseTSVProducts } from './logic/parser.js';
import { foods } from './data/foods.js';
import Chart from 'chart.js/auto';

// State
let state = {
  weight: 75,
  log: [],
  charts: {},
  customFoods: []
};
let currentUser = null;

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
  navGuideBtn: document.getElementById('nav-guide-btn'),
  dashboardView: document.getElementById('dashboard-view'),
  databaseView: document.getElementById('database-view'),
  guideView: document.getElementById('guide-view'),
  databaseProductsList: document.getElementById('database-products-list'),
  // Auth Selectors
  authOverlay: document.getElementById('auth-overlay'),
  appContainer: document.getElementById('app'),
  authEmail: document.getElementById('auth-email'),
  authPassword: document.getElementById('auth-password'),
  authError: document.getElementById('auth-error'),
  btnLogin: document.getElementById('btn-login'),
  btnRegister: document.getElementById('btn-register'),
  btnLogout: document.getElementById('btn-logout'),
  btnCloseAuth: document.getElementById('btn-close-auth'),
  btnShowLogin: document.getElementById('btn-show-login'),
  profileName: document.getElementById('profile-name'),
  togglePasswordBtn: document.getElementById('toggle-password-btn'),
  btnResetPassword: document.getElementById('btn-reset-password')
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
  selenium: document.getElementById('custom-selenium'),
  fiber: document.getElementById('custom-fiber')
};

// Initialize app
async function init() {
  initCharts();
  setupEventListeners();
  loadState(); // load local weight
  
  // Initial render (Guest Mode by Default)
  state.customFoods = await getCloudCustomFoods(null);
  state.log = await getCloudLog(null);
  renderFoodList();
  updateUI();
  switchView('dashboard');
  
  setupAuthListeners(async (user) => {
    // Logged In
    currentUser = user;
    selectors.authOverlay.classList.add('hidden');
    
    // Update Profile UI
    selectors.profileName.textContent = user.email;
    selectors.btnShowLogin.classList.add('hidden');
    selectors.btnLogout.classList.remove('hidden');
    
    // Fetch data from Cloud
    state.customFoods = await getCloudCustomFoods(user.uid);
    state.log = await getCloudLog(user.uid);
    
    renderFoodList(selectors.foodSearch.value);
    updateUI();
  }, async () => {
    // Logged Out
    currentUser = null;
    
    // Update Profile UI
    selectors.profileName.textContent = 'Gast (Lokaal)';
    selectors.btnShowLogin.classList.remove('hidden');
    selectors.btnLogout.classList.add('hidden');
    
    // Re-fetch local data if logged out
    state.customFoods = await getCloudCustomFoods(null);
    state.log = await getCloudLog(null);
    
    renderFoodList(selectors.foodSearch.value);
    updateUI();
  });
}

function switchView(view) {
  const activeClasses = ['bg-slate-800', 'text-emerald-400', 'font-bold', 'ring-1', 'ring-emerald-500/50', 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'];
  const inactiveClasses = ['text-slate-400', 'font-medium', 'hover:bg-slate-800/50', 'hover:text-slate-300'];

  // Reset all
  selectors.dashboardView.classList.add('hidden');
  selectors.databaseView.classList.add('hidden');
  selectors.guideView.classList.add('hidden');
  
  selectors.navDashboardBtn.classList.remove(...activeClasses);
  selectors.navDashboardBtn.classList.add(...inactiveClasses);
  selectors.navDatabaseBtn.classList.remove(...activeClasses);
  selectors.navDatabaseBtn.classList.add(...inactiveClasses);
  selectors.navGuideBtn.classList.remove(...activeClasses);
  selectors.navGuideBtn.classList.add(...inactiveClasses);

  if (view === 'dashboard') {
    selectors.dashboardView.classList.remove('hidden');
    selectors.navDashboardBtn.classList.add(...activeClasses);
    selectors.navDashboardBtn.classList.remove(...inactiveClasses);
  } else if (view === 'database') {
    selectors.databaseView.classList.remove('hidden');
    selectors.navDatabaseBtn.classList.add(...activeClasses);
    selectors.navDatabaseBtn.classList.remove(...inactiveClasses);
    renderDatabaseTable();
  } else if (view === 'guide') {
    selectors.guideView.classList.remove('hidden');
    selectors.navGuideBtn.classList.add(...activeClasses);
    selectors.navGuideBtn.classList.remove(...inactiveClasses);
  }
}

function loadState() {
  const saved = localStorage.getItem('veganAnalyzerSettings');
  if (saved) {
    const parsed = JSON.parse(saved);
    state.weight = parsed.weight || 75;
    selectors.weightInput.value = state.weight;
  }
}

async function saveState() {
  // Save settings locally
  localStorage.setItem('veganAnalyzerSettings', JSON.stringify({
    weight: state.weight
  }));
  
  // Save logbook to cloud
  if (currentUser) {
    await saveCloudLog(currentUser.uid, state.log);
  }
}

function renderFoodList(searchTerm = '') {
  const allFoods = [...foods, ...state.customFoods];
  allFoods.sort((a, b) => a.name.localeCompare(b.name));
  
  selectors.foodList.innerHTML = '';
  let matchCount = 0;

  allFoods.forEach(food => {
    if (searchTerm && !food.name.toLowerCase().includes(searchTerm.toLowerCase())) return;
    matchCount++;

    const li = document.createElement('li');
    li.className = 'py-1 px-2 flex items-center justify-between hover:bg-slate-800/50 transition-colors group gap-2 min-h-[32px]';
    
    li.innerHTML = `
      <div class="flex items-center flex-1 min-w-0 pointer-events-none">
        <input type="checkbox" class="food-checkbox w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 flex-shrink-0 cursor-pointer pointer-events-auto" data-id="${food.id}">
        <div class="ml-2 flex items-center gap-2 min-w-0">
          <span class="text-xs font-medium truncate text-slate-200">${food.name}</span>
        </div>
      </div>
      <div class="flex items-center gap-1 flex-shrink-0">
        <button class="edit-btn p-1 text-slate-400 hover:text-amber-400 rounded transition-colors opacity-0 group-hover:opacity-100" title="Bewerk" data-id="${food.id}">
          <svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
        </button>
        <button class="delete-btn p-1 text-slate-400 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100" title="Verwijder" data-id="${food.id}">
          <svg class="pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;

    const checkbox = li.querySelector('.food-checkbox');
    checkbox.addEventListener('change', () => {
      updateAddSelectedButton();
    });

    // Toggle checkbox when clicking the row (but not the buttons)
    li.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (e.target === checkbox) return; // Checkbox handles its own click
      
      checkbox.checked = !checkbox.checked;
      updateAddSelectedButton();
    });

    // Actions for all items
    li.querySelector('.delete-btn').addEventListener('click', async (e) => {
      if (confirm('Product verwijderen?')) {
        await deleteCloudCustomFood(currentUser.uid, food.id);
        state.customFoods = state.customFoods.filter(f => f.id !== food.id);
        renderFoodList(selectors.foodSearch.value);
      }
    });

    li.querySelector('.edit-btn').addEventListener('click', (e) => {
      populateEditForm(food);
    });

    selectors.foodList.appendChild(li);
  });

  if (matchCount === 0) {
    selectors.foodList.innerHTML = '<li class="p-4 text-center text-sm text-slate-400 italic">Geen producten gevonden...</li>';
  }
  updateAddSelectedButton();
}

function renderDatabaseTable() {
  if (!selectors.databaseProductsList) return;
  
  const allFoods = [...foods, ...state.customFoods];
  allFoods.sort((a, b) => a.name.localeCompare(b.name));
  
  selectors.databaseProductsList.innerHTML = '';
  
  allFoods.forEach(food => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors';
    
    const n = food.nutrients || {};
    
    tr.innerHTML = `
      <td class="px-4 py-3">
        <div class="flex flex-col">
          <span class="font-medium text-slate-200">${food.name}</span>
        </div>
      </td>
      <td class="px-4 py-3 text-slate-300">${n.protein || 0}g</td>
      <td class="px-4 py-3 text-slate-300">${n.b12 || 0}μg</td>
      <td class="px-4 py-3 text-slate-300">${(n.ala / 1000).toFixed(2)}g</td>
      <td class="px-4 py-3 text-slate-300">${n.iron || 0}mg</td>
      <td class="px-4 py-3 text-slate-300">${n.calcium || 0}mg</td>
      <td class="px-4 py-3 text-right">
        <div class="flex justify-end gap-2">
          <button class="edit-db-btn p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800 transition-colors" data-id="${food.id}" title="Bewerken">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
          </button>
          <button class="delete-db-btn p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors" data-id="${food.id}" title="Verwijderen">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    `;
    
    tr.querySelector('.edit-db-btn').addEventListener('click', () => {
      populateEditForm(food);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    const deleteBtn = tr.querySelector('.delete-db-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Product "${food.name}" verwijderen?`)) {
          await deleteCloudCustomFood(currentUser.uid, food.id);
          state.customFoods = state.customFoods.filter(f => f.id !== food.id);
          renderFoodList(selectors.foodSearch.value);
          renderDatabaseTable();
        }
      });
    }
    
    selectors.databaseProductsList.appendChild(tr);
  });
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
  customInputs.fiber.value = food.nutrients?.fiber || '';
  
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
  selectors.btnLogin.addEventListener('click', async () => {
    const email = selectors.authEmail.value;
    const password = selectors.authPassword.value;
    const { error } = await loginUser(email, password);
    if (error) {
      selectors.authError.textContent = "Inloggen mislukt: " + error;
      selectors.authError.classList.remove('hidden');
    }
  });

  selectors.btnRegister.addEventListener('click', async () => {
    const email = selectors.authEmail.value;
    const password = selectors.authPassword.value;
    const { error } = await registerUser(email, password);
    if (error) {
      selectors.authError.textContent = "Registreren mislukt: " + error;
      selectors.authError.classList.remove('hidden');
    }
  });

  selectors.btnShowLogin.addEventListener('click', () => {
    selectors.authOverlay.classList.remove('hidden');
    // Try to auto-suggest credentials if Credential Management API is available
    if (navigator.credentials && navigator.credentials.get) {
      navigator.credentials.get({ password: true, unmediated: false }).then((cred) => {
        if (cred && cred.id && cred.password) {
          selectors.authEmail.value = cred.id;
          selectors.authPassword.value = cred.password;
        }
      }).catch(err => console.log('Credential API niet beschikbaar/geweigerd', err));
    }
  });

  selectors.btnCloseAuth.addEventListener('click', () => {
    selectors.authOverlay.classList.add('hidden');
  });

  selectors.btnLogout.addEventListener('click', async () => {
    await logoutUser();
  });

  selectors.togglePasswordBtn.addEventListener('click', () => {
    const isPassword = selectors.authPassword.type === 'password';
    selectors.authPassword.type = isPassword ? 'text' : 'password';
    const icon = selectors.togglePasswordBtn.querySelector('svg');
    if (isPassword) {
      // Eye Off Icon
      icon.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>';
    } else {
      // Eye Icon
      icon.innerHTML = '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>';
    }
  });

  selectors.btnResetPassword.addEventListener('click', async () => {
    const email = selectors.authEmail.value;
    if (!email) {
      selectors.authError.textContent = "Vul eerst je e-mailadres in.";
      selectors.authError.classList.remove('hidden');
      return;
    }
    
    const { error } = await resetPassword(email);
    if (error) {
      selectors.authError.textContent = "Fout bij herstellen: " + error;
      selectors.authError.classList.remove('hidden');
    } else {
      selectors.authError.textContent = "Herstel-e-mail verzonden! Check je inbox.";
      selectors.authError.classList.remove('bg-red-950/30', 'border-red-500/20', 'text-red-400');
      selectors.authError.classList.add('bg-emerald-950/30', 'border-emerald-500/20', 'text-emerald-400');
      selectors.authError.classList.remove('hidden');
    }
  });

  selectors.navDashboardBtn.addEventListener('click', () => switchView('dashboard'));
  selectors.navDatabaseBtn.addEventListener('click', () => switchView('database'));
  selectors.navGuideBtn.addEventListener('click', () => switchView('guide'));

  selectors.foodSearch.addEventListener('input', (e) => {
    renderFoodList(e.target.value);
  });

  selectors.addSelectedBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.food-checkbox:checked');
    const allFoods = [...foods, ...state.customFoods];
    
    checkboxes.forEach(cb => {
      const foodId = cb.getAttribute('data-id');
      const food = allFoods.find(f => f.id === foodId);
      if (food) {
        // Set default amount
        const amount = (food.unit === 'g' || food.unit === 'ml') ? 100 : 1;
        state.log.push({ ...food, amount, logId: Date.now() + Math.random() });
      }
    });

    // Reset checkboxes
    checkboxes.forEach(cb => {
      cb.checked = false;
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
    customInputs.fiber.value = parsed.fiber || '';
    selectors.smartParseBtn.textContent = 'Geparsed! ✓';
    setTimeout(() => selectors.smartParseBtn.textContent = 'Smart Import (Scan Tekst)', 1000);
  });

  selectors.saveCustomBtn.addEventListener('click', async () => {
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
        fiber: parseFloat(customInputs.fiber.value) || 0,
        calories: 0
      }
    };

    const editId = customInputs.editId.value;
    if (editId) {
      await updateCloudCustomFood(currentUser.uid, editId, newFood);
      alert('Wijzigingen opgeslagen!');
    } else {
      await saveCloudCustomFood(currentUser.uid, newFood);
      alert('Opgeslagen in de cloud!');
    }

    // Refresh custom foods from cloud
    state.customFoods = await getCloudCustomFoods(currentUser.uid);
    renderFoodList(selectors.foodSearch.value);
    renderDatabaseTable();
    selectors.customForm.classList.add('hidden');
    resetEditForm();
  });

  selectors.processTsvBtn.addEventListener('click', async () => {
    const tsv = selectors.tsvImportText.value;
    if (!tsv) return;
    const products = parseTSVProducts(tsv);
    if (products.length === 0) {
      alert('Geen geldige data gevonden. Gebruik tabs als scheidingsteken.');
      return;
    }
    await saveCloudCustomFoodsBulk(currentUser.uid, products);
    state.customFoods = await getCloudCustomFoods(currentUser.uid);
    renderFoodList(selectors.foodSearch.value);
    renderDatabaseTable();
    selectors.tsvImportText.value = '';
    selectors.tsvForm.classList.add('hidden');
    alert(`${products.length} producten toegevoegd aan de cloud!`);
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
  updateBar('k1', totals.k1, RDI.k1, 'μg');
  updateBar('k2', totals.k2, RDI.k2, 'μg');

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
  const bar = document.getElementById(`${id}-bar`);
  bar.style.width = `${percent}%`;
  document.getElementById(`${id}-summary`).textContent = `${value.toFixed(1)} / ${goal}${unit}`;

  // Visual feedback for high Selenium
  if (id === 'selenium') {
    if (value > RDI.selenium_limit) {
      bar.classList.remove('bg-purple-500');
      bar.classList.add('bg-red-500');
    } else {
      bar.classList.remove('bg-red-500');
      bar.classList.add('bg-purple-500');
    }
  }
}

function renderLog() {
  selectors.logList.innerHTML = '';
  state.log.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center py-1 px-2 hover:bg-slate-800/50 transition-colors gap-2 min-h-[32px] group';
    li.innerHTML = `
      <div class="flex items-center gap-2 overflow-hidden flex-1">
        <span class="text-xs font-medium text-slate-200 truncate" title="${item.name}">${item.name}</span>
      </div>
      <div class="flex items-center gap-1 flex-shrink-0">
        <input type="number" class="log-amount-input w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-emerald-400 font-mono text-center focus:ring-1 focus:ring-emerald-500 outline-none hover:bg-slate-800 transition-colors" value="${item.amount}">
        <span class="text-[10px] text-slate-400">${item.unit || ''}</span>
        <button class="remove-btn text-slate-500 hover:text-red-400 p-1 ml-1 flex-shrink-0 transition-colors rounded hover:bg-slate-800" data-index="${index}" title="Verwijder">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    `;
    
    // Amount changed
    const amountInput = li.querySelector('.log-amount-input');
    amountInput.addEventListener('change', (e) => {
      let val = parseFloat(e.target.value);
      if (isNaN(val) || val <= 0) val = (item.unit === 'g' || item.unit === 'ml') ? 100 : 1;
      item.amount = val;
      e.target.value = val;
      saveState();
      updateUI();
    });

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
      <div class="col-span-full p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-emerald-400 flex items-center">
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
    selectors.insightsContainer.innerHTML = '<div class="col-span-full p-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-center text-slate-500 italic text-sm">Voeg voeding toe om een analyse te genereren...</div>';
    return;
  }

  selectors.insightsContainer.innerHTML = '';
  insights.forEach(insight => {
    const div = document.createElement('div');
    div.className = `flex items-start gap-2 py-1.5 px-1 border-b border-slate-800/30 last:border-0`;
    const icon = insight.type === 'warning' ? '⚠️' : (insight.type === 'danger' ? '🚫' : (insight.type === 'tip' ? '💡' : 'ℹ️'));
    div.innerHTML = `
      <span class="text-base flex-shrink-0 mt-0.5">${icon}</span>
      <p class="text-sm leading-tight text-slate-300 font-medium">${insight.text}</p>
    `;
    selectors.insightsContainer.appendChild(div);
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
