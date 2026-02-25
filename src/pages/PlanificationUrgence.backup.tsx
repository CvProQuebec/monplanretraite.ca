import React, { useState, useEffect } from 'react';
import { 
  Save, Download, Upload, FileText, Eye, EyeOff, Plus, Trash2, 
  Phone, Heart, Shield, Home, Car, CreditCard, Building, Users,
  Monitor, Key, Lock, AlertTriangle, CheckCircle,
  Info, User, Mail, MapPin, Briefcase, PiggyBank, FileCheck,
  Smartphone, DollarSign, Clock, Pill, Stethoscope,
  ChevronRight, ChevronDown, Check, X, Edit, Printer, Globe
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

// Interfaces TypeScript complètes
interface Contact {
  id: string;
  nom: string;
  lienRelation: string;
  telephone: string;
  instructions: string;
  email: string;
  adresse: string;
  estContactUrgence?: boolean;
}

interface Medicament {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  prescripteur?: string;
}

interface ContactMedical {
  id: string;
  nom: string;
  specialite: string;
  telephone: string;
  courriel: string;
}

interface CompteBancaire {
  id: string;
  type: string;
  institution: string;
  numeroCompte: string;
  adresseSuccursale?: string;
  coTitulaire?: string;
  soldeApproximatif?: string;
}

/* Finances étendues */
interface CreditCard {
  id: string;
  emetteur: string;
  numero4: string; // 4 derniers chiffres
  soldeApproximatif?: string;
}

interface PretPersonnel {
  id: string;
  creancier: string;
  montant: string;
  echeance: string; // YYYY-MM-DD ou texte
}

interface AutreDette {
  id: string;
  nom: string;
  contact: string; // téléphone ou courriel
  montant: string;
  echeance: string;
}

interface InvestmentAccount {
  id: string;
  institution: string;
  typeInvestissement: string;
  numeroCompte: string;
  representantNom: string;
  representantContact: string; // téléphone / courriel
}

interface BrokerAccount {
  id: string;
  courtier: string;
  numeroCompte: string;
  contact: string;
}

/* Services et abonnements */
interface TelecomService {
  fournisseur: string;
  numeroTelephone?: string;
  numeroCompte: string;
}
interface SimpleAccount {
  username: string;
  numeroCompte: string;
}
interface GymSubscription {
  fournisseur: string;
  username: string;
  numeroCompte: string;
}
interface RecurringService {
  id: string;
  service: string;
  username: string;
  numeroCompte: string;
}
interface LoyaltyProgram {
  id: string;
  programme: string;
  courriel: string;
  motDePasse: string;
  numeroCompte: string;
}

interface Vehicule {
  id: string;
  type: string;
  marque: string;
  modele: string;
  annee: string;
  plaque: string;
}

/* Biens et propriétés - structures détaillées */
interface ResidencePrincipale {
  adresse: string;
  titreProprieteLieu: string;
  lotCadastral: string;
  hypothequeRestante: string; // "Oui" | "Non"
  institutionFinanciere: string;
  soldeApproximatif: string;
}

interface ResidenceSecondaire {
  titrePropriete: string;
  adresse: string;
  detailsParticuliers: string;
  hypothequeRestante: string; // "Oui" | "Non"
  institutionFinanciere: string;
  soldeApproximatif: string;
}

interface AutrePropriete {
  id: string;
  typePropriete: string;
  adresse: string;
  details: string;
  hypothequeRestante: string; // "Oui" | "Non"
  institutionFinanciere: string;
  soldeApproximatif: string;
}

interface GardeMeuble {
  nomEntreprise: string;
  adresse: string;
  numeroLocal: string;
  codeAccesLieuCle: string;
  listeContenu: string;
}

interface VehicleDetail {
  id: string;
  marqueModeleAnnee: string;
  immatriculation: string;
  certificatLieu: string;
  lieuCles: string;
  financementRestant: string; // "Oui" | "Non"
  institution: string;
}

/* Dossier médical - structures */
interface DMEntry {
  id: string;
  date: string;
  details: string;
}
interface DMMedicamentActuel {
  id: string;
  nom: string;
  posologie: string;
  prescritPar: string;
}
interface DMParentAntecedent {
  nom: string;
  dateNaissance: string;
  ageActuel: string;
  maladie: string;
  medication: string;
}
interface DMPersonneAntecedent {
  nom: string;
  maladie: string;
  medication: string;
}
interface DMGrandParentAntecedent {
  nom: string;
  ageDeces: string;
  causeDeces: string;
}
interface DMAutreVaccin {
  id: string;
  nom: string;
  dateDose1: string;
  dateDose2: string;
}
interface DMCovidVaccin {
  id: string;
  date: string;
  vaccin: string;
}
interface DossierMedical {
  // Coordonnées du dossier
  adresse: string;
  telephoneDomicile: string;
  telephoneCellulaire: string;
  courriel: string;
  dateNaissance: string;
  taille: string;
  poids: string;

  // Sommaire
  sommaireConditions: string;
  hypertension: string; // "Oui" | "Non" | ""
  medicamentsActuels: DMMedicamentActuel[];
  allergiesConnues: string;

  // Historique chronologique
  interventionsChirurgicales: DMEntry[];
  evenementsSignificatifs: DMEntry[];

  // Antécédents familiaux
  antecedentsFamiliaux: {
    pere: DMParentAntecedent;
    mere: DMParentAntecedent;
    soeurs: DMPersonneAntecedent[];
    freres: DMPersonneAntecedent[];
    grandPerePaternel: DMGrandParentAntecedent;
    grandMerePaternelle: DMGrandParentAntecedent;
    grandPereMaternel: DMGrandParentAntecedent;
    grandMereMaternelle: DMGrandParentAntecedent;
  };

  // Vaccinations
  vaccinations: {
    coqueluche: string;
    diphterie: string;
    sabinAntipolio: string;
    salkPolio: string;
    tetanos: string;
    tuberculose: string;
    autres: DMAutreVaccin[];
    covid19: DMCovidVaccin[];
  };

  // Examens et consultations
  examensConsultations: {
    imagerie: DMEntry[];
    consultations: DMEntry[];
  };

  // Suivis récents
  suivisRecents: DMEntry[];

  // Résumé rapports
  resumeRapports: string;
}

interface DocumentChecklist {
  id: string;
  categorie: 'identite' | 'legaux' | 'financiers';
  nom: string;
  possede: boolean;
  emplacement: string;
}

interface EmergencyData {
  // Personnel
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  courriel: string;
  adresse: string;
  nas: string;
  assuranceMaladie: string;
  
  // Médical
  allergies: string;
  conditionsMedicales: string;
  medicaments: Medicament[];
  groupeSanguin: string;

  // Contacts médicaux
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
  pharmacieAdresse: string;
  
  // Emploi
  employeurNom: string;
  employeurTelephone: string;
  numeroEmploye: string;
  rhPersonneRessourceNom: string;
  rhPersonneRessourceCourriel: string;
  rhPersonneRessourceTelephone: string;
  superviseurNom: string;
  superviseurCourriel: string;
  superviseurTelephone: string;
  
  // Contacts
  contactsUrgence: Contact[];
  famille: Contact[];
  professionnels: Contact[];
  
  // Médecins
  contactsMedicaux: ContactMedical[];
  pharmacieNom: string;
  pharmacieTelephone: string;

  // Dossier médical (section détaillée)
  dossierMedical: DossierMedical;
  
  // Finances
  comptesBancaires: CompteBancaire[];
  cartesCredit: CreditCard[];
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
  conseillerFinancierNom: string;
  conseillerFinancierTelephone: string;
  
  // Biens
  vehicules: Vehicule[];
  proprieteAdresse: string;
  residencePrincipale: ResidencePrincipale;
  residenceSecondaire: ResidenceSecondaire;
  autresProprietes: AutrePropriete[];
  gardeMeuble: GardeMeuble;
  vehiculePrincipal: VehicleDetail;
  autresVehicules: VehicleDetail[];
  
  // Services
  telecomCellulaire: TelecomService;
  telecomTelephone: TelecomService;
  telecomInternet: TelecomService;
  telecomTelevision: TelecomService;

  subscriptionAmazon: SimpleAccount;
  subscriptionNetflix: SimpleAccount;
  subscriptionSpotify: SimpleAccount;
  subscriptionGym: GymSubscription;
  subscriptionsDivers: RecurringService[];
  autresAbonnements: RecurringService[];

  programmesLoyaute: LoyaltyProgram[];

  fournisseurInternet: string;
  fournisseurTelephone: string;
  
  // Numérique
  gestionnaireMDP: string;
  motDePassePrincipal: string;
  
  // Documents
  documentsChecklist: DocumentChecklist[];
  
  // Testament
  testamentEmplacement: string;
  executeurNom: string;
  executeurTelephone: string;
  notaireNom: string;
  notaireAdresse: string;
  notaireTelephone: string;
  numeroMinuteTestament: string;
  
  // Instructions
  instructionsSpeciales: string;
  
  // Métadonnées
  dateMAJ: string;
  versionDocument: string;
}

const PlanificationUrgence: React.FC = () => {
  const { language, t } = useLanguage();
  
  const [data, setData] = useState<EmergencyData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: '',
    courriel: '',
    adresse: '',
    nas: '',
    assuranceMaladie: '',
    allergies: '',
    conditionsMedicales: '',
    medicaments: [],
    groupeSanguin: '',
    medecinFamilleNom: '',
    medecinFamilleAdresse: '',
    medecinFamilleTelephone: '',
    specialiste1Specialite: '',
    specialiste1Nom: '',
    specialiste1Adresse: '',
    specialiste1Telephone: '',
    specialiste2Specialite: '',
    specialiste2Nom: '',
    specialiste2Adresse: '',
    specialiste2Telephone: '',
    specialiste3Specialite: '',
    specialiste3Nom: '',
    specialiste3Adresse: '',
    specialiste3Telephone: '',
    dentisteNom: '',
    dentisteAdresse: '',
    dentisteTelephone: '',
    pharmacieAdresse: '',
    employeurNom: '',
    employeurTelephone: '',
    numeroEmploye: '',
    rhPersonneRessourceNom: '',
    rhPersonneRessourceCourriel: '',
    rhPersonneRessourceTelephone: '',
    superviseurNom: '',
    superviseurCourriel: '',
    superviseurTelephone: '',
    contactsUrgence: [],
    famille: [],
    professionnels: [],
    contactsMedicaux: [],
    pharmacieNom: '',
    pharmacieTelephone: '',

    dossierMedical: {
      adresse: '',
      telephoneDomicile: '',
      telephoneCellulaire: '',
      courriel: '',
      dateNaissance: '',
      taille: '',
      poids: '',

      sommaireConditions: '',
      hypertension: '',
      medicamentsActuels: [
        { id: 'dm-med-1', nom: '', posologie: '', prescritPar: '' }
      ],
      allergiesConnues: '',

      interventionsChirurgicales: [
        { id: 'dm-int-1', date: '', details: '' }
      ],
      evenementsSignificatifs: [
        { id: 'dm-ev-1', date: '', details: '' }
      ],

      antecedentsFamiliaux: {
        pere: { nom: '', dateNaissance: '', ageActuel: '', maladie: '', medication: '' },
        mere: { nom: '', dateNaissance: '', ageActuel: '', maladie: '', medication: '' },
        soeurs: [{ nom: '', maladie: '', medication: '' }],
        freres: [{ nom: '', maladie: '', medication: '' }],
        grandPerePaternel: { nom: '', ageDeces: '', causeDeces: '' },
        grandMerePaternelle: { nom: '', ageDeces: '', causeDeces: '' },
        grandPereMaternel: { nom: '', ageDeces: '', causeDeces: '' },
        grandMereMaternelle: { nom: '', ageDeces: '', causeDeces: '' }
      },

      vaccinations: {
        coqueluche: '',
        diphterie: '',
        sabinAntipolio: '',
        salkPolio: '',
        tetanos: '',
        tuberculose: '',
        autres: [{ id: 'dm-vac-autre-1', nom: '', dateDose1: '', dateDose2: '' }],
        covid19: [{ id: 'dm-vac-covid-1', date: '', vaccin: '' }]
      },

      examensConsultations: {
        imagerie: [{ id: 'dm-img-1', date: '', details: '' }],
        consultations: [{ id: 'dm-cons-1', date: '', details: '' }]
      },

      suivisRecents: [{ id: 'dm-suivi-1', date: '', details: '' }],

      resumeRapports: ''
    },
    comptesBancaires: [],
    cartesCredit: [],
    comptesEtrangerInfo: '',
    cryptomonnaiesInfo: '',
    pretsPersonnels: [],
    autresDettes: [],
    investissementsImmobiliersInfo: '',
    reers: [],
    celis: [],
    cris: [],
    ferrs: [],
    brokerAccounts: [],
    conseillerFinancierNom: '',
    conseillerFinancierTelephone: '',
    vehicules: [],
    proprieteAdresse: '',
    residencePrincipale: {
      adresse: '',
      titreProprieteLieu: '',
      lotCadastral: '',
      hypothequeRestante: '',
      institutionFinanciere: '',
      soldeApproximatif: ''
    },
    residenceSecondaire: {
      titrePropriete: '',
      adresse: '',
      detailsParticuliers: '',
      hypothequeRestante: '',
      institutionFinanciere: '',
      soldeApproximatif: ''
    },
    autresProprietes: [
      { id: 'autreprop-1', typePropriete: '', adresse: '', details: '', hypothequeRestante: '', institutionFinanciere: '', soldeApproximatif: '' }
    ],
    gardeMeuble: {
      nomEntreprise: '',
      adresse: '',
      numeroLocal: '',
      codeAccesLieuCle: '',
      listeContenu: ''
    },
    vehiculePrincipal: {
      id: 'veh-1',
      marqueModeleAnnee: '',
      immatriculation: '',
      certificatLieu: '',
      lieuCles: '',
      financementRestant: '',
      institution: ''
    },
    autresVehicules: [
      {
        id: 'veh-2',
        marqueModeleAnnee: '',
        immatriculation: '',
        certificatLieu: '',
        lieuCles: '',
        financementRestant: '',
        institution: ''
      }
    ],
    telecomCellulaire: { fournisseur: '', numeroTelephone: '', numeroCompte: '' },
    telecomTelephone: { fournisseur: '', numeroTelephone: '', numeroCompte: '' },
    telecomInternet: { fournisseur: '', numeroCompte: '' },
    telecomTelevision: { fournisseur: '', numeroCompte: '' },

    subscriptionAmazon: { username: '', numeroCompte: '' },
    subscriptionNetflix: { username: '', numeroCompte: '' },
    subscriptionSpotify: { username: '', numeroCompte: '' },
    subscriptionGym: { fournisseur: '', username: '', numeroCompte: '' },
    subscriptionsDivers: [
      { id: 'srv-1', service: '', username: '', numeroCompte: '' },
      { id: 'srv-2', service: '', username: '', numeroCompte: '' }
    ],
    autresAbonnements: [
      { id: 'autre-1', service: '', username: '', numeroCompte: '' },
      { id: 'autre-2', service: '', username: '', numeroCompte: '' }
    ],

    programmesLoyaute: [
      { id: 'prog-1', programme: 'Air Canada', courriel: '', motDePasse: '', numeroCompte: '' },
      { id: 'prog-2', programme: 'Air Miles', courriel: '', motDePasse: '', numeroCompte: '' },
      { id: 'prog-3', programme: 'Best Western Loyalty Program', courriel: '', motDePasse: '', numeroCompte: '' },
      { id: 'prog-4', programme: 'Marriott Bonvoy Elite', courriel: '', motDePasse: '', numeroCompte: '' },
      { id: 'prog-5', programme: 'Porter Airlines', courriel: '', motDePasse: '', numeroCompte: '' },
      { id: 'prog-6', programme: 'VIA Rail', courriel: '', motDePasse: '', numeroCompte: '' }
    ],

    fournisseurInternet: '',
    fournisseurTelephone: '',
    gestionnaireMDP: '',
    motDePassePrincipal: '',
    documentsChecklist: [
      { id: '1', categorie: 'identite', nom: 'Permis de conduire', possede: false, emplacement: '' },
      { id: '2', categorie: 'identite', nom: 'Passeport', possede: false, emplacement: '' },
      { id: '3', categorie: 'identite', nom: 'Certificat de naissance', possede: false, emplacement: '' },
      { id: '4', categorie: 'identite', nom: 'Certificat de mariage', possede: false, emplacement: '' },
      { id: '5', categorie: 'identite', nom: 'Certificat de divorce', possede: false, emplacement: '' },
      { id: '6', categorie: 'legaux', nom: 'Testament', possede: false, emplacement: '' },
      { id: '7', categorie: 'legaux', nom: 'Mandat de protection', possede: false, emplacement: '' },
      { id: '8', categorie: 'legaux', nom: 'Procuration', possede: false, emplacement: '' },
      { id: '9', categorie: 'legaux', nom: 'Fiducie', possede: false, emplacement: '' },
      { id: '10', categorie: 'legaux', nom: 'Tutelle/curatelle', possede: false, emplacement: '' },
      { id: '11', categorie: 'financiers', nom: 'Relevés bancaires', possede: false, emplacement: '' },
      { id: '12', categorie: 'financiers', nom: 'Polices d\'assurance-vie', possede: false, emplacement: '' },
      { id: '13', categorie: 'financiers', nom: 'Assurance auto', possede: false, emplacement: '' },
      { id: '14', categorie: 'financiers', nom: 'Assurance habitation', possede: false, emplacement: '' },
      { id: '15', categorie: 'financiers', nom: 'Assurance invalidité', possede: false, emplacement: '' }
    ],
    testamentEmplacement: '',
    executeurNom: '',
    executeurTelephone: '',
    notaireNom: '',
    notaireAdresse: '',
    notaireTelephone: '',
    numeroMinuteTestament: '',
    instructionsSpeciales: '',
    dateMAJ: new Date().toISOString().split('T')[0],
    versionDocument: '2.0'
  });

  const [activeTab, setActiveTab] = useState('personnel');
  const [showPasswords, setShowPasswords] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('emergencyPlan', JSON.stringify(data));
    }, 1000);
    return () => clearTimeout(timer);
  }, [data]);

  // Fonctions utilitaires
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Styles de base pour éviter les erreurs
  const styles = `
    .emergency-planning-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: system-ui, sans-serif;
    }
    .emergency-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    .emergency-header h1 {
      font-size: 28px;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .emergency-toolbar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    .btn-secondary {
      background: #6b7280;
      color: white;
    }
    .form-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      border: 2px solid #e5e7eb;
    }
    /* Barres de titre de section (fond visuel thème seniors)
       Niveaux visuels:
       1) h2 (plus foncé)
       2) h3/h4 (moyen)
       3) labels (plus pâle)
    */
    .form-section > h2 {
      /* Niveau 1 - plus foncé */
      /* Fallback RGBA si color-mix non supporté */
      background: rgba(43, 91, 168,0.22);
      /* Préférence: mélange dynamique avec la couleur du thème */
      background: color-mix(in srgb, var(--senior-primary, #2B5BA8) 22%, white);
      border: 2px solid color-mix(in srgb, var(--senior-primary, #2B5BA8) 35%, var(--senior-border, #e2e8f0));
      border-radius: 10px;
      padding: 12px 14px;
      color: var(--senior-text-primary, #1a365d);
    }
    /* Sous‑titres (h3/h4) contrastés et lisibles */
    .form-section h3,
    .item-card > h4 {
      /* Niveau 2 - moyen */
      background: rgba(43, 91, 168,0.15);
      background: color-mix(in srgb, var(--senior-primary, #2B5BA8) 15%, white);
      display: inline-block;
      padding: 6px 10px;
      border-radius: 6px;
      color: var(--senior-text-primary, #1a365d);
      border: 1px solid color-mix(in srgb, var(--senior-primary, #2B5BA8) 25%, var(--senior-border, #e2e8f0));
      margin-bottom: 6px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-label {
      /* Niveau 3 - plus pâle */
      font-weight: 700;
      color: var(--senior-text-primary, #1a365d);
      background: rgba(43, 91, 168,0.08);
      background: color-mix(in srgb, var(--senior-primary, #2B5BA8) 8%, white);
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid color-mix(in srgb, var(--senior-primary, #2B5BA8) 15%, var(--senior-border, #e2e8f0));
    }
    .form-input {
      padding: 12px;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
    }
    .emergency-tabs {
      display: flex;
      background: white;
      border-radius: 12px;
      padding: 8px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      flex-wrap: wrap;
      gap: 4px;
    }
    .emergency-tab {
      padding: 12px 20px;
      border: none;
      background: #f8f9fa;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      flex: 1;
      min-width: 140px;
      justify-content: center;
    }
    .emergency-tab:hover {
      background: #e2e8f0;
      color: #1e40af;
    }
    .emergency-tab.active {
      background: #3b82f6;
      color: white;
    }
    .tab-break {
      flex-basis: 100%;
      height: 0;
    }
    .collapsible-section {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .collapsible-header {
      padding: 20px 24px;
      background: #eef2ff; /* bleu très pâle, seniors */
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
      border-left: 6px solid var(--senior-primary, #2B5BA8);
      position: relative;
      min-height: 64px; /* zone cliquable 48px+ */
    }
    .collapsible-header:hover {
      background: #e0e7ff;
    }
    .collapsible-header:focus,
    .collapsible-header[tabindex="0"]:focus {
      outline: 3px solid var(--senior-primary, #2B5BA8);
      outline-offset: 2px;
    }
    .collapsible-hint {
      font-size: 16px;
      color: #1a365d;
      margin-left: 12px;
      font-weight: 600;
    }
    .collapsible-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge-info {
      background: var(--senior-warning, #ffd43b);
      color: #1a365d;
      border-radius: 9999px;
      padding: 6px 12px;
      font-weight: 700;
      font-size: 14px;
      border: 2px solid #e2e8f0;
    }
    .collapsible-header[aria-expanded="true"] .chev {
      transform: rotate(180deg);
    }
    .collapsible-header:hover {
      background: #e0e7ff;
    }
    .collapsible-content {
      padding: 20px;
      background: white;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
    .add-button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
    }
    .item-card {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .item-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 12px;
    }
    .delete-button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 6px;
      border-radius: 4px;
      cursor: pointer;
    }
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .emergency-tabs {
        flex-direction: column;
      }
      .emergency-tab {
        min-width: auto;
      }
    }
  `;

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, []);

  const exportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `plan-urgence-${data.nom}-${data.prenom}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const PersonnelSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <User size={24} />
        {t.emergencyPlanning.personal.title}
      </h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.firstName}</label>
          <input
            type="text"
            className="form-input"
            value={data.prenom}
            onChange={(e) => setData({...data, prenom: e.target.value})}
            placeholder="Votre prénom"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.lastName}</label>
          <input
            type="text"
            className="form-input"
            value={data.nom}
            onChange={(e) => setData({...data, nom: e.target.value})}
            placeholder="Votre nom de famille"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.birthDate}</label>
          <input
            type="date"
            className="form-input"
            value={data.dateNaissance}
            onChange={(e) => setData({...data, dateNaissance: e.target.value})}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.phone}</label>
          <input
            type="tel"
            className="form-input"
            value={data.telephone}
            onChange={(e) => setData({...data, telephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.email}</label>
          <input
            type="email"
            className="form-input"
            value={data.courriel}
            onChange={(e) => setData({...data, courriel: e.target.value})}
            placeholder="votre@courriel.com"
          />
        </div>

        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Adresse complète</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.adresse}
            onChange={(e) => setData({...data, adresse: e.target.value})}
            placeholder="Adresse complète avec ville et code postal"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Numéro d'assurance sociale (NAS)</label>
          <input
            type="text"
            className="form-input"
            value={showPasswords ? data.nas : data.nas.replace(/./g, '*')}
            onChange={(e) => setData({...data, nas: e.target.value})}
            placeholder="XXX-XXX-XXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Numéro d'assurance maladie</label>
          <input
            type="text"
            className="form-input"
            value={showPasswords ? data.assuranceMaladie : data.assuranceMaladie.replace(/./g, '*')}
            onChange={(e) => setData({...data, assuranceMaladie: e.target.value})}
            placeholder="XXXX XXXX XX"
          />
        </div>
      </div>
    </div>
  );

  const MedicalSection = () => {
    const addMedicament = () => {
      const newMedicament: Medicament = {
        id: generateId(),
        nom: '',
        dosage: '',
        frequence: '',
        prescripteur: ''
      };
      setData({...data, medicaments: [...data.medicaments, newMedicament]});
    };

    const removeMedicament = (id: string) => {
      setData({...data, medicaments: data.medicaments.filter(m => m.id !== id)});
    };

    return (
      <div className="form-section">
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Heart size={24} />
          Informations médicales
        </h2>
        
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="groupeSanguin">Groupe sanguin</label>
            <select
              id="groupeSanguin"
              title="Sélectionner votre groupe sanguin"
              className="form-input"
              value={data.groupeSanguin}
              onChange={(e) => setData({...data, groupeSanguin: e.target.value})}
            >
              <option value="">Sélectionner</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Allergies connues</label>
            <textarea
              className="form-input"
              style={{minHeight: '60px'}}
              value={data.allergies}
              onChange={(e) => setData({...data, allergies: e.target.value})}
              placeholder="Médicaments, aliments, substances auxquels vous êtes allergique"
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Conditions médicales actuelles</label>
            <textarea
              className="form-input"
              style={{minHeight: '60px'}}
              value={data.conditionsMedicales}
              onChange={(e) => setData({...data, conditionsMedicales: e.target.value})}
              placeholder="Maladies chroniques, conditions médicales importantes"
            />
          </div>
        </div>

        {/* Section Contacts médicaux */}
        <div className="collapsible-section">
          <div
            className="collapsible-header"
            id="contactsMedicauxHeader"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedSections.contactsMedicaux}
            aria-controls="section-contacts-medicaux"
            title="Ouvrir la section Contacts médicaux"
            onClick={() => toggleSection('contactsMedicaux')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('contactsMedicaux')}
          >
            <div className="section-title">
              <Stethoscope size={22} />
              <span>Contacts médicaux</span>
              <span className="collapsible-hint">Cliquez pour compléter</span>
            </div>
            <div className="collapsible-right">
              <span className="badge-info">À compléter</span>
              {expandedSections.contactsMedicaux ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
            </div>
          </div>

          {expandedSections.contactsMedicaux && (
            <div id="section-contacts-medicaux" className="collapsible-content" aria-labelledby="contactsMedicauxHeader">
              <div className="form-grid">
                {/* Médecin de famille */}
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>Médecin de famille</h3>
                </div>
                <div className="form-field">
                  <label className="form-label">Nom du médecin</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.medecinFamilleNom}
                    onChange={(e) => setData({...data, medecinFamilleNom: e.target.value})}
                    placeholder="Dr. Dupont"
                  />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label className="form-label">Adresse de la clinique</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.medecinFamilleAdresse}
                    onChange={(e) => setData({...data, medecinFamilleAdresse: e.target.value})}
                    placeholder="123 rue de la Santé, Ville, QC"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.medecinFamilleTelephone}
                    onChange={(e) => setData({...data, medecinFamilleTelephone: e.target.value})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                {/* Spécialiste 1 */}
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Spécialiste 1</h3>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="specialite1">Spécialité</label>
                  <select
                    id="specialite1"
                    title="Sélectionner une spécialité"
                    className="form-input"
                    value={data.specialiste1Specialite}
                    onChange={(e) => setData({...data, specialiste1Specialite: e.target.value})}
                  >
                    <option value="">Sélectionner une spécialité</option>
                    <option value="Autre">Autre</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Dermatologie">Dermatologie</option>
                    <option value="Endocrinologie">Endocrinologie</option>
                    <option value="Gynécologie">Gynécologie</option>
                    <option value="Neurologie">Neurologie</option>
                    <option value="Oncologie">Oncologie</option>
                    <option value="Ophtalmologie">Ophtalmologie</option>
                    <option value="Orthopédie">Orthopédie</option>
                    <option value="Pneumologie">Pneumologie</option>
                    <option value="Urologie">Urologie</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Nom du spécialiste</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.specialiste1Nom}
                    onChange={(e) => setData({...data, specialiste1Nom: e.target.value})}
                    placeholder="Dr. Martin"
                  />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.specialiste1Adresse}
                    onChange={(e) => setData({...data, specialiste1Adresse: e.target.value})}
                    placeholder="456 avenue des Spécialistes, Ville, QC"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.specialiste1Telephone}
                    onChange={(e) => setData({...data, specialiste1Telephone: e.target.value})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                {/* Spécialiste 2 */}
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Spécialiste 2</h3>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="specialite2">Spécialité</label>
                  <select
                    id="specialite2"
                    title="Sélectionner une spécialité"
                    className="form-input"
                    value={data.specialiste2Specialite}
                    onChange={(e) => setData({...data, specialiste2Specialite: e.target.value})}
                  >
                    <option value="">Sélectionner une spécialité</option>
                    <option value="Autre">Autre</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Dermatologie">Dermatologie</option>
                    <option value="Endocrinologie">Endocrinologie</option>
                    <option value="Gynécologie">Gynécologie</option>
                    <option value="Neurologie">Neurologie</option>
                    <option value="Oncologie">Oncologie</option>
                    <option value="Ophtalmologie">Ophtalmologie</option>
                    <option value="Orthopédie">Orthopédie</option>
                    <option value="Pneumologie">Pneumologie</option>
                    <option value="Urologie">Urologie</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Nom du spécialiste</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.specialiste2Nom}
                    onChange={(e) => setData({...data, specialiste2Nom: e.target.value})}
                    placeholder="Dr. Bernard"
                  />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.specialiste2Adresse}
                    onChange={(e) => setData({...data, specialiste2Adresse: e.target.value})}
                    placeholder="789 boulevard Médical, Ville, QC"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.specialiste2Telephone}
                    onChange={(e) => setData({...data, specialiste2Telephone: e.target.value})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                {/* Spécialiste 3 */}
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Spécialiste 3</h3>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="specialite3">Spécialité</label>
                  <select
                    id="specialite3"
                    title="Sélectionner une spécialité"
                    className="form-input"
                    value={data.specialiste3Specialite}
                    onChange={(e) => setData({...data, specialiste3Specialite: e.target.value})}
                  >
                    <option value="">Sélectionner une spécialité</option>
                    <option value="Autre">Autre</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Dermatologie">Dermatologie</option>
                    <option value="Endocrinologie">Endocrinologie</option>
                    <option value="Gynécologie">Gynécologie</option>
                    <option value="Neurologie">Neurologie</option>
                    <option value="Oncologie">Oncologie</option>
                    <option value="Ophtalmologie">Ophtalmologie</option>
                    <option value="Orthopédie">Orthopédie</option>
                    <option value="Pneumologie">Pneumologie</option>
                    <option value="Urologie">Urologie</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Nom du spécialiste</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.specialiste3Nom}
                    onChange={(e) => setData({...data, specialiste3Nom: e.target.value})}
                    placeholder="Dr. Dubois"
                  />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.specialiste3Adresse}
                    onChange={(e) => setData({...data, specialiste3Adresse: e.target.value})}
                    placeholder="321 rue des Cliniques, Ville, QC"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.specialiste3Telephone}
                    onChange={(e) => setData({...data, specialiste3Telephone: e.target.value})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>

                {/* Dentiste */}
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '24px 0 16px 0'}}>Dentiste</h3>
                </div>
                <div className="form-field">
                  <label className="form-label">Nom du dentiste</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.dentisteNom}
                    onChange={(e) => setData({...data, dentisteNom: e.target.value})}
                    placeholder="Dr. Smith"
                  />
                </div>
                <div className="form-field" style={{gridColumn: 'span 2'}}>
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.dentisteAdresse}
                    onChange={(e) => setData({...data, dentisteAdresse: e.target.value})}
                    placeholder="654 avenue Dentaire, Ville, QC"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.dentisteTelephone}
                    onChange={(e) => setData({...data, dentisteTelephone: e.target.value})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Pharmacie */}
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Pharmacie habituelle</label>
            <input
              type="text"
              className="form-input"
              value={data.pharmacieNom}
              onChange={(e) => setData({...data, pharmacieNom: e.target.value})}
              placeholder="Nom de votre pharmacie"
            />
          </div>

          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label className="form-label">Adresse pharmacie</label>
            <input
              type="text"
              className="form-input"
              value={data.pharmacieAdresse}
              onChange={(e) => setData({...data, pharmacieAdresse: e.target.value})}
              placeholder="Adresse complète de la pharmacie"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Téléphone pharmacie</label>
            <input
              type="tel"
              className="form-input"
              value={data.pharmacieTelephone}
              onChange={(e) => setData({...data, pharmacieTelephone: e.target.value})}
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
        </div>

        {/* Section Médicaments */}
        <div className="collapsible-section">
          <div
            className="collapsible-header"
            id="medicamentsHeader"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedSections.medicaments}
            aria-controls="section-medicaments"
            title="Ouvrir la section Médicaments"
            onClick={() => toggleSection('medicaments')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('medicaments')}
          >
            <div className="section-title">
              <Pill size={22} />
              <span>Médicaments</span>
              <span className="collapsible-hint">Cliquez pour ajouter vos médicaments</span>
            </div>
            <div className="collapsible-right">
              <span className="badge-info">{data.medicaments.length}</span>
              {expandedSections.medicaments ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
            </div>
          </div>
          
          {expandedSections.medicaments && (
            <div id="section-medicaments" className="collapsible-content" aria-labelledby="medicamentsHeader">
              <button className="add-button" onClick={addMedicament}>
                <Plus size={16} />
                Ajouter un médicament
              </button>

              {data.medicaments.map((med) => (
                <div key={med.id} className="item-card">
                  <div className="item-header">
                    <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>{med.nom || 'Nouveau médicament'}</h3>
                    <button
                      className="delete-button"
                      onClick={() => removeMedicament(med.id)}
                      aria-label="Supprimer ce médicament"
                      title="Supprimer ce médicament"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Nom du médicament</label>
                      <input
                        type="text"
                        className="form-input"
                        value={med.nom}
                        onChange={(e) => setData({
                          ...data,
                          medicaments: data.medicaments.map(m =>
                            m.id === med.id ? {...m, nom: e.target.value} : m
                          )
                        })}
                        placeholder="Nom du médicament"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Dosage</label>
                      <input
                        type="text"
                        className="form-input"
                        value={med.dosage}
                        onChange={(e) => setData({
                          ...data,
                          medicaments: data.medicaments.map(m =>
                            m.id === med.id ? {...m, dosage: e.target.value} : m
                          )
                        })}
                        placeholder="Ex: 10mg, 2 comprimés"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Fréquence</label>
                      <input
                        type="text"
                        className="form-input"
                        value={med.frequence}
                        onChange={(e) => setData({
                          ...data,
                          medicaments: data.medicaments.map(m =>
                            m.id === med.id ? {...m, frequence: e.target.value} : m
                          )
                        })}
                        placeholder="Ex: 2x par jour, au besoin"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Prescripteur</label>
                      <input
                        type="text"
                        className="form-input"
                        value={med.prescripteur || ''}
                        onChange={(e) => setData({
                          ...data,
                          medicaments: data.medicaments.map(m =>
                            m.id === med.id ? {...m, prescripteur: e.target.value} : m
                          )
                        })}
                        placeholder="Nom du médecin prescripteur"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dossier médical (section complète) */}
        <div className="collapsible-section">
          <div
            className="collapsible-header"
            id="dossierMedicalHeader"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedSections.dossierMedical}
            aria-controls="section-dossier-medical"
            title="Ouvrir la section Dossier médical"
            onClick={() => toggleSection('dossierMedical')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('dossierMedical')}
          >
            <div className="section-title">
              <FileText size={22} />
              <span>Dossier médical</span>
              <span className="collapsible-hint">Cliquez pour compléter</span>
            </div>
            <div className="collapsible-right">
              <span className="badge-info">Info</span>
              {expandedSections.dossierMedical ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
            </div>
          </div>

          {expandedSections.dossierMedical && (
            <div id="section-dossier-medical" className="collapsible-content" aria-labelledby="dossierMedicalHeader">
              {/* Coordonnées du dossier */}
              <h3>Coordonnées du dossier</h3>
              <div className="form-grid">
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <label className="form-label">Adresse</label>
                  <textarea
                    className="form-input"
                    style={{minHeight: '60px'}}
                    value={data.dossierMedical.adresse}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, adresse: e.target.value}})}
                    placeholder="Adresse complète"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone (domicile)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.dossierMedical.telephoneDomicile}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, telephoneDomicile: e.target.value}})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone (cellulaire)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={data.dossierMedical.telephoneCellulaire}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, telephoneCellulaire: e.target.value}})}
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Courriel</label>
                  <input
                    type="email"
                    className="form-input"
                    value={data.dossierMedical.courriel}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, courriel: e.target.value}})}
                    placeholder="exemple@courriel.com"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Date de naissance</label>
                  <input
                    type="date"
                    className="form-input"
                    value={data.dossierMedical.dateNaissance}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, dateNaissance: e.target.value}})}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Taille</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.dossierMedical.taille}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, taille: e.target.value}})}
                    placeholder="cm ou pi/po"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Poids</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.dossierMedical.poids}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, poids: e.target.value}})}
                    placeholder="kg ou lb"
                  />
                </div>
              </div>

              {/* Sommaire médical */}
              <h3>Sommaire médical</h3>
              <div className="form-grid">
                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <label className="form-label">Conditions médicales actuelles</label>
                  <textarea
                    className="form-input"
                    style={{minHeight: '80px'}}
                    value={data.dossierMedical.sommaireConditions}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, sommaireConditions: e.target.value}})}
                    placeholder="Décrire les conditions"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Hypertension artérielle</label>
                  <select
                    className="form-input"
                    title="Hypertension artérielle"
                    value={data.dossierMedical.hypertension}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, hypertension: e.target.value}})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>
              </div>

              <div className="item-card">
                <h4>Médicaments actuels</h4>
                <button
                  className="add-button"
                  onClick={() => setData({
                    ...data,
                    dossierMedical: {
                      ...data.dossierMedical,
                      medicamentsActuels: [
                        ...data.dossierMedical.medicamentsActuels,
                        { id: generateId(), nom: '', posologie: '', prescritPar: '' }
                      ]
                    }
                  })}
                >
                  <Plus size={16} /> Ajouter un médicament
                </button>
                {data.dossierMedical.medicamentsActuels.map((m, idx) => (
                  <div key={m.id || idx} className="form-grid" style={{marginBottom: '12px'}}>
                    <div className="form-field">
                      <label className="form-label">Nom du médicament</label>
                      <input
                        type="text"
                        className="form-input"
                        value={m.nom}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.medicamentsActuels];
                          list[idx] = {...list[idx], nom: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, medicamentsActuels: list}});
                        }}
                        placeholder="Nom"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Posologie</label>
                      <input
                        type="text"
                        className="form-input"
                        value={m.posologie}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.medicamentsActuels];
                          list[idx] = {...list[idx], posologie: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, medicamentsActuels: list}});
                        }}
                        placeholder="Posologie"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Prescrit par</label>
                      <input
                        type="text"
                        className="form-input"
                        value={m.prescritPar}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.medicamentsActuels];
                          list[idx] = {...list[idx], prescritPar: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, medicamentsActuels: list}});
                        }}
                        placeholder="Nom du prescripteur"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Allergies connues</label>
                <textarea
                  className="form-input"
                  style={{minHeight: '60px'}}
                  value={data.dossierMedical.allergiesConnues}
                  onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, allergiesConnues: e.target.value}})}
                  placeholder="Allergies"
                />
              </div>

              {/* Historique médical chronologique */}
              <h3>Historique médical chronologique</h3>
              <div className="item-card">
                <h4>Interventions chirurgicales</h4>
                <button
                  className="add-button"
                  onClick={() => setData({
                    ...data,
                    dossierMedical: {
                      ...data.dossierMedical,
                      interventionsChirurgicales: [
                        ...data.dossierMedical.interventionsChirurgicales,
                        { id: generateId(), date: '', details: '' }
                      ]
                    }
                  })}
                >
                  <Plus size={16} /> Ajouter une intervention
                </button>
                {data.dossierMedical.interventionsChirurgicales.map((it, idx) => (
                  <div key={it.id || idx} className="form-grid" style={{marginBottom: '12px'}}>
                    <div className="form-field">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={it.date}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.interventionsChirurgicales];
                          list[idx] = {...list[idx], date: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, interventionsChirurgicales: list}});
                        }}
                      />
                    </div>
                    <div className="form-field" style={{gridColumn: 'span 2'}}>
                      <label className="form-label">Détails</label>
                      <input
                        type="text"
                        className="form-input"
                        value={it.details}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.interventionsChirurgicales];
                          list[idx] = {...list[idx], details: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, interventionsChirurgicales: list}});
                        }}
                        placeholder="Détails"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="item-card">
                <h4>Événements médicaux significatifs</h4>
                <button
                  className="add-button"
                  onClick={() => setData({
                    ...data,
                    dossierMedical: {
                      ...data.dossierMedical,
                      evenementsSignificatifs: [
                        ...data.dossierMedical.evenementsSignificatifs,
                        { id: generateId(), date: '', details: '' }
                      ]
                    }
                  })}
                >
                  <Plus size={16} /> Ajouter un événement
                </button>
                {data.dossierMedical.evenementsSignificatifs.map((ev, idx) => (
                  <div key={ev.id || idx} className="form-grid" style={{marginBottom: '12px'}}>
                    <div className="form-field">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={ev.date}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.evenementsSignificatifs];
                          list[idx] = {...list[idx], date: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, evenementsSignificatifs: list}});
                        }}
                      />
                    </div>
                    <div className="form-field" style={{gridColumn: 'span 2'}}>
                      <label className="form-label">Détails</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ev.details}
                        onChange={(e) => {
                          const list = [...data.dossierMedical.evenementsSignificatifs];
                          list[idx] = {...list[idx], details: e.target.value};
                          setData({...data, dossierMedical: {...data.dossierMedical, evenementsSignificatifs: list}});
                        }}
                        placeholder="Détails"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Antécédents familiaux */}
              <h3>Antécédents familiaux</h3>
              <div className="item-card">
                <h4>Parents</h4>
                <div className="form-grid">
                  <div className="form-field" style={{gridColumn: '1 / -1'}}>
                    <h4>Père</h4>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.pere.nom}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, pere: {...data.dossierMedical.antecedentsFamiliaux.pere, nom: e.target.value}}}})}
                      placeholder="Nom"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Date de naissance</label>
                    <input
                      type="date"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.pere.dateNaissance}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, pere: {...data.dossierMedical.antecedentsFamiliaux.pere, dateNaissance: e.target.value}}}})}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Âge actuel</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.pere.ageActuel}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, pere: {...data.dossierMedical.antecedentsFamiliaux.pere, ageActuel: e.target.value}}}})}
                      placeholder="Âge (ans)"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Nom de la maladie</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.pere.maladie}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, pere: {...data.dossierMedical.antecedentsFamiliaux.pere, maladie: e.target.value}}}})}
                      placeholder="Maladie"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Médication</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.pere.medication}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, pere: {...data.dossierMedical.antecedentsFamiliaux.pere, medication: e.target.value}}}})}
                      placeholder="Médication"
                    />
                  </div>

                  <div className="form-field" style={{gridColumn: '1 / -1', marginTop: '8px'}}>
                    <h4>Mère</h4>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.mere.nom}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, mere: {...data.dossierMedical.antecedentsFamiliaux.mere, nom: e.target.value}}}})}
                      placeholder="Nom"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Date de naissance</label>
                    <input
                      type="date"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.mere.dateNaissance}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, mere: {...data.dossierMedical.antecedentsFamiliaux.mere, dateNaissance: e.target.value}}}})}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Âge actuel</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.mere.ageActuel}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, mere: {...data.dossierMedical.antecedentsFamiliaux.mere, ageActuel: e.target.value}}}})}
                      placeholder="Âge (ans)"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Nom de la maladie</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.mere.maladie}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, mere: {...data.dossierMedical.antecedentsFamiliaux.mere, maladie: e.target.value}}}})}
                      placeholder="Maladie"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Médication</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.dossierMedical.antecedentsFamiliaux.mere.medication}
                      onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, mere: {...data.dossierMedical.antecedentsFamiliaux.mere, medication: e.target.value}}}})}
                      placeholder="Médication"
                    />
                  </div>
                </div>

                {/* Sœurs et frères */}
                <div className="item-card" style={{marginTop: '12px'}}>
                  <h4>Sœurs</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        antecedentsFamiliaux: {
                          ...data.dossierMedical.antecedentsFamiliaux,
                          soeurs: [...data.dossierMedical.antecedentsFamiliaux.soeurs, { nom: '', maladie: '', medication: '' }]
                        }
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter une sœur
                  </button>
                  {data.dossierMedical.antecedentsFamiliaux.soeurs.map((s, idx) => (
                    <div key={idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Nom</label>
                        <input
                          type="text"
                          className="form-input"
                          value={s.nom}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.antecedentsFamiliaux.soeurs];
                            arr[idx] = {...arr[idx], nom: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, soeurs: arr}}});
                          }}
                          placeholder="Nom"
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Nom de la maladie</label>
                        <input
                          type="text"
                          className="form-input"
                          value={s.maladie}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.antecedentsFamiliaux.soeurs];
                            arr[idx] = {...arr[idx], maladie: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, soeurs: arr}}});
                          }}
                          placeholder="Maladie"
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Médication</label>
                        <input
                          type="text"
                          className="form-input"
                          value={s.medication}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.antecedentsFamiliaux.soeurs];
                            arr[idx] = {...arr[idx], medication: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, soeurs: arr}}});
                          }}
                          placeholder="Médication"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="item-card" style={{marginTop: '12px'}}>
                  <h4>Frères</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        antecedentsFamiliaux: {
                          ...data.dossierMedical.antecedentsFamiliaux,
                          freres: [...data.dossierMedical.antecedentsFamiliaux.freres, { nom: '', maladie: '', medication: '' }]
                        }
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter un frère
                  </button>
                  {data.dossierMedical.antecedentsFamiliaux.freres.map((f, idx) => (
                    <div key={idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Nom</label>
                        <input
                          type="text"
                          className="form-input"
                          value={f.nom}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.antecedentsFamiliaux.freres];
                            arr[idx] = {...arr[idx], nom: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, freres: arr}}});
                          }}
                          placeholder="Nom"
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Nom de la maladie</label>
                        <input
                          type="text"
                          className="form-input"
                          value={f.maladie}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.antecedentsFamiliaux.freres];
                            arr[idx] = {...arr[idx], maladie: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, freres: arr}}});
                          }}
                          placeholder="Maladie"
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Médication</label>
                        <input
                          type="text"
                          className="form-input"
                          value={f.medication}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.antecedentsFamiliaux.freres];
                            arr[idx] = {...arr[idx], medication: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: {...data.dossierMedical.antecedentsFamiliaux, freres: arr}}});
                          }}
                          placeholder="Médication"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grands-parents */}
                <div className="item-card" style={{marginTop: '12px'}}>
                  <h4>Grands‑parents</h4>
                  <div className="form-grid">
                    {[
                      { key: 'grandPerePaternel', label: 'Grand‑père paternel' },
                      { key: 'grandMerePaternelle', label: 'Grand‑mère paternelle' },
                      { key: 'grandPereMaternel', label: 'Grand‑père maternel' },
                      { key: 'grandMereMaternelle', label: 'Grand‑mère maternelle' }
                    ].map((gp) => (
                      <React.Fragment key={gp.key}>
                        <div className="form-field" style={{gridColumn: '1 / -1'}}>
                          <h4>{gp.label}</h4>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Nom</label>
                          <input
                            type="text"
                            className="form-input"
                            value={(data.dossierMedical.antecedentsFamiliaux as any)[gp.key].nom}
                            onChange={(e) => {
                              const af: any = {...data.dossierMedical.antecedentsFamiliaux};
                              af[gp.key] = {...af[gp.key], nom: e.target.value};
                              setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: af}});
                            }}
                            placeholder="Nom"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Âge au décès</label>
                          <input
                            type="text"
                            className="form-input"
                            value={(data.dossierMedical.antecedentsFamiliaux as any)[gp.key].ageDeces}
                            onChange={(e) => {
                              const af: any = {...data.dossierMedical.antecedentsFamiliaux};
                              af[gp.key] = {...af[gp.key], ageDeces: e.target.value};
                              setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: af}});
                            }}
                            placeholder="Âge (ans)"
                          />
                        </div>
                        <div className="form-field" style={{gridColumn: 'span 2'}}>
                          <label className="form-label">Cause du décès</label>
                          <input
                            type="text"
                            className="form-input"
                            value={(data.dossierMedical.antecedentsFamiliaux as any)[gp.key].causeDeces}
                            onChange={(e) => {
                              const af: any = {...data.dossierMedical.antecedentsFamiliaux};
                              af[gp.key] = {...af[gp.key], causeDeces: e.target.value};
                              setData({...data, dossierMedical: {...data.dossierMedical, antecedentsFamiliaux: af}});
                            }}
                            placeholder="Cause"
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Immunisations et vaccinations */}
                <h3>Immunisations et vaccinations</h3>

                <div className="item-card">
                  <h4>Vaccinations (classiques)</h4>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Coqueluche</label>
                      <input
                        type="date"
                        className="form-input"
                        value={data.dossierMedical.vaccinations.coqueluche}
                        onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, coqueluche: e.target.value}}})}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Diphtérie</label>
                      <input
                        type="date"
                        className="form-input"
                        value={data.dossierMedical.vaccinations.diphterie}
                        onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, diphterie: e.target.value}}})}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Sabin antipoliomyélitique</label>
                      <input
                        type="date"
                        className="form-input"
                        value={data.dossierMedical.vaccinations.sabinAntipolio}
                        onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, sabinAntipolio: e.target.value}}})}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Salk Polio</label>
                      <input
                        type="date"
                        className="form-input"
                        value={data.dossierMedical.vaccinations.salkPolio}
                        onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, salkPolio: e.target.value}}})}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Tétanos</label>
                      <input
                        type="date"
                        className="form-input"
                        value={data.dossierMedical.vaccinations.tetanos}
                        onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, tetanos: e.target.value}}})}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Tuberculose</label>
                      <input
                        type="date"
                        className="form-input"
                        value={data.dossierMedical.vaccinations.tuberculose}
                        onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, tuberculose: e.target.value}}})}
                      />
                    </div>
                  </div>
                </div>

                <div className="item-card">
                  <h4>Autres vaccins</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        vaccinations: {
                          ...data.dossierMedical.vaccinations,
                          autres: [...data.dossierMedical.vaccinations.autres, { id: generateId(), nom: '', dateDose1: '', dateDose2: '' }]
                        }
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter un vaccin
                  </button>
                  {data.dossierMedical.vaccinations.autres.map((v, idx) => (
                    <div key={v.id || idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Nom du vaccin</label>
                        <input
                          type="text"
                          className="form-input"
                          value={v.nom}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.vaccinations.autres];
                            arr[idx] = {...arr[idx], nom: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, autres: arr}}});
                          }}
                          placeholder="Nom du vaccin"
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Date 1re dose</label>
                        <input
                          type="date"
                          className="form-input"
                          value={v.dateDose1}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.vaccinations.autres];
                            arr[idx] = {...arr[idx], dateDose1: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, autres: arr}}});
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Date 2e dose</label>
                        <input
                          type="date"
                          className="form-input"
                          value={v.dateDose2}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.vaccinations.autres];
                            arr[idx] = {...arr[idx], dateDose2: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, autres: arr}}});
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="item-card">
                  <h4>Vaccinations COVID‑19</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        vaccinations: {
                          ...data.dossierMedical.vaccinations,
                          covid19: [...data.dossierMedical.vaccinations.covid19, { id: generateId(), date: '', vaccin: '' }]
                        }
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter une dose COVID‑19
                  </button>
                  {data.dossierMedical.vaccinations.covid19.map((c, idx) => (
                    <div key={c.id || idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={c.date}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.vaccinations.covid19];
                            arr[idx] = {...arr[idx], date: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, covid19: arr}}});
                          }}
                        />
                      </div>
                      <div className="form-field" style={{gridColumn: 'span 2'}}>
                        <label className="form-label">Nom du vaccin</label>
                        <input
                          type="text"
                          className="form-input"
                          value={c.vaccin}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.vaccinations.covid19];
                            arr[idx] = {...arr[idx], vaccin: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, vaccinations: {...data.dossierMedical.vaccinations, covid19: arr}}});
                          }}
                          placeholder="Nom du vaccin"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Examens et consultations spécialisées */}
                <h3>Examens et consultations spécialisées</h3>

                <div className="item-card">
                  <h4>Examens d'imagerie</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        examensConsultations: {
                          ...data.dossierMedical.examensConsultations,
                          imagerie: [...data.dossierMedical.examensConsultations.imagerie, { id: generateId(), date: '', details: '' }]
                        }
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter un examen d'imagerie
                  </button>
                  {data.dossierMedical.examensConsultations.imagerie.map((ex, idx) => (
                    <div key={ex.id || idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={ex.date}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.examensConsultations.imagerie];
                            arr[idx] = {...arr[idx], date: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, examensConsultations: {...data.dossierMedical.examensConsultations, imagerie: arr}}});
                          }}
                        />
                      </div>
                      <div className="form-field" style={{gridColumn: 'span 2'}}>
                        <label className="form-label">Détails</label>
                        <input
                          type="text"
                          className="form-input"
                          value={ex.details}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.examensConsultations.imagerie];
                            arr[idx] = {...arr[idx], details: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, examensConsultations: {...data.dossierMedical.examensConsultations, imagerie: arr}}});
                          }}
                          placeholder="Détails"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="item-card">
                  <h4>Consultations spécialisées</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        examensConsultations: {
                          ...data.dossierMedical.examensConsultations,
                          consultations: [...data.dossierMedical.examensConsultations.consultations, { id: generateId(), date: '', details: '' }]
                        }
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter une consultation
                  </button>
                  {data.dossierMedical.examensConsultations.consultations.map((co, idx) => (
                    <div key={co.id || idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={co.date}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.examensConsultations.consultations];
                            arr[idx] = {...arr[idx], date: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, examensConsultations: {...data.dossierMedical.examensConsultations, consultations: arr}}});
                          }}
                        />
                      </div>
                      <div className="form-field" style={{gridColumn: 'span 2'}}>
                        <label className="form-label">Détails</label>
                        <input
                          type="text"
                          className="form-input"
                          value={co.details}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.examensConsultations.consultations];
                            arr[idx] = {...arr[idx], details: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, examensConsultations: {...data.dossierMedical.examensConsultations, consultations: arr}}});
                          }}
                          placeholder="Détails"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suivis médicaux récents */}
                <h3>Suivis médicaux récents</h3>
                <div className="item-card">
                  <h4>Visites médicales récentes</h4>
                  <button
                    className="add-button"
                    onClick={() => setData({
                      ...data,
                      dossierMedical: {
                        ...data.dossierMedical,
                        suivisRecents: [...data.dossierMedical.suivisRecents, { id: generateId(), date: '', details: '' }]
                      }
                    })}
                  >
                    <Plus size={16} /> Ajouter une visite
                  </button>
                  {data.dossierMedical.suivisRecents.map((sv, idx) => (
                    <div key={sv.id || idx} className="form-grid" style={{marginBottom: '10px'}}>
                      <div className="form-field">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={sv.date}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.suivisRecents];
                            arr[idx] = {...arr[idx], date: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, suivisRecents: arr}});
                          }}
                        />
                      </div>
                      <div className="form-field" style={{gridColumn: 'span 2'}}>
                        <label className="form-label">Détails</label>
                        <input
                          type="text"
                          className="form-input"
                          value={sv.details}
                          onChange={(e) => {
                            const arr = [...data.dossierMedical.suivisRecents];
                            arr[idx] = {...arr[idx], details: e.target.value};
                            setData({...data, dossierMedical: {...data.dossierMedical, suivisRecents: arr}});
                          }}
                          placeholder="Visite médicale – suivi (détails)"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Résumé des rapports médicaux significatifs */}
                <h3>Résumé des rapports médicaux significatifs</h3>
                <div className="form-field">
                  <label className="form-label">Résumé</label>
                  <textarea
                    className="form-input"
                    style={{minHeight: '80px'}}
                    value={data.dossierMedical.resumeRapports}
                    onChange={(e) => setData({...data, dossierMedical: {...data.dossierMedical, resumeRapports: e.target.value}})}
                    placeholder="Ajouter un résumé des rapports importants"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EmploiSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Briefcase size={24} />
        {t.emergencyPlanning.employment.title}
      </h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Nom de l'employeur (entreprise)</label>
          <input
            type="text"
            className="form-input"
            value={data.employeurNom}
            onChange={(e) => setData({...data, employeurNom: e.target.value})}
            placeholder="Nom de votre employeur"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Téléphone employeur</label>
          <input
            type="tel"
            className="form-input"
            value={data.employeurTelephone}
            onChange={(e) => setData({...data, employeurTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Numéro d'employé</label>
          <input
            type="text"
            className="form-input"
            value={data.numeroEmploye}
            onChange={(e) => setData({...data, numeroEmploye: e.target.value})}
            placeholder="Votre numéro d'employé"
          />
        </div>

        <div className="form-field">
          <label className="form-label">RH personne-ressource - Nom</label>
          <input
            type="text"
            className="form-input"
            value={data.rhPersonneRessourceNom}
            onChange={(e) => setData({...data, rhPersonneRessourceNom: e.target.value})}
            placeholder="Nom de la personne aux ressources humaines"
          />
        </div>

        <div className="form-field">
          <label className="form-label">RH personne-ressource - Courriel</label>
          <input
            type="email"
            className="form-input"
            value={data.rhPersonneRessourceCourriel}
            onChange={(e) => setData({...data, rhPersonneRessourceCourriel: e.target.value})}
            placeholder="courriel@entreprise.com"
          />
        </div>

        <div className="form-field">
          <label className="form-label">RH personne-ressource - Téléphone</label>
          <input
            type="tel"
            className="form-input"
            value={data.rhPersonneRessourceTelephone}
            onChange={(e) => setData({...data, rhPersonneRessourceTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Nom du superviseur immédiat</label>
          <input
            type="text"
            className="form-input"
            value={data.superviseurNom}
            onChange={(e) => setData({...data, superviseurNom: e.target.value})}
            placeholder="Nom de votre superviseur"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Courriel du superviseur immédiat</label>
          <input
            type="email"
            className="form-input"
            value={data.superviseurCourriel}
            onChange={(e) => setData({...data, superviseurCourriel: e.target.value})}
            placeholder="courriel@superviseur.com"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Téléphone du superviseur immédiat</label>
          <input
            type="tel"
            className="form-input"
            value={data.superviseurTelephone}
            onChange={(e) => setData({...data, superviseurTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>
      </div>
    </div>
  );

  const ContactsSection = () => {
    const addContact = () => {
      const newContact: Contact = {
        id: generateId(),
        nom: '',
        lienRelation: '',
        telephone: '',
        instructions: '',
        email: '',
        adresse: '',
        estContactUrgence: false
      };
      setData({...data, contactsUrgence: [...data.contactsUrgence, newContact]});
    };

    const removeContact = (id: string) => {
      setData({...data, contactsUrgence: data.contactsUrgence.filter(c => c.id !== id)});
    };

    // Créer 3 contacts d'urgence par défaut s'il n'y en a pas
    const emergencyContacts = data.contactsUrgence.length >= 3
      ? data.contactsUrgence.slice(0, 3)
      : [
          ...data.contactsUrgence,
          ...Array(3 - data.contactsUrgence.length).fill(null).map((_, index) => ({
            id: `contact-${index + 1}`,
            nom: '',
            lienRelation: '',
            telephone: '',
            instructions: '',
            email: '',
            adresse: '',
            estContactUrgence: true
          }))
        ];

    return (
      <div className="form-section">
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Phone size={24} />
          Contacts d'urgence
        </h2>

        {emergencyContacts.map((contact, index) => (
          <div key={contact.id} className="item-card" style={{marginBottom: '20px'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>
              Contact d'urgence {index + 1}
            </h3>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Nom du contact</label>
                <input
                  type="text"
                  className="form-input"
                  value={contact.nom}
                  onChange={(e) => {
                    const updatedContacts = [...data.contactsUrgence];
                    if (updatedContacts[index]) {
                      updatedContacts[index] = {...updatedContacts[index], nom: e.target.value};
                    } else {
                      updatedContacts[index] = {
                        id: contact.id,
                        nom: e.target.value,
                        lienRelation: '',
                        telephone: '',
                        instructions: '',
                        email: '',
                        adresse: '',
                        estContactUrgence: true
                      };
                    }
                    setData({...data, contactsUrgence: updatedContacts});
                  }}
                  placeholder="Nom complet du contact"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Lien/relation</label>
                <input
                  type="text"
                  className="form-input"
                  value={contact.lienRelation}
                  onChange={(e) => {
                    const updatedContacts = [...data.contactsUrgence];
                    if (updatedContacts[index]) {
                      updatedContacts[index] = {...updatedContacts[index], lienRelation: e.target.value};
                    } else {
                      updatedContacts[index] = {
                        id: contact.id,
                        nom: '',
                        lienRelation: e.target.value,
                        telephone: '',
                        instructions: '',
                        email: '',
                        adresse: '',
                        estContactUrgence: true
                      };
                    }
                    setData({...data, contactsUrgence: updatedContacts});
                  }}
                  placeholder="Ex: Conjoint, Enfant, Frère, Ami..."
                />
              </div>

              <div className="form-field">
                <label className="form-label">Numéro de téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contact.telephone}
                  onChange={(e) => {
                    const updatedContacts = [...data.contactsUrgence];
                    if (updatedContacts[index]) {
                      updatedContacts[index] = {...updatedContacts[index], telephone: e.target.value};
                    } else {
                      updatedContacts[index] = {
                        id: contact.id,
                        nom: '',
                        lienRelation: '',
                        telephone: e.target.value,
                        instructions: '',
                        email: '',
                        adresse: '',
                        estContactUrgence: true
                      };
                    }
                    setData({...data, contactsUrgence: updatedContacts});
                  }}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>

              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Instructions (à contacter en cas de...)</label>
                <textarea
                  className="form-input"
                  style={{minHeight: '60px'}}
                  value={contact.instructions}
                  onChange={(e) => {
                    const updatedContacts = [...data.contactsUrgence];
                    if (updatedContacts[index]) {
                      updatedContacts[index] = {...updatedContacts[index], instructions: e.target.value};
                    } else {
                      updatedContacts[index] = {
                        id: contact.id,
                        nom: '',
                        lienRelation: '',
                        telephone: '',
                        instructions: e.target.value,
                        email: '',
                        adresse: '',
                        estContactUrgence: true
                      };
                    }
                    setData({...data, contactsUrgence: updatedContacts});
                  }}
                  placeholder="Ex: Contacter en cas d'urgence médicale, Contacter pour les questions financières, etc."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const FinancesSection = () => {
    // Helpers d'affichage (remplissage minimum requis)
    function padArray<T>(arr: T[], count: number, filler: () => T): T[] {
      return arr.length >= count ? arr.slice(0, count) : [...arr, ...Array(count - arr.length).fill(null).map(filler)];
    }

    const comptes = padArray(data.comptesBancaires, 3, () => ({
      id: `compte-${Date.now()}-${Math.random()}`,
      type: '',
      institution: '',
      numeroCompte: '',
      adresseSuccursale: '',
      coTitulaire: '',
      soldeApproximatif: ''
    }));

    const cartes = padArray(data.cartesCredit || [], 4, () => ({
      id: `carte-${Date.now()}-${Math.random()}`,
      emetteur: '',
      numero4: '',
      soldeApproximatif: ''
    }));

    const prets = (data.pretsPersonnels && data.pretsPersonnels.length
      ? data.pretsPersonnels
      : [{ id: 'pret-1', creancier: '', montant: '', echeance: '' }]) as PretPersonnel[];

    const autresDettes = padArray(data.autresDettes || [], 2, () => ({
      id: `adette-${Date.now()}-${Math.random()}`,
      nom: '',
      contact: '',
      montant: '',
      echeance: ''
    }));

    const padInv = (arr: InvestmentAccount[] | undefined, count: number, prefix: string) =>
      padArray(arr || [], count, () => ({
        id: `${prefix}-${Date.now()}-${Math.random()}`,
        institution: '',
        typeInvestissement: '',
        numeroCompte: '',
        representantNom: '',
        representantContact: ''
      }));

    const reers = padInv(data.reers, 2, 'reer');
    const celis = padInv(data.celis, 2, 'celi');
    const cris = padInv(data.cris, 2, 'cri');
    const ferrs = padInv(data.ferrs, 2, 'ferr');

    const brokers = (data.brokerAccounts && data.brokerAccounts.length
      ? data.brokerAccounts
      : [{ id: 'broker-1', courtier: '', numeroCompte: '', contact: '' }]) as BrokerAccount[];

    return (
      <div className="form-section">
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <DollarSign size={24} />
          Informations financières
        </h2>

        {/* Comptes bancaires */}
        <div style={{marginBottom: '16px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>Comptes bancaires</h3>
          {comptes.map((c, index) => (
            <div key={c.id || index} className="item-card">
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label" htmlFor={`compteType${index}`}>Type</label>
                  <select
                    id={`compteType${index}`}
                    title="Sélectionner un type de compte"
                    className="form-input"
                    value={c.type}
                    onChange={(e) => {
                      const updated = [...data.comptesBancaires];
                      updated[index] = { ...(updated[index] || { id: c.id }), ...c, type: e.target.value };
                      setData({ ...data, comptesBancaires: updated });
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Épargne">Épargne</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Numéro de compte</label>
                  <input
                    type="text"
                    className="form-input"
                    value={c.numeroCompte}
                    onChange={(e) => {
                      const updated = [...data.comptesBancaires];
                      updated[index] = { ...(updated[index] || { id: c.id }), ...c, numeroCompte: e.target.value };
                      setData({ ...data, comptesBancaires: updated });
                    }}
                    placeholder="XXXXXXXXXX"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Banque</label>
                  <input
                    type="text"
                    className="form-input"
                    value={c.institution}
                    onChange={(e) => {
                      const updated = [...data.comptesBancaires];
                      updated[index] = { ...(updated[index] || { id: c.id }), ...c, institution: e.target.value };
                      setData({ ...data, comptesBancaires: updated });
                    }}
                    placeholder="Nom de la banque"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Adresse de la succursale</label>
                  <input
                    type="text"
                    className="form-input"
                    value={c.adresseSuccursale || ''}
                    onChange={(e) => {
                      const updated = [...data.comptesBancaires];
                      updated[index] = { ...(updated[index] || { id: c.id }), ...c, adresseSuccursale: e.target.value };
                      setData({ ...data, comptesBancaires: updated });
                    }}
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="form-field" style={{gridColumn: '1 / -1'}}>
                  <label className="form-label">Personne co-titulaire (si applicable)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={c.coTitulaire || ''}
                    onChange={(e) => {
                      const updated = [...data.comptesBancaires];
                      updated[index] = { ...(updated[index] || { id: c.id }), ...c, coTitulaire: e.target.value };
                      setData({ ...data, comptesBancaires: updated });
                    }}
                    placeholder="Nom complet du co-titulaire"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cartes de crédit */}
        <div style={{marginBottom: '16px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>Cartes de crédit</h3>
          {cartes.map((carte, index) => (
            <div key={carte.id || index} className="item-card">
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Émetteur</label>
                  <input
                    type="text"
                    className="form-input"
                    value={carte.emetteur}
                    onChange={(e) => {
                      const updated = [...(data.cartesCredit || [])];
                      updated[index] = { ...(updated[index] || { id: carte.id }), ...carte, emetteur: e.target.value };
                      setData({ ...data, cartesCredit: updated });
                    }}
                    placeholder="Banque / Émetteur"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Numéro (4 derniers chiffres)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={carte.numero4}
                    onChange={(e) => {
                      const updated = [...(data.cartesCredit || [])];
                      updated[index] = { ...(updated[index] || { id: carte.id }), ...carte, numero4: e.target.value };
                      setData({ ...data, cartesCredit: updated });
                    }}
                    placeholder="1234"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Solde approximatif</label>
                  <input
                    type="text"
                    className="form-input"
                    value={carte.soldeApproximatif || ''}
                    onChange={(e) => {
                      const updated = [...(data.cartesCredit || [])];
                      updated[index] = { ...(updated[index] || { id: carte.id }), ...carte, soldeApproximatif: e.target.value };
                      setData({ ...data, cartesCredit: updated });
                    }}
                    placeholder="0,00 $"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comptes à l'étranger (collapsible) */}
        <div className="collapsible-section">
          <div
            className="collapsible-header"
            id="etrangerHeader"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedSections.financesEtranger}
            aria-controls="section-etranger"
            title="Ouvrir la section Comptes à l'étranger"
            onClick={() => toggleSection('financesEtranger')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('financesEtranger')}
          >
            <div className="section-title">
              <Globe size={22} />
              <span>Comptes à l'étranger (si applicable)</span>
              <span className="collapsible-hint">Cliquez pour compléter</span>
            </div>
            <div className="collapsible-right">
              <span className="badge-info">Info</span>
              {expandedSections.financesEtranger ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
            </div>
          </div>
          {expandedSections.financesEtranger && (
            <div id="section-etranger" className="collapsible-content" aria-labelledby="etrangerHeader">
              <div className="form-field">
                <label className="form-label">Informations</label>
                <textarea
                  className="form-input"
                  style={{minHeight: '80px'}}
                  value={data.comptesEtrangerInfo}
                  onChange={(e) => setData({ ...data, comptesEtrangerInfo: e.target.value })}
                  placeholder="Informations pertinentes sur les comptes détenus à l'étranger"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cryptomonnaies (collapsible) */}
        <div className="collapsible-section">
          <div
            className="collapsible-header"
            id="cryptoHeader"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedSections.financesCrypto}
            aria-controls="section-crypto"
            title="Ouvrir la section Cryptomonnaies"
            onClick={() => toggleSection('financesCrypto')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('financesCrypto')}
          >
            <div className="section-title">
              <Key size={22} />
              <span>Cryptomonnaies (si applicable)</span>
              <span className="collapsible-hint">Cliquez pour compléter</span>
            </div>
            <div className="collapsible-right">
              <span className="badge-info">Info</span>
              {expandedSections.financesCrypto ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
            </div>
          </div>
          {expandedSections.financesCrypto && (
            <div id="section-crypto" className="collapsible-content" aria-labelledby="cryptoHeader">
              <div className="form-field">
                <label className="form-label">Informations</label>
                <textarea
                  className="form-input"
                  style={{minHeight: '80px'}}
                  value={data.cryptomonnaiesInfo}
                  onChange={(e) => setData({ ...data, cryptomonnaiesInfo: e.target.value })}
                  placeholder="Plateformes, portefeuilles, accès sécurisé, etc."
                />
              </div>
            </div>
          )}
        </div>

        {/* Dettes et obligations */}
        <div style={{margin: '16px 0'}}>
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>Dettes et obligations</h3>

          {/* Prêts personnels */}
          <div className="item-card">
            <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Prêts personnels</h4>
            {prets.map((p, index) => (
              <div key={p.id || index} className="form-grid" style={{marginBottom: '12px'}}>
                <div className="form-field">
                  <label className="form-label">Créancier</label>
                  <input
                    type="text"
                    className="form-input"
                    value={p.creancier}
                    onChange={(e) => {
                      const updated = [...prets];
                      updated[index] = { ...(updated[index] || { id: p.id }), ...p, creancier: e.target.value };
                      setData({ ...data, pretsPersonnels: updated });
                    }}
                    placeholder="Nom du créancier"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Montant</label>
                  <input
                    type="text"
                    className="form-input"
                    value={p.montant}
                    onChange={(e) => {
                      const updated = [...prets];
                      updated[index] = { ...(updated[index] || { id: p.id }), ...p, montant: e.target.value };
                      setData({ ...data, pretsPersonnels: updated });
                    }}
                    placeholder="0,00 $"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Échéance</label>
                  <input
                    type="text"
                    className="form-input"
                    value={p.echeance}
                    onChange={(e) => {
                      const updated = [...prets];
                      updated[index] = { ...(updated[index] || { id: p.id }), ...p, echeance: e.target.value };
                      setData({ ...data, pretsPersonnels: updated });
                    }}
                    placeholder="AAAA-MM-JJ ou texte"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Autres dettes (famille, amis) */}
          <div className="item-card" style={{marginTop: '12px'}}>
            <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Autres dettes (famille, amis)</h4>
            {autresDettes.map((d, index) => (
              <div key={d.id || index} className="form-grid" style={{marginBottom: '12px'}}>
                <div className="form-field">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-input"
                    value={d.nom}
                    onChange={(e) => {
                      const updated = [...autresDettes];
                      updated[index] = { ...(updated[index] || { id: d.id }), ...d, nom: e.target.value };
                      setData({ ...data, autresDettes: updated });
                    }}
                    placeholder="Nom de la personne"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Téléphone ou courriel</label>
                  <input
                    type="text"
                    className="form-input"
                    value={d.contact}
                    onChange={(e) => {
                      const updated = [...autresDettes];
                      updated[index] = { ...(updated[index] || { id: d.id }), ...d, contact: e.target.value };
                      setData({ ...data, autresDettes: updated });
                    }}
                    placeholder="(XXX) XXX-XXXX ou courriel"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Montant</label>
                  <input
                    type="text"
                    className="form-input"
                    value={d.montant}
                    onChange={(e) => {
                      const updated = [...autresDettes];
                      updated[index] = { ...(updated[index] || { id: d.id }), ...d, montant: e.target.value };
                      setData({ ...data, autresDettes: updated });
                    }}
                    placeholder="0,00 $"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Échéance</label>
                  <input
                    type="text"
                    className="form-input"
                    value={d.echeance}
                    onChange={(e) => {
                      const updated = [...autresDettes];
                      updated[index] = { ...(updated[index] || { id: d.id }), ...d, echeance: e.target.value };
                      setData({ ...data, autresDettes: updated });
                    }}
                    placeholder="AAAA-MM-JJ ou texte"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investissements (collapsible) */}
        <div className="collapsible-section">
          <div
            className="collapsible-header"
            id="investHeader"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedSections.investissements}
            aria-controls="section-investissements"
            title="Ouvrir la section Investissements"
            onClick={() => toggleSection('investissements')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSection('investissements')}
          >
            <div className="section-title">
              <PiggyBank size={22} />
              <span>Investissements</span>
              <span className="collapsible-hint">Cliquez pour compléter</span>
            </div>
            <div className="collapsible-right">
              <span className="badge-info">Info</span>
              {expandedSections.investissements ? <ChevronDown className="chev" size={24} /> : <ChevronRight className="chev" size={24} />}
            </div>
          </div>

          {expandedSections.investissements && (
            <div id="section-investissements" className="collapsible-content" aria-labelledby="investHeader">
              {/* Immobilier */}
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Investissements immobiliers (parts dans des sociétés) - Informations</label>
                <textarea
                  className="form-input"
                  style={{minHeight: '80px'}}
                  value={data.investissementsImmobiliersInfo}
                  onChange={(e) => setData({ ...data, investissementsImmobiliersInfo: e.target.value })}
                  placeholder="Détails sur les parts détenues, sociétés, coordonnées, etc."
                />
              </div>

              {/* REER */}
              <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>REER</h4>
              {reers.map((acc, index) => (
                <div key={acc.id || index} className="item-card">
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.institution}
                        onChange={(e) => {
                          const updated = [...reers];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                          setData({ ...data, reers: updated });
                        }}
                        placeholder="Institution financière"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Type d'investissement</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.typeInvestissement}
                        onChange={(e) => {
                          const updated = [...reers];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                          setData({ ...data, reers: updated });
                        }}
                        placeholder="FNB, fonds, actions, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Numéro de compte</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.numeroCompte}
                        onChange={(e) => {
                          const updated = [...reers];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                          setData({ ...data, reers: updated });
                        }}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Nom du représentant financier</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantNom}
                        onChange={(e) => {
                          const updated = [...reers];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                          setData({ ...data, reers: updated });
                        }}
                        placeholder="Nom du représentant"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Téléphone / courriel</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantContact}
                        onChange={(e) => {
                          const updated = [...reers];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                          setData({ ...data, reers: updated });
                        }}
                        placeholder="(XXX) XXX-XXXX / courriel"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* CELI */}
              <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>CELI</h4>
              {celis.map((acc, index) => (
                <div key={acc.id || index} className="item-card">
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.institution}
                        onChange={(e) => {
                          const updated = [...celis];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                          setData({ ...data, celis: updated });
                        }}
                        placeholder="Institution financière"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Type d'investissement</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.typeInvestissement}
                        onChange={(e) => {
                          const updated = [...celis];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                          setData({ ...data, celis: updated });
                        }}
                        placeholder="FNB, fonds, actions, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Numéro de compte</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.numeroCompte}
                        onChange={(e) => {
                          const updated = [...celis];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                          setData({ ...data, celis: updated });
                        }}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Nom du représentant financier</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantNom}
                        onChange={(e) => {
                          const updated = [...celis];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                          setData({ ...data, celis: updated });
                        }}
                        placeholder="Nom du représentant"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Téléphone / courriel</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantContact}
                        onChange={(e) => {
                          const updated = [...celis];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                          setData({ ...data, celis: updated });
                        }}
                        placeholder="(XXX) XXX-XXXX / courriel"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* CRI */}
              <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>CRI</h4>
              {cris.map((acc, index) => (
                <div key={acc.id || index} className="item-card">
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.institution}
                        onChange={(e) => {
                          const updated = [...cris];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                          setData({ ...data, cris: updated });
                        }}
                        placeholder="Institution financière"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Type d'investissement</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.typeInvestissement}
                        onChange={(e) => {
                          const updated = [...cris];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                          setData({ ...data, cris: updated });
                        }}
                        placeholder="FNB, fonds, actions, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Numéro de compte</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.numeroCompte}
                        onChange={(e) => {
                          const updated = [...cris];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                          setData({ ...data, cris: updated });
                        }}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Nom du représentant financier</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantNom}
                        onChange={(e) => {
                          const updated = [...cris];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                          setData({ ...data, cris: updated });
                        }}
                        placeholder="Nom du représentant"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Téléphone / courriel</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantContact}
                        onChange={(e) => {
                          const updated = [...cris];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                          setData({ ...data, cris: updated });
                        }}
                        placeholder="(XXX) XXX-XXXX / courriel"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* FERR */}
              <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>FERR</h4>
              {ferrs.map((acc, index) => (
                <div key={acc.id || index} className="item-card">
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.institution}
                        onChange={(e) => {
                          const updated = [...ferrs];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, institution: e.target.value };
                          setData({ ...data, ferrs: updated });
                        }}
                        placeholder="Institution financière"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Type d'investissement</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.typeInvestissement}
                        onChange={(e) => {
                          const updated = [...ferrs];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, typeInvestissement: e.target.value };
                          setData({ ...data, ferrs: updated });
                        }}
                        placeholder="FNB, fonds, actions, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Numéro de compte</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.numeroCompte}
                        onChange={(e) => {
                          const updated = [...ferrs];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, numeroCompte: e.target.value };
                          setData({ ...data, ferrs: updated });
                        }}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Nom du représentant financier</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantNom}
                        onChange={(e) => {
                          const updated = [...ferrs];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantNom: e.target.value };
                          setData({ ...data, ferrs: updated });
                        }}
                        placeholder="Nom du représentant"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Téléphone / courriel</label>
                      <input
                        type="text"
                        className="form-input"
                        value={acc.representantContact}
                        onChange={(e) => {
                          const updated = [...ferrs];
                          updated[index] = { ...(updated[index] || { id: acc.id }), ...acc, representantContact: e.target.value };
                          setData({ ...data, ferrs: updated });
                        }}
                        placeholder="(XXX) XXX-XXXX / courriel"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Actions / obligations */}
              <h4 style={{fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '16px'}}>Actions / obligations</h4>
              {brokers.map((b, index) => (
                <div key={b.id || index} className="item-card">
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Courtier</label>
                      <input
                        type="text"
                        className="form-input"
                        value={b.courtier}
                        onChange={(e) => {
                          const updated = [...brokers];
                          updated[index] = { ...(updated[index] || { id: b.id }), ...b, courtier: e.target.value };
                          setData({ ...data, brokerAccounts: updated });
                        }}
                        placeholder="Nom du courtier"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Numéro de compte</label>
                      <input
                        type="text"
                        className="form-input"
                        value={b.numeroCompte}
                        onChange={(e) => {
                          const updated = [...brokers];
                          updated[index] = { ...(updated[index] || { id: b.id }), ...b, numeroCompte: e.target.value };
                          setData({ ...data, brokerAccounts: updated });
                        }}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Contact</label>
                      <input
                        type="text"
                        className="form-input"
                        value={b.contact}
                        onChange={(e) => {
                          const updated = [...brokers];
                          updated[index] = { ...(updated[index] || { id: b.id }), ...b, contact: e.target.value };
                          setData({ ...data, brokerAccounts: updated });
                        }}
                        placeholder="(XXX) XXX-XXXX / courriel"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const AbonnementsSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Monitor size={24} />
        Abonnements et services
      </h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Fournisseur internet</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nom du fournisseur internet"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Fournisseur téléphone</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nom du fournisseur téléphonique"
          />
        </div>
      </div>
    </div>
  );


  const BiensSection = () => {
    const autresProps = data.autresProprietes || [];
    const autresVeh = data.autresVehicules || [];
    return (
      <div className="form-section">
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Home size={24} />
          Biens et propriétés
        </h2>

        {/* Propriétés */}
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>Propriétés</h3>

        {/* Résidence principale */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Résidence principale</h4>
          <div className="form-grid">
            <div className="form-field" style={{gridColumn: '1 / -1'}}>
              <label className="form-label">Adresse</label>
              <textarea
                className="form-input"
                style={{minHeight: '60px'}}
                value={data.residencePrincipale.adresse}
                onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, adresse: e.target.value}})}
                placeholder="Adresse complète"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Titre de propriété (lieu de conservation)</label>
              <input
                type="text"
                className="form-input"
                value={data.residencePrincipale.titreProprieteLieu}
                onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, titreProprieteLieu: e.target.value}})}
                placeholder="Lieu où se trouve le titre"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de lot cadastral</label>
              <input
                type="text"
                className="form-input"
                value={data.residencePrincipale.lotCadastral}
                onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, lotCadastral: e.target.value}})}
                placeholder="Numéro de lot"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Hypothèque restante</label>
              <select
                className="form-input"
                title="Hypothèque restante"
                value={data.residencePrincipale.hypothequeRestante}
                onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, hypothequeRestante: e.target.value}})}
              >
                <option value="">Sélectionner</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Institution financière</label>
              <input
                type="text"
                className="form-input"
                value={data.residencePrincipale.institutionFinanciere}
                onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, institutionFinanciere: e.target.value}})}
                placeholder="Nom de l'institution"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Solde approximatif</label>
              <input
                type="text"
                className="form-input"
                value={data.residencePrincipale.soldeApproximatif}
                onChange={(e) => setData({...data, residencePrincipale: {...data.residencePrincipale, soldeApproximatif: e.target.value}})}
                placeholder="0,00 $"
              />
            </div>
          </div>
        </div>

        {/* Résidence secondaire / maison à revenu / chalet */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Résidence secondaire / maison à revenu / chalet</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Titre de propriété</label>
              <input
                type="text"
                className="form-input"
                value={data.residenceSecondaire.titrePropriete}
                onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, titrePropriete: e.target.value}})}
                placeholder="Lieu du titre"
              />
            </div>
            <div className="form-field" style={{gridColumn: 'span 2'}}>
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-input"
                value={data.residenceSecondaire.adresse}
                onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, adresse: e.target.value}})}
                placeholder="Adresse complète"
              />
            </div>
            <div className="form-field" style={{gridColumn: '1 / -1'}}>
              <label className="form-label">Détails particuliers</label>
              <textarea
                className="form-input"
                style={{minHeight: '60px'}}
                value={data.residenceSecondaire.detailsParticuliers}
                onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, detailsParticuliers: e.target.value}})}
                placeholder="Informations pertinentes"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Hypothèque restante</label>
              <select
                className="form-input"
                title="Hypothèque restante"
                value={data.residenceSecondaire.hypothequeRestante}
                onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, hypothequeRestante: e.target.value}})}
              >
                <option value="">Sélectionner</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Institution financière</label>
              <input
                type="text"
                className="form-input"
                value={data.residenceSecondaire.institutionFinanciere}
                onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, institutionFinanciere: e.target.value}})}
                placeholder="Nom de l'institution"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Solde approximatif</label>
              <input
                type="text"
                className="form-input"
                value={data.residenceSecondaire.soldeApproximatif}
                onChange={(e) => setData({...data, residenceSecondaire: {...data.residenceSecondaire, soldeApproximatif: e.target.value}})}
                placeholder="0,00 $"
              />
            </div>
          </div>
        </div>

        {/* Autres propriétés */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Autres propriétés</h4>
          {autresProps.map((p, index) => (
            <div key={p.id || index} className="form-grid" style={{marginBottom: '12px'}}>
              <div className="form-field">
                <label className="form-label">Type de propriété</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.typePropriete}
                  onChange={(e) => {
                    const updated = [...autresProps];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, typePropriete: e.target.value };
                    setData({...data, autresProprietes: updated});
                  }}
                  placeholder="Ex: Terrain, Condo, Commerce"
                />
              </div>
              <div className="form-field" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.adresse}
                  onChange={(e) => {
                    const updated = [...autresProps];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, adresse: e.target.value };
                    setData({...data, autresProprietes: updated});
                  }}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="form-field" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Détails</label>
                <textarea
                  className="form-input"
                  style={{minHeight: '60px'}}
                  value={p.details}
                  onChange={(e) => {
                    const updated = [...autresProps];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, details: e.target.value };
                    setData({...data, autresProprietes: updated});
                  }}
                  placeholder="Informations pertinentes"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Hypothèque restante</label>
                <select
                  className="form-input"
                  title="Hypothèque restante"
                  value={p.hypothequeRestante}
                  onChange={(e) => {
                    const updated = [...autresProps];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, hypothequeRestante: e.target.value };
                    setData({...data, autresProprietes: updated});
                  }}
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Institution financière</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.institutionFinanciere}
                  onChange={(e) => {
                    const updated = [...autresProps];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, institutionFinanciere: e.target.value };
                    setData({...data, autresProprietes: updated});
                  }}
                  placeholder="Nom de l'institution"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Solde approximatif</label>
                <input
                  type="text"
                  className="form-input"
                  value={p.soldeApproximatif}
                  onChange={(e) => {
                    const updated = [...autresProps];
                    updated[index] = { ...(updated[index] || { id: p.id }), ...p, soldeApproximatif: e.target.value };
                    setData({...data, autresProprietes: updated});
                  }}
                  placeholder="0,00 $"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Biens entreposés - Entrepôt / garde-meuble */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Biens entreposés (Entrepôt / garde-meuble)</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nom de l’entreprise</label>
              <input
                type="text"
                className="form-input"
                value={data.gardeMeuble.nomEntreprise}
                onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, nomEntreprise: e.target.value}})}
                placeholder="Nom de l’entreprise"
              />
            </div>
            <div className="form-field" style={{gridColumn: 'span 2'}}>
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-input"
                value={data.gardeMeuble.adresse}
                onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, adresse: e.target.value}})}
                placeholder="Adresse complète"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro du local / unité</label>
              <input
                type="text"
                className="form-input"
                value={data.gardeMeuble.numeroLocal}
                onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, numeroLocal: e.target.value}})}
                placeholder="Numéro du local"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Code d’accès / lieu de la clé</label>
              <input
                type="text"
                className="form-input"
                value={data.gardeMeuble.codeAccesLieuCle}
                onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, codeAccesLieuCle: e.target.value}})}
                placeholder="Code ou endroit de la clé"
              />
            </div>
            <div className="form-field" style={{gridColumn: '1 / -1'}}>
              <label className="form-label">Liste du contenu principal</label>
              <textarea
                className="form-input"
                style={{minHeight: '80px'}}
                value={data.gardeMeuble.listeContenu}
                onChange={(e) => setData({...data, gardeMeuble: {...data.gardeMeuble, listeContenu: e.target.value}})}
                placeholder="Liste des biens entreposés"
              />
            </div>
          </div>
        </div>

        {/* Véhicules */}
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: '16px 0 12px'}}>Véhicules</h3>

        {/* Véhicule principal */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Véhicule principal</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Marque / modèle / année</label>
              <input
                type="text"
                className="form-input"
                value={data.vehiculePrincipal.marqueModeleAnnee}
                onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, marqueModeleAnnee: e.target.value}})}
                placeholder="Ex: Toyota RAV4 2020"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro d’immatriculation</label>
              <input
                type="text"
                className="form-input"
                value={data.vehiculePrincipal.immatriculation}
                onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, immatriculation: e.target.value}})}
                placeholder="Numéro d’immatriculation"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Certificat de propriété (lieu)</label>
              <input
                type="text"
                className="form-input"
                value={data.vehiculePrincipal.certificatLieu}
                onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, certificatLieu: e.target.value}})}
                placeholder="Lieu du certificat"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Lieu des clés</label>
              <input
                type="text"
                className="form-input"
                value={data.vehiculePrincipal.lieuCles}
                onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, lieuCles: e.target.value}})}
                placeholder="Où sont les clés"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Financement restant</label>
              <select
                className="form-input"
                title="Financement restant"
                value={data.vehiculePrincipal.financementRestant}
                onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, financementRestant: e.target.value}})}
              >
                <option value="">Sélectionner</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Institution</label>
              <input
                type="text"
                className="form-input"
                value={data.vehiculePrincipal.institution}
                onChange={(e) => setData({...data, vehiculePrincipal: {...data.vehiculePrincipal, institution: e.target.value}})}
                placeholder="Nom de l’institution"
              />
            </div>
          </div>
        </div>

        {/* Autres véhicules (roulotte, bateau, …) */}
        <div className="item-card">
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Autres véhicules (roulotte, bateau, …)</h4>
          {autresVeh.map((v, index) => (
            <div key={v.id || index} className="form-grid" style={{marginBottom: '12px'}}>
              <div className="form-field">
                <label className="form-label">Marque / modèle / année</label>
                <input
                  type="text"
                  className="form-input"
                  value={v.marqueModeleAnnee}
                  onChange={(e) => {
                    const updated = [...autresVeh];
                    updated[index] = { ...(updated[index] || { id: v.id }), ...v, marqueModeleAnnee: e.target.value };
                    setData({...data, autresVehicules: updated});
                  }}
                  placeholder="Ex: Yamaha 242X 2019"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Numéro d’immatriculation</label>
                <input
                  type="text"
                  className="form-input"
                  value={v.immatriculation}
                  onChange={(e) => {
                    const updated = [...autresVeh];
                    updated[index] = { ...(updated[index] || { id: v.id }), ...v, immatriculation: e.target.value };
                    setData({...data, autresVehicules: updated});
                  }}
                  placeholder="Numéro d’immatriculation"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Certificat de propriété (lieu)</label>
                <input
                  type="text"
                  className="form-input"
                  value={v.certificatLieu}
                  onChange={(e) => {
                    const updated = [...autresVeh];
                    updated[index] = { ...(updated[index] || { id: v.id }), ...v, certificatLieu: e.target.value };
                    setData({...data, autresVehicules: updated});
                  }}
                  placeholder="Lieu du certificat"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Lieu des clés</label>
                <input
                  type="text"
                  className="form-input"
                  value={v.lieuCles}
                  onChange={(e) => {
                    const updated = [...autresVeh];
                    updated[index] = { ...(updated[index] || { id: v.id }), ...v, lieuCles: e.target.value };
                    setData({...data, autresVehicules: updated});
                  }}
                  placeholder="Où sont les clés"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Financement restant</label>
                <select
                  className="form-input"
                  title="Financement restant"
                  value={v.financementRestant}
                  onChange={(e) => {
                    const updated = [...autresVeh];
                    updated[index] = { ...(updated[index] || { id: v.id }), ...v, financementRestant: e.target.value };
                    setData({...data, autresVehicules: updated});
                  }}
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Institution</label>
                <input
                  type="text"
                  className="form-input"
                  value={v.institution}
                  onChange={(e) => {
                    const updated = [...autresVeh];
                    updated[index] = { ...(updated[index] || { id: v.id }), ...v, institution: e.target.value };
                    setData({...data, autresVehicules: updated});
                  }}
                  placeholder="Nom de l’institution"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ServicesSection = () => {
    // utilitaires
    function ensureRows<T>(arr: T[], min: number, factory: () => T): T[] {
      return arr.length >= min ? arr : [...arr, ...Array(min - arr.length).fill(null).map(factory)];
    }

    const subscriptionsDivers = ensureRows(data.subscriptionsDivers || [], 2, () => ({
      id: `srv-${Date.now()}-${Math.random()}`,
      service: '',
      username: '',
      numeroCompte: ''
    }));

    const autresAbonnements = ensureRows(data.autresAbonnements || [], 3, () => ({
      id: `autre-${Date.now()}-${Math.random()}`,
      service: '',
      username: '',
      numeroCompte: ''
    }));

    return (
      <div className="form-section">
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Monitor size={24} />
          Services et abonnements
        </h2>

        {/* Comptes en ligne et abonnements */}
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>Comptes en ligne et abonnements</h3>

        {/* Cellulaire */}
        <div className="item-card" style={{marginBottom: '12px'}}>
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Cellulaire</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Fournisseur</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomCellulaire.fournisseur}
                onChange={(e) => setData({...data, telecomCellulaire: {...data.telecomCellulaire, fournisseur: e.target.value}})}
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={data.telecomCellulaire.numeroTelephone || ''}
                onChange={(e) => setData({...data, telecomCellulaire: {...data.telecomCellulaire, numeroTelephone: e.target.value}})}
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomCellulaire.numeroCompte}
                onChange={(e) => setData({...data, telecomCellulaire: {...data.telecomCellulaire, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Téléphone */}
        <div className="item-card" style={{marginBottom: '12px'}}>
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Téléphone</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Fournisseur</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomTelephone.fournisseur}
                onChange={(e) => setData({...data, telecomTelephone: {...data.telecomTelephone, fournisseur: e.target.value}})}
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={data.telecomTelephone.numeroTelephone || ''}
                onChange={(e) => setData({...data, telecomTelephone: {...data.telecomTelephone, numeroTelephone: e.target.value}})}
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomTelephone.numeroCompte}
                onChange={(e) => setData({...data, telecomTelephone: {...data.telecomTelephone, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Internet */}
        <div className="item-card" style={{marginBottom: '12px'}}>
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Internet</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Fournisseur</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomInternet.fournisseur}
                onChange={(e) => setData({...data, telecomInternet: {...data.telecomInternet, fournisseur: e.target.value}})}
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomInternet.numeroCompte}
                onChange={(e) => setData({...data, telecomInternet: {...data.telecomInternet, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Télévision / Câblodistributeur */}
        <div className="item-card" style={{marginBottom: '12px'}}>
          <h4 style={{margin: 0, marginBottom: '12px', fontSize: '16px', fontWeight: 600}}>Télévision / Câblodistributeur</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Fournisseur</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomTelevision.fournisseur}
                onChange={(e) => setData({...data, telecomTelevision: {...data.telecomTelevision, fournisseur: e.target.value}})}
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.telecomTelevision.numeroCompte}
                onChange={(e) => setData({...data, telecomTelevision: {...data.telecomTelevision, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Abonnements récurrents */}
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: '16px 0 12px'}}>Abonnements récurrents</h3>

        {/* Amazon Prime */}
        <div className="item-card" style={{marginBottom: '8px'}}>
          <h4 style={{margin: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 600}}>Amazon Prime</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nom de l’utilisateur</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionAmazon.username}
                onChange={(e) => setData({...data, subscriptionAmazon: {...data.subscriptionAmazon, username: e.target.value}})}
                placeholder="Adresse courriel ou identifiant"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionAmazon.numeroCompte}
                onChange={(e) => setData({...data, subscriptionAmazon: {...data.subscriptionAmazon, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Netflix */}
        <div className="item-card" style={{marginBottom: '8px'}}>
          <h4 style={{margin: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 600}}>Netflix</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nom de l’utilisateur</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionNetflix.username}
                onChange={(e) => setData({...data, subscriptionNetflix: {...data.subscriptionNetflix, username: e.target.value}})}
                placeholder="Adresse courriel ou identifiant"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionNetflix.numeroCompte}
                onChange={(e) => setData({...data, subscriptionNetflix: {...data.subscriptionNetflix, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Spotify */}
        <div className="item-card" style={{marginBottom: '8px'}}>
          <h4 style={{margin: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 600}}>Spotify</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Nom de l’utilisateur</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionSpotify.username}
                onChange={(e) => setData({...data, subscriptionSpotify: {...data.subscriptionSpotify, username: e.target.value}})}
                placeholder="Adresse courriel ou identifiant"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionSpotify.numeroCompte}
                onChange={(e) => setData({...data, subscriptionSpotify: {...data.subscriptionSpotify, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Gym */}
        <div className="item-card" style={{marginBottom: '8px'}}>
          <h4 style={{margin: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 600}}>Gym</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Fournisseur</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionGym.fournisseur}
                onChange={(e) => setData({...data, subscriptionGym: {...data.subscriptionGym, fournisseur: e.target.value}})}
                placeholder="Nom du gym"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Nom de l’utilisateur</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionGym.username}
                onChange={(e) => setData({...data, subscriptionGym: {...data.subscriptionGym, username: e.target.value}})}
                placeholder="Adresse courriel ou identifiant"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Numéro de compte</label>
              <input
                type="text"
                className="form-input"
                value={data.subscriptionGym.numeroCompte}
                onChange={(e) => setData({...data, subscriptionGym: {...data.subscriptionGym, numeroCompte: e.target.value}})}
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Services (divers) */}
        {subscriptionsDivers.map((s, index) => (
          <div key={s.id || index} className="item-card" style={{marginBottom: '8px'}}>
            <h4 style={{margin: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 600}}>Service</h4>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Nom du service</label>
                <input
                  type="text"
                  className="form-input"
                  value={s.service}
                  onChange={(e) => {
                    const updated = [...subscriptionsDivers];
                    updated[index] = { ...(updated[index] || { id: s.id }), ...s, service: e.target.value };
                    setData({ ...data, subscriptionsDivers: updated });
                  }}
                  placeholder="Ex: Service en ligne"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Nom de l’utilisateur</label>
                <input
                  type="text"
                  className="form-input"
                  value={s.username}
                  onChange={(e) => {
                    const updated = [...subscriptionsDivers];
                    updated[index] = { ...(updated[index] || { id: s.id }), ...s, username: e.target.value };
                    setData({ ...data, subscriptionsDivers: updated });
                  }}
                  placeholder="Adresse courriel ou identifiant"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Numéro de compte</label>
                <input
                  type="text"
                  className="form-input"
                  value={s.numeroCompte}
                  onChange={(e) => {
                    const updated = [...subscriptionsDivers];
                    updated[index] = { ...(updated[index] || { id: s.id }), ...s, numeroCompte: e.target.value };
                    setData({ ...data, subscriptionsDivers: updated });
                  }}
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Autres abonnements / Services supplémentaires */}
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: '16px 0 12px'}}>Autres abonnements / Services</h3>
        {autresAbonnements.map((s, index) => (
          <div key={s.id || index} className="item-card" style={{marginBottom: '8px'}}>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Service</label>
                <input
                  type="text"
                  className="form-input"
                  value={s.service}
                  onChange={(e) => {
                    const updated = [...autresAbonnements];
                    updated[index] = { ...(updated[index] || { id: s.id }), ...s, service: e.target.value };
                    setData({ ...data, autresAbonnements: updated });
                  }}
                  placeholder="Ex: Ancestry, Adobe Cloud, CAA Québec, Dropbox, Protégez-vous"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Nom de l’utilisateur</label>
                <input
                  type="text"
                  className="form-input"
                  value={s.username}
                  onChange={(e) => {
                    const updated = [...autresAbonnements];
                    updated[index] = { ...(updated[index] || { id: s.id }), ...s, username: e.target.value };
                    setData({ ...data, autresAbonnements: updated });
                  }}
                  placeholder="Adresse courriel ou identifiant"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Numéro de compte</label>
                <input
                  type="text"
                  className="form-input"
                  value={s.numeroCompte}
                  onChange={(e) => {
                    const updated = [...autresAbonnements];
                    updated[index] = { ...(updated[index] || { id: s.id }), ...s, numeroCompte: e.target.value };
                    setData({ ...data, autresAbonnements: updated });
                  }}
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Programmes de loyauté */}
        <div className="programmes-loyaute">
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: '16px 0 12px'}}>Programmes de loyauté</h3>
          {data.programmesLoyaute.map((p, index) => (
            <div key={p.id || index} className="item-card" style={{marginBottom: '8px'}}>
              <h4 style={{margin: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 600}}>{p.programme}</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Adresse courriel</label>
                  <input
                    type="email"
                    className="form-input"
                    value={p.courriel}
                    onChange={(e) => {
                      const updated = [...data.programmesLoyaute];
                      updated[index] = { ...(updated[index] || { id: p.id }), ...p, courriel: e.target.value };
                      setData({ ...data, programmesLoyaute: updated });
                    }}
                    placeholder="exemple@courriel.com"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="text"
                    className="form-input"
                    value={p.motDePasse}
                    onChange={(e) => {
                      const updated = [...data.programmesLoyaute];
                      updated[index] = { ...(updated[index] || { id: p.id }), ...p, motDePasse: e.target.value };
                      setData({ ...data, programmesLoyaute: updated });
                    }}
                    placeholder="Mot de passe"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Numéro de compte</label>
                  <input
                    type="text"
                    className="form-input"
                    value={p.numeroCompte}
                    onChange={(e) => {
                      const updated = [...data.programmesLoyaute];
                      updated[index] = { ...(updated[index] || { id: p.id }), ...p, numeroCompte: e.target.value };
                      setData({ ...data, programmesLoyaute: updated });
                    }}
                    placeholder="XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
 
      </div>
    );
  };
 
  const NumeriqueSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Smartphone size={24} />
        Accès numérique
      </h2>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Gestionnaire de mots de passe</label>
          <input
            type="text"
            className="form-input"
            value={data.gestionnaireMDP}
            onChange={(e) => setData({...data, gestionnaireMDP: e.target.value})}
            placeholder="Ex: 1Password, LastPass, Bitwarden"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Mot de passe principal</label>
          <input
            type="text"
            className="form-input"
            value={showPasswords ? data.motDePassePrincipal : data.motDePassePrincipal.replace(/./g, '*')}
            onChange={(e) => setData({...data, motDePassePrincipal: e.target.value})}
            placeholder="Mot de passe maître"
          />
        </div>
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <FileText size={24} />
        Documents importants
      </h2>
      <div className="form-grid">
        {data.documentsChecklist.map((doc) => (
          <div key={doc.id} className="form-field">
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                type="checkbox"
                checked={doc.possede}
                onChange={(e) => setData({
                  ...data,
                  documentsChecklist: data.documentsChecklist.map(d =>
                    d.id === doc.id ? {...d, possede: e.target.checked} : d
                  )
                })}
              />
              <span>{doc.nom}</span>
            </label>
            {doc.possede && (
              <input
                type="text"
                className="form-input"
                style={{marginTop: '8px'}}
                value={doc.emplacement}
                onChange={(e) => setData({
                  ...data,
                  documentsChecklist: data.documentsChecklist.map(d =>
                    d.id === doc.id ? {...d, emplacement: e.target.value} : d
                  )
                })}
                placeholder="Emplacement du document"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const TestamentSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <FileCheck size={24} />
        Testament et succession
      </h2>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Emplacement du testament</label>
          <input
            type="text"
            className="form-input"
            value={data.testamentEmplacement}
            onChange={(e) => setData({...data, testamentEmplacement: e.target.value})}
            placeholder="Où se trouve votre testament"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Exécuteur testamentaire</label>
          <input
            type="text"
            className="form-input"
            value={data.executeurNom}
            onChange={(e) => setData({...data, executeurNom: e.target.value})}
            placeholder="Nom de l'exécuteur"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Téléphone exécuteur</label>
          <input
            type="tel"
            className="form-input"
            value={data.executeurTelephone}
            onChange={(e) => setData({...data, executeurTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Nom du notaire</label>
          <input
            type="text"
            className="form-input"
            value={data.notaireNom}
            onChange={(e) => setData({...data, notaireNom: e.target.value})}
            placeholder="Nom complet du notaire"
          />
        </div>

        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Adresse du notaire</label>
          <textarea
            className="form-input"
            style={{minHeight: '60px', resize: 'vertical'}}
            value={data.notaireAdresse}
            onChange={(e) => setData({...data, notaireAdresse: e.target.value})}
            placeholder="Adresse complète du bureau du notaire"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Téléphone du notaire</label>
          <input
            type="tel"
            className="form-input"
            value={data.notaireTelephone}
            onChange={(e) => setData({...data, notaireTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Numéro de minute du testament</label>
          <input
            type="text"
            className="form-input"
            value={data.numeroMinuteTestament}
            onChange={(e) => setData({...data, numeroMinuteTestament: e.target.value})}
            placeholder="Numéro de référence du testament"
          />
        </div>
      </div>
    </div>
  );

  const VerificationSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <CheckCircle size={24} />
        Liste de vérification
      </h2>
      <div style={{fontSize: '16px', marginBottom: '20px'}}>
        <p>Tâches importantes pour vos proches en cas d'urgence :</p>
        <ul style={{paddingLeft: '20px', marginTop: '10px'}}>
          <li>• Contacter l'employeur</li>
          <li>• Contacter l'exécuteur testamentaire</li>
          <li>• Obtenir des copies du certificat de décès</li>
          <li>• Contacter les institutions financières</li>
          <li>• Aviser les compagnies d'assurance</li>
          <li>• Annuler les abonnements et services</li>
        </ul>
      </div>
    </div>
  );

  const InstructionsSection = () => (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <FileCheck size={24} />
        Instructions spéciales
      </h2>
      
      <div className="form-field">
        <label className="form-label">Instructions pour la famille</label>
        <textarea
          className="form-input"
          style={{minHeight: '120px', resize: 'vertical'}}
          placeholder="Instructions spéciales pour votre famille en cas d'urgence..."
        />
      </div>
    </div>
  );

  return (
    <div className="emergency-planning-container">
      {/* En-tête */}
      <div className="emergency-header">
        <h1>
          <Shield size={32} />
          {t.emergencyPlanning.title}
        </h1>
        <p style={{fontSize: '16px', opacity: 0.9, margin: '8px 0 0 0'}}>
          {t.emergencyPlanning.subtitle}
        </p>
      </div>

      {/* Barre d'outils */}
      <div className="emergency-toolbar">
        <button className="btn btn-primary" onClick={() => setData({...data, dateMAJ: new Date().toISOString().split('T')[0]})}>
          <Save size={16} />
          {t.emergencyPlanning.save}
        </button>
        
        <button className="btn btn-secondary" onClick={exportJSON}>
          <Download size={16} />
          {t.emergencyPlanning.exportJson}
        </button>

        <button 
          className="btn btn-secondary"
          onClick={() => setShowPasswords(!showPasswords)}
        >
          {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPasswords ? t.emergencyPlanning.hidePasswords : t.emergencyPlanning.showPasswords}
        </button>

        <button className="btn btn-secondary" onClick={() => window.print()}>
          <Printer size={16} />
          {t.emergencyPlanning.print}
        </button>
      </div>

      {/* Onglets de navigation */}
      <div className="emergency-tabs">
        <button 
          className={`emergency-tab ${activeTab === 'personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnel')}
        >
          <User size={18} />
          {t.emergencyPlanning.tabs.personal}
        </button>
        
        <button 
          className={`emergency-tab ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          <Heart size={18} />
          {t.emergencyPlanning.tabs.medical}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'emploi' ? 'active' : ''}`}
          onClick={() => setActiveTab('emploi')}
        >
          <Briefcase size={18} />
          {t.emergencyPlanning.tabs.employment}
        </button>
        
        <button 
          className={`emergency-tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <Phone size={18} />
          {t.emergencyPlanning.tabs.contacts}
        </button>
        

        <button 
          className={`emergency-tab ${activeTab === 'finances' ? 'active' : ''}`}
          onClick={() => setActiveTab('finances')}
        >
          <DollarSign size={18} />
          {t.emergencyPlanning.tabs.finances}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'biens' ? 'active' : ''}`}
          onClick={() => setActiveTab('biens')}
        >
          <Home size={18} />
          {t.emergencyPlanning.tabs.assets}
        </button>
        <div className="tab-break" aria-hidden="true"></div>

        <button 
          className={`emergency-tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={18} />
          {t.emergencyPlanning.tabs.documents}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'instructions' ? 'active' : ''}`}
          onClick={() => setActiveTab('instructions')}
        >
          <Info size={18} />
          {t.emergencyPlanning.tabs.instructions}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'numerique' ? 'active' : ''}`}
          onClick={() => setActiveTab('numerique')}
        >
          <Smartphone size={18} />
          {t.emergencyPlanning.tabs.digital}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <Monitor size={18} />
          {t.emergencyPlanning.tabs.services}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'testament' ? 'active' : ''}`}
          onClick={() => setActiveTab('testament')}
        >
          <FileCheck size={18} />
          {t.emergencyPlanning.tabs.testament}
        </button>

        <button 
          className={`emergency-tab ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <CheckCircle size={18} />
          {t.emergencyPlanning.tabs.verification}
        </button>
      </div>

      {/* Contenu des sections */}
      {activeTab === 'personnel' && <PersonnelSection />}
      {activeTab === 'medical' && <MedicalSection />}
      {activeTab === 'emploi' && <EmploiSection />}
      {activeTab === 'contacts' && <ContactsSection />}
      {activeTab === 'finances' && <FinancesSection />}
      {activeTab === 'biens' && <BiensSection />}
      {activeTab === 'services' && <ServicesSection />}
      {activeTab === 'numerique' && <NumeriqueSection />}
      {activeTab === 'documents' && <DocumentsSection />}
      {activeTab === 'testament' && <TestamentSection />}
      {activeTab === 'verification' && <VerificationSection />}
      {activeTab === 'instructions' && <InstructionsSection />}

      {/* Footer */}
      <div style={{
        marginTop: '40px', 
        padding: '20px', 
        background: '#f3f4f6', 
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <p><strong>{t.emergencyPlanning.footer.important}:</strong> {t.emergencyPlanning.footer.sensitiveInfo}</p>
        <p>{t.emergencyPlanning.footer.keepSafe}</p>
        <p>{t.emergencyPlanning.footer.lastUpdate}: {data.dateMAJ} | {t.emergencyPlanning.footer.version}: {data.versionDocument}</p>
      </div>
    </div>
  );
};

export default PlanificationUrgence;
