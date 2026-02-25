// src/features/retirement/components/RecommendationCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Zap,
  Info
} from 'lucide-react';
import { Recommendation, Action } from '../services/RecommendationEngine';
import { formatCurrency } from '../utils/formatters';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onActionComplete?: (recommendationId: string, actionId: string) => void;
  onDismiss?: (recommendationId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onActionComplete,
  onDismiss
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  
  const categoryConfig = {
    urgent: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-l-red-500'
    },
    important: {
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Target,
      bgColor: 'bg-amber-50',
      borderColor: 'border-l-amber-500'
    },
    optimization: {
      color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border',
      icon: TrendingUp,
      bgColor: 'bg-mpr-interactive-lt',
      borderColor: 'border-l-blue-500'
    },
    suggestion: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Info,
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-500'
    }
  };
  
  const config = categoryConfig[recommendation.category];
  const Icon = config.icon;
  const completionPercentage = (completedActions.length / recommendation.actions.length) * 100;
  
  const handleActionComplete = (actionId: string) => {
    setCompletedActions([...completedActions, actionId]);
    onActionComplete?.(recommendation.id, actionId);
  };
  
  const timeframeLabels = {
    immediate: 'Immédiat',
    short: 'Court terme',
    medium: 'Moyen terme',
    long: 'Long terme'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-l-4 ${config.borderColor} hover:shadow-lg transition-shadow`}>
        <CardHeader className={config.bgColor}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5" />
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {recommendation.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={config.color}>
                {recommendation.category === 'urgent' ? 'Urgent' : 
                 recommendation.category === 'important' ? 'Important' :
                 recommendation.category === 'optimization' ? 'Optimisation' : 'Suggestion'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {timeframeLabels[recommendation.timeframe]}
              </Badge>
            </div>
          </div>
          
          {/* Impact et métriques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Impact</p>
              <p className="text-sm font-medium">{recommendation.impact}</p>
            </div>
            
            {recommendation.savings && recommendation.savings > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Économies potentielles
                </p>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(recommendation.savings)}
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Confiance
              </p>
              <div className="flex items-center gap-2">
                <Progress value={recommendation.confidence} className="h-2" />
                <span className="text-xs font-medium">{recommendation.confidence} %</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Bouton pour étendre */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 mb-4"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Masquer les actions
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Voir les actions ({recommendation.actions.length})
              </>
            )}
          </Button>
          
          {/* Progress global */}
          {completionPercentage > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progression</span>
                <span className="text-sm font-medium">
                  {completedActions.length}/{recommendation.actions.length} complétées
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          )}
          
          {/* Actions détaillées */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {recommendation.actions.map((action, index) => (
                  <ActionItem
                    key={action.id}
                    action={action}
                    index={index}
                    isCompleted={completedActions.includes(action.id)}
                    onComplete={() => handleActionComplete(action.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {recommendation.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Composant pour chaque action
const ActionItem: React.FC<{
  action: Action;
  index: number;
  isCompleted: boolean;
  onComplete: () => void;
}> = ({ action, index, isCompleted, onComplete }) => {
  const difficultyConfig = {
    easy: { label: 'Facile', color: 'text-green-600' },
    medium: { label: 'Moyen', color: 'text-amber-600' },
    hard: { label: 'Difficile', color: 'text-red-600' }
  };
  
  const impactConfig = {
    low: { label: 'Faible', color: 'bg-gray-100' },
    medium: { label: 'Moyen', color: 'bg-amber-100' },
    high: { label: 'Élevé', color: 'bg-green-100' }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border ${
        isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <Button
          variant={isCompleted ? "default" : "outline"}
          size="icon"
          className={`h-6 w-6 rounded-full ${
            isCompleted ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
          onClick={onComplete}
        >
          {isCompleted ? (
            <CheckCircle className="h-4 w-4 text-white" />
          ) : (
            <span className="text-xs">{index + 1}</span>
          )}
        </Button>
        
        <div className="flex-1">
          <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {action.label}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          
          <div className="flex items-center gap-4 mt-2">
            {action.estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {action.estimatedTime}
              </div>
            )}
            
            <Badge variant="outline" className={`text-xs ${difficultyConfig[action.difficulty].color}`}>
              {difficultyConfig[action.difficulty].label}
            </Badge>
            
            <Badge className={`text-xs ${impactConfig[action.impact].color}`}>
              Impact {impactConfig[action.impact].label}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};