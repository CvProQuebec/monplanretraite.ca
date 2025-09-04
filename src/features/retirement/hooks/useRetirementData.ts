// src/features/retirement/hooks/useRetirementData.ts
import { useState, useEffect, useMemo } from 'react';
import { UserData, Calculations } from '../types';
import { CalculationService } from '../services/CalculationService';
import { InputSanitizer } from '@/utils/inputSanitizer';
import { DataMigrationService } from '@/services/DataMigrationService';

// Utilisation de sessionStorage pour la persistance temporaire uniquement
const SESSION_STORAGE_KEY = 'retirement-session-data';
const LOCAL_STORAGE_KEY = 'retirement-backup-data';

const defaultUserData: UserData = {
  personal: {
    prenom1: '',  // Maintenant vide
    prenom2: '',  // Maintenant vide
    naissance1: '',  // Maintenant vide
    naissance2: '',  // Maintenant vide
    sexe1: '' as any,
    sexe2: '' as any,
    salaire1: 0,  // Maintenant vide
    salaire2: 0,  // Maintenant vide
    // Nouvelles valeurs par défaut
    statutProfessionnel1: '' as any,
    statutProfessionnel2: '' as any,
    ageRetraiteSouhaite1: 0,
    ageRetraiteSouhaite2: 0,
    depensesRetraite: 0,  // Maintenant vide
    // Revenus unifiés
    unifiedIncome1: [],
    unifiedIncome2: [],
    // Champs d'investissements
    soldeREER1: 0,
    dateREER1: '',
    soldeCELI1: 0,
    dateCELI1: '',
    soldeCRI1: 0,
    dateCRI1: '',
    soldeREER2: 0,
    dateREER2: '',
    soldeCELI2: 0,
    dateCELI2: '',
    soldeCRI2: 0,
    dateCRI2: ''
  },
  retirement: {
    rrqAgeActuel1: 0,  // Maintenant vide
    rrqMontantActuel1: 0,
    rrqMontant70_1: 0,
    esperanceVie1: 0,  // Maintenant vide
    rrqAgeActuel2: 0,  // Maintenant vide
    rrqMontantActuel2: 0,
    rrqMontant70_2: 0,
    esperanceVie2: 0,  // Maintenant vide
    rregopMembre1: '' as any,  // Maintenant vide
    rregopAnnees1: 0,
    pensionPrivee1: 0,
    pensionPrivee2: 0,
    // Valeurs par défaut pour la Sécurité de la vieillesse
    svMontant1: 0,
    svMontant2: 0,
    svRevenus1: 0,
    svRevenus2: 0,
    svAgeDebut1: 0,  // Maintenant vide
    svAgeDebut2: 0,  // Maintenant vide
    // Champs pour la gestion biannuelle SV
    svBiannual1: undefined,
    svBiannual2: undefined
  },
  savings: {
    reer1: 0,
    reer2: 0,
    celi1: 0,
    celi2: 0,
    placements1: 0,
    placements2: 0,
    epargne1: 0,
    epargne2: 0,
    cri1: 0,
    cri2: 0,
    residenceValeur: 0,
    residenceHypotheque: 0
  },
      cashflow: {
      logement: 0,
      servicesPublics: 0,
      assurances: 0,
      telecom: 0,
      alimentation: 0,
      transport: 0,
      sante: 0,
      loisirs: 0
    },
    emergency: {
      contactsUrgence: '',
      directivesMedicales: '',
      assuranceVie: 0,
      testament: ''
    },
    session: {
      sauvegardeLocale: false,
      sauvegardeCloud: false,
      exportDonnees: false,
      importDonnees: false
    }
  };

// Validation des données
const validateUserData = (data: any): UserData => {
  try {
    // Fusionner avec les données par défaut pour s'assurer que toutes les sections existent
    const mergedData = {
      ...defaultUserData,
      ...data,
      personal: {
        ...defaultUserData.personal,
        ...data.personal,
        // S'assurer que les revenus unifiés sont des tableaux valides
        unifiedIncome1: Array.isArray(data.personal?.unifiedIncome1) ? data.personal.unifiedIncome1 : [],
        unifiedIncome2: Array.isArray(data.personal?.unifiedIncome2) ? data.personal.unifiedIncome2 : []
      },
      retirement: {
        ...defaultUserData.retirement,
        ...data.retirement
      },
      savings: {
        ...defaultUserData.savings,
        ...data.savings
      },
      cashflow: {
        ...defaultUserData.cashflow,
        ...data.cashflow
      },
      emergency: {
        ...defaultUserData.emergency,
        ...data.emergency
      },
      session: {
        ...defaultUserData.session,
        ...data.session
      }
    };

    // Validation des salaires (doivent être des nombres positifs)
    if (mergedData.personal.salaire1 < 0 || mergedData.personal.salaire2 < 0) {
      console.warn('Salaires négatifs détectés, correction automatique');
      mergedData.personal.salaire1 = Math.max(0, mergedData.personal.salaire1);
      mergedData.personal.salaire2 = Math.max(0, mergedData.personal.salaire2);
    }

    console.log('✅ Données validées et fusionnées:', mergedData);
    return mergedData as UserData;
  } catch (error) {
    console.error('Erreur de validation des données:', error);
    console.log('🔄 Utilisation des données par défaut');
    return defaultUserData;
  }
};

