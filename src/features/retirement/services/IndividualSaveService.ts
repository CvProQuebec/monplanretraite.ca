// src/features/retirement/services/IndividualSaveService.ts
// Service pour la sauvegarde individuelle et combinée des données

import { UserData } from '../types';
import { EmergencyPlanningState } from '../types/emergency-planning';
import { EmergencyPlanningService } from './EmergencyPlanningService';

export interface Person1Data {
  // Données personnelles Personne 1
  personal: {
    prenom1: string;
    naissance1: string;
    sexe1: string;
    salaire1: number;
    statutProfessionnel1: string;
    ageRetraiteSouhaite1: number;
    // Données de revenus unifiés
    unifiedIncome1?: any[];
  };
  
  // Données retraite Personne 1
  retirement: {
    rrqAgeActuel1: number;
    rrqMontantActuel1: number;
    rrqMontant70_1: number;
    esperanceVie1: number;
    rregopMembre1: string;
    rregopAnnees1: number;
    pensionPrivee1: number;
    svMontant1: number;
    svRevenus1: number;
    svAgeDebut1: number;
  };
  
  // Épargnes Personne 1
  savings: {
    reer1: number;
    reer2: number;
    celi1: number;
    celi2: number;
    placements1: number;
    placements2: number;
    epargne1: number;
    epargne2: number;
    cri1: number;
    cri2: number;
  };
  
  // Métadonnées
  metadata: {
    dateCreation: Date;
    derniereMiseAJour: Date;
    version: string;
    personId: 'person1';
  };
}

export interface Person2Data {
  // Données personnelles Personne 2
  personal: {
    prenom2: string;
    naissance2: string;
    sexe2: string;
    salaire2: number;
    statutProfessionnel2: string;
    ageRetraiteSouhaite2: number;
    // Données de revenus unifiés
    unifiedIncome2?: any[];
  };
  
  // Données retraite Personne 2
  retirement: {
    rrqAgeActuel2: number;
    rrqMontantActuel2: number;
    rrqMontant70_2: number;
    esperanceVie2: number;
    pensionPrivee2: number;
    svMontant2: number;
    svRevenus2: number;
    svAgeDebut2: number;
  };
  
  // Épargnes Personne 2 (même structure que Personne 1 pour cohérence)
  savings: {
    reer1: number;
    reer2: number;
    celi1: number;
    celi2: number;
    placements1: number;
    placements2: number;
    epargne1: number;
    epargne2: number;
    cri1: number;
    cri2: number;
  };
  
  // Métadonnées
  metadata: {
    dateCreation: Date;
    derniereMiseAJour: Date;
    version: string;
    personId: 'person2';
  };
}

export interface CombinedFinancialData {
  // Données financières combinées (par défaut)
  personal: {
    // Données communes
    depensesRetraite: number;
  };
  
  // Toutes les données des 2 personnes
  person1: Person1Data;
  person2: Person2Data;
  
  // Données partagées
  savings: {
    // Résidence (partagée)
    residenceValeur: number;
    residenceHypotheque: number;
  };
  
  // Cashflow (partagé)
  cashflow: {
    logement: number;
    servicesPublics: number;
    assurances: number;
    telecom: number;
    alimentation: number;
    transport: number;
    sante: number;
    loisirs: number;
  };
  
  // Métadonnées
  metadata: {
    dateCreation: Date;
    derniereMiseAJour: Date;
    version: string;
    type: 'combined';
    personnes: ('person1' | 'person2')[];
  };
}

export interface EmergencyPlanFile {
  planificationUrgence: EmergencyPlanningState;
  metadata: {
    dateCreation: Date;
    derniereMiseAJour: Date;
    version: string;
    type: 'emergency_planning';
    personnes: ('person1' | 'person2')[];
  };
}

export class IndividualSaveService {
  private static readonly VERSION = '1.0.0';
  private static readonly STORAGE_KEYS = {
    PERSON1: 'individual_save_person1',
    PERSON2: 'individual_save_person2',
    COMBINED: 'individual_save_combined',
    EMERGENCY: 'individual_save_emergency'
  };

