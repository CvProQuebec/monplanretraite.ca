import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const textColors = {
    default: 'text-gray-900',
    white: 'text-white',
    dark: 'text-gray-900'
  };

  // Force le rechargement du logo en ajoutant un timestamp
  const logoUrl = `/logo-planretraite.png?v=${Date.now()}`;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={logoUrl}
        alt="MonPlanRetraite.ca Logo" 
        className={`${sizeClasses[size]} w-auto`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
      {showText && (
        <div className={`hidden ${textSizes[size]} font-bold ${textColors[variant]} bg-gray-100 px-3 py-1 rounded`}>
          MonPlanRetraite.ca
        </div>
      )}
    </div>
  );
};

export default Logo;
