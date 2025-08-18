// src/lib/firebase.ts - CORRECTION
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase CORRIGÉE
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Vérification stricte de la configuration
const isFirebaseConfigured = firebaseConfig.apiKey && 
                            firebaseConfig.apiKey !== "" &&
                            firebaseConfig.authDomain &&
                            firebaseConfig.projectId;

if (!isFirebaseConfigured) {
  console.error('❌ Firebase non configuré - Variables manquantes:', {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId
  });
  throw new Error('Firebase configuration incomplète');
}

console.log('✅ Firebase correctement configuré');

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;