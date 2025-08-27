// src/features/retirement/services/DataCollectionService.ts
import { UserData } from '../types';

export interface CompleteBackupData {
  // Données principales du profil
  personal: any;
  retirement: any;
  
  // Modules spécialisés
  immobilier: {
    residencePrincipale: {
      valeur: number;
      hypotheque: number;
      taxes: number;
      assurances: number;
    };
    deuxiemeResidence: {
      valeur: number;
      hypotheque: number;
      revenus: number;
      charges: number;
    };
    troisiemePropriete: {
      valeur: number;
      hypotheque: number;
      revenus: number;
      charges: number;
    };
    quatriemePropriete: {
      valeur: number;
      hypotheque: number;
      revenus: number;
      charges: number;
    };
  };
  
  // Module RRQ/CPP
  rrqCpp: {
    rrqAgeActuel1: number;
    rrqMontantActuel1: number;
    rrqMontant70_1: number;
    esperanceVie1: number;
    rrqAgeActuel2: number;
    rrqMontantActuel2: number;
    rrqMontant70_2: number;
    esperanceVie2: number;
  };
  
  // Module RREGOP
  rregop: {
    rregopMembre1: string;
    rregopAnnees1: number;
    rregopTypeRegime1: string;
    rregopAnneesServiceCalcul1: number;
    rregopSalaireActuel1: number;
    rregopAgePleineRente1: number;
    rregopMontantPleineRente1: number;
    rregopCoordinationRRQ1: number;
    rregopIndexation1: number;
  };
  
  // Module SRG
  srg: {
    age: number;
    revenuAnnuel: number;
    situationFamiliale: string;
    prestationsSRG: number;
    prestationsSV: number;
  };
  
  // Module Dépenses
  depenses: {
    depensesMensuelles: {
      logement: number;
      alimentation: number;
      transport: number;
      sante: number;
      loisirs: number;
      autres: number;
    };
    depensesSaisonnières: {
      vacances: number;
      fêtes: number;
      entretien: number;
      autres: number;
    };
    depensesDetaillees: Record<string, number>;
  };
  
  // Module Budget
  budget: {
    revenusMensuels: number;
    depensesMensuelles: number;
    epargneMensuelle: number;
    categories: Record<string, number>;
  };
  
  // Module Optimisation Fiscale
  optimisationFiscale: {
    revenuAnnuel: number;
    age: number;
    montantREER: number;
    montantCELI: number;
    montantNonEnregistre: number;
    ageRetraite: number;
    revenuRetraite: number;
  };
  
  // Module Monte Carlo
  monteCarlo: {
    montantInitial: number;
    contributionAnnuelle: number;
    rendementMoyen: number;
    volatilite: number;
    anneesSimulation: number;
    nombreSimulations: number;
  };
  
  // Module Analyse de Sensibilité
  analyseSensibilite: {
    montantInitial: number;
    contributionAnnuelle: number;
    rendementMoyen: number;
    anneesSimulation: number;
    ageRetraite: number;
  };
  
  // Module Comparaison de Scénarios
  comparaisonScenarios: {
    scenarios: Array<{
      nom: string;
      montantInitial: number;
      contributionAnnuelle: number;
      rendementMoyen: number;
      anneesEpargne: number;
      ageRetraite: number;
    }>;
  };
  
  // Module Planification Expert
  planificationExpert: {
    objectifs: Array<{
      nom: string;
      montant: number;
      priorite: number;
      echeance: number;
    }>;
    strategies: Array<{
      nom: string;
      description: string;
      impact: number;
    }>;
  };
  
  // Module Planification d'Urgence
  planificationUrgence: {
    fondsUrgence: number;
    assuranceVie: number;
    testament: boolean;
    mandatProtection: boolean;
    directivesMedicales: boolean;
  };
  
  // Module Planification Successorale
  planificationSuccessorale: {
    testament: boolean;
    mandatProtection: boolean;
    directivesMedicales: boolean;
    assuranceVie: number;
    fondsFiduciaire: boolean;
  };
  
  // Métadonnées
  metadata: {
    version: string;
    dateCreation: string;
    dateModification: string;
    modulesActifs: string[];
    checksum: string;
  };
}

export class DataCollectionService {
  private static readonly APP_VERSION = '1.0.0';
  
