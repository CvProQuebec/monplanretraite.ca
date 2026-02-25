// src/features/retirement/sections/PersonalDataSection.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Info, HelpCircle, Calendar, DollarSign, Target, Rocket, Sparkles, Brain, Shield, Zap, Save } from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { HelpTooltip, FieldHelp } from '../components/HelpTooltip';
import { CustomBirthDateInput } from '../components/CustomBirthDateInput';
import { useToast } from '@/hooks/use-toast';

interface PersonalDataSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  data, 
  onUpdate
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const { toast } = useToast();
  
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  // Calcul automatique des dépenses mensuelles quand les annuelles changent
  useEffect(() => {
    if (data.personal?.depensesAnnuelles && data.personal.depensesAnnuelles > 0) {
      const depensesMensuelles = Math.round(data.personal.depensesAnnuelles / 12);
      
      // Mettre à jour seulement si les mensuelles ne sont pas déjà calculées
      if (data.personal.depensesMensuelles !== depensesMensuelles) {
        handleChange('depensesMensuelles', depensesMensuelles);
        console.log(`🔄 Calcul automatique: $${data.personal.depensesAnnuelles} annuel = $${depensesMensuelles} mensuel`);
      }
    }
  }, [data.personal?.depensesAnnuelles]);

  const handleChange = (field: string, value: any) => {
    // Logique spéciale pour synchroniser les dépenses retraite
    if (field === 'depensesMensuelles') {
      const mens = Number(value) || 0;
      onUpdate('personal', { depensesMensuelles: mens, depensesRetraite: mens });
      return;
    }
    if (field === 'depensesAnnuelles') {
      const ann = Number(value) || 0;
      const mens = Math.round(ann / 12);
      onUpdate('personal', { depensesAnnuelles: ann, depensesMensuelles: mens, depensesRetraite: mens });
      return;
    }
    onUpdate('personal', { [field]: value });
  };

  const handleSalaryChange = (person: '1' | '2', value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
    handleChange(`salaire${person}`, numericValue);
  };

  const formatSalaryInput = (value: number): string => {
    return value > 0 ? formatCurrency(value, { showCents: false }) : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-mpr-navy text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-mpr-interactive rounded-full animate-bounce"></div>
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
            {isFrench ? '🚀 Données personnelles avancées' : '🚀 Advanced Personal Data'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Transformez vos informations en planification financière spectaculaire'
              : 'Transform your information into spectacular financial planning'
            }
          </p>
        </div>

        {/* Message d'aide */}
        {showHelp && (
          <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200 mb-8">
            <Info className="h-5 w-5 text-yellow-400" />
            <AlertDescription className="text-lg">
              <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong> {
                isFrench 
                  ? 'Remplissez les informations pour chaque personne. Si vous êtes seul(e), laissez la section « Personne 2 » vide. Les montants en dollars n\'incluent pas les centimes pour simplifier la saisie.'
                  : 'Fill in the information for each person. If you are single, leave the "Person 2" section empty. Dollar amounts do not include cents to simplify entry.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Formulaire principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Personne 1 */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-mpr-interactive/20 to-purple-600/20">
              <CardTitle className="text-2xl font-bold text-mpr-interactive flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-mpr-interactive to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                {isFrench ? 'Personne 1' : 'Person 1'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Prénom' : 'First Name'}
                  </Label>
                  <Input
                    type="text"
                    value={data.personal?.prenom1 || ''}
                    onChange={(e) => handleChange('prenom1', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-mpr-interactive focus:ring-mpr-interactive"
                    placeholder={isFrench ? 'Prénom' : 'First Name'}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Date de naissance' : 'Date of Birth'}
                  </Label>
                  <CustomBirthDateInput
                    id="naissance1"
                    label={isFrench ? 'Date de naissance' : 'Date of Birth'}
                    value={data.personal?.naissance1}
                    onChange={(date) => handleChange('naissance1', date)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Sexe' : 'Gender'}
                  </Label>
                  <Select
                    value={data.personal?.sexe1 || 'homme'}
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
                    {isFrench ? 'Statut professionnel' : 'Professional Status'}
                  </Label>
                  <Select
                    value={data.personal?.statutProfessionnel1 || 'actif'}
                    onValueChange={(value) => handleChange('statutProfessionnel1', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="actif">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                      <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                      <SelectItem value="autre">{isFrench ? 'Autre' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? '$ Salaire actuel' : '$ Current Salary'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="text"
                      value={formatSalaryInput(data.personal?.salaire1 || 0)}
                      onChange={(e) => handleSalaryChange('1', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-mpr-interactive focus:ring-mpr-interactive"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                  </Label>
                  <Input
                    type="number"
                    value={data.personal?.ageRetraiteSouhaite1 || 65}
                    onChange={(e) => handleChange('ageRetraiteSouhaite1', Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-mpr-interactive focus:ring-mpr-interactive"
                    min="50"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personne 2 */}
          <Card className="bg-gradient-to-br from-mpr-navy/90 to-purple-800/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-mpr-interactive bg-gradient-to-r from-mpr-interactive/20 to-purple-600/20">
              <CardTitle className="text-2xl font-bold text-mpr-interactive flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-mpr-interactive to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                {isFrench ? 'Personne 2' : 'Person 2'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Prénom (optionnel)' : 'First Name (optional)'}
                  </Label>
                  <Input
                    type="text"
                    value={data.personal?.prenom2 || ''}
                    onChange={(e) => handleChange('prenom2', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-mpr-interactive focus:ring-mpr-interactive"
                    placeholder={isFrench ? 'Prénom (optionnel)' : 'First Name (optional)'}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Date de naissance' : 'Date of Birth'}
                  </Label>
                  <CustomBirthDateInput
                    id="naissance2"
                    label={isFrench ? 'Date de naissance' : 'Date of Birth'}
                    value={data.personal?.naissance2}
                    onChange={(date) => handleChange('naissance2', date)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Sexe' : 'Gender'}
                  </Label>
                  <Select
                    value={data.personal?.sexe2 || 'femme'}
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
                    {isFrench ? 'Statut professionnel' : 'Professional Status'}
                  </Label>
                  <Select
                    value={data.personal?.statutProfessionnel2 || 'actif'}
                    onValueChange={(value) => handleChange('statutProfessionnel2', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="actif">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                      <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                      <SelectItem value="autre">{isFrench ? 'Autre' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? '$ Salaire actuel' : '$ Current Salary'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="text"
                      value={formatSalaryInput(data.personal?.salaire2 || 0)}
                      onChange={(e) => handleSalaryChange('2', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-mpr-interactive focus:ring-mpr-interactive"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">
                    {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                  </Label>
                  <Input
                    type="number"
                    value={data.personal?.ageRetraiteSouhaite2 || 65}
                    onChange={(e) => handleChange('ageRetraiteSouhaite2', Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-mpr-interactive focus:ring-mpr-interactive"
                    min="50"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Dépenses de retraite */}
        <Card className="bg-gradient-to-br from-yellow-800/90 to-orange-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-yellow-600 bg-gradient-to-r from-yellow-600/20 to-orange-600/20">
            <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center gap-3">
              <Target className="w-8 h-8" />
              {isFrench ? '$ Dépenses de retraite' : '$ Retirement Expenses'}
            </CardTitle>
            <CardDescription className="text-yellow-200">
              {isFrench 
                ? 'Dépenses mensuelles de retraite (en dollars actuels) :'
                : 'Monthly retirement expenses (in current dollars):'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-gray-200 font-semibold">
                  {isFrench ? 'Dépenses mensuelles' : 'Monthly Expenses'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    value={data.personal?.depensesMensuelles || 0}
                    onChange={(e) => handleChange('depensesMensuelles', Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-yellow-400 focus:ring-yellow-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200 font-semibold">
                  {isFrench ? 'Dépenses annuelles' : 'Annual Expenses'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    value={data.personal?.depensesAnnuelles || 0}
                    onChange={(e) => handleChange('depensesAnnuelles', Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-yellow-400 focus:ring-yellow-400"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 rounded-lg border border-slate-500/30">
              <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                {isFrench ? 'Résumé calculé automatiquement:' : 'Automatically calculated summary:'}
                {data.personal?.depensesAnnuelles && data.personal.depensesAnnuelles > 0 && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">
                    ✅ Auto
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ${(data.personal?.depensesMensuelles || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Mensuel' : 'Monthly'}
                  </div>
                  {data.personal?.depensesAnnuelles && data.personal.depensesAnnuelles > 0 && (
                    <div className="text-xs text-green-400 mt-1">
                      Calculé automatiquement
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mpr-interactive">
                    ${(data.personal?.depensesAnnuelles || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Annuel' : 'Annual'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton SAUVEGARDER - Protection des données ! */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm"
            onClick={() => {
              // Logique de sauvegarde et protection des données
              console.log('💾 Sauvegarde des données...');
              
              try {
                // Calculer automatiquement les dépenses mensuelles si les annuelles sont renseignées
                if (data.personal?.depensesAnnuelles && data.personal.depensesAnnuelles > 0) {
                  const depensesMensuelles = Math.round(data.personal.depensesAnnuelles / 12);
                  handleChange('depensesMensuelles', depensesMensuelles);
                  
                  // Afficher un toast de confirmation
                  toast({
                    title: "✅ Données sauvegardées !",
                    description: `Vos informations personnelles ont été sauvegardées avec succès. Dépenses mensuelles calculées automatiquement : $${depensesMensuelles.toLocaleString()}`,
                    variant: "default"
                  });
                  
                  console.log(`🔄 Dépenses mensuelles calculées et sauvegardées: $${depensesMensuelles}`);
                } else {
                  // Sauvegarder quand même mais avertir
                  toast({
                    title: "💾 Données sauvegardées",
                    description: "Vos données ont été sauvegardées. Complétez les dépenses annuelles pour un calcul automatique optimal.",
                    variant: "default"
                  });
                }
                
                // Appeler onUpdate avec la bonne signature : (section, updates)
                // On sauvegarde toutes les données personnelles actuelles
                const personalUpdates = {
                  ...data.personal,
                  // S'assurer que les dépenses mensuelles sont à jour
                  depensesMensuelles: data.personal?.depensesMensuelles || 
                    (data.personal?.depensesAnnuelles ? Math.round(data.personal.depensesAnnuelles / 12) : 0)
                };
                
                onUpdate('personal', personalUpdates);
                
                console.log('💾 Données personnelles sauvegardées avec succès:', personalUpdates);
                
              } catch (error) {
                console.error('❌ Erreur lors de la sauvegarde:', error);
                
                // Afficher un toast d'erreur
                toast({
                  title: "❌ Erreur de sauvegarde",
                  description: "Impossible de sauvegarder vos données. Veuillez réessayer.",
                  variant: "destructive"
                });
              }
            }}
          >
            <Save className="w-8 h-8 mr-4 animate-pulse" />
            {isFrench ? '💾 SAUVEGARDER' : '💾 SAVE'}
            <Shield className="w-8 h-8 ml-4 animate-bounce" />
          </Button>
          <p className="text-gray-300 mt-4 text-lg">
            {isFrench 
              ? '✨ Protégez vos données et continuez en toute sécurité !'
              : '✨ Protect your data and continue safely!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
