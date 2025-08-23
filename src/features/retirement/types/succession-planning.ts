// src/features/retirement/types/succession-planning.ts
// Types pour la planification successorale

export interface Beneficiary {
  id: string;
  nom: string;
  prenom: string;
  relation: 'conjoint' | 'enfant' | 'parent' | 'frere_soeur' | 'ami' | 'organisme' | 'autre';
  pourcentage?: number;
  montantFixe?: number;
  typeLegs: 'universel' | 'particulier' | 'residuaire';
  conditions?: string;
  notes?: string;
}

export interface Asset {
  id: string;
  type: 'immobilier' | 'vehicule' | 'compte_bancaire' | 'placement' | 'assurance_vie' | 'entreprise' | 'objet_valeur' | 'autre';
  nom: string;
  description: string;
  valeurEstimee: number;
  beneficiaire?: string;
  instructions?: string;
  documents?: string;
  notes?: string;
}

export interface LegalDocument {
  id: string;
  type: 'testament' | 'mandat_incapacite' | 'procuration' | 'contrat_mariage' | 'convention_actionnaires' | 'autre';
  titre: string;
  dateCreation: Date;
  derniereMiseAJour?: Date;
  notaire?: {
    nom: string;
    telephone: string;
    adresse?: string;
  };
  emplacement: string;
  numeroReference?: string;
  notes?: string;
}

export interface FuneralWishes {
  type: 'inhumation' | 'cremation' | 'don_science';
  lieu?: string;
  ceremonieReligieuse: boolean;
  typeService: 'prive' | 'public' | 'aucun';
  volontesSpeciales?: string;
  budgetEstime?: number;
  prepaiement?: {
    entreprise: string;
    numeroContrat: string;
    montant: number;
  };
  personneResponsable?: {
    nom: string;
    telephone: string;
    relation: string;
  };
}

export interface CharitableDonation {
  id: string;
  organisme: string;
  type: 'montant_fixe' | 'pourcentage' | 'bien_specifique';
  montant?: number;
  pourcentage?: number;
  bienSpecifique?: string;
  numeroCharite?: string;
  contact?: {
    nom: string;
    telephone: string;
    email?: string;
  };
  notes?: string;
}

export interface TaxConsideration {
  id: string;
  type: 'reer_ferr' | 'celi' | 'gain_capital' | 'entreprise' | 'autre';
  description: string;
  impactEstime?: number;
  strategieOptimisation?: string;
  conseillerFiscal?: {
    nom: string;
    telephone: string;
    entreprise: string;
  };
  notes?: string;
}

export interface SuccessionPlan {
  personId: 'person1' | 'person2';
  nom: string;
  prenom: string;
  
  // Bénéficiaires et héritiers
  beneficiaires: Beneficiary[];
  
  // Inventaire des biens
  actifs: Asset[];
  
  // Documents légaux
  documentsLegaux: LegalDocument[];
  
  // Volontés funéraires
  volontesFuneraires: FuneralWishes;
  
  // Dons caritatifs
  donsCaritables: CharitableDonation[];
  
  // Considérations fiscales
  considerationsFiscales: TaxConsideration[];
  
  // Instructions spéciales
  instructionsSpeciales?: {
    liquidateur?: {
      nom: string;
      relation: string;
      telephone: string;
      suppléant?: {
        nom: string;
        relation: string;
        telephone: string;
      };
    };
    
    tuteur?: {
      nom: string;
      relation: string;
      telephone: string;
      pourEnfants: string[];
    };
    
    entreprise?: {
      instructions: string;
      successeur?: string;
      vente?: boolean;
      evaluation?: number;
    };
    
    animaux?: {
      instructions: string;
      gardien?: string;
      budget?: number;
    };
    
    autres?: string;
  };
  
  // Métadonnées
  dateCreation: Date;
  derniereMiseAJour: Date;
  version: number;
  statut: 'brouillon' | 'complet' | 'revise' | 'officialise';
}

export interface SuccessionPlanningState {
  person1Plan?: SuccessionPlan;
  person2Plan?: SuccessionPlan;
  selectedPerson: 'person1' | 'person2';
  isEditing: boolean;
  lastSaved?: Date;
}

// Types pour la validation
export interface SuccessionPlanValidation {
  isValid: boolean;
  completionPercentage: number;
  missingFields: string[];
  warnings: string[];
  criticalIssues: string[];
  recommendations: string[];
}

// Types pour l'export/import
export interface SuccessionPlanExport {
  version: string;
  exportDate: Date;
  person1Plan?: SuccessionPlan;
  person2Plan?: SuccessionPlan;
  metadata: {
    appVersion: string;
    exportedBy: string;
  };
}

// Types pour l'impression
export interface PrintableSuccessionPlan {
  plan: SuccessionPlan;
  sections: {
    beneficiaires: boolean;
    actifs: boolean;
    documents: boolean;
    funerailles: boolean;
    dons: boolean;
    fiscal: boolean;
    instructions: boolean;
  };
  format: 'complete' | 'summary' | 'legal_only';
  includePrivateInfo: boolean;
}
