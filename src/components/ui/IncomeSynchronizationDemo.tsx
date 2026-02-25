import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';
import { IncomeSynchronizationService } from '@/services/IncomeSynchronizationService';
import { UserData } from '@/types';

interface IncomeSynchronizationDemoProps {
  isFrench: boolean;
}

const IncomeSynchronizationDemo: React.FC<IncomeSynchronizationDemoProps> = ({ isFrench }) => {
  const [userData, setUserData] = useState<UserData>({
    personal: {
      prenom1: 'Jean',
      prenom2: 'Marie',
      naissance1: '1980-01-01',
      naissance2: '1985-01-01',
      sexe1: 'M',
      sexe2: 'F',
      salaire1: 75000,
      salaire2: 65000,
      secteurActivite1: 'technologie',
      secteurActivite2: 'sante'
    },
    retirement: {},
    savings: {},
    cashflow: {}
  });

  const [synchronizedData, setSynchronizedData] = useState<any>(null);
  const [longevityImpact, setLongevityImpact] = useState<any>(null);

  useEffect(() => {
    updateSynchronization();
  }, [userData]);

  const updateSynchronization = () => {
    const incomeData = IncomeSynchronizationService.synchronizeHouseholdIncome(userData);
    const impact = IncomeSynchronizationService.calculateIncomeLongevityImpact(incomeData);
    
    setSynchronizedData(incomeData);
    setLongevityImpact(impact);
  };

  const handleIncomeChange = (person: '1' | '2', value: string) => {
    const numericValue = parseFloat(value) || 0;
    setUserData(prev => ({
      ...prev,
      personal: {
        ...prev.personal!,
        [`salaire${person}`]: numericValue
      }
    }));
  };

  const handleSectorChange = (person: '1' | '2', sector: string) => {
    setUserData(prev => ({
      ...prev,
      personal: {
        ...prev.personal!,
        [`secteurActivite${person}`]: sector
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-mpr-interactive-lt to-green-50 border-2 border-mpr-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-mpr-navy flex items-center gap-2">
            <RefreshCw className="w-6 h-6" />
            {isFrench ? 'Démonstration de Synchronisation des Revenus' : 'Income Synchronization Demo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inputs pour les revenus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isFrench ? 'Personne 1' : 'Person 1'}
              </h3>
              <div>
                <Label htmlFor="salaire1">
                  {isFrench ? 'Salaire annuel' : 'Annual Salary'}
                </Label>
                <Input
                  id="salaire1"
                  type="number"
                  value={userData.personal?.salaire1 || 0}
                  onChange={(e) => handleIncomeChange('1', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="secteur1">
                  {isFrench ? 'Secteur d\'activité' : 'Work Sector'}
                </Label>
                <select
                  id="secteur1"
                  value={userData.personal?.secteurActivite1 || ''}
                  onChange={(e) => handleSectorChange('1', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                  aria-label={isFrench ? 'Secteur d\'activité personne 1' : 'Work sector person 1'}
                >
                  <option value="technologie">{isFrench ? 'Technologie' : 'Technology'}</option>
                  <option value="sante">{isFrench ? 'Santé' : 'Healthcare'}</option>
                  <option value="education">{isFrench ? 'Éducation' : 'Education'}</option>
                  <option value="finance">{isFrench ? 'Finance' : 'Finance'}</option>
                  <option value="construction">{isFrench ? 'Construction' : 'Construction'}</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isFrench ? 'Personne 2' : 'Person 2'}
              </h3>
              <div>
                <Label htmlFor="salaire2">
                  {isFrench ? 'Salaire annuel' : 'Annual Salary'}
                </Label>
                <Input
                  id="salaire2"
                  type="number"
                  value={userData.personal?.salaire2 || 0}
                  onChange={(e) => handleIncomeChange('2', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="secteur2">
                  {isFrench ? 'Secteur d\'activité' : 'Work Sector'}
                </Label>
                <select
                  id="secteur2"
                  value={userData.personal?.secteurActivite2 || ''}
                  onChange={(e) => handleSectorChange('2', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                  aria-label={isFrench ? 'Secteur d\'activité personne 2' : 'Work sector person 2'}
                >
                  <option value="technologie">{isFrench ? 'Technologie' : 'Technology'}</option>
                  <option value="sante">{isFrench ? 'Santé' : 'Healthcare'}</option>
                  <option value="education">{isFrench ? 'Éducation' : 'Education'}</option>
                  <option value="finance">{isFrench ? 'Finance' : 'Finance'}</option>
                  <option value="construction">{isFrench ? 'Construction' : 'Construction'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Résultats de synchronisation */}
          {synchronizedData && (
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {isFrench ? 'Résultats de Synchronisation' : 'Synchronization Results'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-mpr-navy">
                    ${synchronizedData.totalHouseholdIncome.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Revenus totaux' : 'Total Income'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {synchronizedData.incomeMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Multiplicateur Santé' : 'Health Multiplier'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${synchronizedData.sectorImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {synchronizedData.sectorImpact >= 0 ? '+' : ''}{synchronizedData.sectorImpact.toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Impact Secteur' : 'Sector Impact'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Impact sur la longévité */}
          {longevityImpact && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {isFrench ? 'Impact sur la Longévité' : 'Longevity Impact'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${longevityImpact.lifeExpectancyAdjustment >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {longevityImpact.lifeExpectancyAdjustment >= 0 ? '+' : ''}{longevityImpact.lifeExpectancyAdjustment.toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Ajustement Longévité' : 'Longevity Adjustment'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-mpr-navy">
                    {longevityImpact.healthMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Multiplicateur Santé' : 'Health Multiplier'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-mpr-navy">
                    {(longevityImpact.stressReduction * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Réduction Stress' : 'Stress Reduction'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Note explicative */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>{isFrench ? 'Note:' : 'Note:'}</strong> {
                isFrench 
                  ? 'Les revenus sont automatiquement synchronisés entre les profils 1 et 2. L\'analyse de longévité tient compte du total des revenus du ménage, des secteurs d\'activité et d\'autres facteurs socio-économiques pour calculer l\'espérance de vie ajustée.'
                  : 'Income is automatically synchronized between profiles 1 and 2. Longevity analysis considers total household income, work sectors, and other socio-economic factors to calculate adjusted life expectancy.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeSynchronizationDemo;
