import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Calculator, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  FileText,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Target,
  Award,
  Clock
} from 'lucide-react';

interface TaxConcept {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedSavings: number;
  timeToLearn: string;
  completed: boolean;
}

interface TaxStrategy {
  id: string;
  name: string;
  description: string;
  applicableAge: string;
  potentialSavings: string;
  complexity: 'low' | 'medium' | 'high';
  requirements: string[];
}

const TaxEducationCenter: React.FC = () => {
  const [completedConcepts, setCompletedConcepts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('concepts');
  const [selectedAge, setSelectedAge] = useState<number>(65);

  const taxConcepts: TaxConcept[] = [
    {
      id: 'age-credit',
      title: 'Crédit en raison de l\'âge (65 ans)',
      description: 'Crédit fédéral de 8 790 $ qui commence à 65 ans et diminue avec le revenu',
      difficulty: 'beginner',
      estimatedSavings: 1500,
      timeToLearn: '15 min',
      completed: completedConcepts.includes('age-credit')
    },
    {
      id: 'pension-credit',
      title: 'Crédit pour revenu de pension',
      description: 'Crédit de 15% sur les premiers 2 000 $ de revenu de pension admissible',
      difficulty: 'beginner',
      estimatedSavings: 300,
      timeToLearn: '10 min',
      completed: completedConcepts.includes('pension-credit')
    },
    {
      id: 'income-splitting',
      title: 'Fractionnement du revenu de pension',
      description: 'Partage jusqu\'à 50% du revenu de pension admissible avec votre conjoint',
      difficulty: 'intermediate',
      estimatedSavings: 3000,
      timeToLearn: '25 min',
      completed: completedConcepts.includes('income-splitting')
    },
    {
      id: 'oas-clawback',
      title: 'Récupération de la PSV',
      description: 'Comment éviter ou minimiser la récupération de la Pension de Sécurité de la Vieillesse',
      difficulty: 'intermediate',
      estimatedSavings: 2500,
      timeToLearn: '20 min',
      completed: completedConcepts.includes('oas-clawback')
    },
    {
      id: 'withdrawal-strategies',
      title: 'Stratégies de décaissement optimales',
      description: 'Ordre optimal de décaissement des comptes REER, CELI et non-enregistrés',
      difficulty: 'advanced',
      estimatedSavings: 5000,
      timeToLearn: '45 min',
      completed: completedConcepts.includes('withdrawal-strategies')
    },
    {
      id: 'tax-brackets',
      title: 'Optimisation des tranches d\'imposition',
      description: 'Comment rester dans les tranches d\'imposition les plus avantageuses',
      difficulty: 'intermediate',
      estimatedSavings: 2000,
      timeToLearn: '30 min',
      completed: completedConcepts.includes('tax-brackets')
    }
  ];

  const taxStrategies: TaxStrategy[] = [
    {
      id: 'delay-cpp',
      name: 'Reporter le RRQ/CPP',
      description: 'Reporter la pension jusqu\'à 70 ans pour une augmentation de 42%',
      applicableAge: '60-70 ans',
      potentialSavings: '15 000 $ - 30 000 $ sur la vie',
      complexity: 'medium',
      requirements: ['Autres sources de revenus', 'Bonne santé', 'Planification fiscale']
    },
    {
      id: 'rrsp-meltdown',
      name: 'Fonte du REER',
      description: 'Décaisser graduellement le REER avant 71 ans pour optimiser l\'impôt',
      applicableAge: '60-71 ans',
      potentialSavings: '5 000 $ - 15 000 $ par année',
      complexity: 'high',
      requirements: ['REER substantiel', 'Autres revenus limités', 'Planification détaillée']
    },
    {
      id: 'tfsa-maximize',
      name: 'Maximisation du CELI',
      description: 'Utiliser le CELI comme dernier compte à décaisser pour optimiser l\'héritage',
      applicableAge: 'Tout âge',
      potentialSavings: '2 000 $ - 8 000 $ par année',
      complexity: 'low',
      requirements: ['Droits de cotisation CELI', 'Autres sources de revenus']
    },
    {
      id: 'pension-splitting',
      name: 'Fractionnement optimal',
      description: 'Maximiser les économies d\'impôt par le fractionnement de pension',
      applicableAge: '65+ ans',
      potentialSavings: '1 000 $ - 5 000 $ par année',
      complexity: 'medium',
      requirements: ['Conjoint', 'Revenu de pension admissible', 'Écart de revenus']
    }
  ];

  const toggleConceptCompletion = (conceptId: string) => {
    setCompletedConcepts(prev => 
      prev.includes(conceptId) 
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    );
  };

  const getCompletionPercentage = () => {
    return Math.round((completedConcepts.length / taxConcepts.length) * 100);
  };

  const getTotalPotentialSavings = () => {
    return taxConcepts
      .filter(concept => completedConcepts.includes(concept.id))
      .reduce((total, concept) => total + concept.estimatedSavings, 0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgeSpecificStrategies = () => {
    if (selectedAge < 60) return taxStrategies.filter(s => s.applicableAge.includes('Tout âge'));
    if (selectedAge < 65) return taxStrategies.filter(s => s.applicableAge.includes('60') || s.applicableAge.includes('Tout âge'));
    if (selectedAge < 70) return taxStrategies.filter(s => s.applicableAge.includes('65') || s.applicableAge.includes('60') || s.applicableAge.includes('Tout âge'));
    return taxStrategies;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <GraduationCap className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Centre d'Éducation Fiscale
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Maîtrisez les stratégies fiscales de la retraite. Économisez des milliers de dollars 
          en comprenant les crédits, déductions et optimisations disponibles.
        </p>
      </div>

      {/* Tableau de bord des progrès */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={getCompletionPercentage()} className="h-3" />
              <div className="flex justify-between text-sm">
                <span>{completedConcepts.length}/{taxConcepts.length} concepts</span>
                <span className="font-semibold">{getCompletionPercentage()}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Économies Potentielles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getTotalPotentialSavings().toLocaleString('fr-CA', {
                  style: 'currency',
                  currency: 'CAD'
                })}
              </div>
              <div className="text-sm text-gray-600">par année</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              Niveau d'Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {getCompletionPercentage() < 30 ? 'Débutant' :
                 getCompletionPercentage() < 70 ? 'Intermédiaire' : 'Expert'}
              </div>
              <div className="text-sm text-gray-600">
                {getCompletionPercentage() < 30 ? 'Continuez à apprendre!' :
                 getCompletionPercentage() < 70 ? 'Bon progrès!' : 'Maîtrise fiscale!'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="concepts">Concepts Clés</TabsTrigger>
          <TabsTrigger value="strategies">Stratégies</TabsTrigger>
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
        </TabsList>

        <TabsContent value="concepts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {taxConcepts.map((concept) => (
              <Card key={concept.id} className={`transition-all duration-200 ${
                concept.completed ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-md'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-start gap-2">
                      {concept.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                      )}
                      {concept.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(concept.difficulty)}>
                      {concept.difficulty === 'beginner' ? 'Débutant' :
                       concept.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{concept.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{concept.timeToLearn}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {concept.estimatedSavings.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD'
                          })}/an
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleConceptCompletion(concept.id)}
                    variant={concept.completed ? "secondary" : "default"}
                    className="w-full"
                  >
                    {concept.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concept maîtrisé
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Apprendre ce concept
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Stratégies par Âge
              </CardTitle>
              <CardDescription>
                Sélectionnez votre âge pour voir les stratégies applicables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <label htmlFor="age-selector" className="font-medium">Votre âge:</label>
                <select
                  id="age-selector"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                  className="p-2 border rounded-md"
                >
                  {Array.from({ length: 21 }, (_, i) => i + 50).map(age => (
                    <option key={age} value={age}>{age} ans</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getAgeSpecificStrategies().map((strategy) => (
                  <Card key={strategy.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplexityColor(strategy.complexity)}>
                          Complexité {strategy.complexity === 'low' ? 'Faible' :
                                    strategy.complexity === 'medium' ? 'Moyenne' : 'Élevée'}
                        </Badge>
                        <Badge variant="outline">{strategy.applicableAge}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
