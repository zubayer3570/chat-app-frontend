// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCKPF62012_YgooaFcu4RxgUGroTemFX4",
    authDomain: "chat-app-89528.firebaseapp.com",
    projectId: "chat-app-89528",
    storageBucket: "chat-app-89528.appspot.com",
    messagingSenderId: "95114678950",
    appId: "1:95114678950:web:c0507b153b7cc33b2dda67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);