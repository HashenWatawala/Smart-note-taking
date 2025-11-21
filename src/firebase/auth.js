import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "./config";

// --- Email Sign In ---
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// --- Email Sign Up ---
export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// --- Google Sign In ---
export const googleLogin = async () => {
  return await signInWithPopup(auth, googleProvider);
};
