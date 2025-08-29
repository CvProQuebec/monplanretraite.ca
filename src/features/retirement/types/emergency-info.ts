// Types pour le module "Informations en cas d'urgence"
// Respectant la typographie québécoise (espaces avant : et $, pas avant ; ! ?)

export interface EmergencyContact {
  nom: string;
  telephone: string;
  adresseCourriel?: string;
  lien?: string;
  relation?: string;
}

export interface MedicalInfo {
  groupeSanguin?: string;
  allergiesMedicamenteuses?: string;
  conditionsMedicalesChroniques?: string;
  medicamentsActuels: Medication[];
  contactsUrgenceMedicale?: string;
  
  // Directives médicales anticipées détaillées
  directivesMedicalesAnticipees: {
    // Situations d'urgence critique
    reanimationCardiaque: 'oui' | 'non' | 'famille' | 'non_specifie';
    ventilationArtificielle: 'oui' | 'non' | 'famille' | 'non_specifie';
    defibrillation: 'oui' | 'non' | 'famille' | 'non_specifie';
    
    // Traitements médicaux
    antibiotiquesIV: 'oui' | 'non' | 'famille' | 'non_specifie';
    transfusions: 'oui' | 'non' | 'famille' | 'non_specifie';
    chimiotherapie: 'oui' | 'non' | 'famille' | 'non_specifie';
    dialyse: 'oui' | 'non' | 'famille' | 'non_specifie';
    
    // Alimentation et hydratation
    sondeGastrique: 'oui' | 'non' | 'famille' | 'non_specifie';
    hydratationIV: 'oui' | 'non' | 'famille' | 'non_specifie';
    nutritionParentale: 'oui' | 'non' | 'famille' | 'non_specifie';
    
    // Soins de fin de vie
    soinsPalliatifs: 'oui' | 'non' | 'famille' | 'non_specifie';
    sedation: 'oui' | 'non' | 'famille' | 'non_specifie';
    preferenceLieu: 'domicile' | 'hopital' | 'centre_soins' | 'non_specifie';
    
      // Situations neurologiques
  ventilationProlongee: 'oui' | 'non' | 'famille' | 'non_specifie';
  tracheotomie: 'oui' | 'non' | 'famille' | 'non_specifie';
  
  // Don d'organes et tissus
  donOrganes: 'oui' | 'non' | 'famille' | 'non_specifie';
  prochesAvertis: 'oui' | 'non' | 'a_faire' | 'non_specifie';
  permisConduireCoche: 'oui' | 'non' | 'a_verifier' | 'non_specifie';
  organesSpecifiques: 'tous' | 'certains' | 'aucun' | 'non_specifie';
  tissus: 'oui' | 'non' | 'certains' | 'non_specifie';
  conditionsDon: 'mort_cerebrale' | 'arret_cardiaque' | 'les_deux' | 'non_specifie';
  restrictionsOrganes: string;
  contactDon: string;
};
  
  // Consultation et validation
  consultationSiConscient: boolean;
  personneConfiancePrincipale: string;
  personneConfianceSecondaire: string;
  
  // Documents légaux québécois
  aideMedicaleAMourir: 'oui' | 'non' | 'a_discuter' | 'non_specifie';
  autresDocumentsIntentions: string;
  mandatInaptitude: {
    possede: boolean;
    disponible: boolean;
    emplacement: string;
  };
  
  // Commentaires et précisions
  commentairesDirectives: string;
  
  dateMiseAJour: string;
}

export interface Medication {
  nom: string;
  dosage: string;
  frequence: string;
}

export interface Dependent {
  nom: string;
  coordonnees: string;
  instructionsSpeciales?: string;
}

export interface Pet {
  nomAnimal: string;
  veterinaire: string;
  personneDesignee: string;
}

export interface EmploymentInfo {
  nomEntreprise: string;
  adresse: string;
  superieurImmediat: string;
  telephoneCourriel: string;
  personneRessourceRH: string;
  telephoneCourrielRH: string;
  numeroEmploye: string;
  avantagesSociaux?: string;
  reerCollectif?: string;
}

export interface ImportantDocument {
  type: 'identite' | 'legal' | 'financier';
  nom: string;
  emplacement: string;
  dateMiseAJour: string;
}

export interface MedicalContact {
  nom: string;
  specialite: string;
  telephone: string;
  courriel: string;
}

export interface Property {
  type: 'principale' | 'secondaire' | 'autre';
  adresse: string;
  titrePropriete?: string;
  numeroLotCadastral?: string;
  hypotheque?: {
    institutionFinanciere: string;
    soldeApproximatif: number;
    existe: boolean;
  };
  detailsParticuliers?: string;
}

export interface StoredGoods {
  nomEntreprise: string;
  adresse: string;
  numeroLocalUnite: string;
  codeAccesCle: string;
  listeContenuPrincipal: string;
}

