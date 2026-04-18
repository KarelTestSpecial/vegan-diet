import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc } from 'firebase/firestore';

export async function getCloudCustomFoods(userId) {
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerCustomFoods');
    return saved ? JSON.parse(saved) : [];
  }
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'custom_foods'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching custom foods:", error);
    return [];
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
  } catch (error) {
    console.error("Error deleting custom food:", error);
  }
}

// Bulk save for TSV
export async function saveCloudCustomFoodsBulk(userId, foodsArray) {
  if (!userId) return;
  // A simple loop; in a real prod app use a batched write
  for (const food of foodsArray) {
    await saveCloudCustomFood(userId, food);
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
  } catch (error) {
    console.error("Error saving log:", error);
  }
}

export async function getCloudLog(userId) {
  if (!userId) {
    const saved = localStorage.getItem('veganAnalyzerLogbook');
    return saved ? JSON.parse(saved) : [];
  }
  try {
    const docSnap = await getDoc(doc(db, 'users', userId, 'logbook', 'current'));
    if (docSnap.exists() && docSnap.data().log) {
      return docSnap.data().log;
    }
    return [];
  } catch (error) {
    console.error("Error fetching log:", error);
    return [];
  }
}
