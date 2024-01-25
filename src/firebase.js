// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAT0PrU3Uqvt3fwvrxJoJHWpVy9OohAkwA",
    authDomain: "cho-commerce.firebaseapp.com",
    projectId: "cho-commerce",
    storageBucket: "cho-commerce.appspot.com",
    messagingSenderId: "975543795594",
    appId: "1:975543795594:web:10be37e4b8ed4601d95273",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
