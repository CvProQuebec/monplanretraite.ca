import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag, Calendar, DollarSign, TrendingUp, Info } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';

interface RRQSummaryProps {
  personNumber: 1 | 2;
  userData: any;
  isFrench: boolean;
}

const RRQSummary: React.FC<RRQSummaryProps> = ({
  personNumber,
  userData,
  isFrench
}) => {
  // Récupérer les données RRQ
  const rrqBiannual = personNumber === 1 
    ? userData?.retirement?.rrqBiannual1 
    : userData?.retirement?.rrqBiannual2;

  const rrqMontantActuel = personNumber === 1 
    ? userData?.retirement?.rrqMontantActuel1 
    : userData?.retirement?.rrqMontantActuel2;

  // Si pas de données biannuelles, utiliser les données existantes
  const montantMensuelActuel = rrqBiannual?.periode1?.montantMensuel 
    ? parseFloat(rrqBiannual.periode1.montantMensuel)
    : (rrqMontantActuel || 0);

  // Calculer les totaux
  const totalPeriode1 = rrqBiannual?.periode1?.montantMensuel 
    ? parseFloat(rrqBiannual.periode1.montantMensuel) * 6 
    : (montantMensuelActuel * 6);
  
  const totalPeriode2 = rrqBiannual?.periode2?.montantMensuel 
    ? parseFloat(rrqBiannual.periode2.montantMensuel) * 6 
    : (montantMensuelActuel * 6);
  
  const totalAnnuel = totalPeriode1 + totalPeriode2;
  
  // Calculer le montant à ce jour
  const currentMonth = new Date().getMonth() + 1;
  let montantActuel = 0;
  
  if (rrqBiannual?.periode1?.montantMensuel) {
    // Utiliser les données biannuelles
    if (currentMonth <= 6) {
      // Période 1
      montantActuel = parseFloat(rrqBiannual.periode1.montantMensuel) * currentMonth;
    } else {
      // Période 2
      montantActuel = totalPeriode1 + (rrqBiannual?.periode2?.montantMensuel 
        ? parseFloat(rrqBiannual.periode2.montantMensuel) * (currentMonth - 6) 
        : 0);
    }
  } else {
    // Utiliser les données existantes
    montantActuel = montantMensuelActuel * currentMonth;
  }

  // Calculer la différence entre les périodes
  const difference = totalPeriode2 - totalPeriode1;
  const isRecuperation = difference > 0;

  return (
    <Card className="bg-white border-2 border-mpr-border shadow-lg">
      <CardHeader className="bg-mpr-interactive-lt border-b-2 border-mpr-border">
        <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
          <Flag className="w-6 h-6" />
          {isFrench ? 'Résumé RRQ/CPP 2025' : 'RRQ/CPP 2025 Summary'}
        </CardTitle>
        <p className="text-sm text-mpr-interactive">
          {isFrench 
            ? 'Personne ' + personNumber + ' - Synthèse des montants RRQ'
            : 'Person ' + personNumber + ' - RRQ amounts summary'
          }
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Montant actuel */}
        <div className="bg-mpr-interactive-lt p-4 rounded-lg border border-mpr-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-mpr-interactive" />
            <h3 className="text-lg font-semibold text-mpr-navy">
              {isFrench ? 'Montant actuel' : 'Current Amount'}
            </h3>
          </div>
          <p className="text-2xl font-bold text-mpr-interactive">
            {formatCurrency(montantActuel)}
          </p>
          <p className="text-sm text-mpr-interactive mt-1">
            {isFrench 
              ? 'Montant reçu à ce jour en 2025'
              : 'Amount received to date in 2025'
            }
          </p>
        </div>

        {/* Détail par période */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Période 1 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-800">
                {isFrench ? 'Période 1' : 'Period 1'}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Janvier - Juin' : 'January - June'}
                </span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(totalPeriode1)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {isFrench ? 'Mensuel:' : 'Monthly:'}
                </span>
                <span>
                  {rrqBiannual?.periode1?.montantMensuel 
                    ? formatCurrency(parseFloat(rrqBiannual.periode1.montantMensuel))
                    : formatCurrency(montantMensuelActuel)
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Période 2 */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-gray-800">
                {isFrench ? 'Période 2' : 'Period 2'}
              </h4>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {isFrench ? 'Récupération' : 'Recovery'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Juillet - Décembre' : 'July - December'}
                </span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(totalPeriode2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {isFrench ? 'Mensuel:' : 'Monthly:'}
                </span>
                <span>
                  {rrqBiannual?.periode2?.montantMensuel 
                    ? formatCurrency(parseFloat(rrqBiannual.periode2.montantMensuel))
                    : formatCurrency(montantMensuelActuel)
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparaison des périodes */}
        {isRecuperation && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                {isFrench ? 'Récupération fiscale' : 'Tax Recovery'}
              </h3>
            </div>
            <p className="text-green-700">
              {isFrench 
                ? `Augmentation de ${formatCurrency(difference)} pour la période 2`
                : `Increase of ${formatCurrency(difference)} for period 2`
              }
            </p>
            <p className="text-sm text-green-600 mt-1">
              {isFrench 
                ? 'Basé sur les revenus de 2024'
                : 'Based on 2024 income'
              }
            </p>
          </div>
        )}

        {/* Total annuel */}
        <div className="bg-mpr-interactive-lt p-4 rounded-lg border border-mpr-border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-mpr-navy">
              {isFrench ? 'Total annuel 2025' : 'Total Annual 2025'}
            </h3>
            <span className="text-2xl font-bold text-mpr-interactive">
              {formatCurrency(totalAnnuel)}
            </span>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">
                {isFrench ? 'Informations importantes:' : 'Important information:'}
              </p>
              <ul className="space-y-1 text-xs">
                <li>• {isFrench 
                  ? 'Les montants sont calculés automatiquement selon les périodes définies'
                  : 'Amounts are automatically calculated according to defined periods'
                }</li>
                <li>• {isFrench 
                  ? 'La récupération fiscale est basée sur les revenus de 2024'
                  : 'Tax recovery is based on 2024 income'
                }</li>
                <li>• {isFrench 
                  ? 'Les paiements sont effectués le dernier jour ouvrable du mois'
                  : 'Payments are made on the last business day of the month'
                }</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RRQSummary;
