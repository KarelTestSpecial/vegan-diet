import { translations } from './data/translations.js';
import { analyzeNutrients, RDI, calculateProteinGoal } from './logic/analyzer.js';
import { getCloudCustomFoods, saveCloudCustomFood, saveCloudCustomFoodsBulk, deleteCloudCustomFood, updateCloudCustomFood, getCloudLog, saveCloudLog } from './logic/db.js';
import { setupAuthListeners, loginUser, registerUser, logoutUser, resetPassword } from './logic/auth.js';
import { parseNutrientText, parseTSVProducts } from './logic/parser.js';
import { foods } from './data/foods.js';
import Chart from 'chart.js/auto';


const getLang = () => {
  const path = window.location.pathname;
  if (path.includes('index_en')) return 'en';
  if (path.includes('index_fr')) return 'fr';
  if (path.includes('index_de')) return 'de';
  if (path.includes('index_es')) return 'es';
  if (path.includes('index_it')) return 'it';
  if (path.includes('index_pt')) return 'pt';
  return 'nl';
};
const currentLang = getLang();
const t = (key) => translations[currentLang][key] || key;

const NUTRIENT_METADATA = {
  protein: { unit: 'g', category: 'Macro' },
  b12: { unit: 'mcg', category: 'Vitamin' },
  ala: { unit: 'mg', category: 'Fat' },
  epa_dha: { unit: 'mg', category: 'Fat' },
  iron: { unit: 'mg', category: 'Mineral' },
  calcium: { unit: 'mg', category: 'Mineral' },
  zinc: { unit: 'mg', category: 'Mineral' },
  iodine: { unit: 'mcg', category: 'Mineral' },
  selenium: { unit: 'mcg', category: 'Mineral' },
  magnesium: { unit: 'mg', category: 'Mineral' },
  potassium: { unit: 'mg', category: 'Mineral' },
  phosphorus: { unit: 'mg', category: 'Mineral' },
  vit_a: { unit: 'mcg', category: 'Vitamin' },
  vit_d: { unit: 'mcg', category: 'Vitamin' },
  vit_e: { unit: 'mg', category: 'Vitamin' },
  vit_k1: { unit: 'mcg', category: 'Vitamin' },
  vit_k2: { unit: 'mcg', category: 'Vitamin' },
  vit_b1: { unit: 'mg', category: 'Vitamin' },
  vit_b2: { unit: 'mg', category: 'Vitamin' },
  vit_b3: { unit: 'mg', category: 'Vitamin' },
  vit_b5: { unit: 'mg', category: 'Vitamin' },
  vit_b6: { unit: 'mg', category: 'Vitamin' },
  vit_b7: { unit: 'mcg', category: 'Vitamin' },
  vit_b9: { unit: 'mcg', category: 'Vitamin' },
  vitc: { unit: 'mg', category: 'Vitamin' },
  choline: { unit: 'mg', category: 'Other' },
  lysine: { unit: 'mg', category: 'Amino' },
  methionine: { unit: 'mg', category: 'Amino' },
  copper: { unit: 'mg', category: 'Mineral' },
  manganese: { unit: 'mg', category: 'Mineral' }
};

const DEFAULT_TRACKED = ['protein', 'b12', 'ala', 'iron', 'calcium', 'zinc', 'iodine', 'selenium'];

// State
let state = {
  weight: 75,
  log: [],
  charts: {},
  customFoods: [],
  trackedNutrients: [...DEFAULT_TRACKED],
  showAllNutrientsInForm: false
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
  databaseView: document.getElementById('database-view'),
  guideView: document.getElementById('guide-view'),
  nutrientsView: document.getElementById('nutrients-view'),
  navDashboardBtn: document.getElementById('nav-dashboard-btn'),
  navDatabaseBtn: document.getElementById('nav-database-btn'),
  navGuideBtn: document.getElementById('nav-guide-btn'),
  navNutrientsBtn: document.getElementById('nav-nutrients-btn'),
  dashboardView: document.getElementById('dashboard-view'),
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
  selenium: document.getElementById('custom-selenium')
};

