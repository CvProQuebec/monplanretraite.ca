// src/features/retirement/types/emergency-planning.ts
// Types pour la planification d'urgence individuelle

export interface EmergencyContact {
  id: string;
  nom: string;
  prenom: string;
  relation: 'conjoint' | 'enfant' | 'parent' | 'frere_soeur' | 'ami' | 'autre';
  telephone: string;
  email?: string;
  adresse?: {
    rue: string;
    ville: string;
    province: string;
    codePostal: string;
  };
  priorite: 1 | 2 | 3; // 1 = priorité haute
  notes?: string;
}

export interface MedicalInfo {
  numeroAssuranceMaladie: string;
  groupeSanguin?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  medicaments: {
    nom: string;
    dosage: string;
    frequence: string;
    prescripteur: string;
  }[];
  conditionsMedicales: string[];
  medecinFamille?: {
    nom: string;
    telephone: string;
    adresse?: string;
  };
  hopitalPrefere?: {
    nom: string;
    adresse: string;
    telephone: string;
  };
  directivesAvancees?: {
    testament: boolean;
    mandatIncapacite: boolean;
    donOrganes: boolean;
    volontesFinVie: string;
  };
}

export interface FinancialAccount {
  id: string;
  type: 'cheque' | 'epargne' | 'placement' | 'reer' | 'celi' | 'ferr' | 'autre';
  institution: string;
  numeroCompte: string;
  soldeApprox: number;
  beneficiaire?: string;
  notes?: string;
  accesProcuration?: {
    nom: string;
    relation: string;
    telephone: string;
  };
}

export interface Insurance {
  id: string;
  type: 'vie' | 'invalidite' | 'maladie_grave' | 'soins_longue_duree' | 'autre';
  compagnie: string;
  numeroPolice: string;
  montantCouverture: number;
  beneficiaires: {
    nom: string;
    relation: string;
    pourcentage: number;
  }[];
  agent?: {
    nom: string;
    telephone: string;
    email?: string;
  };
  dateExpiration?: Date;
  primeAnnuelle?: number;
}

export interface LegalDocument {
  id: string;
  type: 'testament' | 'mandat_incapacite' | 'procuration' | 'contrat_mariage' | 'autre';
  titre: string;
  dateCreation: Date;
  derniereMiseAJour?: Date;
  notaire?: {
    nom: string;
    telephone: string;
    adresse?: string;
  };
  emplacement: string; // Où le document est conservé
  notes?: string;
}

export interface FamilyResponsibility {
  id: string;
  type: 'enfant_mineur' | 'parent_dependant' | 'conjoint' | 'animal' | 'autre';
  nom: string;
  age?: number;
  besoinsSpeciaux?: string;
  gardienDesigne?: {
    nom: string;
    telephone: string;
    relation: string;
  };
  coutsMensuels?: number;
  notes?: string;
}

export interface EmergencyPlan {
  personId: 'person1' | 'person2';
  nom: string;
  prenom: string;
  
  // Contacts d'urgence
  contactsUrgence: EmergencyContact[];
  
  // Informations médicales
  informationsMedicales: MedicalInfo;
  
  // Comptes financiers
  comptesBancaires: FinancialAccount[];
  
  // Assurances
  assurances: Insurance[];
  
  // Documents légaux
  documentsLegaux: LegalDocument[];
  
  // Responsabilités familiales
  responsabilitesFamiliales: FamilyResponsibility[];
  
  // Volontés spécifiques
  volontesSpecifiques: {
    funerailles?: {
      type: 'inhumation' | 'cremation' | 'don_science';
      lieu?: string;
      ceremonieReligieuse: boolean;
      volontesSpeciales?: string;
      budgetEstime?: number;
    };
    
    biens?: {
      residencePrincipale?: {
        action: 'vendre' | 'garder' | 'leguer';
        beneficiaire?: string;
        instructions?: string;
      };
      vehicules?: {
        action: 'vendre' | 'garder' | 'leguer';
        beneficiaire?: string;
        instructions?: string;
      };
      objetsPersonnels?: {
        bijoux?: string;
        collections?: string;
        souvenirs?: string;
        autres?: string;
      };
    };
    
    charite?: {
      organismes: {
        nom: string;
        montant?: number;
        pourcentage?: number;
      }[];
    };
  };
  
  // Métadonnées
  dateCreation: Date;
  derniereMiseAJour: Date;
  version: number;
  statut: 'brouillon' | 'complet' | 'revise';
}

export interface EmergencyPlanningState {
  person1Plan?: EmergencyPlan;
  person2Plan?: EmergencyPlan;
  selectedPerson: 'person1' | 'person2';
  isEditing: boolean;
  lastSaved?: Date;
}

// Types pour l'impression
export interface PrintableEmergencyPlan {
  plan: EmergencyPlan;
  sections: {
    contacts: boolean;
    medical: boolean;
    financial: boolean;
    insurance: boolean;
    legal: boolean;
    family: boolean;
    wishes: boolean;
  };
  format: 'complete' | 'summary' | 'contacts_only';
  includePrivateInfo: boolean;
}

// Types pour la validation
export interface EmergencyPlanValidation {
  isValid: boolean;
  completionPercentage: number;
  missingFields: string[];
  warnings: string[];
  criticalIssues: string[];
}

// Types pour l'export/import
export interface EmergencyPlanExport {
  version: string;
  exportDate: Date;
  person1Plan?: EmergencyPlan;
  person2Plan?: EmergencyPlan;
  metadata: {
    appVersion: string;
    exportedBy: string;
  };
}