export const useRetirementData = () => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Charger les données au montage - TOUJOURS commencer avec des données vides
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Vérifier s'il y a des données de session en cours
        const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionData) {
          try {
            const parsedData = JSON.parse(sessionData);
            const validatedData = validateUserData(parsedData);
            setUserData(validatedData);
            console.log('📊 Données de session chargées');
          } catch (error) {
            console.warn('⚠️ Données de session corrompues, utilisation des données par défaut');
            setUserData(defaultUserData);
          }
        } else {
          // Vérifier s'il y a des données importées dans localStorage
          const importedData = localStorage.getItem('retirement_data');
          if (importedData) {
            try {
              const parsedData = JSON.parse(importedData);
              console.log('📥 Données brutes chargées depuis localStorage:', parsedData);
              console.log('📊 unifiedIncome1:', parsedData.personal?.unifiedIncome1);
              console.log('📊 unifiedIncome2:', parsedData.personal?.unifiedIncome2);
              
              // Vérifier et effectuer la migration si nécessaire
              if (DataMigrationService.needsMigration()) {
                console.log('🔄 Migration des données en cours...');
                const migrationResult = DataMigrationService.migrateUserData(parsedData);
                if (migrationResult.success) {
                  console.log('✅ Migration réussie:', migrationResult.migratedFields);
                  DataMigrationService.saveMigratedData(parsedData);
                } else {
                  console.warn('⚠️ Erreurs lors de la migration:', migrationResult.errors);
                }
              }
              
              const validatedData = validateUserData(parsedData);
              console.log('✅ Données validées:', validatedData);
              setUserData(validatedData);
              console.log('📥 Données importées chargées depuis localStorage');
            } catch (error) {
              console.warn('⚠️ Données importées corrompues, utilisation des données par défaut');
              setUserData(defaultUserData);
            }
          } else {
            // Toujours commencer avec des données vides
            setUserData(defaultUserData);
            console.log('🆕 Nouvelle session - données vides initialisées');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données de session');
        setUserData(defaultUserData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sauvegarder automatiquement dans sessionStorage (temporaire) et localStorage
  useEffect(() => {
    if (!isLoading && userData !== defaultUserData) {
      try {
        // Sauvegarde en session
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
        console.log('💾 Données sauvegardées en session');
        
        // Sauvegarde en localStorage pour la persistance
        localStorage.setItem('retirement_data', JSON.stringify(userData));
        console.log('💾 Données sauvegardées en localStorage');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        setError('Impossible de sauvegarder les données');
      }
    }
  }, [userData, isLoading]);

  // Écouter les événements d'importation de données
  useEffect(() => {
    const handleDataImported = (event: CustomEvent) => {
      try {
        const importedData = event.detail.data;
        console.log('📥 Données importées reçues via événement:', importedData);
        console.log('📊 unifiedIncome1 importé:', importedData.personal?.unifiedIncome1);
        console.log('📊 unifiedIncome2 importé:', importedData.personal?.unifiedIncome2);
        const validatedData = validateUserData(importedData);
        console.log('✅ Données validées après import:', validatedData);
        setUserData(validatedData);
        console.log('📥 Données importées reçues via événement et appliquées');
      } catch (error) {
        console.error('Erreur lors du traitement des données importées:', error);
      }
    };

    window.addEventListener('retirementDataImported', handleDataImported as EventListener);

    return () => {
      window.removeEventListener('retirementDataImported', handleDataImported as EventListener);
    };
  }, []);

  // Nettoyer automatiquement à la fermeture de la session
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Sauvegarder une copie de sauvegarde locale avant de fermer
      try {
        if (userData !== defaultUserData) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            data: userData,
            timestamp: new Date().toISOString(),
            sessionId: sessionId
          }));
          console.log('💾 Sauvegarde locale créée avant fermeture');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde locale:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleBeforeUnload(); // Sauvegarde finale
    };
  }, [userData, sessionId]);

  // Calculs mémorisés
  const calculations = useMemo(() => {
    try {
      return CalculationService.calculateAll(userData);
    } catch (error) {
      console.error('Erreur lors des calculs:', error);
      setError('Erreur dans les calculs financiers');
      return {
        netWorth: 0,
        retirementCapital: 0,
        sufficiency: 0,
        taxSavings: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0
      };
    }
  }, [userData]);

  // Fonction de mise à jour partielle avec validation
  const updateUserData = (section: keyof UserData, updates: any) => {
    try {
      setError(null);
      
      // Sanitize input data before updating
      const sanitizedUpdates = InputSanitizer.sanitizeUserData(updates);
      
      setUserData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...sanitizedUpdates
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour des données');
    }
  };

  // Fonction de réinitialisation complète
  const resetData = () => {
    try {
      setError(null);
      setUserData(defaultUserData);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      console.log('🔄 Données réinitialisées');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setError('Erreur lors de la réinitialisation');
    }
  };

  // Fonction de récupération de la dernière sauvegarde locale
  const restoreFromBackup = () => {
    try {
      const backup = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (backup) {
        const parsedBackup = JSON.parse(backup);
        const validatedData = validateUserData(parsedBackup.data);
        setUserData(validatedData);
        setError(null);
        console.log('📥 Données restaurées depuis la sauvegarde locale');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      setError('Impossible de restaurer les données de sauvegarde');
      return false;
    }
  };

  // Fonction de suppression de la sauvegarde locale
  const clearBackup = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log('🗑️ Sauvegarde locale supprimée');
    } catch (error) {
      console.error('Erreur lors de la suppression de la sauvegarde:', error);
    }
  };

  // Fonction d'export des données
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `retirement-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('📤 Données exportées');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setError('Impossible d\'exporter les données');
    }
  };

  // Fonction d'import des données
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Détecter la structure (comme dans SauvegarderCharger.tsx)
        const payload = importedData?.data ?? importedData;
        
        if (!payload || typeof payload !== 'object') {
          throw new Error('Invalid content');
        }
        
        const validatedData = validateUserData(payload);
        setUserData(validatedData);
        
        // Sauvegarder aussi dans localStorage pour la persistance
        localStorage.setItem('retirement_data', JSON.stringify(payload));
        
        setError(null);
        console.log('📥 Données importées avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        setError('Format de fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  // Vérifier s'il y a une sauvegarde locale disponible
  const hasBackup = () => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  };

  // Calcul dynamique des progressions par section
  const calculateSectionProgress = (section: keyof UserData) => {
    try {
      const sectionData = userData[section];
      let totalFields = 0;
      let completedFields = 0;

      switch (section) {
        case 'personal':
          // Champs requis pour le profil personnel
          const personalFields = [
            'prenom1', 'naissance1', 'sexe1', 'salaire1', 'statutProfessionnel1', 
            'ageRetraiteSouhaite1', 'depensesRetraite'
          ];
          totalFields = personalFields.length;
          completedFields = personalFields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }).length;
          break;

        case 'retirement':
          // Champs requis pour la planification retraite
          const retirementFields = [
            'rrqAgeActuel1', 'esperanceVie1', 'rregopMembre1', 'pensionPrivee1'
          ];
          totalFields = retirementFields.length;
          completedFields = retirementFields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }).length;
          break;

        case 'savings':
          // Champs requis pour l'épargne
          const savingsFields = [
            'reer1', 'celi1', 'placements1', 'epargne1', 'residenceValeur'
          ];
          totalFields = savingsFields.length;
          completedFields = savingsFields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }).length;
          break;

        case 'cashflow':
          // Champs requis pour le cashflow
          const cashflowFields = [
            'logement', 'servicesPublics', 'assurances', 'telecom', 'alimentation', 
            'transport', 'sante', 'loisirs'
          ];
          totalFields = cashflowFields.length;
          completedFields = cashflowFields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }).length;
          break;

        case 'emergency':
          // Champs requis pour les informations d'urgence
          const emergencyFields = [
            'contactsUrgence', 'directivesMedicales', 'assuranceVie', 'testament'
          ];
          totalFields = emergencyFields.length;
          completedFields = emergencyFields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }).length;
          break;

        case 'session':
          // Champs requis pour la gestion des sessions
          const sessionFields = [
            'sauvegardeLocale', 'sauvegardeCloud', 'exportDonnees', 'importDonnees'
          ];
          totalFields = sessionFields.length;
          completedFields = sessionFields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '' && value !== 0;
          }).length;
          break;

        default:
          return 0;
      }

      return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    } catch (error) {
      console.error('Erreur lors du calcul de progression:', error);
      return 0;
    }
  };

  // Calcul du statut basé sur la progression
  const getSectionStatus = (progress: number): 'not-started' | 'in-progress' | 'completed' => {
    if (progress === 0) return 'not-started';
    if (progress < 100) return 'in-progress';
    return 'completed';
  };

  return {
    userData,
    updateUserData,
    calculations,
    isLoading,
    error,
    resetData,
    exportData,
    importData,
    restoreFromBackup,
    clearBackup,
    hasBackup,
    clearError: () => setError(null),
    sessionId,
    calculateSectionProgress,
    getSectionStatus
  };
};