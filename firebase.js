// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJBKBEVqnaHR8E2GdAMiN1HpLxZkA0HCE",
  authDomain: "skillswap-59f77.firebaseapp.com",
  projectId: "skillswap-59f77",
  storageBucket: "skillswap-59f77.firebasestorage.app",
  messagingSenderId: "816739202231",
  appId: "1:816739202231:web:e881e1bb2715735df14932",
  measurementId: "G-9XBCH7J2C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);