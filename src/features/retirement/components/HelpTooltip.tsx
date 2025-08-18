// src/features/retirement/components/HelpTooltip.tsx
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  children: React.ReactNode;
  title: string;
  content: string;
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  children, 
  title, 
  content, 
  className = "" 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-2 ${className}`}>
            {children}
            <HelpCircle className="w-5 h-5 text-charcoal-400 hover:text-charcoal-600 cursor-help" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-sm p-4 bg-charcoal-900 text-white border-charcoal-700"
        >
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">{title}</h4>
            <p className="text-sm leading-relaxed">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Composant d'aide pour les champs spécifiques
export const FieldHelp: React.FC<{ field: string }> = ({ field }) => {
  const helpContent = {
    prenom: {
      title: "Prénom",
      content: "Entrez votre prénom tel qu'il apparaît sur vos documents officiels."
    },
    dateNaissance: {
      title: "Date de naissance",
      content: "Votre date de naissance exacte est nécessaire pour calculer votre âge et vos prestations de retraite."
    },
    sexe: {
      title: "Sexe",
      content: "Cette information est utilisée pour calculer l'espérance de vie et les prestations de retraite."
    },
    statutProfessionnel: {
      title: "Statut professionnel",
      content: "Indiquez si vous travaillez actuellement ou si vous êtes déjà retraité(e)."
    },
    salaire: {
      title: "Salaire annuel",
      content: "Votre salaire brut annuel avant impôts. Incluez les primes et commissions régulières."
    },
    ageRetraite: {
      title: "Âge de retraite souhaité",
      content: "L'âge auquel vous souhaitez prendre votre retraite. Entre 55 et 75 ans."
    },
    depensesRetraite: {
      title: "Dépenses de retraite",
      content: "Estimez vos dépenses mensuelles à la retraite : logement, alimentation, transport, loisirs, etc."
    }
  };

  const content = helpContent[field as keyof typeof helpContent];
  
  if (!content) return null;

  return (
    <HelpTooltip title={content.title} content={content.content}>
      <span></span>
    </HelpTooltip>
  );
};