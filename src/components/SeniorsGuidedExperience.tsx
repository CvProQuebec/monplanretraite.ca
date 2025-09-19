/**
 * SeniorsGuidedExperience - Composant Principal Navigation Zéro Scroll
 * Interface ultra-simplifiée pour seniors (50-90 ans)
 * UNE ÉTAPE = UN ÉCRAN COMPLET | NAVIGATION FIXE | ASSISTANT PERMANENT
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { 
  SeniorsNavigationService, 
  GuidedStep, 
  NavigationContext,
  AssistantMessage 
} from '@/services/SeniorsNavigationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  User, 
  DollarSign,
  Home,
  PiggyBank,
  Shield,
  FileText,
  Heart,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

// Styles CSS intégrés pour l'expérience seniors
const seniorsStyles = `
  .seniors-guided-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .seniors-main-content {
    flex: 1;
    padding: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .seniors-step-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    max-width: 800px;
    width: 100%;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .seniors-header {
    background: linear-gradient(135deg, #4c6ef5 0%, #6c5ce7 100%);
    color: white;
    padding: 30px;
    text-align: center;
  }

  .seniors-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .seniors-subtitle {
    font-size: 18px;
    opacity: 0.95;
    font-weight: 400;
  }

  .seniors-progress-container {
    padding: 20px 30px;
    background: #f8f9ff;
    border-bottom: 1px solid #e2e8f0;
  }

  .seniors-progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .seniors-step-info {
    font-size: 16px;
    font-weight: 600;
    color: #1a365d;
  }

  .seniors-time-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
  }

  .seniors-content {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .seniors-assistant-section {
    background: linear-gradient(135deg, #e8f4f8 0%, #f1f8ff 100%);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 30px;
    border-left: 5px solid #4c6ef5;
  }

  .seniors-assistant-message {
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }

  .seniors-assistant-avatar {
    font-size: 32px;
    flex-shrink: 0;
  }

  .seniors-assistant-text {
    flex: 1;
  }

  .seniors-assistant-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a365d;
    margin-bottom: 8px;
  }

  .seniors-assistant-content {
    font-size: 16px;
    line-height: 1.6;
    color: #2d3748;
  }

  .seniors-form-section {
    flex: 1;
  }

  .seniors-form-grid {
    display: grid;
    gap: 25px;
    margin-bottom: 30px;
  }

  .seniors-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .seniors-label {
    font-size: 16px;
    font-weight: 600;
    color: #1a365d;
  }

  .seniors-input {
    font-size: 18px;
    min-height: 52px;
    padding: 15px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    transition: all 0.2s ease;
  }

  .seniors-input:focus {
    outline: none;
    border-color: #4c6ef5;
    box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
  }

  .seniors-select-trigger {
    font-size: 18px;
    min-height: 52px;
    padding: 15px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
  }

  .seniors-navigation {
    background: white;
    border-top: 2px solid #e2e8f0;
    padding: 25px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .seniors-nav-button {
    min-height: 56px;
    min-width: 140px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .seniors-nav-button-primary {
    background: linear-gradient(135deg, #4c6ef5 0%, #6c5ce7 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(76, 110, 245, 0.3);
  }

  .seniors-nav-button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 110, 245, 0.4);
  }

  .seniors-nav-button-secondary {
    background: white;
    color: #64748b;
    border: 2px solid #e2e8f0;
  }

  .seniors-nav-button-secondary:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .seniors-validation-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-top: 20px;
  }

  .seniors-success-message {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-top: 20px;
  }

  /* Responsive pour tablettes */
  @media (max-width: 768px) {
    .seniors-main-content {
      padding: 10px;
    }
    
    .seniors-step-card {
      min-height: calc(100vh - 20px);
    }
    
    .seniors-content {
      padding: 20px;
    }
    
    .seniors-title {
      font-size: 24px;
    }
    
    .seniors-input,
    .seniors-select-trigger {
      font-size: 20px;
      min-height: 56px;
    }
  }
