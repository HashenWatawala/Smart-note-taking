// src/context/AuthContext.jsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGooglePopup,
  signOutUser
} from "../firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = (email, password) => signInWithEmail(email, password);
  const signUp = (email, password, displayName) =>
    signUpWithEmail(email, password, displayName);
  const signInWithGoogle = () => signInWithGooglePopup();
  const signOut = () => signOutUser();

  return (
    <AuthContext.Provider value={{ user, loadingAuth, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
