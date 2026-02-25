// src/features/retirement/sections/RecommendationsSection.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Filter,
  Search,
  Sparkles,
  CheckCircle,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { UserData, Calculations } from '../types';
import { RecommendationEngine, Recommendation } from '../services/RecommendationEngine';
import { RecommendationCard } from '../components/RecommendationCard';
import { formatCurrency } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

interface RecommendationsSectionProps {
  userData: UserData;
  calculations: Calculations;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  userData,
  calculations
}) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'important' | 'optimization' | 'suggestion'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [completedActions, setCompletedActions] = useState<Record<string, string[]>>({});
  
  // Générer les recommandations
  const allRecommendations = useMemo(() => 
    RecommendationEngine.generateRecommendations(userData, calculations),
    [userData, calculations]
  );
  
  // Filtrer les recommandations
  const filteredRecommendations = useMemo(() => {
    return allRecommendations
      .filter(rec => !dismissedIds.includes(rec.id))
      .filter(rec => filter === 'all' || rec.category === filter)
      .filter(rec => 
        searchTerm === '' || 
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [allRecommendations, dismissedIds, filter, searchTerm]);
  
  // Calculer les métriques
  const metrics = useMemo(() => {
    const totalSavings = filteredRecommendations.reduce((sum, rec) => 
      sum + (rec.savings || 0), 0
    );
    
    const urgentCount = filteredRecommendations.filter(rec => 
      rec.category === 'urgent'
    ).length;
    
    const completedCount = Object.values(completedActions).reduce((sum, actions) => 
      sum + actions.length, 0
    );
    
    return {
      totalRecommendations: filteredRecommendations.length,
      totalSavings,
      urgentCount,
      completedCount
    };
  }, [filteredRecommendations, completedActions]);
  
  const handleActionComplete = (recommendationId: string, actionId: string) => {
    setCompletedActions(prev => ({
      ...prev,
      [recommendationId]: [...(prev[recommendationId] || []), actionId]
    }));
  };
  
  const handleDismiss = (recommendationId: string) => {
    setDismissedIds(prev => [...prev, recommendationId]);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Recommandations intelligentes
              </CardTitle>
              <CardDescription>
                Suggestions personnalisées basées sur votre situation
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-sm font-medium">IA activée</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<Brain className="w-4 h-4" />}
              label="Recommandations"
              value={metrics.totalRecommendations}
              color="purple"
            />
            <MetricCard
              icon={<DollarSign className="w-4 h-4" />}
              label="Économies potentielles"
              value={formatCurrency(metrics.totalSavings)}
              color="green"
            />
            <MetricCard
              icon={<AlertCircle className="w-4 h-4" />}
              label="Actions urgentes"
              value={metrics.urgentCount}
              color="red"
            />
            <MetricCard
              icon={<CheckCircle className="w-4 h-4" />}
              label="Actions complétées"
              value={metrics.completedCount}
              color="blue"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Alerte si actions urgentes */}
      {metrics.urgentCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Actions urgentes requises</AlertTitle>
          <AlertDescription>
            Vous avez {metrics.urgentCount} recommandation(s) urgente(s) qui nécessitent votre attention immédiate.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher dans les recommandations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">
                  Toutes ({allRecommendations.length})
                </TabsTrigger>
                <TabsTrigger value="urgent" className="text-red-600">
                  Urgent
                </TabsTrigger>
                <TabsTrigger value="important" className="text-amber-600">
                  Important
                </TabsTrigger>
                <TabsTrigger value="optimization" className="text-mpr-interactive">
                  Optimisation
                </TabsTrigger>
                <TabsTrigger value="suggestion" className="text-green-600">
                  Suggestions
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {/* Liste des recommandations */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Aucune recommandation ne correspond à votre recherche'
                    : 'Aucune recommandation dans cette catégorie'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onActionComplete={handleActionComplete}
                onDismiss={handleDismiss}
              />
            ))
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

// Composant pour les métriques
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'purple' | 'green' | 'red' | 'blue';
}> = ({ icon, label, value, color }) => {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-mpr-interactive-lt text-mpr-navy'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </motion.div>
  );
};