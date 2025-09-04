import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Expand, Minimize2 } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  isCollapsed = false,
  onToggle,
  className = '',
  icon
}) => {
  return (
    <div className={`bg-white rounded-lg border-2 border-gray-200 shadow-lg ${className}`}>
      <div className="p-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {icon}
            {title}
          </h2>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-600 hover:text-gray-800"
            >
              {isCollapsed ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
            </Button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
