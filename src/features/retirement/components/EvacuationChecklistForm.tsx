// src/features/retirement/components/EvacuationChecklistForm.tsx
// Formulaire pour la liste d'évacuation d'urgence

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Edit,
  Home,
  Car,
  Heart,
  Shield,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EvacuationItem {
  id: string;
  name: string;
  category: 'essential' | 'important' | 'valuable' | 'comfort';
  timeFrame: '15min' | '30min' | '1hour' | '2hour';
  isChecked: boolean;
  notes?: string;
  isCustom: boolean;
}

export interface EvacuationChecklist {
  items: EvacuationItem[];
  customItems: EvacuationItem[];
  lastUpdated: Date;
  personalNotes: string;
}

interface EvacuationChecklistFormProps {
  checklist: EvacuationChecklist;
  onChange: (checklist: EvacuationChecklist) => void;
}

const DEFAULT_ITEMS: Omit<EvacuationItem, 'id' | 'isChecked' | 'isCustom'>[] = [
  // 15 minutes
  { name: 'Portefeuille, sac à main, clés', category: 'essential', timeFrame: '15min' },
  { name: 'Lunettes, lentilles de contact', category: 'essential', timeFrame: '15min' },
  { name: 'Téléphones cellulaires et chargeurs', category: 'essential', timeFrame: '15min' },
  { name: 'Argent comptant d\'urgence, cartes de crédit', category: 'essential', timeFrame: '15min' },
  { name: 'Animaux de compagnie, transporteurs, laisses', category: 'essential', timeFrame: '15min' },
  { name: 'Médicaments des animaux', category: 'essential', timeFrame: '15min' },
  { name: 'Vêtements selon la saison', category: 'essential', timeFrame: '15min' },
  { name: 'Chaussures, chapeaux', category: 'essential', timeFrame: '15min' },
  { name: 'Appareils auditifs, médicaments essentiels', category: 'essential', timeFrame: '15min' },
  { name: 'Lampes de poche, piles supplémentaires', category: 'essential', timeFrame: '15min' },
  { name: 'Clés du coffre-fort bancaire', category: 'important', timeFrame: '15min' },
  { name: 'Chéquiers, factures à payer', category: 'important', timeFrame: '15min' },
  { name: 'Disques durs, ordinateurs portables, clés USB', category: 'important', timeFrame: '15min' },

  // 30 minutes
  { name: 'Oreillers, sacs de couchage, couvertures', category: 'comfort', timeFrame: '30min' },
  { name: 'Carnet d\'adresses, liste de téléphones', category: 'important', timeFrame: '30min' },
  { name: 'Bijoux et objets personnels les plus précieux', category: 'valuable', timeFrame: '30min' },
  { name: 'Articles d\'hygiène personnelle', category: 'comfort', timeFrame: '30min' },
  { name: 'Autres médicaments, suppléments', category: 'important', timeFrame: '30min' },
  { name: 'Trousse de premiers soins, articles médicaux', category: 'important', timeFrame: '30min' },
  { name: 'Nourriture pour animaux, bols, literie, litière', category: 'essential', timeFrame: '30min' },
  { name: 'Articles pour enfants, jouets, livres', category: 'comfort', timeFrame: '30min' },
  { name: 'Radio à piles, piles supplémentaires', category: 'important', timeFrame: '30min' },
  { name: 'Papier toilette, lingettes, savon', category: 'comfort', timeFrame: '30min' },
  { name: 'Vêtements pour 5 jours, chaussures', category: 'essential', timeFrame: '30min' },
  { name: 'Ordinateur, moniteur, portable', category: 'important', timeFrame: '30min' },
  { name: 'Cruches d\'eau potable', category: 'essential', timeFrame: '30min' },

  // 1 heure
  { name: 'Armes à feu, munitions (si applicable)', category: 'important', timeFrame: '1hour' },
  { name: 'Glacière avec glace, nourriture, boissons', category: 'essential', timeFrame: '1hour' },
  { name: 'Dossiers généalogiques, fichiers', category: 'valuable', timeFrame: '1hour' },
  { name: 'Nourriture pour 3 jours, articles de régime spécial', category: 'essential', timeFrame: '1hour' },
  { name: 'Gants, masque anti-poussière pour fumée', category: 'important', timeFrame: '1hour' },
  { name: 'Assiettes en papier, tasses, ustensiles', category: 'comfort', timeFrame: '1hour' },
  { name: 'Articles scolaires, devoirs, stylos, livres, calculatrice', category: 'important', timeFrame: '1hour' },
  { name: 'Permis, titres de véhicules, actes de propriété', category: 'important', timeFrame: '1hour' },
  { name: 'Assurances, données financières et médicales', category: 'important', timeFrame: '1hour' },
  { name: 'Testaments, procurations', category: 'important', timeFrame: '1hour' },
  { name: 'Liste des biens personnels, photos et évaluations', category: 'important', timeFrame: '1hour' },

  // 2+ heures
  { name: 'Albums, photos, vidéos familiales', category: 'valuable', timeFrame: '2hour' },
  { name: 'Photos de famille exposées', category: 'valuable', timeFrame: '2hour' },
  { name: 'Décorations militaires, dossiers, souvenirs', category: 'valuable', timeFrame: '2hour' },
  { name: 'Bagages (emballés)', category: 'comfort', timeFrame: '2hour' },
  { name: 'Objets de valeur, appareils photo', category: 'valuable', timeFrame: '2hour' },
  { name: 'Objets de famille, art, collections', category: 'valuable', timeFrame: '2hour' },
  { name: 'Cosmétiques principaux', category: 'comfort', timeFrame: '2hour' },
  { name: 'Véhicules secondaires, VR', category: 'important', timeFrame: '2hour' },
  { name: 'Équipement de camping, tente', category: 'comfort', timeFrame: '2hour' },
  { name: 'Journaux, journaux intimes, lettres', category: 'valuable', timeFrame: '2hour' }
];