  /**
   * Extraire les données de la Personne 1
   */
  static extractPerson1Data(userData: UserData): Person1Data {
    return {
      personal: {
        prenom1: userData.personal.prenom1,
        naissance1: userData.personal.naissance1,
        sexe1: userData.personal.sexe1,
        salaire1: userData.personal.salaire1,
        statutProfessionnel1: userData.personal.statutProfessionnel1,
        ageRetraiteSouhaite1: userData.personal.ageRetraiteSouhaite1,
        // Inclure les données de revenus unifiés
        unifiedIncome1: userData.personal.unifiedIncome1 || [],
      },
      retirement: {
        rrqAgeActuel1: userData.retirement.rrqAgeActuel1,
        rrqMontantActuel1: userData.retirement.rrqMontantActuel1,
        rrqMontant70_1: userData.retirement.rrqMontant70_1,
        esperanceVie1: userData.retirement.esperanceVie1,
        rregopMembre1: userData.retirement.rregopMembre1,
        rregopAnnees1: userData.retirement.rregopAnnees1,
        pensionPrivee1: userData.retirement.pensionPrivee1,
        svMontant1: userData.retirement.svMontant1,
        svRevenus1: userData.retirement.svRevenus1,
        svAgeDebut1: userData.retirement.svAgeDebut1,
      },
      savings: {
        reer1: userData.savings.reer1,
        reer2: userData.savings.reer2,
        celi1: userData.savings.celi1,
        celi2: userData.savings.celi2,
        placements1: userData.savings.placements1,
        placements2: userData.savings.placements2,
        epargne1: userData.savings.epargne1,
        epargne2: userData.savings.epargne2,
        cri1: userData.savings.cri1,
        cri2: userData.savings.cri2,
      },
      metadata: {
        dateCreation: new Date(),
        derniereMiseAJour: new Date(),
        version: this.VERSION,
        personId: 'person1'
      }
    };
  }

  /**
   * Extraire les données de la Personne 2
   */
  static extractPerson2Data(userData: UserData): Person2Data {
    return {
      personal: {
        prenom2: userData.personal.prenom2,
        naissance2: userData.personal.naissance2,
        sexe2: userData.personal.sexe2,
        salaire2: userData.personal.salaire2,
        statutProfessionnel2: userData.personal.statutProfessionnel2,
        ageRetraiteSouhaite2: userData.personal.ageRetraiteSouhaite2,
        // Inclure les données de revenus unifiés
        unifiedIncome2: userData.personal.unifiedIncome2 || [],
      },
      retirement: {
        rrqAgeActuel2: userData.retirement.rrqAgeActuel2,
        rrqMontantActuel2: userData.retirement.rrqMontantActuel2,
        rrqMontant70_2: userData.retirement.rrqMontant70_2,
        esperanceVie2: userData.retirement.esperanceVie2,
        pensionPrivee2: userData.retirement.pensionPrivee2,
        svMontant2: userData.retirement.svMontant2,
        svRevenus2: userData.retirement.svRevenus2,
        svAgeDebut2: userData.retirement.svAgeDebut2,
      },
      savings: {
        reer1: userData.savings.reer1,
        reer2: userData.savings.reer2,
        celi1: userData.savings.celi1,
        celi2: userData.savings.celi2,
        placements1: userData.savings.placements1,
        placements2: userData.savings.placements2,
        epargne1: userData.savings.epargne1,
        epargne2: userData.savings.epargne2,
        cri1: userData.savings.cri1,
        cri2: userData.savings.cri2,
      },
      metadata: {
        dateCreation: new Date(),
        derniereMiseAJour: new Date(),
        version: this.VERSION,
        personId: 'person2'
      }
    };
  }

  /**
   * Créer les données financières combinées (par défaut)
   */
  static createCombinedFinancialData(userData: UserData): CombinedFinancialData {
    return {
      personal: {
        depensesRetraite: userData.personal.depensesRetraite,
      },
      person1: this.extractPerson1Data(userData),
      person2: this.extractPerson2Data(userData),
      savings: {
        residenceValeur: userData.savings.residenceValeur,
        residenceHypotheque: userData.savings.residenceHypotheque,
      },
      cashflow: userData.cashflow,
      metadata: {
        dateCreation: new Date(),
        derniereMiseAJour: new Date(),
        version: this.VERSION,
        type: 'combined',
        personnes: ['person1', 'person2']
      }
    };
  }

