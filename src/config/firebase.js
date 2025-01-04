import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAE-zuczYmIMGTy2x7d6yLFK9JlpHT9v5U",
  authDomain: "fir-react-55710.firebaseapp.com",
  projectId: "fir-react-55710",
  storageBucket: "fir-react-55710.firebasestorage.app",
  messagingSenderId: "460785562671",
  appId: "1:460785562671:web:f473b71c0c18dc967c02da",
  measurementId: "G-K3V3HMW40M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
