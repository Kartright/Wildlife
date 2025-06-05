// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnoyxJVOjKmCD4ozjzpkdRaiCu03O6Lps",
  authDomain: "wildlifeapp-60e4e.firebaseapp.com",
  projectId: "wildlifeapp-60e4e",
  storageBucket: "wildlifeapp-60e4e.firebasestorage.app",
  messagingSenderId: "803821600728",
  appId: "1:803821600728:web:a956ab8537f65f4aeffcad",
  measurementId: "G-90PJY129YK"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);