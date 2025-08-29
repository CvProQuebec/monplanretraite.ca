// src/hooks/useAuth.tsx - FIREBASE RÉACTIVÉ + MODE DÉVELOPPEMENT LOCAL
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { SubscriptionPlan, UserSubscription, User } from '@/types/subscription';

// Mode développement local - DÉSACTIVE Firebase pour les tests
const LOCAL_DEV_MODE = true; // FORCÉ pour les tests

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPlan: (plan: SubscriptionPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Créer ou récupérer un utilisateur
  const createOrGetUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    } else {
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Utilisateur',
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    if (LOCAL_DEV_MODE) {
      // Mode développement local - utilisateur simulé
      const mockUser: User = {
        id: 'local-dev-user',
        email: 'dev@monplanretraite.ca',
        displayName: 'Développeur Local',
        plan: 'expert', // Plan Expert pour tester toutes les fonctionnalités
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setUser(mockUser);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = await createOrGetUser(result.user);
      setUser(user);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  // Déconnexion
  const signOut = async () => {
    if (LOCAL_DEV_MODE) {
      setUser(null);
      return;
    }

    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Mettre à jour le plan utilisateur
  const updateUserPlan = async (plan: SubscriptionPlan) => {
    if (!user) return;
    
    if (LOCAL_DEV_MODE) {
      // Mode développement local - mise à jour simulée
      setUser(prev => prev ? { ...prev, plan, updatedAt: new Date() } : null);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { plan, updatedAt: new Date() });
      setUser(prev => prev ? { ...prev, plan, updatedAt: new Date() } : null);
    } catch (error) {
      console.error('Erreur de mise à jour du plan:', error);
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    if (LOCAL_DEV_MODE) {
      // Mode développement local - utilisateur automatiquement connecté
      console.log('🔧 MODE DÉVELOPPEMENT LOCAL ACTIVÉ - Firebase désactivé');
      const mockUser: User = {
        id: 'local-dev-user',
        email: 'dev@monplanretraite.ca',
        displayName: 'Développeur Local',
        plan: 'expert', // Plan Expert pour tester toutes les fonctionnalités
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setUser(mockUser);
      setLoading(false);
      return;
    }

    console.log('🔍 useAuth - Démarrage de l\'écouteur d\'authentification');
    console.log('🔍 useAuth - Firebase auth disponible:', !!auth);
      console.log('🔍 useAuth - Variables Firebase dans useAuth:', {
        apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY ? '***MASKED***' : 'undefined',
        authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN ? '***MASKED***' : 'undefined',
        projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID ? '***MASKED***' : 'undefined'
      });
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔍 useAuth - Changement d\'état Firebase détecté:', !!firebaseUser);
      if (firebaseUser) {
        console.log('🔍 useAuth - Utilisateur Firebase connecté:', firebaseUser.email);
        try {
          const user = await createOrGetUser(firebaseUser);
          console.log('🔍 useAuth - Utilisateur créé/récupéré:', user);
          setUser(user);
        } catch (error) {
          console.error('❌ useAuth - Erreur lors de la création/récupération:', error);
        }
      } else {
        console.log('🔍 useAuth - Aucun utilisateur Firebase connecté');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('🔍 useAuth - Nettoyage de l\'écouteur d\'authentification');
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    updateUserPlan
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
