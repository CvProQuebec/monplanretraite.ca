// src/features/retirement/components/SecurityTipsForm.tsx
// Conseils de sécurité et protection des documents

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Flame,
  Camera,
  HardDrive,
  Users,
  Lock,
  Cloud,
  FileText,
  Home,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Download,
  Upload,
  Copy,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityTip {
  id: string;
  category: 'fire' | 'backup' | 'sharing' | 'storage' | 'digital';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  icon: React.ComponentType<any>;
  actionItems: string[];
}

interface SecurityTipsFormProps {
  className?: string;
}

const securityTips: SecurityTip[] = [
  // Protection contre le feu et sinistres
  {
    id: 'fireproof_safe',
    category: 'fire',
    title: 'Coffre-fort ignifuge',
    description: 'Investir dans un coffre-fort résistant au feu (minimum 1 heure à 1700°F)',
    priority: 'high',
    completed: false,
    icon: Shield,
    actionItems: [
      'Acheter un coffre-fort certifié UL Class 350',
      'Y placer les documents originaux les plus importants',
      'Vérifier l\'étanchéité et la protection contre l\'humidité',
      'Noter l\'emplacement dans votre plan d\'urgence'
    ]
  },
  {
    id: 'photo_documentation',
    category: 'backup',
    title: 'Photos des objets de valeur',
    description: 'Photographier tous les biens de valeur pour les assurances',
    priority: 'high',
    completed: false,
    icon: Camera,
    actionItems: [
      'Photographier chaque pièce de la maison',
      'Prendre des photos détaillées des bijoux, œuvres d\'art, collections',
      'Photographier les numéros de série des appareils électroniques',
      'Inclure des reçus d\'achat dans les photos',
      'Mettre à jour les photos annuellement'
    ]
  },
  {
    id: 'document_copies',
    category: 'backup',
    title: 'Copies multiples des documents',
    description: 'Créer plusieurs copies des documents critiques',
    priority: 'high',
    completed: false,
    icon: Copy,
    actionItems: [
      'Faire 3 copies de chaque document important',
      'Conserver une copie à la maison (coffre-fort)',
      'Placer une copie chez une personne de confiance',
      'Garder une copie dans un coffre bancaire',
      'Scanner tous les documents en format PDF'
    ]
  },
  {
    id: 'encrypted_usb',
    category: 'digital',
    title: 'Clé USB chiffrée',
    description: 'Utiliser une clé USB avec chiffrement matériel',
    priority: 'high',
    completed: false,
    icon: HardDrive,
    actionItems: [
      'Acheter une clé USB avec chiffrement AES 256-bit',
      'Y sauvegarder tous les documents scannés',
      'Inclure les photos des objets de valeur',
      'Créer un mot de passe fort et unique',
      'Faire une copie de sauvegarde de la clé'
    ]
  },
  {
    id: 'trusted_person',
    category: 'sharing',
    title: 'Personne de confiance',
    description: 'Désigner une personne de confiance pour partager les informations',
    priority: 'high',
    completed: false,
    icon: Users,
    actionItems: [
      'Choisir une personne fiable (famille proche, ami intime)',
      'Lui remettre une copie des documents essentiels',
      'Partager l\'emplacement du coffre-fort et les codes',
      'Réviser annuellement les informations partagées',
      'Avoir une personne de confiance de secours'
    ]
  },
  {
    id: 'cloud_backup',
    category: 'digital',
    title: 'Sauvegarde cloud sécurisée',
    description: 'Utiliser un service cloud avec chiffrement de bout en bout',
    priority: 'medium',
    completed: false,
    icon: Cloud,
    actionItems: [
      'Choisir un service réputé (pCloud Crypto, Tresorit, etc.)',
      'Activer le chiffrement côté client',
      'Utiliser l\'authentification à deux facteurs',
      'Sauvegarder régulièrement les documents',
      'Tester la récupération des fichiers'
    ]
  },
  {
    id: 'bank_safety_deposit',
    category: 'storage',
    title: 'Coffre-fort bancaire',
    description: 'Louer un coffre-fort dans une institution financière',
    priority: 'medium',
    completed: false,
    icon: Lock,
    actionItems: [
      'Louer un coffre dans une banque stable',
      'Y placer les documents originaux uniques',
      'Ajouter un co-locataire de confiance',
      'Tenir un inventaire du contenu',
      'Visiter le coffre au moins une fois par an'
    ]
  },
  {
    id: 'emergency_kit',
    category: 'fire',
    title: 'Trousse d\'urgence portable',
    description: 'Préparer une trousse d\'évacuation rapide',
    priority: 'medium',
    completed: false,
    icon: Home,
    actionItems: [
      'Rassembler les documents dans un sac étanche',
      'Inclure une clé USB avec tous les documents',
      'Ajouter de l\'argent comptant d\'urgence',
      'Placer la trousse près de la sortie principale',
      'Informer la famille de son emplacement'
    ]
  },
  {
    id: 'mobile_access',
    category: 'digital',
    title: 'Accès mobile sécurisé',
    description: 'Avoir accès aux informations critiques sur mobile',
    priority: 'medium',
    completed: false,
    icon: Smartphone,
    actionItems: [
      'Installer une app de gestionnaire de mots de passe',
      'Sauvegarder les contacts d\'urgence dans le cloud',
      'Avoir les numéros de police d\'assurance accessibles',
      'Configurer les notifications d\'urgence',
      'Tester l\'accès régulièrement'
    ]
  },
  {
    id: 'regular_updates',
    category: 'backup',
    title: 'Mises à jour régulières',
    description: 'Réviser et mettre à jour toutes les sauvegardes',
    priority: 'low',
    completed: false,
    icon: FileText,
    actionItems: [
      'Programmer une révision trimestrielle',
      'Mettre à jour les photos après tout achat important',
      'Réviser les mots de passe annuellement',
      'Vérifier l\'intégrité des sauvegardes',
      'Informer les personnes de confiance des changements'
    ]
  }
];

