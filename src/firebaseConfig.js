// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDjDVGQjrzSpdp6wjqBZzAFno88At96R5E",
  authDomain: "ftwears.firebaseapp.com",
  databaseURL: "https://ftwears-default-rtdb.firebaseio.com",
  projectId: "ftwears",
  storageBucket: "ftwears.appspot.com",
  messagingSenderId: "986640733556",
  appId: "1:986640733556:web:bb56464f7d59dcd2928821",
  measurementId: "G-68RLS6N1YH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);  // Firestore should be initialized after Firebase

export const storage = getStorage(app);
