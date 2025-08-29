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
  numeroAssuranceSociale?: string;
  groupeSanguin?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  allergiesMedicamenteuses: string[];
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
    specialite?: string;
  };
  specialistes: {
    nom: string;
    specialite: string;
    telephone: string;
    adresse?: string;
  }[];
  pharmacie?: {
    nom: string;
    adresse: string;
    telephone: string;
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
  type: 'cheque' | 'epargne' | 'placement' | 'reer' | 'celi' | 'ferr' | 'cri' | 'autre';
  institution: string;
  numeroCompte: string;
  adresseSsuccursale?: string;
  soldeApprox: number;
  beneficiaire?: string;
  coTitulaire?: string;
  notes?: string;
  accesProcuration?: {
    nom: string;
    relation: string;
    telephone: string;
  };
}

export interface CreditCard {
  id: string;
  emetteur: string;
  numeroPartiel: string; // 4 derniers chiffres seulement
  soldeApprox: number;
  limitCredit?: number;
  notes?: string;
}

export interface OnlineBankingAccess {
  id: string;
  institution: string;
  siteWeb: string;
  nomUtilisateur?: string;
  questionSecurite?: string;
  reponseSecurite?: string;
  authentificationDeuxFacteurs: boolean;
  codesRecuperation?: string;
  notes?: string;
}

export interface Investment {
  id: string;
  type: 'reer' | 'celi' | 'cri' | 'actions' | 'obligations' | 'fonds_communs' | 'immobilier' | 'crypto' | 'autre';
  institution: string;
  numeroCompte?: string;
  courtier?: {
    nom: string;
    telephone: string;
    email?: string;
  };
  valeurEstimee: number;
  description?: string;
  notes?: string;
}

export interface Debt {
  id: string;
  type: 'pret_personnel' | 'hypotheque' | 'marge_credit' | 'famille_amis' | 'autre';
  creancier: string;
  montant: number;
  echeance?: Date;
  tauxInteret?: number;
  paiementMensuel?: number;
  notes?: string;
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

// Nouvelles interfaces pour les sections manquantes critiques

export interface PropertyInfo {
  id: string;
  type: 'residence_principale' | 'residence_secondaire' | 'chalet' | 'investissement' | 'terrain' | 'autre';
  adresse: string;
  numeroLotCadastral?: string;
  titreProprietaire: string;
  emplacementTitre: string;
  hypotheque?: {
    institution: string;
    soldeApprox: number;
    echeance?: Date;
    paiementMensuel?: number;
  };
  valeurEstimee?: number;
  notes?: string;
}

export interface Vehicle {
  id: string;
  type: 'automobile' | 'bateau' | 'roulotte' | 'moto' | 'vr' | 'autre';
  marque: string;
  modele: string;
  annee: number;
  numeroImmatriculation: string;
  certificatProprietaire: string; // Emplacement du certificat
  emplacementCles: string;
  financement?: {
    institution: string;
    soldeApprox: number;
    paiementMensuel?: number;
  };
  valeurEstimee?: number;
  notes?: string;
}

export interface SafetyDeposit {
  id: string;
  type: 'coffre_bancaire' | 'coffre_domicile';
  institution?: string; // Pour coffre bancaire
  succursale?: string;
  numeroCoffre?: string;
  emplacement?: string; // Pour coffre à domicile
  emplacementCle: string;
  codeAcces?: string;
  coLocataire?: string;
  contenuPrincipal: string[];
  notes?: string;
}

export interface EmploymentInfo {
  id: string;
  nomEntreprise: string;
  adresse: string;
  superieurImmediat?: {
    nom: string;
    telephone: string;
    email?: string;
  };
  personneRessourceRH?: {
    nom: string;
    telephone: string;
    email?: string;
  };
  numeroEmploye?: string;
  avantagesSociaux?: {
    assuranceCollective: boolean;
    reerCollectif: boolean;
    autresAvantages?: string;
  };
  notes?: string;
}

export interface DigitalAccess {
  id: string;
  type: 'email' | 'banking' | 'social' | 'subscription' | 'government' | 'autre';
  service: string;
  nomUtilisateur?: string;
  siteWeb?: string;
  gestionnaireMotDePasse?: string;
  motDePassePrincipal?: string; // Pour le gestionnaire
  authentificationDeuxFacteurs: boolean;
  codesRecuperation?: string;
  questionSecurite?: string;
  reponseSecurite?: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  type: 'cellulaire' | 'telephone' | 'internet' | 'television' | 'streaming' | 'gym' | 'autre';
  fournisseur: string;
  numeroCompte?: string;
  numeroTelephone?: string; // Pour services téléphoniques
  coutMensuel?: number;
  dateEcheance?: Date;
  notes?: string;
}

export interface Pet {
  id: string;
  nom: string;
  type: 'chien' | 'chat' | 'oiseau' | 'poisson' | 'autre';
  race?: string;
  age?: number;
  veterinaire?: {
    nom: string;
    telephone: string;
    adresse?: string;
  };
  personneDesignee?: {
    nom: string;
    telephone: string;
    relation: string;
  };
  instructionsSpeciales?: string;
  coutsMensuels?: number;
  notes?: string;
}

export interface Storage {
  id: string;
  type: 'garde_meuble' | 'entrepot' | 'autre';
  nomEntreprise: string;
  adresse: string;
  numeroLocal?: string;
  codeAcces?: string;
  emplacementCle?: string;
  contenuPrincipal: string[];
  coutMensuel?: number;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  completed: boolean;
  completedDate?: Date;
  notes?: string;
}

export interface DeathChecklist {
  items: ChecklistItem[];
  lastUpdated: Date;
}

export interface FuneralWishes {
  disposition?: 'inhumation' | 'cremation' | 'don_corps' | 'autre';
  typeCeremonie?: 'religieuse' | 'civile' | 'privee' | 'aucune';
  religion?: string;
  lieuCeremonie?: string;
  instructionsSpeciales?: string;
  budgetEstime?: number;
  prearrangements?: PrearrangementContract[];
  salonFuneraire?: {
    nom: string;
    adresse: string;
    personneContact?: string;
    telephone?: string;
  };
  cemetery?: Cemetery;
  notes?: string;
}

export interface PrearrangementContract {
  id: string;
  entreprise: string;
  numeroContrat: string;
  lieuContrat?: string;
  personneContact?: {
    nom: string;
    telephone: string;
  };
  montantPaye?: number;
  notes?: string;
}

export interface Cemetery {
  nom?: string;
  adresse?: string;
  numeroLot?: string;
  personnesInhumees?: string;
  notes?: string;
}

// Nouvelles interfaces pour les sections ajoutées

export interface EvacuationItem {
  id: string;
  name: string;
  category: 'essential' | 'important' | 'valuable' | 'comfort';
  timeFrame: '15min' | '30min' | '1hour' | '2hour';
  isChecked: boolean;
  notes?: string;
  isCustom: boolean;
}

export interface EvacuationChecklist {
  items: EvacuationItem[];
  customItems: EvacuationItem[];
  lastUpdated: Date;
  personalNotes: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosisDate?: Date;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate?: Date;
  endDate?: Date;
  purpose: string;
  sideEffects?: string;
  notes?: string;
}

export interface Surgery {
  id: string;
  procedure: string;
  date: Date;
  surgeon: string;
  hospital: string;
  complications?: string;
  notes?: string;
}

export interface Vaccination {
  id: string;
  vaccine: string;
  date: Date;
  boosterDate?: Date;
  provider: string;
  lotNumber?: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  date: Date;
  result: string;
  referenceRange: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  orderedBy: string;
  notes?: string;
}

export interface FamilyMedicalHistory {
  id: string;
  relation: 'father' | 'mother' | 'sibling' | 'grandparent' | 'other';
  name?: string;
  conditions: string[];
  ageAtDeath?: number;
  causeOfDeath?: string;
  notes?: string;
}

export interface ComprehensiveMedicalRecord {
  // Informations de base
  personalInfo: {
    height: string;
    weight: string;
    bloodType?: string;
    allergies: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };

