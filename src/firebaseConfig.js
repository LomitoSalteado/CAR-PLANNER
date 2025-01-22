// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 

// Configuración de Firebase para tu aplicación
const firebaseConfig = {
  apiKey: "AIzaSyDVkdecRBLXJaHl2TImmrXywy4cfQYJDvY",
  authDomain: "carp-e0fd0.firebaseapp.com",
  projectId: "carp-e0fd0",
  storageBucket: "carp-e0fd0.firebasestorage.app",
  messagingSenderId: "998716010585",
  appId: "1:998716010585:web:ecef366b1885ea8676c148",
  measurementId: "G-VNL6D4BQTH"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
// Elimina la línea de analytics si no la usas
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
