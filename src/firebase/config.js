// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your actual Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyDgyAnL2Z9zFSYx-e-HQqTeYu0UuduKMKs",
  authDomain: "keralavipani-595fd.firebaseapp.com",
  projectId: "keralavipani-595fd",
  storageBucket: "keralavipani-595fd.firebasestorage.app",
  messagingSenderId: "168959179006",
  appId: "1:168959179006:web:822a4ec19e95566ca5cdaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);