import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  Info, 
  HelpCircle, 
  Calendar, 
  DollarSign, 
  Target, 
  Rocket, 
  Sparkles, 
  Brain, 
  Shield, 
  Zap, 
  Save,
  User,
  Star,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';

const MyProfile: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  
  // Hook for retirement data
  const { userData, updateUserData } = useRetirementData();
  
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Automatic calculation of monthly expenses when annual expenses change
  useEffect(() => {
    if (userData.personal?.depensesAnnuelles && userData.personal.depensesAnnuelles > 0) {
      const depensesMensuelles = Math.round(userData.personal.depensesAnnuelles / 12);
      
      // Update only if monthly expenses are not already calculated
      if (userData.personal.depensesMensuelles !== depensesMensuelles) {
        handleChange('depensesMensuelles', depensesMensuelles);
        console.log(`🔄 Automatic calculation: $${userData.personal.depensesAnnuelles} annual = $${depensesMensuelles} monthly`);
      }
    }
  }, [userData.personal?.depensesAnnuelles]);

  const handleChange = (field: string, value: any) => {
    updateUserData('personal', { [field]: value });
  };

  const handleSalaryChange = (person: '1' | '2', value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
    handleChange(`salaire${person}`, numericValue);
  };

  const formatSalaryInput = (value: number): string => {
    return value > 0 ? formatCurrency(value, { showCents: false }) : '';
  };

  const getProgressPercentage = () => {
    const personalData = userData.personal;
    if (!personalData) return 0;
    
    const requiredFields = [
      'prenom1', 'naissance1', 'sexe1', 'salaire1', 'statutProfessionnel1', 
      'ageRetraiteSouhaite1', 'depensesRetraite'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = personalData[field as keyof typeof personalData];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const progress = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Visible background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header with progress */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
              {isFrench ? '🚀 Mon profil' : '🚀 My Profile'}
            </h1>
          </div>
          
          {/* Progress indicator */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-300">
                {isFrench ? 'Progression du profil' : 'Profile progress'}
              </span>
              <span className="text-2xl font-bold text-yellow-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {isFrench 
                ? `${progress}% des informations de base complétées`
                : `${progress}% of basic information completed`
              }
            </p>
          </div>
        </div>

        {/* Help button */}
        <div className="flex justify-end mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {isFrench ? 'Aide' : 'Help'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFrench ? 'Cliquez pour afficher l\'aide' : 'Click to show help'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Help section */}
        {showHelp && (
          <Alert className="mb-8 border-yellow-500/30 bg-yellow-500/10">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              {isFrench 
                ? 'Remplissez au moins les informations de base pour débloquer toutes les fonctionnalités. Plus vous complétez, plus nous pouvons vous aider efficacement !'
                : 'Fill in at least the basic information to unlock all features. The more you complete, the more effectively we can help you!'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left column - Personal information */}
          <div className="space-y-6">
            
            {/* Personal information card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-yellow-400">
                  <Users className="w-6 h-6" />
                  {isFrench ? 'Informations personnelles' : 'Personal Information'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isFrench 
                    ? 'Vos informations de base pour personnaliser votre expérience'
                    : 'Your basic information to personalize your experience'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Person 1 */}
                <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {isFrench ? 'Personne principale' : 'Primary person'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom1" className="text-gray-300">
                        {isFrench ? 'Prénom' : 'First name'}
                      </Label>
                      <Input
                        id="prenom1"
                        value={userData.personal?.prenom1 || ''}
                        onChange={(e) => handleChange('prenom1', e.target.value)}
                        placeholder={isFrench ? 'Votre prénom' : 'Your first name'}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="naissance1" className="text-gray-300">
                        {isFrench ? 'Date de naissance' : 'Date of birth'}
                      </Label>
                      <Input
                        id="naissance1"
                        type="date"
                        value={userData.personal?.naissance1 || ''}
                        onChange={(e) => handleChange('naissance1', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sexe1" className="text-gray-300">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe1 || ''}
                        onValueChange={(value) => handleChange('sexe1', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                          <SelectItem value="autre">{isFrench ? 'Autre' : 'Other'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="ageRetraiteSouhaite1" className="text-gray-300">
                        {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                      </Label>
                      <Input
                        id="ageRetraiteSouhaite1"
                        type="number"
                        min="50"
                        max="80"
                        value={userData.personal?.ageRetraiteSouhaite1 || ''}
                        onChange={(e) => handleChange('ageRetraiteSouhaite1', parseInt(e.target.value) || 0)}
                        placeholder="65"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Person 2 (optional) */}
                <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {isFrench ? 'Conjoint(e) (optionnel)' : 'Spouse (optional)'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom2" className="text-gray-300">
                        {isFrench ? 'Prénom' : 'First name'}
                      </Label>
                      <Input
                        id="prenom2"
                        value={userData.personal?.prenom2 || ''}
                        onChange={(e) => handleChange('prenom2', e.target.value)}
                        placeholder={isFrench ? 'Prénom du conjoint' : 'Spouse\'s first name'}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="naissance2" className="text-gray-300">
                        {isFrench ? 'Date de naissance' : 'Date of birth'}
                      </Label>
                      <Input
                        id="naissance2"
                        type="date"
                        value={userData.personal?.naissance2 || ''}
                        onChange={(e) => handleChange('naissance2', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sexe2" className="text-gray-300">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe2 || ''}
                        onValueChange={(value) => handleChange('sexe2', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                          <SelectItem value="autre">{isFrench ? 'Autre' : 'Other'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="ageRetraiteSouhaite2" className="text-gray-300">
                        {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                      </Label>
                      <Input
                        id="ageRetraiteSouhaite2"
                        type="number"
                        min="50"
                        max="80"
                        value={userData.personal?.ageRetraiteSouhaite2 || ''}
                        onChange={(e) => handleChange('ageRetraiteSouhaite2', parseInt(e.target.value) || 0)}
                        placeholder="65"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial objectives card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-400">
                  <Target className="w-6 h-6" />
                  {isFrench ? 'Objectifs financiers' : 'Financial Objectives'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isFrench 
                    ? 'Définissez vos objectifs de retraite'
                    : 'Define your retirement goals'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="depensesRetraite" className="text-gray-300">
                    {isFrench ? 'Dépenses annuelles souhaitées à la retraite' : 'Desired annual expenses at retirement'}
                  </Label>
                  <Input
                    id="depensesRetraite"
                    type="number"
                    min="0"
                    step="1000"
                    value={userData.personal?.depensesRetraite || ''}
                    onChange={(e) => handleChange('depensesRetraite', parseFloat(e.target.value) || 0)}
                    placeholder="50000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    {isFrench 
                      ? 'Montant annuel pour maintenir votre niveau de vie'
                      : 'Annual amount to maintain your standard of living'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Additional information */}
          <div className="space-y-6">
            
            {/* Professional status card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-400">
                  <Brain className="w-6 h-6" />
                  {isFrench ? 'Statut professionnel' : 'Professional Status'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isFrench 
                    ? 'Informations sur votre carrière et vos revenus'
                    : 'Information about your career and income'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Person 1 professional info */}
                <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-300">
                    {isFrench ? 'Personne principale' : 'Primary person'}
                  </h3>
                  
                  <div>
                    <Label htmlFor="statutProfessionnel1" className="text-gray-300">
                      {isFrench ? 'Statut professionnel' : 'Professional status'}
                    </Label>
                    <Select
                      value={userData.personal?.statutProfessionnel1 || ''}
                      onValueChange={(value) => handleChange('statutProfessionnel1', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="salarie">{isFrench ? 'Salarié' : 'Employee'}</SelectItem>
                        <SelectItem value="travailleur_autonome">{isFrench ? 'Travailleur autonome' : 'Self-employed'}</SelectItem>
                        <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                        <SelectItem value="etudiant">{isFrench ? 'Étudiant' : 'Student'}</SelectItem>
                        <SelectItem value="autre">{isFrench ? 'Autre' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Person 2 professional info */}
                <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-300">
                    {isFrench ? 'Conjoint(e)' : 'Spouse'}
                  </h3>
                  
                  <div>
                    <Label htmlFor="statutProfessionnel2" className="text-gray-300">
                      {isFrench ? 'Statut professionnel' : 'Professional status'}
                    </Label>
                    <Select
                      value={userData.personal?.statutProfessionnel2 || ''}
                      onValueChange={(value) => handleChange('statutProfessionnel2', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="salarie">{isFrench ? 'Salarié' : 'Employee'}</SelectItem>
                        <SelectItem value="travailleur_autonome">{isFrench ? 'Travailleur autonome' : 'Self-employed'}</SelectItem>
                        <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                        <SelectItem value="etudiant">{isFrench ? 'Étudiant' : 'Student'}</SelectItem>
                        <SelectItem value="autre">{isFrench ? 'Autre' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Learning card */}
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-400">
                  <Sparkles className="w-6 h-6" />
                  {isFrench ? 'Apprentissage IA' : 'AI Learning'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {isFrench 
                    ? 'Améliorez votre expérience avec l\'intelligence artificielle'
                    : 'Improve your experience with artificial intelligence'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-purple-300">
                      {isFrench ? 'Apprentissage automatique' : 'Automatic learning'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {isFrench 
                        ? 'L\'IA apprend de vos préférences'
                        : 'AI learns from your preferences'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">
                      {isFrench ? 'Actif' : 'Active'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-purple-300">
                      {isFrench ? 'Recommandations personnalisées' : 'Personalized recommendations'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {isFrench 
                        ? 'Suggestions adaptées à votre profil'
                        : 'Suggestions adapted to your profile'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">
                      {isFrench ? 'Actif' : 'Active'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save button */}
            <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setIsSaving(true);
                      setTimeout(() => setIsSaving(false), 2000);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Save className="w-5 h-5 mr-2 animate-spin" />
                        {isFrench ? 'Sauvegarde...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {isFrench ? 'Sauvegarder' : 'Save'}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    {isFrench 
                      ? 'Vos données sont automatiquement sauvegardées'
                      : 'Your data is automatically saved'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={() => navigate('/en/retirement-module')}
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 px-8 py-3"
          >
            <Rocket className="w-5 h-5 mr-2" />
            {isFrench ? 'Continuer vers la planification' : 'Continue to planning'}
          </Button>
          
          <Button
            onClick={() => navigate('/en')}
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20 px-8 py-3"
          >
            <Home className="w-5 h-5 mr-2" />
            {isFrench ? 'Retour à l\'accueil' : 'Back to home'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
