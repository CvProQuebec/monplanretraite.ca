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

// DEBUG: Afficher les valeurs des variables d'environnement
console.log('🔍 Variables Firebase détectées:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Présente' : '❌ Manquante',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Présente' : '❌ Manquante',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Présente' : '❌ Manquante',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Présente' : '❌ Manquante',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Présente' : '❌ Manquante',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Présente' : '❌ Manquante'
});

// MODE DÉVELOPPEMENT LOCAL - Firebase désactivé
const LOCAL_DEV_MODE = true; // FORCÉ pour les tests

// Déclarer les variables d'export au niveau racine
let auth: any;
let db: any;
let googleProvider: any;
let app: any;

if (LOCAL_DEV_MODE) {
  console.log('🔧 MODE DÉVELOPPEMENT LOCAL ACTIVÉ - Firebase désactivé');
  
  // Assigner des objets mock
  auth = {} as any;
  db = {} as any;
  googleProvider = {} as any;
  app = {} as any;
} else {
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
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

// Exporter au niveau racine
export { auth, db, googleProvider };
export default app;