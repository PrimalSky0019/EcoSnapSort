// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-506275756-8ce5d",
  "appId": "1:694240539482:web:38133f3a96adeb022bb963",
  "storageBucket": "studio-506275756-8ce5d.firebasestorage.app",
  "apiKey": "AIzaSyAZegjh8j2o3Endz7zk0bxsYtn-R-jy9ys",
  "authDomain": "studio-506275756-8ce5d.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "694240539482"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
