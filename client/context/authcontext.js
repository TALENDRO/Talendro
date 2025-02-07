"use client";

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDatObj, setuserDataObj] = useState({});
  const [loading, setloading] = useState(true);

  //AUTH handlers
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setuserDataObj({});
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
      } catch (err) {
        console.log(err.message);
      } finally {
        setloading(false);
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    userDatObj,
    signup,
    logout,
    login,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
