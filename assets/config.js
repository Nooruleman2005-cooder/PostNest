import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    GoogleAuthProvider ,
    signInWithPopup} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

    import {
      getFirestore, 
      collection, 
      addDoc ,
      getDocs ,
      deleteDoc,
      doc,
      getDoc,
      updateDoc,
      setDoc,
      query,
      where 
    }
     from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDF_MgJO249LDereoiSKEkhoracx9LY6Ms",
    authDomain: "authentication-b6262.firebaseapp.com",
    projectId: "authentication-b6262",
    storageBucket: "authentication-b6262.firebasestorage.app",
    messagingSenderId: "964736118911",
    appId: "1:964736118911:web:3ca46243ba504598038f4a"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    getFirestore, 
    collection, 
    addDoc ,
    getDocs ,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    db,
    onAuthStateChanged,
    query, 
    where,
    GoogleAuthProvider ,
    signInWithPopup
}