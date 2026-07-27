import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

// Medical Records Functions
export const addMedicalRecord = async (userId, recordData) => {
  try {
    const docRef = await addDoc(collection(db, 'medicalRecords'), {
      userId,
      ...recordData,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding record:', error);
    return { success: false, error: error.message };
  }
};

export const getMedicalRecords = async (userId) => {
  try {
    const q = query(
      collection(db, 'medicalRecords'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, records };
  } catch (error) {
    console.error('Error fetching records:', error);
    return { success: false, error: error.message };
  }
};

export const updateMedicalRecord = async (recordId, updatedData) => {
  try {
    const recordRef = doc(db, 'medicalRecords', recordId);
    await updateDoc(recordRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating record:', error);
    return { success: false, error: error.message };
  }
};

export const deleteMedicalRecord = async (recordId) => {
  try {
    await deleteDoc(doc(db, 'medicalRecords', recordId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting record:', error);
    return { success: false, error: error.message };
  }
};

// Medicine Inventory Functions
export const addMedicine = async (userId, medicineData) => {
  try {
    const docRef = await addDoc(collection(db, 'medicines'), {
      userId,
      ...medicineData,
      addedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding medicine:', error);
    return { success: false, error: error.message };
  }
};

export const getMedicines = async (userId) => {
  try {
    const q = query(
      collection(db, 'medicines'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const medicines = [];
    querySnapshot.forEach((doc) => {
      medicines.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, medicines };
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return { success: false, error: error.message };
  }
};

// Reminders Functions
export const addReminder = async (userId, reminderData) => {
  try {
    const docRef = await addDoc(collection(db, 'reminders'), {
      userId,
      ...reminderData,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding reminder:', error);
    return { success: false, error: error.message };
  }
};

export const getReminders = async (userId) => {
  try {
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const reminders = [];
    querySnapshot.forEach((doc) => {
      reminders.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, reminders };
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return { success: false, error: error.message };
  }
};

// Blood Requests Functions
export const addBloodRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'bloodRequests'), {
      ...requestData,
      postedAt: new Date().toISOString(),
      verified: true,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding blood request:', error);
    return { success: false, error: error.message };
  }
};

export const getBloodRequests = async () => {
  try {
    const q = query(
      collection(db, 'bloodRequests'),
      orderBy('postedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, requests };
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    return { success: false, error: error.message };
  }
};

// Upload Image to Firebase Storage
export const uploadImage = async (userId, imageUri, folder = 'prescriptions') => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const filename = `${folder}/${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
};

// Emergency Profile Functions
export const updateEmergencyProfile = async (userId, profileData) => {
  try {
    const profileRef = doc(db, 'emergencyProfiles', userId);
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating emergency profile:', error);
    return { success: false, error: error.message };
  }
};

export const getEmergencyProfile = async (userId) => {
  try {
    const profileRef = doc(db, 'emergencyProfiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      return { success: true, profile: profileSnap.data() };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error) {
    console.error('Error fetching emergency profile:', error);
    return { success: false, error: error.message };
  }
};