import React from 'react';
import { Button } from './button';
import { IndividualSaveDialog, useIndividualSaveDialog } from './IndividualSaveDialog';
import { IndividualSaveManager } from '../../services/IndividualSaveManager';
import { Download, Save, Users } from 'lucide-react';

interface IndividualSaveButtonProps {
  userData: any;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  onSaveComplete?: (results: any) => void;
}

export function IndividualSaveButton({
  userData,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  children,
  onSaveComplete
}: IndividualSaveButtonProps) {
  const { isOpen, openDialog, closeDialog } = useIndividualSaveDialog();

  // Vérifier les profils disponibles
  const availableProfiles = IndividualSaveManager.getAvailableProfiles(userData);
  const hasAvailableProfiles = Object.values(availableProfiles).some(profile => profile.available);

  const handleClick = () => {
    if (hasAvailableProfiles) {
      openDialog();
    }
  };

  const handleSaveComplete = (results: any) => {
    if (onSaveComplete) {
      onSaveComplete(results);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
        disabled={!hasAvailableProfiles}
        title={!hasAvailableProfiles ? "Aucun profil disponible à sauvegarder" : "Sauvegarder les profils individuellement"}
      >
        {showIcon && <Save className="w-4 h-4 mr-2" />}
        {children || "Sauvegarde Individuelle"}
      </Button>

      <IndividualSaveDialog
        userData={userData}
        isOpen={isOpen}
        onClose={closeDialog}
        onSaveComplete={handleSaveComplete}
      />
    </>
  );
}

// Variante avec menu déroulant pour plus d'options
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './dropdown-menu';

interface IndividualSaveDropdownProps extends Omit<IndividualSaveButtonProps, 'children'> {
  triggerText?: string;
}

export function IndividualSaveDropdown({
  userData,
  variant = 'outline',
  size = 'default',
  className = '',
  triggerText = "Sauvegarder",
  onSaveComplete
}: IndividualSaveDropdownProps) {
  const { isOpen, openDialog, closeDialog } = useIndividualSaveDialog();

  // Vérifier les profils disponibles
  const availableProfiles = IndividualSaveManager.getAvailableProfiles(userData);
  const hasAvailableProfiles = Object.values(availableProfiles).some(profile => profile.available);

  const handleSaveComplete = (results: any) => {
    if (onSaveComplete) {
      onSaveComplete(results);
    }
  };

  const handleQuickSave = async (profileType: 'person1' | 'person2' | 'couple') => {
    if (!availableProfiles[profileType].available) return;

    try {
      const result = await IndividualSaveManager.saveIndividualProfileDirect(userData, {
        profileType,
        includeTimestamp: true
      });

      if (onSaveComplete) {
        onSaveComplete([result]);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde rapide:', error);
    }
  };

  const handleSaveAll = async () => {
    try {
      const { results, summary } = await IndividualSaveManager.saveAllAvailableProfiles(userData);

      if (onSaveComplete) {
        onSaveComplete({ results, summary });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de tous les profils:', error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            disabled={!hasAvailableProfiles}
          >
            <Download className="w-4 h-4 mr-2" />
            {triggerText}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Sauvegarde rapide par profil */}
          {availableProfiles.person1.available && (
            <DropdownMenuItem onClick={() => handleQuickSave('person1')}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder {availableProfiles.person1.name}
            </DropdownMenuItem>
          )}

          {availableProfiles.person2.available && (
            <DropdownMenuItem onClick={() => handleQuickSave('person2')}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder {availableProfiles.person2.name}
            </DropdownMenuItem>
          )}

          {availableProfiles.couple.available && (
            <DropdownMenuItem onClick={() => handleQuickSave('couple')}>
              <Users className="w-4 h-4 mr-2" />
              Sauvegarder le couple
            </DropdownMenuItem>
          )}

          {/* Séparateur si des profils sont disponibles */}
          {(availableProfiles.person1.available || availableProfiles.person2.available || availableProfiles.couple.available) && (
            <DropdownMenuSeparator />
          )}

          {/* Options avancées */}
          <DropdownMenuItem onClick={openDialog}>
            <Download className="w-4 h-4 mr-2" />
            Options avancées...
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSaveAll}>
            <Users className="w-4 h-4 mr-2" />
            Tout sauvegarder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <IndividualSaveDialog
        userData={userData}
        isOpen={isOpen}
        onClose={closeDialog}
        onSaveComplete={handleSaveComplete}
      />
    </>
  );
}

// Composant pour afficher l'état des sauvegardes récentes
interface SaveStatusIndicatorProps {
  lastSaveResults?: any[];
  className?: string;
}

export function SaveStatusIndicator({ lastSaveResults, className = '' }: SaveStatusIndicatorProps) {
  if (!lastSaveResults || lastSaveResults.length === 0) {
    return null;
  }

  const successful = lastSaveResults.filter(r => r.success).length;
  const total = lastSaveResults.length;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        successful === total ? 'bg-green-500' : 'bg-yellow-500'
      }`} />
      <span className="text-gray-600">
        {successful === total
          ? `${total} profil${total > 1 ? 's' : ''} sauvegardé${total > 1 ? 's' : ''}`
          : `${successful}/${total} sauvegarde${total > 1 ? 's' : ''} réussie${successful > 1 ? 's' : ''}`
        }
      </span>
    </div>
  );
}
