/**
 * Emergency types used by PDFEmergencyService and related modules.
 * Decoupled from UI to respect boundaries (Services must not depend on UI components).
 */

export interface EmergencyBankAccount {
  institution?: string;
  type?: string;
  notes?: string;
}

export interface EmergencyInvestmentAccount {
  institution?: string;
  accountNumberMasked?: string;
  notes?: string;
}

export interface EmergencyBrokerAccount {
  courtier?: string;
  accountNumberMasked?: string;
  notes?: string;
}

export interface EmergencyCreditCard {
  institution?: string;
  issuer?: string;
  last4Masked?: string;
  notes?: string;
}

export interface EmergencyResidence {
  adresse?: string;
  notes?: string;
}

export interface EmergencyVehicle {
  marqueModeleAnnee?: string;
  vinMasked?: string;
  notes?: string;
}

export interface EmergencyData {
  // Identification
  prenom?: string;
  nom?: string;

  // Coordonnées
  adresse?: string;
  telephone?: string;
  courriel?: string;

  // Identifiants sensibles (seront caviardés par défaut)
  nas?: string;
  assuranceMaladie?: string;

  // Contact d’urgence
  contactUrgenceNom?: string;
  contactUrgenceTelephone?: string;

  // Documents juridiques
  possedeTestament?: boolean;
  lieuTestament?: string;
  testamentEmplacement?: string; // legacy alias
  executeurTestamentaire?: string;
  executeurTelephone?: string;
  notaire?: string;
  notaireTelephone?: string;
  notaireAdresse?: string;
  mandatProtectionPossede?: boolean;
  mandatProtectionEmplacement?: string;

  // Aperçu financier — comptes (noms d’institutions seulement)
  comptesBancaires?: EmergencyBankAccount[];
  reers?: EmergencyInvestmentAccount[];
  celis?: EmergencyInvestmentAccount[];
  cris?: EmergencyInvestmentAccount[];
  ferrs?: EmergencyInvestmentAccount[];
  brokerAccounts?: EmergencyBrokerAccount[];
  cartesCredit?: EmergencyCreditCard[];

  // Biens & résidences
  residencePrincipale?: EmergencyResidence;
  residenceSecondaire?: EmergencyResidence;
  autresProprietes?: EmergencyResidence[];
  vehiculePrincipal?: EmergencyVehicle;

  // Instructions & volontés
  instructionsSpeciales?: string;
  volontesFuneraires?: string;
  donOrganes?: string | boolean;
}
