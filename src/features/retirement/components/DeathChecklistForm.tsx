// src/features/retirement/components/DeathChecklistForm.tsx
// Liste de vérification pour les proches en cas de décès

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  FileText, 
  Phone, 
  Building, 
  CreditCard, 
  Shield, 
  Calendar, 
  Printer,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { DeathChecklist, ChecklistItem } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';

interface DeathChecklistFormProps {
  checklist: DeathChecklist;
  onChange: (checklist: DeathChecklist) => void;
  className?: string;
}

const checklistCategories = [
  {
    id: 'immediate',
    title: 'Actions immédiates (0-24h)',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    items: [
      { id: 'medical_confirmation', text: 'Confirmer le décès avec un médecin', priority: 'high' },
      { id: 'contact_family', text: 'Contacter la famille proche et les amis intimes', priority: 'high' },
      { id: 'contact_executor', text: 'Contacter l\'exécuteur testamentaire', priority: 'high' },
      { id: 'secure_property', text: 'Sécuriser la propriété et les biens', priority: 'high' },
      { id: 'care_dependents', text: 'Organiser les soins pour les personnes à charge', priority: 'high' },
      { id: 'care_pets', text: 'Organiser les soins pour les animaux de compagnie', priority: 'medium' }
    ]
  },
  {
    id: 'first_week',
    title: 'Première semaine',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    items: [
      { id: 'death_certificates', text: 'Obtenir plusieurs copies du certificat de décès (10-15 copies)', priority: 'high' },
      { id: 'funeral_arrangements', text: 'Faire les arrangements funéraires selon les souhaits', priority: 'high' },
      { id: 'obituary', text: 'Publier l\'avis de décès dans les journaux', priority: 'medium' },
      { id: 'contact_employer', text: 'Contacter l\'employeur et les collègues', priority: 'medium' },
      { id: 'locate_will', text: 'Localiser et examiner le testament', priority: 'high' },
      { id: 'contact_lawyer', text: 'Contacter l\'avocat ou le notaire', priority: 'high' }
    ]
  },
  {
    id: 'financial',
    title: 'Affaires financières',
    icon: CreditCard,
    color: 'text-mpr-interactive',
    bgColor: 'bg-mpr-interactive-lt',
    borderColor: 'border-mpr-border',
    items: [
      { id: 'contact_banks', text: 'Contacter toutes les institutions financières', priority: 'high' },
      { id: 'freeze_accounts', text: 'Geler les comptes bancaires personnels', priority: 'high' },
      { id: 'contact_accountant', text: 'Contacter le comptable pour la déclaration finale', priority: 'high' },
      { id: 'inventory_assets', text: 'Faire l\'inventaire de tous les biens et dettes', priority: 'high' },
      { id: 'contact_investment', text: 'Contacter les conseillers en investissement', priority: 'medium' },
      { id: 'review_debts', text: 'Examiner toutes les dettes et obligations', priority: 'medium' }
    ]
  },
  {
    id: 'insurance',
    title: 'Assurances et prestations',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    items: [
      { id: 'life_insurance', text: 'Contacter les compagnies d\'assurance vie', priority: 'high' },
      { id: 'government_benefits', text: 'Aviser Revenu Canada et Retraite Québec', priority: 'high' },
      { id: 'employer_benefits', text: 'Réclamer les prestations d\'employeur', priority: 'medium' },
      { id: 'pension_plans', text: 'Contacter les régimes de retraite (RREGOP, etc.)', priority: 'high' },
      { id: 'health_insurance', text: 'Annuler l\'assurance maladie complémentaire', priority: 'medium' },
      { id: 'auto_insurance', text: 'Modifier ou annuler l\'assurance automobile', priority: 'medium' }
    ]
  },
  {
    id: 'services',
    title: 'Services et abonnements',
    icon: Building,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    items: [
      { id: 'utilities', text: 'Transférer ou annuler les services publics', priority: 'medium' },
      { id: 'subscriptions', text: 'Annuler les abonnements et services récurrents', priority: 'low' },
      { id: 'phone_internet', text: 'Modifier les services téléphoniques et internet', priority: 'medium' },
      { id: 'credit_cards', text: 'Annuler les cartes de crédit', priority: 'medium' },
      { id: 'memberships', text: 'Annuler les adhésions et memberships', priority: 'low' },
      { id: 'digital_accounts', text: 'Gérer les comptes numériques et réseaux sociaux', priority: 'low' }
    ]
  },
  {
    id: 'legal',
    title: 'Affaires légales',
    icon: FileText,
    color: 'text-mpr-interactive',
    bgColor: 'bg-mpr-interactive-lt',
    borderColor: 'border-mpr-border',
    items: [
      { id: 'probate', text: 'Entamer les procédures de succession si nécessaire', priority: 'high' },
      { id: 'property_transfer', text: 'Organiser le transfert des propriétés', priority: 'high' },
      { id: 'vehicle_transfer', text: 'Transférer ou vendre les véhicules', priority: 'medium' },
      { id: 'business_affairs', text: 'Régler les affaires d\'entreprise si applicable', priority: 'medium' },
      { id: 'tax_returns', text: 'Préparer les déclarations d\'impôt finales', priority: 'high' },
      { id: 'estate_distribution', text: 'Distribuer les biens selon le testament', priority: 'high' }
    ]
  }
];

