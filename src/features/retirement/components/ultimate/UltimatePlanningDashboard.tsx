// Tableau de bord du plan Ultimate (300 $)
// Planification successorale avancée et rapports de préparation
// Respectant la typographie québécoise et les limites professionnelles

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  FileText, 
  TrendingUp, 
  Shield, 
  Users, 
  Download, 
  Upload, 
  RefreshCw, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Share2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UltimatePlanningService } from '../../services/UltimatePlanningService';
import { UltimatePlanningData, PreparationReport, FinancialSimulation } from '../../types/ultimate-planning';
import { EmergencyInfoService } from '../../services/EmergencyInfoService';
import { EmergencyInfoData } from '../../types/emergency-info';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../../hooks/useLanguage';

// Composants des onglets
import { PreparationReportsTab } from './PreparationReportsTab';
import { FinancialSimulationsTab } from './FinancialSimulationsTab';
import { EstatePlanningTab } from './EstatePlanningTab';
import { CollaborationTab } from './CollaborationTab';

export const UltimatePlanningDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [data, setData] = useState<UltimatePlanningData | null>(null);
  const [emergencyData, setEmergencyData] = useState<EmergencyInfoData | null>(null);
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const ultimateData = UltimatePlanningService.getData();
      const emergencyInfo = EmergencyInfoService.getData();
      
      setData(ultimateData);
      setEmergencyData(emergencyInfo);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données du plan Ultimate',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = (newData: UltimatePlanningData) => {
    setData(newData);
    if (UltimatePlanningService.saveData(newData)) {
      toast({
        title: 'Succès',
        description: 'Données mises à jour avec succès',
      });
    } else {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde',
        variant: 'destructive'
      });
    }
  };

  const handleExport = () => {
    try {
      const exportData = UltimatePlanningService.exportData();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan-ultimate-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export réussi',
        description: 'Données exportées avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'export',
        variant: 'destructive'
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (UltimatePlanningService.importData(content)) {
          loadData();
          toast({
            title: 'Import réussi',
            description: 'Données importées avec succès',
          });
        } else {
          toast({
            title: 'Erreur',
            description: 'Format de fichier invalide',
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de l\'import',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données du plan Ultimate ? Cette action est irréversible.')) {
      UltimatePlanningService.resetData();
      loadData();
      toast({
        title: 'Réinitialisation',
        description: 'Données réinitialisées avec succès',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement du plan Ultimate...</p>
        </div>
      </div>
    );
  }

  if (!data || !emergencyData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Impossible de charger les données. Veuillez réessayer.
        </AlertDescription>
      </Alert>
    );
  }

  const stats = UltimatePlanningService.getUsageStats();
  const dataCompleteness = calculateDataCompleteness(data, emergencyData);

  return (
    <div className="space-y-6">
      {/* En-tête du plan Ultimate */}
      <Card className="border-gradient-to-r from-purple-500 to-mpr-interactive bg-gradient-to-r from-purple-50 to-mpr-interactive-lt">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-12 w-12 text-purple-600" />
            <div>
              <CardTitle className="text-3xl font-bold text-purple-900">
                Plan Ultimate
              </CardTitle>
              <CardDescription className="text-lg text-purple-700">
                Planification successorale avancée et rapports de préparation
              </CardDescription>
            </div>
          </div>
          
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">{stats.totalReports}</div>
              <div className="text-sm text-purple-700">Rapports créés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">{stats.totalSimulations}</div>
              <div className="text-sm text-purple-700">Simulations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">{dataCompleteness}{' %'}</div>
              <div className="text-sm text-purple-700">Complétude</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">300 $</div>
              <div className="text-sm text-purple-700">Valeur annuelle</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-purple-700 mb-2">
              <span>Progression globale</span>
              <span>{dataCompleteness}{' %'}</span>
            </div>
            <Progress value={dataCompleteness} className="h-3 bg-purple-100" />
          </div>
        </CardHeader>
      </Card>

      {/* Actions principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Actions principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setActiveTab('reports')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau rapport
            </Button>
            
            <Button 
              onClick={() => setActiveTab('simulations')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Nouvelle simulation
            </Button>

            <Button 
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importer
              </Button>
            </label>

            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rapports
          </TabsTrigger>
          <TabsTrigger value="simulations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Simulations
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Planification
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collaboration
          </TabsTrigger>
        </TabsList>

        {/* Onglet Rapports de préparation */}
        <TabsContent value="reports" className="space-y-4">
          <PreparationReportsTab 
            data={data}
            emergencyData={emergencyData}
            onUpdate={handleDataUpdate}
          />
        </TabsContent>

        {/* Onglet Simulations financières */}
        <TabsContent value="simulations" className="space-y-4">
          <FinancialSimulationsTab 
            data={data}
            onUpdate={handleDataUpdate}
          />
        </TabsContent>

        {/* Onglet Planification successorale */}
        <TabsContent value="planning" className="space-y-4">
          <EstatePlanningTab 
            data={data}
            onUpdate={handleDataUpdate}
          />
        </TabsContent>

        {/* Onglet Collaboration */}
        <TabsContent value="collaboration" className="space-y-4">
          <CollaborationTab 
            data={data}
            onUpdate={handleDataUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Informations et aide */}
      <Card className="border-mpr-border bg-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-mpr-navy">
            <Info className="h-5 w-5" />
            À propos du plan Ultimate
          </CardTitle>
        </CardHeader>
        <CardContent className="text-mpr-navy">
          <p className="mb-3">
            Le plan Ultimate vous donne accès à des outils avancés de planification successorale, 
            des simulations financières sophistiquées et des rapports de préparation professionnels 
            pour vous aider à préparer vos décisions et vos échanges avec un professionnel de votre choix.
          </p>
          <p>
            <strong>Note importante :</strong> Ce plan ne remplace pas les conseils juridiques 
            professionnels. Il vous aide à vous préparer et à organiser vos informations 
            pour éclairer vos décisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Fonction utilitaire pour calculer la complétude des données
function calculateDataCompleteness(ultimateData: UltimatePlanningData, emergencyData: EmergencyInfoData): number {
  let totalFields = 0;
  let completedFields = 0;

  // Vérifier les rapports de préparation
  totalFields += 1;
  if (ultimateData.preparationReports.length > 0) completedFields += 1;

  // Vérifier les simulations financières
  totalFields += 1;
  if (ultimateData.financialSimulations.length > 0) completedFields += 1;

  // Vérifier la planification successorale
  totalFields += 1;
  if (ultimateData.estatePlanning.assetProtection.length > 0) completedFields += 1;

  // Vérifier la collaboration
  totalFields += 1;
  if (ultimateData.collaboration.sharedAccess.length > 0) completedFields += 1;

  // Vérifier les données d'urgence (pondération plus élevée)
  const emergencyCompleteness = calculateEmergencyDataCompleteness(emergencyData);
  totalFields += 2;
  completedFields += Math.round(emergencyCompleteness / 50);

  return Math.round((completedFields / totalFields) * 100);
}

function calculateEmergencyDataCompleteness(emergencyData: EmergencyInfoData): number {
  let totalFields = 0;
  let completedFields = 0;

  // Contacts d'urgence
  totalFields += 1;
  if (emergencyData.contactsUrgence.length > 0) completedFields += 1;

  // Informations médicales
  totalFields += 1;
  if (emergencyData.informationsMedicales.medicamentsActuels.length > 0) completedFields += 1;

  // Personnes à charge
  totalFields += 1;
  if (emergencyData.personnesCharge.length > 0) completedFields += 1;

  // Documents importants
  totalFields += 1;
  if (emergencyData.documentsImportants.length > 0) completedFields += 1;

  // Propriétés
  totalFields += 1;
  if (emergencyData.proprietes.length > 0) completedFields += 1;

  // Informations financières
  totalFields += 1;
  if (emergencyData.informationsFinancieres.comptesBancaires.length > 0 || 
      emergencyData.informationsFinancieres.cartesCredit.length > 0) completedFields += 1;

  // Assurances
  totalFields += 1;
  if (emergencyData.assurances.length > 0) completedFields += 1;

  return Math.round((completedFields / totalFields) * 100);
}