  // Conditions médicales
  currentConditions: MedicalCondition[];
  medicalHistory: MedicalCondition[];

  // Médicaments
  currentMedications: Medication[];
  pastMedications: Medication[];

  // Chirurgies et procédures
  surgeries: Surgery[];

  // Vaccinations
  vaccinations: Vaccination[];

  // Résultats de laboratoire
  labResults: LabResult[];

  // Antécédents familiaux
  familyHistory: FamilyMedicalHistory[];

  // Professionnels de la santé
  healthcareProviders: {
    primaryCare?: {
      name: string;
      phone: string;
      address?: string;
    };
    specialists: {
      name: string;
      specialty: string;
      phone: string;
      address?: string;
    }[];
    pharmacy?: {
      name: string;
      phone: string;
      address?: string;
    };
  };

  // Notes et observations
  notes: string;
  lastUpdated: Date;
}

export interface EmergencyPlan {
  personId: 'person1' | 'person2';
  nom: string;
  prenom: string;
  
  // Informations personnelles de base
  informationsPersonnelles: {
    dateNaissance?: Date;
    lieuNaissance?: string;
    numeroAssuranceSociale?: string;
    numeroAssuranceMaladie?: string;
    adresseActuelle?: string;
  };
  
  // Contacts d'urgence
  contactsUrgence: EmergencyContact[];
  
  // Informations médicales
  informationsMedicales: MedicalInfo;
  
  // Finances
  comptesBancaires: FinancialAccount[];
  cartesCredit: CreditCard[];
  accesBancairesEnLigne: OnlineBankingAccess[];
  investissements: Investment[];
  dettes: Debt[];
  
  // Assurances
  assurances: Insurance[];
  
  // Documents légaux
  documentsLegaux: LegalDocument[];
  
  // Propriétés et biens
  proprietes: PropertyInfo[];
  vehicules: Vehicle[];
  coffresForts: SafetyDeposit[];
  entreposage: Storage[];
  
  // Emploi et prestations
  emploi?: EmploymentInfo;
  
  // Accès numériques et abonnements
  accesNumeriques: DigitalAccess[];
  abonnements: Subscription[];
  
  // Responsabilités familiales
  responsabilitesFamiliales: FamilyResponsibility[];
  animauxCompagnie: Pet[];
  
  // Volontés spécifiques (intégration avec planification successorale)
  volontesSpecifiques: {
    funerailles?: {
      type: 'inhumation' | 'cremation' | 'don_science';
      lieu?: string;
      ceremonieReligieuse: boolean;
      typeService?: 'prive' | 'public' | 'memorial';
      volontesSpeciales?: string;
      budgetEstime?: number;
      prearrangements?: {
        effectues: boolean;
        entreprise?: string;
        numeroContrat?: string;
        lieuContrat?: string;
      };
      salonFuneraire?: {
        nom: string;
        adresse: string;
        personneContact?: string;
        telephone?: string;
      };
      cimetiere?: {
        nom: string;
        adresse: string;
        numeroLot?: string;
        personnesInhumees?: string;
      };
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
  
  // Liste de vérification pour les proches
  listeVerificationDeces: DeathChecklist[];
  
  // Nouvelles sections ajoutées
  listeEvacuation?: EvacuationChecklist;
  dossierMedicalComplet?: ComprehensiveMedicalRecord;
  
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