const categoryInfo = {
  fire: { 
    label: 'Protection incendie', 
    color: 'bg-red-100 text-red-800', 
    icon: Flame,
    description: 'Protection contre les incendies et sinistres'
  },
  backup: { 
    label: 'Sauvegardes', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Copy,
    description: 'Copies et sauvegardes des documents'
  },
  sharing: { 
    label: 'Partage sécurisé', 
    color: 'bg-green-100 text-green-800', 
    icon: Users,
    description: 'Partage avec personnes de confiance'
  },
  storage: { 
    label: 'Stockage sécurisé', 
    color: 'bg-purple-100 text-purple-800', 
    icon: Lock,
    description: 'Solutions de stockage sécurisées'
  },
  digital: { 
    label: 'Sécurité numérique', 
    color: 'bg-orange-100 text-orange-800', 
    icon: HardDrive,
    description: 'Protection et accès numériques'
  }
};

const priorityInfo = {
  high: { label: 'Critique', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  medium: { label: 'Important', color: 'bg-yellow-100 text-yellow-800', icon: Info },
  low: { label: 'Recommandé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
};

export const SecurityTipsForm: React.FC<SecurityTipsFormProps> = ({ className }) => {
  const [tips, setTips] = useState<SecurityTip[]>(securityTips);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedTips, setExpandedTips] = useState<string[]>([]);

  const toggleTipCompletion = (tipId: string) => {
    setTips(prev => prev.map(tip => 
      tip.id === tipId ? { ...tip, completed: !tip.completed } : tip
    ));
  };

  const toggleTipExpansion = (tipId: string) => {
    setExpandedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const getFilteredTips = () => {
    return tips.filter(tip => {
      if (selectedCategory !== 'all' && tip.category !== selectedCategory) return false;
      if (!showCompleted && tip.completed) return false;
      return true;
    });
  };

  const getCompletionStats = () => {
    const total = tips.length;
    const completed = tips.filter(tip => tip.completed).length;
    const highPriority = tips.filter(tip => tip.priority === 'high');
    const highPriorityCompleted = highPriority.filter(tip => tip.completed).length;
    
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
      highPriority: highPriority.length,
      highPriorityCompleted,
      highPriorityPercentage: Math.round((highPriorityCompleted / highPriority.length) * 100)
    };
  };

  const exportSecurityPlan = () => {
    const completedTips = tips.filter(tip => tip.completed);
    const plan = {
      exportDate: new Date().toISOString(),
      completionStats: getCompletionStats(),
      completedTips: completedTips.map(tip => ({
        title: tip.title,
        category: tip.category,
        priority: tip.priority,
        actionItems: tip.actionItems
      })),
      recommendations: tips.filter(tip => !tip.completed && tip.priority === 'high').map(tip => ({
        title: tip.title,
        description: tip.description,
        actionItems: tip.actionItems
      }))
    };

    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-securite-${new Date().toLocaleDateString('fr-CA')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTips = getFilteredTips();
  const stats = getCompletionStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Conseils de sécurité et protection des documents
          </CardTitle>
          <CardDescription>
            Protégez vos documents et informations importantes contre les incendies, vols et autres sinistres. 
            Suivez ces conseils pour assurer la sécurité de votre dossier d'urgence.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistiques de progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Progression de la sécurisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progression globale */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm text-gray-600">{stats.completed}/{stats.total} conseils appliqués</span>
              </div>
              <Progress value={stats.percentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{stats.percentage}% des mesures de sécurité en place</p>
            </div>

            {/* Progression priorité haute */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-red-600">Mesures critiques</span>
                <span className="text-sm text-gray-600">{stats.highPriorityCompleted}/{stats.highPriority} complétées</span>
              </div>
              <Progress value={stats.highPriorityPercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{stats.highPriorityPercentage}% des mesures critiques en place</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={exportSecurityPlan} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter le plan de sécurité
              </Button>
              <Button 
                onClick={() => setShowCompleted(!showCompleted)} 
                variant="outline" 
                size="sm"
              >
                {showCompleted ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showCompleted ? 'Masquer' : 'Afficher'} les mesures complétées
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerte si peu de mesures critiques */}
      {stats.highPriorityPercentage < 50 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention :</strong> Seulement {stats.highPriorityPercentage}% des mesures de sécurité critiques sont en place. 
            Vos documents importants sont à risque en cas de sinistre. Priorisez les mesures marquées "Critique".
          </AlertDescription>
        </Alert>
      )}

      {/* Filtres par catégorie */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Toutes les catégories
            </Button>
            {Object.entries(categoryInfo).map(([key, info]) => {
              const IconComponent = info.icon;
              const categoryCount = tips.filter(tip => tip.category === key).length;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {info.label} ({categoryCount})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des conseils */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTips.map((tip) => {
            const isExpanded = expandedTips.includes(tip.id);
            const IconComponent = tip.icon;
            const categoryData = categoryInfo[tip.category];
            const priorityData = priorityInfo[tip.priority];
            const PriorityIcon = priorityData.icon;

            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`hover:shadow-md transition-shadow ${tip.completed ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={tip.completed}
                        onCheckedChange={() => toggleTipCompletion(tip.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <h3 className={`font-semibold ${tip.completed ? 'line-through text-gray-500' : ''}`}>
                              {tip.title}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={categoryData.color}>
                              {categoryData.label}
                            </Badge>
                            <Badge className={priorityData.color}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {priorityData.label}
                            </Badge>
                          </div>
                        </div>

                        <p className={`text-sm text-gray-600 mb-3 ${tip.completed ? 'line-through' : ''}`}>
                          {tip.description}
                        </p>

                        {tip.completed && (
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">Mesure appliquée</span>
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTipExpansion(tip.id)}
                          className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        >
                          {isExpanded ? 'Masquer les détails' : 'Voir les étapes détaillées'}
                        </Button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3"
                            >
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-medium text-sm mb-2">Étapes à suivre :</h4>
                                <ul className="space-y-1">
                                  {tip.actionItems.map((item, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                      <span className="text-blue-600 font-bold min-w-[20px]">{index + 1}.</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTips.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {showCompleted ? 'Toutes les mesures sont complétées !' : 'Aucun conseil dans cette catégorie'}
              </h3>
              <p className="text-gray-500">
                {showCompleted 
                  ? 'Félicitations ! Vous avez mis en place toutes les mesures de sécurité recommandées.'
                  : 'Sélectionnez une autre catégorie ou affichez les mesures complétées.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Conseils généraux */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            Conseils généraux de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Règle du 3-2-1 :</strong> 3 copies de vos documents, sur 2 supports différents, dont 1 hors site.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Test régulier :</strong> Vérifiez l'accès à vos sauvegardes au moins une fois par trimestre.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Mise à jour :</strong> Révisez votre plan de sécurité après tout changement important (déménagement, nouvel achat, etc.).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span><strong>Formation familiale :</strong> Assurez-vous que votre famille connaît l'emplacement des documents et sauvegardes d'urgence.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
