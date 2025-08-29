// src/features/retirement/sections/RetirementSection.tsx
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Info,
  DollarSign
} from 'lucide-react';
import { UserData } from '../types';
import { RRQService, RRQAnalysis } from '../services/RRQService';
import { formatCurrency } from '../utils/formatters';

interface RetirementSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

export const RetirementSection: React.FC<RetirementSectionProps> = ({ 
  data, 
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('rrq-pensions');
  
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');
  
  const handleChange = (field: string, value: any) => {
    onUpdate('retirement', { [field]: value });
  };
  
  // Analyse RRQ pour personne 1
  const rrqAnalysis1 = useMemo(() => {
    if (data.retirement.rrqMontantActuel1 && data.personal.sexe1) {
      return RRQService.analyzeRRQ({
        ageActuel: data.retirement.rrqAgeActuel1,
        montantActuel: data.retirement.rrqMontantActuel1,
        montant70: data.retirement.rrqMontant70_1,
        esperanceVie: data.retirement.esperanceVie1,
        sexe: data.personal.sexe1
      });
    }
    return null;
  }, [data.retirement, data.personal.sexe1]);
  
  // Analyse RRQ pour personne 2
  const rrqAnalysis2 = useMemo(() => {
    if (data.retirement.rrqMontantActuel2 && data.personal.sexe2) {
      return RRQService.analyzeRRQ({
        ageActuel: data.retirement.rrqAgeActuel2,
        montantActuel: data.retirement.rrqMontantActuel2,
        montant70: data.retirement.rrqMontant70_2,
        esperanceVie: data.retirement.esperanceVie2,
        sexe: data.personal.sexe2
      });
    }
    return null;
  }, [data.retirement, data.personal.sexe2]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sapphire-500" />
            {isFrench ? 'Régimes de retraite et optimisation' : 'Retirement Plans and Optimization'}
          </CardTitle>
          <CardDescription>
            {isFrench 
              ? 'Optimisez vos régimes de retraite pour maximiser vos revenus'
              : 'Optimize your retirement plans to maximize your income'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-0.5 rounded-lg h-8">
              <TabsTrigger 
                value="rrq-pensions" 
                className="data-[state=active]:bg-sapphire-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200"
              >
                {isFrench ? 'RRQ & Pensions' : 'CPP & Pensions'}
              </TabsTrigger>
              <TabsTrigger 
                value="rregop"
                className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900 data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200"
              >
                RREGOP
              </TabsTrigger>
              <TabsTrigger 
                value="sv"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200"
              >
                {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'}
              </TabsTrigger>
              <TabsTrigger 
                value="summary"
                className="data-[state=active]:bg-charcoal-600 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200"
              >
                {isFrench ? 'Sommaire' : 'Summary'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rrq-pensions" className="space-y-6">
              <RRQAndPensionsComponent 
                data={data}
                onChange={handleChange}
                analysis1={rrqAnalysis1}
                analysis2={rrqAnalysis2}
              />
            </TabsContent>
            
            <TabsContent value="rregop">
              <RREGOPComponent data={data} onChange={handleChange} />
            </TabsContent>
            
            <TabsContent value="sv">
              <SecurityVieillesseComponent data={data} onChange={handleChange} />
            </TabsContent>
            
            <TabsContent value="summary">
              <RetirementSummary 
                data={data} 
                rrqAnalysis1={rrqAnalysis1}
                rrqAnalysis2={rrqAnalysis2}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant combiné pour RRQ et Pensions privées
const RRQAndPensionsComponent: React.FC<{
  data: UserData;
  onChange: (field: string, value: any) => void;
  analysis1: RRQAnalysis | null;
  analysis2: RRQAnalysis | null;
}> = ({ data, onChange, analysis1, analysis2 }) => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  return (
    <div className="space-y-8">
      {/* Section RRQ */}
    <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-sapphire-500" />
          <h3 className="text-xl font-bold text-charcoal-900">
            {isFrench ? 'Régie des rentes du Québec (RRQ)' : 'Quebec Pension Plan (QPP)'}
          </h3>
        </div>
        
        <Alert className="border-sapphire-200 bg-sapphire-50">
          <Info className="h-4 w-4 text-sapphire-600" />
          <AlertDescription className="text-sapphire-800">
            <strong>{isFrench ? 'Optimisation RRQ :' : 'QPP Optimization:'}</strong> {isFrench 
              ? 'Le timing de votre demande peut valoir des dizaines de milliers de dollars.'
              : 'The timing of your application can be worth tens of thousands of dollars.'
            }
          </AlertDescription>
        </Alert>

        {/* Personne 1 - RRQ */}
      <Card className="border-l-4 border-l-sapphire-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
              {data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')} - {isFrench ? 'RRQ' : 'QPP'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>{isFrench ? 'Âge actuel' : 'Current Age'} ({data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')})</Label>
                <Input
                  type="number"
                  value={data.retirement.rrqAgeActuel1}
                  onChange={(e) => onChange('rrqAgeActuel1', parseInt(e.target.value) || 0)}
                  placeholder="65"
                />
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Si vous avez plus de 65 ans et n\'avez pas réclamé'
                    : 'If you are over 65 and have not claimed yet'
                  }
                </p>
            </div>
            
            <div className="space-y-2">
                <Label>{isFrench ? 'Montant RRQ si réclamé MAINTENANT' : 'QPP Amount if claimed NOW'} ({data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')})</Label>
              <Input
                type="number"
                value={data.retirement.rrqMontantActuel1}
                onChange={(e) => onChange('rrqMontantActuel1', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Montant mensuel exact fourni par RRQ'
                    : 'Exact monthly amount provided by QPP'
                  }
                </p>
            </div>
            
            <div className="space-y-2">
                <Label>{isFrench ? 'Montant RRQ si réclamé à 70 ans' : 'QPP Amount if claimed at age 70'} ({data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')})</Label>
              <Input
                type="number"
                value={data.retirement.rrqMontant70_1}
                onChange={(e) => onChange('rrqMontant70_1', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Montant mensuel si vous attendez à 70 ans'
                    : 'Monthly amount if you wait until age 70'
                  }
                </p>
          </div>
          
          <div className="space-y-2">
                <Label>{isFrench ? 'Espérance de vie estimée' : 'Estimated Life Expectancy'} ({data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')})</Label>
                <Select 
                  value={String(data.retirement.esperanceVie1)} 
                  onValueChange={(value) => onChange('esperanceVie1', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 35 }, (_, i) => 66 + i).map(age => (
                      <SelectItem key={age} value={String(age)}>
                        {age} {isFrench ? 'ans' : 'years'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Utilisé pour calculer la valeur totale de vos prestations'
                    : 'Used to calculate the total value of your benefits'
                  }
                </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
        {/* Personne 2 - RRQ */}
      {data.personal.prenom2 && (
        <Card className="border-l-4 border-l-gold-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                {data.personal.prenom2} - {isFrench ? 'RRQ' : 'QPP'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isFrench ? 'Âge actuel' : 'Current Age'} ({data.personal.prenom2})</Label>
                  <Input
                    type="number"
                    value={data.retirement.rrqAgeActuel2}
                    onChange={(e) => onChange('rrqAgeActuel2', parseInt(e.target.value) || 0)}
                    placeholder="65"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{isFrench ? 'Montant RRQ si réclamé MAINTENANT' : 'QPP Amount if claimed NOW'} ({data.personal.prenom2})</Label>
                  <Input
                    type="number"
                    value={data.retirement.rrqMontantActuel2}
                    onChange={(e) => onChange('rrqMontantActuel2', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{isFrench ? 'Montant RRQ si réclamé à 70 ans' : 'QPP Amount if claimed at age 70'} ({data.personal.prenom2})</Label>
                  <Input
                    type="number"
                    value={data.retirement.rrqMontant70_2}
                    onChange={(e) => onChange('rrqMontant70_2', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{isFrench ? 'Espérance de vie estimée' : 'Estimated Life Expectancy'} ({data.personal.prenom2})</Label>
                  <Select 
                    value={String(data.retirement.esperanceVie2)} 
                    onValueChange={(value) => onChange('esperanceVie2', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 35 }, (_, i) => 66 + i).map(age => (
                        <SelectItem key={age} value={String(age)}>
                          {age} {isFrench ? 'ans' : 'years'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Analyse RRQ Personne 2 */}
              {analysis2 && (
                <div className="mt-6">
                  <RRQAnalysisDisplay analysis={analysis2} />
                </div>
              )}
          </CardContent>
        </Card>
      )}
      </div>

      {/* Section Pensions privées */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-gold-500" />
          <h3 className="text-xl font-bold text-charcoal-900">
            {isFrench ? 'Pensions privées' : 'Private Pensions'}
          </h3>
        </div>
        
        <Alert className="border-gold-200 bg-gold-50">
          <Info className="h-4 w-4 text-gold-600" />
          <AlertDescription className="text-gold-800">
            <strong>{isFrench ? 'Pensions privées :' : 'Private Pensions:'}</strong> {isFrench 
              ? 'Incluez vos pensions d\'employeur et régimes privés.'
              : 'Include your employer pensions and private plans.'
            }
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pension privée Personne 1 */}
          <Card className="border-l-4 border-l-gold-500">
            <CardHeader>
              <CardTitle className="text-lg">
                {isFrench ? 'Pension privée' : 'Private Pension'} - {data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{isFrench ? 'Montant mensuel de la pension' : 'Monthly Pension Amount'}</Label>
                <Input
                  type="number"
                  value={data.retirement.pensionPrivee1 || ''}
                  onChange={(e) => onChange('pensionPrivee1', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="text-lg p-3"
                />
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Montant mensuel de votre pension privée'
                    : 'Monthly amount of your private pension'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pension privée Personne 2 */}
          {data.personal.prenom2 && (
            <Card className="border-l-4 border-l-gold-500">
          <CardHeader>
                <CardTitle className="text-lg">
                  {isFrench ? 'Pension privée' : 'Private Pension'} - {data.personal.prenom2}
            </CardTitle>
          </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{isFrench ? 'Montant mensuel de la pension' : 'Monthly Pension Amount'}</Label>
                  <Input
                    type="number"
                    value={data.retirement.pensionPrivee2 || ''}
                    onChange={(e) => onChange('pensionPrivee2', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="text-lg p-3"
                  />
                  <p className="text-sm text-charcoal-600">
                    {isFrench 
                      ? 'Montant mensuel de votre pension privée'
                      : 'Monthly amount of your private pension'
                    }
                  </p>
                </div>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher l'analyse RRQ
const RRQAnalysisDisplay: React.FC<{ analysis: RRQAnalysis }> = ({ analysis }) => {
  const recommendations = RRQService.generateRecommendations(analysis);
  const iconClass = analysis.recommandation === 'COMMENCER_MAINTENANT' 
    ? 'text-green-600' 
    : analysis.recommandation === 'ATTENDRE_70' 
      ? 'text-amber-600' 
      : 'text-blue-600';

  return (
    <div className="space-y-4 mt-6">
      {/* Recommandation principale */}
      <Alert className={
        analysis.recommandation === 'COMMENCER_MAINTENANT'
          ? 'border-green-500 bg-green-50'
          : analysis.recommandation === 'ATTENDRE_70'
            ? 'border-amber-500 bg-amber-50'
            : 'border-blue-500 bg-blue-50'
      }>
        <CheckCircle className={`h-4 w-4 ${iconClass}`} />
        <AlertDescription>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="font-medium">{rec}</div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
      
      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total si commence maintenant"
          value={formatCurrency(analysis.totalSiCommenceMaintenant)}
          subtitle={`${analysis.esperanceVie - analysis.ageActuel} années`}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <MetricCard
          title="Total si attend 70 ans"
          value={formatCurrency(analysis.totalSiAttend70)}
          subtitle={`${analysis.esperanceVie - 70} années`}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Point de rentabilité"
          value={`${Math.round(analysis.ageRentabilite)} ans`}
          subtitle={analysis.ageRentabilite > analysis.esperanceVie ? "Après espérance de vie" : "Dans les limites"}
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </div>
      
      {/* Graphique de comparaison */}
      <ComparisonChart analysis={analysis} />
    </div>
  );
};

// Composant pour les cartes métriques
const MetricCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, icon }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          <div className="text-gray-400">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Graphique de comparaison (simplifié pour l'instant)
const ComparisonChart: React.FC<{ analysis: RRQAnalysis }> = ({ analysis }) => {
  const maxValue = Math.max(
    analysis.valeurActualiseeMaintenant,
    analysis.valeurActualisee70
  );
  
  const pourcentageMaintenant = (analysis.valeurActualiseeMaintenant / maxValue) * 100;
  const pourcentage70 = (analysis.valeurActualisee70 / maxValue) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Comparaison des valeurs actualisées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Commencer maintenant</span>
            <span className="font-bold">{formatCurrency(analysis.valeurActualiseeMaintenant)}</span>
          </div>
          <Progress value={pourcentageMaintenant} className="h-3" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Attendre à 70 ans</span>
            <span className="font-bold">{formatCurrency(analysis.valeurActualisee70)}</span>
          </div>
          <Progress value={pourcentage70} className="h-3" />
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Différence :</strong> {formatCurrency(analysis.differenceValeurActualisee)} 
            ({analysis.pourcentageGainPerte.toFixed(1)}%)
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// Résumé pour le couple
const CoupleRRQSummary: React.FC<{
  analysis1: RRQAnalysis | null;
  analysis2: RRQAnalysis | null;
}> = ({ analysis1, analysis2 }) => {
  // Calculs combinés
  const totalMaintenant = (analysis1?.totalSiCommenceMaintenant || 0) + 
                         (analysis2?.totalSiCommenceMaintenant || 0);
  const total70 = (analysis1?.totalSiAttend70 || 0) + 
                  (analysis2?.totalSiAttend70 || 0);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total combiné si commence maintenant</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalMaintenant)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total combiné si attend 70 ans</p>
              <p className="text-3xl font-bold text-amber-600">{formatCurrency(total70)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composants pour RREGOP et Pensions (simplifiés pour l'instant)
const RREGOPComponent: React.FC<any> = ({ data, onChange }) => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  return (
    <Card>
      <CardContent className="pt-6">
        <p>{isFrench ? 'Configuration RREGOP - En développement' : 'RREGOP Configuration - In development'}</p>
      </CardContent>
    </Card>
  );
};

const SecurityVieillesseComponent: React.FC<{ data: UserData; onChange: (field: string, value: any) => void }> = ({ data, onChange }) => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-emerald-500" />
        <h3 className="text-xl font-bold text-charcoal-900">
          {isFrench ? 'Sécurité de la vieillesse (SV)' : 'Old Age Security (OAS)'}
        </h3>
      </div>
      
      <Alert className="border-emerald-200 bg-emerald-50">
        <Info className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800">
          <strong>{isFrench ? 'Sécurité de la vieillesse :' : 'Old Age Security:'}</strong> {isFrench 
            ? 'Pension fédérale pour les Canadiens de 65 ans et plus. Le montant peut être réduit selon vos revenus.'
            : 'Federal pension for Canadians 65 and older. The amount may be reduced based on your income.'
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SV Personne 1 */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg">
              {isFrench ? 'SV' : 'OAS'} - {data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{isFrench ? 'Montant mensuel SV' : 'Monthly OAS Amount'}</Label>
              <Input
                type="number"
                value={data.retirement.svMontant1 || 0}
                onChange={(e) => onChange('svMontant1', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-sm text-charcoal-600">
                {isFrench 
                  ? 'Montant mensuel de la Sécurité de la vieillesse'
                  : 'Monthly Old Age Security amount'
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>{isFrench ? 'Revenus annuels pour calcul SV' : 'Annual Income for OAS Calculation'}</Label>
              <Input
                type="number"
                value={data.retirement.svRevenus1 || 0}
                onChange={(e) => onChange('svRevenus1', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-sm text-charcoal-600">
                {isFrench 
                  ? 'Revenus annuels pour le calcul de la réduction'
                  : 'Annual income for reduction calculation'
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>{isFrench ? 'Âge de début SV' : 'OAS Start Age'}</Label>
              <Select 
                value={String(data.retirement.svAgeDebut1 || 65)} 
                onValueChange={(value) => onChange('svAgeDebut1', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => 65 + i).map(age => (
                    <SelectItem key={age} value={String(age)}>
                      {age} {isFrench ? 'ans' : 'years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* SV Personne 2 */}
        {data.personal.prenom2 && (
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg">
                {isFrench ? 'SV' : 'OAS'} - {data.personal.prenom2}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{isFrench ? 'Montant mensuel SV' : 'Monthly OAS Amount'}</Label>
                <Input
                  type="number"
                  value={data.retirement.svMontant2 || 0}
                  onChange={(e) => onChange('svMontant2', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Montant mensuel de la Sécurité de la vieillesse'
                    : 'Monthly Old Age Security amount'
                  }
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>{isFrench ? 'Revenus annuels pour calcul SV' : 'Annual Income for OAS Calculation'}</Label>
                <Input
                  type="number"
                  value={data.retirement.svRevenus2 || 0}
                  onChange={(e) => onChange('svRevenus2', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-sm text-charcoal-600">
                  {isFrench 
                    ? 'Revenus annuels pour le calcul de la réduction'
                    : 'Annual income for reduction calculation'
                  }
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>{isFrench ? 'Âge de début SV' : 'OAS Start Age'}</Label>
                <Select 
                  value={String(data.retirement.svAgeDebut2 || 65)} 
                  onValueChange={(value) => onChange('svAgeDebut2', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => 65 + i).map(age => (
                      <SelectItem key={age} value={String(age)}>
                        {age} {isFrench ? 'ans' : 'years'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const RetirementSummary: React.FC<{ 
  data: UserData; 
  rrqAnalysis1: RRQAnalysis | null;
  rrqAnalysis2: RRQAnalysis | null;
}> = ({ data, rrqAnalysis1, rrqAnalysis2 }) => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  // Calculs pour le sommaire
  const totalRRQ = (data.retirement.rrqMontantActuel1 || 0) + (data.retirement.rrqMontantActuel2 || 0);
  const totalPensionsPrivees = (data.retirement.pensionPrivee1 || 0) + (data.retirement.pensionPrivee2 || 0);
  const totalSV = (data.retirement.svMontant1 || 0) + (data.retirement.svMontant2 || 0);
  const totalRevenusRetraite = totalRRQ + totalPensionsPrivees + totalSV;
  
  // RREGOP (si applicable)
  const rregopMontant = data.retirement.rregopMembre1 === 'oui' ? 
    (data.retirement.rregopAnnees1 * 2000) : 0; // Estimation simplifiée
  
  const totalAvecRREGOP = totalRevenusRetraite + rregopMontant;

  return (
    <div className="space-y-6">
      {/* En-tête du sommaire */}
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-charcoal-600" />
        <h3 className="text-xl font-bold text-charcoal-900">
          {isFrench ? 'Sommaire des revenus de retraite' : 'Retirement Income Summary'}
        </h3>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sapphire-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Total RRQ' : 'Total QPP'}</p>
              <p className="text-2xl font-bold text-sapphire-600">{formatCurrency(totalRRQ)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'par mois' : 'per month'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gold-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Pensions privées' : 'Private Pensions'}</p>
              <p className="text-2xl font-bold text-gold-600">{formatCurrency(totalPensionsPrivees)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'par mois' : 'per month'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'}</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalSV)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'par mois' : 'per month'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-charcoal-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Total mensuel' : 'Monthly Total'}</p>
              <p className="text-2xl font-bold text-charcoal-600">{formatCurrency(totalRevenusRetraite)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'par mois' : 'per month'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détail par personne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personne 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{isFrench ? 'RRQ :' : 'QPP:'}</span>
              <span className="font-semibold">{formatCurrency(data.retirement.rrqMontantActuel1 || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{isFrench ? 'Pension privée :' : 'Private Pension:'}</span>
              <span className="font-semibold">{formatCurrency(data.retirement.pensionPrivee1 || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{isFrench ? 'Sécurité de la vieillesse :' : 'Old Age Security:'}</span>
              <span className="font-semibold">{formatCurrency(data.retirement.svMontant1 || 0)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>{isFrench ? 'Total :' : 'Total:'}</span>
                <span className="text-sapphire-600">
                  {formatCurrency((data.retirement.rrqMontantActuel1 || 0) + 
                                 (data.retirement.pensionPrivee1 || 0) + 
                                 (data.retirement.svMontant1 || 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personne 2 */}
        {data.personal.prenom2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{data.personal.prenom2}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{isFrench ? 'RRQ :' : 'QPP:'}</span>
                <span className="font-semibold">{formatCurrency(data.retirement.rrqMontantActuel2 || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{isFrench ? 'Pension privée :' : 'Private Pension:'}</span>
                <span className="font-semibold">{formatCurrency(data.retirement.pensionPrivee2 || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{isFrench ? 'Sécurité de la vieillesse :' : 'Old Age Security:'}</span>
                <span className="font-semibold">{formatCurrency(data.retirement.svMontant2 || 0)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>{isFrench ? 'Total :' : 'Total:'}</span>
                  <span className="text-gold-600">
                    {formatCurrency((data.retirement.rrqMontantActuel2 || 0) + 
                                   (data.retirement.pensionPrivee2 || 0) + 
                                   (data.retirement.svMontant2 || 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RREGOP si applicable */}
      {data.retirement.rregopMembre1 === 'oui' && (
        <Card className="border-l-4 border-l-charcoal-500">
          <CardHeader>
            <CardTitle className="text-lg">RREGOP - {data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{isFrench ? 'Années de service :' : 'Years of service:'}</span>
                <span className="font-semibold">{data.retirement.rregopAnnees1} {isFrench ? 'ans' : 'years'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{isFrench ? 'Pension estimée :' : 'Estimated Pension:'}</span>
                <span className="font-semibold text-charcoal-600">{formatCurrency(rregopMontant)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>{isFrench ? 'Total avec RREGOP :' : 'Total with RREGOP:'}</span>
                  <span className="text-charcoal-600">{formatCurrency(totalAvecRREGOP)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations d'optimisation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">
            {isFrench ? 'Recommandations d\'optimisation' : 'Optimization Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-700">
          {totalRevenusRetraite < 3000 && (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500" />
              <p className="text-sm">
                <strong>{isFrench ? 'Revenus modestes :' : 'Modest Income:'}</strong> {isFrench 
                  ? 'Considérez maximiser vos REER et CELI pour augmenter vos revenus de retraite.'
                  : 'Consider maximizing your RRSP and TFSA to increase your retirement income.'
                }
              </p>
            </div>
          )}
          
          {data.retirement.rrqAgeActuel1 < 70 && data.retirement.rrqMontant70_1 > data.retirement.rrqMontantActuel1 && (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 text-blue-500" />
              <p className="text-sm">
                <strong>{isFrench ? 'Optimisation RRQ :' : 'QPP Optimization:'}</strong> {isFrench 
                  ? 'Attendre jusqu\'à 70 ans pourrait augmenter vos prestations RRQ.'
                  : 'Waiting until age 70 could increase your QPP benefits.'
                }
              </p>
            </div>
          )}
          
          {data.retirement.svMontant1 === 0 && (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 text-blue-500" />
              <p className="text-sm">
                <strong>{isFrench ? 'Sécurité de la vieillesse :' : 'Old Age Security:'}</strong> {isFrench 
                  ? 'Vérifiez votre admissibilité à la SV pour augmenter vos revenus.'
                  : 'Check your eligibility for OAS to increase your income.'
                }
              </p>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
            <p className="text-sm">
              <strong>{isFrench ? 'Planification complète :' : 'Complete Planning:'}</strong> {isFrench 
                ? 'Votre plan de retraite couvre les principaux régimes québécois et fédéraux.'
                : 'Your retirement plan covers the main Quebec and federal programs.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};