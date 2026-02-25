import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SeniorsDashboard } from '../components/SeniorsDashboard';
import SeniorsGuidedExperience from '../components/SeniorsGuidedExperience';
import { useRetirementData } from '../features/retirement/hooks/useRetirementData';
import { FourPercentRuleService } from '../services/FourPercentRuleService';
import { useAuth } from '../hooks/useAuth';
import { checkFeatureAccess } from '../config/plans';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Brain, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp,
  CheckCircle,
  Star,
  Calculator,
  DollarSign,
  ArrowRight,
  Settings,
  Users
} from 'lucide-react';
import { useLanguage } from '../features/retirement/hooks/useLanguage';

export const AssistantFinancier: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { userData } = useRetirementData();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  
  const [showGuidedExperience, setShowGuidedExperience] = useState(false);
  const [fourPercentAnalysis, setFourPercentAnalysis] = useState<any>(null);

  // Vérifier l'accès à l'Assistant financier personnel
  const userPlan = user?.subscription?.plan || 'free';
  const hasAccess = checkFeatureAccess('hasFinancialAssistant', userPlan);

  // Calculer l'analyse de la règle du 4% au chargement
  useEffect(() => {
    try {
      if (userData && Object.keys(userData).length > 0) {
        const analysis = FourPercentRuleService.calculateFourPercentRule(userData);
        setFourPercentAnalysis(analysis);
        
        // Déterminer si l'utilisateur a besoin de l'expérience guidée
        const needsGuidance = !userData.personal?.prenom1 || 
                             !userData.personal?.salaire1 || 
                             (!userData.savings?.reer1 && !userData.savings?.celi1);
        setShowGuidedExperience(needsGuidance);
      } else {
        setShowGuidedExperience(true);
      }
    } catch (error) {
      console.error('Erreur lors du calcul de la règle du 4%:', error);
      setShowGuidedExperience(true);
    }
  }, [userData]);

  // Gestion de la completion de l'expérience guidée
  const handleGuidedExperienceComplete = () => {
    setShowGuidedExperience(false);
    // Recalculer l'analyse après completion
    if (userData) {
      const analysis = FourPercentRuleService.calculateFourPercentRule(userData);
      setFourPercentAnalysis(analysis);
    }
  };

  // Interface simplifiée pour seniors - Expérience guidée
  if (showGuidedExperience) {
    return (
      <SeniorsGuidedExperience
        onComplete={handleGuidedExperienceComplete}
      />
    );
  }

  // Interface simplifiée pour seniors - Tableau de bord principal
  return (
    <div style={{ minHeight: '100vh' }}>
      <SeniorsDashboard />
      
      {/* Message d'information sur l'Assistant */}
      {userData.personal?.prenom1 && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          <Alert className="bg-gradient-to-r from-mpr-interactive-lt to-purple-50 border-mpr-border">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Votre Assistant Financier Intelligent</strong>
              <br />
              🎯 Règle du 4% intégrée
              <br />
              🤖 Conseils personnalisés
              <br />
              📊 Interface optimisée seniors
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AssistantFinancier;