// Dynamic UI Helpers
function renderCustomFoodInputs() {
  const container = document.getElementById('custom-nutrients-container');
  if (!container) return;

  container.innerHTML = '';
  
  // Always show top nutrients, hide others behind toggle
  Object.keys(NUTRIENT_METADATA).forEach((key, index) => {
    const meta = NUTRIENT_METADATA[key];
    const isHidden = !state.showAllNutrientsInForm && index >= 8;
    
    const div = document.createElement('div');
    div.className = `space-y-1 ${isHidden ? 'hidden' : ''}`;
    div.innerHTML = `
      <label class="text-[10px] text-slate-200 ml-1">${t(key)} (${meta.unit})</label>
      <input type="number" id="custom-${key}" step="0.01" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-slate-100">
    `;
    container.appendChild(div);
  });
}

function renderNutrientSelection() {
  const container = document.getElementById('nutrients-list-container');
  if (!container) return;

  container.innerHTML = '';

  const allNutrients = Object.keys(NUTRIENT_METADATA);
  
  // Sort nutrients: tracked ones first (in their preferred order), then the rest
  const sortedKeys = [...state.trackedNutrients];
  allNutrients.forEach(key => {
    if (!sortedKeys.includes(key)) sortedKeys.push(key);
  });

  sortedKeys.forEach((key, index) => {
    const isTracked = state.trackedNutrients.includes(key);
    const div = document.createElement('div');
    div.className = `flex items-center justify-between p-3 rounded-xl border transition-all ${isTracked ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900/40 border-slate-800/50 opacity-60'}`;
    
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <input type="checkbox" class="nutrient-toggle w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500" data-key="${key}" ${isTracked ? 'checked' : ''}>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-slate-200">${t(key)}</span>
          <span class="text-[10px] text-slate-500 uppercase tracking-tighter">${NUTRIENT_METADATA[key].category}</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button class="move-up p-1.5 text-slate-500 hover:text-emerald-400 disabled:opacity-0" data-key="${key}" ${index === 0 ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </button>
        <button class="move-down p-1.5 text-slate-500 hover:text-emerald-400 disabled:opacity-0" data-key="${key}" ${index === sortedKeys.length - 1 ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    `;

    div.querySelector('.nutrient-toggle').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!state.trackedNutrients.includes(key)) state.trackedNutrients.push(key);
      } else {
        state.trackedNutrients = state.trackedNutrients.filter(k => k !== key);
      }
      saveState();
      renderNutrientSelection();
      initCharts();
      updateUI();
    });

    div.querySelector('.move-up')?.addEventListener('click', () => {
      moveNutrient(key, -1);
    });

    div.querySelector('.move-down')?.addEventListener('click', () => {
      moveNutrient(key, 1);
    });

    container.appendChild(div);
  });
}

function moveNutrient(key, direction) {
  const currentOrder = [...state.trackedNutrients];
  const idx = currentOrder.indexOf(key);
  
  if (idx === -1) return; // Not tracked
  
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= currentOrder.length) return;
  
  // Swap
  const temp = currentOrder[idx];
  currentOrder[idx] = currentOrder[newIdx];
  currentOrder[newIdx] = temp;
  
  state.trackedNutrients = currentOrder;
  saveState();
  renderNutrientSelection();
  initCharts();
  updateUI();
}

// Initialize app
async function init() {
  loadState(); // load local weight and preferences
  renderNutrientSelection();
  renderCustomFoodInputs();
  initCharts();
  setupEventListeners();
  
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
    selectors.profileName.textContent = t('guest');
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
  selectors.nutrientsView.classList.add('hidden');
  
  selectors.navDashboardBtn.classList.remove(...activeClasses);
  selectors.navDashboardBtn.classList.add(...inactiveClasses);
  selectors.navDatabaseBtn.classList.remove(...activeClasses);
  selectors.navDatabaseBtn.classList.add(...inactiveClasses);
  selectors.navGuideBtn.classList.remove(...activeClasses);
  selectors.navGuideBtn.classList.add(...inactiveClasses);
  selectors.navNutrientsBtn.classList.remove(...activeClasses);
  selectors.navNutrientsBtn.classList.add(...inactiveClasses);

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
  } else if (view === 'nutrients') {
    selectors.nutrientsView.classList.remove('hidden');
    selectors.navNutrientsBtn.classList.add(...activeClasses);
    selectors.navNutrientsBtn.classList.remove(...inactiveClasses);
    renderNutrientSelection();
  }
}

function loadState() {
  const saved = localStorage.getItem('veganAnalyzerSettings');
  if (saved) {
    const parsed = JSON.parse(saved);
    state.weight = parsed.weight || 75;
    if(parsed.trackedNutrients) {
      state.trackedNutrients = parsed.trackedNutrients;
    }
    selectors.weightInput.value = state.weight;
  }
}

async function saveState() {
  // Save settings locally
  localStorage.setItem('veganAnalyzerSettings', JSON.stringify({
    weight: state.weight,
    trackedNutrients: state.trackedNutrients
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
  
  // Update header
  const headerTr = document.getElementById('database-products-header');
  if (headerTr) {
    const topNutrients = state.trackedNutrients.slice(0, 12); // Show top 12 in table
    headerTr.innerHTML = '<th class="px-4 py-3 min-w-[200px]">Product</th>';
    topNutrients.forEach(key => {
      headerTr.innerHTML += `<th class="px-4 py-3 text-[10px] min-w-[80px]">${t(key)}</th>`;
    });
    headerTr.innerHTML += '<th class="px-4 py-3 text-right min-w-[100px]">Acties</th>';
  }

  selectors.databaseProductsList.innerHTML = '';
  
  allFoods.forEach(food => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors';
    
    const n = food.nutrients || {};
    const topNutrients = state.trackedNutrients.slice(0, 12);
    
    let nutCells = '';
    topNutrients.forEach(key => {
      let val = n[key] || 0;
      const meta = NUTRIENT_METADATA[key];
      const unit = meta?.unit || '';
      nutCells += `<td class="px-4 py-3 text-slate-300">${val.toFixed(val < 1 ? 2 : 1)}${unit}</td>`;
    });

    tr.innerHTML = `
      <td class="px-4 py-3">
        <div class="flex flex-col">
          <span class="font-medium text-slate-200">${food.name}</span>
        </div>
      </td>
      ${nutCells}
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
          await deleteCloudCustomFood(currentUser?.uid || null, food.id);
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
  
  // Populate all nutrients
  Object.keys(NUTRIENT_METADATA).forEach(key => {
    const input = document.getElementById(`custom-${key}`);
    if (input) {
      input.value = food.nutrients?.[key] || '';
    }
  });
  
  selectors.saveCustomBtn.textContent = 'Wijzigingen Opslaan';
  selectors.saveCustomBtn.classList.replace('bg-emerald-600', 'bg-amber-600');
}

function resetEditForm() {
  customInputs.editId.value = '';
  customInputs.name.value = '';
  customInputs.ingredients.value = '';
  
  Object.keys(NUTRIENT_METADATA).forEach(key => {
    const input = document.getElementById(`custom-${key}`);
    if (input) input.value = '';
  });

  selectors.aiImportText.value = '';
  selectors.saveCustomBtn.textContent = 'Opslaan in Database';
  selectors.saveCustomBtn.classList.replace('bg-amber-600', 'bg-emerald-600');
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
  selectors.navNutrientsBtn.addEventListener('click', () => switchView('nutrients'));

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
    
    // Fill inputs dynamically
    Object.keys(NUTRIENT_METADATA).forEach(key => {
      const input = document.getElementById(`custom-${key}`);
      if (input && parsed[key]) {
        input.value = parsed[key];
      }
    });

    selectors.smartParseBtn.textContent = 'Geparsed! ✓';
    setTimeout(() => selectors.smartParseBtn.textContent = 'Start Automatische Scan', 1000);
  });

  selectors.saveCustomBtn.addEventListener('click', async () => {
    const name = customInputs.name.value;
    if (!name) {
      alert('Geef het product een naam');
      return;
    }

    const nutrients = {};
    Object.keys(NUTRIENT_METADATA).forEach(key => {
      const input = document.getElementById(`custom-${key}`);
      nutrients[key] = parseFloat(input?.value) || 0;
    });

    const newFood = {
      name,
      ingredients: customInputs.ingredients.value,
      unit: 'g',
      nutrients,
      calories: 0
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
    alert(`${products.length} producten toegevoegd!`);
  });

  // Toggle all nutrients in form
  document.getElementById('toggle-all-nutrients-btn')?.addEventListener('click', () => {
    state.showAllNutrientsInForm = !state.showAllNutrientsInForm;
    renderCustomFoodInputs();
  });

  // Reset nutrients button
  document.getElementById('reset-nutrients-btn')?.addEventListener('click', () => {
    if (confirm('Selectie herstellen naar standaard vegan markers?')) {
      state.trackedNutrients = [...DEFAULT_TRACKED];
      saveState();
      renderNutrientSelection();
      initCharts();
      updateUI();
    }
  });
}

function initCharts() {
  // Destroy old charts
  Object.values(state.charts).forEach(chart => chart.destroy());
  state.charts = {};

  const container = document.getElementById('core-nutrients-grid');
  if (!container) return;
  container.innerHTML = '';

  const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#6366f1'];
  
  // Top 4 nutrients as circular charts
  const top4 = state.trackedNutrients.slice(0, 4);
  
  top4.forEach((key, index) => {
    const meta = NUTRIENT_METADATA[key];
    const color = colors[index % colors.length];
    
    const div = document.createElement('div');
    div.className = 'nutrient-stat animate-fadeIn';
    div.setAttribute('data-nutrient', key);
    div.innerHTML = `
      <div class="relative w-full max-w-[140px] mx-auto aspect-square mb-3">
        <canvas id="${key}-chart"></canvas>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-xl sm:text-2xl font-bold text-white" id="${key}-percent">0%</span>
          <span class="text-[10px] sm:text-[12px] text-slate-200 font-semibold uppercase tracking-tighter text-center">${t(key)}</span>
        </div>
      </div>
      <p class="text-center text-xs text-slate-300 font-medium" id="${key}-value">0 / 0${meta.unit}</p>
    `;
    container.appendChild(div);

    const ctx = document.getElementById(`${key}-chart`).getContext('2d');
    state.charts[key] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [color, 'rgba(30, 41, 59, 0.5)'],
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

  // Update circular charts (top 4)
  const top4 = state.trackedNutrients.slice(0, 4);
  top4.forEach(id => {
    const goal = id === 'protein' ? proteinGoal : (RDI[id] || 1);
    updateChart(id, totals[id] || 0, goal);
  });

  // Update other nutrients (the rest as progress bars)
  const othersGrid = document.getElementById('other-nutrients-grid');
  if (othersGrid) {
    othersGrid.innerHTML = '';
    const otherTracked = state.trackedNutrients.slice(4);
    
    const barColors = ['bg-emerald-500', 'bg-sky-500', 'bg-indigo-500', 'bg-purple-500', 'bg-amber-500'];
    
    otherTracked.forEach((id, index) => {
      const meta = NUTRIENT_METADATA[id];
      if (!meta) return;
      
      const goal = RDI[id] || 1;
      const current = totals[id] || 0;
      const percent = Math.min(100, Math.round((current / goal) * 100));
      const colorClass = barColors[index % barColors.length];
      
      const div = document.createElement('div');
      div.className = 'p-4 bg-slate-900/50 rounded-2xl border border-slate-800 animate-fadeIn';
      div.innerHTML = `
        <div class="flex justify-between text-sm mb-2">
          <span class="text-slate-300 font-medium">${t(id)}</span>
          <span class="font-medium text-emerald-100">${current.toFixed(current < 1 ? 2 : 1)} / ${goal}${meta.unit}</span>
        </div>
        <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full ${colorClass} transition-all duration-500" style="width: ${percent}%"></div>
        </div>
      `;
      othersGrid.appendChild(div);
    });
  }

  // Update Log List
  renderLog();

  // Update Insights
  renderInsights(insights);
}

function updateChart(id, value, goal) {
  const percent = Math.min(100, Math.round((value / goal) * 100) || 0);
  const chart = state.charts[id];
  if (!chart) return;

  chart.data.datasets[0].data = [percent, 100 - percent];
  chart.update();

  const percentEl = document.getElementById(`${id}-percent`);
  if (percentEl) percentEl.textContent = `${percent}%`;
  
  const valueEl = document.getElementById(`${id}-value`);
  if (valueEl) {
    const meta = NUTRIENT_METADATA[id];
    const unit = meta?.unit || '';
    
    if (id === 'ala') {
      valueEl.textContent = `${(value/1000).toFixed(2)} / ${(goal/1000).toFixed(1)}g`;
    } else {
      valueEl.textContent = `${value.toFixed(value < 1 ? 2 : 1)} / ${goal}${unit}`;
    }
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
    selectors.insightsContainer.innerHTML = `<div class="col-span-full p-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-center text-slate-500 italic text-sm">${t('add_food_placeholder')}</div>`;
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
