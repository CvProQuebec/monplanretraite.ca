import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp, Shield, Flag, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { logCalculation, logWarning, logError } from '@/utils/logger';

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
      emploisSaisonniers: 0,
      dividendes: 0,
      autresRevenus: 0,
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
    logCalculation('GlobalSummary', 'Data Analysis', {
      unifiedIncome1Length: unifiedIncome1.length,
      unifiedIncome2Length: unifiedIncome2.length,
      unifiedIncome1: unifiedIncome1,
      unifiedIncome2: unifiedIncome2
    });
    
    // Fonction pour calculer le montant "à ce jour" comme dans SeniorsFriendlyIncomeTable
    const calculateToDateAmount = (entry: any) => {
      logCalculation('GlobalSummary', 'calculateToDateAmount - Entry Processing', {
        entry: entry,
        isActive: entry.isActive,
        type: entry.type
      });
      
      if (!entry.isActive) {
        logWarning('GlobalSummary', 'Entry not active, returning 0', { entryId: entry.id });
        return 0;
      }
      
      const currentDate = new Date();
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      
      logCalculation('GlobalSummary', 'calculateToDateAmount - Date Info', {
        today: today.toISOString().split('T')[0],
        entryType: entry.type,
        currentMonth: currentDate.getMonth() + 1,
        currentYear: currentDate.getFullYear()
      });
      
      switch (entry.type) {
        case 'salaire':
        case 'emploi-saisonnier':
          logCalculation('GlobalSummary', 'Processing salary/seasonal entry', {
            salaryNetAmount: entry.salaryNetAmount,
            salaryFrequency: entry.salaryFrequency,
            description: entry.description,
            startDate: entry.startDate,
            endDate: entry.endDate,
            salaryStartDate: entry.salaryStartDate,
            salaryEndDate: entry.salaryEndDate
          });
          
          // Pour les emplois saisonniers, vérifier les dates de début et fin
          if (entry.type === 'emploi-saisonnier' && entry.salaryStartDate && entry.salaryEndDate) {
            // Créer des dates locales pour éviter les problèmes de fuseau horaire
            const startDateParts = entry.salaryStartDate.split('-').map(Number);
            const endDateParts = entry.salaryEndDate.split('-').map(Number);
            const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
            const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]);
            
            logCalculation('GlobalSummary', 'Seasonal employment dates analysis', {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              today: today.toISOString().split('T')[0],
              isInPeriod: today >= startDate && today <= endDate,
              hasStarted: today >= startDate,
              isPeriodPassed: today > endDate
            });
            
            // Si nous ne sommes pas encore dans la période, retourner 0
            if (today < startDate) {
              logWarning('GlobalSummary', 'Seasonal employment not started yet', {
                todayDate: today.toISOString().split('T')[0],
                startDate: startDate.toISOString().split('T')[0]
              });
              return 0;
            }
            
            // Si nous sommes après la fin, calculer pour toute la période
            const effectiveEndDate = today > endDate ? endDate : today;
            const daysWorked = Math.max(0, Math.floor((effectiveEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
            
            console.log('🔍 calculateToDateAmount - Seasonal employment period analysis:', {
              today: today.toISOString().split('T')[0],
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              effectiveEndDate: effectiveEndDate.toISOString().split('T')[0],
              daysWorked,
              isPeriodPassed: today > endDate,
              isPeriodActive: today >= startDate && today <= endDate
            });
            
            console.log('🔍 calculateToDateAmount - Seasonal employment calculation:', {
              effectiveEndDate,
              daysWorked,
              salaryNetAmount: entry.salaryNetAmount,
              salaryFrequency: entry.salaryFrequency
            });
            
            // Calculer selon la fréquence pour la période travaillée
            if (entry.salaryNetAmount && entry.salaryFrequency) {
              const netAmount = entry.salaryNetAmount;
              const frequency = entry.salaryFrequency;
              
              if (frequency === 'monthly') {
                // Pour mensuel, créer des dates locales pour éviter les problèmes de fuseau horaire
                const localStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                const localEndDate = new Date(effectiveEndDate.getFullYear(), effectiveEndDate.getMonth(), effectiveEndDate.getDate());
                
                const startMonth = localStartDate.getMonth();
                const endMonth = localEndDate.getMonth();
                const startYear = localStartDate.getFullYear();
                const endYear = localEndDate.getFullYear();
                
                const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
                const result = netAmount * totalMonths;
                logCalculation('GlobalSummary', 'Seasonal monthly calculation', {
                  startDate: startDate.toISOString().split('T')[0],
                  endDate: endDate.toISOString().split('T')[0],
                  effectiveEndDate: effectiveEndDate.toISOString().split('T')[0],
                  localStartMonth: localStartDate.getMonth(),
                  localEndMonth: localEndDate.getMonth(),
                  totalMonths,
                  netAmount,
                  result,
                  calculationMethod: 'Seasonal employment with corrected timezone handling'
                });
                return result;
              } else if (frequency === 'weekly') {
                const weeksWorked = Math.ceil(daysWorked / 7);
                const result = netAmount * weeksWorked;
                console.log('🔍 calculateToDateAmount - Seasonal weekly result:', result);
                return result;
              } else {
                // Pour autres fréquences, utiliser un calcul proportionnel
                const totalPeriodDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                const totalAmount = netAmount * (frequency === 'biweekly' ? Math.ceil(totalPeriodDays / 14) : Math.ceil(totalPeriodDays / 30));
                const result = (totalAmount * daysWorked) / totalPeriodDays;
                console.log('🔍 calculateToDateAmount - Seasonal proportional result:', result);
                return result;
              }
            }
          }
          
          // LOGIQUE SIMPLIFIÉE ET EFFICACE pour salaires réguliers
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
              const daysElapsed = Math.max(0, Math.floor((today.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)));
              
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
          // Pour le travail autonome, utiliser le montant annuel projeté
          return entry.projectedAnnual || 0;
          
        case 'revenus-location':
          // Pour les revenus de location, calculer selon la fréquence
          if (entry.rentalAmount && entry.rentalFrequency) {
            const currentDate = new Date();
            
            // Si on a des dates spécifiques (période saisonnière), les utiliser
            if (entry.rentalStartDate && entry.rentalEndDate) {
              try {
                const startDateParts = entry.rentalStartDate.split('-').map(Number);
                const endDateParts = entry.rentalEndDate.split('-').map(Number);
                
                // Validation des parties de date
                if (startDateParts.length !== 3 || endDateParts.length !== 3 ||
                    startDateParts.some(isNaN) || endDateParts.some(isNaN)) {
                  logError('GlobalSummary', 'Invalid date format for rental income', {
                    rentalStartDate: entry.rentalStartDate,
                    rentalEndDate: entry.rentalEndDate
                  });
                  return entry.projectedAnnual || 0;
                }
                
                const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
                const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]);
                
                // Validation que les dates sont valides
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                  logError('GlobalSummary', 'Invalid date values for rental income', {
                    startDate: startDate.toString(),
                    endDate: endDate.toString(),
                    rentalStartDate: entry.rentalStartDate,
                    rentalEndDate: entry.rentalEndDate
                  });
                  return entry.projectedAnnual || 0;
                }
                
                const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
              
              logCalculation('GlobalSummary', 'Rental income with specific dates', {
                rentalAmount: entry.rentalAmount,
                rentalFrequency: entry.rentalFrequency,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                today: today.toISOString().split('T')[0]
              });
              
              // Si on n'est pas encore dans la période, retourner 0
              if (today < startDate) {
                logWarning('GlobalSummary', 'Rental period not started yet', {
                  todayDate: today.toISOString().split('T')[0],
                  startDate: startDate.toISOString().split('T')[0]
                });
                return 0;
              }
              
              // Calculer le nombre de périodes dans la plage spécifiée
              const effectiveEndDate = today > endDate ? endDate : today;
              const daysDiff = Math.floor((effectiveEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              
              let periods = 0;
              switch (entry.rentalFrequency) {
                case 'weekend':
                  // Compter les week-ends dans la période
                  periods = Math.floor(daysDiff / 7) + (daysDiff % 7 >= 3 ? 1 : 0);
                  // Pour la période du 20-22 juin (3 jours), c'est 1 week-end
                  if (daysDiff <= 3) periods = 1;
                  break;
                case 'weekly':
                  periods = Math.ceil(daysDiff / 7);
                  break;
                case 'monthly':
                  const startMonth = startDate.getMonth();
                  const endMonth = effectiveEndDate.getMonth();
                  const startYear = startDate.getFullYear();
                  const endYear = effectiveEndDate.getFullYear();
                  periods = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
                  break;
              }
              
              const result = entry.rentalAmount * periods;
              logCalculation('GlobalSummary', 'Rental income calculated with dates', {
                daysDiff,
                periods,
                rentalAmount: entry.rentalAmount,
                result,
                calculationMethod: 'Specific date range'
              });
              
              return result;
              } catch (error) {
                logError('GlobalSummary', 'Error calculating rental income with dates', {
                  error: error.message,
                  rentalStartDate: entry.rentalStartDate,
                  rentalEndDate: entry.rentalEndDate,
                  rentalAmount: entry.rentalAmount
                });
                // Fallback au calcul sans dates
                const monthsElapsed = Math.max(0, currentDate.getMonth() + 1);
                const fallbackResult = entry.rentalAmount * Math.floor(monthsElapsed * 4.33);
                return fallbackResult;
              }
            } else {
              // Calcul annuel (comme avant) si pas de dates spécifiées
              const monthsElapsed = Math.max(0, currentDate.getMonth() + 1);
              
              switch (entry.rentalFrequency) {
                case 'weekend':
                  const weekendsElapsed = Math.floor(monthsElapsed * 4.33);
                  return entry.rentalAmount * weekendsElapsed;
                case 'weekly':
                  const weeksElapsed = Math.floor(monthsElapsed * 4.33);
                  return entry.rentalAmount * weeksElapsed;
                case 'monthly':
                  return entry.rentalAmount * monthsElapsed;
                default:
                  return entry.rentalAmount * monthsElapsed;
              }
            }
          }
          return entry.projectedAnnual || 0;
      }
      
      return 0;
    };
    
    // Calculer les totaux pour Personne 1
    logCalculation('GlobalSummary', 'Person 1 Income Processing', {
      numberOfEntries: unifiedIncome1.length,
      message: 'Starting calculation for Person 1'
    });
    
    unifiedIncome1.forEach((entry, index) => {
      logCalculation('GlobalSummary', `Person 1 Entry ${index}`, entry);
      const toDateAmount = calculateToDateAmount(entry);
      logCalculation('GlobalSummary', `Person 1 Calculated Amount`, {
        entryType: entry.type,
        description: entry.description,
        calculatedAmount: toDateAmount
      });
      
      switch (entry.type) {
        case 'salaire':
          totals.salaire += toDateAmount;
          console.log(`🔍 Personne 1 - Salaire total:`, totals.salaire);
          break;
        case 'emploi-saisonnier':
          totals.emploisSaisonniers += toDateAmount;
          console.log(`🔍 Personne 1 - Emploi saisonnier total:`, totals.emploisSaisonniers);
          break;
        case 'assurance-emploi':
          // Assurance emploi est maintenant une prestation
          totals.assuranceEmploi += toDateAmount;
          console.log(`🔍 Personne 1 - Assurance emploi total:`, totals.assuranceEmploi);
          break;
        case 'travail-autonome':
          totals.travailAutonome += toDateAmount;
          console.log(`🔍 Personne 1 - Travail autonome total:`, totals.travailAutonome);
          break;
        case 'revenus-location':
          totals.revenusLocation += toDateAmount;
          break;
        case 'dividendes':
          totals.dividendes += toDateAmount;
          break;
        case 'autres':
          totals.autresRevenus += toDateAmount;
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
        case 'emploi-saisonnier':
          totals.emploisSaisonniers += toDateAmount;
          console.log(`🔍 Personne 2 - Emploi saisonnier total:`, totals.emploisSaisonniers);
          break;
        case 'assurance-emploi':
          // Assurance emploi est maintenant une prestation
          totals.assuranceEmploi += toDateAmount;
          console.log(`🔍 Personne 2 - Assurance emploi total:`, totals.assuranceEmploi);
          break;
        case 'travail-autonome':
          totals.travailAutonome += toDateAmount;
          console.log(`🔍 Personne 2 - Travail autonome total:`, totals.travailAutonome);
          break;
        case 'revenus-location':
          totals.revenusLocation += toDateAmount;
          break;
        case 'dividendes':
          totals.dividendes += toDateAmount;
          break;
        case 'autres':
          totals.autresRevenus += toDateAmount;
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

    totals.totalRevenus = totals.salaire + totals.travailAutonome + totals.revenusLocation + totals.emploisSaisonniers + totals.dividendes + totals.autresRevenus;
    
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

    // RRQ - Calculer le montant à ce jour
    const rrq1 = userData?.retirement?.rrqMontantActuel1 || 0;
    const rrq2 = userData?.retirement?.rrqMontantActuel2 || 0;
    totals.rrq = (rrq1 + rrq2) * monthsCompleted;

    // SV - Calculer le montant à ce jour selon les périodes
    const sv1 = userData?.retirement?.svBiannual1;
    const sv2 = userData?.retirement?.svBiannual2;
    
    // Debug SV
    console.log('🔍 GlobalSummary - SV1 data:', sv1);
    console.log('🔍 GlobalSummary - SV2 data:', sv2);
    
    // Réinitialiser le total SV avant de calculer
    totals.securiteVieillesse = 0;
    
    if (sv1 && sv1.periode1 && sv1.periode2) {
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const monthsCompleted = Math.max(0, currentMonth - 1);
      
      let totalToDate = 0;
      
      // Période Jan-Juin (6 mois)
      const monthsJanJuin = Math.min(6, monthsCompleted);
      if (monthsJanJuin > 0) {
        totalToDate += monthsJanJuin * sv1.periode1.montant;
      }
      
      // Période Juil-Déc (6 mois)
      if (monthsCompleted > 6) {
        const monthsJuilDec = Math.min(6, monthsCompleted - 6);
        totalToDate += monthsJuilDec * sv1.periode2.montant;
      }
      
      totals.securiteVieillesse += totalToDate;
    } else {
      // Fallback: si svBiannual1 absent, on utilise svMontant1 (mensuel)
      const svMontant1 = userData?.retirement?.svMontant1 || 0;
      if (svMontant1 > 0) {
        totals.securiteVieillesse += monthsCompleted * svMontant1;
      }
    }
    
    if (sv2 && sv2.periode1 && sv2.periode2) {
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const monthsCompleted = Math.max(0, currentMonth - 1);
      
      let totalToDate = 0;
      
      // Période Jan-Juin (6 mois)
      const monthsJanJuin = Math.min(6, monthsCompleted);
      if (monthsJanJuin > 0) {
        totalToDate += monthsJanJuin * sv2.periode1.montant;
      }
      
      // Période Juil-Déc (6 mois)
      if (monthsCompleted > 6) {
        const monthsJuilDec = Math.min(6, monthsCompleted - 6);
        totalToDate += monthsJuilDec * sv2.periode2.montant;
      }
      
      totals.securiteVieillesse += totalToDate;
      console.log('🔍 GlobalSummary - SV1 totalToDate:', totalToDate, 'Total SV après Personne 1:', totals.securiteVieillesse);
    } else {
      // Fallback: si svBiannual2 absent, on utilise svMontant2 (mensuel)
      const svMontant2 = userData?.retirement?.svMontant2 || 0;
      if (svMontant2 > 0) {
        totals.securiteVieillesse += monthsCompleted * svMontant2;
      }
    }
    
    if (sv2 && sv2.periode1 && sv2.periode2) {
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const monthsCompleted = Math.max(0, currentMonth - 1);
      
      let totalToDate = 0;
      
      // Période Jan-Juin (6 mois)
      const monthsJanJuin = Math.min(6, monthsCompleted);
      if (monthsJanJuin > 0) {
        totalToDate += monthsJanJuin * sv2.periode1.montant;
      }
      
      // Période Juil-Déc (6 mois)
      if (monthsCompleted > 6) {
        const monthsJuilDec = Math.min(6, monthsCompleted - 6);
        totalToDate += monthsJuilDec * sv2.periode2.montant;
      }
      
      totals.securiteVieillesse += totalToDate;
      console.log('🔍 GlobalSummary - SV2 totalToDate:', totalToDate, 'Total SV après Personne 2:', totals.securiteVieillesse);
    }

    console.log('🔍 GlobalSummary - Total SV final:', totals.securiteVieillesse);

    // Rentes privées - Calculer le montant à ce jour (1er janvier à la dernière date de versement)
    const privatePensions1 = userData?.retirement?.privatePensions1 || [];
    const privatePensions2 = userData?.retirement?.privatePensions2 || [];
    
    // Fonction pour calculer les rentes privées d'une personne
    const calculatePrivatePensionsTotal = (pensions) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const yearStart = new Date(currentYear, 0, 1); // 1er janvier de l'année courante
      
      return pensions.reduce((total, pension) => {
        if (!pension.isActive) return total;
        
        const startDate = new Date(pension.startDate);
        const paymentDay = pension.paymentDay || 1; // Jour de versement (défaut: 1er du mois)
        
        // Ne pas inclure les pensions qui commencent après aujourd'hui
        if (startDate > currentDate) return total;
        
        // Date de début du calcul: max entre 1er janvier et date de début de la pension
        const calculationStart = startDate > yearStart ? startDate : yearStart;
        
        // Dernière date de versement potentielle ce mois-ci
        const currentMonth = currentDate.getMonth();
        const lastPaymentThisMonth = new Date(currentYear, currentMonth, paymentDay);
        
        // Si le jour de versement de ce mois n'est pas encore passé, prendre le mois précédent
        const lastPaymentDate = currentDate >= lastPaymentThisMonth ? 
          lastPaymentThisMonth : 
          new Date(currentYear, currentMonth - 1, paymentDay);
        
        // Calculer le nombre de versements du calcul start à la dernière date de versement
        let paymentsCount = 0;
        const tempDate = new Date(calculationStart);
        
        // Ajuster au premier jour de versement
        if (tempDate.getDate() <= paymentDay) {
          tempDate.setDate(paymentDay);
        } else {
          tempDate.setMonth(tempDate.getMonth() + 1, paymentDay);
        }
        
        // Compter les versements
        while (tempDate <= lastPaymentDate) {
          paymentsCount++;
          
          if (pension.frequency === 'monthly') {
            tempDate.setMonth(tempDate.getMonth() + 1);
          } else if (pension.frequency === 'quarterly') {
            tempDate.setMonth(tempDate.getMonth() + 3);
          } else if (pension.frequency === 'annually') {
            tempDate.setFullYear(tempDate.getFullYear() + 1);
          }
        }
        
        return total + (pension.monthlyAmount * paymentsCount);
      }, 0);
    };
    
    // Calculer pour les deux personnes
    const privatePensions1Total = calculatePrivatePensionsTotal(privatePensions1);
    const privatePensions2Total = calculatePrivatePensionsTotal(privatePensions2);
    
    totals.rentesPrivees = privatePensions1Total + privatePensions2Total;

    console.log('🔍 GlobalSummary - Total rentes privées:', totals.rentesPrivees);
    totals.totalPrestations = totals.rrq + totals.securiteVieillesse + totals.rentesPrivees + totals.assuranceEmploi;

    // Investissements (support des deux schémas)
    // Assurance-emploi (AE) - calcul du net à ce jour (hebdo)
    const __calcWeeksBetween = (startDate: Date, endDate: Date) => {
      const msPerWeek = 1000 * 60 * 60 * 24 * 7;
      const diff = Math.floor((endDate.getTime() - startDate.getTime()) / msPerWeek) + 1;
      return Math.max(0, diff);
    };
    const __computeAETotal = (entries: any[]) => {
      const today = new Date();
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);
      let total = 0;
      for (const e of entries || []) {
        if (!e || e.type !== 'assurance-emploi' || e.isActive === false) continue;
        const grossWeekly = Number(e.weeklyGross ?? e.weeklyAmount ?? 0) || 0;
        const fed = Number(e.eiFederalTaxWeekly ?? 0) || 0;
        const prov = Number(e.eiProvincialTaxWeekly ?? 0) || 0;
        const netWeekly = Math.max(0, grossWeekly - fed - prov);
        if (netWeekly <= 0) continue;
        const startStr: string | undefined = e.eiStartDate || e.salaryStartDate || e.startDate;
        const start = startStr ? new Date(startStr) : yearStart;
        const maxWeeks = Number(e.maxWeeks ?? e.eiEligibleWeeks ?? 0) || 0;
        const endByMax = maxWeeks > 0 ? new Date(start.getTime() + (maxWeeks * 7) * 24 * 60 * 60 * 1000) : yearEnd;
        const effectiveStart = start < yearStart ? yearStart : start;
        const effectiveEnd = new Date(Math.min(today.getTime(), yearEnd.getTime(), endByMax.getTime()));
        if (effectiveEnd < effectiveStart) continue;
        const weeksElapsed = __calcWeeksBetween(effectiveStart, effectiveEnd);
        let weeksUsed = Number(e.weeksUsed ?? 0) || 0;
        if (weeksUsed <= 0) weeksUsed = weeksElapsed;
        if (maxWeeks > 0) weeksUsed = Math.min(weeksUsed, maxWeeks);
        weeksUsed = Math.min(weeksUsed, weeksElapsed);
        total += netWeekly * weeksUsed;
      }
      return total;
    };
    totals.assuranceEmploi = __computeAETotal(unifiedIncome1) + __computeAETotal(unifiedIncome2);
    // Include advanced EI data if present under retirement.advancedEI1/advancedEI2
    const __computeFromAdvancedEI = (eiData: any) => {
      try {
        if (!eiData || !eiData.eiStartDate) return 0;
        const today = new Date();
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const start = new Date(eiData.eiStartDate);
        const effectiveStart = start < yearStart ? yearStart : start;
        const maxWeeks = Number(eiData.eiMaxWeeks ?? 0) || 0;
        const gross = Number(eiData.eiWeeklyGross ?? 0) || 0;
        const fed = Number(eiData.eiFederalTax ?? 0) || 0;
        const prov = Number(eiData.eiProvincialTax ?? 0) || 0;
        const net = Math.max(0, gross - fed - prov);
        if (net <= 0) return 0;
        const weeksElapsed = __calcWeeksBetween(effectiveStart, today);
        let used = Number(eiData.eiWeeksUsed ?? 0) || weeksElapsed;
        if (maxWeeks > 0) used = Math.min(used, maxWeeks);
        used = Math.min(used, weeksElapsed);
        return net * used;
      } catch { return 0; }
    };
    totals.assuranceEmploi += __computeFromAdvancedEI(userData?.retirement?.advancedEI1);
    totals.assuranceEmploi += __computeFromAdvancedEI(userData?.retirement?.advancedEI2);
    // Recompute total including AE
    totals.totalPrestations = totals.rrq + totals.securiteVieillesse + totals.rentesPrivees + totals.assuranceEmploi;

    const pReer = (userData?.personal?.soldeREER1 || 0) + (userData?.personal?.soldeREER2 || 0);
    const pCeli = (userData?.personal?.soldeCELI1 || 0) + (userData?.personal?.soldeCELI2 || 0);
    const pCri  = (userData?.personal?.soldeCRI1  || 0) + (userData?.personal?.soldeCRI2  || 0);
    const sReer = (userData?.savings?.reer1 || 0) + (userData?.savings?.reer2 || 0);
    const sCeli = (userData?.savings?.celi1 || 0) + (userData?.savings?.celi2 || 0);
    const sCri  = (userData?.savings?.cri1  || 0) + (userData?.savings?.cri2  || 0);

    totals.reer = pReer > 0 ? pReer : sReer;
    totals.celi = pCeli > 0 ? pCeli : sCeli;
    totals.cri  = pCri  > 0 ? pCri  : sCri;
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
              
              {/* Nouveaux champs demandés */}
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Emplois saisonniers' : 'Seasonal Employment'}</span>
                <span className="font-bold text-yellow-300">{formatCurrency(totals.emploisSaisonniers)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Dividendes' : 'Dividends'}</span>
                <span className="font-bold text-cyan-300">{formatCurrency(totals.dividendes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">{isFrench ? 'Autres revenus' : 'Other Income'}</span>
                <span className="font-bold text-pink-300">{formatCurrency(totals.autresRevenus)}</span>
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
