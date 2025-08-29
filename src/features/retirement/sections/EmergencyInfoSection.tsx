// Section principale "Informations en cas d'urgence"
// Respectant la typographie québécoise et l'accessibilité

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Users, 
  PawPrint, 
  Briefcase, 
  FileText, 
  Stethoscope,
  Home,
  Building,
  CreditCard,
  TrendingUp,
  Globe,
  Shield,
  FileCheck,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmergencyInfoService } from '../services/EmergencyInfoService';
import { EmergencyInfoData } from '../types/emergency-info';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../hooks/useLanguage';

// Composants des sections
import { EmergencyContactsTab } from '../components/emergency/EmergencyContactsTab';
import { MedicalInfoTab } from '../components/emergency/MedicalInfoTab';
import { DependentsTab } from '../components/emergency/DependentsTab';
import { EmploymentTab } from '../components/emergency/EmploymentTab';
import { DocumentsTab } from '../components/emergency/DocumentsTab';
import { PropertiesTab } from '../components/emergency/PropertiesTab';
import { FinancialTab } from '../components/emergency/FinancialTab';
import { DigitalTab } from '../components/emergency/DigitalTab';
import { InsuranceTab } from '../components/emergency/InsuranceTab';
import { SuccessionTab } from '../components/emergency/SuccessionTab';

