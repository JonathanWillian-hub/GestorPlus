// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyARpXJ2pFS0f2s26sU1dXFdCIzqwRWTVSo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gestorplus-12a03.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gestorplus-12a03",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gestorplus-12a03.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "648002932896",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:648002932896:web:d420af3dc89d91d41179c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase App Check com reCAPTCHA v3
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || "SUA_CHAVE_DE_SITE_AQUI"),
    isTokenAutoRefreshEnabled: true // Atualiza o token automaticamente em background
  });
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with offline persistence (persistent cache)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});

export default firebaseConfig;