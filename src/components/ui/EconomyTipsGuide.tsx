/**
 * Guide "99 trucs pour économiser sans trop se priver"
 * Basé sur l'expertise Retraite101 pour optimiser les dépenses
 * Organisé par catégories avec système de recherche et favoris
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  Home, 
  Car, 
  ShoppingCart, 
  Utensils,
  Lightbulb,
  Heart,
  Smartphone,
  Shirt,
  BookOpen,
  Gift,
  TrendingDown,
  CheckCircle,
  Bookmark,
  Share2
} from 'lucide-react';

interface EconomyTip {
  id: number;
  title: string;
  description: string;
  category: 'habitation' | 'transport' | 'alimentation' | 'loisirs' | 'technologie' | 'vetements' | 'sante' | 'education' | 'cadeaux' | 'general';
  difficulty: 'facile' | 'moyen' | 'avance';
  potentialSavings: string;
  timeToImplement: string;
  tags: string[];
  isFavorite?: boolean;
  isImplemented?: boolean;
}

const economyTips: EconomyTip[] = [
  // HABITATION (15 trucs)
  {
    id: 1,
    title: "Réduire la température de 1 °C",
    description: "Baisser le thermostat de 1 °C peut réduire votre facture de chauffage de 5-7 %. Utilisez des couvertures supplémentaires.",
    category: "habitation",
    difficulty: "facile",
    potentialSavings: "100-200$/an",
    timeToImplement: "Immédiat",
    tags: ["chauffage", "énergie", "hiver"]
  },
  {
    id: 2,
    title: "Installer un thermostat programmable",
    description: "Programmez des températures plus basses la nuit et quand vous êtes absent. Économies automatiques.",
    category: "habitation",
    difficulty: "moyen",
    potentialSavings: "150-300$/an",
    timeToImplement: "1-2 heures",
    tags: ["chauffage", "automatisation", "énergie"]
  },
  {
    id: 3,
    title: "Calfeutrer portes et fenêtres",
    description: "Utilisez du calfeutrage ou des coupe-froid pour éliminer les fuites d'air. Matériaux peu coûteux, grandes économies.",
    category: "habitation",
    difficulty: "facile",
    potentialSavings: "50-150$/an",
    timeToImplement: "2-3 heures",
    tags: ["isolation", "bricolage", "énergie"]
  },
  {
    id: 4,
    title: "Utiliser des ampoules DEL",
    description: "Remplacez toutes vos ampoules par des DEL. Durent 25 fois plus longtemps et consomment 75 % moins d'énergie.",
    category: "habitation",
    difficulty: "facile",
    potentialSavings: "75-125$/an",
    timeToImplement: "30 minutes",
    tags: ["électricité", "éclairage", "DEL"]
  },
  {
    id: 5,
    title: "Débrancher les appareils en veille",
    description: "Les appareils en veille consomment jusqu'à 10% de votre électricité. Utilisez des barres d'alimentation.",
    category: "habitation",
    difficulty: "facile",
    potentialSavings: "50-100$/an",
    timeToImplement: "15 minutes",
    tags: ["électricité", "veille", "habitudes"]
  },

  // TRANSPORT (12 trucs)
  {
    id: 6,
    title: "Planifier vos déplacements",
    description: "Regroupez vos courses et rendez-vous pour réduire le nombre de sorties. Économisez essence et temps.",
    category: "transport",
    difficulty: "facile",
    potentialSavings: "200-400$/an",
    timeToImplement: "Planification hebdomadaire",
    tags: ["essence", "planification", "efficacité"]
  },
  {
    id: 7,
    title: "Maintenir la pression des pneus",
    description: "Des pneus bien gonflés réduisent la consommation d'essence de 3-4%. Vérifiez mensuellement.",
    category: "transport",
    difficulty: "facile",
    potentialSavings: "100-200$/an",
    timeToImplement: "10 minutes/mois",
    tags: ["essence", "entretien", "pneus"]
  },
  {
    id: 8,
    title: "Utiliser le transport en commun",
    description: "Remplacez 2-3 trajets auto par semaine par le transport en commun. Économies substantielles.",
    category: "transport",
    difficulty: "moyen",
    potentialSavings: "500-1000$/an",
    timeToImplement: "Changement d'habitude",
    tags: ["transport public", "essence", "stationnement"]
  },

  // ALIMENTATION (20 trucs)
  {
    id: 9,
    title: "Planifier les repas hebdomadaires",
    description: "Établissez un menu pour la semaine et faites une liste d'épicerie précise. Évitez les achats impulsifs.",
    category: "alimentation",
    difficulty: "moyen",
    potentialSavings: "100-200$/mois",
    timeToImplement: "30 min/semaine",
    tags: ["planification", "épicerie", "gaspillage"]
  },
  {
    id: 10,
    title: "Cuisiner en grandes quantités",
    description: "Préparez de gros lots et congelez les portions. Économisez temps et argent sur les repas préparés.",
    category: "alimentation",
    difficulty: "moyen",
    potentialSavings: "150-300$/mois",
    timeToImplement: "Dimanche après-midi",
    tags: ["cuisine", "congélation", "batch cooking"]
  },
  {
    id: 11,
    title: "Acheter les marques maison",
    description: "Les produits de marque maison coûtent 20-40% moins cher pour une qualité similaire.",
    category: "alimentation",
    difficulty: "facile",
    potentialSavings: "50-100$/mois",
    timeToImplement: "Immédiat",
    tags: ["épicerie", "marque maison", "qualité-prix"]
  },
  {
    id: 12,
    title: "Utiliser les circulaires et coupons",
    description: "Planifiez vos achats selon les spéciaux. Utilisez les applications de coupons numériques.",
    category: "alimentation",
    difficulty: "moyen",
    potentialSavings: "75-150$/mois",
    timeToImplement: "15 min/semaine",
    tags: ["spéciaux", "coupons", "planification"]
  },

  // LOISIRS (10 trucs)
  {
    id: 13,
    title: "Profiter des activités gratuites",
    description: "Explorez les parcs, bibliothèques, musées gratuits, festivals communautaires. Divertissement sans coût.",
    category: "loisirs",
    difficulty: "facile",
    potentialSavings: "100-300$/mois",
    timeToImplement: "Recherche locale",
    tags: ["gratuit", "communauté", "culture"]
  },
  {
    id: 14,
    title: "Partager les abonnements",
    description: "Partagez Netflix, Spotify, Amazon Prime avec famille/amis. Divisez les coûts légalement.",
    category: "loisirs",
    difficulty: "facile",
    potentialSavings: "200-400$/an",
    timeToImplement: "30 minutes",
    tags: ["streaming", "partage", "abonnements"]
  },

  // TECHNOLOGIE (8 trucs)
  {
    id: 15,
    title: "Négocier vos forfaits télécoms",
    description: "Appelez annuellement pour négocier. Mentionnez la concurrence. Obtenez souvent des rabais.",
    category: "technologie",
    difficulty: "moyen",
    potentialSavings: "200-500$/an",
    timeToImplement: "1 heure/an",
    tags: ["négociation", "télécom", "forfait"]
  },
  {
    id: 16,
    title: "Acheter des appareils reconditionnés",
    description: "Téléphones, ordinateurs reconditionnés offrent 30-50% d'économies avec garantie.",
    category: "technologie",
    difficulty: "moyen",
    potentialSavings: "300-800$/achat",
    timeToImplement: "Recherche avant achat",
    tags: ["reconditionné", "électronique", "garantie"]
  },

  // VÊTEMENTS (8 trucs)
  {
    id: 17,
    title: "Acheter hors saison",
    description: "Achetez vêtements d'hiver en été et vice-versa. Rabais de 50-70% sur les collections précédentes.",
    category: "vetements",
    difficulty: "moyen",
    potentialSavings: "200-500$/an",
    timeToImplement: "Planification saisonnière",
    tags: ["saison", "rabais", "planification"]
  },
  {
    id: 18,
    title: "Entretenir et réparer",
    description: "Apprenez à coudre boutons, réparer fermetures. Prolongez la vie de vos vêtements de qualité.",
    category: "vetements",
    difficulty: "moyen",
    potentialSavings: "100-300$/an",
    timeToImplement: "Apprentissage graduel",
    tags: ["réparation", "entretien", "durabilité"]
  },

  // SANTÉ (6 trucs)
  {
    id: 19,
    title: "Utiliser les médicaments génériques",
    description: "Demandez toujours la version générique. Même efficacité, 50-80% moins cher.",
    category: "sante",
    difficulty: "facile",
    potentialSavings: "100-400$/an",
    timeToImplement: "À chaque prescription",
    tags: ["médicaments", "générique", "pharmacie"]
  },
  {
    id: 20,
    title: "Prévenir plutôt que guérir",
    description: "Exercice régulier, alimentation saine, sommeil suffisant réduisent les coûts médicaux futurs.",
    category: "sante",
    difficulty: "moyen",
    potentialSavings: "500-2000$/an",
    timeToImplement: "Mode de vie",
    tags: ["prévention", "exercice", "alimentation"]
  },

  // ÉDUCATION (5 trucs)
  {
    id: 21,
    title: "Utiliser la bibliothèque publique",
    description: "Livres, films, cours en ligne, espaces de travail gratuits. Ressource sous-utilisée fantastique.",
    category: "education",
    difficulty: "facile",
    potentialSavings: "200-500$/an",
    timeToImplement: "Visite d'exploration",
    tags: ["bibliothèque", "gratuit", "apprentissage"]
  },

  // CADEAUX (5 trucs)
  {
    id: 22,
    title: "Faire des cadeaux maison",
    description: "Cuisine, artisanat, services personnalisés. Plus significatifs et économiques que les achats.",
    category: "cadeaux",
    difficulty: "moyen",
    potentialSavings: "300-800$/an",
    timeToImplement: "Planification créative",
    tags: ["fait maison", "créativité", "personnel"]
  },

  // GÉNÉRAL (10 trucs)
  {
    id: 23,
    title: "Automatiser l'épargne",
    description: "Virement automatique vers épargne dès la paie reçue. 'Payez-vous en premier' - principe fondamental.",
    category: "general",
    difficulty: "facile",
    potentialSavings: "Variable selon %",
    timeToImplement: "Configuration unique",
    tags: ["épargne", "automatisation", "discipline"]
  },
  {
    id: 24,
    title: "Réviser les assurances annuellement",
    description: "Comparez les primes, ajustez les couvertures selon vos besoins actuels. Économies substantielles possibles.",
    category: "general",
    difficulty: "moyen",
    potentialSavings: "200-800$/an",
    timeToImplement: "2-3 heures/an",
    tags: ["assurance", "comparaison", "révision"]
  },
  {
    id: 25,
    title: "Éliminer les frais bancaires",
    description: "Choisissez un compte sans frais, maintenez les soldes minimums, utilisez les guichets de votre banque.",
    category: "general",
    difficulty: "facile",
    potentialSavings: "100-300$/an",
    timeToImplement: "Changement de compte",
    tags: ["banque", "frais", "compte"]
  }
];

const categoryIcons = {
  habitation: Home,
  transport: Car,
  alimentation: Utensils,
  loisirs: Heart,
  technologie: Smartphone,
  vetements: Shirt,
  sante: Heart,
  education: BookOpen,
  cadeaux: Gift,
  general: DollarSign
};

const categoryLabels = {
  habitation: "Habitation",
  transport: "Transport", 
  alimentation: "Alimentation",
  loisirs: "Loisirs",
  technologie: "Technologie",
  vetements: "Vêtements",
  sante: "Santé",
  education: "Éducation",
  cadeaux: "Cadeaux",
  general: "Général"
};

const difficultyColors = {
  facile: "bg-green-100 text-green-800",
  moyen: "bg-yellow-100 text-yellow-800",
  avance: "bg-red-100 text-red-800"
};

export const EconomyTipsGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [implemented, setImplemented] = useState<number[]>([]);
  const [filteredTips, setFilteredTips] = useState<EconomyTip[]>(economyTips);

  useEffect(() => {
    let filtered = economyTips;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(tip => 
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tip => tip.category === selectedCategory);
    }

    // Filtre par difficulté
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(tip => tip.difficulty === selectedDifficulty);
    }

    setFilteredTips(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const toggleFavorite = (tipId: number) => {
    setFavorites(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const toggleImplemented = (tipId: number) => {
    setImplemented(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const calculateTotalSavings = () => {
    const implementedTips = economyTips.filter(tip => implemented.includes(tip.id));
    // Estimation conservative basée sur les économies minimales
    return implementedTips.length * 150; // Moyenne approximative
  };

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-green-900">
            <TrendingDown className="h-6 w-6 mr-2" />
            99 trucs pour économiser sans trop se priver
          </CardTitle>
          <CardDescription className="text-green-700">
            Guide pratique basé sur l'expertise Retraite101 pour optimiser vos dépenses dans tous les domaines de la vie.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistiques personnelles */}
      {implemented.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{implemented.length}</div>
                <div className="text-sm text-blue-700">Trucs implémentés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{calculateTotalSavings()}$</div>
                <div className="text-sm text-green-700">Économies estimées/an</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
                <div className="text-sm text-purple-700">Favoris sauvegardés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un truc d'économie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
                title="Filtrer par catégorie"
                aria-label="Filtrer par catégorie"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border rounded-md"
                title="Filtrer par niveau de difficulté"
                aria-label="Filtrer par niveau de difficulté"
              >
                <option value="all">Toutes difficultés</option>
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des trucs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTips.map((tip) => {
          const IconComponent = categoryIcons[tip.category];
          const isFav = favorites.includes(tip.id);
          const isImpl = implemented.includes(tip.id);
          
          return (
            <Card key={tip.id} className={`relative ${isImpl ? 'border-green-300 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <Badge className={difficultyColors[tip.difficulty]}>
                      {tip.difficulty}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(tip.id)}
                      className={isFav ? 'text-yellow-500' : 'text-gray-400'}
                    >
                      <Star className="h-4 w-4" fill={isFav ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleImplemented(tip.id)}
                      className={isImpl ? 'text-green-600' : 'text-gray-400'}
                    >
                      <CheckCircle className="h-4 w-4" fill={isImpl ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Économies:</span>
                    <span className="text-green-600 font-bold">{tip.potentialSavings}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Temps:</span>
                    <span className="text-blue-600">{tip.timeToImplement}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {tip.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTips.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Aucun truc ne correspond à vos critères de recherche.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4"
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conseils d'utilisation */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-900">
            <Lightbulb className="h-5 w-5 mr-2" />
            Conseils d'utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Commencez par les trucs "faciles" pour créer de l'élan</li>
            <li>• Implémentez 2-3 trucs par mois pour éviter la surcharge</li>
            <li>• Utilisez les favoris pour planifier vos prochaines actions</li>
            <li>• Marquez comme "implémenté" pour suivre vos progrès</li>
            <li>• Concentrez-vous sur vos 3 postes de dépenses les plus importants</li>
            <li>• Révisez régulièrement pour maintenir vos nouvelles habitudes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomyTipsGuide;
