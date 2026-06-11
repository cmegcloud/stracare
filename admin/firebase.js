// firebase.js

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

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.appspot.com",

messagingSenderId: "123456789",

appId: "APP_ID"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

window.db = db;
window.auth = auth;

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