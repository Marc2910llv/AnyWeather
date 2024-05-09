// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from 'firebase/messaging';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDIiufBFxSFulspNspDn_FbkKj1ThKiMXM",
  authDomain: "weather-8d3e5.firebaseapp.com",
  projectId: "weather-8d3e5",
  storageBucket: "weather-8d3e5.appspot.com",
  messagingSenderId: "1001358431984",
  appId: "1:1001358431984:web:d64e7aff05eb3bbaeb5435",
  measurementId: "G-3P6T3F7XCT"
};

// Initialize Firebase
export const appFirebase = initializeApp(firebaseConfig);
export const analytics = getAnalytics(appFirebase);

// ------------ Notifications ------------ //

// Get the messaging instance
export const messaging = getMessaging(appFirebase);

// Function to get or register the service worker
async function getOrRegisterServiceWorker() {
  // Check if service worker is supported by the browser
  if ('serviceWorker' in navigator) {
    try {
      let serviceWorkerRegistration = await window.navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');
      if (!serviceWorkerRegistration) {
        serviceWorkerRegistration = await window.navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("Success registering SW");
      }
      return serviceWorkerRegistration;
    } catch (error) {
      console.error("Registering failed", error);
      throw error;
    }
  } else {
    throw new Error('The browser doesn`t support service worker.');
  }
}

// Function to setup notification
export async function setupNotification() {
  try {
    const serviceWorkerRegistration = await getOrRegisterServiceWorker();
    const currentToken = await getToken(messaging, {
      vapidKey: "BBDIxsWo2yuc75P6o0pViR7QTydxgF2nuSwi_vVSLhbpHiKLdQMeq7zodiogxDpc-BlwJr08qYPtHGxxlfNgJZk",
      serviceWorkerRegistration
    });
    if (currentToken) {
      console.log(currentToken);
      saveToken(currentToken);
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token: ", error);
  }
}

// ------------ Login ------------ //

// Get the auth instance
export const auth = getAuth(appFirebase);

// Function to get the current user's email
export function getEmail() {
  return auth.currentUser.email
}

// Function to sign in
export async function signIn(mail, psw) {
  await signInWithEmailAndPassword(auth, mail, psw);
}

// Function to register
export async function register(mail, psw) {
  await createUserWithEmailAndPassword(auth, mail, psw);
}

// Function to log out
export function logout() {
  signOut(auth);
}

// Export onAuthStateChanged function
export { onAuthStateChanged }

// ------------ Database ------------ //

// Get the Firestore instance
export const db = getFirestore(appFirebase);

// Function to save token
async function saveToken(token) {
  try {
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'token'), { token });
  } catch (error) {
    console.error('Error saving token for user:', error);
  }
}

// // Function to check if location exists
export async function checkLocation(location) {
  const q = query(collection(db, 'cities'), where('name', '==', location));
  return await getDocs(q);
}

// Function to add location info
export async function addInfoLocation(data) {
  await addDoc(collection(db, 'cities'), data);
}

// Function to check location
export async function checkLocationCache(location) {
  const data = localStorage.getItem(location);
  return data ? JSON.parse(data) : null;
}

// Function to add location info
export async function addInfoLocationCache(data) {
  localStorage.setItem(data.name, JSON.stringify(data));
}


// Function to add user location
export async function addUserLocation(location) {
  const q = query(collection(db, 'users', auth.currentUser.uid, 'locations'), where('name', '==', location));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'locations'), { name: location });
    return true;
  }
  return false;
}

// Function to get user locations
export async function getUserLocations() {
  try {
    const fetchedLocations = [];
    const querySnapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'locations'));
    querySnapshot.forEach(locationDoc => {
      const name = locationDoc.data().name;
      if (typeof name === 'string') {
        fetchedLocations.push({ name });
      } else {
        console.warn(`Location name "${name}" is not a string.`);
      }
    });
    return fetchedLocations;
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw new Error('Error fetching user locations: ' + error.message);
  }
}

// Function to delete location
export async function deleteLocation(location) {
  const querySnapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'locations'));
  querySnapshot.forEach(async (doc) => {
    const data = doc.data();
    if (data.name === location) {
      await deleteDoc(doc.ref);
    }
  });
}