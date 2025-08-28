import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  TrendingUp, 
  Shield, 
  Flag, 
  BarChart3,
  Info,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { AdvancedRRQAnalysisComponent } from '@/features/retirement/components/AdvancedRRQAnalysis';
import { CPPRRQComparison } from '@/features/retirement/components/CPPRRQComparison';
import { RRQSection } from '@/features/retirement/sections/RRQSection';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

// Données de démonstration pour RRQSection
const demoUserData = {
  personal: {
    prenom1: 'Jean', prenom2: 'Marie', naissance1: '1980-01-01', naissance2: '1982-01-01',
    sexe1: 'M' as const, sexe2: 'F' as const, salaire1: 60000, salaire2: 55000,
    statutProfessionnel1: 'actif', statutProfessionnel2: 'actif',
    ageRetraiteSouhaite1: 65, ageRetraiteSouhaite2: 65, depensesRetraite: 4000
  },
  retirement: {
    rrqAgeActuel1: 0, // Champ vide par défaut
    rrqMontantActuel1: 0, // Champ vide par défaut
    rrqMontant70_1: 0, // Champ vide par défaut
    esperanceVie1: 0, // Champ vide par défaut
    rrqAgeActuel2: 0, // Champ vide par défaut
    rrqMontantActuel2: 0, // Champ vide par défaut
    rrqMontant70_2: 0, // Champ vide par défaut
    esperanceVie2: 0 // Champ vide par défaut
  },
  savings: {},
  cashflow: {}
};

const RRQCPPAnalysis: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(demoUserData);

  const handleUpdate = (section: keyof typeof userData, updates: any) => {
    setUserData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...updates
      }
    }));
  };

  const t = {
    fr: {
      title: 'Analyse Complète RRQ/CPP',
      subtitle: 'Modules avancés pour la planification de retraite avec les régimes publics',
      overview: 'Vue d\'ensemble',
      rrqAnalysis: 'Analyse RRQ Avancée',
      comparison: 'Comparaison CPP vs RRQ',
      calculator: 'Calculateur RRQ',
      overviewDescription: 'Cette page intègre tous nos modules RRQ/CPP développés pour vous offrir une analyse complète de votre retraite.',
      features: [
        'Calculs précis avec paramètres 2025',
        'Comparaison détaillée CPP vs RRQ',
        'Calculateur RRQ avec scénarios',
        'Recommandations personnalisées',
        'Analyse de sensibilité',
        'Stratégies d\'optimisation'
      ]
    },
    en: {
      title: 'Complete RRQ/CPP Analysis',
      subtitle: 'Advanced modules for retirement planning with public pension plans',
      overview: 'Overview',
      rrqAnalysis: 'Advanced RRQ Analysis',
      comparison: 'CPP vs RRQ Comparison',
      calculator: 'RRQ Calculator',
      overviewDescription: 'This page integrates all our developed RRQ/CPP modules to provide you with a comprehensive retirement analysis.',
      features: [
        'Precise calculations with 2025 parameters',
        'Detailed CPP vs RRQ comparison',
        'RRQ calculator with scenarios',
        'Personalized recommendations',
        'Sensitivity analysis',
        'Optimization strategies'
      ]
    }
  };

  const currentT = t[language as keyof typeof t];
  const isFrench = language === 'fr';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Particules de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shield className="w-16 h-16 text-blue-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
              {currentT.title}
            </h1>
          </div>
          <p className="text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* Navigation par onglets */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/20 p-2 rounded-xl h-16 border-2 border-white/30 shadow-lg">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Info className="w-5 h-5 mr-2" />
                  {currentT.overview}
                </TabsTrigger>
                <TabsTrigger 
                  value="rrq-analysis"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {currentT.rrqAnalysis}
                </TabsTrigger>
                <TabsTrigger 
                  value="comparison"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Flag className="w-5 h-5 mr-2" />
                  {currentT.comparison}
                </TabsTrigger>
                <TabsTrigger 
                  value="calculator"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Target className="w-5 h-5 mr-2" />
                  {currentT.calculator}
                </TabsTrigger>
              </TabsList>

              {/* Onglet Vue d'ensemble */}
              <TabsContent value="overview" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Description */}
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-2xl text-blue-200 flex items-center gap-3">
                        <Info className="w-8 h-8 text-blue-400" />
                        {currentT.overview}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-blue-100 leading-relaxed mb-6">
                        {currentT.overviewDescription}
                      </p>
                      <div className="space-y-3">
                        {currentT.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-blue-100">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistiques */}
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-2xl text-blue-200 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                        {isFrench ? 'Statistiques RRQ/CPP' : 'RRQ/CPP Statistics'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                          <p className="text-2xl font-bold text-blue-200">2025</p>
                          <p className="text-sm text-blue-300">
                            {isFrench ? 'Année de référence' : 'Reference Year'}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
                          <p className="text-2xl font-bold text-indigo-200">6.40%</p>
                          <p className="text-sm text-indigo-300">
                            {isFrench ? 'Taux RRQ 2025' : 'RRQ Rate 2025'}
                          </p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                        <p className="text-2xl font-bold text-purple-200">66,600 $</p>
                        <p className="text-sm text-purple-300">
                          {isFrench ? 'Gains maximums 2025' : 'Maximum Earnings 2025'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Onglet Analyse RRQ Avancée */}
              <TabsContent value="rrq-analysis" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <AdvancedRRQAnalysisComponent 
                      initialData={{
                        ageActuel: 60,
                        montantActuel: 1200,
                        montant70: 1600,
                        montant72: 1800,
                        esperanceVie: 85,
                        sexe: 'M',
                        situationFinanciere: 'STABLE'
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Comparaison CPP vs RRQ */}
              <TabsContent value="comparison" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <CPPRRQComparison />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet Calculateur RRQ */}
              <TabsContent value="calculator" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <RRQSection 
                      data={userData} 
                      onUpdate={handleUpdate} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RRQCPPAnalysis;
