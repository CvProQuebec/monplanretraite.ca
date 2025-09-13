import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Upload, 
  FileText, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Phone, 
  Heart, 
  Shield, 
  Home, 
  Car, 
  CreditCard, 
  Building, 
  Users,
  Monitor,
  Newspaper,
  Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Déclaration TypeScript pour autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Types pour la structure des données
interface Contact {
  id: string;
  nom: string;
  relation: string;
  telephone: string;
  email: string;
  adresse: string;
}

interface Medicament {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
}

interface Compte {
  id: string;
  type: string;
  institution: string;
  numero: string;
  motDePasse: string;
  notes: string;
}

interface Abonnement {
  id: string;
  service: string;
  type: string;
  identifiant: string;
  motDePasse: string;
  cout: string;
  frequence: string;
  dateRenouv: string;
}

interface Document {
  id: string;
  type: string;
  nom: string;
  emplacement: string;
  notes: string;
}

interface EmergencyData {
  nom: string;
  dateNaissance: string;
  nas: string;
  assuranceMaladie: string;
  adresse: string;
  allergies: string;
  conditionsMedicales: string;
  groupeSanguin: string;
  medicaments: Medicament[];
  directivesMedicales: boolean;
  directivesMedicalesEmplacement: string;
  contactsUrgence: Contact[];
  contactsMedicaux: Contact[];
  professionnels: Contact[];
  comptesBancaires: Compte[];
  cartesCredit: Compte[];
  investissements: Compte[];
  abonnements: Abonnement[];
  documents: Document[];
  instructions: string;
  dateMAJ: string;
}

