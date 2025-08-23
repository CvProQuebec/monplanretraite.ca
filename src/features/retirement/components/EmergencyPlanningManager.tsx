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
import { formatCurrency } from '../utils/formatters';

interface EmergencyPlanningManagerProps {
  className?: string;
}

export const EmergencyPlanningManager: React.FC<EmergencyPlanningManagerProps> = ({ className }) => {
  const { userData } = useRetirementData();
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

  const saveState = async () => {
    setIsSaving(true);
    try {
      // Sauvegarde par défaut : données combinées + planification d'urgence
      IndividualSaveService.saveDefault(userData, planningState);
      
      // Sauvegarde traditionnelle de la planification d'urgence
      EmergencyPlanningService.saveEmergencyPlanningState(planningState);
      
      setLastSaved(new Date());
      console.log('💾 Sauvegarde complète effectuée (combinée + urgence)');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const savePerson1Individual = async () => {
    setIsSaving(true);
    try {
      IndividualSaveService.savePerson1Individual(userData);
      setLastSaved(new Date());
      console.log('💾 Données Personne 1 sauvegardées individuellement');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde Personne 1:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const savePerson2Individual = async () => {
    setIsSaving(true);
    try {
      IndividualSaveService.savePerson2Individual(userData);
      setLastSaved(new Date());
      console.log('💾 Données Personne 2 sauvegardées individuellement');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde Personne 2:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportPerson1 = () => {
    IndividualSaveService.exportPerson1Individual(userData);
  };

  const exportPerson2 = () => {
    IndividualSaveService.exportPerson2Individual(userData);
  };

  const exportCombined = () => {
    IndividualSaveService.exportCombinedFinancialData(userData);
  };

  const exportEmergencyOnly = () => {
    IndividualSaveService.exportEmergencyPlanning(planningState);
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

  const exportPlans = () => {
    // Export par défaut : données combinées
    exportCombined();
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
                <SelectItem value="person1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {planningState.person1Plan?.prenom || 'Personne 1'} {planningState.person1Plan?.nom || ''}
                  </div>
                </SelectItem>
                {hasSecondPerson && (
                  <SelectItem value="person2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {planningState.person2Plan?.prenom || userData.personal?.prenom2 || 'Personne 2'} {planningState.person2Plan?.nom || ''}
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {hasSecondPerson && !planningState.person2Plan && (
              <Button onClick={duplicatePlan} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Dupliquer le plan de la personne 1
              </Button>
            )}
          </div>

          {/* Actions globales */}
          <div className="space-y-4">
            {/* Actions principales */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveState} disabled={isSaving} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder (Combiné)'}
              </Button>
              
              <Button onClick={printPlan} disabled={!currentPlan} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              
              <Button onClick={exportPlans} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter (Combiné)
              </Button>

              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
                  <Clock className="w-4 h-4" />
                  Dernière sauvegarde: {lastSaved.toLocaleString('fr-CA')}
                </div>
              )}
            </div>

            {/* Actions individuelles */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Sauvegardes et exports individuels :</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personne 1 */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-blue-700">
                    {planningState.person1Plan?.prenom || 'Personne 1'}
                  </h5>
                  <div className="flex gap-2">
                    <Button 
                      onClick={savePerson1Individual} 
                      disabled={isSaving} 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Sauvegarder
                    </Button>
                    <Button 
                      onClick={exportPerson1} 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Exporter
                    </Button>
                  </div>
                </div>

                {/* Personne 2 */}
                {hasSecondPerson && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-purple-700">
                      {planningState.person2Plan?.prenom || userData.personal?.prenom2 || 'Personne 2'}
                    </h5>
                    <div className="flex gap-2">
                      <Button 
                        onClick={savePerson2Individual} 
                        disabled={isSaving} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Sauvegarder
                      </Button>
                      <Button 
                        onClick={exportPerson2} 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Export planification d'urgence séparée */}
              <div className="mt-4 pt-3 border-t">
                <Button 
                  onClick={exportEmergencyOnly} 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Exporter planification d'urgence uniquement
                </Button>
              </div>
            </div>
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

      {/* Placeholder pour les formulaires détaillés */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Formulaire détaillé</CardTitle>
            <CardDescription>
              Les formulaires détaillés pour chaque section seront implémentés dans les prochains composants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Phone className="w-6 h-6 mb-2" />
                Contacts d'urgence
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Heart className="w-6 h-6 mb-2" />
                Informations médicales
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <CreditCard className="w-6 h-6 mb-2" />
                Comptes bancaires
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Shield className="w-6 h-6 mb-2" />
                Assurances
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <FileCheck className="w-6 h-6 mb-2" />
                Documents légaux
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Home className="w-6 h-6 mb-2" />
                Responsabilités familiales
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
