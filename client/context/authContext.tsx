"use client";

import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, DocumentData, getDoc } from "firebase/firestore";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDatObj, setuserDataObj] = useState<DocumentData | null>(null);
  const [loading, setloading] = useState(true);

  //AUTH handlers
  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setuserDataObj(null);
    setCurrentUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setloading(true);
        setCurrentUser(user);
        if (!user) {
          return;
        }
        console.log("fetching user data");
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        let firebaseData = {};
        if (docSnap.exists()) {
          console.log("found user data");
          firebaseData = docSnap.data();
          console.log(firebaseData);
        }
        setuserDataObj(firebaseData);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setloading(false);
      }
    });
    return unsubscribe;
  }, []);
  const value: AuthContextType = {
    currentUser,
    userDatObj,
    signup,
    logout,
    login,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export interface AuthContextType {
  currentUser: User | null;
  userDatObj: DocumentData | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  loading: boolean;
}
