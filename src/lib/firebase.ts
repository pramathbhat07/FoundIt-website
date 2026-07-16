import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASpAIdCsimdUZTl8fYR6eWM6GV5rXMLs0",
  authDomain: "foundit-7c01c.firebaseapp.com",
  projectId: "foundit-7c01c",
  storageBucket: "foundit-7c01c.firebasestorage.app",
  messagingSenderId: "323301986830",
  appId: "1:323301986830:web:bc5978bea2e8bae5cca25f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
