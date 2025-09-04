// Service de correction critique pour la persistance des données
export class CriticalDataFix {
  private static readonly STORAGE_KEYS = {
    SESSION: 'retirement-session-data',
    LOCAL: 'retirement-backup-data',
    CRITICAL: 'critical-retirement-data'
  };

  // Sauvegarde critique immédiate
  static saveCriticalData(userData: any): void {
    try {
      console.log('🚨 CRITICAL SAVE - Saving data:', userData);
      
      // Sauvegarde multiple pour garantir la persistance
      sessionStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(userData));
      localStorage.setItem(this.STORAGE_KEYS.LOCAL, JSON.stringify(userData));
      localStorage.setItem(this.STORAGE_KEYS.CRITICAL, JSON.stringify(userData));
      
      // Sauvegarde spécifique pour les revenus unifiés
      if (userData.personal?.unifiedIncome1) {
        sessionStorage.setItem('unifiedIncome1', JSON.stringify(userData.personal.unifiedIncome1));
        localStorage.setItem('unifiedIncome1', JSON.stringify(userData.personal.unifiedIncome1));
      }
      
      if (userData.personal?.unifiedIncome2) {
        sessionStorage.setItem('unifiedIncome2', JSON.stringify(userData.personal.unifiedIncome2));
        localStorage.setItem('unifiedIncome2', JSON.stringify(userData.personal.unifiedIncome2));
      }
      
      // Sauvegarde spécifique pour RRQ/SV
      if (userData.retirement) {
        sessionStorage.setItem('retirementData', JSON.stringify(userData.retirement));
        localStorage.setItem('retirementData', JSON.stringify(userData.retirement));
      }
      
      console.log('✅ CRITICAL SAVE - Data saved successfully');
    } catch (error) {
      console.error('❌ CRITICAL SAVE ERROR:', error);
    }
  }

  // Chargement critique avec fallbacks multiples
  static loadCriticalData(): any {
    try {
      console.log('🚨 CRITICAL LOAD - Loading data...');
      
      // Essayer sessionStorage d'abord
      let data = this.tryLoadFromStorage(this.STORAGE_KEYS.SESSION);
      if (data) {
        console.log('✅ CRITICAL LOAD - Data loaded from sessionStorage');
        return this.cleanData(data);
      }
      
      // Essayer localStorage
      data = this.tryLoadFromStorage(this.STORAGE_KEYS.LOCAL);
      if (data) {
        console.log('✅ CRITICAL LOAD - Data loaded from localStorage');
        return this.cleanData(data);
      }
      
      // Essayer la sauvegarde critique
      data = this.tryLoadFromStorage(this.STORAGE_KEYS.CRITICAL);
      if (data) {
        console.log('✅ CRITICAL LOAD - Data loaded from critical storage');
        return this.cleanData(data);
      }
      
      // Essayer de reconstruire depuis les données partielles
      data = this.reconstructFromPartialData();
      if (data) {
        console.log('✅ CRITICAL LOAD - Data reconstructed from partial data');
        return this.cleanData(data);
      }
      
      console.log('⚠️ CRITICAL LOAD - No data found, returning default');
      return this.getDefaultData();
      
    } catch (error) {
      console.error('❌ CRITICAL LOAD ERROR:', error);
      return this.getDefaultData();
    }
  }

  private static tryLoadFromStorage(key: string): any {
    try {
      const data = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Error loading from ${key}:`, error);
    }
    return null;
  }

  private static reconstructFromPartialData(): any {
    try {
      const unifiedIncome1 = this.tryLoadFromStorage('unifiedIncome1') || [];
      const unifiedIncome2 = this.tryLoadFromStorage('unifiedIncome2') || [];
      const retirementData = this.tryLoadFromStorage('retirementData') || {};
      
      if (unifiedIncome1.length > 0 || unifiedIncome2.length > 0 || Object.keys(retirementData).length > 0) {
        return {
          personal: {
            unifiedIncome1,
            unifiedIncome2,
            ...this.getDefaultData().personal
          },
          retirement: {
            ...this.getDefaultData().retirement,
            ...retirementData
          }
        };
      }
    } catch (error) {
      console.error('Error reconstructing data:', error);
    }
    return null;
  }

  private static getDefaultData(): any {
    return {
      personal: {
        prenom1: '',
        prenom2: '',
        naissance1: '',
        naissance2: '',
        sexe1: '',
        sexe2: '',
        salaire1: 0,
        salaire2: 0,
        statutProfessionnel1: '',
        statutProfessionnel2: '',
        ageRetraiteSouhaite1: 0,
        ageRetraiteSouhaite2: 0,
        depensesRetraite: 0,
        unifiedIncome1: [],
        unifiedIncome2: [],
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
        rrqAgeActuel1: 0,
        rrqMontantActuel1: null, // null au lieu de 0 pour éviter l'affichage
        rrqMontant70_1: 0,
        esperanceVie1: 0,
        rrqAgeActuel2: 0,
        rrqMontantActuel2: null, // null au lieu de 0 pour éviter l'affichage
        rrqMontant70_2: 0,
        esperanceVie2: 0,
        svBiannual1: {
          periode1: { montant: null, date: '' }, // null au lieu de 0
          periode2: { montant: null, date: '' }  // null au lieu de 0
        },
        svBiannual2: {
          periode1: { montant: null, date: '' }, // null au lieu de 0
          periode2: { montant: null, date: '' }  // null au lieu de 0
        }
      }
    };
  }

  // Nettoyer les données pour supprimer les valeurs 0 indésirables
  static cleanData(userData: any): any {
    if (!userData) return userData;
    
    const cleaned = { ...userData };
    
    // Nettoyer les montants RRQ
    if (cleaned.retirement?.rrqMontantActuel1 === 0) {
      cleaned.retirement.rrqMontantActuel1 = null;
    }
    if (cleaned.retirement?.rrqMontantActuel2 === 0) {
      cleaned.retirement.rrqMontantActuel2 = null;
    }
    
    // Nettoyer les montants SV
    if (cleaned.retirement?.svBiannual1) {
      if (cleaned.retirement.svBiannual1.periode1?.montant === 0) {
        cleaned.retirement.svBiannual1.periode1.montant = null;
      }
      if (cleaned.retirement.svBiannual1.periode2?.montant === 0) {
        cleaned.retirement.svBiannual1.periode2.montant = null;
      }
    }
    
    if (cleaned.retirement?.svBiannual2) {
      if (cleaned.retirement.svBiannual2.periode1?.montant === 0) {
        cleaned.retirement.svBiannual2.periode1.montant = null;
      }
      if (cleaned.retirement.svBiannual2.periode2?.montant === 0) {
        cleaned.retirement.svBiannual2.periode2.montant = null;
      }
    }
    
    return cleaned;
  }

  // Sauvegarde automatique toutes les 5 secondes
  static startAutoSave(userData: any): void {
    setInterval(() => {
      this.saveCriticalData(userData);
    }, 5000);
  }
}
