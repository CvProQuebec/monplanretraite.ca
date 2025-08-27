import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Save, AlertCircle, CheckCircle, Users, FileText, Heart, Gift, Calculator, Building } from 'lucide-react';
import { usePersonNames } from '../hooks/usePersonNames';
import { SuccessionPlan, SuccessionPlanningState, VolontesFuneraires } from '../types/succession-planning';
import { BeneficiairesForm } from './succession/BeneficiairesForm';
import { ActifsForm } from './succession/ActifsForm';
import { DocumentsForm } from './succession/DocumentsForm';
import { FuneraillesForm } from './succession/FuneraillesForm';
import { DonsForm } from './succession/DonsForm';
import { FiscaliteForm } from './succession/FiscaliteForm';

const STORAGE_KEY = 'succession_planning_data';

const createInitialSuccessionPlan = (personId: 'person1' | 'person2', nom: string = '', prenom: string = ''): SuccessionPlan => ({
  personId,
  nom,
  prenom,
  beneficiaires: [],
  actifs: [],
  documentsLegaux: [],
  volontesFuneraires: {
    type: 'inhumation',
    ceremonieReligieuse: false,
    typeService: 'prive'
  } as VolontesFuneraires,
  donsCaritables: [],
  considerationsFiscales: [],
  dateCreation: new Date(),
  derniereMiseAJour: new Date(),
  version: 1,
  statut: 'brouillon'
});