`;

interface SeniorsGuidedExperienceProps {
  startingStep?: string;
  onComplete?: () => void;
  className?: string;
}

export const SeniorsGuidedExperience: React.FC<SeniorsGuidedExperienceProps> = ({
  startingStep,
  onComplete,
  className = ''
}) => {
  const { userData, updateUserData } = useRetirementData();
  const navigate = useNavigate();
  
  const [navigationContext, setNavigationContext] = useState<NavigationContext | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<AssistantMessage | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ===== EFFET D'INITIALISATION =====
  useEffect(() => {
    const context = SeniorsNavigationService.getNavigationContext(userData);
    setNavigationContext(context);
    
    const assistantMessage = SeniorsNavigationService.getContextualAssistantMessage(
      context.currentStep,
      userData
    );
    setCurrentAssistantMessage(assistantMessage);
    
    // Pré-remplir les données du formulaire
    setFormData(extractFormDataFromStep(context.currentStep, userData));
  }, [userData]);

  // ===== GESTION DES DONNÉES DU FORMULAIRE =====
  const extractFormDataFromStep = (step: GuidedStep, userData: any): any => {
    const data: any = {};
    
    step.requiredFields.forEach(field => {
      const value = getFieldValue(userData, field);
      if (value !== undefined && value !== null) {
        data[field] = value;
      }
    });
    
    return data;
  };

  const getFieldValue = (userData: any, fieldPath: string): any => {
    const parts = fieldPath.split('.');
    let current = userData;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Essayer dans les sections principales
        if (userData.personal && part in userData.personal) return userData.personal[part];
        if (userData.cashflow && part in userData.cashflow) return userData.cashflow[part];
        if (userData.savings && part in userData.savings) return userData.savings[part];
        if (userData.retirement && part in userData.retirement) return userData.retirement[part];
        return undefined;
      }
    }
    
    return current;
  };

  // ===== GESTION DE LA NAVIGATION =====
  const handleNext = useCallback(async () => {
    if (!navigationContext) return;
    
    setIsLoading(true);
    setValidationErrors([]);
    
    // Valider les données actuelles
    const validation = SeniorsNavigationService.validateStep(
      navigationContext.currentStep.id,
      { ...userData, ...formData }
    );
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setIsLoading(false);
      return;
    }
    
    // Sauvegarder les données
    await saveCurrentStepData();
    
    // Naviguer vers l'étape suivante
    const nextStepId = navigationContext.recommendedNextStep;
    if (nextStepId) {
      // Actualiser le contexte avec les nouvelles données
      const updatedUserData = { ...userData };
      Object.keys(formData).forEach(key => {
        if (key.startsWith('personal.')) {
          if (!updatedUserData.personal) updatedUserData.personal = {};
          updatedUserData.personal[key.replace('personal.', '')] = formData[key];
        } else if (key.startsWith('cashflow.')) {
          if (!updatedUserData.cashflow) updatedUserData.cashflow = {};
          updatedUserData.cashflow[key.replace('cashflow.', '')] = formData[key];
        } else if (key.startsWith('savings.')) {
          if (!updatedUserData.savings) updatedUserData.savings = {};
          updatedUserData.savings[key.replace('savings.', '')] = formData[key];
        } else {
          // Champ direct dans personal par défaut
          if (!updatedUserData.personal) updatedUserData.personal = {};
          updatedUserData.personal[key] = formData[key];
        }
      });
      
      const newContext = SeniorsNavigationService.getNavigationContext(updatedUserData);
      setNavigationContext(newContext);
      
      const newMessage = SeniorsNavigationService.getContextualAssistantMessage(
        newContext.currentStep,
        updatedUserData
      );
      setCurrentAssistantMessage(newMessage);
      
      // Réinitialiser les données du formulaire pour la nouvelle étape
      setFormData(extractFormDataFromStep(newContext.currentStep, updatedUserData));
    } else {
      // Fin du parcours guidé
      if (onComplete) {
        onComplete();
      } else {
        navigate('/ma-retraite');
      }
    }
    
    setIsLoading(false);
  }, [navigationContext, formData, userData, updateUserData, navigate, onComplete]);

  const handlePrevious = useCallback(() => {
    if (!navigationContext?.currentStep.previousStep) return;
    
    // Logique pour revenir à l'étape précédente
    // Pour l'instant, on recharge le contexte basé sur userData
    const context = SeniorsNavigationService.getNavigationContext(userData);
    setNavigationContext(context);
  }, [navigationContext, userData]);

  // ===== SAUVEGARDE DES DONNÉES =====
  const saveCurrentStepData = async () => {
    const section = navigationContext?.currentStep.category || 'personal';
    
    switch (section) {
      case 'profile':
        updateUserData('personal', formData);
        break;
      case 'income':
        updateUserData('personal', formData);
        break;
      case 'expenses':
        updateUserData('cashflow', formData);
        break;
      case 'savings':
        updateUserData('savings', formData);
        break;
      case 'benefits':
        updateUserData('retirement', formData);
        break;
      default:
        updateUserData('personal', formData);
    }
  };

  // ===== GESTION DES CHAMPS =====
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer les erreurs de validation
    setValidationErrors([]);
  };

  // ===== RENDU DES CHAMPS SELON L'ÉTAPE =====
  const renderStepContent = () => {
    if (!navigationContext) return null;
    
    const step = navigationContext.currentStep;
    
    switch (step.id) {
      case 'welcome':
        return renderWelcomeStep();
      case 'personal-profile':
        return renderPersonalProfileStep();
      case 'income-overview':
        return renderIncomeStep();
      case 'expenses-overview':
        return renderExpensesStep();
      case 'savings-overview':
        return renderSavingsStep();
      case 'benefits-check':
        return renderBenefitsStep();
      case 'final-summary':
        return renderSummaryStep();
      default:
        return <div>Étape inconnue</div>;
    }
  };

  const renderWelcomeStep = () => (
    <div className="seniors-form-section">
      <div className="text-center">
        <div className="seniors-welcome-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>
          🎯
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Créons votre plan de retraite personnalisé
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          En quelques étapes simples, découvrez si vous êtes prêt pour une retraite sereine.
          Toutes vos informations restent 100% confidentielles sur cet appareil.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4">
            <User size={32} className="mx-auto mb-2 text-blue-500" />
            <h4 className="font-semibold">Profil personnel</h4>
            <p className="text-sm text-gray-600">Vos informations de base</p>
          </div>
          <div className="text-center p-4">
            <DollarSign size={32} className="mx-auto mb-2 text-green-500" />
            <h4 className="font-semibold">Situation financière</h4>
            <p className="text-sm text-gray-600">Revenus et dépenses</p>
          </div>
          <div className="text-center p-4">
            <Shield size={32} className="mx-auto mb-2 text-purple-500" />
            <h4 className="font-semibold">Plan personnalisé</h4>
            <p className="text-sm text-gray-600">Recommandations sur mesure</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalProfileStep = () => (
    <div className="seniors-form-section">
      <div className="seniors-form-grid">
        <div className="seniors-field">
          <Label htmlFor="prenom1" className="seniors-label">
            Votre prénom *
          </Label>
          <Input
            id="prenom1"
            value={formData.prenom1 || ''}
            onChange={(e) => handleFieldChange('prenom1', e.target.value)}
            className="seniors-input"
            placeholder="Ex: Marie"
          />
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="naissance1" className="seniors-label">
            Votre date de naissance *
          </Label>
          <Input
            id="naissance1"
            type="date"
            value={formData.naissance1 || ''}
            onChange={(e) => handleFieldChange('naissance1', e.target.value)}
            className="seniors-input"
          />
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="province1" className="seniors-label">
            Votre province de résidence *
          </Label>
          <Select
            value={formData.province1 || ''}
            onValueChange={(value) => handleFieldChange('province1', value)}
          >
            <SelectTrigger className="seniors-select-trigger">
              <SelectValue placeholder="Choisissez votre province" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="QC">Québec</SelectItem>
              <SelectItem value="ON">Ontario</SelectItem>
              <SelectItem value="BC">Colombie-Britannique</SelectItem>
              <SelectItem value="AB">Alberta</SelectItem>
              <SelectItem value="MB">Manitoba</SelectItem>
              <SelectItem value="SK">Saskatchewan</SelectItem>
              <SelectItem value="NS">Nouvelle-Écosse</SelectItem>
              <SelectItem value="NB">Nouveau-Brunswick</SelectItem>
              <SelectItem value="NL">Terre-Neuve-et-Labrador</SelectItem>
              <SelectItem value="PE">Île-du-Prince-Édouard</SelectItem>
              <SelectItem value="YT">Yukon</SelectItem>
              <SelectItem value="NT">Territoires du Nord-Ouest</SelectItem>
              <SelectItem value="NU">Nunavut</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderIncomeStep = () => (
    <div className="seniors-form-section">
      <div className="seniors-form-grid">
        <div className="seniors-field">
          <Label htmlFor="salaire1" className="seniors-label">
            Votre revenu annuel brut (avant impôts) *
          </Label>
          <Input
            id="salaire1"
            type="number"
            value={formData.salaire1 || ''}
            onChange={(e) => handleFieldChange('salaire1', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 75000"
          />
          <p className="text-sm text-gray-600 mt-2">
            💡 Incluez votre salaire, bonus et autres revenus d'emploi
          </p>
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="autresRevenus1" className="seniors-label">
            Autres revenus annuels (optionnel)
          </Label>
          <Input
            id="autresRevenus1"
            type="number"
            value={formData.autresRevenus1 || ''}
            onChange={(e) => handleFieldChange('autresRevenus1', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 5000"
          />
          <p className="text-sm text-gray-600 mt-2">
            Revenus de location, dividendes, travail autonome, etc.
          </p>
        </div>
      </div>
    </div>
  );

  const renderExpensesStep = () => (
    <div className="seniors-form-section">
      <div className="seniors-form-grid">
        <div className="seniors-field">
          <Label htmlFor="logement" className="seniors-label">
            Coûts de logement mensuels *
          </Label>
          <Input
            id="logement"
            type="number"
            value={formData.logement || ''}
            onChange={(e) => handleFieldChange('logement', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 1200"
          />
          <p className="text-sm text-gray-600 mt-2">
            🏠 Hypothèque/loyer, taxes, assurance habitation
          </p>
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="alimentation" className="seniors-label">
            Alimentation mensuelle *
          </Label>
          <Input
            id="alimentation"
            type="number"
            value={formData.alimentation || ''}
            onChange={(e) => handleFieldChange('alimentation', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 400"
          />
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="transport" className="seniors-label">
            Transport mensuel *
          </Label>
          <Input
            id="transport"
            type="number"
            value={formData.transport || ''}
            onChange={(e) => handleFieldChange('transport', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 300"
          />
          <p className="text-sm text-gray-600 mt-2">
            🚗 Auto, essence, transport en commun
          </p>
        </div>
      </div>
    </div>
  );

  const renderSavingsStep = () => (
    <div className="seniors-form-section">
      <div className="seniors-form-grid">
        <div className="seniors-field">
          <Label htmlFor="reer1" className="seniors-label">
            Solde REER actuel
          </Label>
          <Input
            id="reer1"
            type="number"
            value={formData.reer1 || ''}
            onChange={(e) => handleFieldChange('reer1', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 125000"
          />
          <p className="text-sm text-gray-600 mt-2">
            💼 Montant total de vos REER (laissez vide si aucun)
          </p>
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="celi1" className="seniors-label">
            Solde CELI actuel
          </Label>
          <Input
            id="celi1"
            type="number"
            value={formData.celi1 || ''}
            onChange={(e) => handleFieldChange('celi1', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 45000"
          />
          <p className="text-sm text-gray-600 mt-2">
            🎯 Montant total de vos CELI (laissez vide si aucun)
          </p>
        </div>
        
        <div className="seniors-field">
          <Label htmlFor="placements1" className="seniors-label">
            Autres placements/épargnes
          </Label>
          <Input
            id="placements1"
            type="number"
            value={formData.placements1 || ''}
            onChange={(e) => handleFieldChange('placements1', Number(e.target.value))}
            className="seniors-input"
            placeholder="Ex: 25000"
          />
          <p className="text-sm text-gray-600 mt-2">
            📈 Comptes d'épargne, placements non-enregistrés, etc.
          </p>
        </div>
      </div>
    </div>
  );

  const renderBenefitsStep = () => (
    <div className="seniors-form-section">
      <div className="text-center mb-6">
        <Shield size={48} className="mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold mb-2">Prestations gouvernementales</h3>
        <p className="text-gray-600">
          Nous calculons automatiquement vos droits aux prestations canadiennes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🍁 Régime de rentes du Québec (RRQ)</h4>
          <p className="text-sm text-blue-700">
            Calculé automatiquement selon votre âge et vos revenus
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">🏛️ Sécurité de la vieillesse (SV)</h4>
          <p className="text-sm text-green-700">
            Prestation universelle à 65 ans pour les résidents canadiens
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">💝 Supplément de revenu garanti (SRG)</h4>
          <p className="text-sm text-purple-700">
            Aide supplémentaire selon vos revenus de retraite
          </p>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">🏢 Régimes d'employeur</h4>
          <p className="text-sm text-orange-700">
            RREGOP, fonds de pension privés, etc.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="seniors-form-section">
      <div className="text-center mb-6">
        <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold mb-2">🎉 Votre plan de retraite est prêt !</h3>
        <p className="text-gray-600">
          Découvrez vos résultats personnalisés et nos recommandations
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-lg mb-4">📊 Aperçu de vos résultats :</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">✅ Sur la bonne voie</div>
            <p className="text-sm text-gray-600">Statut général de votre retraite</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">🎯 Règle du 4%</div>
            <p className="text-sm text-gray-600">Stratégie de décaissement recommandée</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button
          onClick={() => navigate('/ma-retraite')}
          className="seniors-nav-button seniors-nav-button-primary"
          size="lg"
        >
          Voir mon plan complet →
        </Button>
      </div>
    </div>
  );

  // ===== RENDU PRINCIPAL =====
  if (!navigationContext || !currentAssistantMessage) {
    return (
      <div className="seniors-guided-container">
        <div className="seniors-main-content">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Chargement de votre assistant personnel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{seniorsStyles}</style>
      <div className={`seniors-guided-container ${className}`}>
        <div className="seniors-main-content">
          <div className="seniors-step-card">
            {/* En-tête avec titre et description */}
            <div className="seniors-header">
              <h1 className="seniors-title">{navigationContext.currentStep.title}</h1>
              <p className="seniors-subtitle">{navigationContext.currentStep.description}</p>
            </div>
            
            {/* Barre de progression */}
            <div className="seniors-progress-container">
              <div className="seniors-progress-info">
                <span className="seniors-step-info">
                  Étape {navigationContext.currentStep.stepNumber} sur {navigationContext.currentStep.totalSteps}
                </span>
                <div className="seniors-time-info">
                  <Clock size={16} />
                  <span>{navigationContext.currentStep.estimatedTime}</span>
                </div>
              </div>
              <Progress 
                value={navigationContext.currentStep.currentProgress} 
                className="h-3"
              />
            </div>
            
            {/* Contenu principal */}
            <div className="seniors-content">
              {/* Message de l'assistant */}
              <div className="seniors-assistant-section">
                <div className="seniors-assistant-message">
                  <div className="seniors-assistant-avatar">
                    {currentAssistantMessage.emoji}
                  </div>
                  <div className="seniors-assistant-text">
                    <div className="seniors-assistant-title">
                      Votre assistant financier
                    </div>
                    <div className="seniors-assistant-content">
                      {currentAssistantMessage.message}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contenu de l'étape */}
              {renderStepContent()}
              
              {/* Messages d'erreur */}
              {validationErrors.length > 0 && (
                <div className="seniors-validation-error">
                  <strong>Veuillez corriger les erreurs suivantes :</strong>
                  <ul className="mt-2">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <div className="seniors-navigation">
              <Button
                onClick={handlePrevious}
                disabled={!navigationContext.currentStep.previousStep}
                className="seniors-nav-button seniors-nav-button-secondary"
                size="lg"
              >
                <ArrowLeft className="mr-2" size={18} />
                Précédent
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="seniors-nav-button seniors-nav-button-primary"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    {navigationContext.currentStep.nextSteps.length > 0 ? 'Continuer' : 'Terminer'}
                    <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeniorsGuidedExperience;