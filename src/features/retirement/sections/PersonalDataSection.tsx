// src/features/retirement/sections/PersonalDataSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Info, HelpCircle, Calendar, DollarSign, Target } from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { HelpTooltip, FieldHelp } from '../components/HelpTooltip';
import { CustomBirthDateInput } from '../components/CustomBirthDateInput';

interface PersonalDataSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  data, 
  onUpdate
}) => {
  const [showHelp, setShowHelp] = useState(false);
  
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const handleChange = (field: string, value: any) => {
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
    <div className="space-y-6">
      {/* En-tête avec aide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-charcoal-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-charcoal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">
              {isFrench ? 'Données personnelles' : 'Personal Data'}
            </h1>
            <p className="text-lg text-charcoal-600 mt-1">
              {isFrench 
                ? 'Renseignez vos informations pour une planification précise'
                : 'Enter your information for accurate planning'
              }
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowHelp(!showHelp)}
          className="text-lg px-6 py-3"
        >
          <HelpCircle className="w-5 h-5 mr-2" />
          {isFrench ? 'Aide' : 'Help'}
        </Button>
      </div>

      {/* Message d'aide */}
      {showHelp && (
        <Alert className="border-charcoal-200 bg-charcoal-50">
          <Info className="h-5 w-5 text-charcoal-600" />
          <AlertDescription className="text-lg text-charcoal-700">
            <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong> {
              isFrench 
                ? 'Remplissez les informations pour chaque personne. Si vous êtes seul(e), laissez la section « Personne 2 » vide. Les montants en dollars n\'incluent pas les centimes pour simplifier la saisie.'
                : 'Fill in the information for each person. If you are single, leave the "Person 2" section empty. Dollar amounts do not include cents to simplify entry.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personne 1 */}
        <Card className="border-2 border-charcoal-200 shadow-lg">
          <CardHeader className="bg-charcoal-50 border-b-2 border-charcoal-200">
            <CardTitle className="text-2xl font-bold text-charcoal-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-charcoal-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              {isFrench ? 'Personne 1' : 'Person 1'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Prénom */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Prénom' : 'First Name'} 
                content={isFrench ? 'Entrez le prénom de la première personne.' : 'Enter the first person\'s first name.'}
              >
                <Label htmlFor="prenom1" className="text-lg font-semibold text-charcoal-700">
                  {isFrench ? 'Prénom' : 'First Name'}
                </Label>
              </HelpTooltip>
              <Input
                id="prenom1"
                value={data.personal.prenom1}
                onChange={(e) => handleChange('prenom1', e.target.value)}
                placeholder={isFrench ? 'Prénom' : 'First Name'}
                className="text-lg p-4 h-14 border-2 border-charcoal-200 focus:border-charcoal-600"
              />
            </div>

            {/* Date de naissance */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Date de naissance' : 'Birth Date'} 
                content={isFrench ? 'Date de naissance de la première personne.' : 'Enter the first person\'s birth date.'}
              >
                <CustomBirthDateInput
                  id="naissance1"
                  label={isFrench ? 'Date de naissance' : 'Birth Date'}
                  value={data.personal.naissance1 || ''}
                  onChange={(value) => handleChange('naissance1', value)}
                />
              </HelpTooltip>
            </div>

            {/* Sexe */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Sexe' : 'Gender'} 
                content={isFrench ? 'Sexe de la première personne.' : 'Enter the first person\'s gender.'}
              >
                <Label htmlFor="sexe1" className="text-lg font-semibold text-charcoal-700">
                  {isFrench ? 'Sexe' : 'Gender'}
                </Label>
              </HelpTooltip>
              <Select value={data.personal.sexe1} onValueChange={(value) => handleChange('sexe1', value)}>
                <SelectTrigger className="text-lg p-4 h-14 border-2 border-charcoal-200 focus:border-charcoal-600">
                  <SelectValue placeholder={isFrench ? 'Sexe' : 'Gender'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                  <SelectItem value="F">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut professionnel */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Statut professionnel' : 'Professional Status'} 
                content={isFrench ? 'Statut professionnel de la première personne.' : 'Enter the first person\'s professional status.'}
              >
                <Label htmlFor="statut1" className="text-lg font-semibold text-charcoal-700">
                  {isFrench ? 'Statut professionnel' : 'Professional Status'}
                </Label>
              </HelpTooltip>
              <Select value={data.personal.statutProfessionnel1 || 'actif'} onValueChange={(value) => handleChange('statutProfessionnel1', value)}>
                <SelectTrigger className="text-lg p-4 h-14 border-2 border-charcoal-200 focus:border-charcoal-600">
                  <SelectValue placeholder={isFrench ? 'Statut professionnel' : 'Professional Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">{isFrench ? 'Actif' : 'Working'}</SelectItem>
                  <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salaire actuel (si actif) */}
            {(data.personal.statutProfessionnel1 === 'actif' || !data.personal.statutProfessionnel1) && (
              <div className="space-y-3">
                <HelpTooltip 
                  title={isFrench ? 'Salaire actuel' : 'Current Salary'} 
                  content={isFrench ? 'Salaire brut annuel de la première personne avant impôts.' : 'Enter the first person\'s gross annual salary before taxes.'}
                >
                  <Label htmlFor="salaire1" className="text-lg font-semibold text-charcoal-700 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {isFrench ? 'Salaire actuel' : 'Current Salary'}
                  </Label>
                </HelpTooltip>
                <Input
                  id="salaire1"
                  value={formatSalaryInput(data.personal.salaire1)}
                  onChange={(e) => handleSalaryChange('1', e.target.value)}
                  placeholder={isFrench ? '0 $' : '0 $'}
                  className="text-lg p-4 h-14 border-2 border-charcoal-200 focus:border-charcoal-600"
                />
              </div>
            )}

            {/* Âge de retraite souhaité */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'} 
                content={isFrench ? 'Âge de retraite souhaité pour la première personne.' : 'Enter the desired retirement age for the first person.'}
              >
                <Label htmlFor="ageRetraite1" className="text-lg font-semibold text-charcoal-700 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                </Label>
              </HelpTooltip>
              <Input
                id="ageRetraite1"
                type="number"
                min="55"
                max="75"
                value={data.personal.ageRetraiteSouhaite1 || 65}
                onChange={(e) => handleChange('ageRetraiteSouhaite1', parseInt(e.target.value) || 65)}
                className="text-lg p-4 h-14 border-2 border-charcoal-200 focus:border-charcoal-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Personne 2 */}
        <Card className="border-2 border-gold-200 shadow-lg">
          <CardHeader className="bg-gold-50 border-b-2 border-gold-200">
            <CardTitle className="text-2xl font-bold text-charcoal-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              {isFrench ? 'Personne 2' : 'Person 2'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Prénom */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Prénom' : 'First Name'} 
                content={isFrench ? 'Entrez le prénom de la deuxième personne (optionnel si vous êtes seul(e)).' : 'Enter the second person\'s first name (optional if you are single).'}
              >
                <Label htmlFor="prenom2" className="text-lg font-semibold text-charcoal-700">
                  {isFrench ? 'Prénom' : 'First Name'}
                </Label>
              </HelpTooltip>
              <Input
                id="prenom2"
                value={data.personal.prenom2}
                onChange={(e) => handleChange('prenom2', e.target.value)}
                placeholder={isFrench ? 'Prénom (optionnel)' : 'First Name (optional)'}
                className="text-lg p-4 h-14 border-2 border-gold-200 focus:border-gold-600"
              />
            </div>

            {/* Date de naissance */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Date de naissance' : 'Birth Date'} 
                content={isFrench ? 'Date de naissance de la deuxième personne pour les calculs de retraite.' : 'Enter the second person\'s birth date for retirement calculations.'}
              >
                <CustomBirthDateInput
                  id="naissance2"
                  label={isFrench ? 'Date de naissance' : 'Birth Date'}
                  value={data.personal.naissance2 || ''}
                  onChange={(value) => handleChange('naissance2', value)}
                />
              </HelpTooltip>
            </div>

            {/* Sexe */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Sexe' : 'Gender'} 
                content={isFrench ? 'Sexe de la deuxième personne pour les calculs d\'espérance de vie.' : 'Enter the second person\'s gender for life expectancy calculations.'}
              >
                <Label htmlFor="sexe2" className="text-lg font-semibold text-charcoal-700">
                  {isFrench ? 'Sexe' : 'Gender'}
                </Label>
              </HelpTooltip>
              <Select value={data.personal.sexe2} onValueChange={(value) => handleChange('sexe2', value)}>
                <SelectTrigger className="text-lg p-4 h-14 border-2 border-gold-200 focus:border-gold-600">
                  <SelectValue placeholder={isFrench ? 'Sexe' : 'Gender'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                  <SelectItem value="F">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut professionnel */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Statut professionnel' : 'Professional Status'} 
                content={isFrench ? 'Statut professionnel de la deuxième personne.' : 'Enter the second person\'s professional status.'}
              >
                <Label htmlFor="statut2" className="text-lg font-semibold text-charcoal-700">
                  {isFrench ? 'Statut professionnel' : 'Professional Status'}
                </Label>
              </HelpTooltip>
              <Select value={data.personal.statutProfessionnel2 || 'actif'} onValueChange={(value) => handleChange('statutProfessionnel2', value)}>
                <SelectTrigger className="text-lg p-4 h-14 border-2 border-gold-200 focus:border-gold-600">
                  <SelectValue placeholder={isFrench ? 'Statut professionnel' : 'Professional Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">{isFrench ? 'Actif' : 'Working'}</SelectItem>
                  <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salaire actuel (si actif) */}
            {(data.personal.statutProfessionnel2 === 'actif' || !data.personal.statutProfessionnel2) && (
              <div className="space-y-3">
                <HelpTooltip 
                  title={isFrench ? 'Salaire actuel' : 'Current Salary'} 
                  content={isFrench ? 'Salaire brut annuel de la deuxième personne avant impôts.' : 'Enter the second person\'s gross annual salary before taxes.'}
                >
                  <Label htmlFor="salaire2" className="text-lg font-semibold text-charcoal-700 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {isFrench ? 'Salaire actuel' : 'Current Salary'}
                  </Label>
                </HelpTooltip>
                <Input
                  id="salaire2"
                  value={formatSalaryInput(data.personal.salaire2)}
                  onChange={(e) => handleSalaryChange('2', e.target.value)}
                  placeholder={isFrench ? '0 $' : '0 $'}
                  className="text-lg p-4 h-14 border-2 border-gold-200 focus:border-gold-600"
                />
              </div>
            )}

            {/* Âge de retraite souhaité */}
            <div className="space-y-3">
              <HelpTooltip 
                title={isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'} 
                content={isFrench ? 'Âge de retraite souhaité pour la deuxième personne.' : 'Enter the desired retirement age for the second person.'}
              >
                <Label htmlFor="ageRetraite2" className="text-lg font-semibold text-charcoal-700 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                </Label>
              </HelpTooltip>
              <Input
                id="ageRetraite2"
                type="number"
                min="55"
                max="75"
                value={data.personal.ageRetraiteSouhaite2 || 65}
                onChange={(e) => handleChange('ageRetraiteSouhaite2', parseInt(e.target.value) || 65)}
                className="text-lg p-4 h-14 border-2 border-gold-200 focus:border-gold-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dépenses de retraite */}
      <Card className="border-2 border-sapphire-200 shadow-lg">
        <CardHeader className="bg-sapphire-50 border-b-2 border-sapphire-200">
          <CardTitle className="text-2xl font-bold text-charcoal-900 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-sapphire-600" />
            {isFrench ? 'Dépenses de retraite' : 'Retirement Expenses'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-lg text-charcoal-700">
              {isFrench ? 'Dépenses mensuelles de retraite (en dollars actuels)' : 'Monthly retirement expenses (in current dollars)'} :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dépenses mensuelles */}
              <div className="space-y-3">
                <HelpTooltip 
                  title={isFrench ? 'Dépenses mensuelles' : 'Monthly Expenses'} 
                  content={isFrench ? 'Saisissez vos dépenses mensuelles ou annuelles - les deux champs se synchronisent automatiquement.' : 'Enter your monthly or annual expenses - both fields sync automatically.'}
                >
                  <Label htmlFor="depensesRetraite" className="text-lg font-semibold text-charcoal-700">
                    {isFrench ? 'Dépenses mensuelles' : 'Monthly Expenses'}
                  </Label>
                </HelpTooltip>
                <Input
                  id="depensesRetraite"
                  value={formatSalaryInput(data.personal.depensesRetraite || 0)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0;
                    handleChange('depensesRetraite', value);
                  }}
                  onFocus={(e) => {
                    e.target.setSelectionRange(0, 0);
                  }}
                  placeholder={isFrench ? '0 $' : '0 $'}
                  className="text-lg p-4 h-14 border-2 border-sapphire-200 focus:border-sapphire-600"
                />
                <p className="text-sm text-charcoal-600">
                  {isFrench ? 'Saisie directe des dépenses mensuelles' : 'Direct entry of monthly expenses'}
                </p>
              </div>

              {/* Dépenses annuelles */}
              <div className="space-y-3">
                <HelpTooltip 
                  title={isFrench ? 'Dépenses annuelles' : 'Annual Expenses'} 
                  content={isFrench ? 'Saisissez vos dépenses annuelles totales - le montant mensuel sera calculé automatiquement.' : 'Enter your total annual expenses - the monthly amount will be calculated automatically.'}
                >
                  <Label htmlFor="depensesAnnuel" className="text-lg font-semibold text-charcoal-700">
                    {isFrench ? 'Dépenses annuelles' : 'Annual Expenses'}
                  </Label>
                </HelpTooltip>
                <Input
                  id="depensesAnnuel"
                  value={formatSalaryInput((data.personal.depensesRetraite || 0) * 12)}
                  onChange={(e) => {
                    const annualValue = parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0;
                    const monthlyValue = annualValue / 12;
                    handleChange('depensesRetraite', monthlyValue);
                  }}
                  onFocus={(e) => {
                    e.target.setSelectionRange(0, 0);
                  }}
                  placeholder={isFrench ? '0 $' : '0 $'}
                  className="text-lg p-4 h-14 border-2 border-sapphire-200 focus:border-sapphire-600"
                />
                <p className="text-sm text-charcoal-600">
                  {isFrench ? 'Saisie directe des dépenses annuelles' : 'Direct entry of annual expenses'}
                </p>
              </div>
            </div>

            {/* Résumé calculé */}
            <div className="mt-6 p-4 bg-sapphire-50 rounded-lg border-2 border-sapphire-200">
              <div className="text-center">
                <p className="text-sm text-sapphire-700 mb-2">
                  {isFrench ? 'Résumé calculé automatiquement :' : 'Automatically calculated summary:'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-sapphire-600">
                      {isFrench ? 'Mensuel :' : 'Monthly:'}
                    </p>
                    <p className="text-xl font-bold text-sapphire-800">
                      {formatCurrency(data.personal.depensesRetraite || 0, { showCents: false })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-sapphire-600">
                      {isFrench ? 'Annuel :' : 'Annual:'}
                    </p>
                    <p className="text-xl font-bold text-sapphire-800">
                      {formatCurrency((data.personal.depensesRetraite || 0) * 12, { showCents: false })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de validation */}
      <div className="flex justify-center pt-6">
        <Button 
          size="lg" 
          className="bg-charcoal-600 hover:bg-charcoal-700 text-white text-xl px-8 py-4 h-16"
        >
          {isFrench ? 'Calculer et continuer' : 'Calculate and Continue'}
        </Button>
      </div>
    </div>
  );
};