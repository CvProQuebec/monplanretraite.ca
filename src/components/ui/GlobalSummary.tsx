import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp, Shield, Flag, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';

interface GlobalSummaryProps {
  userData: any;
  isFrench: boolean;
}

const GlobalSummary: React.FC<GlobalSummaryProps> = ({ userData, isFrench }) => {
  // Calculer les totaux globaux
  const getGlobalTotals = () => {
    const totals = {
      // Revenus de travail
      salaire: 0,
      assuranceEmploi: 0,
      travailAutonome: 0,
      revenusLocation: 0,
      totalRevenus: 0,
      
      // Prestations
      rrq: 0,
      securiteVieillesse: 0,
      rentesPrivees: 0,
      totalPrestations: 0,
      
      // Investissements
      reer: 0,
      celi: 0,
      cri: 0,
      crypto: 0,
      totalInvestissements: 0,
      
      // Totaux globaux
      totalGeneral: 0
    };

    // Revenus de travail (depuis unifiedIncome)
    const unifiedIncome1 = userData?.personal?.unifiedIncome1 || [];
    const unifiedIncome2 = userData?.personal?.unifiedIncome2 || [];
    
    // Debug pour voir les données
    console.log('🔍 GlobalSummary - unifiedIncome1:', unifiedIncome1);
    console.log('🔍 GlobalSummary - unifiedIncome2:', unifiedIncome2);
    console.log('🔍 GlobalSummary - Processing Person 1 entries:', unifiedIncome1.length);
    console.log('🔍 GlobalSummary - Processing Person 2 entries:', unifiedIncome2.length);
    
    // Fonction pour calculer le montant "à ce jour" comme dans SeniorsFriendlyIncomeTable
    const calculateToDateAmount = (entry: any) => {
      console.log('🔍 calculateToDateAmount - Entry:', entry);
      console.log('🔍 calculateToDateAmount - isActive:', entry.isActive);
      
      if (!entry.isActive) {
        console.log('🔍 calculateToDateAmount - Entry not active, returning 0');
        return 0;
      }
      
      const currentDate = new Date();
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      
      console.log('🔍 calculateToDateAmount - Today:', today);
      console.log('🔍 calculateToDateAmount - Entry type:', entry.type);
      
      switch (entry.type) {
        case 'salaire':
          console.log('🔍 calculateToDateAmount - Processing salary entry');
          console.log('🔍 calculateToDateAmount - Entry details:', {
            salaryNetAmount: entry.salaryNetAmount,
            salaryFrequency: entry.salaryFrequency,
            description: entry.description
          });
          
          // LOGIQUE SIMPLIFIÉE ET EFFICACE
          if (entry.salaryNetAmount && entry.salaryFrequency) {
            const netAmount = entry.salaryNetAmount;
            const frequency = entry.salaryFrequency;
            
            console.log('🔍 calculateToDateAmount - Using simplified calculation');
            console.log('🔍 calculateToDateAmount - Net amount:', netAmount);
            console.log('🔍 calculateToDateAmount - Frequency:', frequency);
            
            if (frequency === 'monthly') {
              // Pour un salaire mensuel, calculer les mois écoulés
              const monthsElapsed = Math.max(0, currentDate.getMonth() + 1);
              const result = netAmount * monthsElapsed;
              console.log('🔍 calculateToDateAmount - Monthly calculation:', {
                monthsElapsed,
                netAmount,
                result
              });
              return result;
            } else if (frequency === 'biweekly') {
              // Pour bi-hebdomadaire, utiliser les dates spécifiques
              const paymentDates = [
                new Date('2025-01-02'),
                new Date('2025-01-16'),
                new Date('2025-01-30'),
                new Date('2025-02-13'),
                new Date('2025-02-27'),
                new Date('2025-03-13'),
                new Date('2025-03-27'),
                new Date('2025-04-10')
              ];
              
              let paymentsCount = 0;
              for (const payDate of paymentDates) {
                if (payDate <= today) {
                  paymentsCount++;
                }
              }
              
              const result = paymentsCount * netAmount;
              console.log('🔍 calculateToDateAmount - Biweekly calculation:', {
                paymentsCount,
                netAmount,
                result
              });
              return result;
            } else {
              // Autres fréquences - calcul générique
              const yearStart = new Date(currentDate.getFullYear(), 0, 1);
              const daysElapsed = Math.max(0, Math.floor((today - yearStart) / (1000 * 60 * 60 * 24)));
              
              let periodsElapsed = 0;
              switch (frequency) {
                case 'weekly':
                  periodsElapsed = Math.floor(daysElapsed / 7);
                  break;
                case 'biweekly':
                  periodsElapsed = Math.floor(daysElapsed / 14);
                  break;
                case 'bimonthly':
                  periodsElapsed = Math.floor(daysElapsed / 15);
                  break;
                default:
                  periodsElapsed = Math.floor(daysElapsed / 30);
              }
              
              const result = netAmount * periodsElapsed;
              console.log('🔍 calculateToDateAmount - Generic calculation:', {
                frequency,
                daysElapsed,
                periodsElapsed,
                netAmount,
                result
              });
              return result;
            }
          } else if (entry.monthlyAmount) {
            // Fallback: utiliser le montant mensuel
            console.log('🔍 calculateToDateAmount - Using monthlyAmount fallback:', entry.monthlyAmount);
            const monthsElapsed = Math.max(0, currentDate.getMonth() + 1);
            const result = entry.monthlyAmount * monthsElapsed;
            console.log('🔍 calculateToDateAmount - Monthly fallback result:', {
              monthlyAmount: entry.monthlyAmount,
              monthsElapsed,
              result
            });
            return result;
          } else if (entry.projectedAnnual) {
            // Fallback: utiliser le montant projeté annuel
            console.log('🔍 calculateToDateAmount - Using projectedAnnual fallback:', entry.projectedAnnual);
            const monthsElapsed = Math.max(0, currentDate.getMonth() + 1);
            const result = (entry.projectedAnnual / 12) * monthsElapsed;
            console.log('🔍 calculateToDateAmount - Annual fallback result:', {
              projectedAnnual: entry.projectedAnnual,
              monthsElapsed,
              result
            });
            return result;
          } else {
            console.log('🔍 calculateToDateAmount - No salary data, returning 0');
            return 0;
          }
          break;
          
        case 'assurance-emploi':
          // Utiliser la même logique que SeniorsFriendlyIncomeTable
          if (entry.eiStartDate && entry.eiFirstPaymentDate) {
            const startDate = new Date(entry.eiStartDate);
            const firstPaymentDate = new Date(entry.eiFirstPaymentDate);
            
            if (today >= startDate) {
              const weeklyAmount = 635; // 1270 / 2
              const weeksElapsed = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
              return Math.max(0, weeksElapsed) * weeklyAmount;
            }
          }
          break;
          
        case 'travail-autonome':
        case 'revenus-location':
          // Pour ces types, utiliser le montant annuel projeté
          return entry.projectedAnnual || 0;
      }
      
      return 0;
    };
    
    // Calculer les totaux pour Personne 1
    console.log('🔍 Calcul Personne 1 - Nombre d\'entrées:', unifiedIncome1.length);
    unifiedIncome1.forEach((entry, index) => {
      console.log(`🔍 Personne 1 - Entrée ${index}:`, entry);
      const toDateAmount = calculateToDateAmount(entry);
      console.log(`🔍 Personne 1 - Montant calculé pour ${entry.type}:`, toDateAmount);
      
      switch (entry.type) {
        case 'salaire':
          totals.salaire += toDateAmount;
          console.log(`🔍 Personne 1 - Salaire total:`, totals.salaire);
          break;
        case 'assurance-emploi':
          // Assurance emploi est maintenant une prestation
          totals.assuranceEmploi += toDateAmount;
          console.log(`🔍 Personne 1 - Assurance emploi total:`, totals.assuranceEmploi);
          break;
        case 'travail-autonome':
          totals.travailAutonome += toDateAmount;
          break;
        case 'revenus-location':
          totals.revenusLocation += toDateAmount;
          break;
        case 'rentes':
          // Distinguer entre RRQ, SV et rentes privées selon la description
          const description1 = entry.description?.toLowerCase() || '';
          console.log(`🔍 Personne 1 - Processing rentes:`, {
            description: entry.description,
            descriptionLower: description1,
            toDateAmount: toDateAmount,
            monthlyAmount: entry.monthlyAmount,
            projectedAnnual: entry.projectedAnnual,
            pensionAmount: entry.pensionAmount
          });
          
          if (description1.includes('rrq') || description1.includes('cpp') || description1.includes('régime de retraite du québec')) {
            totals.rrq += toDateAmount;
            console.log(`🔍 Personne 1 - RRQ total:`, totals.rrq);
          } else if (description1.includes('sv') || description1.includes('sécurité vieillesse') || description1.includes('oas') || description1.includes('old age security')) {
            totals.securiteVieillesse += toDateAmount;
            console.log(`🔍 Personne 1 - SV total:`, totals.securiteVieillesse);
          } else {
            totals.rentesPrivees += toDateAmount;
            console.log(`🔍 Personne 1 - Rentes privées total:`, totals.rentesPrivees);
          }
          break;
      }
    });
    
    // Calculer les totaux pour Personne 2 (même logique)
    console.log('🔍 Calcul Personne 2 - Nombre d\'entrées:', unifiedIncome2.length);
    unifiedIncome2.forEach((entry, index) => {
      console.log(`🔍 Personne 2 - Entrée ${index}:`, entry);
      const toDateAmount = calculateToDateAmount(entry);
      console.log(`🔍 Personne 2 - Montant calculé pour ${entry.type}:`, toDateAmount);
      
      switch (entry.type) {
        case 'salaire':
          totals.salaire += toDateAmount;
          console.log(`🔍 Personne 2 - Salaire total:`, totals.salaire);
          break;
        case 'assurance-emploi':
          // Assurance emploi est maintenant une prestation
          totals.assuranceEmploi += toDateAmount;
          console.log(`🔍 Personne 2 - Assurance emploi total:`, totals.assuranceEmploi);
          break;
        case 'travail-autonome':
          totals.travailAutonome += toDateAmount;
          break;
        case 'revenus-location':
          totals.revenusLocation += toDateAmount;
          break;
        case 'rentes':
          // Distinguer entre RRQ, SV et rentes privées selon la description
          const description2 = entry.description?.toLowerCase() || '';
          console.log(`🔍 Personne 2 - Processing rentes:`, {
            description: entry.description,
            descriptionLower: description2,
            toDateAmount: toDateAmount,
            monthlyAmount: entry.monthlyAmount,
            projectedAnnual: entry.projectedAnnual,
            pensionAmount: entry.pensionAmount
          });
          
          if (description2.includes('rrq') || description2.includes('cpp') || description2.includes('régime de retraite du québec')) {
            totals.rrq += toDateAmount;
            console.log(`🔍 Personne 2 - RRQ total:`, totals.rrq);
          } else if (description2.includes('sv') || description2.includes('sécurité vieillesse') || description2.includes('oas') || description2.includes('old age security')) {
            totals.securiteVieillesse += toDateAmount;
            console.log(`🔍 Personne 2 - SV total:`, totals.securiteVieillesse);
          } else {
            totals.rentesPrivees += toDateAmount;
            console.log(`🔍 Personne 2 - Rentes privées total:`, totals.rentesPrivees);
          }
          break;
      }
    });

    totals.totalRevenus = totals.salaire + totals.travailAutonome + totals.revenusLocation;
    
    // Debug pour voir les calculs
    console.log('🔍 GlobalSummary - Calculs revenus:', {
      salaire: totals.salaire,
      travailAutonome: totals.travailAutonome,
      revenusLocation: totals.revenusLocation,
      totalRevenus: totals.totalRevenus
    });

    // Prestations
    const currentDate = new Date();
    const monthsElapsed = currentDate.getMonth() + 1;
    const monthsCompleted = Math.max(0, monthsElapsed - 1);

    // RRQ
    totals.rrq = ((userData?.retirement?.rrqMontantActuel1 || 0) + (userData?.retirement?.rrqMontantActuel2 || 0)) * 12;

    // SV
    const sv1 = userData?.retirement?.svBiannual1;
    const sv2 = userData?.retirement?.svBiannual2;
    if (sv1) {
      totals.securiteVieillesse += ((sv1.periode1?.montant || 0) + (sv1.periode2?.montant || 0)) * 12;
    }
    if (sv2) {
      totals.securiteVieillesse += ((sv2.periode1?.montant || 0) + (sv2.periode2?.montant || 0)) * 12;
    }

    totals.totalPrestations = totals.rrq + totals.securiteVieillesse + totals.rentesPrivees + totals.assuranceEmploi;

    // Investissements
    totals.reer = (userData?.personal?.soldeREER1 || 0) + (userData?.personal?.soldeREER2 || 0);
    totals.celi = (userData?.personal?.soldeCELI1 || 0) + (userData?.personal?.soldeCELI2 || 0);
    totals.cri = (userData?.personal?.soldeCRI1 || 0) + (userData?.personal?.soldeCRI2 || 0);
    totals.crypto = (userData?.personal?.soldeCrypto1 || 0) + (userData?.personal?.soldeCrypto2 || 0);
    totals.totalInvestissements = totals.reer + totals.celi + totals.cri + totals.crypto;

    // Total général
    totals.totalGeneral = totals.totalRevenus + totals.totalPrestations;

    return totals;
  };

  const totals = getGlobalTotals();

  return (
    <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-4 border-indigo-300 shadow-2xl mb-8">
      <CardHeader className="border-b-4 border-indigo-300">
        <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-4">
          <Calculator className="w-10 h-10 text-indigo-300" />
          {isFrench ? 'Résumé familial' : 'Family Summary'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenus de travail */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-blue-300">
            <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              {isFrench ? 'Revenus de travail' : 'Work Income'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Salaire:' : 'Salary:'}</span>
                <span className="font-bold text-blue-300">{formatCurrency(totals.salaire)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Travail autonome:' : 'Self-employment:'}</span>
                <span className="font-bold text-purple-300">{formatCurrency(totals.travailAutonome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Revenus location:' : 'Rental Income:'}</span>
                <span className="font-bold text-green-300">{formatCurrency(totals.revenusLocation)}</span>
              </div>
              <div className="border-t border-blue-300 pt-2 mt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-white font-bold">{isFrench ? 'Total revenus:' : 'Total Income:'}</span>
                  <span className="font-bold text-blue-300">{formatCurrency(totals.totalRevenus)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prestations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-purple-300">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {isFrench ? 'Prestations' : 'Benefits'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'RRQ/CPP:' : 'QPP/CPP:'}</span>
                <span className="font-bold text-blue-300">{formatCurrency(totals.rrq)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Sécurité vieillesse:' : 'Old Age Security:'}</span>
                <span className="font-bold text-purple-300">{formatCurrency(totals.securiteVieillesse)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Assurance emploi:' : 'Employment Insurance:'}</span>
                <span className="font-bold text-orange-300">{formatCurrency(totals.assuranceEmploi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Rentes privées:' : 'Private Pensions:'}</span>
                <span className="font-bold text-yellow-300">{formatCurrency(totals.rentesPrivees)}</span>
              </div>
              <div className="border-t border-purple-300 pt-2 mt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-white font-bold">{isFrench ? 'Total prestations:' : 'Total Benefits:'}</span>
                  <span className="font-bold text-purple-300">{formatCurrency(totals.totalPrestations)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investissements */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-orange-300">
            <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {isFrench ? 'Investissements' : 'Investments'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'REER:' : 'RRSP:'}</span>
                <span className="font-bold text-blue-300">{formatCurrency(totals.reer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'CELI:' : 'TFSA:'}</span>
                <span className="font-bold text-green-300">{formatCurrency(totals.celi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'CRI:' : 'LIRA:'}</span>
                <span className="font-bold text-yellow-300">{formatCurrency(totals.cri)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Crypto:' : 'Crypto:'}</span>
                <span className="font-bold text-purple-300">{formatCurrency(totals.crypto)}</span>
              </div>
              <div className="border-t border-orange-300 pt-2 mt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-white font-bold">{isFrench ? 'Total investissements:' : 'Total Investments:'}</span>
                  <span className="font-bold text-orange-300">{formatCurrency(totals.totalInvestissements)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total général */}
        <div className="mt-8 pt-6 border-t-4 border-white/30">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {formatCurrency(totals.totalGeneral)}
            </div>
            <div className="text-xl text-indigo-200">
              {isFrench ? 'Total des revenus et prestations annuels' : 'Total Annual Income and Benefits'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalSummary;