  /**
   * Créer le fichier de planification d'urgence
   */
  static createEmergencyPlanFile(emergencyState: EmergencyPlanningState): EmergencyPlanFile {
    const personnes: ('person1' | 'person2')[] = [];
    if (emergencyState.person1Plan) personnes.push('person1');
    if (emergencyState.person2Plan) personnes.push('person2');

    return {
      planificationUrgence: emergencyState,
      metadata: {
        dateCreation: new Date(),
        derniereMiseAJour: new Date(),
        version: this.VERSION,
        type: 'emergency_planning',
        personnes
      }
    };
  }

  /**
   * Sauvegarder individuellement Personne 1
   */
  static savePerson1Individual(userData: UserData): void {
    try {
      const person1Data = this.extractPerson1Data(userData);
      localStorage.setItem(this.STORAGE_KEYS.PERSON1, JSON.stringify(person1Data));
      console.log('💾 Données Personne 1 sauvegardées individuellement');
    } catch (error) {
      console.error('Erreur sauvegarde Personne 1:', error);
      throw new Error('Impossible de sauvegarder les données de la Personne 1');
    }
  }

  /**
   * Sauvegarder individuellement Personne 2
   */
  static savePerson2Individual(userData: UserData): void {
    try {
      const person2Data = this.extractPerson2Data(userData);
      localStorage.setItem(this.STORAGE_KEYS.PERSON2, JSON.stringify(person2Data));
      console.log('💾 Données Personne 2 sauvegardées individuellement');
    } catch (error) {
      console.error('Erreur sauvegarde Personne 2:', error);
      throw new Error('Impossible de sauvegarder les données de la Personne 2');
    }
  }

  /**
   * Sauvegarder les données combinées (par défaut)
   */
  static saveCombinedFinancialData(userData: UserData): void {
    try {
      const combinedData = this.createCombinedFinancialData(userData);
      localStorage.setItem(this.STORAGE_KEYS.COMBINED, JSON.stringify(combinedData));
      console.log('💾 Données financières combinées sauvegardées (par défaut)');
    } catch (error) {
      console.error('Erreur sauvegarde combinée:', error);
      throw new Error('Impossible de sauvegarder les données combinées');
    }
  }

  /**
   * Sauvegarder la planification d'urgence (fichier séparé)
   */
  static saveEmergencyPlanning(emergencyState: EmergencyPlanningState): void {
    try {
      const emergencyFile = this.createEmergencyPlanFile(emergencyState);
      localStorage.setItem(this.STORAGE_KEYS.EMERGENCY, JSON.stringify(emergencyFile));
      console.log('💾 Planification d\'urgence sauvegardée séparément');
    } catch (error) {
      console.error('Erreur sauvegarde planification d\'urgence:', error);
      throw new Error('Impossible de sauvegarder la planification d\'urgence');
    }
  }

  /**
   * Sauvegarde automatique par défaut (combinée + urgence)
   */
  static saveDefault(userData: UserData, emergencyState?: EmergencyPlanningState): void {
    // Sauvegarde combinée par défaut
    this.saveCombinedFinancialData(userData);
    
    // Sauvegarde planification d'urgence si disponible
    if (emergencyState) {
      this.saveEmergencyPlanning(emergencyState);
    }
  }

