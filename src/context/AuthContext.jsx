import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  loginUser, 
  registerUser, 
  googleLogin, 
  signOutUser 
} from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, current user:", user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Wrapper function to login using email and password
  async function signIn(email, password) {
    return await loginUser(email, password);
  }

  // Wrapper function to register new user
  async function signUp(email, password) {
    return await registerUser(email, password);
  }

  // Wrapper function to sign in with Google
  async function signInWithGoogle() {
    return await googleLogin();
  }

  // Wrapper function to sign out
  async function signOut() {
    return await signOutUser();
  }

  const value = {
    currentUser,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