// Hook personnalisé pour gérer localStorage avec TypeScript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // État initial depuis localStorage ou valeur par défaut
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors du chargement de ${key}:`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour localStorage et l'état
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}

const PlanificationUrgence: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState('profil1');
  const [profiles, setProfiles] = useLocalStorage<{[key: string]: EmergencyData}>('emergencyProfiles', {});
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeTab, setActiveTab] = useState('personnel');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  
  // État pour les données du profil actif
  const [data, setData] = useState<EmergencyData>(() => {
    const defaultData: EmergencyData = {
      nom: '',
      dateNaissance: '',
      nas: '',
      assuranceMaladie: '',
      adresse: '',
      allergies: '',
      conditionsMedicales: '',
      groupeSanguin: '',
      medicaments: [],
      directivesMedicales: false,
      directivesMedicalesEmplacement: '',
      contactsUrgence: [],
      contactsMedicaux: [],
      professionnels: [],
      comptesBancaires: [],
      cartesCredit: [],
      investissements: [],
      abonnements: [],
      documents: [],
      instructions: '',
      dateMAJ: new Date().toISOString().split('T')[0]
    };
    
    return profiles[activeProfile] || defaultData;
  });

  // Synchroniser les données quand le profil actif change
  useEffect(() => {
    if (profiles[activeProfile]) {
      setData(profiles[activeProfile]);
    } else {
      setData({
        nom: '',
        dateNaissance: '',
        nas: '',
        assuranceMaladie: '',
        adresse: '',
        allergies: '',
        conditionsMedicales: '',
        groupeSanguin: '',
        medicaments: [],
        directivesMedicales: false,
        directivesMedicalesEmplacement: '',
        contactsUrgence: [],
        contactsMedicaux: [],
        professionnels: [],
        comptesBancaires: [],
        cartesCredit: [],
        investissements: [],
        abonnements: [],
        documents: [],
        instructions: '',
        dateMAJ: new Date().toISOString().split('T')[0]
      });
    }
  }, [activeProfile, profiles]);

  // Sauvegarder automatiquement les changements dans le profil actif
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.nom || data.dateNaissance || data.nas) { // Sauvegarder seulement si des données existent
        const updatedProfiles = { ...profiles, [activeProfile]: data };
        setProfiles(updatedProfiles);
      }
    }, 1000); // Debounce de 1 seconde

    return () => clearTimeout(timer);
  }, [data]);

  // Fonction pour ajouter le logo au PDF
  const addLogoToPDF = async (doc: jsPDF, x: number = 20, y: number = 10, width: number = 50, height: number = 15) => {
    try {
      const logoPath = '/logo-planretraite.png';
      
      // Créer une image temporaire pour obtenir les dimensions
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              const imgData = canvas.toDataURL('image/png');
              doc.addImage(imgData, 'PNG', x, y, width, height);
            }
            resolve();
          } catch (error) {
            console.error('Erreur lors de l\'ajout du logo:', error);
            resolve(); // Continuer sans logo en cas d'erreur
          }
        };
        
        img.onerror = () => {
          console.error('Logo non trouvé, continuation sans logo');
          resolve(); // Continuer sans logo
        };
        
        img.src = logoPath;
      });
    } catch (error) {
      console.error('Erreur lors du chargement du logo:', error);
      return Promise.resolve();
    }
  };

  // Fonction pour ajouter un filigrane (watermark)
  const addWatermark = (doc: jsPDF) => {
    const totalPages = doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Sauvegarder l'état graphique pour l'opacité
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.1 }));
      
      // Rotation pour mettre le texte en diagonale
      doc.text('CONFIDENTIEL', pageWidth / 2, pageHeight / 2, {
        angle: 45,
        align: 'center'
      });
      
      doc.restoreGraphicsState();
      doc.setTextColor(0, 0, 0);
    }
  };

  // Sauvegarder manuellement les données
  const saveData = () => {
    const updatedData = { ...data, dateMAJ: new Date().toISOString().split('T')[0] };
    const updatedProfiles = { ...profiles, [activeProfile]: updatedData };
    
    setData(updatedData);
    setProfiles(updatedProfiles);
    
    alert(language === 'fr' ? 'Données sauvegardées!' : 'Data saved!');
  };

  // Changer de profil
  const switchProfile = (newProfile: string) => {
    // Sauvegarder le profil actuel d'abord
    const updatedProfiles = { ...profiles, [activeProfile]: data };
    setProfiles(updatedProfiles);
    
    // Changer vers le nouveau profil
    setActiveProfile(newProfile);
  };

  // Supprimer un profil
  const deleteProfile = (profileId: string) => {
    if (profileId === 'profil1') {
      alert(language === 'fr' ? 'Impossible de supprimer le profil principal' : 'Cannot delete main profile');
      return;
    }
    
    const updatedProfiles = { ...profiles };
    delete updatedProfiles[profileId];
    setProfiles(updatedProfiles);
    
    if (activeProfile === profileId) {
      setActiveProfile('profil1');
    }
  };

  // Exporter en JSON ou TXT
  const exportData = (format: 'json' | 'txt') => {
    const currentData = { ...data, dateMAJ: new Date().toISOString().split('T')[0] };
    const fileName = `plan-urgence-${activeProfile}-${currentData.nom || 'anonyme'}-${new Date().toISOString().split('T')[0]}`;
    
    let content: string;
    let mimeType: string;
    
    if (format === 'json') {
      content = JSON.stringify(currentData, null, 2);
      mimeType = 'application/json';
    } else {
      content = generateTxtReport(currentData);
      mimeType = 'text/plain;charset=utf-8';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Générer rapport TXT
  const generateTxtReport = (reportData: EmergencyData): string => {
    return `PLAN D'URGENCE - ${reportData.nom.toUpperCase()}
===========================================
Dernière mise à jour: ${reportData.dateMAJ}
Profil: ${activeProfile}

INFORMATIONS PERSONNELLES
-------------------------
Nom: ${reportData.nom}
Date de naissance: ${reportData.dateNaissance}
NAS: ${reportData.nas}
Assurance maladie: ${reportData.assuranceMaladie}
Adresse: ${reportData.adresse}

INFORMATIONS MÉDICALES
----------------------
Allergies: ${reportData.allergies || 'Aucune'}
Conditions médicales: ${reportData.conditionsMedicales || 'Aucune'}
Groupe sanguin: ${reportData.groupeSanguin || 'Non spécifié'}
Directives médicales: ${reportData.directivesMedicales ? 'Oui' : 'Non'}
${reportData.directivesMedicales ? `Emplacement: ${reportData.directivesMedicalesEmplacement}` : ''}

MÉDICAMENTS
-----------
${reportData.medicaments.length > 0 ? 
  reportData.medicaments.map(med => `- ${med.nom} (${med.dosage}) - ${med.frequence}`).join('\n') : 
  'Aucun médicament'}

CONTACTS D'URGENCE
------------------
${reportData.contactsUrgence.length > 0 ?
  reportData.contactsUrgence.map(contact => 
    `${contact.nom} (${contact.relation})
  Tél: ${contact.telephone}
  Email: ${contact.email}
  Adresse: ${contact.adresse}`).join('\n\n') :
  'Aucun contact'}

