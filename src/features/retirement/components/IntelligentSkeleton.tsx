// Composant de skeleton intelligent avec IA et animations fluides
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Eye, 
  Clock, 
  TrendingUp, 
  BarChart3,
  FileText,
  Image,
  Video,
  Music,
  Calendar,
  User,
  MessageSquare,
  Star,
  Heart,
  Share2,
  Download,
  Play,
  Pause,
  Settings
} from 'lucide-react';

// Types pour les skeletons intelligents
interface SkeletonData {
  type: 'card' | 'table' | 'chart' | 'list' | 'form' | 'gallery' | 'timeline' | 'stats';
  title?: string;
  description?: string;
  items?: number;
  columns?: number;
  rows?: number;
  hasImage?: boolean;
  hasVideo?: boolean;
  hasAudio?: boolean;
  hasActions?: boolean;
  complexity: 'simple' | 'medium' | 'complex';
}

interface SkeletonItem {
  id: string;
  type: 'text' | 'image' | 'button' | 'avatar' | 'progress' | 'badge' | 'icon';
  width: string;
  height: string;
  className?: string;
  animation?: 'pulse' | 'wave' | 'shimmer' | 'bounce';
  delay?: number;
}

interface IntelligentSkeletonProps {
  isLoading: boolean;
  data?: SkeletonData[];
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  animation?: 'default' | 'subtle' | 'energetic';
  showPredictions?: boolean;
}

// Configuration des types de skeletons
const SKELETON_CONFIGS: Record<string, SkeletonData> = {
  card: {
    type: 'card',
    title: 'Titre de la carte',
    description: 'Description de la carte',
    hasImage: true,
    hasActions: true,
    complexity: 'medium'
  },
  table: {
    type: 'table',
    columns: 4,
    rows: 6,
    hasActions: true,
    complexity: 'complex'
  },
  chart: {
    type: 'chart',
    title: 'Graphique de données',
    hasActions: false,
    complexity: 'medium'
  },
  list: {
    type: 'list',
    items: 8,
    hasActions: true,
    complexity: 'simple'
  },
  form: {
    type: 'form',
    items: 6,
    hasActions: true,
    complexity: 'medium'
  },
  gallery: {
    type: 'gallery',
    items: 12,
    hasImage: true,
    hasActions: true,
    complexity: 'complex'
  },
  timeline: {
    type: 'timeline',
    items: 5,
    hasActions: false,
    complexity: 'medium'
  },
  stats: {
    type: 'stats',
    items: 4,
    hasActions: false,
    complexity: 'simple'
  }
};

