// Types et interfaces pour la planification d'urgence

export interface Contact {
  id: string;
  nom: string;
  lienRelation: string;
  telephone: string;
  instructions: string;
  email: string;
  adresse: string;
  estContactUrgence?: boolean;
}

export interface Medicament {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  prescripteur?: string;
}

export interface ContactMedical {
  id: string;
  nom: string;
  specialite: string;
  telephone: string;
  courriel: string;
}

export interface CompteBancaire {
  id: string;
  type: string;
  institution: string;
  numeroCompte: string;
  adresseSuccursale?: string;
  coTitulaire?: string;
  soldeApproximatif?: string;
}

export interface CreditCard {
  id: string;
  emetteur: string;
  numero4: string;
  soldeApproximatif?: string;
}

export interface PretPersonnel {
  id: string;
  creancier: string;
  montant: string;
  echeance: string;
}

export interface AutreDette {
  id: string;
  nom: string;
  contact: string;
  montant: string;
  echeance: string;
}

export interface InvestmentAccount {
  id: string;
  institution: string;
  typeInvestissement: string;
  numeroCompte: string;
  representantNom: string;
  representantContact: string;
}

export interface BrokerAccount {
  id: string;
  courtier: string;
  numeroCompte: string;
  contact: string;
}

export interface TelecomService {
  fournisseur: string;
  numeroTelephone?: string;
  numeroCompte: string;
}

export interface SimpleAccount {
  username: string;
  numeroCompte: string;
  fournisseur?: string;
  numeroTelephone?: string;
}

export interface GymSubscription {
  fournisseur: string;
  username: string;
  numeroCompte: string;
}

export interface RecurringService {
  id: string;
  service: string;
  username: string;
  numeroCompte: string;
}

export interface LoyaltyProgram {
  id: string;
  programme: string;
  courriel: string;
  motDePasse: string;
  numeroCompte: string;
}

export interface Vehicule {
  id: string;
  type: string;
  marque: string;
  modele: string;
  annee: string;
  plaque: string;
}

export interface ResidencePrincipale {
  adresse: string;
  titreProprieteLieu: string;
  lotCadastral: string;
  hypothequeRestante: string;
  institutionFinanciere: string;
  soldeApproximatif: string;
}

export interface ResidenceSecondaire {
  titrePropriete: string;
  adresse: string;
  detailsParticuliers: string;
  hypothequeRestante: string;
  institutionFinanciere: string;
  soldeApproximatif: string;
}

export interface AutrePropriete {
  id: string;
  typePropriete: string;
  adresse: string;
  details: string;
  hypothequeRestante: string;
  institutionFinanciere: string;
  soldeApproximatif: string;
}

export interface GardeMeuble {
  nomEntreprise: string;
  adresse: string;
  numeroLocal: string;
  codeAccesLieuCle: string;
  listeContenu: string;
}

export interface VehicleDetail {
  id: string;
  marqueModeleAnnee: string;
  immatriculation: string;
  certificatLieu: string;
  lieuCles: string;
  financementRestant: string;
  institution: string;
}

export interface DMEntry {
  id: string;
  date: string;
  details: string;
}

export interface DMMedicamentActuel {
  id: string;
  nom: string;
  posologie: string;
  prescritPar: string;
}

export interface DMParentAntecedent {
  nom: string;
  dateNaissance: string;
  ageActuel: string;
  maladie: string;
  medication: string;
}

export interface DMPersonneAntecedent {
  nom: string;
  maladie: string;
  medication: string;
}

export interface DMGrandParentAntecedent {
  nom: string;
  ageDeces: string;
  causeDeces: string;
}

export interface DMAutreVaccin {
  id: string;
  nom: string;
  dateDose1: string;
  dateDose2: string;
}

export interface DMCovidVaccin {
  id: string;
  date: string;
  vaccin: string;
}

export interface DossierMedical {
  adresse: string;
  telephoneDomicile: string;
  telephoneCellulaire: string;
  courriel: string;
  dateNaissance: string;
  taille: string;
  poids: string;
  groupeSanguin: string;
  allergies: string;
  conditionsMedicales: string;
  medicamentsActuels: DMMedicamentActuel[];
  antecedentsPersonnels: DMPersonneAntecedent[];
  antecedentsParents: DMParentAntecedent[];
  antecedentsGrandParents: DMGrandParentAntecedent[];
  vaccinCovid: DMCovidVaccin[];
  autresVaccins: DMAutreVaccin[];
  examensSuivis: DMEntry[];
  rapportsMedicaux: DMEntry[];
}

export interface DocumentChecklist {
  id: string;
  categorie: 'identite' | 'legaux' | 'financiers';
  nom: string;
  possede: boolean;
  emplacement: string;
}

export interface EmergencyData {
  // Personnel
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  courriel: string;
  adresse: string;
  nas: string;
  assuranceMaladie: string;
  allergies: string;
  conditionsMedicales: string;
  contactUrgenceNom: string;
  contactUrgenceTelephone: string;

  // Médical
  groupeSanguin: string;
  contactsMedicaux: ContactMedical[];
  medicaments: Medicament[];
  dossierMedical: DossierMedical;

  // Contacts médicaux structurés (depuis le fichier de sauvegarde)
  medecinFamilleNom: string;
  medecinFamilleAdresse: string;
  medecinFamilleTelephone: string;
  specialiste1Specialite: string;
  specialiste1Nom: string;
  specialiste1Adresse: string;
  specialiste1Telephone: string;
  specialiste2Specialite: string;
  specialiste2Nom: string;
  specialiste2Adresse: string;
  specialiste2Telephone: string;
  specialiste3Specialite: string;
  specialiste3Nom: string;
  specialiste3Adresse: string;
  specialiste3Telephone: string;
  dentisteNom: string;
  dentisteAdresse: string;
  dentisteTelephone: string;
  pharmacieNom: string;
  pharmacieAdresse: string;
  pharmacieTelephone: string;

