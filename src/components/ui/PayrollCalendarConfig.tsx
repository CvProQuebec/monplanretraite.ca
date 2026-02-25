// src/components/ui/PayrollCalendarConfig.tsx
// Composant pour configurer le calendrier de paie

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Info } from 'lucide-react';
import { PayrollCalendarService } from '@/services/PayrollCalendarService';

interface PayrollCalendarConfigProps {
  onConfigChange: (config: any) => void;
  initialConfig?: any;
  isFrench: boolean;
}

export const PayrollCalendarConfig: React.FC<PayrollCalendarConfigProps> = ({
  onConfigChange,
  initialConfig,
  isFrench
}) => {
  const [config, setConfig] = useState({
    firstPayDateOfYear: initialConfig?.firstPayDateOfYear || '2025-01-02',
    frequency: initialConfig?.frequency || 'biweekly',
    workDaysPerPeriod: initialConfig?.workDaysPerPeriod || 10
  });

  const [validation, setValidation] = useState({ isValid: true, errors: [] });
  const [preview, setPreview] = useState<any>(null);

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    
    // Valider la configuration
    const validationResult = PayrollCalendarService.validateConfig(newConfig);
    setValidation(validationResult);
    
    if (validationResult.isValid) {
      onConfigChange(newConfig);
    }
  };

  const generatePreview = () => {
    if (!validation.isValid) return;
    
    const summary = PayrollCalendarService.generatePayrollSummary(config, new Date().getFullYear());
    const periods = PayrollCalendarService.calculateCompletedPeriods(config, new Date());
    
    setPreview({
      summary,
      periods: periods.slice(0, 5), // Afficher les 5 premières périodes
      totalEarnings: PayrollCalendarService.calculateTotalEarnings(config, 2720.73, new Date())
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
          <Calendar className="w-6 h-6 text-mpr-interactive" />
          {isFrench ? 'Configuration du Calendrier de Paie' : 'Payroll Calendar Configuration'}
        </CardTitle>
        <CardDescription>
          {isFrench 
            ? 'Configurez le calendrier de paie pour des calculs précis des revenus'
            : 'Configure the payroll calendar for precise income calculations'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstPayDate">
              {isFrench ? 'Date du premier versement de l\'année' : 'First pay date of the year'}
            </Label>
            <Input
              id="firstPayDate"
              type="date"
              value={config.firstPayDateOfYear}
              onChange={(e) => handleConfigChange('firstPayDateOfYear', e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-gray-600">
              {isFrench 
                ? 'Ex: 2 janvier 2025 pour un premier versement le 2 janvier'
                : 'Ex: January 2, 2025 for first payment on January 2nd'
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">
              {isFrench ? 'Fréquence de paie' : 'Pay frequency'}
            </Label>
            <Select
              value={config.frequency}
              onValueChange={(value) => handleConfigChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">
                  {isFrench ? 'Hebdomadaire (7 jours)' : 'Weekly (7 days)'}
                </SelectItem>
                <SelectItem value="biweekly">
                  {isFrench ? 'Aux 2 semaines (14 jours)' : 'Bi-weekly (14 days)'}
                </SelectItem>
                <SelectItem value="bimonthly">
                  {isFrench ? 'Aux 2 semaines (15 jours)' : 'Bi-monthly (15 days)'}
                </SelectItem>
                <SelectItem value="monthly">
                  {isFrench ? 'Mensuel (30 jours)' : 'Monthly (30 days)'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Validation */}
        {!validation.isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <Info className="w-4 h-4" />
              {isFrench ? 'Erreurs de configuration' : 'Configuration errors'}
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bouton de prévisualisation */}
        <div className="flex justify-center">
          <Button
            onClick={generatePreview}
            disabled={!validation.isValid}
            className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white"
          >
            <Clock className="w-4 h-4 mr-2" />
            {isFrench ? 'Générer la prévisualisation' : 'Generate Preview'}
          </Button>
        </div>

        {/* Prévisualisation */}
        {preview && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {isFrench ? 'Résumé du calendrier' : 'Calendar Summary'}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-700">
                    {isFrench ? 'Périodes totales:' : 'Total periods:'} {preview.summary.totalPeriods}
                  </p>
                  <p className="text-green-700">
                    {isFrench ? 'Périodes complétées:' : 'Completed periods:'} {preview.summary.completedPeriods}
                  </p>
                </div>
                <div>
                  <p className="text-green-700">
                    {isFrench ? 'Premier versement:' : 'First payment:'} {formatDate(preview.summary.firstPayDate)}
                  </p>
                  <p className="text-green-700">
                    {isFrench ? 'Dernier versement:' : 'Last payment:'} {formatDate(preview.summary.lastPayDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-mpr-interactive-lt border border-mpr-border rounded-lg p-4">
              <h3 className="font-semibold text-mpr-navy mb-3">
                {isFrench ? 'Exemple de calcul (2720,73$ aux 2 semaines)' : 'Calculation Example ($2,720.73 bi-weekly)'}
              </h3>
              <p className="text-mpr-navy font-medium">
                {isFrench ? 'Gains totaux à ce jour:' : 'Total earnings to date:'} {formatCurrency(preview.totalEarnings)}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                {isFrench ? 'Périodes de paie (5 premières)' : 'Pay periods (first 5)'}
              </h3>
              <div className="space-y-2">
                {preview.periods.map((period: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      Période {period.periodNumber}: {formatDate(period.startDate)} - {formatDate(period.endDate)}
                    </span>
                    <span className="text-gray-600">
                      {formatDate(period.payDate)} {period.isFullPeriod ? '✓' : '⚠️'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
