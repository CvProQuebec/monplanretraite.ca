import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
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
import { InputSanitizer } from '@/utils/inputSanitizer';

const MonProfil: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  
  // Hook pour les données de retraite
  const { userData, updateUserData } = useRetirementData();
  
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calcul automatique des dépenses mensuelles quand les annuelles changent
  useEffect(() => {
    if (userData.personal?.depensesAnnuelles && userData.personal.depensesAnnuelles > 0) {
      const depensesMensuelles = Math.round(userData.personal.depensesAnnuelles / 12);
      
      // Mettre à jour seulement si les mensuelles ne sont pas déjà calculées
      if (userData.personal.depensesMensuelles !== depensesMensuelles) {
        handleChange('depensesMensuelles', depensesMensuelles);
        console.log(`🔄 Calcul automatique: $${userData.personal.depensesAnnuelles} annuel = $${depensesMensuelles} mensuel`);
      }
    }
  }, [userData.personal?.depensesAnnuelles]);

  const handleChange = (field: string, value: any) => {
    updateUserData('personal', { [field]: value });
  };

  const handleNameChange = (field: string, value: string) => {
    // Apply name sanitization directly for real-time feedback
    const sanitizedValue = InputSanitizer.sanitizeName(value);
    updateUserData('personal', { [field]: sanitizedValue });
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
      {/* Particules de fond visibles */}
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
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {isFrench ? '🚀 Mon profil' : '🚀 My Profile'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Transformez vos informations en planification financière spectaculaire'
              : 'Transform your information into spectacular financial planning'
            }
          </p>
        </div>

        {/* Barre de progression encourageante */}
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-green-200 shadow-lg mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-white">
                  {isFrench ? 'Votre progression' : 'Your progress'}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-400">
                {progress} %
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-300 mt-2 text-center">
              {isFrench 
                ? `Excellent travail ! Vous avez complété ${progress} % de votre profil.`
                : `Great work! You have completed ${progress} % of your profile.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Message d'aide */}
        {showHelp && (
          <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200 mb-8">
            <Info className="h-5 w-5 text-yellow-400" />
            <AlertDescription className="text-lg">
              <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong> {
                isFrench 
                  ? 'Entrez vos noms complets (prénoms composés, noms de famille) pour une personnalisation optimale de vos rapports. Si vous êtes seul(e), laissez la section « Personne 2 » vide. Les montants en dollars n\'incluent pas les centimes pour simplifier la saisie.'
                  : 'Enter your full names (compound first names, last names) for optimal personalization of your reports. If you are single, leave the "Person 2" section empty. Dollar amounts do not include cents to simplify entry.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Formulaire principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Personne 1 */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
              <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                {isFrench ? 'Personne 1' : 'Person 1'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Nom complet' : 'Full Name'}
                  </Label>
                  <Input
                    type="text"
                    value={userData.personal?.prenom1 || ''}
                    onChange={(e) => handleNameChange('prenom1', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    placeholder={isFrench ? 'Ex: Jean Philippe ou Louis-Alexandre Veillette' : 'Ex: John Smith or Mary-Jane Watson'}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {isFrench 
                      ? 'Entrez votre nom complet tel que vous souhaitez qu\'il apparaisse dans vos rapports'
                      : 'Enter your full name as you want it to appear in your reports'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Date de naissance' : 'Date of Birth'}
                  </Label>
                  <DateInput
                    value={userData.personal?.naissance1 || ''}
                    onChange={(value) => handleChange('naissance1', value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Sexe' : 'Gender'}
                  </Label>
                  <Select
                    value={userData.personal?.sexe1 || 'homme'}
                    onValueChange={(value) => handleChange('sexe1', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                      <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                  </Label>
                  <Input
                    type="number"
                    value={userData.personal?.ageRetraiteSouhaite1 || 65}
                    onChange={(e) => handleChange('ageRetraiteSouhaite1', Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    min="50"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personne 2 */}
          <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-indigo-600 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
              <CardTitle className="text-2xl font-bold text-indigo-300 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                {isFrench ? 'Personne 2' : 'Person 2'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Nom complet (optionnel)' : 'Full Name (optional)'}
                  </Label>
                  <Input
                    type="text"
                    value={userData.personal?.prenom2 || ''}
                    onChange={(e) => handleNameChange('prenom2', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
                    placeholder={isFrench ? 'Ex: Marie-Claire Dubois ou Pierre Martin' : 'Ex: Sarah Johnson or Michael Brown'}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {isFrench 
                      ? 'Nom complet du conjoint pour la personnalisation des rapports'
                      : 'Full name of spouse for report personalization'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Date de naissance' : 'Date of Birth'}
                  </Label>
                  <DateInput
                    value={userData.personal?.naissance2 || ''}
                    onChange={(value) => handleChange('naissance2', value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
                    placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Sexe' : 'Gender'}
                  </Label>
                  <Select
                    value={userData.personal?.sexe2 || 'femme'}
                    onValueChange={(value) => handleChange('sexe2', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                      <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                  </Label>
                  <Input
                    type="number"
                    value={userData.personal?.ageRetraiteSouhaite2 || 65}
                    onChange={(e) => handleChange('ageRetraiteSouhaite2', Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
                    min="50"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Bouton SAUVEGARDER - Protection des données ! */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              setIsSaving(true);
              try {
                // Calculer automatiquement les dépenses mensuelles si les annuelles sont renseignées
                if (userData.personal?.depensesRetraite && userData.personal.depensesRetraite > 0) {
                  const depensesMensuelles = Math.round(userData.personal.depensesRetraite / 12);
                  handleChange('depensesMensuelles', depensesMensuelles);
                  console.log(`🔄 Dépenses mensuelles calculées et sauvegardées: $${depensesMensuelles}`);
                }
                
                // Simuler un délai de sauvegarde
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('💾 Données personnelles sauvegardées avec succès');
                
                // Afficher un message de succès
                alert(isFrench ? '✅ Données sauvegardées avec succès !' : '✅ Data saved successfully!');
                
              } catch (error) {
                console.error('❌ Erreur lors de la sauvegarde:', error);
                alert(isFrench ? '❌ Erreur lors de la sauvegarde' : '❌ Error saving data');
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <Save className="w-8 h-8 mr-4 animate-pulse" />
            {isSaving 
              ? (isFrench ? '💾 SAUVEGARDE...' : '💾 SAVING...')
              : (isFrench ? '💾 SAUVEGARDER' : '💾 SAVE')
            }
            <Shield className="w-8 h-8 ml-4 animate-bounce" />
          </Button>
          <p className="text-gray-300 mt-4 text-lg">
            {isFrench 
              ? '✨ Protégez vos données et continuez en toute sécurité!'
              : '✨ Protect your data and continue safely!'
            }
          </p>
        </div>

        {/* Bouton d'aide */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {isFrench ? 'Afficher l\'aide' : 'Show help'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonProfil;
