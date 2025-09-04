import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateIncomeFromPeriods } from '@/utils/incomeCalculationUtils';
import { IncomeEntry } from '@/types';

interface IncomeCalculationTestProps {
  isFrench: boolean;
}

const IncomeCalculationTest: React.FC<IncomeCalculationTestProps> = ({ isFrench }) => {
  const [testData, setTestData] = useState({
    salaryStartDate: '2024-01-01',
    salaryEndDate: '2024-04-04',
    salaryAmount: 1500,
    salaryFrequency: 'biweekly' as 'weekly' | 'biweekly' | 'bimonthly' | 'monthly',
    eiStartDate: '2024-04-06',
    eiWeeklyAmount: 650,
    eiWeeks: 35
  });

  const [results, setResults] = useState<any>(null);

  const runTest = () => {
    // Créer des données de test basées sur les exemples
    const testEntries: IncomeEntry[] = [
      {
        id: 'test-salary',
        type: 'salaire',
        description: 'Salaire test',
        isActive: true,
        salaryStartDate: testData.salaryStartDate,
        salaryEndDate: testData.salaryEndDate,
        salaryNetAmount: testData.salaryAmount,
        salaryFrequency: testData.salaryFrequency
      },
      {
        id: 'test-ei',
        type: 'assurance-emploi',
        description: 'Assurance emploi test',
        isActive: true,
        eiStartDate: testData.eiStartDate,
        weeklyNet: testData.eiWeeklyAmount,
        eiEligibleWeeks: testData.eiWeeks
      }
    ];

    const result = calculateIncomeFromPeriods(testEntries);
    setResults(result);
  };

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-orange-50 border-2 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800">
          🧪 Test Calcul des Revenus avec Périodes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration du test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Salaire - Date de début</Label>
            <Input
              type="date"
              value={testData.salaryStartDate}
              onChange={(e) => handleInputChange('salaryStartDate', e.target.value)}
            />
          </div>
          <div>
            <Label>Salaire - Date de fin</Label>
            <Input
              type="date"
              value={testData.salaryEndDate}
              onChange={(e) => handleInputChange('salaryEndDate', e.target.value)}
            />
          </div>
          <div>
            <Label>Montant salaire par période</Label>
            <Input
              type="number"
              value={testData.salaryAmount}
              onChange={(e) => handleInputChange('salaryAmount', e.target.value)}
            />
          </div>
          <div>
            <Label>Fréquence salaire</Label>
            <select
              value={testData.salaryFrequency}
              onChange={(e) => handleInputChange('salaryFrequency', e.target.value)}
              className="w-full p-2 border rounded"
              aria-label="Fréquence de paiement du salaire"
            >
              <option value="weekly">Hebdomadaire</option>
              <option value="biweekly">Aux 2 semaines</option>
              <option value="bimonthly">Aux 2 mois</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
          <div>
            <Label>AE - Date de début</Label>
            <Input
              type="date"
              value={testData.eiStartDate}
              onChange={(e) => handleInputChange('eiStartDate', e.target.value)}
            />
          </div>
          <div>
            <Label>Montant AE hebdomadaire</Label>
            <Input
              type="number"
              value={testData.eiWeeklyAmount}
              onChange={(e) => handleInputChange('eiWeeklyAmount', e.target.value)}
            />
          </div>
        </div>

        <Button onClick={runTest} className="w-full bg-orange-600 hover:bg-orange-700">
          Lancer le Test
        </Button>

        {/* Résultats */}
        {results && (
          <div className="space-y-4">
            <h4 className="font-semibold text-orange-800">Résultats du Calcul</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-blue-800 mb-2">Salaires</h5>
                <div className="text-sm space-y-1">
                  <div><strong>Total:</strong> ${results.totalSalary.toLocaleString()}</div>
                  {results.details.salary.map((detail: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-600">
                      • {detail.description}: ${detail.amount.toLocaleString()}
                      <br />
                      <span className="text-gray-500">({detail.period})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-purple-800 mb-2">Autres Revenus</h5>
                <div className="text-sm space-y-1">
                  <div><strong>Total:</strong> ${results.totalOtherIncome.toLocaleString()}</div>
                  {results.details.other.map((detail: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-600">
                      • {detail.description}: ${detail.amount.toLocaleString()}
                      <br />
                      <span className="text-gray-500">({detail.period})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-center">
                <h5 className="font-semibold text-green-800">TOTAL GÉNÉRAL</h5>
                <div className="text-2xl font-bold text-green-900">
                  ${results.totalIncome.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exemple avec vos données */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Exemple avec vos données</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div><strong>Salaire:</strong> 1er janvier au 4 avril (3 mois) - Aux 2 semaines</div>
            <div><strong>Chômage:</strong> 6 avril au 6 décembre (8 mois) - Hebdomadaire</div>
            <div className="text-xs text-gray-500 mt-2">
              Utilisez les champs ci-dessus pour tester avec vos vraies dates et montants.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeCalculationTest;
