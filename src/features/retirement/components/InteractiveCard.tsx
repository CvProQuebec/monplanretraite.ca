// Composant de carte interactive avec effets 3D et animations
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  status?: 'completed' | 'in-progress' | 'locked' | 'premium';
  progress?: number;
  className?: string;
  children?: React.ReactNode;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  status = 'in-progress',
  progress = 0,
  className = '',
  children
}) => {
  const statusConfig = {
    completed: {
      bg: 'from-green-500 to-emerald-600',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: 'text-green-600'
    },
    'in-progress': {
      bg: 'from-blue-500 to-purple-600',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: 'text-blue-600'
    },
    locked: {
      bg: 'from-gray-400 to-gray-600',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: 'text-gray-600'
    },
    premium: {
      bg: 'from-purple-500 to-pink-600',
      text: 'text-purple-700',
      border: 'border-purple-300',
      icon: 'text-purple-600'
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className={`
        group relative bg-white rounded-xl p-6 shadow-lg 
        transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
        cursor-pointer border border-gray-200 hover:border-blue-300
        ${onClick ? 'hover:cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      {/* Effet de bordure lumineuse */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-500 bg-gradient-to-r ${config.bg}
        blur-sm scale-105 group-hover:scale-110
      `} />
      
      <div className="relative z-10">
        {/* En-tête de la carte */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            w-14 h-14 bg-gradient-to-br ${config.bg} rounded-xl 
            flex items-center justify-center mb-4 group-hover:scale-110 
            transition-transform duration-500 shadow-lg
          `}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Badge de statut */}
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${status === 'completed' ? 'bg-green-100 text-green-800' : ''}
            ${status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
            ${status === 'locked' ? 'bg-gray-100 text-gray-800' : ''}
            ${status === 'premium' ? 'bg-purple-100 text-purple-800' : ''}
          `}>
            {status === 'completed' && '✓ Terminé'}
            {status === 'in-progress' && '🔄 En cours'}
            {status === 'locked' && '🔒 Verrouillé'}
            {status === 'premium' && '⭐ Premium'}
          </div>
        </div>
        
        {/* Contenu principal */}
        <h3 className={`
          text-xl font-bold mb-3 group-hover:text-blue-600 
          transition-colors duration-300 ${config.text}
        `}>
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
        
        {/* Barre de progression animée */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`
                  h-2 rounded-full bg-gradient-to-r ${config.bg}
                  transition-all duration-1000 ease-out group-hover:shadow-lg
                `}
                style={{ 
                  width: `${progress}%`,
                  transform: 'translateX(0)',
                  animation: 'slideIn 1s ease-out'
                }}
              />
            </div>
          </div>
        )}
        
        {/* Contenu personnalisé */}
        {children && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {children}
          </div>
        )}
        
        {/* Indicateur d'action */}
        {onClick && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
              Cliquez pour accéder
            </div>
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center 
                          group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Animation CSS personnalisée */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// Composant de grille de cartes
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ 
  children, 
  columns = 3, 
  gap = 'lg',
  className = '' 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
  
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };
  
  return (
    <div className={`
      grid ${gridCols[columns]} ${gaps[gap]}
      transition-all duration-500 ease-in-out
      ${className}
    `}>
      {children}
    </div>
  );
};
