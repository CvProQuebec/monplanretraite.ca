import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserData } from '@/types';
import { calculateIncomeFromPeriods } from '@/utils/incomeCalculationUtils';

interface IncomeCalculationDebugProps {
  userData: UserData;
  isFrench: boolean;
}

const IncomeCalculationDebug: React.FC<IncomeCalculationDebugProps> = ({ userData, isFrench }) => {
  const personal = userData.personal || {};
  const retirement = userData.retirement || {};
  
  // Récupération des données unifiedIncome (utilisées dans la page Revenus)
  const unifiedIncome1 = (personal as any)?.unifiedIncome1 || [];
  const unifiedIncome2 = (personal as any)?.unifiedIncome2 || [];
  
  // Calculs pour Personne 1 - Utilisation de la nouvelle logique basée sur les périodes
  const income1Result = calculateIncomeFromPeriods(unifiedIncome1);
  const income2Result = calculateIncomeFromPeriods(unifiedIncome2);
  
  return (
    <Card className="bg-yellow-50 border-2 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">
          🐛 Debug - Calculs de Revenus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personne 1 */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-mpr-navy mb-2">Personne 1</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Salaire:</strong> ${income1Result.totalSalary.toLocaleString()}</div>
              <div><strong>Pensions:</strong> ${income1Result.totalPensions.toLocaleString()}</div>
              <div><strong>Autres revenus:</strong> ${income1Result.totalOtherIncome.toLocaleString()}</div>
              <div className="font-bold text-green-600"><strong>TOTAL:</strong> ${income1Result.totalIncome.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-2">
                <strong>Sources unifiedIncome:</strong> {unifiedIncome1.length} entrée(s)
              </div>
              
              {/* Détails des calculs */}
              {income1Result.details.salary.length > 0 && (
                <div className="mt-3 p-2 bg-mpr-interactive-lt rounded text-xs">
                  <strong>Détails Salaires:</strong>
                  {income1Result.details.salary.map((detail, idx) => (
                    <div key={idx} className="ml-2">
                      • {detail.description}: ${detail.amount.toLocaleString()} ({detail.period})
                    </div>
                  ))}
                </div>
              )}
              
              {income1Result.details.other.length > 0 && (
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <strong>Détails Autres Revenus:</strong>
                  {income1Result.details.other.map((detail, idx) => (
                    <div key={idx} className="ml-2">
                      • {detail.description}: ${detail.amount.toLocaleString()} ({detail.period})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Personne 2 */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-green-800 mb-2">Personne 2</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Salaire:</strong> ${income2Result.totalSalary.toLocaleString()}</div>
              <div><strong>Pensions:</strong> ${income2Result.totalPensions.toLocaleString()}</div>
              <div><strong>Autres revenus:</strong> ${income2Result.totalOtherIncome.toLocaleString()}</div>
              <div className="font-bold text-green-600"><strong>TOTAL:</strong> ${income2Result.totalIncome.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-2">
                <strong>Sources unifiedIncome:</strong> {unifiedIncome2.length} entrée(s)
              </div>
              
              {/* Détails des calculs */}
              {income2Result.details.salary.length > 0 && (
                <div className="mt-3 p-2 bg-mpr-interactive-lt rounded text-xs">
                  <strong>Détails Salaires:</strong>
                  {income2Result.details.salary.map((detail, idx) => (
                    <div key={idx} className="ml-2">
                      • {detail.description}: ${detail.amount.toLocaleString()} ({detail.period})
                    </div>
                  ))}
                </div>
              )}
              
              {income2Result.details.other.length > 0 && (
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <strong>Détails Autres Revenus:</strong>
                  {income2Result.details.other.map((detail, idx) => (
                    <div key={idx} className="ml-2">
                      • {detail.description}: ${detail.amount.toLocaleString()} ({detail.period})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Total combiné */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Total Combiné</h4>
          <div className="text-lg">
            <strong>Revenus totaux:</strong> ${(income1Result.totalIncome + income2Result.totalIncome).toLocaleString()}
          </div>
        </div>
        
        {/* Données brutes pour debug */}
        <div className="bg-mpr-interactive-lt p-4 rounded-lg">
          <h4 className="font-semibold text-mpr-navy mb-2">Données Brutes (Debug)</h4>
          <div className="text-xs text-gray-600 overflow-auto max-h-32">
            <pre>{JSON.stringify({
              unifiedIncome1: unifiedIncome1,
              unifiedIncome2: unifiedIncome2,
              personal: {
                salaire1: personal.salaire1,
                salaire2: personal.salaire2,
                pensions1: personal.pensions1,
                pensions2: personal.pensions2,
                autresRevenus1: personal.autresRevenus1,
                autresRevenus2: personal.autresRevenus2
              },
              retirement: {
                rrqMontantActuel1: retirement.rrqMontantActuel1,
                rrqMontantActuel2: retirement.rrqMontantActuel2,
                pensionPrivee1: retirement.pensionPrivee1,
                pensionPrivee2: retirement.pensionPrivee2
              }
            }, null, 2)}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeCalculationDebug;
