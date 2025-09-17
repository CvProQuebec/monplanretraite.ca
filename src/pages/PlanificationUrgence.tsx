import React, { useState, useEffect } from 'react';
import { 
  Save, Download, Upload, FileText, Eye, EyeOff, Shield, Printer,
  Phone, Heart, Home, Car, CreditCard, Building, Users,
  Monitor, Key, Lock, AlertTriangle, CheckCircle,
  Info, User, Mail, MapPin, Briefcase, PiggyBank, FileCheck,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import '../styles/emergency-planning-complete.css';
import { 
  PersonnelSection, 
  MedicalSection, 
  ContactsSection, 
  EmploiSection,
  FinancesSection,
  BiensSection,
  ServicesSection,
  DocumentsSection,
  TestamentSection,
  InstructionsSection,
  EmergencyData 
} from '@/components/emergency-planning';

// Type pour les onglets actifs
type ActiveTab = 'personnel' | 'medical' | 'emploi' | 'contacts' | 'finances' | 
                 'biens' | 'services' | 'documents' | 'testament' | 'instructions';

const PlanificationUrgence: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('personnel');
  const [showPasswords, setShowPasswords] = useState(false);
  
  // États pour les sections pliables
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // État initial des données
  const [data, setData] = useState<EmergencyData>({
    // Personnel
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
    contactUrgenceNom: '',
    contactUrgenceTelephone: '',

    // Médical
    groupeSanguin: '',
    contactsMedicaux: [],
    medicaments: [],
    dossierMedical: {
      adresse: '',
      telephoneDomicile: '',
      telephoneCellulaire: '',
      courriel: '',
      dateNaissance: '',
      taille: '',
      poids: '',
      groupeSanguin: '',
      allergies: '',
      conditionsMedicales: '',
      medicamentsActuels: [],
      antecedentsPersonnels: [],
      antecedentsParents: [],
      antecedentsGrandParents: [],
      vaccinCovid: [],
      autresVaccins: [],
      examensSuivis: [],
      rapportsMedicaux: []
    },

    // Contacts médicaux structurés (depuis le fichier de sauvegarde)
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
    pharmacieNom: '',
    pharmacieAdresse: '',
    pharmacieTelephone: '',

    // Emploi
    employeur: '',
    employeurTelephone: '',
    numeroEmploye: '',
    adresseTravail: '',
    poste: '',
    departement: '',
    rhContactNom: '',
    rhContactCourriel: '',
    rhContactTelephone: '',
    superviseur: '',
    superviseurCourriel: '',
    superviseurTelephone: '',
    avantagesSociaux: '',
    instructionsEmployeur: '',
    dateDebutEmploi: '',
    salaireAnnuel: '',
    joursVacances: '',

    // Contacts
    contacts: [],
    contact1Nom: '',
    contact1LienRelation: '',
    contact1Telephone: '',
    contact1Instructions: '',
    contact2Nom: '',
    contact2LienRelation: '',
    contact2Telephone: '',
    contact2Instructions: '',
    contact3Nom: '',
    contact3LienRelation: '',
    contact3Telephone: '',
    contact3Instructions: '',

    // Finances
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

    // Biens
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
    autresProprietes: [],
    gardeMeuble: {
      nomEntreprise: '',
      adresse: '',
      numeroLocal: '',
      codeAccesLieuCle: '',
      listeContenu: ''
    },
    vehiculePrincipal: {
      id: 'vehicule-principal',
      marqueModeleAnnee: '',
      immatriculation: '',
      certificatLieu: '',
      lieuCles: '',
      financementRestant: '',
      institution: ''
    },
    autresVehicules: [],

    // Services (structure de base - à développer)
    telecom: {
      fournisseur: '',
      numeroTelephone: '',
      numeroCompte: ''
    },
    internet: {
      username: '',
      numeroCompte: '',
      fournisseur: '',
      numeroTelephone: ''
    },
    gym: {
      fournisseur: '',
      username: '',
      numeroCompte: ''
    },
    servicesRecurrents: [],
    programmesFidelite: [],
    
    // Nouveaux champs pour services spécifiques
    netflixNom: '',
    netflixCompte: '',
    spotifyNom: '',
    spotifyCompte: '',
    amazonNom: '',
    amazonCompte: '',
    service1Nom: '',
    service1Abonnement: '',
    service1Compte: '',
    service2Nom: '',
    service2Abonnement: '',
    service2Compte: '',
    service3Nom: '',
    service3Abonnement: '',
    service3Compte: '',
    
    // Programmes de loyauté spécifiques
    airCanadaCourriel: '',
    airCanadaMotDePasse: '',
    airCanadaCompte: '',
    airMilesCourriel: '',
    airMilesMotDePasse: '',
    airMilesCompte: '',
    aeroplanCourriel: '',
    aeroplanMotDePasse: '',
    aeroplanCompte: '',
    marriottCourriel: '',
    marriottMotDePasse: '',
    marriottCompte: '',
    hiltonCourriel: '',
    hiltonMotDePasse: '',
    hiltonCompte: '',
    hyattCourriel: '',
    hyattMotDePasse: '',
    hyattCompte: '',

    // Numérique (maintenant dans Instructions)
    gestionnaireMDP: '',
    motDePassePrincipal: '',
    comptesEnLigne: [],

    // Documents
    documentsChecklist: [],
    
    // Documents individuels avec possédé/emplacement
    permisConduirePossede: false,
    permisConduireEmplacement: '',
    passeportPossede: false,
    passeportEmplacement: '',
    certificatNaissancePossede: false,
    certificatNaissanceEmplacement: '',
    certificatMariagePossede: false,
    certificatMariageEmplacement: '',
    certificatDivorcePossede: false,
    certificatDivorceEmplacement: '',
    testamentPossede: false,
    testamentEmplacement: '',
    mandatProtectionPossede: false,
    mandatProtectionEmplacement: '',
    procurationPossede: false,
    procurationEmplacement: '',
    fiduciePossede: false,
    fiducieEmplacement: '',
    tutelleCuratellePossede: false,
    tutelleCuratelleEmplacement: '',
    relevesBancairesPossede: false,
    relevesBancairesEmplacement: '',
    policesAssuranceViePossede: false,
    policesAssuranceVieEmplacement: '',
    assuranceAutoPossede: false,
    assuranceAutoEmplacement: '',
    assuranceHabitationPossede: false,
    assuranceHabitationEmplacement: '',
    assuranceInvaliditePossede: false,
    assuranceInvaliditeEmplacement: '',

    // Testament
    possedeTestament: false,
    lieuTestament: '',
    emplacementCopieTestament: '',
    executeurTestamentaire: '',
    executeurTelephone: '',
    notaire: '',
    notaireAdresse: '',
    notaireTelephone: '',
    numeroMinuteTestament: '',
    testamentVie: '',
    donOrganes: '',
    volontesFuneraires: '',
    instructionsSpeciales: '',
    instructionAnimaux: '',
    instructionPlantes: '',
    instructionPropriete: '',
    instructionCoffreFort: '',
    instructionAffaires: '',
    messagesPersonnels: '',

    // Meta
    dateMAJ: new Date().toISOString().split('T')[0],
    version: '1.0'
  });

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem('emergency-planning-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.warn('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
  }, []);

  // Sauvegarder les données
  const saveData = () => {
    const updatedData = {
      ...data,
      dateMAJ: new Date().toISOString().split('T')[0]
    };
    setData(updatedData);
    localStorage.setItem('emergency-planning-data', JSON.stringify(updatedData));
    alert('Données sauvegardées avec succès !');
  };

  // Exporter en JSON
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planification-urgence-${data.dateMAJ}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importer depuis JSON
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setData(importedData);
          alert('Données importées avec succès !');
        } catch (error) {
          alert('Erreur lors de l\'importation des données');
        }
      };
      reader.readAsText(file);
    }
  };

  // Imprimer
  const printData = () => {
    window.print();
  };


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
        <button className="btn btn-primary" onClick={saveData}>
          <Save size={16} />
          {t.emergencyPlanning.save}
        </button>

        <button className="btn btn-secondary" onClick={exportData}>
          <Download size={16} />
          {t.emergencyPlanning.exportJson}
        </button>

        <label className="btn btn-secondary" style={{cursor: 'pointer'}}>
          <Upload size={16} />
          Importer JSON
          <input
            type="file"
            accept=".json"
            onChange={importData}
            style={{display: 'none'}}
          />
        </label>

        <button 
          className="btn btn-secondary" 
          onClick={() => setShowPasswords(!showPasswords)}
        >
          {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPasswords ? t.emergencyPlanning.hidePasswords : t.emergencyPlanning.showPasswords}
        </button>

        <button className="btn btn-secondary" onClick={printData}>
          <Printer size={16} />
          {t.emergencyPlanning.print}
        </button>
      </div>

      {/* Onglets - 2 rangées de 6 */}
      <div className="emergency-tabs">
        {/* Première rangée : Personnel, Médical, Emploi, Contacts, Finances, Biens et propriétés */}
        <div className="emergency-tabs-row">
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
            <PiggyBank size={18} />
            {t.emergencyPlanning.tabs.finances}
          </button>

          <button 
            className={`emergency-tab ${activeTab === 'biens' ? 'active' : ''}`}
            onClick={() => setActiveTab('biens')}
          >
            <Home size={18} />
            {t.emergencyPlanning.tabs.assets}
          </button>
        </div>

        {/* Deuxième rangée : Services, Documents, Instructions, Testament */}
        <div className="emergency-tabs-row">
          <button 
            className={`emergency-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Building size={18} />
            {t.emergencyPlanning.tabs.services}
          </button>

          <button 
            className={`emergency-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileCheck size={18} />
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
            className={`emergency-tab ${activeTab === 'testament' ? 'active' : ''}`}
            onClick={() => setActiveTab('testament')}
          >
            <Lock size={18} />
            {t.emergencyPlanning.tabs.testament}
          </button>
        </div>
      </div>

      {/* Contenu des sections */}
      <div className="emergency-content">
        {activeTab === 'personnel' && (
          <PersonnelSection data={data} setData={setData} showPasswords={showPasswords} />
        )}
        {activeTab === 'medical' && (
          <MedicalSection data={data} setData={setData} expandedSections={expandedSections} toggleSection={toggleSection} />
        )}
        {activeTab === 'emploi' && (
          <EmploiSection data={data} setData={setData} />
        )}
        {activeTab === 'contacts' && (
          <ContactsSection data={data} setData={setData} />
        )}
        {activeTab === 'finances' && (
          <FinancesSection data={data} setData={setData} expandedSections={expandedSections} toggleSection={toggleSection} />
        )}
        {activeTab === 'biens' && (
          <BiensSection data={data} setData={setData} />
        )}
        {activeTab === 'services' && (
          <ServicesSection data={data} setData={setData} expandedSections={expandedSections} toggleSection={toggleSection} />
        )}
        {activeTab === 'documents' && (
          <DocumentsSection data={data} setData={setData} />
        )}
        {activeTab === 'testament' && (
          <TestamentSection data={data} setData={setData} />
        )}
        {activeTab === 'instructions' && (
          <InstructionsSection data={data} setData={setData} />
        )}
      </div>

      {/* Footer */}
      <div className="emergency-footer">
        <div className="footer-info">
          <h3>{t.emergencyPlanning.footer.important}</h3>
          <p>{t.emergencyPlanning.footer.sensitiveInfo}</p>
          <p>{t.emergencyPlanning.footer.keepSafe}</p>
        </div>
        <div className="footer-meta">
          <p>
            <strong>{t.emergencyPlanning.footer.lastUpdate} :</strong> {data.dateMAJ}
          </p>
          <p>
            <strong>{t.emergencyPlanning.footer.version} :</strong> {data.version}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanificationUrgence;