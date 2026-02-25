import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { BookOpen, GraduationCap, Shield, Calculator, TrendingUp, TrendingDown, Clock, Users, Target, DollarSign, Building, Heart, Banknote, Brain, Activity } from 'lucide-react';

interface GovernmentModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'Programmes' | 'Stratégies' | 'Protection' | 'Planification';
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedTime: string;
  keyTopics: string[];
  governmentPrograms: string[];
  component?: React.ComponentType;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  modules: string[];
  targetAudience: string;
  duration: string;
  prerequisites: string[];
}

const GovernmentEducationCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const governmentModules: GovernmentModule[] = [
    {
      id: 'rrsp-meltdown',
      name: 'Stratégies de fonte du REER (RRSP Meltdown)',
      description: 'Techniques avancées pour optimiser fiscalement la réduction de vos REER avant 71 ans',
      icon: <TrendingDown className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Avancé',
      estimatedTime: '35 min',
      keyTopics: ['Fonte graduelle vs accélérée', 'Optimisation fiscale', 'Timing optimal', 'Fractionnement de revenu'],
      governmentPrograms: ['REER', 'FERR', 'Fractionnement de pension', 'Tranches d\'imposition']
    },
    {
      id: 'cpp-timing',
      name: 'Optimisation du timing RRQ/CPP (60-70 ans)',
      description: 'Stratégies avancées pour maximiser vos prestations du Régime de rentes du Québec et du Régime de pensions du Canada',
      icon: <Clock className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Intermédiaire',
      estimatedTime: '30 min',
      keyTopics: ['Début précoce vs report', 'Seuils de rentabilité', 'Stratégies de couple', 'Optimisation fiscale'],
      governmentPrograms: ['RRQ', 'CPP', 'Prestations de survivant', 'Fractionnement de pension']
    },
    {
      id: 'spending-psychology',
      name: 'Psychologie des dépenses de retraite',
      description: 'Comprendre les comportements financiers et les phases de dépenses pour une retraite équilibrée',
      icon: <Brain className="h-5 w-5" />,
      category: 'Planification',
      difficulty: 'Intermédiaire',
      estimatedTime: '25 min',
      keyTopics: ['Phases Go-Go/Slow-Go/No-Go', 'Biais comportementaux', 'Stratégies d\'adaptation', 'Budgétisation par phases'],
      governmentPrograms: ['Données Statistique Canada', 'Espérance de vie', 'Coûts de santé', 'Planification long terme']
    },
    {
      id: 'dynamic-withdrawal',
      name: 'Planification dynamique des retraits',
      description: 'Stratégies avancées pour optimiser les retraits de retraite selon les conditions de marché et les besoins personnels',
      icon: <Activity className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Avancé',
      estimatedTime: '40 min',
      keyTopics: ['Stratégie des buckets', 'Retraits dynamiques', 'Tampons de liquidité', 'Alternatives à la règle 4%'],
      governmentPrograms: ['Optimisation fiscale', 'Gestion de portefeuille', 'Séquence des rendements', 'Planification long terme']
    },
    {
      id: 'rvdaa',
      name: 'Rente viagère différée à un âge avancé (RVDAA)',
      description: 'Nouveau programme gouvernemental (2020+) pour optimiser les revenus de retraite tardive',
      icon: <Banknote className="h-5 w-5" />,
      category: 'Programmes',
      difficulty: 'Avancé',
      estimatedTime: '30 min',
      keyTopics: ['Transferts limités à 25%', 'Plafonds annuels', 'Calculs de pénalités', 'Optimisation fiscale'],
      governmentPrograms: ['RVDAA', 'REER', 'FERR', 'RPA', 'RPAC']
    },
    {
      id: 'ferr-optimization',
      name: 'Optimisation avancée des FERR',
      description: 'Stratégies gouvernementales pour maximiser les retraits et minimiser l\'impôt',
      icon: <Calculator className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Intermédiaire',
      estimatedTime: '25 min',
      keyTopics: ['Formules officielles', 'Âge du conjoint', 'Retraits minimums', 'Planification fiscale'],
      governmentPrograms: ['FERR', 'REER', 'Fractionnement de revenu']
    },
    {
      id: 'celiapp',
      name: 'Compte d\'épargne libre d\'impôt pour l\'achat d\'une première propriété',
      description: 'Programme gouvernemental 2023+ pour les premiers acheteurs',
      icon: <Building className="h-5 w-5" />,
      category: 'Programmes',
      difficulty: 'Débutant',
      estimatedTime: '20 min',
      keyTopics: ['Limites de cotisation', 'Retraits admissibles', 'Conditions d\'éligibilité', 'Avantages fiscaux'],
      governmentPrograms: ['CELIAPP', 'RAP', 'CELI', 'REER']
    },
    {
      id: 'withdrawal-sequence',
      name: 'Séquence optimale de décaissement',
      description: 'Ordre recommandé par le gouvernement pour les retraits de retraite',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Intermédiaire',
      estimatedTime: '35 min',
      keyTopics: ['CELI en premier', 'Comptes non-enregistrés', 'REER/FERR', 'Optimisation fiscale'],
      governmentPrograms: ['CELI', 'REER', 'FERR', 'Comptes imposables']
    },
    {
      id: 'healthcare-planning',
      name: 'Planification des coûts de santé',
      description: 'Préparation aux dépenses de santé selon le système canadien',
      icon: <Heart className="h-5 w-5" />,
      category: 'Planification',
      difficulty: 'Intermédiaire',
      estimatedTime: '30 min',
      keyTopics: ['Système de santé canadien', 'Coûts non couverts', 'Assurances complémentaires', 'Planification long terme'],
      governmentPrograms: ['Assurance-maladie', 'SV', 'SRG', 'Crédits d\'impôt']
    },
    {
      id: 'tax-optimization',
      name: 'Optimisation fiscale multi-sources',
      description: 'Coordination de multiples sources de revenus selon les règles fiscales canadiennes',
      icon: <DollarSign className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Avancé',
      estimatedTime: '40 min',
      keyTopics: ['Fractionnement de revenu', 'Report RRQ/RPC', 'Séquence de retraits', 'Crédits d\'impôt'],
      governmentPrograms: ['RRQ', 'SV', 'FERR', 'Fractionnement', 'Crédits d\'impôt']
    },
    {
      id: 'longevity-planning',
      name: 'Planification de longévité financière',
      description: 'Stratégies pour une retraite de 30+ ans basées sur les données de Statistique Canada',
      icon: <Target className="h-5 w-5" />,
      category: 'Planification',
      difficulty: 'Avancé',
      estimatedTime: '35 min',
      keyTopics: ['Espérance de vie', 'Suffisance des actifs', 'Projections long terme', 'Gestion des risques'],
      governmentPrograms: ['Statistique Canada', 'SV', 'RRQ', 'Prestations de survivant']
    },
    {
      id: 'financial-consolidation',
      name: 'Consolidation financière pour la retraite',
      description: 'Optimisation de la gestion des comptes selon les recommandations gouvernementales',
      icon: <Users className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Intermédiaire',
      estimatedTime: '25 min',
      keyTopics: ['Gestion des comptes', 'Réduction des frais', 'Diversification', 'Simplification'],
      governmentPrograms: ['REER', 'FERR', 'CELI', 'Comptes multiples']
    },
    {
      id: 'progressive-retirement',
      name: 'Stratégies de retraite progressive',
      description: 'Transition graduelle vers la retraite avec optimisation des prestations gouvernementales',
      icon: <Clock className="h-5 w-5" />,
      category: 'Stratégies',
      difficulty: 'Intermédiaire',
      estimatedTime: '30 min',
      keyTopics: ['Retraite graduelle', 'Timing des prestations', 'Travail à temps partiel', 'Optimisation RRQ/SV'],
      governmentPrograms: ['RRQ', 'SV', 'Assurance-emploi', 'REER']
    },
    {
      id: 'inflation-protection',
      name: 'Protection contre l\'inflation',
      description: 'Stratégies de protection basées sur les données de la Banque du Canada',
      icon: <Shield className="h-5 w-5" />,
      category: 'Protection',
      difficulty: 'Intermédiaire',
      estimatedTime: '30 min',
      keyTopics: ['Impact de l\'inflation', 'Prestations indexées', 'Stratégies de protection', 'Actifs réels'],
      governmentPrograms: ['Banque du Canada', 'RRQ indexé', 'SV indexée', 'Obligations du Canada']
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'beginner',
      name: 'Parcours débutant - Bases gouvernementales',
      description: 'Introduction aux programmes gouvernementaux essentiels pour la retraite',
      modules: ['celiapp', 'ferr-optimization', 'inflation-protection'],
      targetAudience: 'Nouveaux planificateurs de retraite (25-45 ans)',
      duration: '1h 15min',
      prerequisites: ['Connaissance de base des REER/CELI']
    },
    {
      id: 'intermediate',
      name: 'Parcours intermédiaire - Optimisation stratégique',
      description: 'Stratégies avancées pour optimiser les prestations et minimiser l\'impôt',
      modules: ['withdrawal-sequence', 'progressive-retirement', 'financial-consolidation', 'healthcare-planning'],
      targetAudience: 'Pré-retraités (45-65 ans)',
      duration: '2h 00min',
      prerequisites: ['Compréhension des REER/FERR', 'Connaissance fiscale de base']
    },
    {
      id: 'advanced',
      name: 'Parcours expert - Maîtrise gouvernementale',
      description: 'Expertise complète des programmes gouvernementaux et optimisations avancées',
      modules: ['rvdaa', 'tax-optimization', 'longevity-planning'],
      targetAudience: 'Retraités et conseillers financiers',
      duration: '1h 45min',
      prerequisites: ['Expérience en planification financière', 'Connaissance fiscale avancée']
    },
    {
      id: 'comprehensive',
      name: 'Parcours complet - Expert gouvernemental',
      description: 'Formation complète sur tous les aspects de l\'expertise gouvernementale',
      modules: ['celiapp', 'ferr-optimization', 'withdrawal-sequence', 'healthcare-planning', 'tax-optimization', 'longevity-planning', 'financial-consolidation', 'progressive-retirement', 'inflation-protection', 'rvdaa'],
      targetAudience: 'Professionnels et passionnés de planification financière',
      duration: '4h 30min',
      prerequisites: ['Solide base en finances personnelles']
    }
  ];

  const categories = ['all', 'Programmes', 'Stratégies', 'Protection', 'Planification'];

  const filteredModules = selectedCategory === 'all' 
    ? governmentModules 
    : governmentModules.filter(module => module.category === selectedCategory);

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Programmes': return 'bg-mpr-interactive-lt text-mpr-navy';
      case 'Stratégies': return 'bg-purple-100 text-purple-800';
      case 'Protection': return 'bg-orange-100 text-orange-800';
      case 'Planification': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleModuleCompletion = (moduleId: string) => {
    const newCompleted = new Set(completedModules);
    if (newCompleted.has(moduleId)) {
      newCompleted.delete(moduleId);
    } else {
      newCompleted.add(moduleId);
    }
    setCompletedModules(newCompleted);
  };

  const getPathProgress = (pathId: string): number => {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return 0;
    const completedInPath = path.modules.filter(moduleId => completedModules.has(moduleId)).length;
    return Math.round((completedInPath / path.modules.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Centre d'éducation gouvernementale
          </CardTitle>
          <CardDescription>
            Maîtrisez l'expertise du Gouvernement du Canada en matière de planification de retraite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Expertise officielle :</strong> Tous les modules sont basés sur les documents officiels 
              du Gouvernement du Canada, incluant les dernières mises à jour des programmes RVDAA (2020+), 
              CELIAPP (2023+) et les formules officielles des prestations.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="modules">Modules d'expertise</TabsTrigger>
              <TabsTrigger value="paths">Parcours d'apprentissage</TabsTrigger>
              <TabsTrigger value="progress">Mon progrès</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'Tous' : category}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((module) => (
                  <Card key={module.id} className={`cursor-pointer transition-all hover:shadow-lg ${completedModules.has(module.id) ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-start gap-2 text-base">
                        {module.icon}
                        <div className="flex-1">
                          {module.name}
                          {completedModules.has(module.id) && (
                            <Badge className="ml-2 bg-green-100 text-green-800">Complété</Badge>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge className={getCategoryColor(module.category)} variant="secondary">
                          {module.category}
                        </Badge>
                        <Badge className={getDifficultyColor(module.difficulty)} variant="secondary">
                          {module.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {module.estimatedTime}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-1">Sujets clés :</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.keyTopics.slice(0, 2).map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {module.keyTopics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{module.keyTopics.length - 2} autres
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-1">Programmes gouvernementaux :</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.governmentPrograms.slice(0, 2).map((program, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                          {module.governmentPrograms.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{module.governmentPrograms.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {/* Navigation vers le module */}}
                        >
                          Commencer
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleModuleCompletion(module.id)}
                        >
                          {completedModules.has(module.id) ? '✓' : '○'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="paths" className="space-y-4">
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <Card key={path.id} className={`cursor-pointer transition-all hover:shadow-lg ${selectedPath === path.id ? 'ring-2 ring-mpr-interactive' : ''}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{path.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{path.duration}</Badge>
                          <div className="text-sm text-gray-600">
                            {getPathProgress(path.id)}% complété
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <strong>Public cible :</strong> {path.targetAudience}
                      </div>
                      
                      <div>
                        <strong>Prérequis :</strong>
                        <ul className="list-disc list-inside ml-4 text-sm">
                          {path.prerequisites.map((prereq, i) => (
                            <li key={i}>{prereq}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong>Modules inclus ({path.modules.length}) :</strong>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {path.modules.map((moduleId) => {
                            const module = governmentModules.find(m => m.id === moduleId);
                            if (!module) return null;
                            return (
                              <div key={moduleId} className={`p-2 border rounded text-sm ${completedModules.has(moduleId) ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2">
                                  {module.icon}
                                  <span className="flex-1">{module.name}</span>
                                  {completedModules.has(moduleId) && <span className="text-green-600">✓</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                        >
                          {selectedPath === path.id ? 'Masquer détails' : 'Commencer parcours'}
                        </Button>
                        <div className="w-full bg-gray-200 rounded-full h-2 self-center">
                          <div 
                            className="bg-mpr-interactive h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${getPathProgress(path.id)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-mpr-interactive">
                      {completedModules.size}
                    </div>
                    <div className="text-sm text-gray-600">Modules complétés</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((completedModules.size / governmentModules.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Progression totale</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {learningPaths.filter(path => getPathProgress(path.id) === 100).length}
                    </div>
                    <div className="text-sm text-gray-600">Parcours terminés</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {completedModules.size * 25}min
                    </div>
                    <div className="text-sm text-gray-600">Temps d'étude</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Progression par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Programmes', 'Stratégies', 'Protection', 'Planification'].map(category => {
                      const categoryModules = governmentModules.filter(m => m.category === category);
                      const completedInCategory = categoryModules.filter(m => completedModules.has(m.id)).length;
                      const progress = Math.round((completedInCategory / categoryModules.length) * 100);
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{category}</span>
                            <span className="text-sm text-gray-600">
                              {completedInCategory}/{categoryModules.length} ({progress}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-mpr-interactive h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations personnalisées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedModules.size === 0 && (
                      <Alert>
                        <BookOpen className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Commencez votre apprentissage :</strong> Nous recommandons de débuter par le 
                          parcours débutant avec le module CELIAPP pour comprendre les bases des programmes gouvernementaux.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {completedModules.size > 0 && completedModules.size < 3 && (
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Continuez sur votre lancée :</strong> Excellent début ! Poursuivez avec les modules 
                          d'optimisation FERR et de protection contre l'inflation pour renforcer vos bases.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {completedModules.size >= 3 && completedModules.size < 7 && (
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Niveau intermédiaire :</strong> Vous maîtrisez bien les bases ! Il est temps d'explorer 
                          les stratégies avancées comme l'optimisation fiscale multi-sources et la planification de longévité.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {completedModules.size >= 7 && (
                      <Alert>
                        <GraduationCap className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Expert en formation :</strong> Félicitations ! Vous approchez du niveau expert. 
                          Complétez les modules RVDAA et d'optimisation fiscale pour devenir un véritable expert 
                          de l'expertise gouvernementale canadienne.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentEducationCenter;