const priorityConfig = {
  high: { label: 'Urgent', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  medium: { label: 'Important', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  low: { label: 'À faire', color: 'bg-gray-100 text-gray-800', icon: CheckSquare }
};

export const DeathChecklistForm: React.FC<DeathChecklistFormProps> = ({
  checklist,
  onChange,
  className
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['immediate']);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleItem = (itemId: string) => {
    const currentItems = checklist.items || [];
    const existingItem = currentItems.find(item => item.id === itemId);
    
    let updatedItems;
    if (existingItem) {
      updatedItems = currentItems.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed, completedDate: !item.completed ? new Date() : undefined }
          : item
      );
    } else {
      const newItem: ChecklistItem = {
        id: itemId,
        completed: true,
        completedDate: new Date(),
        notes: undefined
      };
      updatedItems = [...currentItems, newItem];
    }

    onChange({
      ...checklist,
      items: updatedItems,
      lastUpdated: new Date()
    });
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    const currentItems = checklist.items || [];
    const existingItem = currentItems.find(item => item.id === itemId);
    
    let updatedItems;
    if (existingItem) {
      updatedItems = currentItems.map(item => 
        item.id === itemId ? { ...item, notes: notes || undefined } : item
      );
    } else {
      const newItem: ChecklistItem = {
        id: itemId,
        completed: false,
        notes: notes || undefined
      };
      updatedItems = [...currentItems, newItem];
    }

    onChange({
      ...checklist,
      items: updatedItems,
      lastUpdated: new Date()
    });
  };

  const resetChecklist = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toute la liste de vérification ?')) {
      onChange({
        items: [],
        lastUpdated: new Date()
      });
    }
  };

  const getItemStatus = (itemId: string) => {
    const item = checklist.items?.find(item => item.id === itemId);
    return {
      completed: item?.completed || false,
      notes: item?.notes,
      completedDate: item?.completedDate
    };
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = checklistCategories.find(cat => cat.id === categoryId);
    if (!category) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = category.items.filter(item => getItemStatus(item.id).completed).length;
    const total = category.items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const getOverallProgress = () => {
    const totalItems = checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    const completedItems = checklistCategories.reduce((sum, cat) => 
      sum + cat.items.filter(item => getItemStatus(item.id).completed).length, 0
    );
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return { completed: completedItems, total: totalItems, percentage };
  };

  const getFilteredCategories = () => {
    return checklistCategories.map(category => ({
      ...category,
      items: category.items.filter(item => {
        const status = getItemStatus(item.id);
        
        if (showCompletedOnly && !status.completed) return false;
        if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
        
        return true;
      })
    })).filter(category => category.items.length > 0);
  };

  const overallProgress = getOverallProgress();
  const filteredCategories = getFilteredCategories();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec progrès global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-mpr-interactive" />
            Liste de vérification en cas de décès
          </CardTitle>
          <CardDescription>
            Guide étape par étape pour aider vos proches à gérer les formalités après votre décès. 
            Cette liste peut être cochée au fur et à mesure de l'avancement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progrès global */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progrès global</span>
                <span className="text-sm text-gray-600">
                  {overallProgress.completed} / {overallProgress.total} tâches
                </span>
              </div>
              <Progress value={overallProgress.percentage} className="h-2" />
              <p className="text-xs text-gray-500">
                {overallProgress.percentage}% des tâches complétées
              </p>
            </div>

            {/* Filtres et actions */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showCompletedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCompletedOnly(!showCompletedOnly)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {showCompletedOnly ? 'Toutes les tâches' : 'Tâches complétées'}
                </Button>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="px-3 py-1 text-sm border rounded-md"
                >
                  <option value="all">Toutes priorités</option>
                  <option value="high">Urgent seulement</option>
                  <option value="medium">Important seulement</option>
                  <option value="low">À faire seulement</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetChecklist}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerte si progrès élevé */}
      {overallProgress.percentage >= 80 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Excellent progrès !</strong> Vous avez complété {overallProgress.percentage}% des tâches. 
            Continuez le bon travail pour finaliser toutes les formalités.
          </AlertDescription>
        </Alert>
      )}

      {/* Catégories de tâches */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const progress = getCategoryProgress(category.id);
          const isExpanded = expandedCategories.includes(category.id);
          const IconComponent = category.icon;

          return (
            <Card key={category.id} className={`${category.borderColor} border-2`}>
              <CardHeader 
                className={`${category.bgColor} cursor-pointer`}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 ${category.color}`}>
                    <IconComponent className="w-5 h-5" />
                    {category.title}
                    <Badge variant="outline" className="ml-2">
                      {progress.completed}/{progress.total}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{progress.percentage}%</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.div>
                  </div>
                </div>
                <Progress value={progress.percentage} className="h-1 mt-2" />
              </CardHeader>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {category.items.map((item) => {
                          const status = getItemStatus(item.id);
                          const priorityInfo = priorityConfig[item.priority];
                          const PriorityIcon = priorityInfo.icon;

                          return (
                            <div key={item.id} className="space-y-2">
                              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50">
                                <Checkbox
                                  checked={status.completed}
                                  onCheckedChange={() => toggleItem(item.id)}
                                  className="mt-1"
                                />
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <p className={`text-sm ${status.completed ? 'line-through text-gray-500' : ''}`}>
                                      {item.text}
                                    </p>
                                    <Badge className={`${priorityInfo.color} text-xs`}>
                                      <PriorityIcon className="w-3 h-3 mr-1" />
                                      {priorityInfo.label}
                                    </Badge>
                                  </div>

                                  {status.completed && status.completedDate && (
                                    <p className="text-xs text-green-600">
                                      ✓ Complété le {status.completedDate.toLocaleDateString('fr-CA')}
                                    </p>
                                  )}

                                  <textarea
                                    placeholder="Notes ou commentaires..."
                                    value={status.notes || ''}
                                    onChange={(e) => updateItemNotes(item.id, e.target.value)}
                                    className="w-full text-xs p-2 border rounded resize-none"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Résumé final */}
      {overallProgress.percentage === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Toutes les tâches sont complétées !
            </h3>
            <p className="text-green-700">
              Félicitations, vous avez terminé toutes les formalités de la liste de vérification. 
              N'hésitez pas à conserver ce document pour référence future.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions d'utilisation */}
      <Card className="border-mpr-border bg-mpr-interactive-lt">
        <CardContent className="p-4">
          <h4 className="font-semibold text-mpr-navy mb-2">Instructions d'utilisation</h4>
          <ul className="text-sm text-mpr-navy space-y-1">
            <li>• Cliquez sur les catégories pour les développer/réduire</li>
            <li>• Cochez les tâches au fur et à mesure de leur completion</li>
            <li>• Ajoutez des notes pour documenter les actions prises</li>
            <li>• Utilisez les filtres pour vous concentrer sur certaines priorités</li>
            <li>• Imprimez cette liste pour la partager avec les proches</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