export const EvacuationChecklistForm: React.FC<EvacuationChecklistFormProps> = ({
  checklist,
  onChange
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<EvacuationItem['category']>('important');
  const [newItemTimeFrame, setNewItemTimeFrame] = useState<EvacuationItem['timeFrame']>('30min');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Initialiser les items par défaut s'ils n'existent pas
  const initializeDefaultItems = () => {
    if (checklist.items.length === 0) {
      const defaultItems: EvacuationItem[] = DEFAULT_ITEMS.map((item, index) => ({
        ...item,
        id: `default-${index}`,
        isChecked: false,
        isCustom: false
      }));
      
      onChange({
        ...checklist,
        items: defaultItems,
        lastUpdated: new Date()
      });
    }
  };

  React.useEffect(() => {
    initializeDefaultItems();
  }, []);

  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addCustomItem = () => {
    if (!newItemName.trim()) return;

    const newItem: EvacuationItem = {
      id: generateId(),
      name: newItemName.trim(),
      category: newItemCategory,
      timeFrame: newItemTimeFrame,
      isChecked: false,
      isCustom: true
    };

    onChange({
      ...checklist,
      customItems: [...(checklist.customItems || []), newItem],
      lastUpdated: new Date()
    });

    setNewItemName('');
  };

  const toggleItem = (itemId: string) => {
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );

    const updatedCustomItems = (checklist.customItems || []).map(item =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );

    onChange({
      ...checklist,
      items: updatedItems,
      customItems: updatedCustomItems,
      lastUpdated: new Date()
    });
  };

  const deleteCustomItem = (itemId: string) => {
    onChange({
      ...checklist,
      customItems: (checklist.customItems || []).filter(item => item.id !== itemId),
      lastUpdated: new Date()
    });
  };

  const updateNotes = (notes: string) => {
    onChange({
      ...checklist,
      personalNotes: notes,
      lastUpdated: new Date()
    });
  };

  const resetAllItems = () => {
    const resetItems = checklist.items.map(item => ({ ...item, isChecked: false }));
    const resetCustomItems = (checklist.customItems || []).map(item => ({ ...item, isChecked: false }));

    onChange({
      ...checklist,
      items: resetItems,
      customItems: resetCustomItems,
      lastUpdated: new Date()
    });
  };

  const getCategoryColor = (category: EvacuationItem['category']) => {
    switch (category) {
      case 'essential': return 'bg-red-100 text-red-800 border-red-200';
      case 'important': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'valuable': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'comfort': return 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: EvacuationItem['category']) => {
    switch (category) {
      case 'essential': return 'Essentiel';
      case 'important': return 'Important';
      case 'valuable': return 'Précieux';
      case 'comfort': return 'Confort';
      default: return 'Autre';
    }
  };

  const getTimeFrameLabel = (timeFrame: EvacuationItem['timeFrame']) => {
    switch (timeFrame) {
      case '15min': return '15 minutes';
      case '30min': return '30 minutes';
      case '1hour': return '1 heure';
      case '2hour': return '2+ heures';
      default: return timeFrame;
    }
  };

  const getItemsByTimeFrame = (timeFrame: EvacuationItem['timeFrame']) => {
    const defaultItems = checklist.items.filter(item => item.timeFrame === timeFrame);
    const customItems = (checklist.customItems || []).filter(item => item.timeFrame === timeFrame);
    return [...defaultItems, ...customItems];
  };

  const getCompletionStats = () => {
    const allItems = [...checklist.items, ...(checklist.customItems || [])];
    const completed = allItems.filter(item => item.isChecked).length;
    const total = allItems.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-orange-900">Liste d'évacuation d'urgence</CardTitle>
              <CardDescription className="text-orange-700">
                Organisez vos biens par ordre de priorité pour une évacuation rapide
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600">Articles préparés</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <Clock className="w-6 h-6 text-mpr-interactive mx-auto mb-1" />
              <div className="text-2xl font-bold text-mpr-interactive">{stats.total}</div>
              <div className="text-xs text-gray-600">Articles total</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-orange-600">{stats.percentage}%</div>
              <div className="text-xs text-gray-600">Préparation</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={resetAllItems} variant="outline" size="sm">
              Réinitialiser tout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions importantes */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Comment utiliser cette liste :</strong> En cas d'évacuation, commencez par les articles de 15 minutes, 
          puis progressez selon le temps disponible. Cochez les articles déjà préparés ou facilement accessibles.
        </AlertDescription>
      </Alert>

      {/* Onglets par délai */}
      <Tabs defaultValue="15min" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="15min" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            15 min
          </TabsTrigger>
          <TabsTrigger value="30min" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            30 min
          </TabsTrigger>
          <TabsTrigger value="1hour" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            1 heure
          </TabsTrigger>
          <TabsTrigger value="2hour" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            2+ heures
          </TabsTrigger>
        </TabsList>

        {(['15min', '30min', '1hour', '2hour'] as const).map((timeFrame) => (
          <TabsContent key={timeFrame} value={timeFrame}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Articles à préparer en {getTimeFrameLabel(timeFrame)}
                </CardTitle>
                <CardDescription>
                  {timeFrame === '15min' && 'Articles essentiels à saisir immédiatement'}
                  {timeFrame === '30min' && 'Articles importants si vous avez plus de temps'}
                  {timeFrame === '1hour' && 'Documents et biens précieux'}
                  {timeFrame === '2hour' && 'Souvenirs et objets de valeur sentimentale'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getItemsByTimeFrame(timeFrame).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        item.isChecked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <Checkbox
                        checked={item.isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      
                      <div className="flex-1">
                        <div className={`font-medium ${item.isChecked ? 'line-through text-gray-500' : ''}`}>
                          {item.name}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-gray-600 mt-1">{item.notes}</div>
                        )}
                      </div>
                      
                      <Badge className={getCategoryColor(item.category)}>
                        {getCategoryLabel(item.category)}
                      </Badge>
                      
                      {item.isCustom && (
                        <Button
                          onClick={() => deleteCustomItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Ajouter un article personnalisé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter un article personnalisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="newItem">Nom de l'article</Label>
              <Input
                id="newItem"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Documents d'identité"
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={newItemCategory}
                onValueChange={(value: EvacuationItem['category']) => setNewItemCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essential">Essentiel</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="valuable">Précieux</SelectItem>
                  <SelectItem value="comfort">Confort</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeFrame">Délai</Label>
              <Select
                value={newItemTimeFrame}
                onValueChange={(value: EvacuationItem['timeFrame']) => setNewItemTimeFrame(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un délai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hour">1 heure</SelectItem>
                  <SelectItem value="2hour">2+ heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addCustomItem} className="mt-4" disabled={!newItemName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter l'article
          </Button>
        </CardContent>
      </Card>

      {/* Notes personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Notes personnelles</CardTitle>
          <CardDescription>
            Ajoutez des instructions spécifiques pour votre situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={checklist.personalNotes || ''}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Ex: Clés de secours chez le voisin, code d'alarme, instructions spéciales..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};
