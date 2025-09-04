import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Flag, Calendar, DollarSign, Info } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';

interface RRQPeriodsInputProps {
  personNumber: 1 | 2;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
}

const RRQPeriodsInput: React.FC<RRQPeriodsInputProps> = ({
  personNumber,
  userData,
  onDataChange,
  isFrench
}) => {
  const [rrqData, setRrqData] = useState({
    revenus2024: '',
    periode1: {
      du: '2025-01-01',
      au: '2025-06-30',
      montantMensuel: ''
    },
    periode2: {
      du: '2025-07-01',
      au: '2025-12-31',
      montantMensuel: ''
    },
    raisonAjustement: ''
  });

  // Charger les données existantes
  useEffect(() => {
    const rrqBiannual = personNumber === 1 
      ? userData?.retirement?.rrqBiannual1 
      : userData?.retirement?.rrqBiannual2;
    
    const rrqMontantActuel = personNumber === 1 
      ? userData?.retirement?.rrqMontantActuel1 
      : userData?.retirement?.rrqMontantActuel2;
    
    if (rrqBiannual) {
      setRrqData({
        revenus2024: rrqBiannual.revenus2024 || '',
        periode1: {
          du: rrqBiannual.periode1?.du || '2025-01-01',
          au: rrqBiannual.periode1?.au || '2025-06-30',
          montantMensuel: rrqBiannual.periode1?.montantMensuel || ''
        },
        periode2: {
          du: rrqBiannual.periode2?.du || '2025-07-01',
          au: rrqBiannual.periode2?.au || '2025-12-31',
          montantMensuel: rrqBiannual.periode2?.montantMensuel || ''
        },
        raisonAjustement: rrqBiannual.raisonAjustement || ''
      });
    } else if (rrqMontantActuel) {
      // Si pas de données biannuelles, utiliser les données existantes
      setRrqData({
        revenus2024: '',
        periode1: {
          du: '2025-01-01',
          au: '2025-06-30',
          montantMensuel: rrqMontantActuel.toString()
        },
        periode2: {
          du: '2025-07-01',
          au: '2025-12-31',
          montantMensuel: rrqMontantActuel.toString()
        },
        raisonAjustement: ''
      });
    }
  }, [userData, personNumber]);

  // Calculer le montant suggéré pour juillet-décembre
  const calculateSuggestedAmount = () => {
    const revenus2024 = parseFloat(rrqData.revenus2024) || 0;
    if (revenus2024 > 0) {
      // Calcul simplifié de la récupération fiscale
      const montantSuggere = Math.round((revenus2024 * 0.0027) / 6); // Approximation
      return montantSuggere;
    }
    return 0;
  };

  // Calculer le total pour une période
  const calculatePeriodTotal = (montantMensuel: string, du: string, au: string) => {
    const montant = parseFloat(montantMensuel) || 0;
    const startDate = new Date(du);
    const endDate = new Date(au);
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth()) + 1;
    return montant * monthsDiff;
  };

  const handleDataChange = (field: string, value: any) => {
    const newData = { ...rrqData };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newData[parent as keyof typeof newData] = {
        ...newData[parent as keyof typeof newData],
        [child]: value
      };
    } else {
      (newData as any)[field] = value;
    }
    
    setRrqData(newData);
    
    // Sauvegarder dans userData avec la structure correcte
    const fieldName = personNumber === 1 ? 'rrqBiannual1' : 'rrqBiannual2';
    
    // Calculer le montant mensuel actuel pour la compatibilité
    const montantMensuelActuel = parseFloat(newData.periode1.montantMensuel) || 0;
    const montantActuelField = personNumber === 1 ? 'rrqMontantActuel1' : 'rrqMontantActuel2';
    
    onDataChange({
      [fieldName]: newData,
      [montantActuelField]: montantMensuelActuel
    });
  };

  const totalPeriode1 = calculatePeriodTotal(rrqData.periode1.montantMensuel, rrqData.periode1.du, rrqData.periode1.au);
  const totalPeriode2 = calculatePeriodTotal(rrqData.periode2.montantMensuel, rrqData.periode2.du, rrqData.periode2.au);
  const montantSuggere = calculateSuggestedAmount();

  return (
    <Card className="bg-white border-2 border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
        <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
          <Flag className="w-6 h-6" />
          {isFrench ? 'RRQ/CPP - Périodes 2025' : 'QPP/CPP - 2025 Periods'}
        </CardTitle>
        <p className="text-sm text-blue-600">
          {isFrench 
            ? 'Personne ' + personNumber + ' - Configuration des montants RRQ par période'
            : 'Person ' + personNumber + ' - RRQ amounts by period configuration'
          }
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Année de référence */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {isFrench ? 'Année de référence: 2025' : 'Reference Year: 2025'}
          </h3>
        </div>

        {/* Revenus de 2024 */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-gray-700">
            {isFrench ? 'Revenus de 2024 (optionnel)' : '2024 Income (optional)'}
          </Label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                type="text"
                value={rrqData.revenus2024}
                onChange={(e) => handleDataChange('revenus2024', e.target.value)}
                placeholder="123 456,78"
                className="text-lg p-3 border-2 border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                {isFrench ? 'Format: 123 456,78' : 'Format: 123,456.78'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {isFrench 
              ? 'Utilisé pour calculer automatiquement la récupération fiscale à partir de juillet'
              : 'Used to automatically calculate tax recovery from July'
            }
          </p>
          {montantSuggere > 0 && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
              <p className="text-orange-800 font-semibold">
                {isFrench 
                  ? `Montant suggéré pour juillet-décembre: ${formatCurrency(montantSuggere)}`
                  : `Suggested amount for July-December: ${formatCurrency(montantSuggere)}`
                }
              </p>
            </div>
          )}
        </div>

        {/* Période 1: janvier à juin */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <Label className="text-lg font-semibold text-gray-700">
              {isFrench ? 'Période 1: janvier à juin' : 'Period 1: January to June'}
            </Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {isFrench ? 'Du' : 'From'}
              </Label>
              <Input
                type="date"
                value={rrqData.periode1.du}
                onChange={(e) => handleDataChange('periode1.du', e.target.value)}
                className="p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {isFrench ? 'Au' : 'To'}
              </Label>
              <Input
                type="date"
                value={rrqData.periode1.au}
                onChange={(e) => handleDataChange('periode1.au', e.target.value)}
                className="p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
              </Label>
              <Input
                type="text"
                value={rrqData.periode1.montantMensuel}
                onChange={(e) => handleDataChange('periode1.montantMensuel', e.target.value)}
                placeholder="713,34"
                className="p-2 border-2 border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isFrench ? 'Format: 123 456,78' : 'Format: 123,456.78'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-green-600">
              {isFrench ? `Total période 1 : ${formatCurrency(totalPeriode1)}` : `Total period 1: ${formatCurrency(totalPeriode1)}`}
            </p>
          </div>
        </div>

        {/* Période 2: juillet à décembre */}
        <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <Label className="text-lg font-semibold text-gray-700">
              {isFrench ? 'Période 2: juillet à décembre' : 'Period 2: July to December'}
            </Label>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {isFrench ? 'Récupération fiscale' : 'Tax Recovery'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {isFrench ? 'Du' : 'From'}
              </Label>
              <Input
                type="date"
                value={rrqData.periode2.du}
                onChange={(e) => handleDataChange('periode2.du', e.target.value)}
                className="p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {isFrench ? 'Au' : 'To'}
              </Label>
              <Input
                type="date"
                value={rrqData.periode2.au}
                onChange={(e) => handleDataChange('periode2.au', e.target.value)}
                className="p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
              </Label>
              <Input
                type="text"
                value={rrqData.periode2.montantMensuel}
                onChange={(e) => handleDataChange('periode2.montantMensuel', e.target.value)}
                placeholder="713,34"
                className="p-2 border-2 border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isFrench ? 'Format: 123 456,78' : 'Format: 123,456.78'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-green-600">
              {isFrench ? `Total période 2 : ${formatCurrency(totalPeriode2)}` : `Total period 2: ${formatCurrency(totalPeriode2)}`}
            </p>
          </div>
        </div>

        {/* Raison de l'ajustement */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-gray-700">
            {isFrench ? 'Raison de l\'ajustement (optionnel)' : 'Reason for adjustment (optional)'}
          </Label>
          <Textarea
            value={rrqData.raisonAjustement}
            onChange={(e) => handleDataChange('raisonAjustement', e.target.value)}
            placeholder={isFrench 
              ? 'Ex: Récupération fiscale basée sur les revenus de 2023...'
              : 'Ex: Tax recovery based on 2023 income...'
            }
            className="p-3 border-2 border-gray-300 rounded-lg min-h-[80px]"
          />
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            onClick={() => {
              // La sauvegarde est déjà gérée par handleDataChange
              console.log('RRQ data saved:', rrqData);
              alert(isFrench ? 'Données RRQ sauvegardées avec succès!' : 'RRQ data saved successfully!');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {isFrench ? 'Sauvegarder' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RRQPeriodsInput;
