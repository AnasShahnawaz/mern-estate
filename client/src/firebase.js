import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-real-estate-175f6.firebaseapp.com",
    projectId: "mern-real-estate-175f6",
    storageBucket: "mern-real-estate-175f6.appspot.com",
    messagingSenderId: "724401230276",
    appId: "1:724401230276:web:2940d9bca9385722f89491",
    measurementId: "G-YKE88P1X0L"
};

export const app = initializeApp(firebaseConfig);