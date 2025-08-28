// src/features/retirement/services/EmergencyPlanningService.ts
// Service pour la gestion de la planification d'urgence

import { 
  EmergencyPlan, 
  EmergencyPlanningState, 
  EmergencyPlanValidation,
  EmergencyPlanExport,
  PrintableEmergencyPlan
} from '../types/emergency-planning';

export class EmergencyPlanningService {
  private static readonly STORAGE_KEY = 'emergency_planning_data';
  private static readonly VERSION = '1.0.0';

  /**
   * Créer un nouveau plan d'urgence vide
   */
  static createEmptyPlan(personId: 'person1' | 'person2', nom: string, prenom: string): EmergencyPlan {
    return {
      personId,
      nom,
      prenom,
      
      // Informations personnelles de base
      informationsPersonnelles: {
        numeroAssuranceMaladie: '',
        numeroAssuranceSociale: ''
      },
      
      // Contacts d'urgence
      contactsUrgence: [],
      
      // Informations médicales
      informationsMedicales: {
        numeroAssuranceMaladie: '',
        numeroAssuranceSociale: '',
        allergies: [],
        allergiesMedicamenteuses: [],
        medicaments: [],
        conditionsMedicales: [],
        specialistes: []
      },
      
      // Finances
      comptesBancaires: [],
      cartesCredit: [],
      accesBancairesEnLigne: [],
      investissements: [],
      dettes: [],
      
      // Assurances
      assurances: [],
      
      // Documents légaux
      documentsLegaux: [],
      
      // Propriétés et biens
      proprietes: [],
      vehicules: [],
      coffresForts: [],
      entreposage: [],
      
      // Emploi et prestations
      emploi: undefined,
      
      // Accès numériques et abonnements
      accesNumeriques: [],
      abonnements: [],
      
      // Responsabilités familiales
      responsabilitesFamiliales: [],
      animauxCompagnie: [],
      
      // Volontés spécifiques
      volontesSpecifiques: {},
      
      // Liste de vérification pour les proches
      listeVerificationDeces: [],
      
      // Métadonnées
      dateCreation: new Date(),
      derniereMiseAJour: new Date(),
      version: 1,
      statut: 'brouillon'
    };
  }

  /**
   * Créer une liste de vérification de décès vide
   */
  static createEmptyDeathChecklist() {
    return {
      items: [],
      lastUpdated: new Date()
    };
  }

  /**
   * Créer des préférences funéraires vides
   */
  static createEmptyFuneralWishes() {
    return {
      disposition: undefined,
      typeCeremonie: undefined,
      religion: undefined,
      lieuCeremonie: undefined,
      instructionsSpeciales: undefined,
      budgetEstime: undefined,
      prearrangements: [],
      salonFuneraire: undefined,
      cemetery: undefined,
      notes: undefined
    };
  }

  /**
   * Sauvegarder l'état de la planification d'urgence
   */
  static saveEmergencyPlanningState(state: EmergencyPlanningState): void {
    try {
      const dataToSave = {
        ...state,
        lastSaved: new Date()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la planification d\'urgence:', error);
      throw new Error('Impossible de sauvegarder les données');
    }
  }