  /**
   * Collecte toutes les données de tous les modules pour la sauvegarde
   */
  static collectAllData(): CompleteBackupData {
    try {
      console.log('🔄 Collecte de toutes les données pour la sauvegarde...');
      
      // Collecter les données du localStorage
      const allData = this.collectFromLocalStorage();
      
      // Collecter les données des composants actifs
      const componentData = this.collectFromComponents();
      
      // Fusionner toutes les données
      const completeData: CompleteBackupData = {
        ...allData,
        ...componentData,
        metadata: this.generateMetadata(allData, componentData)
      };
      
      console.log('✅ Données collectées avec succès:', completeData);
      return completeData;
      
    } catch (error) {
      console.error('❌ Erreur lors de la collecte des données:', error);
      throw new Error(`Impossible de collecter les données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
  
  /**
   * Collecte les données stockées dans le localStorage
   */
  private static collectFromLocalStorage(): Partial<CompleteBackupData> {
    const data: Partial<CompleteBackupData> = {};
    
    try {
      // Données personnelles
      const personalData = localStorage.getItem('retirement-personal-data');
      if (personalData) {
        data.personal = JSON.parse(personalData);
      }
      
      // Données de retraite
      const retirementData = localStorage.getItem('retirement-data');
      if (retirementData) {
        data.retirement = JSON.parse(retirementData);
      }
      
      // Données immobilières
      const immobilierData = localStorage.getItem('immobilier-data');
      if (immobilierData) {
        data.immobilier = JSON.parse(immobilierData);
      }
      
      // Données RRQ/CPP
      const rrqCppData = localStorage.getItem('rrq-cpp-data');
      if (rrqCppData) {
        data.rrqCpp = JSON.parse(rrqCppData);
      }
      
      // Données RREGOP
      const rregopData = localStorage.getItem('rregop-data');
      if (rregopData) {
        data.rregop = JSON.parse(rregopData);
      }
      
      // Données SRG
      const srgData = localStorage.getItem('srg-data');
      if (srgData) {
        data.srg = JSON.parse(srgData);
      }
      
      // Données de dépenses
      const depensesData = localStorage.getItem('depenses-data');
      if (depensesData) {
        data.depenses = JSON.parse(depensesData);
      }
      
      // Données de budget
      const budgetData = localStorage.getItem('budget-data');
      if (budgetData) {
        data.budget = JSON.parse(budgetData);
      }
      
      // Données d'optimisation fiscale
      const optimisationData = localStorage.getItem('optimisation-fiscale-data');
      if (optimisationData) {
        data.optimisationFiscale = JSON.parse(optimisationData);
      }
      
      // Données Monte Carlo
      const monteCarloData = localStorage.getItem('monte-carlo-data');
      if (monteCarloData) {
        data.monteCarlo = JSON.parse(monteCarloData);
      }
      
      // Données d'analyse de sensibilité
      const sensibiliteData = localStorage.getItem('analyse-sensibilite-data');
      if (sensibiliteData) {
        data.analyseSensibilite = JSON.parse(sensibiliteData);
      }
      
      // Données de comparaison de scénarios
      const scenariosData = localStorage.getItem('comparaison-scenarios-data');
      if (scenariosData) {
        data.comparaisonScenarios = JSON.parse(scenariosData);
      }
      
      // Données de planification expert
      const expertData = localStorage.getItem('planification-expert-data');
      if (expertData) {
        data.planificationExpert = JSON.parse(expertData);
      }
      
      // Données de planification d'urgence
      const urgenceData = localStorage.getItem('planification-urgence-data');
      if (urgenceData) {
        data.planificationUrgence = JSON.parse(urgenceData);
      }
      
      // Données de planification successorale
      const successoraleData = localStorage.getItem('planification-successorale-data');
      if (successoraleData) {
        data.planificationSuccessorale = JSON.parse(successoraleData);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la collecte depuis localStorage:', error);
    }
    
    return data;
  }
  
  /**
   * Collecte les données des composants actifs (si disponibles)
   */
  private static collectFromComponents(): Partial<CompleteBackupData> {
    // Cette méthode peut être étendue pour collecter des données
    // directement depuis les composants React si nécessaire
    return {};
  }
  
  /**
   * Génère les métadonnées de sauvegarde
   */
  private static generateMetadata(allData: any, componentData: any): CompleteBackupData['metadata'] {
    const modulesActifs = this.detectActiveModules(allData, componentData);
    
    return {
      version: this.APP_VERSION,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      modulesActifs,
      checksum: this.generateChecksum({ allData, componentData })
    };
  }
  
  /**
   * Détecte les modules actifs basés sur les données présentes
   */
  private static detectActiveModules(allData: any, componentData: any): string[] {
    const modules: string[] = [];
    
    if (allData.personal) modules.push('profil');
    if (allData.retirement) modules.push('retraite');
    if (allData.immobilier) modules.push('immobilier');
    if (allData.rrqCpp) modules.push('rrq-cpp');
    if (allData.rregop) modules.push('rregop');
    if (allData.srg) modules.push('srg');
    if (allData.depenses) modules.push('depenses');
    if (allData.budget) modules.push('budget');
    if (allData.optimisationFiscale) modules.push('optimisation-fiscale');
    if (allData.monteCarlo) modules.push('monte-carlo');
    if (allData.analyseSensibilite) modules.push('analyse-sensibilite');
    if (allData.comparaisonScenarios) modules.push('comparaison-scenarios');
    if (allData.planificationExpert) modules.push('planification-expert');
    if (allData.planificationUrgence) modules.push('planification-urgence');
    if (allData.planificationSuccessorale) modules.push('planification-successorale');
    
    return modules;
  }
  
  /**
   * Génère un checksum pour vérifier l'intégrité des données
   */
  private static generateChecksum(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      let hash = 0;
      
      for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return hash.toString(16);
    } catch (error) {
      console.error('❌ Erreur lors de la génération du checksum:', error);
      return 'error';
    }
  }
  
  /**
   * Sauvegarde les données collectées dans le localStorage
   */
  static saveCollectedData(data: CompleteBackupData): void {
    try {
      // Sauvegarder chaque module séparément
      if (data.personal) {
        localStorage.setItem('retirement-personal-data', JSON.stringify(data.personal));
      }
      
      if (data.retirement) {
        localStorage.setItem('retirement-data', JSON.stringify(data.retirement));
      }
      
      if (data.immobilier) {
        localStorage.setItem('immobilier-data', JSON.stringify(data.immobilier));
      }
      
      if (data.rrqCpp) {
        localStorage.setItem('rrq-cpp-data', JSON.stringify(data.rrqCpp));
      }
      
      if (data.rregop) {
        localStorage.setItem('rregop-data', JSON.stringify(data.rregop));
      }
      
      if (data.srg) {
        localStorage.setItem('srg-data', JSON.stringify(data.srg));
      }
      
      if (data.depenses) {
        localStorage.setItem('depenses-data', JSON.stringify(data.depenses));
      }
      
      if (data.budget) {
        localStorage.setItem('budget-data', JSON.stringify(data.budget));
      }
      
      if (data.optimisationFiscale) {
        localStorage.setItem('optimisation-fiscale-data', JSON.stringify(data.optimisationFiscale));
      }
      
      if (data.monteCarlo) {
        localStorage.setItem('monte-carlo-data', JSON.stringify(data.monteCarlo));
      }
      
      if (data.analyseSensibilite) {
        localStorage.setItem('analyse-sensibilite-data', JSON.stringify(data.analyseSensibilite));
      }
      
      if (data.comparaisonScenarios) {
        localStorage.setItem('comparaison-scenarios-data', JSON.stringify(data.comparaisonScenarios));
      }
      
      if (data.planificationExpert) {
        localStorage.setItem('planification-expert-data', JSON.stringify(data.planificationExpert));
      }
      
      if (data.planificationUrgence) {
        localStorage.setItem('planification-urgence-data', JSON.stringify(data.planificationUrgence));
      }
      
      if (data.planificationSuccessorale) {
        localStorage.setItem('planification-successorale-data', JSON.stringify(data.planificationSuccessorale));
      }
      
      console.log('✅ Données sauvegardées dans localStorage');
      
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde dans localStorage:', error);
      throw error;
    }
  }
  
  /**
   * Restaure les données depuis le localStorage
   */
  static restoreCollectedData(): Partial<CompleteBackupData> {
    return this.collectFromLocalStorage();
  }
}
