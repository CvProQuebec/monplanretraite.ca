// src/features/retirement/sections/RealEstateSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Home, Building2, Calculator, TrendingUp, MapPin, DollarSign } from 'lucide-react';
import { HelpTooltip } from '../components/HelpTooltip';
import { formatMontantOQLF } from '@/utils/formatters';
import { UserData } from '../types';

interface RealEstateSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

export const RealEstateSection: React.FC<RealEstateSectionProps> = ({ data, onUpdate }) => {
  const [showHelp, setShowHelp] = useState(false);

  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const handleChange = (field: string, value: any) => {
    onUpdate('savings', { [field]: value });
  };

  // Calculs immobiliers
  const valeurResidence = data.savings?.residenceValeur || 0;
  const hypothequeRestante = data.savings?.residenceHypotheque || 0;
  const equiteResidence = Math.max(0, valeurResidence - hypothequeRestante);
  const ratioEquite = valeurResidence > 0 ? (equiteResidence / valeurResidence) * 100 : 0;

  // Propriétés locatives
  const valeursLocatives = [
    data.savings?.locative1Valeur || 0,
    data.savings?.locative2Valeur || 0,
    data.savings?.locative3Valeur || 0
  ];
  const hypothequesLocatives = [
    data.savings?.locative1Hypotheque || 0,
    data.savings?.locative2Hypotheque || 0,
    data.savings?.locative3Hypotheque || 0
  ];

  const totalValeursLocatives = valeursLocatives.reduce((sum, val) => sum + val, 0);
  const totalHypothequesLocatives = hypothequesLocatives.reduce((sum, val) => sum + val, 0);
  const equiteLocative = Math.max(0, totalValeursLocatives - totalHypothequesLocatives);

  const patrimoineImmobilierTotal = equiteResidence + equiteLocative;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="w-12 h-12 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {isFrench ? 'Patrimoine immobilier' : 'Real Estate Portfolio'}
            </h1>
          </div>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            {isFrench 
              ? 'Gérez vos propriétés et optimisez votre patrimoine immobilier pour la retraite'
              : 'Manage your properties and optimize your real estate portfolio for retirement'
            }
          </p>
        </div>

        {/* Résumé du patrimoine immobilier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-emerald-300/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Home className="w-5 h-5" />
                {isFrench ? 'Résidence principale' : 'Primary residence'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {isFrench ? formatMontantOQLF(equiteResidence) : `$${equiteResidence.toLocaleString()}`}
              </div>
              <div className="text-emerald-200 text-sm">
                {isFrench ? 'Équité nette' : 'Net equity'}
              </div>
              <div className="mt-2">
                <Progress value={ratioEquite} className="h-2" />
                <div className="text-xs text-emerald-300 mt-1">
                  {ratioEquite.toFixed(1)}% {isFrench ? 'équité' : 'equity'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-teal-300/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {isFrench ? 'Propriétés locatives' : 'Rental properties'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-400">
                {isFrench ? formatMontantOQLF(equiteLocative) : `$${equiteLocative.toLocaleString()}`}
              </div>
              <div className="text-teal-200 text-sm">
                {isFrench ? 'Équité totale' : 'Total equity'}
              </div>
              <div className="text-xs text-teal-300 mt-1">
                {valeursLocatives.filter(v => v > 0).length} {isFrench ? 'propriétés' : 'properties'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {isFrench ? 'Patrimoine total' : 'Total wealth'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {isFrench ? formatMontantOQLF(patrimoineImmobilierTotal) : `$${patrimoineImmobilierTotal.toLocaleString()}`}
              </div>
              <div className="text-blue-200 text-sm">
                {isFrench ? 'Valeur nette immobilière' : 'Net real estate value'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Résidence principale */}
        <div className="space-y-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-emerald-300/30">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Home className="w-5 h-5" />
                {isFrench ? 'Ma résidence principale' : 'My primary residence'}
              </CardTitle>
              <CardDescription className="text-emerald-200">
                {isFrench 
                  ? 'Informations sur votre propriété principale'
                  : 'Information about your main property'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-emerald-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {isFrench ? 'Valeur estimée' : 'Estimated value'}
                    <HelpTooltip title={isFrench ? 'Valeur estimée' : 'Estimated value'} content={isFrench ? 'Valeur marchande actuelle de votre résidence' : 'Current market value of your residence'}><span></span></HelpTooltip>
                  </Label>
                  <Input
                    type="number"
                    value={data.savings?.residenceValeur || ''}
                    onChange={(e) => handleChange('residenceValeur', parseFloat(e.target.value) || 0)}
                    placeholder={isFrench ? 'Ex: 500000' : 'Ex: 500000'}
                    className="bg-white/20 border-emerald-300/30 text-white placeholder-emerald-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-emerald-300 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    {isFrench ? 'Hypothèque restante' : 'Remaining mortgage'}
                    <HelpTooltip title={isFrench ? 'Hypothèque restante' : 'Remaining mortgage'} content={isFrench ? 'Montant encore dû sur votre hypothèque' : 'Amount still owed on your mortgage'}><span></span></HelpTooltip>
                  </Label>
                  <Input
                    type="number"
                    value={data.savings?.residenceHypotheque || ''}
                    onChange={(e) => handleChange('residenceHypotheque', parseFloat(e.target.value) || 0)}
                    placeholder={isFrench ? 'Ex: 200000' : 'Ex: 200000'}
                    className="bg-white/20 border-emerald-300/30 text-white placeholder-emerald-200"
                  />
                </div>
              </div>

              {valeurResidence > 0 && (
                <Alert className="bg-emerald-900/50 border-emerald-400/30">
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription className="text-emerald-200">
                    {isFrench ? 'Équité nette: ' : 'Net equity: '}
                    <span className="font-semibold text-emerald-400">
                      {isFrench ? formatMontantOQLF(equiteResidence) : `$${equiteResidence.toLocaleString()}`}
                    </span>
                    {' '}({ratioEquite.toFixed(1)}% {isFrench ? 'de la valeur' : 'of value'})
                  </AlertDescription>
                </Alert>
              )}
            {/* Charges annuelles et paiements - source de vérité (uniformisation .mpr-form) */}
            <div className="mpr-form">
              <div className="mpr-form-row cols-3">
                <div className="mpr-field">
                  <label htmlFor="residence-paiement-hypotheque">{isFrench ? 'Paiement hypothécaire (mensuel)' : 'Mortgage payment (monthly)'}</label>
                  <input
                    id="residence-paiement-hypotheque"
                    type="number"
                    className="senior-form-input"
                    value={data.savings?.residencePaiementHypothecaireMensuel || ''}
                    onChange={(e) => handleChange('residencePaiementHypothecaireMensuel', parseFloat(e.target.value) || 0)}
                    placeholder={isFrench ? 'Ex : 1 200' : 'Ex: 1200'}
                  />
                </div>
                <div className="mpr-field">
                  <label htmlFor="residence-taxes-annuelles">{isFrench ? 'Taxes municipales (annuel)' : 'Municipal taxes (annual)'}</label>
                  <input
                    id="residence-taxes-annuelles"
                    type="number"
                    className="senior-form-input"
                    value={data.savings?.residenceTaxesMunicipalesAnnuelles || ''}
                    onChange={(e) => handleChange('residenceTaxesMunicipalesAnnuelles', parseFloat(e.target.value) || 0)}
                    placeholder={isFrench ? 'Ex : 3 600' : 'Ex: 3600'}
                  />
                </div>
                <div className="mpr-field">
                  <label htmlFor="residence-assurance-annuelle">{isFrench ? 'Assurance habitation (annuel)' : 'Home insurance (annual)'}</label>
                  <input
                    id="residence-assurance-annuelle"
                    type="number"
                    className="senior-form-input"
                    value={data.savings?.residenceAssuranceHabitationAnnuelle || ''}
                    onChange={(e) => handleChange('residenceAssuranceHabitationAnnuelle', parseFloat(e.target.value) || 0)}
                    placeholder={isFrench ? 'Ex : 1 200' : 'Ex: 1200'}
                  />
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Propriétés locatives */}
        <div className="space-y-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-teal-300/30">
            <CardHeader>
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {isFrench ? 'Mes propriétés locatives' : 'My rental properties'}
              </CardTitle>
              <CardDescription className="text-teal-200">
                {isFrench 
                  ? 'Gérez vos propriétés locatives pour générer des revenus passifs'
                  : 'Manage your rental properties to generate passive income'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-teal-400" />
                    <h4 className="text-lg font-semibold text-teal-300">
                      {isFrench ? `Propriété locative ${num}` : `Rental property ${num}`}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-teal-300">
                        {isFrench ? 'Valeur estimée' : 'Estimated value'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings?.[`locative${num}Valeur` as keyof typeof data.savings] || ''}
                        onChange={(e) => handleChange(`locative${num}Valeur`, parseFloat(e.target.value) || 0)}
                        placeholder={isFrench ? 'Ex: 300000' : 'Ex: 300000'}
                        className="bg-white/20 border-teal-300/30 text-white placeholder-teal-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-teal-300">
                        {isFrench ? 'Hypothèque restante' : 'Remaining mortgage'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings?.[`locative${num}Hypotheque` as keyof typeof data.savings] || ''}
                        onChange={(e) => handleChange(`locative${num}Hypotheque`, parseFloat(e.target.value) || 0)}
                        placeholder={isFrench ? 'Ex: 150000' : 'Ex: 150000'}
                        className="bg-white/20 border-teal-300/30 text-white placeholder-teal-200"
                      />
                    </div>
                  </div>

                  {(valeursLocatives[num - 1] > 0) && (
                    <Alert className="bg-teal-900/50 border-teal-400/30">
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription className="text-teal-200">
                        {isFrench ? 'Équité nette: ' : 'Net equity: '}
                        <span className="font-semibold text-teal-400">
                          {isFrench 
                            ? formatMontantOQLF(Math.max(0, valeursLocatives[num - 1] - hypothequesLocatives[num - 1]))
                            : `$${Math.max(0, valeursLocatives[num - 1] - hypothequesLocatives[num - 1]).toLocaleString()}`
                          }
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {num < 3 && <hr className="border-teal-300/20" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={() => setShowHelp(!showHelp)}
            variant="outline"
            className="bg-white/10 border-emerald-300/30 text-emerald-300 hover:bg-emerald-600 hover:text-white"
          >
            {isFrench ? 'Aide et conseils' : 'Help & tips'}
          </Button>
        </div>

        {/* Aide contextuelle */}
        {showHelp && (
          <Card className="mt-6 bg-white/10 backdrop-blur-sm border-emerald-300/30">
            <CardHeader>
              <CardTitle className="text-emerald-400">
                {isFrench ? 'Conseils pour optimiser votre patrimoine immobilier' : 'Tips to optimize your real estate portfolio'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-emerald-200">
              <p>
                {isFrench 
                  ? '• Considérez refinancer si les taux d\'intérêt ont baissé depuis votre dernière hypothèque'
                  : '• Consider refinancing if interest rates have dropped since your last mortgage'
                }
              </p>
              <p>
                {isFrench 
                  ? '• L\'immobilier peut être une excellente source de revenus passifs à la retraite'
                  : '• Real estate can be an excellent source of passive income in retirement'
                }
              </p>
              <p>
                {isFrench 
                  ? '• Pensez à rembourser vos hypothèques avant la retraite pour réduire vos dépenses mensuelles'
                  : '• Consider paying off your mortgages before retirement to reduce your monthly expenses'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