  /**
   * Charger l'état de la planification d'urgence
   */
  static loadEmergencyPlanningState(): EmergencyPlanningState | null {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (!savedData) return null;

      const parsedData = JSON.parse(savedData);
      
      // Convertir les dates string en objets Date
      if (parsedData.person1Plan) {
        parsedData.person1Plan = this.convertDatesInPlan(parsedData.person1Plan);
      }
      if (parsedData.person2Plan) {
        parsedData.person2Plan = this.convertDatesInPlan(parsedData.person2Plan);
      }
      if (parsedData.lastSaved) {
        parsedData.lastSaved = new Date(parsedData.lastSaved);
      }

      return parsedData;
    } catch (error) {
      console.error('Erreur lors du chargement de la planification d\'urgence:', error);
      return null;
    }
  }

  /**
   * Convertir les dates string en objets Date dans un plan
   */
  static convertDatesInPlan(plan: any): EmergencyPlan {
    return {
      ...plan,
      dateCreation: new Date(plan.dateCreation),
      derniereMiseAJour: new Date(plan.derniereMiseAJour),
      assurances: plan.assurances?.map((assurance: any) => ({
        ...assurance,
        dateExpiration: assurance.dateExpiration ? new Date(assurance.dateExpiration) : undefined
      })) || [],
      documentsLegaux: plan.documentsLegaux?.map((doc: any) => ({
        ...doc,
        dateCreation: new Date(doc.dateCreation),
        derniereMiseAJour: doc.derniereMiseAJour ? new Date(doc.derniereMiseAJour) : undefined
      })) || []
    };
  }

  /**
   * Valider un plan d'urgence
   */
  static validateEmergencyPlan(plan: EmergencyPlan): EmergencyPlanValidation {
    const missingFields: string[] = [];
    const warnings: string[] = [];
    const criticalIssues: string[] = [];

    // Vérifications critiques
    if (!plan.nom.trim()) criticalIssues.push('Nom manquant');
    if (!plan.prenom.trim()) criticalIssues.push('Prénom manquant');
    if (!plan.informationsMedicales.numeroAssuranceMaladie.trim()) {
      criticalIssues.push('Numéro d\'assurance maladie manquant');
    }

    // Vérifications importantes
    if (plan.contactsUrgence.length === 0) {
      missingFields.push('Aucun contact d\'urgence défini');
    } else {
      const contactsPrioritaires = plan.contactsUrgence.filter(c => c.priorite === 1);
      if (contactsPrioritaires.length === 0) {
        warnings.push('Aucun contact d\'urgence prioritaire défini');
      }
    }

    if (plan.comptesBancaires.length === 0) {
      missingFields.push('Aucun compte bancaire défini');
    }

    if (plan.documentsLegaux.length === 0) {
      missingFields.push('Aucun document légal défini');
    } else {
      const hasTestament = plan.documentsLegaux.some(doc => doc.type === 'testament');
      const hasMandatIncapacite = plan.documentsLegaux.some(doc => doc.type === 'mandat_incapacite');
      
      if (!hasTestament) warnings.push('Aucun testament défini');
      if (!hasMandatIncapacite) warnings.push('Aucun mandat d\'inaptitude défini');
    }

    // Vérifications médicales
    if (plan.informationsMedicales.medicaments.length > 0 && !plan.informationsMedicales.medecinFamille) {
      warnings.push('Médecin de famille non défini malgré la prise de médicaments');
    }

    if (plan.informationsMedicales.allergies.length === 0) {
      missingFields.push('Allergies non spécifiées (indiquer "Aucune" si applicable)');
    }

    // Calcul du pourcentage de completion
    const totalFields = 20; // Nombre approximatif de champs importants
    const completedFields = totalFields - missingFields.length - (warnings.length * 0.5);
    const completionPercentage = Math.max(0, Math.min(100, (completedFields / totalFields) * 100));

    return {
      isValid: criticalIssues.length === 0,
      completionPercentage: Math.round(completionPercentage),
      missingFields,
      warnings,
      criticalIssues
    };
  }

  /**
   * Exporter les plans d'urgence
   */
  static exportEmergencyPlans(state: EmergencyPlanningState): EmergencyPlanExport {
    return {
      version: this.VERSION,
      exportDate: new Date(),
      person1Plan: state.person1Plan,
      person2Plan: state.person2Plan,
      metadata: {
        appVersion: this.VERSION,
        exportedBy: 'MonPlanRetraite.ca'
      }
    };
  }

  /**
   * Importer les plans d'urgence
   */
  static importEmergencyPlans(exportData: EmergencyPlanExport): EmergencyPlanningState {
    const state: EmergencyPlanningState = {
      selectedPerson: 'person1',
      isEditing: false,
      lastSaved: new Date()
    };

    if (exportData.person1Plan) {
      state.person1Plan = this.convertDatesInPlan(exportData.person1Plan);
    }

    if (exportData.person2Plan) {
      state.person2Plan = this.convertDatesInPlan(exportData.person2Plan);
    }

    return state;
  }

  /**
   * Générer un ID unique
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Préparer un plan pour l'impression
   */
  static preparePrintablePlan(
    plan: EmergencyPlan,
    sections: PrintableEmergencyPlan['sections'],
    format: PrintableEmergencyPlan['format'],
    includePrivateInfo: boolean
  ): PrintableEmergencyPlan {
    let processedPlan = { ...plan };

    // Masquer les informations privées si nécessaire
    if (!includePrivateInfo) {
      processedPlan = {
        ...processedPlan,
        comptesBancaires: processedPlan.comptesBancaires.map(compte => ({
          ...compte,
          numeroCompte: compte.numeroCompte.replace(/\d/g, '*'),
          soldeApprox: 0
        })),
        informationsMedicales: {
          ...processedPlan.informationsMedicales,
          numeroAssuranceMaladie: processedPlan.informationsMedicales.numeroAssuranceMaladie.replace(/\d/g, '*')
        },
        assurances: processedPlan.assurances.map(assurance => ({
          ...assurance,
          numeroPolice: assurance.numeroPolice.replace(/\d/g, '*')
        }))
      };
    }

    return {
      plan: processedPlan,
      sections,
      format,
      includePrivateInfo
    };
  }

  /**
   * Obtenir un résumé du plan
   */
  static getPlanSummary(plan: EmergencyPlan): {
    contactsCount: number;
    accountsCount: number;
    insurancesCount: number;
    documentsCount: number;
    completionPercentage: number;
    lastUpdated: Date;
  } {
    const validation = this.validateEmergencyPlan(plan);

    return {
      contactsCount: plan.contactsUrgence.length,
      accountsCount: plan.comptesBancaires.length,
      insurancesCount: plan.assurances.length,
      documentsCount: plan.documentsLegaux.length,
      completionPercentage: validation.completionPercentage,
      lastUpdated: plan.derniereMiseAJour
    };
  }

  /**
   * Dupliquer un plan (utile pour créer un plan similaire pour la deuxième personne)
   */
  static duplicatePlan(sourcePlan: EmergencyPlan, targetPersonId: 'person1' | 'person2', nom: string, prenom: string): EmergencyPlan {
    const duplicatedPlan: EmergencyPlan = {
      ...sourcePlan,
      personId: targetPersonId,
      nom,
      prenom,
      dateCreation: new Date(),
      derniereMiseAJour: new Date(),
      version: 1,
      statut: 'brouillon',
      // Générer de nouveaux IDs pour tous les éléments
      contactsUrgence: sourcePlan.contactsUrgence.map(contact => ({
        ...contact,
        id: this.generateId()
      })),
      comptesBancaires: sourcePlan.comptesBancaires.map(compte => ({
        ...compte,
        id: this.generateId(),
        numeroCompte: '', // Ne pas copier les numéros de compte
        soldeApprox: 0
      })),
      assurances: sourcePlan.assurances.map(assurance => ({
        ...assurance,
        id: this.generateId(),
        numeroPolice: '', // Ne pas copier les numéros de police
        montantCouverture: 0
      })),
      documentsLegaux: sourcePlan.documentsLegaux.map(doc => ({
        ...doc,
        id: this.generateId()
      })),
      responsabilitesFamiliales: sourcePlan.responsabilitesFamiliales.map(resp => ({
        ...resp,
        id: this.generateId()
      }))
    };

    return duplicatedPlan;
  }

  /**
   * Nettoyer les données anciennes (plus de 2 ans)
   */
  static cleanupOldData(): void {
    const state = this.loadEmergencyPlanningState();
    if (!state) return;

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    let hasChanges = false;

    // Nettoyer les documents expirés
    if (state.person1Plan) {
      const originalDocsCount = state.person1Plan.documentsLegaux.length;
      state.person1Plan.documentsLegaux = state.person1Plan.documentsLegaux.filter(
        doc => doc.derniereMiseAJour && doc.derniereMiseAJour > twoYearsAgo
      );
      if (state.person1Plan.documentsLegaux.length !== originalDocsCount) {
        hasChanges = true;
      }
    }

    if (state.person2Plan) {
      const originalDocsCount = state.person2Plan.documentsLegaux.length;
      state.person2Plan.documentsLegaux = state.person2Plan.documentsLegaux.filter(
        doc => doc.derniereMiseAJour && doc.derniereMiseAJour > twoYearsAgo
      );
      if (state.person2Plan.documentsLegaux.length !== originalDocsCount) {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.saveEmergencyPlanningState(state);
    }
  }
}