export const EmergencyInfoSection: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('urgence');
  const [data, setData] = useState<EmergencyInfoData>(EmergencyInfoService.getData());
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Traductions
  const translations = {
    fr: {
      title: 'Informations en cas d\'urgence',
      subtitle: 'Préparez vos proches pour toute situation d\'urgence ou d\'incapacité',
      description: 'Ce module vous permet de centraliser toutes les informations importantes que vos proches pourraient avoir besoin en cas d\'urgence, d\'accident ou d\'incapacité.',
      securityNote: 'Toutes vos informations sont sauvegardées localement sur votre appareil. Aucune donnée n\'est transmise à nos serveurs.',
      completionProgress: 'Progression de votre dossier',
      lastSaved: 'Dernière sauvegarde',
      save: 'Sauvegarder',
      export: 'Exporter',
      import: 'Importer',
      reset: 'Réinitialiser',
      saving: 'Sauvegarde...',
      saved: 'Sauvegardé avec succès',
      error: 'Erreur lors de la sauvegarde',
      tabs: {
        urgence: 'Urgence',
        medical: 'Médical',
        dependants: 'Personnes à charge',
        emploi: 'Emploi',
        documents: 'Documents',
        proprietes: 'Propriétés',
        financier: 'Financier',
        numerique: 'Numérique',
        assurances: 'Assurances',
        succession: 'Succession'
      }
    },
    en: {
      title: 'Emergency Information',
      subtitle: 'Prepare your loved ones for any emergency or incapacity situation',
      description: 'This module allows you to centralize all the important information your loved ones might need in case of emergency, accident, or incapacity.',
      securityNote: 'All your information is saved locally on your device. No data is transmitted to our servers.',
      completionProgress: 'File completion progress',
      lastSaved: 'Last saved',
      save: 'Save',
      export: 'Export',
      import: 'Import',
      reset: 'Reset',
      saving: 'Saving...',
      saved: 'Successfully saved',
      error: 'Error saving',
      tabs: {
        urgence: 'Emergency',
        medical: 'Medical',
        dependants: 'Dependents',
        emploi: 'Employment',
        documents: 'Documents',
        proprietes: 'Properties',
        financier: 'Financial',
        numerique: 'Digital',
        assurances: 'Insurance',
        succession: 'Succession'
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  // Sauvegarder les données
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const success = EmergencyInfoService.saveData(data);
      
      if (success) {
        setLastSaved(new Date());
        toast({
          title: t.saved,
          description: 'Vos informations ont été sauvegardées localement',
          variant: 'default'
        });
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      toast({
        title: t.error,
        description: 'Impossible de sauvegarder vos informations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Exporter les données
  const handleExport = () => {
    try {
      const jsonData = EmergencyInfoService.exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informations-urgence-${new Date().toLocaleDateString('fr-CA')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export réussi',
        description: 'Vos informations ont été exportées',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter vos informations',
        variant: 'destructive'
      });
    }
  };

  // Importer des données
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const success = EmergencyInfoService.importData(jsonString);
        
        if (success) {
          setData(EmergencyInfoService.getData());
          toast({
            title: 'Import réussi',
            description: 'Vos informations ont été importées',
            variant: 'default'
          });
        } else {
          throw new Error('Format de fichier invalide');
        }
      } catch (error) {
        toast({
          title: 'Erreur d\'import',
          description: 'Le fichier n\'est pas dans le bon format',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  // Réinitialiser les données
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos informations ? Cette action est irréversible.')) {
      EmergencyInfoService.resetData();
      setData(EmergencyInfoService.getData());
      setLastSaved(null);
      
      toast({
        title: 'Réinitialisation effectuée',
        description: 'Toutes vos informations ont été supprimées',
        variant: 'default'
      });
    }
  };

  // Mettre à jour les données
  const updateData = (newData: Partial<EmergencyInfoData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  // Obtenir les statistiques de progression
  const stats = EmergencyInfoService.getUsageStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules animées en arrière-plan */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      <div className="space-y-6 relative z-10 p-6">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            {t.subtitle}
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* En-tête avec informations */}
        <Card className="bg-gradient-to-br from-red-800/90 to-orange-800/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Note de sécurité */}
        <Alert className="border-blue-400 bg-blue-900/20 text-blue-200 mb-8">
          <Shield className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200 text-lg">
            <strong>Sécurité :</strong> {t.securityNote}
          </AlertDescription>
        </Alert>

        {/* Progression */}
        <Card className="bg-gradient-to-br from-green-800/90 to-emerald-800/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileCheck className="w-5 h-5 text-green-400" />
              {t.completionProgress}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={stats.pourcentageCompletion} className="flex-1 bg-green-900" />
              <Badge variant="secondary" className="bg-green-400 text-green-900">
                {stats.pourcentageCompletion} %
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-400">{stats.contactsCompletes}</div>
                <div className="text-green-200">Contacts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-400">{stats.sectionsCompletes}</div>
                <div className="text-green-200">Sections</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-400">{stats.totalSections}</div>
                <div className="text-green-200">Total</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-400">
                  {lastSaved ? lastSaved.toLocaleDateString('fr-CA') : 'Jamais'}
                </div>
                <div className="text-green-200">{t.lastSaved}</div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Actions principales */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {t.export}
            </Button>
            
            <Button variant="outline" asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {t.import}
              </label>
            </Button>
            
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            
            <Button variant="outline" onClick={handleReset} className="text-red-600 hover:text-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.reset}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interface principale avec onglets */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
              <TabsTrigger value="urgence" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.urgence}</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.medical}</span>
              </TabsTrigger>
              <TabsTrigger value="dependants" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.dependants}</span>
              </TabsTrigger>
              <TabsTrigger value="emploi" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.emploi}</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.documents}</span>
              </TabsTrigger>
              <TabsTrigger value="proprietes" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.proprietes}</span>
              </TabsTrigger>
              <TabsTrigger value="financier" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.financier}</span>
              </TabsTrigger>
              <TabsTrigger value="numerique" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.numerique}</span>
              </TabsTrigger>
              <TabsTrigger value="assurances" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.assurances}</span>
              </TabsTrigger>
              <TabsTrigger value="succession" className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span className="hidden lg:inline">{t.tabs.succession}</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <TabsContent value="urgence" className="mt-0">
                  <EmergencyContactsTab 
                    data={data.contactsUrgence} 
                    onUpdate={(contacts) => updateData({ contactsUrgence: contacts })}
                  />
                </TabsContent>

                <TabsContent value="medical" className="mt-0">
                  <MedicalInfoTab 
                    data={data.informationsMedicales} 
                    onUpdate={(medical) => updateData({ informationsMedicales: medical })}
                  />
                </TabsContent>

                <TabsContent value="dependants" className="mt-0">
                  <DependentsTab 
                    data={data.personnesCharge} 
                    onUpdate={(dependants) => updateData({ personnesCharge: dependants })}
                  />
                </TabsContent>

                <TabsContent value="emploi" className="mt-0">
                  <EmploymentTab 
                    data={data.emploiPrestations} 
                    onUpdate={(emploi) => updateData({ emploiPrestations: emploi })}
                  />
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <DocumentsTab 
                    data={data.documentsImportants} 
                    onUpdate={(documents) => updateData({ documentsImportants: documents })}
                  />
                </TabsContent>

                <TabsContent value="proprietes" className="mt-0">
                  <PropertiesTab 
                    data={data.proprietes} 
                    biensEntreposes={data.biensEntreposes}
                    onUpdate={(proprietes, biensEntreposes) => updateData({ proprietes, biensEntreposes })}
                  />
                </TabsContent>

                <TabsContent value="financier" className="mt-0">
                  <FinancialTab 
                    data={data.informationsFinancieres} 
                    investissements={data.investissements}
                    comptesEnLigne={data.comptesEnLigne}
                    onUpdate={(financier, investissements, comptesEnLigne) => 
                      updateData({ informationsFinancieres: financier, investissements, comptesEnLigne })
                    }
                  />
                </TabsContent>

                <TabsContent value="numerique" className="mt-0">
                  <DigitalTab 
                    accesNumerique={data.accesNumerique}
                    comptesCourriels={data.comptesCourriels}
                    reseauxSociaux={data.reseauxSociaux}
                    onUpdate={(acces, courriels, reseaux) => 
                      updateData({ accesNumerique: acces, comptesCourriels: courriels, reseauxSociaux: reseaux })
                    }
                  />
                </TabsContent>

                <TabsContent value="assurances" className="mt-0">
                  <InsuranceTab 
                    data={data.assurances} 
                    onUpdate={(assurances) => updateData({ assurances })}
                  />
                </TabsContent>

                <TabsContent value="succession" className="mt-0">
                  <SuccessionTab 
                    testamentSuccession={data.testamentSuccession}
                    preferencesFuneraires={data.preferencesFuneraires}
                    salonFuneraire={data.salonFuneraire}
                    cimetiere={data.cimetiere}
                    autresInstructions={data.autresInstructions}
                    onUpdate={(succession) => updateData(succession)}
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