CONTACTS MÉDICAUX
-----------------
${reportData.contactsMedicaux.length > 0 ?
  reportData.contactsMedicaux.map(contact => 
    `${contact.nom} (${contact.relation})
  Tél: ${contact.telephone}
  Email: ${contact.email}`).join('\n\n') :
  'Aucun contact médical'}

PROFESSIONNELS
--------------
${reportData.professionnels.length > 0 ?
  reportData.professionnels.map(contact => 
    `${contact.nom} (${contact.relation})
  Tél: ${contact.telephone}
  Email: ${contact.email}`).join('\n\n') :
  'Aucun professionnel'}

COMPTES BANCAIRES
-----------------
${reportData.comptesBancaires.length > 0 ?
  reportData.comptesBancaires.map(compte => 
    `${compte.institution} - ${compte.type}
  Numéro: ${compte.numero}
  Notes: ${compte.notes}`).join('\n\n') :
  'Aucun compte bancaire'}

CARTES DE CRÉDIT
----------------
${reportData.cartesCredit.length > 0 ?
  reportData.cartesCredit.map(carte => 
    `${carte.institution} - ${carte.type}
  Numéro: ${carte.numero}`).join('\n\n') :
  'Aucune carte de crédit'}

INVESTISSEMENTS
---------------
${reportData.investissements.length > 0 ?
  reportData.investissements.map(inv => 
    `${inv.institution} - ${inv.type}
  Numéro: ${inv.numero}`).join('\n\n') :
  'Aucun investissement'}

ABONNEMENTS
-----------
${reportData.abonnements.length > 0 ?
  reportData.abonnements.map(abo => 
    `${abo.service} (${abo.type})
  Coût: ${abo.cout} - ${abo.frequence}
  Renouvellement: ${abo.dateRenouv}`).join('\n\n') :
  'Aucun abonnement'}

DOCUMENTS IMPORTANTS
--------------------
${reportData.documents.length > 0 ?
  reportData.documents.map(doc => 
    `${doc.type} - ${doc.nom}
  Emplacement: ${doc.emplacement}
  Notes: ${doc.notes}`).join('\n\n') :
  'Aucun document'}

INSTRUCTIONS SPÉCIALES
----------------------
${reportData.instructions || 'Aucune instruction spéciale'}

