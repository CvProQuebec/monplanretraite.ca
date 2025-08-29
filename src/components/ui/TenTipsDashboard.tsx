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
  Info,
  DollarSign,
  CreditCard,
  Building2,
  Repeat,
  Shield,
  Clock,
  Heart,
  BookOpen,
  FileText,
  MapPin,
  Star,
  Target,
  Zap,
  TrendingUp,
  Users,
  Calculator
} from 'lucide-react';

interface TipStatus {
  id: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short' | 'ongoing';
}

interface TipData {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short' | 'ongoing';
  details: string[];
  actionSteps: string[];
  impact: string;
  commonMistakes: string[];
}

const TenTipsDashboard: React.FC = () => {
  const [tipStatuses, setTipStatuses] = useState<TipStatus[]>([]);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  const tips: TipData[] = [
    {
      id: 1,
      title: "Connaître ses dépenses mensuelles",
      description: "Avoir une idée claire de vos dépenses actuelles (à 500$ près)",
      icon: <DollarSign className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'immediate',
      details: [
        "Vous devez connaître votre 'burn rate' mensuel",
        "Certaines dépenses disparaîtront, d'autres apparaîtront",
        "Base essentielle pour calculer vos besoins de retraite",
        "Permet de planifier avec votre conseiller financier"
      ],
      actionSteps: [
        "Analysez vos relevés bancaires des 3 derniers mois",
        "Catégorisez vos dépenses principales",
        "Identifiez les dépenses qui changeront à la retraite",
        "Documentez votre budget mensuel moyen"
      ],
      impact: "Fondation de toute planification financière réussie",
      commonMistakes: [
        "Sous-estimer les dépenses de santé",
        "Oublier les dépenses annuelles (taxes, assurances)",
        "Ne pas prévoir l'inflation"
      ]
    },
    {
      id: 2,
      title: "Être libre de dettes",
      description: "Éliminer les dettes non-productives avant la retraite",
      icon: <CreditCard className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'short',
      details: [
        "Les dettes de consommation sont un fardeau psychologique",
        "Une hypothèque peut être acceptable si planifiée",
        "Libère du cash flow pour profiter de la retraite",
        "Réduit le stress financier"
      ],
      actionSteps: [
        "Listez toutes vos dettes actuelles",
        "Priorisez par taux d'intérêt (méthode avalanche)",
        "Créez un plan de remboursement accéléré",
        "Considérez travailler plus longtemps si nécessaire"
      ],
      impact: "Paix d'esprit et flexibilité financière maximale",
      commonMistakes: [
        "Garder des dettes à taux élevé",
        "Ne pas avoir de plan de remboursement",
        "Accumuler de nouvelles dettes près de la retraite"
      ]
    },
    {
      id: 3,
      title: "Consolider ses actifs",
      description: "Regrouper vos comptes dans 1-2 institutions maximum",
      icon: <Building2 className="w-5 h-5" />,
      priority: 'medium',
      timeframe: 'short',
      details: [
        "Simplification administrative cruciale",
        "Évite les multiples T4RIF",
        "Facilite la gestion des retraits",
        "Réduit les frais et la complexité"
      ],
      actionSteps: [
        "Inventoriez tous vos comptes actuels",
        "Choisissez 1-2 institutions principales",
        "Planifiez les transferts (attention aux frais)",
        "Consolidez progressivement"
      ],
      impact: "Gestion simplifiée et plus efficace de vos actifs",
      commonMistakes: [
        "Confondre diversification avec éparpillement",
        "Ne pas vérifier les frais de transfert",
        "Procrastiner sur cette tâche"
      ]
    },
    {
      id: 4,
      title: "Automatiser les retraits",
      description: "Maintenir la même fréquence de revenus qu'avant la retraite",
      icon: <Repeat className="w-5 h-5" />,
      priority: 'medium',
      timeframe: 'immediate',
      details: [
        "Gardez vos habitudes de cash flow",
        "Si payé aux 2 semaines, continuez ainsi",
        "Synchronisez avec vos pensions mensuelles",
        "Aspect psychologique important"
      ],
      actionSteps: [
        "Identifiez votre fréquence de paie actuelle",
        "Calculez les montants de retraits nécessaires",
        "Configurez les retraits automatiques",
        "Ajustez selon vos pensions gouvernementales"
      ],
      impact: "Transition psychologique plus douce vers la retraite",
      commonMistakes: [
        "Changer drastiquement ses habitudes",
        "Ne pas synchroniser avec les pensions",
        "Oublier l'aspect psychologique"
      ]
    },
    {
      id: 5,
      title: "Utiliser une stratégie bucket",
      description: "Protéger 3-5 ans de revenus en liquidités",
      icon: <Shield className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'immediate',
      details: [
        "Cash wedge de 3-5 ans de dépenses",
        "Protection contre la volatilité des marchés",
        "Permet de ne pas vendre en baisse",
        "Essentiel en début de retraite"
      ],
      actionSteps: [
        "Calculez vos besoins annuels de revenus",
        "Multipliez par 3-5 ans",
        "Placez ce montant en liquidités/obligations courtes",
        "Réajustez périodiquement"
      ],
      impact: "Protection contre les risques de séquence de rendements",
      commonMistakes: [
        "Sous-estimer le montant nécessaire",
        "Placer tout en actions",
        "Ne pas réajuster le cash wedge"
      ]
    },
    {
      id: 6,
      title: "Retarder la RRQ/CPP",
      description: "Considérer reporter jusqu'à 70 ans pour maximiser les prestations",
      icon: <Clock className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'short',
      details: [
        "Augmentation de 0.7% par mois de report",
        "42% de plus à 70 ans vs 60 ans",
        "Permet d'optimiser la fiscalité globale",
        "Utilise d'autres sources en attendant"
      ],
      actionSteps: [
        "Calculez vos prestations à différents âges",
        "Évaluez vos autres sources de revenus",
        "Analysez l'impact fiscal global",
        "Prenez une décision éclairée"
      ],
      impact: "Revenus gouvernementaux maximisés à vie",
      commonMistakes: [
        "Prendre automatiquement à 62 ans",
        "Ne pas considérer l'impact fiscal",
        "Décision émotionnelle vs rationnelle"
      ]
    },
    {
      id: 7,
      title: "Retire to something",
      description: "Planifier À QUOI vous consacrerez votre retraite",
      icon: <Heart className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'ongoing',
      details: [
        "Ne pas juste fuir le travail",
        "Avoir un projet, une passion, un but",
        "Maintenir un réseau social",
        "Commencer 1-3 ans avant la retraite"
      ],
      actionSteps: [
        "Identifiez vos passions et intérêts",
        "Explorez des activités potentielles",
        "Développez un réseau social hors travail",
        "Testez vos projets avant la retraite"
      ],
      impact: "Retraite épanouissante et pleine de sens",
      commonMistakes: [
        "Attendre la retraite pour y penser",
        "Sous-estimer l'importance sociale",
        "Ne pas avoir de plan concret"
      ]
    },
    {
      id: 8,
      title: "S'éduquer fiscalement",
      description: "Comprendre les crédits, fractionnement et stratégies fiscales",
      icon: <BookOpen className="w-5 h-5" />,
      priority: 'medium',
      timeframe: 'ongoing',
      details: [
        "Crédits d'âge et de pension à 65 ans",
        "Fractionnement de revenus de pension",
        "Différences célibataire vs couple",
        "Stratégies de retraits optimisées"
      ],
      actionSteps: [
        "Lisez des livres sur la fiscalité de retraite",
        "Regardez des vidéos éducatives",
        "Consultez des ressources gouvernementales",
        "Discutez avec votre planificateur"
      ],
      impact: "Économies fiscales de milliers de dollars par année",
      commonMistakes: [
        "Déléguer complètement sans comprendre",
        "Ne pas se tenir à jour",
        "Ignorer les changements de lois"
      ]
    },
    {
      id: 9,
      title: "Mettre à jour ses documents",
      description: "Testament, procurations et désignations de bénéficiaires",
      icon: <FileText className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'immediate',
      details: [
        "Testament à jour avec situation actuelle",
        "Procurations pour soins et finances",
        "Bénéficiaires CELI, REER, assurances",
        "Révision lors de changements majeurs"
      ],
      actionSteps: [
        "Révisez vos documents existants",
        "Consultez un notaire si nécessaire",
        "Mettez à jour tous les bénéficiaires",
        "Informez vos proches de vos volontés"
      ],
      impact: "Protection de vos proches et respect de vos volontés",
      commonMistakes: [
        "Procrastiner sur cette tâche",
        "Documents obsolètes",
        "Bénéficiaires non mis à jour"
      ]
    },
    {
      id: 10,
      title: "Avoir un plan GPS complet",
      description: "Plan de retraite détaillé avec toutes les stratégies intégrées",
      icon: <MapPin className="w-5 h-5" />,
      priority: 'high',
      timeframe: 'immediate',
      details: [
        "Plan intégré de toutes vos sources de revenus",
        "Stratégies fiscales coordonnées",
        "Calendrier de décisions importantes",
        "Révisions périodiques planifiées"
      ],
      actionSteps: [
        "Travaillez avec un planificateur qualifié",
        "Intégrez tous les éléments ensemble",
        "Créez un calendrier d'actions",
        "Planifiez des révisions régulières"
      ],
      impact: "Retraite optimisée et sans stress financier",
      commonMistakes: [
        "Planification en silos",
        "Pas de vision d'ensemble",
        "Ne pas réviser le plan"
      ]
    }
  ];

  useEffect(() => {
    // Initialiser les statuts depuis le localStorage ou par défaut
    const savedStatuses = localStorage.getItem('retirementTipsStatuses');
    if (savedStatuses) {
      setTipStatuses(JSON.parse(savedStatuses));
    } else {
      const initialStatuses = tips.map(tip => ({
        id: tip.id,
        completed: false,
        priority: tip.priority,
        timeframe: tip.timeframe
      }));
      setTipStatuses(initialStatuses);
    }
  }, []);

  const updateTipStatus = (tipId: number, completed: boolean) => {
    const newStatuses = tipStatuses.map(status => 
      status.id === tipId ? { ...status, completed } : status
    );
    setTipStatuses(newStatuses);
    localStorage.setItem('retirementTipsStatuses', JSON.stringify(newStatuses));
  };

  const getCompletionRate = () => {
    if (tipStatuses.length === 0) return 0;
    const completed = tipStatuses.filter(status => status.completed).length;
    return Math.round((completed / tipStatuses.length) * 100);
  };

  const getCompletedCount = () => {
    return tipStatuses.filter(status => status.completed).length;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

