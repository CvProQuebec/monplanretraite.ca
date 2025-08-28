// src/features/retirement/components/EmergencyPlanningManager.tsx
// Composant principal pour la gestion de la planification d'urgence

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  User, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  FileText,
  Printer,
  Download,
  Upload,
  Copy,
  Save,
  Clock,
  Heart,
  Phone,
  CreditCard,
  FileCheck,
  Home,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { EmergencyPlanningService } from '../services/EmergencyPlanningService';
import { IndividualSaveService } from '../services/IndividualSaveService';
import { 
  EmergencyPlan, 
  EmergencyPlanningState,
  EmergencyPlanValidation 
} from '../types/emergency-planning';
import { useRetirementData } from '../hooks/useRetirementData';
import { usePersonNames } from '../hooks/usePersonNames';
import { EmergencyContactsForm } from './EmergencyContactsForm';
import { MedicalInfoForm } from './MedicalInfoForm';
import { FinancialAccountsForm } from './FinancialAccountsForm';
import { PropertiesForm } from './PropertiesForm';
import { DigitalAccessForm } from './DigitalAccessForm';
import { InsuranceForm } from './InsuranceForm';
import { LegalDocumentsForm } from './LegalDocumentsForm';
import { FamilyResponsibilitiesForm } from './FamilyResponsibilitiesForm';
import { FuneralWishesForm } from './FuneralWishesForm';
import { DeathChecklistForm } from './DeathChecklistForm';
import { SecurityTipsForm } from './SecurityTipsForm';
import { EvacuationChecklistForm } from './EvacuationChecklistForm';
import { ComprehensiveMedicalRecordForm } from './ComprehensiveMedicalRecordForm';

interface EmergencyPlanningManagerProps {
  className?: string;
}