=============================================
Document généré automatiquement
GARDEZ CE DOCUMENT EN SÉCURITÉ
=============================================`;
  };

  // Importer données
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setData(imported);
          
          // Sauvegarder dans les profils
          const updatedProfiles = { ...profiles, [activeProfile]: imported };
          setProfiles(updatedProfiles);
          
          alert(language === 'fr' ? 'Données importées avec succès!' : 'Data imported successfully!');
        } catch (error) {
          alert(language === 'fr' ? 'Erreur lors de l\'importation' : 'Import error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Générer PDF avec logo et filigrane
  const generatePDF = async (recipient: string) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Configuration des styles
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margins = {
      top: 30, // Plus d'espace en haut pour le logo
      bottom: 20,
      left: 20,
      right: 20
    };
    
    // Ajouter le logo en haut à gauche
    await addLogoToPDF(doc, 20, 10, 50, 15);
    
    let yPosition = margins.top;
    
    // Fonction utilitaire pour ajouter du texte avec gestion de page
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, pageWidth - margins.left - margins.right);
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margins.bottom) {
          doc.addPage();
          // Ajouter le logo sur chaque nouvelle page
          addLogoToPDF(doc, 20, 10, 50, 15);
          yPosition = margins.top;
        }
        doc.text(line, margins.left, yPosition);
        yPosition += fontSize * 0.5;
      });
    };
    
    // Fonction pour ajouter un titre de section
    const addSectionTitle = async (title: string) => {
      yPosition += 5;
      if (yPosition > pageHeight - margins.bottom - 10) {
        doc.addPage();
        await addLogoToPDF(doc, 20, 10, 50, 15);
        yPosition = margins.top;
      }
      doc.setFillColor(240, 240, 240);
      doc.rect(margins.left - 5, yPosition - 6, pageWidth - margins.left - margins.right + 10, 10, 'F');
      addText(title, 14, true);
      yPosition += 8;
    };
    
    // Fonction pour ajouter une ligne de séparation
    const addSeparator = () => {
      yPosition += 3;
      doc.setDrawColor(200, 200, 200);
      doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition);
      yPosition += 5;
    };
    
    // Générer le contenu selon le destinataire
    switch (recipient) {
      case 'conjoint':
        await generateSpousePDF(doc, addText, addSectionTitle, addSeparator, yPosition);
        break;
      case 'enfant':
        await generateChildPDF(doc, addText, addSectionTitle, addSeparator, yPosition);
        break;
      case 'notaire':
        await generateNotaryPDF(doc, addText, addSectionTitle, addSeparator, yPosition);
        break;
      case 'banquier':
        await generateBankPDF(doc, addText, addSectionTitle, addSeparator, yPosition);
        break;
      case 'planificateur':
        await generatePlannerPDF(doc, addText, addSectionTitle, addSeparator, yPosition);
        break;
      case 'complet':
      default:
        await generateCompletePDF(doc, addText, addSectionTitle, addSeparator, yPosition);
        break;
    }
    
    // Ajouter le filigrane sur toutes les pages
    addWatermark(doc);
    
    // Ajouter un pied de page sur toutes les pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} / ${totalPages} - Document généré le ${new Date().toLocaleDateString('fr-CA')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Sauvegarder le PDF
    const fileName = `plan-urgence-${recipient}-${data.nom || 'anonyme'}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // Fonctions spécifiques pour chaque type de PDF (simplifiées pour l'espace)
  const generateSpousePDF = async (
    doc: jsPDF, 
    addText: Function, 
    addSectionTitle: Function, 
    addSeparator: Function,
    startY: number
  ) => {
    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PLAN D\'URGENCE FAMILIAL', doc.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Préparé pour : Conjoint(e)`, doc.internal.pageSize.getWidth() / 2, startY + 10, { align: 'center' });
    doc.text(`Date : ${data.dateMAJ}`, doc.internal.pageSize.getWidth() / 2, startY + 17, { align: 'center' });
    
    let yPos = startY + 30;
    
    await addSectionTitle('INFORMATIONS PERSONNELLES');
    addText(`Nom complet : ${data.nom}`);
    addText(`Date de naissance : ${data.dateNaissance}`);
    addText(`NAS : ${data.nas}`);
    addText(`Assurance maladie : ${data.assuranceMaladie}`);
    addText(`Adresse : ${data.adresse}`);
    
    addSeparator();
    
    await addSectionTitle('INFORMATIONS MÉDICALES CRITIQUES');
    addText(`Allergies : ${data.allergies || 'Aucune connue'}`);
    addText(`Conditions médicales : ${data.conditionsMedicales || 'Aucune'}`);
    addText(`Groupe sanguin : ${data.groupeSanguin || 'Non spécifié'}`);
    
    if (data.medicaments.length > 0) {
      addText('Médicaments actuels :', 10, true);
      data.medicaments.forEach(med => {
        addText(`  • ${med.nom} - ${med.dosage} (${med.frequence})`);
      });
    }
    
    addSeparator();
    
    await addSectionTitle('CONTACTS D\'URGENCE');
    if (data.contactsUrgence.length > 0) {
      data.contactsUrgence.forEach(contact => {
        addText(`${contact.nom} (${contact.relation})`, 10, true);
        addText(`  Tél : ${contact.telephone}`);
        addText(`  Email : ${contact.email}`);
        if (contact.adresse) {
          addText(`  Adresse : ${contact.adresse}`);
        }
      });
    } else {
      addText('Aucun contact d\'urgence spécifié');
    }
  };

  const generateChildPDF = async (
    doc: jsPDF,
    addText: Function,
    addSectionTitle: Function,
    addSeparator: Function,
    startY: number
  ) => {
    // Version simplifiée pour les enfants
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS IMPORTANTES', doc.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('À garder en lieu sûr', doc.internal.pageSize.getWidth() / 2, startY + 10, { align: 'center' });
    
    let yPos = startY + 30;
    
    await addSectionTitle('QUI CONTACTER EN URGENCE');
    
    const urgentContacts = data.contactsUrgence.slice(0, 3);
    if (urgentContacts.length > 0) {
      urgentContacts.forEach((contact, index) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        addText(`${index + 1}. ${contact.nom} (${contact.relation})`);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        addText(`   📞 ${contact.telephone}`);
        addText('');
      });
    }
    
    addSeparator();
    
    await addSectionTitle('NOTRE ADRESSE');
    doc.setFontSize(12);
    addText(data.adresse || 'Non spécifiée');
  };

  const generateNotaryPDF = async (
    doc: jsPDF,
    addText: Function,
    addSectionTitle: Function,
    addSeparator: Function,
    startY: number
  ) => {
    // En-tête professionnel
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DOSSIER DE PLANIFICATION SUCCESSORALE', doc.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENT CONFIDENTIEL', doc.internal.pageSize.getWidth() / 2, startY + 7, { align: 'center' });
    
    await addSectionTitle('IDENTIFICATION DU CLIENT');
    addText(`Nom complet : ${data.nom}`);
    addText(`Date de naissance : ${data.dateNaissance}`);
    addText(`Numéro d'assurance sociale : ${data.nas}`);
    addText(`Adresse de résidence : ${data.adresse}`);
  };

  const generateBankPDF = async (
    doc: jsPDF,
    addText: Function,
    addSectionTitle: Function,
    addSeparator: Function,
    startY: number
  ) => {
    // En-tête bancaire
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DOSSIER FINANCIER CLIENT', doc.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text('STRICTEMENT CONFIDENTIEL', doc.internal.pageSize.getWidth() / 2, startY + 7, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    await addSectionTitle('IDENTIFICATION');
    addText(`Nom : ${data.nom}`);
    addText(`Date de naissance : ${data.dateNaissance}`);
    addText(`NAS : ${data.nas}`);
  };

  const generatePlannerPDF = async (
    doc: jsPDF,
    addText: Function,
    addSectionTitle: Function,
    addSeparator: Function,
    startY: number
  ) => {
    // En-tête pour planificateur financier
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFIL CLIENT - PLANIFICATION FINANCIÈRE', doc.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-CA')}`, doc.internal.pageSize.getWidth() / 2, startY + 7, { align: 'center' });
    
    await addSectionTitle('PROFIL PERSONNEL');
    addText(`Nom : ${data.nom}`);
    addText(`Date de naissance : ${data.dateNaissance}`);
    addText(`Adresse : ${data.adresse}`);
  };

  const generateCompletePDF = async (
    doc: jsPDF,
    addText: Function,
    addSectionTitle: Function,
    addSeparator: Function,
    startY: number
  ) => {
    // Page de garde
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const titleY = doc.internal.pageSize.getHeight() / 2 - 20;
    doc.text('PLAN D\'URGENCE COMPLET', doc.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(data.nom || 'Anonyme', doc.internal.pageSize.getWidth() / 2, titleY + 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Dernière mise à jour : ${data.dateMAJ}`, doc.internal.pageSize.getWidth() / 2, titleY + 25, { align: 'center' });
    
    // Avertissement
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('DOCUMENT STRICTEMENT CONFIDENTIEL', doc.internal.pageSize.getWidth() / 2, titleY + 40, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('Contient des informations personnelles sensibles', doc.internal.pageSize.getWidth() / 2, titleY + 47, { align: 'center' });
    
    // Nouvelle page pour le contenu
    doc.addPage();
    await addLogoToPDF(doc, 20, 10, 50, 15);
    
    // Générer le contenu complet
    await generateSpousePDF(doc, addText, addSectionTitle, addSeparator, 30);
  };

  // Fonctions d'aide pour ajouter des éléments
  const addContact = (type: 'contactsUrgence' | 'contactsMedicaux' | 'professionnels') => {
    const newContact: Contact = {
      id: Date.now().toString(),
      nom: '',
      relation: '',
      telephone: '',
      email: '',
      adresse: ''
    };
    setData(prev => ({
      ...prev,
      [type]: [...prev[type], newContact]
    }));
  };

  const addMedicament = () => {
    const newMed: Medicament = {
      id: Date.now().toString(),
      nom: '',
      dosage: '',
      frequence: ''
    };
    setData(prev => ({
      ...prev,
      medicaments: [...prev.medicaments, newMed]
    }));
  };

  const addAbonnement = () => {
    const newAbo: Abonnement = {
      id: Date.now().toString(),
      service: '',
      type: '',
      identifiant: '',
      motDePasse: '',
      cout: '',
      frequence: 'mensuel',
      dateRenouv: ''
    };
    setData(prev => ({
      ...prev,
      abonnements: [...prev.abonnements, newAbo]
    }));
  };

  const addCompte = (type: 'comptesBancaires' | 'cartesCredit' | 'investissements') => {
    const newCompte: Compte = {
      id: Date.now().toString(),
      type: '',
      institution: '',
      numero: '',
      motDePasse: '',
      notes: ''
    };
    setData(prev => ({
      ...prev,
      [type]: [...prev[type], newCompte]
    }));
  };

  const addDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      type: '',
      nom: '',
      emplacement: '',
      notes: ''
    };
    setData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
  };

  const texts = {
    fr: {
      title: 'Gestionnaire de planification d\'urgence',
      save: 'Sauvegarder',
      showPasswords: 'Afficher mots de passe',
      hidePasswords: 'Masquer mots de passe'
    },
    en: {
      title: 'Emergency Planning Manager',
      save: 'Save',
      showPasswords: 'Show passwords',
      hidePasswords: 'Hide passwords'
    }
  };

  const t = texts[language];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{t.title}</CardTitle>
              <CardDescription>
                {language === 'fr' ? 
                  'Créez et gérez votre plan d\'urgence personnalisé' :
                  'Create and manage your personalized emergency plan'
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={language === 'fr' ? 'default' : 'outline'}
                size="sm" 
                onClick={() => setLanguage('fr')}
              >
                FR
              </Button>
              <Button 
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm" 
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Barre d'outils */}
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Sélecteur de profil */}
            <div className="flex items-center gap-2">
              <Label>Profil:</Label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={activeProfile}
                onChange={(e) => switchProfile(e.target.value)}
              >
                <option value="profil1">
                  profil1 {profiles.profil1?.nom ? `(${profiles.profil1.nom})` : ''}
                </option>
                {Object.keys(profiles)
                  .filter(key => key !== 'profil1')
                  .map(profileId => (
                    <option key={profileId} value={profileId}>
                      {profileId} {profiles[profileId]?.nom ? `(${profiles[profileId].nom})` : ''}
                    </option>
                  ))
                }
              </select>
              <Button 
                onClick={() => {
                  const existingNumbers = Object.keys(profiles)
                    .filter(key => key.startsWith('profil'))
                    .map(key => parseInt(key.replace('profil', '')))
                    .filter(num => !isNaN(num));
                  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
                  const newProfileId = `profil${maxNumber + 1}`;
                  switchProfile(newProfileId);
                }}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nouveau
              </Button>
              {activeProfile !== 'profil1' && (
                <Button 
                  onClick={() => deleteProfile(activeProfile)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="w-px h-8 bg-gray-300"></div>

            <Button onClick={saveData} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {t.save}
            </Button>
            
            <Button onClick={() => exportData('json')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>

            <Button onClick={() => exportData('txt')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export TXT
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
            </div>
            
            <Button 
              onClick={() => setShowPasswords(!showPasswords)}
              variant="outline"
            >
              {showPasswords ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPasswords ? t.hidePasswords : t.showPasswords}
            </Button>

            <div className="w-px h-8 bg-gray-300"></div>

            {/* Boutons PDF */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => generatePDF('conjoint')} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                PDF Conjoint
              </Button>
              <Button onClick={() => generatePDF('enfant')} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                PDF Enfants
              </Button>
              <Button onClick={() => generatePDF('notaire')} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                PDF Notaire
              </Button>
              <Button onClick={() => generatePDF('banquier')} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                PDF Banquier
              </Button>
              <Button onClick={() => generatePDF('complet')} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                PDF Complet
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="personnel">Personnel</TabsTrigger>
              <TabsTrigger value="medical">Médical</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="abonnements">Abonnements</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>

            {/* Onglet Personnel */}
            <TabsContent value="personnel" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles de base</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom complet</Label>
                    <Input
                      id="nom"
                      value={data.nom}
                      onChange={(e) => setData(prev => ({...prev, nom: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <Input
                      id="dateNaissance"
                      type="date"
                      value={data.dateNaissance}
                      onChange={(e) => setData(prev => ({...prev, dateNaissance: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nas">Numéro d'assurance sociale (NAS)</Label>
                    <Input
                      id="nas"
                      value={data.nas}
                      onChange={(e) => setData(prev => ({...prev, nas: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assuranceMaladie">Numéro d'assurance maladie</Label>
                    <Input
                      id="assuranceMaladie"
                      value={data.assuranceMaladie}
                      onChange={(e) => setData(prev => ({...prev, assuranceMaladie: e.target.value}))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="adresse">Adresse actuelle</Label>
                    <Textarea
                      id="adresse"
                      value={data.adresse}
                      onChange={(e) => setData(prev => ({...prev, adresse: e.target.value}))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Médical */}
            <TabsContent value="medical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations médicales critiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="allergies">Allergies médicamenteuses</Label>
                    <Textarea
                      id="allergies"
                      value={data.allergies}
                      onChange={(e) => setData(prev => ({...prev, allergies: e.target.value}))}
                      placeholder="Décrivez toutes vos allergies connues..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="conditions">Conditions médicales chroniques</Label>
                    <Textarea
                      id="conditions"
                      value={data.conditionsMedicales}
                      onChange={(e) => setData(prev => ({...prev, conditionsMedicales: e.target.value}))}
                      placeholder="Diabète, hypertension, etc..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
                    <Input
                      id="groupeSanguin"
                      value={data.groupeSanguin}
                      onChange={(e) => setData(prev => ({...prev, groupeSanguin: e.target.value}))}
                      placeholder="A+, B-, O+, etc..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Médicaments actuels</Label>
                      <Button onClick={addMedicament} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter médicament
                      </Button>
                    </div>
                    
                    {data.medicaments.map((med) => (
                      <div key={med.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded">
                        <Input
                          placeholder="Nom du médicament"
                          value={med.nom}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              medicaments: prev.medicaments.map(m => 
                                m.id === med.id ? {...m, nom: e.target.value} : m
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              medicaments: prev.medicaments.map(m => 
                                m.id === med.id ? {...m, dosage: e.target.value} : m
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Fréquence"
                          value={med.frequence}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              medicaments: prev.medicaments.map(m => 
                                m.id === med.id ? {...m, frequence: e.target.value} : m
                              )
                            }));
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setData(prev => ({
                              ...prev,
                              medicaments: prev.medicaments.filter(m => m.id !== med.id)
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="directivesMedicales"
                        checked={data.directivesMedicales}
                        onChange={(e) => setData(prev => ({...prev, directivesMedicales: e.target.checked}))}
                      />
                      <Label htmlFor="directivesMedicales">J'ai des directives médicales anticipées</Label>
                    </div>
                    {data.directivesMedicales && (
                      <Input
                        placeholder="Emplacement des directives médicales"
                        value={data.directivesMedicalesEmplacement}
                        onChange={(e) => setData(prev => ({...prev, directivesMedicalesEmplacement: e.target.value}))}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Contacts */}
            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Contacts d'urgence</CardTitle>
                    <Button onClick={() => addContact('contactsUrgence')} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter contact
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.contactsUrgence.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Nom"
                          value={contact.nom}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              contactsUrgence: prev.contactsUrgence.map(c => 
                                c.id === contact.id ? {...c, nom: e.target.value} : c
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Relation"
                          value={contact.relation}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              contactsUrgence: prev.contactsUrgence.map(c => 
                                c.id === contact.id ? {...c, relation: e.target.value} : c
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Téléphone"
                          value={contact.telephone}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              contactsUrgence: prev.contactsUrgence.map(c => 
                                c.id === contact.id ? {...c, telephone: e.target.value} : c
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              contactsUrgence: prev.contactsUrgence.map(c => 
                                c.id === contact.id ? {...c, email: e.target.value} : c
                              )
                            }));
                          }}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            contactsUrgence: prev.contactsUrgence.filter(c => c.id !== contact.id)
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Finances */}
            <TabsContent value="finances" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Comptes bancaires</CardTitle>
                    <Button onClick={() => addCompte('comptesBancaires')} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter compte
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.comptesBancaires.map((compte) => (
                    <div key={compte.id} className="p-4 border rounded space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Institution"
                          value={compte.institution}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              comptesBancaires: prev.comptesBancaires.map(c => 
                                c.id === compte.id ? {...c, institution: e.target.value} : c
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Type de compte"
                          value={compte.type}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              comptesBancaires: prev.comptesBancaires.map(c => 
                                c.id === compte.id ? {...c, type: e.target.value} : c
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Numéro de compte"
                          value={compte.numero}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              comptesBancaires: prev.comptesBancaires.map(c => 
                                c.id === compte.id ? {...c, numero: e.target.value} : c
                              )
                            }));
                          }}
                        />
                      </div>
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        value={compte.motDePasse}
                        onChange={(e) => {
                          setData(prev => ({
                            ...prev,
                            comptesBancaires: prev.comptesBancaires.map(c => 
                              c.id === compte.id ? {...c, motDePasse: e.target.value} : c
                            )
                          }));
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            comptesBancaires: prev.comptesBancaires.filter(c => c.id !== compte.id)
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Abonnements */}
            <TabsContent value="abonnements" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Abonnements et services</CardTitle>
                    <Button onClick={addAbonnement} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter abonnement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.abonnements.map((abo) => (
                    <div key={abo.id} className="p-4 border rounded space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Service/Nom"
                          value={abo.service}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              abonnements: prev.abonnements.map(a => 
                                a.id === abo.id ? {...a, service: e.target.value} : a
                              )
                            }));
                          }}
                        />
                        <select
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={abo.type}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              abonnements: prev.abonnements.map(a => 
                                a.id === abo.id ? {...a, type: e.target.value} : a
                              )
                            }));
                          }}
                        >
                          <option value="">Type</option>
                          <option value="streaming">Streaming</option>
                          <option value="magazine">Magazine</option>
                          <option value="journal">Journal</option>
                          <option value="software">Logiciel</option>
                          <option value="fitness">Fitness</option>
                          <option value="cloud">Cloud</option>
                          <option value="telecom">Télécommunication</option>
                          <option value="other">Autre</option>
                        </select>
                        <Input
                          placeholder="Coût"
                          value={abo.cout}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              abonnements: prev.abonnements.map(a => 
                                a.id === abo.id ? {...a, cout: e.target.value} : a
                              )
                            }));
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Identifiant"
                          value={abo.identifiant}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              abonnements: prev.abonnements.map(a => 
                                a.id === abo.id ? {...a, identifiant: e.target.value} : a
                              )
                            }));
                          }}
                        />
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          placeholder="Mot de passe"
                          value={abo.motDePasse}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              abonnements: prev.abonnements.map(a => 
                                a.id === abo.id ? {...a, motDePasse: e.target.value} : a
                              )
                            }));
                          }}
                        />
                        <select
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={abo.frequence}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              abonnements: prev.abonnements.map(a => 
                                a.id === abo.id ? {...a, frequence: e.target.value} : a
                              )
                            }));
                          }}
                        >
                          <option value="mensuel">Mensuel</option>
                          <option value="annuel">Annuel</option>
                          <option value="hebdomadaire">Hebdomadaire</option>
                          <option value="unique">Paiement unique</option>
                        </select>
                      </div>
                      <Input
                        type="date"
                        placeholder="Date de renouvellement"
                        value={abo.dateRenouv}
                        onChange={(e) => {
                          setData(prev => ({
                            ...prev,
                            abonnements: prev.abonnements.map(a => 
                              a.id === abo.id ? {...a, dateRenouv: e.target.value} : a
                            )
                          }));
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            abonnements: prev.abonnements.filter(a => a.id !== abo.id)
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Documents */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Documents importants</CardTitle>
                    <Button onClick={addDocument} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.documents.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Type de document"
                          value={doc.type}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              documents: prev.documents.map(d => 
                                d.id === doc.id ? {...d, type: e.target.value} : d
                              )
                            }));
                          }}
                        />
                        <Input
                          placeholder="Nom du document"
                          value={doc.nom}
                          onChange={(e) => {
                            setData(prev => ({
                              ...prev,
                              documents: prev.documents.map(d => 
                                d.id === doc.id ? {...d, nom: e.target.value} : d
                              )
                            }));
                          }}
                        />
                      </div>
                      <Input
                        placeholder="Emplacement"
                        value={doc.emplacement}
                        onChange={(e) => {
                          setData(prev => ({
                            ...prev,
                            documents: prev.documents.map(d => 
                              d.id === doc.id ? {...d, emplacement: e.target.value} : d
                            )
                          }));
                        }}
                      />
                      <Textarea
                        placeholder="Notes"
                        value={doc.notes}
                        onChange={(e) => {
                          setData(prev => ({
                            ...prev,
                            documents: prev.documents.map(d => 
                              d.id === doc.id ? {...d, notes: e.target.value} : d
                            )
                          }));
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            documents: prev.documents.filter(d => d.id !== doc.id)
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Instructions */}
            <TabsContent value="instructions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Instructions spéciales</CardTitle>
                  <CardDescription>
                    Instructions importantes à suivre en cas d'urgence, d'incapacité ou de décès
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Décrivez ici toutes les instructions importantes que vos proches doivent connaître..."
                    value={data.instructions}
                    onChange={(e) => setData(prev => ({...prev, instructions: e.target.value}))}
                    rows={10}
                  />
                </CardContent>
              </Card>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dernière mise à jour :</strong> {data.dateMAJ}
                  <br />
                  N'oubliez pas de sauvegarder régulièrement vos modifications et d'informer vos proches de l'existence de ce plan.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanificationUrgence;
