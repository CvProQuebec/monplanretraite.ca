// Composant de skeleton intelligent avec IA et animations fluides
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDynamicTheme } from '../hooks/useDynamicTheme';

interface SkeletonData {
  type: 'card' | 'table' | 'list' | 'chart' | 'form' | 'profile';
  complexity: 'simple' | 'medium' | 'complex';
  estimatedHeight: number;
  estimatedWidth: number;
}

interface IntelligentSkeletonProps {
  type?: SkeletonData['type'];
  complexity?: SkeletonData['complexity'];
  data?: any[];
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const IntelligentSkeleton: React.FC<IntelligentSkeletonProps> = ({
  type,
  complexity = 'medium',
  data = [],
  isLoading,
  className = '',
  children
}) => {
  const { currentTheme } = useDynamicTheme();
  const [skeletonType, setSkeletonType] = useState<SkeletonData['type']>('card');
  const [predictedContent, setPredictedContent] = useState<SkeletonData | null>(null);

  // IA qui prédit le type de contenu basé sur les données
  useEffect(() => {
    if (data && data.length > 0) {
      const prediction = predictContentType(data);
      setSkeletonType(prediction.type);
      setPredictedContent(prediction);
    }
  }, [data]);

  // Prédiction intelligente du contenu
  const predictContentType = (data: any[]): SkeletonData => {
    if (data.length === 0) return { type: 'card', complexity: 'simple', estimatedHeight: 200, estimatedWidth: 300 };
    
    const firstItem = data[0];
    
    // Analyse des propriétés pour déterminer le type
    if (firstItem.hasOwnProperty('rows') || firstItem.hasOwnProperty('columns')) {
      return { type: 'table', complexity: 'complex', estimatedHeight: 400, estimatedWidth: 800 };
    }
    
    if (firstItem.hasOwnProperty('chartType') || firstItem.hasOwnProperty('dataPoints')) {
      return { type: 'chart', complexity: 'medium', estimatedHeight: 300, estimatedWidth: 600 };
    }
    
    if (firstItem.hasOwnProperty('fields') || firstItem.hasOwnProperty('inputs')) {
      return { type: 'form', complexity: 'medium', estimatedHeight: 500, estimatedWidth: 400 };
    }
    
    if (firstItem.hasOwnProperty('avatar') || firstItem.hasOwnProperty('bio')) {
      return { type: 'profile', complexity: 'simple', estimatedHeight: 150, estimatedWidth: 300 };
    }
    
    if (Array.isArray(firstItem) || data.length > 5) {
      return { type: 'list', complexity: 'medium', estimatedHeight: 300, estimatedWidth: 400 };
    }
    
    return { type: 'card', complexity: 'simple', estimatedHeight: 200, estimatedWidth: 300 };
  };

  // Configuration des animations selon le thème
  const getAnimationConfig = () => {
    if (!currentTheme) return { duration: 1.5, ease: "easeInOut" };
    
    switch (currentTheme.animations) {
      case 'subtle':
        return { duration: 2, ease: "easeInOut" };
      case 'moderate':
        return { duration: 1.5, ease: "easeInOut" };
      case 'intensive':
        return { duration: 1, ease: "easeInOut" };
      default:
        return { duration: 1.5, ease: "easeInOut" };
    }
  };

  // Composants de skeleton par type
  const SkeletonComponents = {
    card: (
      <motion.div
        className="animate-pulse space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={getAnimationConfig()}
      >
        {/* Image placeholder avec shimmer */}
        <div className="relative overflow-hidden rounded-lg">
          <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded-lg" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Contenu placeholder */}
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-3/4" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-2/3" />
        </div>
        
        {/* Actions placeholder */}
        <div className="flex space-x-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-20" />
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-20" />
        </div>
      </motion.div>
    ),

    table: (
      <motion.div
        className="animate-pulse space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={getAnimationConfig()}
      >
        {/* En-tête du tableau */}
        <div className="flex space-x-4 pb-2 border-b border-gray-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                                  animate-shimmer bg-[length:200%_100%] rounded w-24" />
          ))}
        </div>
        
        {/* Lignes du tableau */}
        {[...Array(5)].map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex space-x-4 py-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.1, ...getAnimationConfig() }}
          >
            {[...Array(4)].map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                                            animate-shimmer bg-[length:200%_100%] rounded w-24" />
            ))}
          </motion.div>
        ))}
      </motion.div>
    ),

    list: (
      <motion.div
        className="animate-pulse space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={getAnimationConfig()}
      >
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, ...getAnimationConfig() }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          animate-shimmer bg-[length:200%_100%] rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            animate-shimmer bg-[length:200%_100%] rounded w-3/4" />
              <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    ),

    chart: (
      <motion.div
        className="animate-pulse space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={getAnimationConfig()}
      >
        {/* Titre du graphique */}
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                      animate-shimmer bg-[length:200%_100%] rounded w-1/3" />
        
        {/* Zone du graphique */}
        <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                      animate-shimmer bg-[length:200%_100%] rounded-lg relative overflow-hidden">
          {/* Lignes de données simulées */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-white/30"
              style={{ top: `${20 + i * 15}%`, left: '0', right: '0' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
            />
          ))}
          
          {/* Points de données simulés */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/50 rounded-full"
              style={{ 
                left: `${10 + i * 10}%`, 
                top: `${20 + Math.sin(i) * 30}%` 
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
        
        {/* Légende */}
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            animate-shimmer bg-[length:200%_100%] rounded" />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            animate-shimmer bg-[length:200%_100%] rounded w-16" />
            </div>
          ))}
        </div>
      </motion.div>
    ),

    form: (
      <motion.div
        className="animate-pulse space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={getAnimationConfig()}
      >
        {/* Titre du formulaire */}
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                      animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
        
        {/* Champs du formulaire */}
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, ...getAnimationConfig() }}
          >
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          animate-shimmer bg-[length:200%_100%] rounded w-1/4" />
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          animate-shimmer bg-[length:200%_100%] rounded" />
          </motion.div>
        ))}
        
        {/* Bouton de soumission */}
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                      animate-shimmer bg-[length:200%_100%] rounded w-32" />
      </motion.div>
    ),

    profile: (
      <motion.div
        className="animate-pulse space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={getAnimationConfig()}
      >
        {/* Avatar et informations de base */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          animate-shimmer bg-[length:200%_100%] rounded w-32" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                          animate-shimmer bg-[length:200%_100%] rounded w-24" />
          </div>
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-full" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                        animate-shimmer bg-[length:200%_100%] rounded w-3/4" />
        </div>
        
        {/* Statistiques */}
        <div className="flex space-x-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            animate-shimmer bg-[length:200%_100%] rounded w-12 mb-1" />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                            animate-shimmer bg-[length:200%_100%] rounded w-16" />
            </div>
          ))}
        </div>
      </motion.div>
    )
  };

  // Affichage conditionnel
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={skeletonType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {SkeletonComponents[skeletonType]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Composant de skeleton avec prédiction automatique
export const AutoSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'type'>> = (props) => {
  return <IntelligentSkeleton {...props} />;
};

// Composant de skeleton spécialisé pour les cartes
export const CardSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'type'>> = (props) => {
  return <IntelligentSkeleton {...props} type="card" />;
};

// Composant de skeleton spécialisé pour les tableaux
export const TableSkeleton: React.FC<Omit<IntelligentSkeletonProps, 'type'>> = (props) => {
  return <IntelligentSkeleton {...props} type="table" />;
};
