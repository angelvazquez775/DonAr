// firebaseCredenciales.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD5gP5oVTAqRQTdkbiKlVzmj3Rn90373i4",
  authDomain: "hat01-d89f9.firebaseapp.com",
  projectId: "hat01-d89f9",
  storageBucket: "hat01-d89f9.appspot.com",
  messagingSenderId: "858797015039",
  appId: "1:858797015039:web:17113036b7a00347a231ca",
  measurementId: "G-D9NCY52XV3"
};

// Inicializa Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase); // Usa appFirebase aquí
const auth = getAuth(appFirebase); // Inicializa la autenticación

export { appFirebase, auth }; // Exporta tanto la app como la autenticación
