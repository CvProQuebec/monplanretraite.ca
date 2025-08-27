// Types pour la planification successorale
export interface Beneficiaire {
  id: string;
  prenom: string;
  nom: string;
  relation: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  pourcentage?: number;
  montantFixe?: number;
  typeLegs: 'universel' | 'particulier' | 'residuel';
  conditions?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Actif {
  id: string;
  nom: string;
  type: 'immobilier' | 'vehicule' | 'compte_bancaire' | 'placement' | 'assurance_vie' | 'entreprise' | 'autre';
  description?: string;
  valeurEstimee: number;
  localisation?: string;
  numeroCompte?: string;
  institution?: string;
  beneficiaireDesigne?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentLegal {
  id: string;
  type: 'testament' | 'mandat_inaptitude' | 'procuration' | 'assurance_vie' | 'autre';
  nom: string;
  dateCreation?: Date;
  localisation: string;
  notaire?: string;
  numeroReference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VolontesFuneraires {
  type: 'inhumation' | 'cremation' | 'don_corps';
  lieu?: string;
  salonFuneraire?: string;
  cimetiere?: string;
  ceremonieReligieuse: boolean;
  typeService: 'prive' | 'public' | 'memorial';
  budgetEstime?: number;
  volontesSpeciales?: string;
  musique?: string;
  fleurs?: string;
  dons_lieu_fleurs?: string;
}

export interface DonCaritatif {
  id: string;
  organisme: string;
  adresse?: string;
  numeroCharite?: string;
  montant?: number;
  pourcentage?: number;
  typeLegs: 'montant_fixe' | 'pourcentage' | 'residuel';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsiderationFiscale {
  id: string;
  type: 'reer_ferr' | 'celi' | 'gains_capital' | 'entreprise' | 'autre';
  description: string;
  strategie?: string;
  impactEstime?: number;
  conseillerFiscal?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuccessionPlan {
  personId: 'person1' | 'person2';
  nom: string;
  prenom: string;
  beneficiaires: Beneficiaire[];
  actifs: Actif[];
  documentsLegaux: DocumentLegal[];
  volontesFuneraires: VolontesFuneraires;
  donsCaritables: DonCaritatif[];
  considerationsFiscales: ConsiderationFiscale[];
  dateCreation: Date;
  derniereMiseAJour: Date;
  version: number;
  statut: 'brouillon' | 'complet' | 'revise';
}

export interface SuccessionPlanningState {
  person1Plan: SuccessionPlan;
  person2Plan: SuccessionPlan;
  selectedPerson: 'person1' | 'person2';
  isEditing: boolean;
  lastSaved?: Date;
}

// Types pour les informations d'urgence (basés sur le document Word)
export interface InformationsPersonnelles {
  nomComplet: string;
  dateNaissance?: Date;
  lieuNaissance?: string;
  nas?: string;
  numeroAssuranceMaladie?: string;
  adresseActuelle?: string;
}

export interface TestamentSuccession {
  hasWill: boolean;
  willType?: 'olographe' | 'notarie' | 'devant_temoins';
  willDate?: Date;
  willLocation?: string;
  notaireName?: string;
  notaireAddress?: string;
  notairePhone?: string;
  numeroDossier?: string;
  executorName?: string;
  executorRelation?: string;
  executorAddress?: string;
  executorPhone?: string;
  executorEmail?: string;
  executorSubstitute?: string;
  notes?: string;
}

export interface ProprieteImmobiliere {
  id: string;
  type: 'residence_principale' | 'residence_secondaire' | 'autre';
  adresse: string;
  titrePropriete?: string;
  numeroLotCadastral?: string;
  hypothequeRestante: boolean;
  institutionFinanciere?: string;
  soldeApproximatif?: number;
  details?: string;
}

export interface Vehicule {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  numeroImmatriculation?: string;
  certificatPropriete?: string;
  lieuCles?: string;
  financementRestant: boolean;
  institution?: string;
}

export interface BiensEntreposes {
  id: string;
  type: 'entrepot' | 'coffre_fort_bancaire';
  nomEntreprise?: string;
  adresse?: string;
  numeroLocal?: string;
  codeAcces?: string;
  lieuCle?: string;
  coLocataire?: string;
  contenuPrincipal?: string;
}

export interface PreferencesGenerales {
  souhait: 'inhumation' | 'cremation' | 'don_corps';
  religionRite?: string;
}

export interface Cimetiere {
  id: string;
  nom: string;
  adresse: string;
  numeroLot?: string;
  personnesInhumees?: string;
}

export interface SalonFuneraire {
  id: string;
  nom: string;
  adresse: string;
  personneContact?: string;
  telephone?: string;
}

export interface Prearrangements {
  effectues: boolean;
  entreprise?: string;
  numeroContrat?: string;
  lieuContrat?: string;
}

export interface CompteBancaire {
  id: string;
  type: 'cheques' | 'epargne' | 'autre';
  institution: string;
  adresseSuccursale?: string;
  numeroCompte: string;
  coTitulaire?: string;
}

export interface CarteCredit {
  id: string;
  emetteur: string;
  numeroQuatreChiffres: string;
  coSignataire?: string;
}

export interface PlacementEpargne {
  id: string;
  type: 'reer_ferr' | 'celi' | 'autre';
  institution: string;
  numeroCompte: string;
  beneficiaireDesigne?: string;
  conseiller?: string;
  details?: string;
}

export interface ContactMedical {
  id: string;
  type: 'medecin_famille' | 'dentiste' | 'specialiste' | 'pharmacie';
  nom: string;
  clinique?: string;
  telephone: string;
  adresse?: string;
  specialite?: string;
}

export interface AssuranceInfo {
  id: string;
  type: 'vie' | 'habitation' | 'automobile' | 'autre';
  compagnie: string;
  numeroPolice: string;
  montant?: number;
  beneficiaire?: string;
  agent?: string;
}

export interface DocumentImportant {
  id: string;
  type: 'identite' | 'financier' | 'legal';
  nom: string;
  emplacement: string;
}

export interface AccesNumerique {
  id: string;
  type: 'appareil' | 'compte_ligne' | 'courriel' | 'reseau_social' | 'telecommunication';
  nom: string;
  identifiant?: string;
  motDePasse?: string;
  numeroCompte?: string;
}

export interface ContactImportant {
  id: string;
  type: 'famille' | 'ami' | 'professionnel';
  nom: string;
  lien?: string;
  telephone: string;
  adresse?: string;
}

export interface EmploiPrestation {
  id: string;
  type: 'employeur' | 'regime_retraite';
  nom: string;
  adresse?: string;
  personneRessource?: string;
  telephone?: string;
  details?: string;
}

export interface SoinAnimal {
  id: string;
  nomAnimal: string;
  veterinaire?: string;
  personneDesignee?: string;
}

// Interface principale pour toutes les informations d'urgence
export interface InformationsUrgence {
  informationsPersonnelles: InformationsPersonnelles;
  testamentSuccession: TestamentSuccession;
  proprietesImmobilieres: ProprieteImmobiliere[];
  vehicules: Vehicule[];
  biensEntreposes: BiensEntreposes[];
  preferencesGenerales: PreferencesGenerales;
  cimetiere?: Cimetiere;
  salonFuneraire?: SalonFuneraire;
  prearrangements: Prearrangements;
  comptesBancaires: CompteBancaire[];
  cartesCredit: CarteCredit[];
  placementsEpargne: PlacementEpargne[];
  contactsMedicaux: ContactMedical[];
  assurances: AssuranceInfo[];
  documentsImportants: DocumentImportant[];
  accesNumeriques: AccesNumerique[];
  contactsImportants: ContactImportant[];
  emploiPrestations: EmploiPrestation[];
  soinsAnimaux: SoinAnimal[];
  instructionsParticulieres?: string;
  dateRevision?: Date;
}
