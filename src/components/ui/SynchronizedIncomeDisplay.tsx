import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, Calculator } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { IncomeSynchronizationService } from '@/services/IncomeSynchronizationService';
import { UserData } from '@/types';

interface SynchronizedIncomeDisplayProps {
  userData: UserData;
  isFrench: boolean;
  showDetails?: boolean;
  className?: string;
}

const SynchronizedIncomeDisplay: React.FC<SynchronizedIncomeDisplayProps> = ({
  userData,
  isFrench,
  showDetails = true,
  className = ''
}) => {
  const incomeData = IncomeSynchronizationService.synchronizeHouseholdIncome(userData);
  const incomeImpact = IncomeSynchronizationService.calculateIncomeLongevityImpact(incomeData);

  return (
    <Card className={`bg-gradient-to-r from-mpr-interactive-lt to-green-50 border-2 border-mpr-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          {isFrench ? 'Revenus Synchronisés' : 'Synchronized Income'}
          <Badge variant="secondary" className="ml-auto">
            {isFrench ? 'Total Ménage' : 'Household Total'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Revenus totaux */}
        <div className="text-center">
          <div className="text-4xl font-bold text-mpr-navy mb-2">
            {formatCurrency(incomeData.totalHouseholdIncome, { showCents: false })}
          </div>
          <div className="text-sm text-gray-600">
            {isFrench ? 'Revenus annuels totaux' : 'Total Annual Income'}
          </div>
          <div className="text-lg text-gray-700 mt-1">
            {formatCurrency(incomeData.monthlyHouseholdIncome, { showCents: false })} / {isFrench ? 'mois' : 'month'}
          </div>
        </div>

        {showDetails && (
          <>
            {/* Détail des revenus individuels */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-mpr-border">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {formatCurrency(incomeData.person1Income, { showCents: false })}
                </div>
                <div className="text-xs text-gray-600">
                  {isFrench ? 'Personne 1' : 'Person 1'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {formatCurrency(incomeData.person2Income, { showCents: false })}
                </div>
                <div className="text-xs text-gray-600">
                  {isFrench ? 'Personne 2' : 'Person 2'}
                </div>
              </div>
            </div>

            {/* Impact sur la longévité */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isFrench ? 'Impact sur la Longévité' : 'Longevity Impact'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">
                    {incomeImpact.healthMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-600">
                    {isFrench ? 'Multiplicateur Santé' : 'Health Multiplier'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-lg font-bold ${incomeImpact.lifeExpectancyAdjustment >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {incomeImpact.lifeExpectancyAdjustment >= 0 ? '+' : ''}{incomeImpact.lifeExpectancyAdjustment.toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isFrench ? 'Ajustement Longévité' : 'Longevity Adjustment'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-mpr-navy">
                    {(incomeImpact.stressReduction * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {isFrench ? 'Réduction Stress' : 'Stress Reduction'}
                  </div>
                </div>
              </div>
            </div>

            {/* Impact du secteur */}
            {incomeData.sectorImpact !== 0 && (
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-sm text-yellow-800">
                  <strong>{isFrench ? 'Impact du secteur d\'activité:' : 'Sector Impact:'}</strong>
                  <span className={`ml-2 ${incomeData.sectorImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {incomeData.sectorImpact >= 0 ? '+' : ''}{incomeData.sectorImpact.toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Note informative */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          {isFrench 
            ? 'Les revenus sont automatiquement synchronisés entre les profils 1 et 2 pour l\'analyse de longévité.'
            : 'Income is automatically synchronized between profiles 1 and 2 for longevity analysis.'
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default SynchronizedIncomeDisplay;
