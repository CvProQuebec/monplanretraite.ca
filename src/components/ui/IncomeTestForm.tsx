import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types';

interface IncomeTestFormProps {
  userData: UserData;
  updateUserData: (section: keyof UserData, updates: any) => void;
  isFrench: boolean;
}

const IncomeTestForm: React.FC<IncomeTestFormProps> = ({ userData, updateUserData, isFrench }) => {
  const [testData, setTestData] = useState({
    salaire1: userData.personal?.salaire1 || 0,
    salaire2: userData.personal?.salaire2 || 0,
    rrq1: userData.retirement?.rrqMontantActuel1 || 0,
    rrq2: userData.retirement?.rrqMontantActuel2 || 0,
    pensionPrivee1: userData.retirement?.pensionPrivee1 || 0,
    pensionPrivee2: userData.retirement?.pensionPrivee2 || 0,
    autresRevenus1: userData.personal?.autresRevenus1 || 0,
    autresRevenus2: userData.personal?.autresRevenus2 || 0,
  });

  const handleInputChange = (field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTestData(prev => ({ ...prev, [field]: numericValue }));
  };

  const handleSave = () => {
    // Sauvegarder les données de test
    updateUserData('personal', {
      salaire1: testData.salaire1,
      salaire2: testData.salaire2,
      autresRevenus1: testData.autresRevenus1,
      autresRevenus2: testData.autresRevenus2,
    });
    
    updateUserData('retirement', {
      rrqMontantActuel1: testData.rrq1,
      rrqMontantActuel2: testData.rrq2,
      pensionPrivee1: testData.pensionPrivee1,
      pensionPrivee2: testData.pensionPrivee2,
    });
    
    console.log('💾 Données de test sauvegardées:', testData);
  };

  const handleLoadTestData = () => {
    // Charger des données de test basées sur ce que vous avez mentionné
    const testValues = {
      salaire1: 38710,
      salaire2: 0,
      rrq1: 6106.80 / 12, // RRQ mensuel
      rrq2: 0,
      pensionPrivee1: 0,
      pensionPrivee2: 0,
      autresRevenus1: 22273 + 3838.44, // Assurance emploi + rentes viagères
      autresRevenus2: 0,
    };
    
    setTestData(testValues);
    console.log('📊 Données de test chargées:', testValues);
  };

  return (
    <Card className="bg-green-50 border-2 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">
          🧪 Test - Saisie de Données de Revenus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personne 1 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-800">Personne 1</h4>
            <div>
              <Label>Salaire annuel</Label>
              <Input
                type="number"
                value={testData.salaire1}
                onChange={(e) => handleInputChange('salaire1', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>RRQ mensuel</Label>
              <Input
                type="number"
                value={testData.rrq1}
                onChange={(e) => handleInputChange('rrq1', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Pension privée annuelle</Label>
              <Input
                type="number"
                value={testData.pensionPrivee1}
                onChange={(e) => handleInputChange('pensionPrivee1', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Autres revenus annuels</Label>
              <Input
                type="number"
                value={testData.autresRevenus1}
                onChange={(e) => handleInputChange('autresRevenus1', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          
          {/* Personne 2 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-800">Personne 2</h4>
            <div>
              <Label>Salaire annuel</Label>
              <Input
                type="number"
                value={testData.salaire2}
                onChange={(e) => handleInputChange('salaire2', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>RRQ mensuel</Label>
              <Input
                type="number"
                value={testData.rrq2}
                onChange={(e) => handleInputChange('rrq2', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Pension privée annuelle</Label>
              <Input
                type="number"
                value={testData.pensionPrivee2}
                onChange={(e) => handleInputChange('pensionPrivee2', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Autres revenus annuels</Label>
              <Input
                type="number"
                value={testData.autresRevenus2}
                onChange={(e) => handleInputChange('autresRevenus2', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleLoadTestData} variant="outline">
            Charger Données de Test
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeTestForm;
