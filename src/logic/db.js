import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, writeBatch } from 'firebase/firestore';

// In-memory cache to reduce redundant reads during a session
const cache = {
  customFoods: null,
  log: null,
  userId: null
};

function clearCacheIfUserChanged(userId) {
  if (cache.userId !== userId) {
    cache.customFoods = null;
    cache.log = null;
    cache.userId = userId;
  }
}

export async function getCloudCustomFoods(userId, forceRefresh = false) {
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerCustomFoods');
    return saved ? JSON.parse(saved) : [];
  }

  clearCacheIfUserChanged(userId);
  if (!forceRefresh && cache.customFoods) {
    return cache.customFoods;
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'custom_foods'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    cache.customFoods = data;
    return data;
  } catch (error) {
    console.error("Error fetching custom foods:", error);
    return cache.customFoods || [];
  }
}

export async function saveCloudCustomFood(userId, food) {
  const newId = 'custom_' + Date.now();
  const foodToSave = { ...food, id: newId, isCustom: true };
  
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerCustomFoods');
    const custom = saved ? JSON.parse(saved) : [];
    custom.push(foodToSave);
    localStorage.setItem('veganAnalyzerCustomFoods', JSON.stringify(custom));
    return;
  }
  
  try {
    await setDoc(doc(db, 'users', userId, 'custom_foods', newId), foodToSave);
    // Invalidate cache
    cache.customFoods = null;
  } catch (error) {
    console.error("Error saving custom food:", error);
  }
}

export async function updateCloudCustomFood(userId, id, food) {
  const foodToSave = { ...food, id, isCustom: true };
  
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerCustomFoods');
    let custom = saved ? JSON.parse(saved) : [];
    const index = custom.findIndex(f => f.id === id);
    if (index !== -1) custom[index] = foodToSave;
    localStorage.setItem('veganAnalyzerCustomFoods', JSON.stringify(custom));
    return;
  }
  
  try {
    await setDoc(doc(db, 'users', userId, 'custom_foods', id), foodToSave);
    // Invalidate cache
    cache.customFoods = null;
  } catch (error) {
    console.error("Error updating custom food:", error);
  }
}

export async function deleteCloudCustomFood(userId, id) {
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerCustomFoods');
    let custom = saved ? JSON.parse(saved) : [];
    custom = custom.filter(f => f.id !== id);
    localStorage.setItem('veganAnalyzerCustomFoods', JSON.stringify(custom));
    return;
  }
  
  try {
    await deleteDoc(doc(db, 'users', userId, 'custom_foods', id));
    // Invalidate cache
    cache.customFoods = null;
  } catch (error) {
    console.error("Error deleting custom food:", error);
  }
}

// Bulk save optimized with WriteBatch
export async function saveCloudCustomFoodsBulk(userId, foodsArray) {
  if (!userId || !foodsArray.length) return;
  
  try {
    const batch = writeBatch(db);
    foodsArray.forEach(food => {
      const newId = 'custom_' + Math.random().toString(36).substr(2, 9) + Date.now();
      const foodToSave = { ...food, id: newId, isCustom: true };
      const docRef = doc(db, 'users', userId, 'custom_foods', newId);
      batch.set(docRef, foodToSave);
    });
    
    await batch.commit();
    cache.customFoods = null; // Invalidate cache
  } catch (error) {
    console.error("Error in bulk save:", error);
    // Fallback to loop if batch is too large (Firestore limit is 500)
    if (foodsArray.length > 500) {
      for (const food of foodsArray) {
        await saveCloudCustomFood(userId, food);
      }
    }
  }
}

// Logbook sync
export async function saveCloudLog(userId, log) {
  if (!userId) {
    localStorage.setItem('veganAnalyzerLogbook', JSON.stringify(log));
    return;
  }
  try {
    await setDoc(doc(db, 'users', userId, 'logbook', 'current'), { log });
    cache.log = log; // Update memory cache
  } catch (error) {
    console.error("Error saving log:", error);
  }
}

export async function getCloudLog(userId, forceRefresh = false) {
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerLogbook');
    return saved ? JSON.parse(saved) : [];
  }

  clearCacheIfUserChanged(userId);
  if (!forceRefresh && cache.log) {
    return cache.log;
  }

  try {
    const docSnap = await getDoc(doc(db, 'users', userId, 'logbook', 'current'));
    if (docSnap.exists() && docSnap.data().log) {
      const data = docSnap.data().log;
      cache.log = data;
      return data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching log:", error);
    return cache.log || [];
  }
}

