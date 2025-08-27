import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  Target, 
  Shield, 
  Info,
  DollarSign,
  Calendar,
  User,
  Building,
  BarChart3
} from 'lucide-react';
import { HelpTooltip } from '../components/HelpTooltip';
import { formatMontantOQLF } from '@/utils/formatters';
import { UserData } from '../types';

interface RRQSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

export const RRQSection: React.FC<RRQSectionProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('calculateur');
  const [showHelp, setShowHelp] = useState(false);

  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const handleChange = (field: string, value: any) => {
    onUpdate('retirement', { [field]: value });
  };

  // Données RRQ actuelles
  const rrqAgeActuel = data.retirement?.rrqAgeActuel1 || 0;
  const rrqMontantActuel = data.retirement?.rrqMontantActuel1 || 0;
  const rrqMontant70 = data.retirement?.rrqMontant70_1 || 0;
  const esperanceVie = data.retirement?.esperanceVie1 || 0;

  // Calculs RRQ
  const ageRetraiteStandard = 65;
  const ageRetraitePrecoce = 60;
  const ageRetraiteTardive = 70;

  const calculerRRQ = (age: number, montantStandard: number) => {
    if (age < ageRetraitePrecoce) return 0;
    if (age === ageRetraiteStandard) return montantStandard;
    
    if (age < ageRetraiteStandard) {
      // Réduction de 0.6% par mois avant 65 ans
      const moisAvant = (ageRetraiteStandard - age) * 12;
      const reduction = moisAvant * 0.006;
      return montantStandard * (1 - reduction);
    } else {
      // Augmentation de 0.7% par mois après 65 ans
      const moisApres = (age - ageRetraiteStandard) * 12;
      const augmentation = moisApres * 0.007;
      return montantStandard * (1 + augmentation);
    }
  };

  const rrq60 = calculerRRQ(ageRetraitePrecoce, rrqMontantActuel);
  const rrq65 = rrqMontantActuel;
  const rrq70 = rrqMontant70;

  // Calcul de la valeur totale RRQ
  const calculerValeurTotaleRRQ = (ageDebut: number, montantMensuel: number) => {
    if (esperanceVie <= ageDebut) return 0;
    const annees = esperanceVie - ageDebut;
    const mois = annees * 12;
    return montantMensuel * mois;
  };

  const valeurTotale60 = calculerValeurTotaleRRQ(ageRetraitePrecoce, rrq60);
  const valeurTotale65 = calculerValeurTotaleRRQ(ageRetraiteStandard, rrq65);
  const valeurTotale70 = calculerValeurTotaleRRQ(ageRetraiteTardive, rrq70);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {isFrench ? 'Régime des Rentes du Québec (RRQ)' : 'Quebec Pension Plan (QPP)'}
            </h1>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            {isFrench 
              ? 'Planifiez votre retraite avec le RRQ, le régime de retraite public du Québec'
              : 'Plan your retirement with the QPP, Quebec\'s public pension plan'
            }
          </p>
        </div>

        {/* Résumé des prestations RRQ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {isFrench ? 'Retraite anticipée (60 ans)' : 'Early retirement (60 years)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {isFrench ? formatMontantOQLF(rrq60) : `$${rrq60.toLocaleString()}`}
              </div>
              <div className="text-blue-200 text-sm">
                {isFrench ? 'Prestation mensuelle' : 'Monthly benefit'}
              </div>
              <div className="text-xs text-blue-300 mt-1">
                {isFrench ? 'Réduction de 36%' : '36% reduction'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-indigo-300/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-indigo-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                {isFrench ? 'Retraite standard (65 ans)' : 'Standard retirement (65 years)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-400">
                {isFrench ? formatMontantOQLF(rrq65) : `$${rrq65.toLocaleString()}`}
              </div>
              <div className="text-indigo-200 text-sm">
                {isFrench ? 'Prestation mensuelle' : 'Monthly benefit'}
              </div>
              <div className="text-xs text-indigo-300 mt-1">
                {isFrench ? 'Montant de base' : 'Base amount'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {isFrench ? 'Retraite tardive (70 ans)' : 'Late retirement (70 years)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {isFrench ? formatMontantOQLF(rrq70) : `$${rrq70.toLocaleString()}`}
              </div>
              <div className="text-purple-200 text-sm">
                {isFrench ? 'Prestation mensuelle' : 'Monthly benefit'}
              </div>
              <div className="text-xs text-purple-300 mt-1">
                {isFrench ? 'Augmentation de 42%' : '42% increase'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="calculateur" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isFrench ? 'Calculateur RRQ' : 'QPP Calculator'}
            </TabsTrigger>
            <TabsTrigger 
              value="comparaison" 
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {isFrench ? 'Comparaison des âges' : 'Age Comparison'}
            </TabsTrigger>
            <TabsTrigger 
              value="planification" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              {isFrench ? 'Planification' : 'Planning'}
            </TabsTrigger>
          </TabsList>

          {/* Calculateur RRQ */}
          <TabsContent value="calculateur" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {isFrench ? 'Mon calculateur RRQ' : 'My QPP Calculator'}
                </CardTitle>
                <CardDescription className="text-blue-200">
                  {isFrench 
                    ? 'Saisissez vos informations RRQ pour des calculs personnalisés'
                    : 'Enter your QPP information for personalized calculations'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {isFrench ? 'Âge actuel' : 'Current age'}
                      <HelpTooltip content={isFrench ? 'Votre âge actuel pour les calculs RRQ' : 'Your current age for QPP calculations'} />
                    </Label>
                    <Input
                      type="number"
                      value={rrqAgeActuel || ''}
                      onChange={(e) => handleChange('rrqAgeActuel1', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 58' : 'Ex: 58'}
                      className="bg-white/20 border-blue-300/30 text-white placeholder-blue-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {isFrench ? 'Prestation RRQ actuelle' : 'Current QPP benefit'}
                      <HelpTooltip content={isFrench ? 'Consultez "Mon Dossier" du RRQ pour obtenir cette information précise' : 'Check "My File" from QPP to get this precise information'} />
                    </Label>
                    <Input
                      type="number"
                      value={rrqMontantActuel || ''}
                      onChange={(e) => handleChange('rrqMontantActuel1', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Consultez Mon Dossier RRQ' : 'Check My QPP File'}
                      className="bg-white/20 border-blue-300/30 text-white placeholder-blue-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {isFrench ? 'Prestation à 70 ans' : 'Benefit at 70 years'}
                      <HelpTooltip content={isFrench ? 'Consultez "Mon Dossier" du RRQ pour obtenir cette information précise' : 'Check "My File" from QPP to get this precise information'} />
                    </Label>
                    <Input
                      type="number"
                      value={rrqMontant70 || ''}
                      onChange={(e) => handleChange('rrqMontant70_1', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Consultez Mon Dossier RRQ' : 'Check My QPP File'}
                      className="bg-white/20 border-blue-300/30 text-white placeholder-blue-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-300 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {isFrench ? 'Espérance de vie' : 'Life expectancy'}
                      <HelpTooltip content={isFrench ? 'Votre espérance de vie estimée' : 'Your estimated life expectancy'} />
                    </Label>
                    <Input
                      type="number"
                      value={esperanceVie || ''}
                      onChange={(e) => handleChange('esperanceVie1', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 85' : 'Ex: 85'}
                      className="bg-white/20 border-blue-300/30 text-white placeholder-blue-200"
                    />
                  </div>
                </div>

                {rrqMontantActuel > 0 && (
                  <Alert className="bg-blue-900/50 border-blue-400/30">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-blue-200">
                      {isFrench ? 'Vos prestations RRQ sont calculées selon les paramètres 2025' : 'Your QPP benefits are calculated according to 2025 parameters'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Alerte pour guider vers Mon Dossier RRQ */}
                <Alert className="bg-indigo-900/50 border-indigo-400/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-indigo-200">
                    {isFrench 
                      ? '💡 Pour des informations précises sur vos prestations RRQ, consultez "Mon Dossier" sur le site du Régime des rentes du Québec'
                      : '💡 For precise information about your QPP benefits, check "My File" on the Quebec Pension Plan website'
                    }
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparaison des âges */}
          <TabsContent value="comparaison" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-indigo-300/30">
              <CardHeader>
                <CardTitle className="text-indigo-400 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {isFrench ? 'Comparaison des stratégies de retraite' : 'Retirement Strategy Comparison'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Retraite à 60 ans */}
                  <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-300/30">
                    <div className="text-2xl font-bold text-blue-400">60</div>
                    <div className="text-blue-200 text-sm">{isFrench ? 'ans' : 'years'}</div>
                    <div className="text-lg font-semibold text-blue-300 mt-2">
                      {isFrench ? formatMontantOQLF(rrq60) : `$${rrq60.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-blue-300 mt-1">
                      {isFrench ? 'par mois' : 'per month'}
                    </div>
                    <div className="text-xs text-blue-400 mt-2">
                      {isFrench ? 'Total: ' : 'Total: '}
                      {isFrench ? formatMontantOQLF(valeurTotale60) : `$${valeurTotale60.toLocaleString()}`}
                    </div>
                  </div>

                  {/* Retraite à 65 ans */}
                  <div className="text-center p-4 bg-indigo-900/30 rounded-lg border border-indigo-300/30">
                    <div className="text-2xl font-bold text-indigo-400">65</div>
                    <div className="text-indigo-200 text-sm">{isFrench ? 'ans' : 'years'}</div>
                    <div className="text-lg font-semibold text-indigo-300 mt-2">
                      {isFrench ? formatMontantOQLF(rrq65) : `$${rrq65.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-indigo-300 mt-1">
                      {isFrench ? 'par mois' : 'per month'}
                    </div>
                    <div className="text-xs text-indigo-400 mt-2">
                      {isFrench ? 'Total: ' : 'Total: '}
                      {isFrench ? formatMontantOQLF(valeurTotale65) : `$${valeurTotale65.toLocaleString()}`}
                    </div>
                  </div>

                  {/* Retraite à 70 ans */}
                  <div className="text-center p-4 bg-purple-900/30 rounded-lg border border-purple-300/30">
                    <div className="text-2xl font-bold text-purple-400">70</div>
                    <div className="text-purple-200 text-sm">{isFrench ? 'ans' : 'years'}</div>
                    <div className="text-lg font-semibold text-purple-300 mt-2">
                      {isFrench ? formatMontantOQLF(rrq70) : `$${rrq70.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-purple-300 mt-1">
                      {isFrench ? 'par mois' : 'per month'}
                    </div>
                    <div className="text-xs text-purple-400 mt-2">
                      {isFrench ? 'Total: ' : 'Total: '}
                      {isFrench ? formatMontantOQLF(valeurTotale70) : `$${valeurTotale70.toLocaleString()}`}
                    </div>
                  </div>
                </div>

                <Alert className="bg-indigo-900/50 border-indigo-400/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-indigo-200">
                    {isFrench 
                      ? 'La retraite tardive peut augmenter significativement vos prestations RRQ à vie'
                      : 'Late retirement can significantly increase your lifetime QPP benefits'
                    }
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planification */}
          <TabsContent value="planification" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {isFrench ? 'Stratégies de planification RRQ' : 'QPP Planning Strategies'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-300/20">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      {isFrench ? '🎯 Stratégie Conservatrice' : '🎯 Conservative Strategy'}
                    </h4>
                    <p className="text-blue-200 text-sm">
                      {isFrench 
                        ? 'Prendre sa retraite à 65 ans pour un équilibre entre revenus et durée de prestations'
                        : 'Retire at 65 for a balance between income and benefit duration'
                      }
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-300/20">
                    <h4 className="font-semibold text-indigo-300 mb-2">
                      {isFrench ? '📈 Stratégie Optimale' : '📈 Optimal Strategy'}
                    </h4>
                    <p className="text-blue-200 text-sm">
                      {isFrench 
                        ? 'Attendre jusqu\'à 70 ans pour maximiser les prestations mensuelles'
                        : 'Wait until 70 to maximize monthly benefits'
                      }
                    </p>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-300/20">
                    <h4 className="font-semibold text-purple-300 mb-2">
                      {isFrench ? '⚡ Stratégie Flexible' : '⚡ Flexible Strategy'}
                    </h4>
                    <p className="text-blue-200 text-sm">
                      {isFrench 
                        ? 'Combiner RRQ avec d\'autres sources de revenus pour une retraite personnalisée'
                        : 'Combine QPP with other income sources for a personalized retirement'
                      }
                    </p>
                  </div>
                </div>

                <Alert className="bg-purple-900/50 border-purple-400/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-purple-200">
                    {isFrench 
                      ? 'Le RRQ est conçu pour remplacer environ 25% de vos revenus de travail'
                      : 'The QPP is designed to replace approximately 25% of your work income'
                    }
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Boutons d'action */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={() => setShowHelp(!showHelp)}
            variant="outline"
            className="bg-white/10 border-blue-300/30 text-blue-300 hover:bg-blue-600 hover:text-white"
          >
            {isFrench ? 'Aide et conseils RRQ' : 'QPP Help & Tips'}
          </Button>
        </div>

        {/* Aide contextuelle */}
        {showHelp && (
          <Card className="mt-6 bg-white/10 backdrop-blur-sm border-blue-300/30">
            <CardHeader>
              <CardTitle className="text-blue-400">
                {isFrench ? 'Conseils pour optimiser vos prestations RRQ' : 'Tips to optimize your QPP benefits'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-blue-200">
              <p>
                {isFrench 
                  ? '• Le RRQ est basé sur vos cotisations et votre âge de retraite'
                  : '• The QPP is based on your contributions and retirement age'
                }
              </p>
              <p>
                {isFrench 
                  ? '• Attendre jusqu\'à 70 ans peut augmenter vos prestations de 42%'
                  : '• Waiting until 70 can increase your benefits by 42%'
                }
              </p>
              <p>
                {isFrench 
                  ? '• Le RRQ s\'ajuste automatiquement à l\'inflation chaque année'
                  : '• The QPP automatically adjusts to inflation each year'
                }
              </p>
              <p>
                {isFrench 
                  ? '• Considérez combiner RRQ avec REER et CELI pour une retraite complète'
                  : '• Consider combining QPP with RRSP and TFSA for a complete retirement'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