// Génération intelligente des skeletons
const generateSkeletonItems = (config: SkeletonData): SkeletonItem[] => {
  const items: SkeletonItem[] = [];
  
  switch (config.type) {
    case 'card':
      // Header avec avatar et titre
      items.push(
        { id: 'card-avatar', type: 'avatar', width: 'w-12', height: 'h-12', animation: 'pulse', delay: 0 },
        { id: 'card-title', type: 'text', width: 'w-3/4', height: 'h-6', animation: 'pulse', delay: 0.1 },
        { id: 'card-subtitle', type: 'text', width: 'w-1/2', height: 'h-4', animation: 'pulse', delay: 0.2 }
      );
      
      // Image si présente
      if (config.hasImage) {
        items.push(
          { id: 'card-image', type: 'image', width: 'w-full', height: 'h-32', animation: 'shimmer', delay: 0.3 }
        );
      }
      
      // Description
      items.push(
        { id: 'card-desc1', type: 'text', width: 'w-full', height: 'h-4', animation: 'pulse', delay: 0.4 },
        { id: 'card-desc2', type: 'text', width: 'w-2/3', height: 'h-4', animation: 'pulse', delay: 0.5 }
      );
      
      // Actions si présentes
      if (config.hasActions) {
        items.push(
          { id: 'card-action1', type: 'button', width: 'w-20', height: 'h-8', animation: 'pulse', delay: 0.6 },
          { id: 'card-action2', type: 'button', width: 'w-20', height: 'h-8', animation: 'pulse', delay: 0.7 }
        );
      }
      break;
      
    case 'table':
      // En-têtes
      for (let i = 0; i < (config.columns || 4); i++) {
        items.push({
          id: `table-header-${i}`,
          type: 'text',
          width: 'w-full',
          height: 'h-6',
          animation: 'pulse',
          delay: i * 0.1
        });
      }
      
      // Lignes de données
      for (let row = 0; row < (config.rows || 6); row++) {
        for (let col = 0; col < (config.columns || 4); col++) {
          items.push({
            id: `table-cell-${row}-${col}`,
            type: 'text',
            width: 'w-full',
            height: 'h-5',
            animation: 'pulse',
            delay: (row * (config.columns || 4) + col) * 0.05 + 0.5
          });
        }
      }
      
      // Actions si présentes
      if (config.hasActions) {
        items.push(
          { id: 'table-actions', type: 'button', width: 'w-24', height: 'h-8', animation: 'pulse', delay: 1.0 }
        );
      }
      break;
      
    case 'chart':
      // Titre
      items.push(
        { id: 'chart-title', type: 'text', width: 'w-1/2', height: 'h-6', animation: 'pulse', delay: 0 }
      );
      
      // Zone du graphique
      items.push(
        { id: 'chart-area', type: 'image', width: 'w-full', height: 'h-48', animation: 'shimmer', delay: 0.2 }
      );
      
      // Légende
      for (let i = 0; i < 4; i++) {
        items.push({
          id: `chart-legend-${i}`,
          type: 'text',
          width: 'w-20',
          height: 'h-4',
          animation: 'pulse',
          delay: 0.4 + i * 0.1
        });
      }
      break;
      
    case 'list':
      // Éléments de liste
      for (let i = 0; i < (config.items || 8); i++) {
        items.push(
          { id: `list-item-${i}`, type: 'text', width: 'w-full', height: 'h-5', animation: 'pulse', delay: i * 0.1 }
        );
      }
      
      // Actions si présentes
      if (config.hasActions) {
        items.push(
          { id: 'list-actions', type: 'button', width: 'w-32', height: 'h-8', animation: 'pulse', delay: 1.0 }
        );
      }
      break;
      
    case 'form':
      // Champs de formulaire
      for (let i = 0; i < (config.items || 6); i++) {
        items.push(
          { id: `form-label-${i}`, type: 'text', width: 'w-1/3', height: 'h-5', animation: 'pulse', delay: i * 0.1 },
          { id: `form-input-${i}`, type: 'text', width: 'w-full', height: 'h-10', animation: 'pulse', delay: i * 0.1 + 0.05 }
        );
      }
      
      // Boutons d'action
      if (config.hasActions) {
        items.push(
          { id: 'form-submit', type: 'button', width: 'w-24', height: 'h-10', animation: 'pulse', delay: 1.0 },
          { id: 'form-cancel', type: 'button', width: 'w-24', height: 'h-10', animation: 'pulse', delay: 1.1 }
        );
      }
      break;
      
    case 'gallery':
      // Grille d'images
      const gridSize = Math.ceil(Math.sqrt(config.items || 12));
      for (let i = 0; i < (config.items || 12); i++) {
        items.push({
          id: `gallery-item-${i}`,
          type: 'image',
          width: 'w-full',
          height: 'h-24',
          animation: 'shimmer',
          delay: i * 0.05
        });
      }
      
      // Actions si présentes
      if (config.hasActions) {
        items.push(
          { id: 'gallery-actions', type: 'button', width: 'w-32', height: 'h-8', animation: 'pulse', delay: 1.0 }
        );
      }
      break;
      
    case 'timeline':
      // Éléments de timeline
      for (let i = 0; i < (config.items || 5); i++) {
        items.push(
          { id: `timeline-dot-${i}`, type: 'avatar', width: 'w-4', height: 'h-4', animation: 'bounce', delay: i * 0.2 },
          { id: `timeline-content-${i}`, type: 'text', width: 'w-full', height: 'h-5', animation: 'pulse', delay: i * 0.2 + 0.1 }
        );
      }
      break;
      
    case 'stats':
      // Cartes de statistiques
      for (let i = 0; i < (config.items || 4); i++) {
        items.push(
          { id: `stats-icon-${i}`, type: 'icon', width: 'w-8', height: 'h-8', animation: 'pulse', delay: i * 0.1 },
          { id: `stats-value-${i}`, type: 'text', width: 'w-16', height: 'h-8', animation: 'pulse', delay: i * 0.1 + 0.05 },
          { id: `stats-label-${i}`, type: 'text', width: 'w-20', height: 'h-4', animation: 'pulse', delay: i * 0.1 + 0.1 }
        );
      }
      break;
  }
  
  return items;
};

