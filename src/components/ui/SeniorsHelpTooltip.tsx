import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info, X } from 'lucide-react';

interface SeniorsHelpTooltipProps {
  content: string;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const SeniorsHelpTooltip: React.FC<SeniorsHelpTooltipProps> = ({ 
  content, 
  title = "Aide", 
  children,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 ${className}`}
        aria-label={title}
      >
        <Info className="h-5 w-5" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-600" />
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-gray-700">
              {content}
            </p>
            {children && (
              <div className="text-sm text-gray-600">
                {children}
              </div>
            )}
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full h-12 text-lg font-semibold"
              variant="default"
            >
              <X className="h-5 w-5 mr-2" />
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeniorsHelpTooltip;
