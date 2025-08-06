import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { app } from './firebaseConfig';

const auth = getAuth(app);

export const signUpUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update username
    updateProfile(auth.currentUser, {
        displayName: username
    })
    // Create User Collection
    const usersRef = doc(db, 'Users', auth.currentUser.uid);
    await setDoc(usersRef, {
      displayName: username,
      reviewCount: 0,
    })
    return userCredential.user; // Returns the signed-up user object
  } catch (error) {
    throw new Error(error.message); // Handle the error appropriately
  }
};

export const signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const useAuth = () => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {setUser(user)});
      return unsubscribe;
    }, []);
  
    return user;
  };
  
export default useAuth;
export { auth };