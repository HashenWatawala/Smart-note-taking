// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ8Mff7oDPMM2h6nFXjhR6CBtJUar-Cos",
  authDomain: "note-taking-app-2540a.firebaseapp.com",
  projectId: "note-taking-app-2540a",
  storageBucket: "note-taking-app-2540a.firebasestorage.app",
  messagingSenderId: "871795892968",
  appId: "1:871795892968:web:05d7c7b7b6281e2990df5d",
  measurementId: "G-WL34J25ZHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