export interface FinancialInfo {
  cartesCredit: CreditCard[];
  comptesBancaires: BankAccount[];
  servicesBancairesEnLigne: OnlineBankingService[];
  authentificationDeuxFacteurs: boolean;
  codesRecuperation?: string;
  comptesEtranger?: string;
  cryptomonnaies?: string;
  dettesObligations?: string;
  pretsPersonnels: PersonalLoan[];
  autresDettes: OtherDebt[];
}

export interface CreditCard {
  emetteur: string;
  numero: string;
  soldeApproximatif: number;
}

export interface BankAccount {
  type: string;
  numeroCompte: string;
  banque: string;
  adresseSuccursale: string;
  coTitulaires?: string;
}

export interface OnlineBankingService {
  institution: string;
  siteWeb: string;
  codeAccesMotDePasse: string;
  questionSecurite: string;
}

export interface PersonalLoan {
  crediteur: string;
  montant: number;
  echeance: string;
}

export interface OtherDebt {
  nom: string;
  montant: number;
  echeance: string;
}

export interface Investment {
  type: 'reer' | 'celi' | 'cri' | 'actionsObligations';
  institution: string;
  typeInvestissement?: string;
  numeroCompte: string;
  representantFinancier?: string;
  courtier?: string;
  contact?: string;
}

export interface OnlineAccount {
  type: 'cellulaire' | 'telephone' | 'internet' | 'television' | 'abonnement';
  fournisseur: string;
  numeroTelephone?: string;
  numeroCompte: string;
  nomUtilisateur?: string;
}

export interface DigitalAccess {
  gestionnaireMotDePasse?: string;
  motDePasseGestionnaire?: string;
  numeroTelephoneCellulaire?: string;
  methodeDeverrouillage: 'code' | 'motif' | 'reconnaissanceFaciale';
  motDePasseTelephone?: string;
  motDePasseOrdinateur?: string;
}

export interface EmailAccount {
  identifiant: string;
  motDePasse: string;
  authentificationDeuxFacteurs?: string;
  codesRecuperation?: string;
}

export interface SocialNetwork {
  nom: string;
  nomUtilisateur: string;
  motDePasse: string;
}

export interface Insurance {
  type: 'automobile' | 'habitation' | 'vie' | 'autre';
  compagnie: string;
  numeroPolice: string;
  agent?: string;
  beneficiaire?: string;
  montant?: number;
  details?: string;
}

export interface WillAndSuccession {
  typeTestament?: 'olographe' | 'devantTemoins' | 'notarie';
  dateRedaction?: string;
  emplacementCopie?: string;
  professionnel?: {
    nom: string;
    adresse: string;
    telephone: string;
    numeroDossier: string;
  };
  executeurTestamentaire?: {
    nom: string;
    lienParente: string;
    adresse: string;
    telephone: string;
  };
  executeurSubstitut?: {
    nom: string;
    telephone: string;
    courriel: string;
  };
}

export interface FuneralPreferences {
  prearrangements?: {
    effectues: boolean;
    entreprise?: string;
    numeroContrat?: string;
    lieuContrat?: string;
  };
  souhaits?: string;
  volonte?: 'inhumation' | 'cremation' | 'donCorps';
  autresInstructions?: string;
}

export interface FuneralHome {
  nom: string;
  adresse: string;
  personneContact: string;
  telephone: string;
  informationColombarium?: string;
}

export interface Cemetery {
  nom: string;
  adresse: string;
  numeroLotConcession?: string;
  personnesDejaInhumees?: string;
}

export interface EmergencyInfoData {
  contactsUrgence: EmergencyContact[];
  informationsMedicales: MedicalInfo;
  personnesCharge: Dependent[];
  animauxCompagnie: Pet[];
  emploiPrestations: EmploymentInfo;
  documentsImportants: ImportantDocument[];
  contactsMedicaux: MedicalContact[];
  contactsImportants: {
    familleProche: EmergencyContact[];
    amisProches: EmergencyContact[];
    professionnels: EmergencyContact[];
  };
  proprietes: Property[];
  biensEntreposes: StoredGoods;
  informationsFinancieres: FinancialInfo;
  investissements: Investment[];
  comptesEnLigne: OnlineAccount[];
  accesNumerique: DigitalAccess;
  comptesCourriels: EmailAccount[];
  reseauxSociaux: SocialNetwork[];
  assurances: Insurance[];
  testamentSuccession: WillAndSuccession;
  preferencesFuneraires: FuneralPreferences;
  salonFuneraire?: FuneralHome;
  cimetiere?: Cemetery;
  autresInstructions?: string;
  dateDerniereRevision: string;
  signature?: string;
}

export interface EmergencyInfoSection {
  id: string;
  titre: string;
  description: string;
  icone: string;
  planRequirement: 'gratuit' | 'professionnel' | 'ultime';
  composant: React.ComponentType<any>;
}
