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
import { secureStorage } from '@/lib/secureStorage';
import { encryptToEnvelope, decryptFromEnvelope, isExportEnvelope, type ExportEnvelope } from '@/lib/fileCrypto';
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
  VerificationSection,
  EmergencyData 
} from '@/components/emergency-planning';

// Type pour les onglets actifs
type ActiveTab = 'personnel' | 'medical' | 'emploi' | 'contacts' | 'finances' | 
                 'biens' | 'services' | 'documents' | 'testament' | 'instructions' | 'verification';

const PlanificationUrgence: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('personnel');
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Sécurité de session
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [hasEncrypted, setHasEncrypted] = useState(false);
  const [hasUnsecure, setHasUnsecure] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [importPreview, setImportPreview] = useState<{ type: 'mpru' | 'json'; info: { createdAt?: string; schemaVersion?: string; size?: number }; data: EmergencyData } | null>(null);
  
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

  // Détection présence données et chargement après déverrouillage
  useEffect(() => {
    setHasEncrypted(localStorage.getItem('secure_emergency-planning-data') !== null);
    setHasUnsecure(localStorage.getItem('emergency-planning-data') !== null);
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;
    try {
      const encryptedExists = localStorage.getItem('secure_emergency-planning-data') !== null;
      if (encryptedExists) {
        const stored = secureStorage.getItem<EmergencyData>('emergency-planning-data');
        if (stored) {
          setData(stored);
        } else {
          // mauvaise phrase secrète probable; l'UI d'ouverture gère l'erreur
        }
      } else {
        // Migration depuis localStorage en clair si présent
        if (localStorage.getItem('emergency-planning-data')) {
          secureStorage.migrateUnsecureData('emergency-planning-data');
          const stored = secureStorage.getItem<EmergencyData>('emergency-planning-data');
          if (stored) setData(stored);
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des données chiffrées:', error);
    }
  }, [isUnlocked]);

  // Sauvegarder les données (stockage chiffré local)
  const saveData = () => {
    const updatedData = {
      ...data,
      dateMAJ: new Date().toISOString().split('T')[0]
    };
    setData(updatedData);
    try {
      secureStorage.setItem('emergency-planning-data', updatedData);
      alert('Données sauvegardées de façon chiffrée sur cet appareil.');
    } catch (e) {
      alert('Échec de la sauvegarde chiffrée.');
    }
  };

  // Exporter chiffré (.mpru)
  const exportEncrypted = async () => {
    try {
      const pwd = (secureStorage as any).getKey?.();
      if (!pwd) {
        alert('Veuillez déverrouiller avec votre phrase secrète avant d’exporter.');
        return;
      }
      const envelope = await encryptToEnvelope(data, pwd, data.version);
      const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `planification-urgence-${data.dateMAJ}.mpru`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Échec de l’export chiffré.');
      console.error(e);
    }
  };

  // Importer depuis fichier (.mpru chiffré ou JSON ancien) avec prévisualisation
  const importEncrypted = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileSize = file.size;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (isExportEnvelope(parsed)) {
          const pwd = (secureStorage as any).getKey?.();
          if (!pwd) {
            alert('Veuillez déverrouiller avec votre phrase secrète avant d’importer.');
            return;
          }
          const imported = await decryptFromEnvelope<EmergencyData>(parsed, pwd);
          setImportPreview({
            type: 'mpru',
            info: { createdAt: parsed.createdAt, schemaVersion: parsed.schemaVersion, size: fileSize },
            data: imported
          });
        } else {
          // JSON non chiffré
          const importedData = parsed as EmergencyData;
          setImportPreview({
            type: 'json',
            info: { size: fileSize },
            data: importedData
          });
        }
      } catch (error) {
        alert('Fichier invalide ou erreur lors de l’import.');
        console.error(error);
      } finally {
        event.currentTarget.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Imprimer
  const printData = () => {
    window.print();
  };

  // Confirmation import (prévisualisation)
  const confirmImport = () => {
    if (!importPreview) return;
    const payload = importPreview.data;
    setData(payload);
    try { secureStorage.setItem('emergency-planning-data', payload); } catch {}
    setImportPreview(null);
    alert('Données importées avec succès.');
  };

  const cancelImport = () => {
    setImportPreview(null);
  };

  // Export PDF ciblé (Phase 3) — avec redaction par défaut
  const exportEmergencyPdf = async (audience: 'trusted' | 'notary' | 'planner' | 'liquidator') => {
    try {
      // Lazy-load heavy PDF libs on click (better performance, smaller route chunk)
      const { generateEmergencyPDF } = await import('@/services/PDFEmergencyService');
      // Confirme si l'utilisateur veut inclure les informations sensibles en clair
      const includeSensitive = window.confirm('Inclure les informations sensibles (NAS, numéros complets)? Déconseillé pour un partage non chiffré. Choisissez "Annuler" pour générer un PDF avec caviardage par défaut.');
      const blob = await generateEmergencyPDF(data, audience, {
        language: (language === 'fr' || language === 'en') ? language : 'fr',
        showFullSensitive: includeSensitive
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `planification-urgence-${audience}-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Échec de la génération du PDF.');
      console.error(e);
    }
  };

  // Verrouillage / Déverrouillage (session)
  const handleUnlock = () => {
    setUnlockError('');
    if (!hasEncrypted && !hasUnsecure) {
      // première configuration: exiger confirmation
      if (!passphrase || passphrase !== confirmPassphrase) {
        setUnlockError('Les mots de passe ne concordent pas.');
        return;
      }
    }
    if (!passphrase) {
      setUnlockError('Veuillez saisir votre phrase secrète.');
      return;
    }
    secureStorage.setKey(passphrase);
    if (hasEncrypted) {
      const encExists = localStorage.getItem('secure_emergency-planning-data') !== null;
      const test = secureStorage.getItem<EmergencyData>('emergency-planning-data');
      if (!test && encExists) {
        setUnlockError('Phrase secrète invalide.');
        return;
      }
    } else if (hasUnsecure) {
      secureStorage.migrateUnsecureData('emergency-planning-data');
    }
    setIsUnlocked(true);
    setPassphrase('');
    setConfirmPassphrase('');
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setShowPasswords(false);
  };

  // Verrouillage automatique après inactivité (5 minutes)
  useEffect(() => {
    if (!isUnlocked) return;
    let timer: number;
    const reset = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        handleLock();
      }, 5 * 60 * 1000);
    };
    const events: (keyof WindowEventMap)[] = ['mousemove','keydown','click','touchstart'];
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true } as any));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, reset as any));
    };
  }, [isUnlocked]);


  return (
    <div className="emergency-planning-container">
      {!isUnlocked && (
        <div style={{position:'fixed',inset:0,background:'rgba(255,255,255,0.98)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div style={{width:'100%',maxWidth:480,background:'#fff',border:'2px solid #e5e7eb',borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.1)',padding:24}}>
            <h2 style={{fontSize:22,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
              <Shield size={20} /> {t.emergencyPlanning?.title || 'Planification d’urgence'} — Sécurisé
            </h2>
            <p style={{fontSize:14,marginBottom:16,color:'#334155'}}>
              {hasEncrypted ? 'Entrez votre phrase secrète pour déverrouiller vos données.' : hasUnsecure ? 'Définissez une phrase secrète pour chiffrer et migrer vos données existantes.' : 'Créez votre phrase secrète pour protéger vos données.'}
            </p>
            {unlockError && <div style={{color:'#b91c1c',marginBottom:12,fontWeight:600}}>{unlockError}</div>}
            <div style={{display:'grid',gap:12}}>
              <input type="password" className="form-input" autoComplete="new-password" placeholder="Phrase secrète" value={passphrase} onChange={(e)=>setPassphrase(e.target.value)} />
              {(!hasEncrypted) && (
                <input type="password" className="form-input" autoComplete="new-password" placeholder="Confirmer la phrase secrète" value={confirmPassphrase} onChange={(e)=>setConfirmPassphrase(e.target.value)} />
              )}
              <button className="btn btn-primary" onClick={handleUnlock}>
                <Lock size={16} /> {hasEncrypted ? 'Déverrouiller' : 'Activer la protection'}
              </button>
            </div>
          </div>
        </div>
      )}
      {importPreview && (
        <div style={{position:'fixed',inset:0,background:'rgba(255,255,255,0.98)',zIndex:9998,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
          <div style={{width:'100%',maxWidth:540,background:'#fff',border:'2px solid #e5e7eb',borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.1)',padding:24}}>
            <h2 style={{fontSize:22,marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
              <Shield size={20} /> Prévisualisation d’import {importPreview.type === 'mpru' ? '(chiffré)' : '(JSON)'}
            </h2>
            <div style={{fontSize:14,marginBottom:16,color:'#334155'}}>
              {importPreview.type === 'mpru' ? (
                <ul style={{marginLeft:16}}>
                  <li>Date du fichier: {importPreview.info.createdAt || 'N/D'}</li>
                  <li>Version de schéma: {importPreview.info.schemaVersion || 'N/D'}</li>
                  <li>Taille: {Math.round((importPreview.info.size || 0)/1024)} ko</li>
                </ul>
              ) : (
                <ul style={{marginLeft:16}}>
                  <li>Fichier non chiffré détecté</li>
                  <li>Taille: {Math.round((importPreview.info.size || 0)/1024)} ko</li>
                </ul>
              )}
              {importPreview.type === 'json' && (
                <p style={{marginTop:8,color:'#b91c1c',fontWeight:600}}>
                  Avertissement: ce fichier semble non chiffré. Il sera chiffré localement après import.
                </p>
              )}
            </div>
            <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={cancelImport}>Annuler</button>
              <button className="btn btn-primary" onClick={confirmImport}>Charger</button>
            </div>
          </div>
        </div>
      )}
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

        <button className="btn btn-secondary" onClick={exportEncrypted}>
          <Download size={16} />
          Exporter chiffré (.mpru)
        </button>

        <label className="btn btn-secondary" style={{cursor: 'pointer'}}>
          <Upload size={16} />
          Importer fichier (.mpru/.json)
          <input
            type="file"
            accept=".mpru,.json"
            onChange={importEncrypted}
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

        <button className="btn btn-secondary" onClick={handleLock}>
          <Lock size={16} />
          Verrouiller
        </button>

        <button className="btn btn-secondary" onClick={printData}>
          <Printer size={16} />
          {t.emergencyPlanning.print}
        </button>

        {/* Exports PDF ciblés — redaction par défaut, confirmation pour afficher intégralement */}
        <button className="btn btn-secondary" onClick={() => exportEmergencyPdf('trusted')}>
          <FileText size={16} />
          PDF Conjoint/Enfant
        </button>
        <button className="btn btn-secondary" onClick={() => exportEmergencyPdf('notary')}>
          <FileText size={16} />
          PDF Notaire
        </button>
        <button className="btn btn-secondary" onClick={() => exportEmergencyPdf('planner')}>
          <FileText size={16} />
          PDF Planificateur
        </button>
        <button className="btn btn-secondary" onClick={() => exportEmergencyPdf('liquidator')}>
          <FileText size={16} />
          PDF Liquidateur
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

          <button 
            className={`emergency-tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <CheckCircle size={18} />
            {t.emergencyPlanning.tabs.verification ?? 'Vérification'}
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
          <ServicesSection data={data} setData={setData} />
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
        {activeTab === 'verification' && (
          <VerificationSection data={data} setData={setData} />
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