// Composant de skeleton individuel
const SkeletonItem: React.FC<{ item: SkeletonItem; theme: string }> = ({ item, theme }) => {
  const baseClasses = 'bg-gray-200 rounded';
  const darkClasses = 'bg-gray-700';
  const themeClasses = theme === 'dark' ? darkClasses : baseClasses;
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    shimmer: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    bounce: 'animate-bounce'
  };
  
  return (
    <motion.div
      className={`${item.width} ${item.height} ${themeClasses} ${animationClasses[item.animation || 'pulse']} ${item.className || ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: item.delay || 0,
        ease: "easeOut"
      }}
    />
  );
};

// Composant principal IntelligentSkeleton
export const IntelligentSkeleton: React.FC<IntelligentSkeletonProps> = ({
  isLoading,
  data = [],
  className = '',
  theme = 'auto',
  animation = 'default',
  showPredictions = true
}) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [predictedData, setPredictedData] = useState<SkeletonData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Détection automatique du thème
  useEffect(() => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  // Analyse IA des données pour prédire le type de skeleton
  useEffect(() => {
    if (isLoading && data.length === 0 && showPredictions) {
      setIsAnalyzing(true);
      
      // Simulation d'analyse IA
      setTimeout(() => {
        const predictions = predictSkeletonType();
        setPredictedData(predictions);
        setIsAnalyzing(false);
      }, 800);
    }
  }, [isLoading, data, showPredictions]);

  // Prédiction intelligente du type de skeleton
  const predictSkeletonType = (): SkeletonData[] => {
    // Simulation d'analyse basée sur le contexte de la page
    const pageContext = window.location.pathname;
    
    if (pageContext.includes('retraite') || pageContext.includes('retirement')) {
      return [
        { type: 'stats', items: 4, hasActions: false, complexity: 'simple' },
        { type: 'chart', title: 'Évolution des épargnes', hasActions: false, complexity: 'medium' },
        { type: 'table', columns: 5, rows: 8, hasActions: true, complexity: 'complex' }
      ];
    } else if (pageContext.includes('dashboard')) {
      return [
        { type: 'card', title: 'Vue d\'ensemble', description: 'Résumé des activités', hasImage: true, hasActions: true, complexity: 'medium' },
        { type: 'gallery', items: 6, hasImage: true, hasActions: true, complexity: 'complex' },
        { type: 'timeline', items: 5, hasActions: false, complexity: 'medium' }
      ];
    } else {
      // Prédiction par défaut
      return [
        { type: 'card', title: 'Contenu principal', description: 'Description du contenu', hasImage: false, hasActions: true, complexity: 'medium' },
        { type: 'list', items: 6, hasActions: true, complexity: 'simple' }
      ];
    }
  };

  // Rendu du skeleton
  const renderSkeleton = (config: SkeletonData, index: number) => {
    const items = generateSkeletonItems(config);
    
    const containerClasses = {
      card: 'p-6 bg-white rounded-xl shadow-lg border border-gray-200',
      table: 'overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200',
      chart: 'p-6 bg-white rounded-xl shadow-lg border border-gray-200',
      list: 'space-y-3 p-4 bg-white rounded-xl shadow-lg border border-gray-200',
      form: 'space-y-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200',
      gallery: 'p-4 bg-white rounded-xl shadow-lg border border-gray-200',
      timeline: 'relative p-6 bg-white rounded-xl shadow-lg border border-gray-200',
      stats: 'grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200'
    };

    const itemContainerClasses = {
      card: 'space-y-4',
      table: 'p-4',
      chart: 'space-y-4',
      list: 'space-y-2',
      form: 'space-y-4',
      gallery: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
      timeline: 'space-y-4',
      stats: 'text-center'
    };

    return (
      <motion.div
        key={`skeleton-${index}`}
        className={`${containerClasses[config.type]} ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
      >
        <div className={itemContainerClasses[config.type]}>
          {items.map((item) => (
            <SkeletonItem key={item.id} item={item} theme={currentTheme} />
          ))}
        </div>
      </motion.div>
    );
  };

  if (!isLoading) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Indicateur d'analyse IA */}
      {isAnalyzing && (
        <motion.div
          className="flex items-center justify-center p-4 bg-gradient-to-r from-mpr-interactive-lt to-purple-50 rounded-xl border border-mpr-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Brain className="w-5 h-5 text-mpr-interactive mr-2 animate-pulse" />
          <span className="text-mpr-navy font-medium">
            IA en train d'analyser le contenu...
          </span>
        </motion.div>
      )}

      {/* Skeletons prédits ou fournis */}
      <AnimatePresence mode="wait">
        {(data.length > 0 ? data : predictedData).map((config, index) => (
          <motion.div
            key={`skeleton-container-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {renderSkeleton(config, index)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Informations de debug */}
      {showPredictions && process.env.NODE_ENV === 'development' && (
        <motion.div
          className="p-4 bg-gray-100 rounded-lg text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="font-medium mb-2">🔍 Debug - Skeletons générés :</div>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(data.length > 0 ? data : predictedData, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
};

// Variantes spécialisées
export const CardSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'data'> & { variant?: 'simple' | 'detailed' | 'media' }> = ({ 
  variant = 'detailed', 
  ...props 
}) => {
  const variantData: SkeletonData[] = [{
    type: 'card',
    title: 'Titre de la carte',
    description: 'Description de la carte',
    hasImage: variant === 'media',
    hasActions: variant !== 'simple',
    complexity: variant === 'simple' ? 'simple' : 'medium'
  }];
  
  return <IntelligentSkeleton {...props} data={variantData} />;
};

export const TableSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'data'> & { columns?: number; rows?: number }> = ({ 
  columns = 4, 
  rows = 6, 
  ...props 
}) => {
  const tableData: SkeletonData[] = [{
    type: 'table',
    columns,
    rows,
    hasActions: true,
    complexity: 'complex'
  }];
  
  return <IntelligentSkeleton {...props} data={tableData} />;
};

export const ChartSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'data'>> = (props) => {
  const chartData: SkeletonData[] = [{
    type: 'chart',
    title: 'Graphique de données',
    hasActions: false,
    complexity: 'medium'
  }];
  
  return <IntelligentSkeleton {...props} data={chartData} />;
};

export const ListSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'data'> & { items?: number }> = ({ 
  items = 8, 
  ...props 
}) => {
  const listData: SkeletonData[] = [{
    type: 'list',
    items,
    hasActions: true,
    complexity: 'simple'
  }];
  
  return <IntelligentSkeleton {...props} data={listData} />;
};

export default IntelligentSkeleton;