  /**
   * Charger les données de Personne 1
   */
  static loadPerson1Individual(): Person1Data | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PERSON1);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      // Convertir les dates
      parsedData.metadata.dateCreation = new Date(parsedData.metadata.dateCreation);
      parsedData.metadata.derniereMiseAJour = new Date(parsedData.metadata.derniereMiseAJour);
      
      return parsedData;
    } catch (error) {
      console.error('Erreur chargement Personne 1:', error);
      return null;
    }
  }

  /**
   * Charger les données de Personne 2
   */
  static loadPerson2Individual(): Person2Data | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PERSON2);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      // Convertir les dates
      parsedData.metadata.dateCreation = new Date(parsedData.metadata.dateCreation);
      parsedData.metadata.derniereMiseAJour = new Date(parsedData.metadata.derniereMiseAJour);
      
      return parsedData;
    } catch (error) {
      console.error('Erreur chargement Personne 2:', error);
      return null;
    }
  }

  /**
   * Charger les données combinées
   */
  static loadCombinedFinancialData(): CombinedFinancialData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.COMBINED);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      // Convertir les dates
      parsedData.metadata.dateCreation = new Date(parsedData.metadata.dateCreation);
      parsedData.metadata.derniereMiseAJour = new Date(parsedData.metadata.derniereMiseAJour);
      parsedData.person1.metadata.dateCreation = new Date(parsedData.person1.metadata.dateCreation);
      parsedData.person1.metadata.derniereMiseAJour = new Date(parsedData.person1.metadata.derniereMiseAJour);
      parsedData.person2.metadata.dateCreation = new Date(parsedData.person2.metadata.dateCreation);
      parsedData.person2.metadata.derniereMiseAJour = new Date(parsedData.person2.metadata.derniereMiseAJour);
      
      return parsedData;
    } catch (error) {
      console.error('Erreur chargement données combinées:', error);
      return null;
    }
  }

  /**
   * Charger la planification d'urgence
   */
  static loadEmergencyPlanning(): EmergencyPlanFile | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.EMERGENCY);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      // Convertir les dates
      parsedData.metadata.dateCreation = new Date(parsedData.metadata.dateCreation);
      parsedData.metadata.derniereMiseAJour = new Date(parsedData.metadata.derniereMiseAJour);
      
      // Convertir les dates dans les plans d'urgence
      if (parsedData.planificationUrgence.person1Plan) {
        parsedData.planificationUrgence.person1Plan = EmergencyPlanningService.convertDatesInPlan(
          parsedData.planificationUrgence.person1Plan
        );
      }
      if (parsedData.planificationUrgence.person2Plan) {
        parsedData.planificationUrgence.person2Plan = EmergencyPlanningService.convertDatesInPlan(
          parsedData.planificationUrgence.person2Plan
        );
      }
      
      return parsedData;
    } catch (error) {
      console.error('Erreur chargement planification d\'urgence:', error);
      return null;
    }
  }

  /**
   * Exporter Personne 1 (fichier JSON)
   */
  static exportPerson1Individual(userData: UserData): void {
    const person1Data = this.extractPerson1Data(userData);
    const blob = new Blob([JSON.stringify(person1Data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personne1-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Exporter Personne 2 (fichier JSON)
   */
  static exportPerson2Individual(userData: UserData): void {
    const person2Data = this.extractPerson2Data(userData);
    const blob = new Blob([JSON.stringify(person2Data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personne2-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Exporter données combinées (fichier JSON)
   */
  static exportCombinedFinancialData(userData: UserData): void {
    const combinedData = this.createCombinedFinancialData(userData);
    const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donnees-combinees-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Exporter planification d'urgence (fichier JSON séparé)
   */
  static exportEmergencyPlanning(emergencyState: EmergencyPlanningState): void {
    const emergencyFile = this.createEmergencyPlanFile(emergencyState);
    const blob = new Blob([JSON.stringify(emergencyFile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planification-urgence-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Obtenir un résumé des sauvegardes disponibles
   */
  static getSavesSummary(): {
    person1: boolean;
    person2: boolean;
    combined: boolean;
    emergency: boolean;
    lastSaved?: Date;
  } {
    const person1 = localStorage.getItem(this.STORAGE_KEYS.PERSON1) !== null;
    const person2 = localStorage.getItem(this.STORAGE_KEYS.PERSON2) !== null;
    const combined = localStorage.getItem(this.STORAGE_KEYS.COMBINED) !== null;
    const emergency = localStorage.getItem(this.STORAGE_KEYS.EMERGENCY) !== null;

    let lastSaved: Date | undefined;
    
    // Trouver la date de sauvegarde la plus récente
    const dates: Date[] = [];
    if (combined) {
      try {
        const combinedData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.COMBINED)!);
        dates.push(new Date(combinedData.metadata.derniereMiseAJour));
      } catch {}
    }
    if (emergency) {
      try {
        const emergencyData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EMERGENCY)!);
        dates.push(new Date(emergencyData.metadata.derniereMiseAJour));
      } catch {}
    }
    
    if (dates.length > 0) {
      lastSaved = new Date(Math.max(...dates.map(d => d.getTime())));
    }

    return { person1, person2, combined, emergency, lastSaved };
  }

  /**
   * Nettoyer toutes les sauvegardes
   */
  static clearAllSaves(): void {
    localStorage.removeItem(this.STORAGE_KEYS.PERSON1);
    localStorage.removeItem(this.STORAGE_KEYS.PERSON2);
    localStorage.removeItem(this.STORAGE_KEYS.COMBINED);
    localStorage.removeItem(this.STORAGE_KEYS.EMERGENCY);
    console.log('🗑️ Toutes les sauvegardes individuelles supprimées');
  }
}
