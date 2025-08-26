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
import SVAdjustmentManager from '@/components/retirement/SVAdjustmentManager';
import { 
  DollarSign, 
  Info, 
  HelpCircle, 
  Calendar, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Save,
  Star,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import MoneyInput from '@/components/ui/MoneyInput';
import AdvancedEIManager from '@/components/ui/AdvancedEIManager';

const Revenus: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  
  // Hook pour les données de retraite
  const { userData, updateUserData } = useRetirementData();
  
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    updateUserData('personal', { [field]: value });
  };

  const handleNotesChange = (field: string, value: string) => {
    // BYPASS sanitization completely for notes fields to preserve spaces and natural typing
    updateUserData('personal', { [field]: value });
  };

  const handleSalaryChange = (person: '1' | '2', value: number) => {
    handleChange(`salaire${person}`, value);
  };

  const getProgressPercentage = () => {
    const personalData = userData.personal;
    if (!personalData) return 0;
    
    const requiredFields = [
      'statutProfessionnel1', 'salaire1'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = personalData[field as keyof typeof personalData];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const progress = getProgressPercentage();

  // Types de revenus disponibles avec métadonnées
  const typesRevenu = [
    { 
      value: 'salaire', 
      label: isFrench ? 'Salaire' : 'Salary',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: true
    },
    { 
      value: 'assurance-emploi', 
      label: isFrench ? 'Assurance emploi' : 'Employment Insurance',
      frequency: 'weekly',
      temporary: true,
      needsEmploymentType: false,
      maxDuration: 45 // semaines maximum
    },
    { 
      value: 'rentes', 
      label: isFrench ? 'Rentes' : 'Pensions',
      frequency: 'monthly',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'dividendes', 
      label: isFrench ? 'Dividendes' : 'Dividends',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'revenus-location', 
      label: isFrench ? 'Revenus de location' : 'Rental Income',
      frequency: 'monthly',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'travail-autonome', 
      label: isFrench ? 'Travail autonome' : 'Self-Employment',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'autres', 
      label: isFrench ? 'Autres' : 'Other',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: false
    }
  ];

  // Types d'emploi disponibles (pour salaires uniquement)
  const typesEmploi = [
    { value: 'permanent', label: isFrench ? 'Permanent' : 'Permanent' },
    { value: 'partiel', label: isFrench ? 'Temps partiel' : 'Part-time' },
    { value: 'contrat', label: isFrench ? 'Contrat' : 'Contract' },
    { value: 'saisonnier', label: isFrench ? 'Saisonnier' : 'Seasonal' },
    { value: 'autonome', label: isFrench ? 'Travailleur autonome' : 'Self-employed' }
  ];

  // Fréquences de paiement
  const frequencesPaiement = [
    { value: 'weekly', label: isFrench ? 'Hebdomadaire' : 'Weekly' },
    { value: 'biweekly', label: isFrench ? 'Aux 2 semaines' : 'Bi-weekly' },
    { value: 'monthly', label: isFrench ? 'Mensuel' : 'Monthly' },
    { value: 'quarterly', label: isFrench ? 'Trimestriel' : 'Quarterly' },
    { value: 'annual', label: isFrench ? 'Annuel' : 'Annual' }
  ];

  // Fonction pour obtenir les métadonnées d'un type de revenu
  const getRevenueTypeMetadata = (typeRevenu: string) => {
    return typesRevenu.find(type => type.value === typeRevenu) || typesRevenu[0];
  };

  // Fonction pour calculer le montant annuel selon la fréquence
  const calculateAnnualAmount = (amount: number, frequency: string) => {
    const multipliers = {
      weekly: 52,
      biweekly: 26,
      monthly: 12,
      quarterly: 4,
      annual: 1
    };
    return amount * (multipliers[frequency as keyof typeof multipliers] || 1);
  };

  // Fonction pour générer des suggestions de planification
  const generatePlanningAdvice = (person: '1' | '2') => {
    const typeRevenu = userData.personal?.[`typeRevenu${person}` as keyof typeof userData.personal] as string;
    const dateFin = userData.personal?.[`dateFinRevenu${person}` as keyof typeof userData.personal] as string;
    const metadata = getRevenueTypeMetadata(typeRevenu);
    
    if (metadata.temporary && dateFin) {
      const endDate = new Date(dateFin);
      const today = new Date();
      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEnd > 0 && daysUntilEnd <= 365) {
        return {
          type: 'transition',
          message: isFrench 
            ? `Votre ${metadata.label.toLowerCase()} se termine dans ${daysUntilEnd} jours. Considérez demander votre RRQ le ${new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-CA')}.`
            : `Your ${metadata.label.toLowerCase()} ends in ${daysUntilEnd} days. Consider applying for CPP on ${new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-CA')}.`,
          urgency: daysUntilEnd <= 90 ? 'high' : 'medium'
        };
      }
    }
    
    return null;
  };

  // Statuts professionnels
  const statutsProfessionnels = [
    { value: 'actif', label: isFrench ? 'Actif' : 'Active' },
    { value: 'sans-emploi', label: isFrench ? 'Sans emploi' : 'Unemployed' },
    { value: 'retraite', label: isFrench ? 'À la retraite' : 'Retired' },
    { value: 'conge-maladie', label: isFrench ? 'Congé maladie' : 'Sick Leave' },
    { value: 'conge-parental', label: isFrench ? 'Congé parental' : 'Parental Leave' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-lime-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-teal-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-2xl">
            {isFrench ? '💰 Mes revenus' : '💰 My Income'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Gérez vos sources de revenus pour optimiser votre planification de retraite'
              : 'Manage your income sources to optimize your retirement planning'
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
                  {isFrench ? 'Progression des revenus' : 'Income progress'}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-400">
                {progress} %
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-300 mt-2 text-center">
              {isFrench 
                ? `Excellent ! Vous avez complété ${progress} % de vos informations de revenus.`
                : `Great! You have completed ${progress} % of your income information.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Message d'aide */}
        {showHelp && (
          <Alert className="border-green-400 bg-green-900/20 text-green-200 mb-8">
            <Info className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-lg">
              <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong> {
                isFrench 
                  ? 'Renseignez toutes vos sources de revenus pour une planification précise. Ces informations sont cruciales pour les calculs de retraite et remplacent les informations de salaire du profil.'
                  : 'Fill in all your income sources for accurate planning. This information is crucial for retirement calculations and replaces the salary information from the profile.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Section Assurance Emploi Avancée */}
        {((userData.personal?.typeRevenu1 === 'assurance-emploi' && userData.personal?.naissance1) || 
          (userData.personal?.typeRevenu2 === 'assurance-emploi' && userData.personal?.naissance2)) && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-300 mb-4 flex items-center justify-center gap-3">
                <Calculator className="w-8 h-8 text-indigo-400" />
                {isFrench ? 'Analyse Avancée - Assurance Emploi' : 'Advanced Analysis - Employment Insurance'}
              </h2>
              <p className="text-indigo-200 text-lg">
                {isFrench 
                  ? 'Calculateur intelligent pour optimiser votre transition vers la retraite'
                  : 'Smart calculator to optimize your transition to retirement'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {userData.personal?.typeRevenu1 === 'assurance-emploi' && userData.personal?.naissance1 && (
                <AdvancedEIManager
                  personNumber={1}
                  personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
                  birthDate={userData.personal.naissance1}
                  onDataChange={(data) => {
                    updateUserData('personal', { advancedEI1: data });
                  }}
                  isFrench={isFrench}
                />
              )}
              
              {userData.personal?.typeRevenu2 === 'assurance-emploi' && userData.personal?.naissance2 && (
                <AdvancedEIManager
                  personNumber={2}
                  personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
                  birthDate={userData.personal.naissance2}
                  onDataChange={(data) => {
                    updateUserData('personal', { advancedEI2: data });
                  }}
                  isFrench={isFrench}
                />
              )}
            </div>
          </div>
        )}

        {/* Formulaire principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Personne 1 - Revenus */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
              <CardTitle className="text-2xl font-bold text-green-300 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                {userData.personal?.prenom1 
                  ? `${isFrench ? 'Revenus' : 'Income'} - ${userData.personal.prenom1}`
                  : (isFrench ? 'Revenus - Personne 1' : 'Income - Person 1')
                }
              </CardTitle>
              <CardDescription className="text-green-200">
                {userData.personal?.prenom1 || (isFrench ? 'Première personne' : 'First person')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Statut professionnel */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {isFrench ? 'Statut professionnel' : 'Professional Status'}
                  </Label>
                  <Select
                    value={userData.personal?.statutProfessionnel1 || 'actif'}
                    onValueChange={(value) => handleChange('statutProfessionnel1', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {statutsProfessionnels.map(statut => (
                        <SelectItem key={statut.value} value={statut.value}>
                          {statut.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Revenu annuel */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {isFrench ? 'Revenu annuel' : 'Annual Income'}
                  </Label>
                  <MoneyInput
                    value={userData.personal?.salaire1 || 0}
                    onChange={(value) => handleSalaryChange('1', value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                    placeholder={isFrench ? "Ex: 75 000 ou 75 000,50" : "Ex: 75,000 or 75,000.50"}
                    allowDecimals={true}
                  />
                </div>

                {/* Type de revenu */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {isFrench ? 'Type de revenu' : 'Income Type'}
                  </Label>
                  <Select
                    value={userData.personal?.typeRevenu1 || 'salaire'}
                    onValueChange={(value) => handleChange('typeRevenu1', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {typesRevenu.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Champs adaptatifs selon le type de revenu */}
                {(() => {
                  const currentTypeRevenu = userData.personal?.typeRevenu1 || 'salaire';
                  const metadata = getRevenueTypeMetadata(currentTypeRevenu);
                  
                  return (
                    <>
                      {/* Type d'emploi (seulement pour salaires) */}
                      {metadata.needsEmploymentType && (
                        <div className="space-y-2">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {isFrench ? 'Type d\'emploi' : 'Employment Type'}
                          </Label>
                          <Select
                            value={userData.personal?.typeEmploi1 || 'permanent'}
                            onValueChange={(value) => handleChange('typeEmploi1', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {typesEmploi.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Fréquence de paiement (pour revenus non-salariaux) */}
                      {!metadata.needsEmploymentType && (
                        <div className="space-y-2">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {isFrench ? 'Fréquence de paiement' : 'Payment Frequency'}
                          </Label>
                          <Select
                            value={userData.personal?.[`frequencePaiement1`] || metadata.frequency}
                            onValueChange={(value) => handleChange('frequencePaiement1', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {frequencesPaiement.map(freq => (
                                <SelectItem key={freq.value} value={freq.value}>
                                  {freq.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Date de fin pour revenus temporaires */}
                      {metadata.temporary && (
                        <div className="space-y-2">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {currentTypeRevenu === 'assurance-emploi' 
                              ? (isFrench ? 'Prend fin le (ou vers le)' : 'Ends on (or around)')
                              : (isFrench ? 'Date de fin' : 'End Date')
                            }
                          </Label>
                          <DateInput
                            value={userData.personal?.dateFinRevenu1 || ''}
                            onChange={(value) => handleChange('dateFinRevenu1', value)}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                            placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                          />
                          {currentTypeRevenu === 'assurance-emploi' && (
                            <p className="text-xs text-yellow-300 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {isFrench 
                                ? `Maximum ${metadata.maxDuration} semaines selon l'admissibilité`
                                : `Maximum ${metadata.maxDuration} weeks based on eligibility`
                              }
                            </p>
                          )}
                        </div>
                      )}

                      {/* Informations de contrat (pour emplois contractuels) */}
                      {userData.personal?.typeEmploi1 === 'contrat' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-gray-200 font-semibold flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {isFrench ? 'Durée du contrat (mois)' : 'Contract Duration (months)'}
                            </Label>
                            <Input
                              type="number"
                              value={userData.personal?.dureeContrat1 || ''}
                              onChange={(e) => handleChange('dureeContrat1', Number(e.target.value))}
                              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                              placeholder="12"
                              min="1"
                              max="120"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-200 font-semibold flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {isFrench ? 'Date de fin de contrat' : 'Contract End Date'}
                            </Label>
                            <DateInput
                              value={userData.personal?.dateFinContrat1 || ''}
                              onChange={(value) => handleChange('dateFinContrat1', value)}
                              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                              placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                            />
                          </div>
                        </>
                      )}

                      {/* Suggestions de planification */}
                      {(() => {
                        const advice = generatePlanningAdvice('1');
                        if (advice) {
                          return (
                            <Alert className={`border-${advice.urgency === 'high' ? 'red' : 'yellow'}-400 bg-${advice.urgency === 'high' ? 'red' : 'yellow'}-900/20 text-${advice.urgency === 'high' ? 'red' : 'yellow'}-200`}>
                              <AlertTriangle className={`h-4 w-4 text-${advice.urgency === 'high' ? 'red' : 'yellow'}-400`} />
                              <AlertDescription className="text-sm">
                                <strong>{isFrench ? 'Suggestion de planification :' : 'Planning Suggestion:'}</strong><br />
                                {advice.message}
                              </AlertDescription>
                            </Alert>
                          );
                        }
                        return null;
                      })()}
                    </>
                  );
                })()}

                {/* Informations supplémentaires */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Notes supplémentaires' : 'Additional Notes'}
                  </Label>
                  <textarea
                    value={userData.personal?.notesSupplementaires1 || ''}
                    onChange={(e) => handleNotesChange('notesSupplementaires1', e.target.value)}
                    className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400 rounded-md p-3 min-h-[80px]"
                    placeholder={isFrench ? 'Ajoutez des détails sur vos revenus...' : 'Add details about your income...'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personne 2 - Revenus */}
          <Card className="bg-gradient-to-br from-emerald-800/90 to-teal-800/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-emerald-600 bg-gradient-to-r from-emerald-600/20 to-teal-600/20">
              <CardTitle className="text-2xl font-bold text-emerald-300 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                {userData.personal?.prenom2 
                  ? `${isFrench ? 'Revenus' : 'Income'} - ${userData.personal.prenom2}`
                  : (isFrench ? 'Revenus - Personne 2' : 'Income - Person 2')
                }
              </CardTitle>
              <CardDescription className="text-emerald-200">
                {userData.personal?.prenom2 || (isFrench ? 'Deuxième personne (optionnel)' : 'Second person (optional)')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Statut professionnel */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {isFrench ? 'Statut professionnel' : 'Professional Status'}
                  </Label>
                  <Select
                    value={userData.personal?.statutProfessionnel2 || 'actif'}
                    onValueChange={(value) => handleChange('statutProfessionnel2', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {statutsProfessionnels.map(statut => (
                        <SelectItem key={statut.value} value={statut.value}>
                          {statut.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Revenu annuel */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {isFrench ? 'Revenu annuel' : 'Annual Income'}
                  </Label>
                  <MoneyInput
                    value={userData.personal?.salaire2 || 0}
                    onChange={(value) => handleSalaryChange('2', value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                    placeholder={isFrench ? "Ex: 75 000 ou 75 000,50" : "Ex: 75,000 or 75,000.50"}
                    allowDecimals={true}
                  />
                </div>

                {/* Type de revenu */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {isFrench ? 'Type de revenu' : 'Income Type'}
                  </Label>
                  <Select
                    value={userData.personal?.typeRevenu2 || 'salaire'}
                    onValueChange={(value) => handleChange('typeRevenu2', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {typesRevenu.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Champs adaptatifs selon le type de revenu */}
                {(() => {
                  const currentTypeRevenu = userData.personal?.typeRevenu2 || 'salaire';
                  const metadata = getRevenueTypeMetadata(currentTypeRevenu);
                  
                  return (
                    <>
                      {/* Type d'emploi (seulement pour salaires) */}
                      {metadata.needsEmploymentType && (
                        <div className="space-y-2">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {isFrench ? 'Type d\'emploi' : 'Employment Type'}
                          </Label>
                          <Select
                            value={userData.personal?.typeEmploi2 || 'permanent'}
                            onValueChange={(value) => handleChange('typeEmploi2', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {typesEmploi.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Fréquence de paiement (pour revenus non-salariaux) */}
                      {!metadata.needsEmploymentType && (
                        <div className="space-y-2">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {isFrench ? 'Fréquence de paiement' : 'Payment Frequency'}
                          </Label>
                          <Select
                            value={userData.personal?.[`frequencePaiement2`] || metadata.frequency}
                            onValueChange={(value) => handleChange('frequencePaiement2', value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {frequencesPaiement.map(freq => (
                                <SelectItem key={freq.value} value={freq.value}>
                                  {freq.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Date de fin pour revenus temporaires */}
                      {metadata.temporary && (
                        <div className="space-y-2">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {currentTypeRevenu === 'assurance-emploi' 
                              ? (isFrench ? 'Prend fin le (ou vers le)' : 'Ends on (or around)')
                              : (isFrench ? 'Date de fin' : 'End Date')
                            }
                          </Label>
                          <DateInput
                            value={userData.personal?.dateFinRevenu2 || ''}
                            onChange={(value) => handleChange('dateFinRevenu2', value)}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                            placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                          />
                          {currentTypeRevenu === 'assurance-emploi' && (
                            <p className="text-xs text-yellow-300 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {isFrench 
                                ? `Maximum ${metadata.maxDuration} semaines selon l'admissibilité`
                                : `Maximum ${metadata.maxDuration} weeks based on eligibility`
                              }
                            </p>
                          )}
                        </div>
                      )}

                      {/* Informations de contrat (pour emplois contractuels) */}
                      {userData.personal?.typeEmploi2 === 'contrat' && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-gray-200 font-semibold flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {isFrench ? 'Durée du contrat (mois)' : 'Contract Duration (months)'}
                            </Label>
                            <Input
                              type="number"
                              value={userData.personal?.dureeContrat2 || ''}
                              onChange={(e) => handleChange('dureeContrat2', Number(e.target.value))}
                              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                              placeholder="12"
                              min="1"
                              max="120"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-200 font-semibold flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {isFrench ? 'Date de fin de contrat' : 'Contract End Date'}
                            </Label>
                            <DateInput
                              value={userData.personal?.dateFinContrat2 || ''}
                              onChange={(value) => handleChange('dateFinContrat2', value)}
                              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                              placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                            />
                          </div>
                        </>
                      )}

                      {/* Suggestions de planification */}
                      {(() => {
                        const advice = generatePlanningAdvice('2');
                        if (advice) {
                          return (
                            <Alert className={`border-${advice.urgency === 'high' ? 'red' : 'yellow'}-400 bg-${advice.urgency === 'high' ? 'red' : 'yellow'}-900/20 text-${advice.urgency === 'high' ? 'red' : 'yellow'}-200`}>
                              <AlertTriangle className={`h-4 w-4 text-${advice.urgency === 'high' ? 'red' : 'yellow'}-400`} />
                              <AlertDescription className="text-sm">
                                <strong>{isFrench ? 'Suggestion de planification :' : 'Planning Suggestion:'}</strong><br />
                                {advice.message}
                              </AlertDescription>
                            </Alert>
                          );
                        }
                        return null;
                      })()}
                    </>
                  );
                })()}

                {/* Informations supplémentaires */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Notes supplémentaires' : 'Additional Notes'}
                  </Label>
                  <textarea
                    value={userData.personal?.notesSupplementaires2 || ''}
                    onChange={(e) => handleNotesChange('notesSupplementaires2', e.target.value)}
                    className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400 rounded-md p-3 min-h-[80px]"
                    placeholder={isFrench ? 'Ajoutez des détails sur vos revenus...' : 'Add details about your income...'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Sécurité de la vieillesse avec ajustements */}
        <div className="space-y-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-300 mb-4 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              {isFrench ? 'Sécurité de la vieillesse (SV)' : 'Old Age Security (OAS)'}
            </h2>
            <p className="text-purple-200 text-lg">
              {isFrench 
                ? 'Gérez vos prestations réelles avec les ajustements par période'
                : 'Manage your actual benefits with period-specific adjustments'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personne 1 - Ajustements SV */}
            <SVAdjustmentManager
              personNumber={1}
              personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
              adjustments={userData.retirement?.svAjustements1 || []}
              onAdjustmentsChange={(adjustments) => {
                updateUserData('retirement', { svAjustements1: adjustments });
              }}
              isFrench={isFrench}
            />

            {/* Personne 2 - Ajustements SV */}
            <SVAdjustmentManager
              personNumber={2}
              personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
              adjustments={userData.retirement?.svAjustements2 || []}
              onAdjustmentsChange={(adjustments) => {
                updateUserData('retirement', { svAjustements2: adjustments });
              }}
              isFrench={isFrench}
            />
          </div>

          {/* Recommandations SV */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {isFrench ? 'Recommandations pour la SV' : 'OAS Recommendations'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <strong className="text-purple-300">{isFrench ? 'Stratégie optimale :' : 'Optimal Strategy:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Reporter si revenus élevés (récupération fiscale)' : 'Defer if high income (tax clawback)'}</li>
                    <li>{isFrench ? 'Commencer à 65 ans si revenus modestes' : 'Start at 65 if modest income'}</li>
                    <li>{isFrench ? 'Considérer l\'espérance de vie' : 'Consider life expectancy'}</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-pink-300">{isFrench ? 'Points importants :' : 'Important Points:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Récupération si revenu > 90 997$ (2024)' : 'Clawback if income > $90,997 (2024)'}</li>
                    <li>{isFrench ? 'Demande automatique à 64 ans' : 'Automatic application at 64'}</li>
                    <li>{isFrench ? 'Indexée à l\'inflation' : 'Indexed to inflation'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé des revenus */}
        <Card className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 border-0 shadow-2xl backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-blue-600 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
            <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-400" />
              {isFrench ? 'Résumé des revenus' : 'Income Summary'}
            </CardTitle>
            <CardDescription className="text-blue-200">
              {isFrench 
                ? 'Vue d\'ensemble de vos revenus pour la planification de retraite'
                : 'Overview of your income for retirement planning'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  ${((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Revenus d\'emploi annuels' : 'Annual Employment Income'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  ${(() => {
                    const baseSV = 707.68;
                    const ageSV1 = userData.personal?.ageSV1 || 65;
                    const ageSV2 = userData.personal?.ageSV2 || 65;
                    const bonus1 = ageSV1 > 65 ? (ageSV1 - 65) * 0.072 : 0;
                    const bonus2 = ageSV2 > 65 ? (ageSV2 - 65) * 0.072 : 0;
                    const sv1 = Math.round(baseSV * (1 + bonus1)) * 12;
                    const sv2 = Math.round(baseSV * (1 + bonus2)) * 12;
                    return (sv1 + sv2).toLocaleString();
                  })()}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'SV annuelle estimée' : 'Estimated Annual OAS'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  ${(() => {
                    const emploi = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
                    const baseSV = 707.68;
                    const ageSV1 = userData.personal?.ageSV1 || 65;
                    const ageSV2 = userData.personal?.ageSV2 || 65;
                    const bonus1 = ageSV1 > 65 ? (ageSV1 - 65) * 0.072 : 0;
                    const bonus2 = ageSV2 > 65 ? (ageSV2 - 65) * 0.072 : 0;
                    const sv1 = Math.round(baseSV * (1 + bonus1)) * 12;
                    const sv2 = Math.round(baseSV * (1 + bonus2)) * 12;
                    const total = emploi + sv1 + sv2;
                    return Math.round(total / 12).toLocaleString();
                  })()}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Revenus mensuels totaux' : 'Total Monthly Income'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {userData.personal?.statutProfessionnel1 === 'actif' || userData.personal?.statutProfessionnel2 === 'actif' ? '✅' : '⚠️'}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Statut d\'activité' : 'Activity Status'}
                </div>
              </div>
            </div>

            {/* Alertes importantes */}
            {(userData.personal?.typeEmploi1 === 'contrat' || userData.personal?.typeEmploi2 === 'contrat') && (
              <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200 mt-6">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <AlertDescription>
                  <strong>{isFrench ? 'Attention :' : 'Warning:'}</strong> {
                    isFrench 
                      ? 'Vous avez des revenus contractuels. Assurez-vous de planifier la transition après la fin du contrat.'
                      : 'You have contract income. Make sure to plan for the transition after the contract ends.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Bouton SAUVEGARDER */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              setIsSaving(true);
              try {
                // Simuler un délai de sauvegarde
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('💾 Données de revenus sauvegardées avec succès');
                
                // Afficher un message de succès
                alert(isFrench ? '✅ Revenus sauvegardés avec succès !' : '✅ Income data saved successfully!');
                
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
              ? '✨ Vos informations de revenus sont sécurisées!'
              : '✨ Your income information is secure!'
            }
          </p>
        </div>

        {/* Bouton d'aide */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {isFrench ? 'Afficher l\'aide' : 'Show help'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Revenus;
