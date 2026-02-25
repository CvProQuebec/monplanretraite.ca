import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { IncomeEntry } from './SeniorsFriendlyIncomeTable';

interface IncomeTotalsSummaryProps {
  person1Data: IncomeEntry[];
  person2Data: IncomeEntry[];
  person1Name: string;
  person2Name: string;
  isFrench: boolean;
}

const IncomeTotalsSummary: React.FC<IncomeTotalsSummaryProps> = ({
  person1Data = [],
  person2Data = [],
  person1Name,
  person2Name,
  isFrench
}) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour calculer le montant annuel d'une entrée
  const calculateAnnualAmount = (entry: IncomeEntry): number => {
    if (!entry.isActive) return 0;

    switch (entry.type) {
      case 'salaire':
      case 'emploi-saisonnier':
        if (entry.salaryNetAmount && entry.salaryFrequency) {
          const multipliers = {
            weekly: 52,
            biweekly: 26,
            bimonthly: 24,
            monthly: 12
          };
          return entry.salaryNetAmount * (multipliers[entry.salaryFrequency] || 12);
        }
        return entry.annualAmount || 0;

      case 'rentes':
        if (entry.pensionAmount && entry.pensionFrequency) {
          const multipliers = {
            monthly: 12,
            quarterly: 4,
            'semi-annual': 2,
            annual: 1
          };
          return entry.pensionAmount * (multipliers[entry.pensionFrequency] || 12);
        }
        return (entry.monthlyAmount || 0) * 12;

      case 'revenus-location':
        return (entry.monthlyAmount || entry.annualAmount || 0) * (entry.monthlyAmount ? 12 : 1);

      case 'dividendes':
      case 'travail-autonome':
      case 'autres':
        return entry.annualAmount || 0;

      default:
        return 0;
    }
  };

  // Fonction pour calculer les totaux par type pour une personne
  const calculateTotalsByType = (data: IncomeEntry[]) => {
    const totals = {
      salaire: 0,
      'emploi-saisonnier': 0,
      dividendes: 0,
      'revenus-location': 0,
      'travail-autonome': 0,
      rentes: 0,
      autres: 0,
      total: 0
    };

    data.forEach(entry => {
      const annualAmount = calculateAnnualAmount(entry);
      if (totals.hasOwnProperty(entry.type)) {
        totals[entry.type as keyof typeof totals] += annualAmount;
      }
      totals.total += annualAmount;
    });

    return totals;
  };

  const person1Totals = calculateTotalsByType(person1Data);
  const person2Totals = calculateTotalsByType(person2Data);

  // Calcul des totaux combinés
  const combinedTotals = {
    salaire: person1Totals.salaire + person2Totals.salaire,
    'emploi-saisonnier': person1Totals['emploi-saisonnier'] + person2Totals['emploi-saisonnier'],
    dividendes: person1Totals.dividendes + person2Totals.dividendes,
    'revenus-location': person1Totals['revenus-location'] + person2Totals['revenus-location'],
    'travail-autonome': person1Totals['travail-autonome'] + person2Totals['travail-autonome'],
    rentes: person1Totals.rentes + person2Totals.rentes,
    autres: person1Totals.autres + person2Totals.autres,
    total: person1Totals.total + person2Totals.total
  };

  const incomeTypeLabels = {
    salaire: isFrench ? 'Salaires' : 'Salaries',
    'emploi-saisonnier': isFrench ? 'Emplois saisonniers' : 'Seasonal Employment',
    dividendes: isFrench ? 'Dividendes' : 'Dividends',
    'revenus-location': isFrench ? 'Revenus de location' : 'Rental Income',
    'travail-autonome': isFrench ? 'Travail autonome' : 'Self-Employment',
    rentes: isFrench ? 'Pensions/Rentes' : 'Pensions/Annuities',
    autres: isFrench ? 'Autres revenus' : 'Other Income'
  };

  const incomeTypeIcons = {
    salaire: '💼',
    'emploi-saisonnier': '🌦️',
    dividendes: '📈',
    'revenus-location': '🏠',
    'travail-autonome': '💻',
    rentes: '🏦',
    autres: '💰'
  };

  return (
    <Card className="bg-gradient-to-br from-mpr-interactive-lt to-green-50 border-4 border-mpr-border shadow-xl">
      <CardHeader className="border-b-4 border-mpr-border bg-gradient-to-r from-mpr-interactive-lt to-green-100">
        <CardTitle className="text-3xl font-bold text-mpr-navy flex items-center gap-4">
          <Calculator className="w-8 h-8 text-mpr-interactive" />
          <span>{isFrench ? 'Résumé des revenus de travail' : 'Work Income Summary'}</span>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Tableau des totaux par type */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-mpr-interactive-lt border-b-2 border-mpr-border">
                <th className="text-left p-4 text-lg font-bold text-mpr-navy">
                  {isFrench ? 'Type de revenu' : 'Income Type'}
                </th>
                <th className="text-right p-4 text-lg font-bold text-mpr-navy">
                  {person1Name}
                </th>
                <th className="text-right p-4 text-lg font-bold text-green-800">
                  {person2Name}
                </th>
                <th className="text-right p-4 text-lg font-bold text-purple-800">
                  {isFrench ? 'Total combiné' : 'Combined Total'}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(combinedTotals).filter(([key]) => key !== 'total').map(([type, combinedAmount]) => {
                const person1Amount = person1Totals[type as keyof typeof person1Totals];
                const person2Amount = person2Totals[type as keyof typeof person2Totals];
                
                // Ne pas afficher les lignes avec des montants zéro
                if (combinedAmount === 0) return null;

                return (
                  <tr key={type} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{incomeTypeIcons[type as keyof typeof incomeTypeIcons]}</span>
                      <span className="text-lg font-semibold text-gray-800">
                        {incomeTypeLabels[type as keyof typeof incomeTypeLabels]}
                      </span>
                    </td>
                    <td className="p-4 text-right text-lg font-semibold text-mpr-navy">
                      {person1Amount > 0 ? formatCurrency(person1Amount) : '-'}
                    </td>
                    <td className="p-4 text-right text-lg font-semibold text-green-700">
                      {person2Amount > 0 ? formatCurrency(person2Amount) : '-'}
                    </td>
                    <td className="p-4 text-right text-lg font-bold text-purple-700">
                      {formatCurrency(combinedAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-purple-100 to-mpr-interactive-lt border-t-4 border-purple-200">
                <td className="p-4 text-xl font-bold text-purple-800 flex items-center gap-3">
                  <DollarSign className="w-6 h-6" />
                  {isFrench ? 'TOTAL GÉNÉRAL' : 'GRAND TOTAL'}
                </td>
                <td className="p-4 text-right text-xl font-bold text-mpr-navy">
                  {formatCurrency(person1Totals.total)}
                </td>
                <td className="p-4 text-right text-xl font-bold text-green-800">
                  {formatCurrency(person2Totals.total)}
                </td>
                <td className="p-4 text-right text-2xl font-bold text-purple-800 bg-purple-200 rounded">
                  {formatCurrency(combinedTotals.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 p-4 bg-mpr-interactive-lt rounded-lg border-2 border-mpr-border">
          <h4 className="text-lg font-bold text-mpr-navy mb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {isFrench ? 'Informations sur les calculs' : 'Calculation Information'}
          </h4>
          <ul className="text-sm text-mpr-navy space-y-1">
            <li>• {isFrench ? 'Tous les montants sont calculés sur une base annuelle' : 'All amounts are calculated on an annual basis'}</li>
            <li>• {isFrench ? 'Seuls les revenus actifs sont inclus dans les totaux' : 'Only active income entries are included in totals'}</li>
            <li>• {isFrench ? 'Les fréquences de paiement sont converties automatiquement' : 'Payment frequencies are automatically converted'}</li>
            <li>• {isFrench ? 'Les totaux se mettent à jour en temps réel' : 'Totals update in real-time'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeTotalsSummary;
