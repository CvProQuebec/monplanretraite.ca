import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Progress } from './progress';
import { Checkbox } from './checkbox';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign,
  CreditCard,
  Building,
  Calendar,
  PiggyBank,
  Clock,
  Heart,
  BookOpen,
  FileText,
  MapPin,
  Star,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Info
} from 'lucide-react';

interface TipStatus {
  id: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  potentialSavings?: string;
}

interface TipData {
  id: number;
  title: string;
  description: string;
  detailedExplanation: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  potentialSavings?: string;
  actionSteps: string[];
  commonMistakes: string[];
  expertTip: string;
}

const TenEssentialTipsDashboard: React.FC = () => {
  const [tipStatuses, setTipStatuses] = useState<TipStatus[]>([]);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  const tips: TipData[] = [
    {
      id: 1,
      title: "Connaître ses dépenses mensuelles",
      description: "Avoir une idée claire de vos dépenses à ±500$ près",
      detailedExplanation: "Vous devez savoir où va votre argent pour planifier votre retraite. Sans cette base, impossible de déterminer combien vous aurez besoin.",
      icon: <DollarSign className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: '2-3 heures',
      potentialSavings: 'Base essentielle',
      actionSteps: [
        'Analysez vos relevés bancaires des 3 derniers mois',
        'Catégorisez vos dépenses (logement, nourriture, transport, etc.)',
        'Identifiez les dépenses qui changeront à la retraite',
        'Calculez votre moyenne mensuelle'
      ],
      commonMistakes: [
        'Oublier les dépenses annuelles (assurances, taxes)',
        'Ne pas prévoir les nouveaux coûts de retraite',
        'Être trop précis au cent près'
      ],
      expertTip: "Concentrez-vous sur les grosses catégories. Une précision à ±500$ est suffisante pour une bonne planification."
    },
    {
      id: 2,
      title: "Être libre de dettes",
      description: "Éliminer les dettes non-productives avant la retraite",
      detailedExplanation: "Les dettes de consommation (cartes de crédit, prêts personnels) sont un fardeau psychologique et financier en retraite.",
      icon: <CreditCard className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: 'Variable',
      potentialSavings: '15-25% d\'intérêts',
      actionSteps: [
        'Listez toutes vos dettes avec taux d\'intérêt',
        'Priorisez le remboursement des taux les plus élevés',
        'Considérez travailler plus longtemps si nécessaire',
        'Gardez seulement les dettes liées à des actifs (hypothèque)'
      ],
      commonMistakes: [
        'Garder des dettes de consommation "parce qu\'on peut se le permettre"',
        'Ne pas avoir de plan de remboursement',
        'Ignorer l\'impact psychologique des dettes'
      ],
      expertTip: "Même si vous pouvez vous permettre les paiements, l'absence de dettes en retraite procure une tranquillité d'esprit inestimable."
    },
    {
      id: 3,
      title: "Consolider ses actifs",
      description: "Regrouper vos comptes dans 1-2 institutions maximum",
      detailedExplanation: "Avoir des comptes éparpillés complique la gestion, augmente les frais et crée de la paperasse inutile.",
      icon: <Building className="w-6 h-6" />,
      priority: 'medium',
      estimatedTime: '1-2 mois',
      potentialSavings: '500-2000$ en frais',
      actionSteps: [
        'Inventoriez tous vos comptes (REER, CELI, non-enregistrés)',
        'Comparez les frais et services des institutions',
        'Choisissez 1-2 institutions principales',
        'Transférez progressivement vos actifs'
      ],
      commonMistakes: [
        'Confondre diversification avec éparpillement',
        'Ne pas vérifier les frais de transfert',
        'Oublier de mettre à jour les bénéficiaires'
      ],
      expertTip: "La diversification, c'est dans vos placements, pas dans le nombre d'institutions. Simplifiez votre vie !"
    },
    {
      id: 4,
      title: "Automatiser les retraits",
      description: "Maintenir la même fréquence de revenus qu'avant la retraite",
      detailedExplanation: "Si vous étiez payé aux 2 semaines, continuez ainsi. Ne perturbez pas 40 ans d'habitudes financières.",
      icon: <Calendar className="w-6 h-6" />,
      priority: 'medium',
      estimatedTime: '1 heure',
      potentialSavings: 'Stabilité psychologique',
      actionSteps: [
        'Identifiez votre fréquence de paie actuelle',
        'Calculez le montant par période nécessaire',
        'Configurez les retraits automatiques',
        'Synchronisez avec vos pensions gouvernementales'
      ],
      commonMistakes: [
        'Passer aux retraits mensuels "par simplicité"',
        'Ne pas coordonner avec CPP/RRQ',
        'Oublier d\'ajuster pour l\'inflation'
      ],
      expertTip: "Votre cerveau est habitué à un certain rythme de revenus. Respectez-le pour réduire le stress de transition."
    },
    {
      id: 5,
      title: "Stratégie bucket (cash wedge)",
      description: "Protéger 3-5 ans de revenus contre la volatilité des marchés",
      detailedExplanation: "Gardez 3-5 ans de revenus en liquidités pour survivre aux baisses de marché sans vendre à perte.",
      icon: <PiggyBank className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: '2-4 heures',
      potentialSavings: 'Protection contre les pertes',
      actionSteps: [
        'Calculez vos besoins annuels de revenus',
        'Multipliez par 3-5 ans selon votre tolérance au risque',
        'Placez ce montant en liquidités/obligations courtes',
        'Révisez annuellement'
      ],
      commonMistakes: [
        'Garder tout en actions pour "maximiser les rendements"',
        'Sous-estimer la fréquence des corrections de marché',
        'Ne pas ajuster selon l\'âge'
      ],
      expertTip: "Il y aura des baisses de marché pendant votre retraite. C'est garanti. Préparez-vous maintenant !"
    },
    {
      id: 6,
      title: "Retarder la RRQ/CPP",
      description: "Considérer reporter la pension jusqu'à 70 ans",
      detailedExplanation: "Retarder votre RRQ/CPP peut augmenter vos prestations de 42% et optimiser votre fiscalité globale.",
      icon: <Clock className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: '3-5 heures d\'analyse',
      potentialSavings: '20-40% de revenus en plus',
      actionSteps: [
        'Calculez vos prestations à 62, 65 et 70 ans',
        'Analysez l\'impact fiscal global',
        'Évaluez vos autres sources de revenus',
        'Consultez un planificateur financier'
      ],
      commonMistakes: [
        'Prendre à 62 ans "parce que c\'est disponible"',
        'Ne pas considérer l\'impact fiscal',
        'Ignorer l\'espérance de vie'
      ],
      expertTip: "La plupart des gens bénéficieraient de retarder leur RRQ/CPP, mais l'analyse doit être personnalisée."
    },
    {
      id: 7,
      title: "Retire to something",
      description: "Planifier À QUOI vous consacrerez votre retraite",
      detailedExplanation: "Ne retraite pas SEULEMENT du travail, mais VERS quelque chose. Sinon, vous serez perdu.",
      icon: <Heart className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: '1-3 ans de préparation',
      potentialSavings: 'Bonheur et santé mentale',
      actionSteps: [
        'Identifiez vos passions et intérêts',
        'Explorez des activités 1-3 ans avant la retraite',
        'Développez un réseau social hors travail',
        'Planifiez une routine structurée'
      ],
      commonMistakes: [
        'Penser que "se reposer" suffira',
        'Attendre la retraite pour explorer',
        'Sous-estimer l\'importance du réseau social'
      ],
      expertTip: "C'est le conseil qui a le plus d'impact selon mes clients. Commencez à y penser MAINTENANT !"
    },
    {
      id: 8,
      title: "S'éduquer fiscalement",
      description: "Comprendre les crédits, déductions et stratégies fiscales",
      detailedExplanation: "La retraite change complètement votre situation fiscale. Éduquez-vous pour économiser des milliers de dollars.",
      icon: <BookOpen className="w-6 h-6" />,
      priority: 'medium',
      estimatedTime: 'Continu',
      potentialSavings: '2000-5000$ par année',
      actionSteps: [
        'Apprenez les crédits d\'âge et de pension',
        'Comprenez le fractionnement de revenus',
        'Étudiez les seuils de récupération',
        'Suivez des formations ou consultez des experts'
      ],
      commonMistakes: [
        'Laisser tout à l\'accountant sans comprendre',
        'Ne pas planifier les stratégies à l\'avance',
        'Ignorer les changements annuels'
      ],
      expertTip: "Vous n'avez pas besoin d'être expert, mais comprendre les bases peut vous faire économiser énormément."
    },
    {
      id: 9,
      title: "Mettre à jour documents succession",
      description: "Testament, mandat, bénéficiaires à jour",
      detailedExplanation: "Des documents désuets peuvent créer des complications majeures et coûteuses pour vos proches.",
      icon: <FileText className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: '2-4 heures',
      potentialSavings: 'Évite complications coûteuses',
      actionSteps: [
        'Révisez votre testament',
        'Mettez à jour les bénéficiaires (REER, CELI, assurances)',
        'Vérifiez vos mandats d\'inaptitude',
        'Consultez un notaire si nécessaire'
      ],
      commonMistakes: [
        'Reporter indéfiniment',
        'Oublier de mettre à jour après changements familiaux',
        'Ne pas informer les proches'
      ],
      expertTip: "J'ai vu des familles déchirées par des documents désuets. Ne laissez pas ça arriver à vos proches."
    },
    {
      id: 10,
      title: "Avoir un plan GPS complet",
      description: "Obtenir une roadmap détaillée pour votre retraite",
      detailedExplanation: "Comme pour un voyage, vous avez besoin d'un plan détaillé qui montre exactement où aller et comment y arriver.",
      icon: <MapPin className="w-6 h-6" />,
      priority: 'high',
      estimatedTime: '5-10 heures avec expert',
      potentialSavings: '10-30% d\'optimisation',
      actionSteps: [
        'Consultez un planificateur financier qualifié',
        'Demandez un plan détaillé avec projections',
        'Incluez tous les aspects (fiscal, succession, assurance)',
        'Révisez annuellement'
      ],
      commonMistakes: [
        'Essayer de tout faire soi-même',
        'Choisir un "vendeur" plutôt qu\'un planificateur',
        'Ne pas réviser le plan régulièrement'
      ],
      expertTip: "Un bon plan peut vous faire économiser des dizaines de milliers de dollars. C'est l'investissement le plus rentable que vous ferez."
    }
  ];

  // Initialiser les statuts des conseils
  useEffect(() => {
    const initialStatuses = tips.map(tip => ({
      id: tip.id,
      completed: false,
      priority: tip.priority,
      estimatedTime: tip.estimatedTime,
      potentialSavings: tip.potentialSavings
    }));
    setTipStatuses(initialStatuses);
  }, []);

  const toggleTipCompletion = (tipId: number) => {
    setTipStatuses(prev => 
      prev.map(status => 
        status.id === tipId 
          ? { ...status, completed: !status.completed }
          : status
      )
    );
  };

  const getCompletionPercentage = () => {
    if (tipStatuses.length === 0) return 0;
    const completed = tipStatuses.filter(status => status.completed).length;
    return Math.round((completed / tipStatuses.length) * 100);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const selectedTipData = selectedTip ? tips.find(tip => tip.id === selectedTip) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-mpr-interactive bg-clip-text text-transparent mb-4">
          Les 10 Conseils Essentiels pour la Retraite
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Basés sur l'expertise d'un planificateur financier professionnel. 
          Suivez ces conseils pour transformer votre retraite et éviter les erreurs coûteuses.
        </p>
      </div>

      {/* Barre de progression globale */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-600" />
            Votre progression
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {getCompletionPercentage()}% complété
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={getCompletionPercentage()} className="h-3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-red-600">
                {tipStatuses.filter(s => s.priority === 'high' && !s.completed).length}
              </div>
              <div className="text-sm text-gray-600">Priorité haute restante</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {tipStatuses.filter(s => s.completed).length}
              </div>
              <div className="text-sm text-gray-600">Conseils complétés</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-mpr-interactive">
                {tipStatuses.filter(s => !s.completed).length}
              </div>
              <div className="text-sm text-gray-600">Conseils restants</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerte motivationnelle */}
      <Alert className="border-mpr-interactive bg-mpr-interactive-lt">
        <Zap className="h-5 w-5 text-mpr-interactive" />
        <AlertTitle className="text-mpr-navy">💡 CONSEIL D'EXPERT</AlertTitle>
        <AlertDescription className="text-mpr-navy text-lg">
          <strong>Ne vous laissez pas submerger !</strong> Commencez par les conseils de priorité haute. 
          Même en appliquant seulement 3-4 de ces conseils, vous pourriez économiser des milliers de dollars 
          et réduire considérablement le stress de votre retraite.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des conseils */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Liste des conseils</h2>
          
          {tips.map((tip) => {
            const status = tipStatuses.find(s => s.id === tip.id);
            const isCompleted = status?.completed || false;
            
            return (
              <Card 
                key={tip.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTip === tip.id ? 'ring-2 ring-mpr-interactive bg-mpr-interactive-lt' : ''
                } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                onClick={() => setSelectedTip(tip.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox et icône */}
                    <div className="flex flex-col items-center gap-2">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleTipCompletion(tip.id)}
                        className="w-5 h-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {React.cloneElement(tip.icon as React.ReactElement, {
                          className: `w-6 h-6 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`
                        })}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${isCompleted ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                          {tip.id}. {tip.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getPriorityColor(tip.priority)}>
                            {getPriorityIcon(tip.priority)}
                            {tip.priority === 'high' ? 'Haute' : tip.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                          {isCompleted && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complété
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-gray-600 mb-3 ${isCompleted ? 'line-through' : ''}`}>
                        {tip.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {tip.estimatedTime}
                        </div>
                        {tip.potentialSavings && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {tip.potentialSavings}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Panneau de détails */}
        <div className="lg:col-span-1">
          {selectedTipData ? (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {React.cloneElement(selectedTipData.icon as React.ReactElement, {
                    className: "w-6 h-6 text-mpr-interactive"
                  })}
                  {selectedTipData.title}
                </CardTitle>
                <CardDescription>
                  {selectedTipData.detailedExplanation}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Étapes d'action */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-mpr-interactive" />
                    Plan d'action
                  </h4>
                  <ul className="space-y-2">
                    {selectedTipData.actionSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 bg-mpr-interactive-lt text-mpr-interactive rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Erreurs communes */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Erreurs à éviter
                  </h4>
                  <ul className="space-y-2">
                    {selectedTipData.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conseil d'expert */}
                <Alert className="border-yellow-400 bg-yellow-50">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Conseil d'expert</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    {selectedTipData.expertTip}
                  </AlertDescription>
                </Alert>

                {/* Bouton d'action */}
                <Button 
                  onClick={() => toggleTipCompletion(selectedTipData.id)}
                  className={`w-full ${
                    tipStatuses.find(s => s.id === selectedTipData.id)?.completed
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-mpr-interactive hover:bg-mpr-interactive-dk'
                  }`}
                >
                  {tipStatuses.find(s => s.id === selectedTipData.id)?.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer comme non-complété
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Marquer comme complété
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Info className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Sélectionnez un conseil
                </h3>
                <p className="text-gray-500">
                  Cliquez sur un conseil à gauche pour voir les détails, 
                  le plan d'action et les conseils d'expert.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Section motivation finale */}
      <Card className="bg-gradient-to-r from-purple-50 to-mpr-interactive-lt border-purple-200">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-purple-800">
              Votre retraite de rêve vous attend !
            </h2>
          </div>
          <p className="text-lg text-purple-700 mb-6 max-w-3xl mx-auto">
            Chaque conseil que vous appliquez vous rapproche d'une retraite plus sereine, 
            plus riche et plus épanouissante. Ne laissez pas le temps passer - 
            commencez dès aujourd'hui !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Zap className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
            <Button variant="outline" size="lg" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Users className="w-5 h-5 mr-2" />
              Consulter un expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenEssentialTipsDashboard;
