import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';

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
      'statutProfessionnel1', 'salaire1'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = personalData[field as keyof typeof personalData];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const progress = getProgressPercentage();

  // Types de revenus disponibles
  const typesRevenu = [
    { value: 'salaire', label: isFrench ? 'Salaire' : 'Salary' },
    { value: 'assurance-emploi', label: isFrench ? 'Assurance emploi' : 'Employment Insurance' },
    { value: 'rentes', label: isFrench ? 'Rentes' : 'Pensions' },
    { value: 'dividendes', label: isFrench ? 'Dividendes' : 'Dividends' },
    { value: 'revenus-location', label: isFrench ? 'Revenus de location' : 'Rental Income' },
    { value: 'travail-autonome', label: isFrench ? 'Travail autonome' : 'Self-Employment' },
    { value: 'autres', label: isFrench ? 'Autres' : 'Other' }
  ];

  // Types d'emploi disponibles
  const typesEmploi = [
    { value: 'permanent', label: isFrench ? 'Permanent' : 'Permanent' },
    { value: 'partiel', label: isFrench ? 'Temps partiel' : 'Part-time' },
    { value: 'contrat', label: isFrench ? 'Contrat' : 'Contract' },
    { value: 'saisonnier', label: isFrench ? 'Saisonnier' : 'Seasonal' },
    { value: 'autonome', label: isFrench ? 'Travailleur autonome' : 'Self-employed' }
  ];

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

        {/* Formulaire principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Personne 1 - Revenus */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
              <CardTitle className="text-2xl font-bold text-green-300 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                {isFrench ? 'Revenus - Personne 1' : 'Income - Person 1'}
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
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="text"
                      value={formatSalaryInput(userData.personal?.salaire1 || 0)}
                      onChange={(e) => handleSalaryChange('1', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-green-400 focus:ring-green-400"
                      placeholder="0"
                    />
                  </div>
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

                {/* Type d'emploi */}
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

                {/* Informations de contrat (si applicable) */}
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
                      <Input
                        type="date"
                        value={userData.personal?.dateFinContrat1 || ''}
                        onChange={(e) => handleChange('dateFinContrat1', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                      />
                    </div>
                  </>
                )}

                {/* Informations supplémentaires */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Notes supplémentaires' : 'Additional Notes'}
                  </Label>
                  <textarea
                    value={userData.personal?.notesSupplementaires1 || ''}
                    onChange={(e) => handleChange('notesSupplementaires1', e.target.value)}
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
                {isFrench ? 'Revenus - Personne 2' : 'Income - Person 2'}
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
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="text"
                      value={formatSalaryInput(userData.personal?.salaire2 || 0)}
                      onChange={(e) => handleSalaryChange('2', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-emerald-400 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>
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

                {/* Type d'emploi */}
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

                {/* Informations de contrat (si applicable) */}
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
                      <Input
                        type="date"
                        value={userData.personal?.dateFinContrat2 || ''}
                        onChange={(e) => handleChange('dateFinContrat2', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                  </>
                )}

                {/* Informations supplémentaires */}
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Notes supplémentaires' : 'Additional Notes'}
                  </Label>
                  <textarea
                    value={userData.personal?.notesSupplementaires2 || ''}
                    onChange={(e) => handleChange('notesSupplementaires2', e.target.value)}
                    className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400 rounded-md p-3 min-h-[80px]"
                    placeholder={isFrench ? 'Ajoutez des détails sur vos revenus...' : 'Add details about your income...'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Sécurité de la vieillesse */}
        <Card className="bg-gradient-to-br from-purple-800/90 to-pink-800/90 border-0 shadow-2xl backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-purple-600 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
            <CardTitle className="text-2xl font-bold text-purple-300 flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              {isFrench ? 'Sécurité de la vieillesse (SV)' : 'Old Age Security (OAS)'}
            </CardTitle>
            <CardDescription className="text-purple-200">
              {isFrench 
                ? 'Planifiez vos prestations de la Sécurité de la vieillesse pour optimiser vos revenus de retraite'
                : 'Plan your Old Age Security benefits to optimize your retirement income'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personne 1 - SV */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  {userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
                </h3>
                
                <div className="space-y-4">
                  {/* Âge de début de la SV */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {isFrench ? 'Âge de début de la SV' : 'OAS Start Age'}
                    </Label>
                    <Select
                      value={userData.personal?.ageSV1?.toString() || '65'}
                      onValueChange={(value) => handleChange('ageSV1', parseInt(value))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="65">65 ans (standard)</SelectItem>
                        <SelectItem value="66">66 ans (+7.2%)</SelectItem>
                        <SelectItem value="67">67 ans (+14.4%)</SelectItem>
                        <SelectItem value="68">68 ans (+21.6%)</SelectItem>
                        <SelectItem value="69">69 ans (+28.8%)</SelectItem>
                        <SelectItem value="70">70 ans (+36%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400">
                      {isFrench 
                        ? 'Reporter la SV augmente les prestations de 0.6% par mois (7.2% par année)'
                        : 'Deferring OAS increases benefits by 0.6% per month (7.2% per year)'
                      }
                    </p>
                  </div>

                  {/* Montant mensuel estimé */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {isFrench ? 'Montant mensuel estimé' : 'Estimated Monthly Amount'}
                    </Label>
                    <div className="bg-slate-700 border border-slate-600 rounded-md p-3">
                      <div className="text-2xl font-bold text-green-400">
                        ${(() => {
                          const baseSV = 707.68; // Montant maximum SV 2024
                          const age = userData.personal?.ageSV1 || 65;
                          const bonus = age > 65 ? (age - 65) * 0.072 : 0;
                          return Math.round(baseSV * (1 + bonus));
                        })()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isFrench ? 'Par mois (montant maximum)' : 'Per month (maximum amount)'}
                      </div>
                    </div>
                  </div>

                  {/* Statut d'admissibilité */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {isFrench ? 'Statut d\'admissibilité' : 'Eligibility Status'}
                    </Label>
                    <Select
                      value={userData.personal?.statutSV1 || 'admissible'}
                      onValueChange={(value) => handleChange('statutSV1', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="admissible">
                          {isFrench ? 'Admissible (40+ ans au Canada)' : 'Eligible (40+ years in Canada)'}
                        </SelectItem>
                        <SelectItem value="partiel">
                          {isFrench ? 'Admissible partiel (10-39 ans)' : 'Partial eligibility (10-39 years)'}
                        </SelectItem>
                        <SelectItem value="incertain">
                          {isFrench ? 'Incertain' : 'Uncertain'}
                        </SelectItem>
                        <SelectItem value="non-admissible">
                          {isFrench ? 'Non admissible' : 'Not eligible'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Années de résidence au Canada */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {isFrench ? 'Années de résidence au Canada' : 'Years of Residence in Canada'}
                    </Label>
                    <Input
                      type="number"
                      value={userData.personal?.anneesResidenceCanada1 || ''}
                      onChange={(e) => handleChange('anneesResidenceCanada1', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      placeholder="40"
                      min="0"
                      max="80"
                    />
                    <p className="text-xs text-gray-400">
                      {isFrench 
                        ? 'Minimum 10 ans requis. 40 ans pour le montant maximum.'
                        : 'Minimum 10 years required. 40 years for maximum amount.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Personne 2 - SV */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-pink-300 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  {userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
                </h3>
                
                <div className="space-y-4">
                  {/* Âge de début de la SV */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {isFrench ? 'Âge de début de la SV' : 'OAS Start Age'}
                    </Label>
                    <Select
                      value={userData.personal?.ageSV2?.toString() || '65'}
                      onValueChange={(value) => handleChange('ageSV2', parseInt(value))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="65">65 ans (standard)</SelectItem>
                        <SelectItem value="66">66 ans (+7.2%)</SelectItem>
                        <SelectItem value="67">67 ans (+14.4%)</SelectItem>
                        <SelectItem value="68">68 ans (+21.6%)</SelectItem>
                        <SelectItem value="69">69 ans (+28.8%)</SelectItem>
                        <SelectItem value="70">70 ans (+36%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400">
                      {isFrench 
                        ? 'Reporter la SV augmente les prestations de 0.6% par mois (7.2% par année)'
                        : 'Deferring OAS increases benefits by 0.6% per month (7.2% per year)'
                      }
                    </p>
                  </div>

                  {/* Montant mensuel estimé */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {isFrench ? 'Montant mensuel estimé' : 'Estimated Monthly Amount'}
                    </Label>
                    <div className="bg-slate-700 border border-slate-600 rounded-md p-3">
                      <div className="text-2xl font-bold text-green-400">
                        ${(() => {
                          const baseSV = 707.68; // Montant maximum SV 2024
                          const age = userData.personal?.ageSV2 || 65;
                          const bonus = age > 65 ? (age - 65) * 0.072 : 0;
                          return Math.round(baseSV * (1 + bonus));
                        })()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isFrench ? 'Par mois (montant maximum)' : 'Per month (maximum amount)'}
                      </div>
                    </div>
                  </div>

                  {/* Statut d'admissibilité */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {isFrench ? 'Statut d\'admissibilité' : 'Eligibility Status'}
                    </Label>
                    <Select
                      value={userData.personal?.statutSV2 || 'admissible'}
                      onValueChange={(value) => handleChange('statutSV2', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="admissible">
                          {isFrench ? 'Admissible (40+ ans au Canada)' : 'Eligible (40+ years in Canada)'}
                        </SelectItem>
                        <SelectItem value="partiel">
                          {isFrench ? 'Admissible partiel (10-39 ans)' : 'Partial eligibility (10-39 years)'}
                        </SelectItem>
                        <SelectItem value="incertain">
                          {isFrench ? 'Incertain' : 'Uncertain'}
                        </SelectItem>
                        <SelectItem value="non-admissible">
                          {isFrench ? 'Non admissible' : 'Not eligible'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Années de résidence au Canada */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {isFrench ? 'Années de résidence au Canada' : 'Years of Residence in Canada'}
                    </Label>
                    <Input
                      type="number"
                      value={userData.personal?.anneesResidenceCanada2 || ''}
                      onChange={(e) => handleChange('anneesResidenceCanada2', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400"
                      placeholder="40"
                      min="0"
                      max="80"
                    />
                    <p className="text-xs text-gray-400">
                      {isFrench 
                        ? 'Minimum 10 ans requis. 40 ans pour le montant maximum.'
                        : 'Minimum 10 years required. 40 years for maximum amount.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommandations SV */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
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
            </div>
          </CardContent>
        </Card>

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
