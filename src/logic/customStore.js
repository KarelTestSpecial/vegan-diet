import { foods as initialFoods } from '../data/foods.js';

const STORAGE_KEY = 'veganCustomFoods';
const INITIALIZED_KEY = 'veganFoodsInitialized';

export function getCustomFoods() {
  const isInitialized = localStorage.getItem(INITIALIZED_KEY);
  
  if (!isInitialized) {
    // Seed the database with initial hardcoded foods
    const foodsToSeed = initialFoods.map(food => ({
      ...food,
      id: food.id || `custom-seed-${Math.random().toString(36).substr(2, 9)}`,
      isDefault: true
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodsToSeed));
    localStorage.setItem(INITIALIZED_KEY, 'true');
    return foodsToSeed;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveCustomFood(food) {
  const foods = getCustomFoods();
  // Ensure ID is unique
  food.id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  foods.push(food);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
  return food;
}

export function saveCustomFoods(newFoods) {
  const foods = getCustomFoods();
  const timestamp = Date.now();
  const added = newFoods.map((food, index) => ({
    ...food,
    id: `custom-${timestamp}-${index}`
  }));
  const updated = [...foods, ...added];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return added;
}

export function updateCustomFood(id, updatedFood) {
  const foods = getCustomFoods();
  const index = foods.findIndex(f => f.id === id);
  if (index !== -1) {
    foods[index] = { ...updatedFood, id }; // ensure ID doesn't change
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
    return foods[index];
  }
  return null;
}

export function deleteCustomFood(id) {
  const foods = getCustomFoods();
  const filtered = foods.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