export const SuccessionPlanningManager: React.FC = () => {
  const { getPersonDisplayName, personNames } = usePersonNames();
  const [selectedPerson, setSelectedPerson] = useState<'person1' | 'person2'>('person1');
  const [activeTab, setActiveTab] = useState('beneficiaires');
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [state, setState] = useState<SuccessionPlanningState>({
    person1Plan: createInitialSuccessionPlan('person1', personNames.person1.lastName, personNames.person1.firstName),
    person2Plan: createInitialSuccessionPlan('person2', personNames.person2.lastName, personNames.person2.firstName),
    selectedPerson: 'person1',
    isEditing: false
  });

  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setState(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  // Sauvegarder automatiquement dans le localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentPlan = selectedPerson === 'person1' ? state.person1Plan : state.person2Plan;

  const updateCurrentPlan = (updates: Partial<SuccessionPlan>) => {
    setState(prev => ({
      ...prev,
      [`${selectedPerson}Plan`]: {
        ...currentPlan,
        ...updates,
        derniereMiseAJour: new Date()
      },
      lastSaved: new Date()
    }));
  };

  const validatePlan = (plan: SuccessionPlan | undefined): string[] => {
    const errors: string[] = [];
    
    if (!plan) {
      errors.push('Plan non initialisé');
      return errors;
    }
    
    if (plan.beneficiaires.length === 0) {
      errors.push('Aucun bénéficiaire défini');
    }
    
    if (plan.actifs.length === 0) {
      errors.push('Aucun actif répertorié');
    }
    
    if (plan.documentsLegaux.length === 0) {
      errors.push('Aucun document légal enregistré');
    }
    
    if (!plan.volontesFuneraires.type) {
      errors.push('Type de funérailles non spécifié');
    }
    
    return errors;
  };

  const handleValidation = () => {
    const errors = validatePlan(currentPlan);
    setValidationErrors(errors);
    setShowValidationAlert(true);
    setTimeout(() => setShowValidationAlert(false), 5000);
  };

  const saveToFile = () => {
    const currentPersonName = getPersonDisplayName(selectedPerson, 'display');
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(/:/g, 'h');
    const filename = `planification_successorale_${currentPersonName.replace(/\s+/g, '_')}_${timestamp}.json`;
    
    const dataToSave = {
      person: selectedPerson,
      personName: currentPersonName,
      data: currentPlan,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const restoreFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.data && importedData.person) {
          const currentPersonName = getPersonDisplayName(selectedPerson, 'display');
          const confirmRestore = window.confirm(
            `Voulez-vous vraiment remplacer toutes les données actuelles de ${currentPersonName} par celles du fichier?\n\nCette action est irréversible.`
          );
          
          if (confirmRestore) {
            setState(prev => ({
              ...prev,
              [`${selectedPerson}Plan`]: importedData.data,
              lastSaved: new Date()
            }));
            
            alert('Données restaurées avec succès!');
          }
        } else {
          alert('Format de fichier invalide');
        }
      } catch (error) {
        alert('Erreur lors de la lecture du fichier');
        console.error('Erreur:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const printPlan = () => {
    const currentPersonName = getPersonDisplayName(selectedPerson, 'display');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Planification Successorale - ${currentPersonName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .item { margin: 10px 0; padding: 10px; border: 1px solid #e5e7eb; }
            .no-data { color: #6b7280; font-style: italic; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Planification Successorale</h1>
            <h2>${currentPersonName}</h2>
            <p>Généré le ${new Date().toLocaleDateString('fr-CA')}</p>
          </div>
          
          <div class="section">
            <h2>Bénéficiaires</h2>
            ${currentPlan && currentPlan.beneficiaires.length > 0 
              ? currentPlan.beneficiaires.map(b => `
                <div class="item">
                  <strong>${b.prenom} ${b.nom}</strong> - ${b.relation}<br>
                  ${b.pourcentage ? `Pourcentage: ${b.pourcentage}%` : ''}
                  ${b.montantFixe ? `Montant fixe: ${b.montantFixe.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}` : ''}<br>
                  Type de legs: ${b.typeLegs}
                </div>
              `).join('')
              : '<p class="no-data">Aucun bénéficiaire défini</p>'
            }
          </div>
          
          <div class="section">
            <h2>Actifs</h2>
            ${currentPlan && currentPlan.actifs.length > 0 
              ? currentPlan.actifs.map(a => `
                <div class="item">
                  <strong>${a.nom}</strong> - ${a.type}<br>
                  Valeur estimée: ${a.valeurEstimee.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}<br>
                  ${a.description ? `Description: ${a.description}` : ''}
                </div>
              `).join('')
              : '<p class="no-data">Aucun actif répertorié</p>'
            }
          </div>
          
          <div class="section">
            <h2>Souhaits Funéraires</h2>
            <div class="item">
              <strong>Type:</strong> ${currentPlan?.volontesFuneraires.type || 'Non spécifié'}<br>
              <strong>Lieu:</strong> ${currentPlan?.volontesFuneraires.lieu || 'Non spécifié'}<br>
              ${currentPlan?.volontesFuneraires.budgetEstime ? `<strong>Budget:</strong> ${currentPlan.volontesFuneraires.budgetEstime.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}<br>` : ''}
              ${currentPlan?.volontesFuneraires.volontesSpeciales ? `<strong>Souhaits spécifiques:</strong> ${currentPlan.volontesFuneraires.volontesSpeciales}` : ''}
            </div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getCompletionStats = () => {
    if (!currentPlan) {
      return { completed: 0, total: 6, percentage: 0 };
    }
    
    const sections = [
      { key: 'beneficiaires', completed: currentPlan.beneficiaires.length > 0 },
      { key: 'actifs', completed: currentPlan.actifs.length > 0 },
      { key: 'documents', completed: currentPlan.documentsLegaux.length > 0 },
      { key: 'funerailles', completed: !!currentPlan.volontesFuneraires.type },
      { key: 'dons', completed: currentPlan.donsCaritables.length > 0 },
      { key: 'fiscalite', completed: currentPlan.considerationsFiscales.length > 0 }
    ];
    
    const completed = sections.filter(s => s.completed).length;
    return { completed, total: sections.length, percentage: Math.round((completed / sections.length) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête avec sélection de personne */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Planification Successorale
              </CardTitle>
              <CardDescription>
                Organisez votre succession et vos dernières volontés
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Select value={selectedPerson} onValueChange={(value: 'person1' | 'person2') => setSelectedPerson(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {getPersonDisplayName('person1', 'display')}
                    </div>
                  </SelectItem>
                  <SelectItem value="person2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {getPersonDisplayName('person2', 'display')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant={stats.percentage === 100 ? "default" : "secondary"}>
                {stats.completed}/{stats.total} sections ({stats.percentage}%)
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alertes */}
      {showSaveAlert && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Planification sauvegardée avec succès!
          </AlertDescription>
        </Alert>
      )}

      {showValidationAlert && (
        <Alert className={validationErrors.length > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
          <AlertCircle className={`h-4 w-4 ${validationErrors.length > 0 ? 'text-orange-600' : 'text-green-600'}`} />
          <AlertDescription className={validationErrors.length > 0 ? 'text-orange-800' : 'text-green-800'}>
            {validationErrors.length > 0 ? (
              <div>
                <div className="font-medium mb-2">Sections à compléter:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              'Planification complète! Toutes les sections principales sont remplies.'
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="beneficiaires" className="text-xs">
            <Users className="h-4 w-4 mr-1" />
            Bénéficiaires
          </TabsTrigger>
          <TabsTrigger value="actifs" className="text-xs">
            <Building className="h-4 w-4 mr-1" />
            Actifs
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">
            <FileText className="h-4 w-4 mr-1" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="funerailles" className="text-xs">
            <Heart className="h-4 w-4 mr-1" />
            Funérailles
          </TabsTrigger>
          <TabsTrigger value="dons" className="text-xs">
            <Gift className="h-4 w-4 mr-1" />
            Dons
          </TabsTrigger>
          <TabsTrigger value="fiscalite" className="text-xs">
            <Calculator className="h-4 w-4 mr-1" />
            Fiscalité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="beneficiaires">
          <BeneficiairesForm
            beneficiaires={currentPlan.beneficiaires}
            onUpdate={(beneficiaires) => updateCurrentPlan({ beneficiaires })}
          />
        </TabsContent>

        <TabsContent value="actifs">
          <ActifsForm
            actifs={currentPlan.actifs}
            onUpdate={(actifs) => updateCurrentPlan({ actifs })}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsForm
            documents={currentPlan.documentsLegaux}
            onUpdate={(documentsLegaux) => updateCurrentPlan({ documentsLegaux })}
          />
        </TabsContent>

        <TabsContent value="funerailles">
          <FuneraillesForm
            volontes={currentPlan.volontesFuneraires}
            onUpdate={(volontesFuneraires) => updateCurrentPlan({ volontesFuneraires })}
          />
        </TabsContent>

        <TabsContent value="dons">
          <DonsForm
            dons={currentPlan.donsCaritables}
            onUpdate={(donsCaritables) => updateCurrentPlan({ donsCaritables })}
          />
        </TabsContent>

        <TabsContent value="fiscalite">
          <FiscaliteForm
            considerations={currentPlan.considerationsFiscales}
            onUpdate={(considerationsFiscales) => updateCurrentPlan({ considerationsFiscales })}
          />
        </TabsContent>
      </Tabs>

      {/* Actions principales - DÉPLACÉES VERS LE BAS */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleValidation} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider
            </Button>
            
            <Button onClick={saveToFile} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={restoreFromFile}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="restore-file"
              />
              <Button variant="outline" asChild>
                <label htmlFor="restore-file" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Restaurer
                </label>
              </Button>
            </div>
            
            <Button onClick={printPlan} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