  // Emploi
  employeur: string;
  employeurTelephone: string;
  numeroEmploye: string;
  adresseTravail: string;
  poste: string;
  departement: string;
  rhContactNom: string;
  rhContactCourriel: string;
  rhContactTelephone: string;
  superviseur: string;
  superviseurCourriel: string;
  superviseurTelephone: string;
  avantagesSociaux: string;
  instructionsEmployeur: string;
  dateDebutEmploi: string;
  salaireAnnuel: string;
  joursVacances: string;

  // Contacts
  contacts: Contact[];
  contact1Nom: string;
  contact1LienRelation: string;
  contact1Telephone: string;
  contact1Instructions: string;
  contact2Nom: string;
  contact2LienRelation: string;
  contact2Telephone: string;
  contact2Instructions: string;
  contact3Nom: string;
  contact3LienRelation: string;
  contact3Telephone: string;
  contact3Instructions: string;

  // Finances
  comptesBancaires: CompteBancaire[];
  cartesCredit?: CreditCard[];
  comptesEtrangerInfo: string;
  cryptomonnaiesInfo: string;
  pretsPersonnels: PretPersonnel[];
  autresDettes: AutreDette[];
  investissementsImmobiliersInfo: string;
  reers: InvestmentAccount[];
  celis: InvestmentAccount[];
  cris: InvestmentAccount[];
  ferrs: InvestmentAccount[];
  brokerAccounts: BrokerAccount[];

  // Biens
  residencePrincipale: ResidencePrincipale;
  residenceSecondaire: ResidenceSecondaire;
  autresProprietes: AutrePropriete[];
  gardeMeuble: GardeMeuble;
  vehiculePrincipal: VehicleDetail;
  autresVehicules: VehicleDetail[];

  // Services
  telecom: TelecomService;
  internet: SimpleAccount;
  gym: GymSubscription;
  servicesRecurrents: RecurringService[];
  programmesFidelite: LoyaltyProgram[];
  
  // Nouveaux champs pour services spécifiques
  netflixNom: string;
  netflixCompte: string;
  spotifyNom: string;
  spotifyCompte: string;
  amazonNom: string;
  amazonCompte: string;
  service1Nom: string;
  service1Abonnement: string;
  service1Compte: string;
  service2Nom: string;
  service2Abonnement: string;
  service2Compte: string;
  service3Nom: string;
  service3Abonnement: string;
  service3Compte: string;
  
  // Programmes de loyauté spécifiques
  airCanadaCourriel: string;
  airCanadaMotDePasse: string;
  airCanadaCompte: string;
  airMilesCourriel: string;
  airMilesMotDePasse: string;
  airMilesCompte: string;
  aeroplanCourriel: string;
  aeroplanMotDePasse: string;
  aeroplanCompte: string;
  marriottCourriel: string;
  marriottMotDePasse: string;
  marriottCompte: string;
  hiltonCourriel: string;
  hiltonMotDePasse: string;
  hiltonCompte: string;
  hyattCourriel: string;
  hyattMotDePasse: string;
  hyattCompte: string;

  // Numérique (maintenant dans Instructions)
  gestionnaireMDP: string;
  motDePassePrincipal: string;
  comptesEnLigne: Array<{
    id: string;
    plateforme: string;
    courriel: string;
    motDePasse: string;
  }>;

  // Documents
  documentsChecklist: DocumentChecklist[];
  
  // Documents individuels avec possédé/emplacement
  permisConduirePossede: boolean;
  permisConduireEmplacement: string;
  passeportPossede: boolean;
  passeportEmplacement: string;
  certificatNaissancePossede: boolean;
  certificatNaissanceEmplacement: string;
  certificatMariagePossede: boolean;
  certificatMariageEmplacement: string;
  certificatDivorcePossede: boolean;
  certificatDivorceEmplacement: string;
  testamentPossede: boolean;
  testamentEmplacement: string;
  mandatProtectionPossede: boolean;
  mandatProtectionEmplacement: string;
  procurationPossede: boolean;
  procurationEmplacement: string;
  fiduciePossede: boolean;
  fiducieEmplacement: string;
  tutelleCuratellePossede: boolean;
  tutelleCuratelleEmplacement: string;
  relevesBancairesPossede: boolean;
  relevesBancairesEmplacement: string;
  policesAssuranceViePossede: boolean;
  policesAssuranceVieEmplacement: string;
  assuranceAutoPossede: boolean;
  assuranceAutoEmplacement: string;
  assuranceHabitationPossede: boolean;
  assuranceHabitationEmplacement: string;
  assuranceInvaliditePossede: boolean;
  assuranceInvaliditeEmplacement: string;

  // Testament
  possedeTestament: boolean;
  lieuTestament: string;
  emplacementCopieTestament: string;
  executeurTestamentaire: string;
  executeurTelephone: string;
  notaire: string;
  notaireAdresse: string;
  notaireTelephone: string;
  numeroMinuteTestament: string;
  testamentVie: string;
  donOrganes: string;
  volontesFuneraires: string;
  instructionsSpeciales: string;
  instructionAnimaux: string;
  instructionPlantes: string;
  instructionPropriete: string;
  instructionCoffreFort: string;
  instructionAffaires: string;
  messagesPersonnels: string;

  // Meta
  dateMAJ: string;
  version: string;
}