import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



// Initialize Firebase
const app = initializeApp();


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore();