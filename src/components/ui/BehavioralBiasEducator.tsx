import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Target,
  Shield,
  Zap,
  BarChart3,
  Eye,
  Heart,
  DollarSign
} from 'lucide-react';

interface BehavioralBiasEducatorProps {
  userPlan: 'free' | 'professional' | 'expert';
}

interface BiasAssessment {
  lossAversion: number;
  overconfidence: number;
  anchoringBias: number;
  herding: number;
  recencyBias: number;
  mentalAccounting: number;
}

interface BiasScenario {
  id: string;
  title: string;
  description: string;
  scenario: string;
  options: string[];
  correctAnswer: number;
  biasType: keyof BiasAssessment;
  explanation: string;
  impact: string;
}

interface EducationModule {
  bias: keyof BiasAssessment;
  name: string;
  description: string;
  symptoms: string[];
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
  financialImpact: number;
}

export const BehavioralBiasEducator: React.FC<BehavioralBiasEducatorProps> = ({ userPlan }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [biasAssessment, setBiasAssessment] = useState<BiasAssessment | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);

  const scenarios: BiasScenario[] = [
    {
      id: '1',
      title: 'Aversion aux Pertes',
      description: 'Test de votre réaction face aux pertes potentielles',
      scenario: 'Votre portefeuille a perdu 10% cette année. Que faites-vous?',
      options: [
        'Je vends tout pour éviter d\'autres pertes',
        'Je garde mes positions et j\'attends',
        'J\'achète plus à prix réduit',
        'Je réévalue ma stratégie calmement'
      ],
      correctAnswer: 3,
      biasType: 'lossAversion',
      explanation: 'L\'aversion aux pertes nous pousse à prendre des décisions émotionnelles. La meilleure approche est de réévaluer rationnellement.',
      impact: 'Peut coûter 2-4% de rendement annuel en vendant au mauvais moment.'
    },
    {
      id: '2',
      title: 'Excès de Confiance',
      description: 'Évaluation de votre confiance en vos capacités d\'investissement',
      scenario: 'Vous avez eu 3 bons placements consécutifs. Comment voyez-vous vos prochains investissements?',
      options: [
        'Je suis maintenant un expert, j\'augmente mes risques',
        'C\'était probablement de la chance',
        'Je continue ma stratégie sans changement',
        'J\'analyse pourquoi ça a fonctionné'
      ],
      correctAnswer: 3,
      biasType: 'overconfidence',
      explanation: 'L\'excès de confiance après des succès peut mener à des prises de risques excessives.',
      impact: 'Peut réduire les rendements de 3-6% par sur-trading et mauvaise diversification.'
    },
    {
      id: '3',
      title: 'Biais d\'Ancrage',
      description: 'Test de votre tendance à vous fixer sur des références',
      scenario: 'Une action que vous avez payée 50$ vaut maintenant 30$. Les analystes prévoient 40$. Votre décision?',
      options: [
        'J\'attends qu\'elle remonte à 50$',
        'Je vends à 30$ pour limiter les pertes',
        'Je me base sur la valeur future de 40$',
        'J\'ignore le prix d\'achat et réévalue'
      ],
      correctAnswer: 3,
      biasType: 'anchoringBias',
      explanation: 'Le prix d\'achat ne devrait pas influencer les décisions futures. Seule la valeur actuelle compte.',
      impact: 'Peut causer des pertes de 1-3% en gardant de mauvais investissements trop longtemps.'
    },
    {
      id: '4',
      title: 'Comportement Grégaire',
      description: 'Évaluation de votre tendance à suivre la foule',
      scenario: 'Tout le monde parle d\'un nouveau secteur "révolutionnaire". Votre réaction?',
      options: [
        'J\'investis rapidement avant que ce soit trop tard',
        'J\'attends de voir ce qui se passe',
        'Je fais mes propres recherches d\'abord',
        'J\'évite les tendances populaires'
      ],
      correctAnswer: 2,
      biasType: 'herding',
      explanation: 'Suivre la foule peut mener à acheter haut et vendre bas. La recherche indépendante est cruciale.',
      impact: 'Peut coûter 4-8% en achetant dans des bulles et vendant dans des paniques.'
    },
    {
      id: '5',
      title: 'Biais de Récence',
      description: 'Test de l\'influence des événements récents sur vos décisions',
      scenario: 'Après une correction de marché, comment ajustez-vous votre allocation?',
      options: [
        'Je réduis mes actions, c\'est trop risqué',
        'J\'augmente mes actions, elles sont en solde',
        'Je ne change rien, c\'est temporaire',
        'Je révise ma stratégie à long terme'
      ],
      correctAnswer: 3,
      biasType: 'recencyBias',
      explanation: 'Les événements récents ne devraient pas dicter la stratégie long terme. La discipline est clé.',
      impact: 'Peut réduire les rendements de 2-5% en sur-réagissant aux fluctuations court terme.'
    },
    {
      id: '6',
      title: 'Comptabilité Mentale',
      description: 'Évaluation de votre tendance à compartimenter l\'argent',
      scenario: 'Vous avez 10 000$ d\'héritage et 5 000$ de dettes de carte de crédit (18% d\'intérêt). Que faites-vous?',
      options: [
        'J\'investis l\'héritage, c\'est de l\'argent spécial',
        'Je rembourse la dette et investis le reste',
        'Je garde l\'héritage en épargne',
        'Je dépense l\'héritage pour quelque chose de spécial'
      ],
      correctAnswer: 1,
      biasType: 'mentalAccounting',
      explanation: 'L\'argent est fongible. Rembourser une dette à 18% équivaut à un rendement garanti de 18%.',
      impact: 'Peut coûter des milliers en intérêts évitables et opportunités manquées.'
    }
  ];

  const calculateBiasAssessment = () => {
    setIsAssessing(true);
    
    setTimeout(() => {
      const assessment: BiasAssessment = {
        lossAversion: 0,
        overconfidence: 0,
        anchoringBias: 0,
        herding: 0,
        recencyBias: 0,
        mentalAccounting: 0
      };

      // Calcul des scores basé sur les réponses
      userAnswers.forEach((answer, index) => {
        const scenario = scenarios[index];
        const bias = scenario.biasType;
        
        // Score inversé: plus on s'éloigne de la bonne réponse, plus le biais est fort
        const distance = Math.abs(answer - scenario.correctAnswer);
        const biasScore = Math.min(100, distance * 33); // 0-100 scale
        
        assessment[bias] = Math.max(assessment[bias], biasScore);
      });

      setBiasAssessment(assessment);
      setShowResults(true);
      setIsAssessing(false);
    }, 1500);
  };

  const getEducationModules = (): EducationModule[] => {
    if (!biasAssessment) return [];

    return [
      {
        bias: 'lossAversion' as keyof BiasAssessment,
        name: 'Aversion aux Pertes',
        description: 'Tendance à ressentir les pertes plus intensément que les gains équivalents',
        symptoms: [
          'Vendre rapidement lors de baisses',
          'Éviter les investissements risqués même appropriés',
          'Garder trop longtemps les perdants'
        ],
        solutions: [
          'Définir des règles de vente à l\'avance',
          'Se concentrer sur les objectifs long terme',
          'Utiliser des ordres stop-loss automatiques'
        ],
        severity: (biasAssessment.lossAversion > 66 ? 'high' : biasAssessment.lossAversion > 33 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        financialImpact: biasAssessment.lossAversion * 40 // Impact en dollars sur 10k$
      },
      {
        bias: 'overconfidence' as keyof BiasAssessment,
        name: 'Excès de Confiance',
        description: 'Surestimation de ses capacités et connaissances en investissement',
        symptoms: [
          'Trading fréquent',
          'Concentration excessive dans quelques titres',
          'Ignorer les conseils d\'experts'
        ],
        solutions: [
          'Tenir un journal de trading',
          'Diversifier automatiquement',
          'Consulter régulièrement des conseillers'
        ],
        severity: (biasAssessment.overconfidence > 66 ? 'high' : biasAssessment.overconfidence > 33 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        financialImpact: biasAssessment.overconfidence * 50
      },
      {
        bias: 'anchoringBias' as keyof BiasAssessment,
        name: 'Biais d\'Ancrage',
        description: 'Fixation excessive sur des références comme le prix d\'achat',
        symptoms: [
          'Attendre le retour au prix d\'achat',
          'Baser les décisions sur des références arbitraires',
          'Difficulté à couper les pertes'
        ],
        solutions: [
          'Évaluer régulièrement sans regarder le prix d\'achat',
          'Utiliser des critères objectifs de vente',
          'Se concentrer sur la valeur future'
        ],
        severity: (biasAssessment.anchoringBias > 66 ? 'high' : biasAssessment.anchoringBias > 33 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        financialImpact: biasAssessment.anchoringBias * 25
      },
      {
        bias: 'herding' as keyof BiasAssessment,
        name: 'Comportement Grégaire',
        description: 'Tendance à suivre les décisions de la majorité',
        symptoms: [
          'Acheter ce qui est populaire',
          'Paniquer lors de ventes massives',
          'Suivre les tendances médiatiques'
        ],
        solutions: [
          'Développer sa propre stratégie',
          'Éviter les médias financiers sensationnalistes',
          'Investir de façon contrariante'
        ],
        severity: (biasAssessment.herding > 66 ? 'high' : biasAssessment.herding > 33 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        financialImpact: biasAssessment.herding * 60
      },
      {
        bias: 'recencyBias' as keyof BiasAssessment,
        name: 'Biais de Récence',
        description: 'Surpondération des événements récents dans les décisions',
        symptoms: [
          'Changer de stratégie après chaque fluctuation',
          'Extrapoler les tendances récentes',
          'Oublier les leçons du passé'
        ],
        solutions: [
          'Maintenir une perspective historique',
          'Réviser la stratégie annuellement seulement',
          'Documenter les raisons des décisions'
        ],
        severity: (biasAssessment.recencyBias > 66 ? 'high' : biasAssessment.recencyBias > 33 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        financialImpact: biasAssessment.recencyBias * 35
      },
      {
        bias: 'mentalAccounting' as keyof BiasAssessment,
        name: 'Comptabilité Mentale',
        description: 'Traitement différent de l\'argent selon sa source ou destination',
        symptoms: [
          'Traiter différemment l\'argent "gagné" vs "hérité"',
          'Garder des dettes coûteuses tout en épargnant',
          'Compartimenter les décisions financières'
        ],
        solutions: [
          'Voir l\'argent comme fongible',
          'Optimiser globalement les finances',
          'Prioriser les dettes à haut intérêt'
        ],
        severity: (biasAssessment.mentalAccounting > 66 ? 'high' : biasAssessment.mentalAccounting > 33 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        financialImpact: biasAssessment.mentalAccounting * 30
      }
    ].filter(module => module.severity !== 'low');
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      calculateBiasAssessment();
    }
  };

  const resetAssessment = () => {
    setCurrentScenario(0);
    setUserAnswers([]);
    setBiasAssessment(null);
    setShowResults(false);
  };

  const educationModules = getEducationModules();
  const totalFinancialImpact = educationModules.reduce((sum, module) => sum + module.financialImpact, 0);

  if (userPlan === 'free') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Éducateur de Biais Comportementaux
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Identifiez et corrigez vos biais d'investissement
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fonctionnalité Premium
            </h3>
            <p className="text-gray-600 mb-6">
              L'éducation sur les biais comportementaux est disponible avec les plans Professionnel et Expert.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                <strong>Impact critique:</strong> Les biais comportementaux peuvent coûter 3-7% de rendement annuel
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Débloquer le Module
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showResults) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Éducateur de Biais Comportementaux
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Évaluation de vos biais d'investissement - Question {currentScenario + 1} sur {scenarios.length}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Barre de progression */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progression</span>
                <span>{Math.round(((currentScenario) / scenarios.length) * 100)}%</span>
              </div>
              <Progress value={((currentScenario) / scenarios.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Scénario actuel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {scenarios[currentScenario].title}
            </CardTitle>
            <CardDescription>
              {scenarios[currentScenario].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-800 font-medium">
                {scenarios[currentScenario].scenario}
              </p>
            </div>

            <div className="space-y-3">
              {scenarios[currentScenario].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-blue-50"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {isAssessing && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyse de vos biais comportementaux en cours...</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* En-tête des résultats */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Votre Profil de Biais Comportementaux
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Analyse complète et recommandations personnalisées
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Impact financier global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Impact Financier Estimé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                -{totalFinancialImpact.toLocaleString()}$
              </div>
              <div className="text-sm text-gray-600">Coût Annuel Potentiel</div>
              <div className="text-xs text-gray-500 mt-1">Sur un portefeuille de 100k$</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                -{(totalFinancialImpact * 10).toLocaleString()}$
              </div>
              <div className="text-sm text-gray-600">Impact sur 10 ans</div>
              <div className="text-xs text-gray-500 mt-1">Sans correction</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                +{(totalFinancialImpact * 15).toLocaleString()}$
              </div>
              <div className="text-sm text-gray-600">Économies Potentielles</div>
              <div className="text-xs text-gray-500 mt-1">Avec correction des biais</div>
            </div>
          </div>

          {totalFinancialImpact > 2000 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Impact significatif détecté!</strong> Vos biais comportementaux pourraient vous coûter 
                {totalFinancialImpact.toLocaleString()}$ par année. Une correction est fortement recommandée.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Modules d'éducation */}
      {educationModules.map((module, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  {module.name}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
              <Badge 
                className={`${
                  module.severity === 'high' ? 'bg-red-100 text-red-800' :
                  module.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {module.severity === 'high' ? 'Critique' : 
                 module.severity === 'medium' ? 'Modéré' : 'Faible'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Symptômes Identifiés
                </h4>
                <ul className="space-y-2">
                  {module.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Solutions Recommandées
                </h4>
                <ul className="space-y-2">
                  {module.solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Impact financier annuel estimé:</span>
                <span className="font-semibold text-red-600">
                  -{module.financialImpact.toLocaleString()}$ par année
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Plan d'action global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Plan d'Action Personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Prise de Conscience</h4>
                <p className="text-sm text-gray-600">
                  Reconnaissez vos biais principaux et leurs déclencheurs émotionnels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Mise en Place de Garde-Fous</h4>
                <p className="text-sm text-gray-600">
                  Implémentez des règles automatiques et des processus de décision structurés.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Suivi et Amélioration</h4>
                <p className="text-sm text-gray-600">
                  Tenez un journal de vos décisions et révisez régulièrement vos progrès.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={resetAssessment}
              variant="outline"
              className="flex-1"
            >
              Refaire l'Évaluation
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Télécharger le Rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehavioralBiasEducator;
