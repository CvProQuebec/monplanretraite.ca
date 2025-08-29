import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Info, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const SessionAlert: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isFrench = language === 'fr';

  const translations = {
    fr: {
      title: '🆕 Nouveau système de sécurité',
      message: 'Vos données sont maintenant réinitialisées à chaque session pour une confidentialité maximale.',
      details: 'Une sauvegarde locale est créée automatiquement avant fermeture. Accédez à l\'onglet "Session" pour gérer vos données.',
      learnMore: 'En savoir plus',
      dismiss: 'Compris',
      security: 'Sécurité renforcée'
    },
    en: {
      title: '🆕 New security system',
      message: 'Your data is now reset at each session for maximum confidentiality.',
      details: 'A local backup is automatically created before closing. Access the "Session" tab to manage your data.',
      learnMore: 'Learn more',
      dismiss: 'Got it',
      security: 'Enhanced security'
    }
  };

  const t = translations[isFrench ? 'fr' : 'en'];

  // Vérifier si l'alerte a déjà été fermée
  useEffect(() => {
    const dismissed = localStorage.getItem('retirement-session-alert-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    } else {
      // Afficher l'alerte après un délai
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fermer l'alerte
  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('retirement-session-alert-dismissed', 'true');
  };

  // Aller à l'onglet Session
  const handleLearnMore = () => {
    // Simuler un clic sur l'onglet Session
    const sessionTab = document.querySelector('[data-section="session"]');
    if (sessionTab) {
      (sessionTab as HTMLElement).click();
    }
    handleDismiss();
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <AlertDescription className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-blue-900">{t.title}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-blue-800">{t.message}</p>
            
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Info className="h-4 w-4" />
              <span>{t.details}</span>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLearnMore}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {t.learnMore}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-blue-600 hover:text-blue-800"
              >
                {t.dismiss}
              </Button>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