export const EmergencyPlanningManager: React.FC<EmergencyPlanningManagerProps> = ({ className }) => {
  const { userData } = useRetirementData();
  const { getPersonDisplayName, getSectionTitle, getSaveButtonLabel, getSelectOptions } = usePersonNames();
  const [planningState, setPlanningState] = useState<EmergencyPlanningState>({
    selectedPerson: 'person1',
    isEditing: false
  });
  const [validation1, setValidation1] = useState<EmergencyPlanValidation | null>(null);
  const [validation2, setValidation2] = useState<EmergencyPlanValidation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedState = EmergencyPlanningService.loadEmergencyPlanningState();
    if (savedState) {
      setPlanningState(savedState);
      setLastSaved(savedState.lastSaved || null);
    } else {
      // Créer des plans vides si aucune donnée sauvegardée
      initializeEmptyPlans();
    }
  }, [userData]);

  // Valider les plans quand ils changent
  useEffect(() => {
    if (planningState.person1Plan) {
      setValidation1(EmergencyPlanningService.validateEmergencyPlan(planningState.person1Plan));
    }
    if (planningState.person2Plan) {
      setValidation2(EmergencyPlanningService.validateEmergencyPlan(planningState.person2Plan));
    }
  }, [planningState.person1Plan, planningState.person2Plan]);

  const initializeEmptyPlans = () => {
    const person1Name = userData.personal?.prenom1 || 'Personne 1';
    const person1LastName = ''; // Pas de nom de famille dans la structure actuelle
    
    const newState: EmergencyPlanningState = {
      selectedPerson: 'person1',
      isEditing: false,
      person1Plan: EmergencyPlanningService.createEmptyPlan('person1', person1LastName, person1Name)
    };

    // Créer un plan pour la personne 2 si elle existe
    if (userData.personal?.prenom2) {
      const person2Name = userData.personal.prenom2;
      const person2LastName = ''; // Pas de nom de famille dans la structure actuelle
      newState.person2Plan = EmergencyPlanningService.createEmptyPlan('person2', person2LastName, person2Name);
    }

    setPlanningState(newState);
  };

  const saveToFile = () => {
    setIsSaving(true);
    try {
      // Créer le nom de fichier suggéré
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-CA').replace(/-/g, '');
      const timeStr = now.toLocaleTimeString('fr-CA', { hour12: false }).replace(/:/g, 'h');
      const suggestedName = `Plan-retraite-${dateStr}-${timeStr}.json`;

      // Préparer les données à sauvegarder
      const dataToSave = {
        version: '1.0.0',
        exportDate: now,
        userData: userData,
        emergencyPlanning: planningState,
        metadata: {
          appVersion: '1.0.0',
          exportedBy: 'MonPlanRetraite.ca'
        }
      };

      // Créer le blob et télécharger
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = suggestedName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Sauvegarder aussi localement pour la session
      EmergencyPlanningService.saveEmergencyPlanningState(planningState);
      
      setLastSaved(now);
      console.log('💾 Fichier sauvegardé:', suggestedName);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du fichier. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const restoreFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          // Vérifier la structure du fichier
          if (!data.emergencyPlanning && !data.userData) {
            alert('Ce fichier ne semble pas être un fichier de sauvegarde valide.');
            return;
          }

          // Confirmer l'écrasement des données
          const confirmRestore = window.confirm(
            'Cette action va remplacer toutes vos données actuelles par celles du fichier. ' +
            'Êtes-vous sûr de vouloir continuer ?'
          );

          if (!confirmRestore) return;

          // Restaurer les données d'urgence
          if (data.emergencyPlanning) {
            // Convertir les dates
            const restoredState = data.emergencyPlanning;
            if (restoredState.person1Plan) {
              restoredState.person1Plan = EmergencyPlanningService.convertDatesInPlan(restoredState.person1Plan);
            }
            if (restoredState.person2Plan) {
              restoredState.person2Plan = EmergencyPlanningService.convertDatesInPlan(restoredState.person2Plan);
            }

            // Écraser complètement l'état actuel
            setPlanningState({
              selectedPerson: restoredState.selectedPerson || 'person1',
              isEditing: false,
              person1Plan: restoredState.person1Plan,
              person2Plan: restoredState.person2Plan
            });

            // Sauvegarder localement
            EmergencyPlanningService.saveEmergencyPlanningState(restoredState);
          }

          setLastSaved(new Date());
          alert('Données restaurées avec succès !');
          console.log('📂 Données restaurées depuis le fichier');

        } catch (error) {
          console.error('Erreur lors de la restauration:', error);
          alert('Erreur lors de la lecture du fichier. Assurez-vous qu\'il s\'agit d\'un fichier de sauvegarde valide.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const getCurrentPlan = (): EmergencyPlan | undefined => {
    return planningState.selectedPerson === 'person1' 
      ? planningState.person1Plan 
      : planningState.person2Plan;
  };

  const getCurrentValidation = (): EmergencyPlanValidation | null => {
    return planningState.selectedPerson === 'person1' ? validation1 : validation2;
  };

  const updateCurrentPlan = (updatedPlan: EmergencyPlan) => {
    const newState = { ...planningState };
    if (planningState.selectedPerson === 'person1') {
      newState.person1Plan = updatedPlan;
    } else {
      newState.person2Plan = updatedPlan;
    }
    setPlanningState(newState);
  };

  const duplicatePlan = () => {
    if (!planningState.person1Plan || planningState.person2Plan) return;

    const person2Name = userData.personal?.prenom2 || 'Personne 2';
    const person2LastName = ''; // Pas de nom de famille dans la structure actuelle
    
    const duplicatedPlan = EmergencyPlanningService.duplicatePlan(
      planningState.person1Plan,
      'person2',
      person2LastName,
      person2Name
    );

    setPlanningState({
      ...planningState,
      person2Plan: duplicatedPlan
    });
  };


  const printPlan = () => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return;

    const printableData = EmergencyPlanningService.preparePrintablePlan(
      currentPlan,
      {
        contacts: true,
        medical: true,
        financial: true,
        insurance: true,
        legal: true,
        family: true,
        wishes: true
      },
      'complete',
      false // Ne pas inclure les informations privées par défaut
    );

    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintHTML(printableData));
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const generatePrintHTML = (printableData: any): string => {
    const plan = printableData.plan;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Plan d'urgence - ${plan.prenom} ${plan.nom}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
            .contact-item, .account-item { margin: 10px 0; padding: 10px; border: 1px solid #e5e7eb; border-radius: 5px; }
            .priority-high { border-left: 4px solid #dc2626; }
            .priority-medium { border-left: 4px solid #f59e0b; }
            .priority-low { border-left: 4px solid #10b981; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Plan d'urgence</h1>
            <h2>${plan.prenom} ${plan.nom}</h2>
            <p>Généré le ${new Date().toLocaleDateString('fr-CA')}</p>
          </div>
          
          <div class="section">
            <h3 class="section-title">Contacts d'urgence</h3>
            ${plan.contactsUrgence.map((contact: any) => `
              <div class="contact-item priority-${contact.priorite === 1 ? 'high' : contact.priorite === 2 ? 'medium' : 'low'}">
                <strong>${contact.prenom} ${contact.nom}</strong> (${contact.relation})<br>
                Téléphone: ${contact.telephone}<br>
                ${contact.email ? `Email: ${contact.email}<br>` : ''}
                Priorité: ${contact.priorite}
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h3 class="section-title">Informations médicales</h3>
            <p><strong>Numéro d'assurance maladie:</strong> ${plan.informationsMedicales.numeroAssuranceMaladie}</p>
            ${plan.informationsMedicales.groupeSanguin ? `<p><strong>Groupe sanguin:</strong> ${plan.informationsMedicales.groupeSanguin}</p>` : ''}
            <p><strong>Allergies:</strong> ${plan.informationsMedicales.allergies.join(', ') || 'Aucune'}</p>
            <p><strong>Conditions médicales:</strong> ${plan.informationsMedicales.conditionsMedicales.join(', ') || 'Aucune'}</p>
          </div>

          <div class="section">
            <h3 class="section-title">Comptes bancaires</h3>
            ${plan.comptesBancaires.map((compte: any) => `
              <div class="account-item">
                <strong>${compte.institution}</strong> - ${compte.type}<br>
                Numéro: ${compte.numeroCompte}<br>
                ${compte.beneficiaire ? `Bénéficiaire: ${compte.beneficiaire}` : ''}
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h3 class="section-title">Documents légaux</h3>
            ${plan.documentsLegaux.map((doc: any) => `
              <div class="account-item">
                <strong>${doc.titre}</strong> (${doc.type})<br>
                Créé le: ${new Date(doc.dateCreation).toLocaleDateString('fr-CA')}<br>
                Emplacement: ${doc.emplacement}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  };

  const currentPlan = getCurrentPlan();
  const currentValidation = getCurrentValidation();
  const hasSecondPerson = userData.personal?.prenom2;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec message d'importance renforcé */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-red-900 mb-3">
            Planification d'urgence
          </CardTitle>
          <CardDescription className="text-lg text-red-700 mb-4">
            Le dossier complet qui protège votre famille en cas d'imprévu
          </CardDescription>
          
          {/* Message d'importance critique */}
          <div className="bg-white/80 rounded-lg p-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">
                  Pourquoi ce plan d'urgence est-il essentiel ?
                </h4>
                <div className="text-sm text-red-800 space-y-2">
                  <p>
                    <strong>73% des Canadiens</strong> n'ont pas de plan d'urgence complet. 
                    En cas d'accident, d'invalidité ou de décès, leurs proches se retrouvent démunis 
                    face à des décisions critiques et urgentes.
                  </p>
                  <p>
                    <strong>Sans ce dossier :</strong> Vos proches perdront des semaines précieuses 
                    à chercher vos documents, contacts et volontés, souvent dans un moment de grande détresse émotionnelle.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-red-100 rounded-lg p-4">
                <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Temps critique
                </h5>
                <p className="text-sm text-red-800">
                  Les premières 48h sont cruciales. Ce dossier permet à vos proches 
                  d'agir rapidement et efficacement quand chaque minute compte.
                </p>
              </div>
              
              <div className="bg-orange-100 rounded-lg p-4">
                <h5 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Paix d'esprit
                </h5>
                <p className="text-sm text-orange-800">
                  Offrez à votre famille la sécurité de savoir exactement quoi faire 
                  et où trouver tout ce dont elle aura besoin.
                </p>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Outil professionnel gratuit :</strong> Ce module complet vous est offert 
                pour démontrer notre expertise en planification financière. Un dossier d'urgence 
                bien préparé fait partie intégrante d'une stratégie de retraite réussie.
              </AlertDescription>
            </Alert>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques et témoignages */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center text-blue-900 mb-4">
            L'importance d'un plan d'urgence : Les faits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">73%</div>
              <p className="text-sm text-gray-700">
                des Canadiens n'ont pas de plan d'urgence documenté
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">3-6</div>
              <p className="text-sm text-gray-700">
                semaines perdues en moyenne à retrouver les informations essentielles
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-sm text-gray-700">
                des familles préparées évitent le stress et les erreurs coûteuses
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white rounded-lg border-l-4 border-blue-500">
            <blockquote className="italic text-gray-700 mb-3">
              "Quand mon mari a eu son accident, j'étais complètement perdue. Je ne savais pas 
              où il gardait ses documents, quels étaient ses comptes bancaires, ni même qui contacter. 
              Un plan d'urgence m'aurait évité des semaines d'angoisse."
            </blockquote>
            <cite className="text-sm text-gray-600">— Marie L., Québec</cite>
          </div>
          
          <div className="mt-4 p-6 bg-white rounded-lg border-l-4 border-green-500">
            <blockquote className="italic text-gray-700 mb-3">
              "Grâce à notre dossier d'urgence, quand papa est décédé subitement, nous avons pu 
              nous concentrer sur notre deuil plutôt que sur la paperasse. Tout était organisé, 
              documenté et accessible."
            </blockquote>
            <cite className="text-sm text-gray-600">— Jean-Pierre M., Montréal</cite>
          </div>
        </CardContent>
      </Card>

      {/* Avantages du module */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center text-green-900 mb-4">
            Ce que vous obtenez avec ce module professionnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Dossier complet et structuré</h4>
                  <p className="text-sm text-green-800">
                    11 sections détaillées couvrant tous les aspects : contacts, médical, 
                    finances, propriétés, assurances, documents légaux, et plus.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Sécurité et confidentialité</h4>
                  <p className="text-sm text-green-800">
                    Sauvegarde locale sécurisée, conseils de protection contre les sinistres, 
                    et gestion des accès selon vos besoins.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Export et impression</h4>
                  <p className="text-sm text-green-800">
                    Générez des versions imprimables ou des fichiers de sauvegarde 
                    pour partager avec vos proches de confiance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Support pour couples</h4>
                  <p className="text-sm text-green-800">
                    Créez des plans séparés pour chaque conjoint ou dupliquez 
                    facilement les informations communes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Liste de vérification décès</h4>
                  <p className="text-sm text-green-800">
                    Guide étape par étape pour vos proches avec 25+ actions 
                    organisées par priorité et délai.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Validation intelligente</h4>
                  <p className="text-sm text-green-800">
                    Le système détecte automatiquement les informations manquantes 
                    et vous guide pour compléter votre dossier.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Expertise professionnelle</h4>
                <p className="text-sm text-green-700">
                  Développé par des conseillers financiers expérimentés
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Ce module gratuit démontre notre engagement à vous offrir des outils professionnels 
              de qualité supérieure. Il fait partie intégrante d'une approche holistique de la 
              planification financière et de retraite que nous proposons à nos clients.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de personne */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sélection du profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={planningState.selectedPerson}
              onValueChange={(value: 'person1' | 'person2') => 
                setPlanningState({ ...planningState, selectedPerson: value })
              }
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getSelectOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{option.icon}</span>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasSecondPerson && !planningState.person2Plan && (
              <Button onClick={duplicatePlan} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Dupliquer le plan de la personne 1
              </Button>
            )}
          </div>

          {/* Actions simplifiées */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Button 
                onClick={saveToFile} 
                disabled={isSaving} 
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder sur mon ordinateur'}
              </Button>
              
              <Button 
                onClick={restoreFromFile} 
                variant="outline"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Restaurer depuis un fichier
              </Button>
              
              <Button 
                onClick={printPlan} 
                disabled={!currentPlan} 
                variant="outline"
                size="lg"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimer
              </Button>

              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
                  <Clock className="w-4 h-4" />
                  Dernière sauvegarde: {lastSaved.toLocaleString('fr-CA')}
                </div>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Conseil :</strong> Utilisez "Sauvegarder sur mon ordinateur" pour créer un fichier de sauvegarde 
                que vous pouvez conserver en sécurité. Le fichier sera nommé automatiquement avec la date et l'heure 
                (ex: Plan-retraite-20250823-14h30.json).
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Validation et progression */}
      {currentPlan && currentValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              État du plan - {currentPlan.prenom} {currentPlan.nom}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barre de progression */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm text-gray-600">{currentValidation.completionPercentage}%</span>
                </div>
                <Progress value={currentValidation.completionPercentage} className="h-2" />
              </div>

              {/* Résumé */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{currentPlan.contactsUrgence.length}</div>
                  <div className="text-xs text-gray-600">Contacts</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">{currentPlan.comptesBancaires.length}</div>
                  <div className="text-xs text-gray-600">Comptes</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-purple-600">{currentPlan.assurances.length}</div>
                  <div className="text-xs text-gray-600">Assurances</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <FileCheck className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-orange-600">{currentPlan.documentsLegaux.length}</div>
                  <div className="text-xs text-gray-600">Documents</div>
                </div>
              </div>

              {/* Alertes */}
              {currentValidation.criticalIssues.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Problèmes critiques</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {currentValidation.criticalIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {currentValidation.warnings.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Avertissements</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {currentValidation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {currentValidation.missingFields.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Champs manquants</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {currentValidation.missingFields.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun plan sélectionné */}
      {!currentPlan && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun plan d'urgence
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer un plan d'urgence pour vous protéger et protéger vos proches.
            </p>
            <Button onClick={initializeEmptyPlans}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un plan d'urgence
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulaires détaillés */}
      {currentPlan && (
        <Tabs defaultValue="contacts" className="space-y-6">
          {/* Navigation principale */}
          <div className="space-y-2">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="contacts" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Médical</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Finances</span>
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Propriétés</span>
              </TabsTrigger>
              <TabsTrigger value="digital" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Numérique</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="insurance" className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Assurances</span>
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-1">
                <FileCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Famille</span>
              </TabsTrigger>
              <TabsTrigger value="wishes" className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Volontés</span>
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Liste</span>
              </TabsTrigger>
              <TabsTrigger value="evacuation" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Évacuation</span>
              </TabsTrigger>
              <TabsTrigger value="medical-complete" className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Médical+</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Sécurité</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contacts">
            <EmergencyContactsForm
              contacts={currentPlan.contactsUrgence}
              onChange={(contacts) => updateCurrentPlan({
                ...currentPlan,
                contactsUrgence: contacts,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="medical">
            <MedicalInfoForm
              medicalInfo={currentPlan.informationsMedicales}
              onChange={(medicalInfo) => updateCurrentPlan({
                ...currentPlan,
                informationsMedicales: medicalInfo,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialAccountsForm
              accounts={currentPlan.comptesBancaires}
              onChange={(accounts) => updateCurrentPlan({
                ...currentPlan,
                comptesBancaires: accounts,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="properties">
            <PropertiesForm
              properties={currentPlan.proprietes || []}
              onChange={(properties) => updateCurrentPlan({
                ...currentPlan,
                proprietes: properties,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="digital">
            <DigitalAccessForm
              digitalAccess={currentPlan.accesNumeriques || []}
              onChange={(digitalAccess) => updateCurrentPlan({
                ...currentPlan,
                accesNumeriques: digitalAccess,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="insurance">
            <InsuranceForm
              insurances={currentPlan.assurances || []}
              onChange={(insurances) => updateCurrentPlan({
                ...currentPlan,
                assurances: insurances,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="legal">
            <LegalDocumentsForm
              documents={currentPlan.documentsLegaux || []}
              onChange={(documents) => updateCurrentPlan({
                ...currentPlan,
                documentsLegaux: documents,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="family">
            <FamilyResponsibilitiesForm
              responsibilities={currentPlan.responsabilitesFamiliales || []}
              pets={currentPlan.animauxCompagnie || []}
              onChange={(responsibilities, pets) => updateCurrentPlan({
                ...currentPlan,
                responsabilitesFamiliales: responsibilities,
                animauxCompagnie: pets,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="wishes">
            <FuneralWishesForm
              funeralWishes={currentPlan.volontesSpecifiques?.funerailles ? {
                disposition: currentPlan.volontesSpecifiques.funerailles.type as any,
                typeCeremonie: currentPlan.volontesSpecifiques.funerailles.ceremonieReligieuse ? 'religieuse' : 'civile',
                lieuCeremonie: currentPlan.volontesSpecifiques.funerailles.lieu,
                instructionsSpeciales: currentPlan.volontesSpecifiques.funerailles.volontesSpeciales,
                budgetEstime: currentPlan.volontesSpecifiques.funerailles.budgetEstime,
                prearrangements: currentPlan.volontesSpecifiques.funerailles.prearrangements ? [{
                  id: EmergencyPlanningService.generateId(),
                  entreprise: currentPlan.volontesSpecifiques.funerailles.prearrangements.entreprise || '',
                  numeroContrat: currentPlan.volontesSpecifiques.funerailles.prearrangements.numeroContrat || '',
                  lieuContrat: currentPlan.volontesSpecifiques.funerailles.prearrangements.lieuContrat
                }] : [],
                salonFuneraire: currentPlan.volontesSpecifiques.funerailles.salonFuneraire,
                cemetery: currentPlan.volontesSpecifiques.funerailles.cimetiere ? {
                  nom: currentPlan.volontesSpecifiques.funerailles.cimetiere.nom || '',
                  adresse: currentPlan.volontesSpecifiques.funerailles.cimetiere.adresse || '',
                  numeroLot: currentPlan.volontesSpecifiques.funerailles.cimetiere.numeroLot,
                  personnesInhumees: currentPlan.volontesSpecifiques.funerailles.cimetiere.personnesInhumees
                } : undefined
              } : EmergencyPlanningService.createEmptyFuneralWishes()}
              onChange={(funeralWishes) => updateCurrentPlan({
                ...currentPlan,
                volontesSpecifiques: {
                  ...currentPlan.volontesSpecifiques,
                  funerailles: {
                    type: funeralWishes.disposition as any || 'inhumation',
                    lieu: funeralWishes.lieuCeremonie,
                    ceremonieReligieuse: funeralWishes.typeCeremonie === 'religieuse',
                    typeService: 'prive',
                    volontesSpeciales: funeralWishes.instructionsSpeciales,
                    budgetEstime: funeralWishes.budgetEstime,
                    prearrangements: funeralWishes.prearrangements && funeralWishes.prearrangements.length > 0 ? {
                      effectues: true,
                      entreprise: funeralWishes.prearrangements[0].entreprise,
                      numeroContrat: funeralWishes.prearrangements[0].numeroContrat,
                      lieuContrat: funeralWishes.prearrangements[0].lieuContrat
                    } : undefined,
                    salonFuneraire: funeralWishes.salonFuneraire,
                    cimetiere: funeralWishes.cemetery
                  }
                },
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="checklist">
            <DeathChecklistForm
              checklist={currentPlan.listeVerificationDeces && currentPlan.listeVerificationDeces.length > 0 
                ? currentPlan.listeVerificationDeces[0] 
                : EmergencyPlanningService.createEmptyDeathChecklist()
              }
              onChange={(checklist) => updateCurrentPlan({
                ...currentPlan,
                listeVerificationDeces: [checklist],
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="evacuation">
            <EvacuationChecklistForm
              checklist={currentPlan.listeEvacuation || {
                items: [],
                customItems: [],
                lastUpdated: new Date(),
                personalNotes: ''
              }}
              onChange={(checklist) => updateCurrentPlan({
                ...currentPlan,
                listeEvacuation: checklist,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="medical-complete">
            <ComprehensiveMedicalRecordForm
              medicalRecord={currentPlan.dossierMedicalComplet || {
                personalInfo: {
                  height: '',
                  weight: '',
                  allergies: [],
                  emergencyContact: {
                    name: '',
                    phone: '',
                    relation: ''
                  }
                },
                currentConditions: [],
                medicalHistory: [],
                currentMedications: [],
                pastMedications: [],
                surgeries: [],
                vaccinations: [],
                labResults: [],
                familyHistory: [],
                healthcareProviders: {
                  specialists: []
                },
                notes: '',
                lastUpdated: new Date()
              }}
              onChange={(medicalRecord) => updateCurrentPlan({
                ...currentPlan,
                dossierMedicalComplet: medicalRecord,
                derniereMiseAJour: new Date()
              })}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTipsForm />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
