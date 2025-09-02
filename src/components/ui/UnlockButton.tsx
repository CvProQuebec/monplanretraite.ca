import React, { useState } from 'react';
import { Key, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Modal personnalisé sans dépendance Dialog
import { usePromoCode } from '@/hooks/usePromoCode';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

const UnlockButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { applyPromoCode } = usePromoCode();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await applyPromoCode(code.trim());
      
      if (result.success) {
        setMessage(isFrench 
          ? `Code "${code.trim().toUpperCase()}" appliqué avec succès ! Toutes les fonctionnalités sont maintenant déverrouillées.`
          : `Code "${code.trim().toUpperCase()}" applied successfully! All features are now unlocked.`
        );
        setIsSuccess(true);
        setCode('');
        
        // Fermer le modal après 2 secondes
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setMessage('');
        }, 2000);
      } else {
        setMessage(result.message || (isFrench 
          ? 'Code invalide. Veuillez vérifier et réessayer.'
          : 'Invalid code. Please check and try again.'
        ));
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage(isFrench 
        ? 'Erreur lors de l\'application du code.'
        : 'Error applying code.'
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      {/* Bouton flottant discret */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 z-50 w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
        size="icon"
        title={isFrench ? 'Déverrouiller les fonctionnalités' : 'Unlock features'}
      >
        <Key className="w-5 h-5" />
      </Button>

      {/* Modal de saisie du code */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                {isFrench ? 'Code de déverrouillage' : 'Unlock Code'}
              </h2>
            </div>
            
            {/* Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isFrench ? 'Entrez votre code :' : 'Enter your code:'}
                </label>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder={isFrench ? 'GRATUIT' : 'GRATUIT'}
                  className="text-center font-mono text-lg tracking-wider"
                  disabled={isLoading}
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  isSuccess 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {message}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!code.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isFrench ? 'Application...' : 'Applying...'}
                    </div>
                  ) : (
                    isFrench ? 'Appliquer' : 'Apply'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setCode('');
                    setMessage('');
                    setIsSuccess(false);
                  }}
                >
                  {isFrench ? 'Annuler' : 'Cancel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnlockButton;
