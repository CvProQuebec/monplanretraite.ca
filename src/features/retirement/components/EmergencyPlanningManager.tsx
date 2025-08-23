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
      {/* En-tête */}
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
          <CardDescription className="text-lg text-red-700">
            Préparez-vous aux situations d'urgence, d'invalidité ou de décès
          </CardDescription>
        </CardHeader>
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
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
              <span className="hidden sm:inline">Comptes</span>
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Assurances</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-1">
              <FileCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Famille</span>
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Assurances
                </CardTitle>
                <CardDescription>
                  Formulaire d'assurances à implémenter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Formulaire en cours de développement...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-orange-600" />
                  Documents légaux
                </CardTitle>
                <CardDescription>
                  Formulaire de documents légaux à implémenter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Formulaire en cours de développement...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  Responsabilités familiales
                </CardTitle>
                <CardDescription>
                  Formulaire de responsabilités familiales à implémenter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Formulaire en cours de développement...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
