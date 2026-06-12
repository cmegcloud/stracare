const firebaseConfig = {

  apiKey: "AIzaSyDwfmoDPvslFmTn3GjO56VAxhODRlem5bg",

  authDomain: "stra-care.firebaseapp.com",

  projectId: "stra-care",

  storageBucket: "stra-care.firebasestorage.app",

  messagingSenderId: "329966100049",

  appId: "1:329966100049:web:d4b4dc7033f0ed12da6270",

  measurementId: "G-TQ7YK3RVSR"

};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
setDoc,
doc,
getDocs,
getDoc,
updateDoc,
deleteDoc,
query,
where,
onSnapshot,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

window.db = db;
window.auth = auth;

window.collection = collection;
window.addDoc = addDoc;
window.setDoc = setDoc;
window.doc = doc;
window.getDocs = getDocs;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.query = query;
window.where = where;
window.onSnapshot = onSnapshot;
window.serverTimestamp = serverTimestamp;

window.collections = {

users: collection(db,"users"),

branches: collection(db,"branches"),

patients: collection(db,"patients"),

doctors: collection(db,"doctors"),

appointments: collection(db,"appointments"),

receipts: collection(db,"receipts"),

payments: collection(db,"payments"),

receivables: collection(db,"receivables"),

settings: collection(db,"settings"),

logs: collection(db,"logs")

};
