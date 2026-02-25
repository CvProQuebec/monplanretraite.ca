/**
 * SeniorsFixedNavigation - Navigation Fixe Zéro Scroll
 * Barre de navigation permanente en bas d'écran pour seniors (50-90 ans)
 * AUCUN SCROLL NÉCESSAIRE | BOUTONS SURDIMENSIONNÉS | FEEDBACK VISUEL
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  HelpCircle, 
  Save,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SeniorsFixedNavigationProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  estimatedTime?: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onHome?: () => void;
  onHelp?: () => void;
  onSave?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isLoading?: boolean;
  showSaveButton?: boolean;
  className?: string;
}

const seniorsNavStyles = `
  .seniors-fixed-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 3px solid #2B5BA8;
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    padding: 20px 24px;
  }

  .seniors-nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .seniors-nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .seniors-nav-center {
    flex: 1;
    max-width: 400px;
    text-align: center;
  }

  .seniors-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .seniors-step-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
  }

  .seniors-step-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a365d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .seniors-step-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #64748b;
  }

  .seniors-progress-bar {
    flex: 1;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .seniors-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2B5BA8 0%, #6c5ce7 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .seniors-nav-btn {
    min-height: 56px;
    min-width: 140px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
  }

  .seniors-nav-btn-primary {
    background: linear-gradient(135deg, #2B5BA8 0%, #6c5ce7 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 14px rgba(43, 91, 168, 0.3);
  }

  .seniors-nav-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(43, 91, 168, 0.4);
  }

  .seniors-nav-btn-secondary {
    background: white;
    color: #64748b;
    border: 2px solid #e2e8f0;
  }

  .seniors-nav-btn-secondary:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }

  .seniors-nav-btn-utility {
    min-width: 56px;
    width: 56px;
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }

  .seniors-nav-btn-utility:hover:not(:disabled) {
    background: #e2e8f0;
    color: #475569;
  }

  .seniors-nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .seniors-loading-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .seniors-nav-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1a365d;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    margin-bottom: 8px;
  }

  .seniors-nav-btn-utility:hover .seniors-nav-tooltip {
    opacity: 1;
  }

  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    .seniors-fixed-nav {
      padding: 16px 16px;
    }
    
    .seniors-nav-container {
      flex-direction: column;
      gap: 12px;
    }
    
    .seniors-nav-center {
      order: -1;
      max-width: none;
    }
    
    .seniors-step-info {
      min-width: auto;
      width: 100%;
    }
    
    .seniors-step-title {
      text-align: center;
    }
    
    .seniors-nav-left,
    .seniors-nav-right {
      width: 100%;
      justify-content: space-between;
    }
    
    .seniors-nav-btn {
      flex: 1;
      max-width: 180px;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .seniors-nav-btn {
      min-height: 60px;
      font-size: 16px;
    }
    
    .seniors-nav-btn-utility {
      min-width: 60px;
      width: 60px;
    }
  }
`;

export const SeniorsFixedNavigation: React.FC<SeniorsFixedNavigationProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  estimatedTime,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onHome,
  onHelp,
  onSave,
  nextLabel = 'Continuer',
  previousLabel = 'Précédent',
  isLoading = false,
  showSaveButton = false,
  className = ''
}) => {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <>
      <style>{seniorsNavStyles}</style>
      <div className={`seniors-fixed-nav ${className}`}>
        <div className="seniors-nav-container">
          {/* Section gauche - Navigation */}
          <div className="seniors-nav-left">
            <Button
              onClick={onPrevious}
              disabled={!canGoPrevious || isLoading}
              className="seniors-nav-btn seniors-nav-btn-secondary"
            >
              <ArrowLeft size={20} />
              {previousLabel}
            </Button>
          </div>

          {/* Section centrale - Progression */}
          <div className="seniors-nav-center">
            <div className="seniors-step-info">
              <div className="seniors-step-title" title={stepTitle}>
                {stepTitle}
              </div>
              <div className="seniors-step-progress">
                <span>Étape {currentStep} sur {totalSteps}</span>
                <div className="seniors-progress-bar">
                  <div 
                    className="seniors-progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span>{progressPercentage}%</span>
                {estimatedTime && (
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{estimatedTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section droite - Actions principales */}
          <div className="seniors-nav-right">
            {/* Boutons utilitaires */}
            {onSave && showSaveButton && (
              <Button
                onClick={onSave}
                disabled={isLoading}
                className="seniors-nav-btn seniors-nav-btn-utility relative"
                title="Sauvegarder mes données"
              >
                <Save size={20} />
                <div className="seniors-nav-tooltip">Sauvegarder</div>
              </Button>
            )}

            {onHelp && (
              <Button
                onClick={onHelp}
                disabled={isLoading}
                className="seniors-nav-btn seniors-nav-btn-utility relative"
                title="Obtenir de l'aide"
              >
                <HelpCircle size={20} />
                <div className="seniors-nav-tooltip">Aide</div>
              </Button>
            )}

            {onHome && (
              <Button
                onClick={onHome}
                disabled={isLoading}
                className="seniors-nav-btn seniors-nav-btn-utility relative"
                title="Retour à l'accueil"
              >
                <Home size={20} />
                <div className="seniors-nav-tooltip">Accueil</div>
              </Button>
            )}

            {/* Bouton principal */}
            <Button
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              className="seniors-nav-btn seniors-nav-btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="seniors-loading-spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {currentStep === totalSteps ? (
                    <>
                      <CheckCircle size={20} />
                      Terminer
                    </>
                  ) : (
                    <>
                      {nextLabel}
                      <ArrowRight size={20} />
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer pour éviter que le contenu soit masqué par la navigation fixe */}
      <div style={{ height: '120px' }} />
    </>
  );
};

export default SeniorsFixedNavigation;