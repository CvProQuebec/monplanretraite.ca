// SRGAnalysisSection.tsx - Interface Supplément de Revenu Garanti
// SÉCURISÉ - Toutes les données restent dans le navigateur

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Users, 
  DollarSign,
  TrendingUp,
  Shield,
  Calculator
} from 'lucide-react';
import { UserData } from '../types';
import SRGService, { SRGCalculationResult } from '../services/SRGService';

interface SRGAnalysisSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
  isFrench?: boolean;
}

export const SRGAnalysisSection: React.FC<SRGAnalysisSectionProps> = ({
  data,
  onUpdate,
  isFrench = true
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);

  // Calcul SRG sécurisé (local uniquement)
  const srgAnalysis: SRGCalculationResult = useMemo(() => {
    try {
      return SRGService.calculerSRG(data);
    } catch (error) {
      console.error('Erreur analyse SRG:', error);
      return {
        eligible: false,
        raison: 'Erreur de calcul',
        statutConjugal: 'celibataire',
        revenuFamilial: 0,
        montantSRG1: 0,
        montantSRG2: 0,
        montantTotal: 0,
        reductionAppliquee: 0,
        strategiesOptimisation: [],
        alertes: [],
        impactFinancier: {
          annuel: 0,
          decennal: 0,
          optimise: 0,
          gainPotentiel: 0
        }
      };
    }
  }, [data]);

  // Fonction d'export des résultats (local uniquement)
  const exportAnalysis = () => {
    try {
      const exportData = {
        module: 'SRG',
        date: new Date().toISOString(),
        resultats: srgAnalysis,
        parametresUtilises: {
          dateNaissance1: data.personal?.naissance1,
          dateNaissance2: data.personal?.naissance2,
          salaire1: data.personal?.salaire1,
          salaire2: data.personal?.salaire2
        },
        avertissement: 'Données personnelles - Ne pas partager'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `analyse-srg-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      console.log('Analyse SRG exportée localement');
    } catch (error) {
      console.error('Erreur export SRG:', error);
    }
  };

  // Textes bilingues
  const t = {
    title: isFrench ? 'Analyse du Supplément de Revenu Garanti (SRG)' : 'Guaranteed Income Supplement (GIS) Analysis',
    overview: isFrench ? 'Vue d\'ensemble' : 'Overview',
    strategies: isFrench ? 'Stratégies' : 'Strategies',
    alerts: isFrench ? 'Alertes' : 'Alerts',
    eligible: isFrench ? 'Éligible' : 'Eligible',
    notEligible: isFrench ? 'Non éligible' : 'Not Eligible',
    monthlyAmount: isFrench ? 'Montant mensuel' : 'Monthly Amount',
    annualAmount: isFrench ? 'Montant annuel' : 'Annual Amount',
    familyIncome: isFrench ? 'Revenu familial' : 'Family Income',
    maritalStatus: isFrench ? 'Statut conjugal' : 'Marital Status',
    exportAnalysis: isFrench ? 'Exporter l\'analyse' : 'Export Analysis',
    dataStaysLocal: isFrench ? 'Vos données restent sur votre appareil' : 'Your data stays on your device'
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sécurité */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="w-6 h-6" />
            {t.title}
            <Badge variant="outline" className="ml-auto text-green-600">
              {t.dataStaysLocal}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {srgAnalysis.eligible ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{t.eligible}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <Info className="w-5 h-5" />
                  <span className="font-semibold">{t.notEligible}</span>
                </div>
              )}
              
              {srgAnalysis.eligible && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-xl text-green-700">
                    {srgAnalysis.montantTotal.toLocaleString('fr-CA')} $ / an
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={exportAnalysis}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t.exportAnalysis}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertes importantes */}
      {srgAnalysis.alertes.length > 0 && (
        <div className="space-y-2">
          {srgAnalysis.alertes.map((alerte, index) => (
            <Alert
              key={index}
              variant={alerte.type === 'critique' ? 'destructive' : 'default'}
              className={
                alerte.type === 'attention' ? 'border-yellow-300 bg-yellow-50' :
                alerte.type === 'info' ? 'border-blue-300 bg-blue-50' : ''
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">{alerte.message}</div>
                <div className="text-sm mt-1">{alerte.action}</div>
                {alerte.impact && (
                  <div className="text-xs mt-1 text-gray-600">
                    Impact: {alerte.impact}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Onglets d'analyse */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="strategies">{t.strategies}</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Détails de l'analyse */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {isFrench ? 'Détails du calcul' : 'Calculation Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{t.familyIncome}:</span>
                  <span className="font-semibold">
                    {srgAnalysis.revenuFamilial.toLocaleString('fr-CA')} $
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t.maritalStatus}:</span>
                  <span className="font-semibold">
                    {srgAnalysis.statutConjugal === 'celibataire' ? 
                      (isFrench ? 'Célibataire' : 'Single') :
                      srgAnalysis.statutConjugal === 'conjoint-avec-sv' ?
                      (isFrench ? 'Couple avec SV' : 'Couple with OAS') :
                      (isFrench ? 'Couple sans SV' : 'Couple without OAS')
                    }
                  </span>
                </div>

                {srgAnalysis.eligible && (
                  <>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm">
                        <span>Personne 1:</span>
                        <span>{srgAnalysis.montantSRG1.toLocaleString('fr-CA')} $</span>
                      </div>
                      {srgAnalysis.montantSRG2 > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Personne 2:</span>
                          <span>{srgAnalysis.montantSRG2.toLocaleString('fr-CA')} $</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-green-600">
                        <span>{t.annualAmount}:</span>
                        <span>{srgAnalysis.montantTotal.toLocaleString('fr-CA')} $</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{t.monthlyAmount}:</span>
                        <span>{Math.round(srgAnalysis.montantTotal / 12).toLocaleString('fr-CA')} $</span>
                      </div>
                    </div>
                  </>
                )}

                {srgAnalysis.reductionAppliquee > 0 && (
                  <div className="flex justify-between text-sm text-red-600 border-t pt-3">
                    <span>{isFrench ? 'Réduction appliquée' : 'Applied Reduction'}:</span>
                    <span>-{srgAnalysis.reductionAppliquee.toLocaleString('fr-CA')} $</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Graphique visuel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {isFrench ? 'Impact financier' : 'Financial Impact'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-t from-green-100 to-green-200 rounded-lg flex items-end justify-center p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {srgAnalysis.impactFinancier.annuel.toLocaleString('fr-CA')} $
                      </div>
                      <div className="text-sm text-green-600">
                        {isFrench ? 'Par année' : 'Per year'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-700">
                        {srgAnalysis.impactFinancier.decennal.toLocaleString('fr-CA')} $
                      </div>
                      <div className="text-blue-600">
                        {isFrench ? '10 ans' : '10 years'}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-semibold text-purple-700">
                        {srgAnalysis.impactFinancier.gainPotentiel.toLocaleString('fr-CA')} $
                      </div>
                      <div className="text-purple-600">
                        {isFrench ? 'Gain potentiel' : 'Potential gain'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stratégies d'optimisation */}
        <TabsContent value="strategies" className="space-y-4">
          {srgAnalysis.strategiesOptimisation.length > 0 ? (
            srgAnalysis.strategiesOptimisation.map((strategie, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{strategie.titre}</span>
                    <Badge variant={
                      strategie.priorite === 'haute' ? 'destructive' :
                      strategie.priorite === 'moyenne' ? 'default' : 'secondary'
                    }>
                      {isFrench ? 
                        (strategie.priorite === 'haute' ? 'Priorité Haute' :
                         strategie.priorite === 'moyenne' ? 'Priorité Moyenne' : 'Priorité Faible') :
                        (strategie.priorite === 'haute' ? 'High Priority' :
                         strategie.priorite === 'moyenne' ? 'Medium Priority' : 'Low Priority')
                      }
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">{strategie.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">
                      {isFrench ? 'Actions recommandées:' : 'Recommended Actions:'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {strategie.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm">{action}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                    <div>
                      <span className="font-semibold">Impact: </span>
                      <span>{strategie.impact}</span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {isFrench ? 'Délai: ' : 'Timeline: '}
                      </span>
                      <span>{strategie.delaiMiseEnOeuvre}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Info className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {isFrench ? 
                    'Aucune stratégie d\'optimisation disponible pour votre situation actuelle.' :
                    'No optimization strategies available for your current situation.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Impact et projections */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isFrench ? 'Impact annuel' : 'Annual Impact'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {srgAnalysis.impactFinancier.annuel.toLocaleString('fr-CA')} $
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isFrench ? 'Revenus supplémentaires par an' : 'Additional income per year'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isFrench ? 'Impact 10 ans' : '10-Year Impact'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {srgAnalysis.impactFinancier.decennal.toLocaleString('fr-CA')} $
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isFrench ? 'Total sur une décennie' : 'Total over a decade'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isFrench ? 'Gain optimisé' : 'Optimized Gain'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  +{srgAnalysis.impactFinancier.gainPotentiel.toLocaleString('fr-CA')} $
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isFrench ? 'Avec stratégies d\'optimisation' : 'With optimization strategies'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations finales */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">
                {isFrench ? 'Recommandations finales' : 'Final Recommendations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {srgAnalysis.eligible ? (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p>
                        {isFrench ? 
                          'Vous êtes éligible au SRG. Assurez-vous de faire la demande dès l\'âge de 65 ans.' :
                          'You are eligible for GIS. Make sure to apply as soon as you turn 65.'
                        }
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p>
                        {isFrench ? 
                          'Suivez les stratégies d\'optimisation pour maximiser vos prestations.' :
                          'Follow the optimization strategies to maximize your benefits.'
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p>
                      {isFrench ? 
                        'Vous n\'êtes pas éligible actuellement, mais surveillez les changements de votre situation financière.' :
                        'You are not currently eligible, but monitor changes in your financial situation.'
                      }
                    </p>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {isFrench ? 
                      'Révisez votre éligibilité annuellement car les seuils et votre situation peuvent changer.' :
                      'Review your eligibility annually as thresholds and your situation may change.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Note de sécurité */}
      <Alert className="border-green-300 bg-green-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>{isFrench ? 'Sécurité des données: ' : 'Data Security: '}</strong>
          {isFrench ? 
            'Cette analyse est effectuée entièrement dans votre navigateur. Aucune donnée personnelle n\'est transmise à nos serveurs.' :
            'This analysis is performed entirely in your browser. No personal data is transmitted to our servers.'
          }
        </AlertDescription>
      </Alert>
    </div>
  );
};