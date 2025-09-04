// ===== SERVICE DE SYNCHRONISATION DES REVENUS =====
// Synchronise les revenus entre les profils 1 et 2 pour l'analyse de longévité

import { UserData } from '@/types';

export interface SynchronizedIncomeData {
  totalHouseholdIncome: number;
  person1Income: number;
  person2Income: number;
  monthlyHouseholdIncome: number;
  annualHouseholdIncome: number;
  incomeMultiplier: number;
  sectorImpact: number;
}

export class IncomeSynchronizationService {
  
  /**
   * Synchronise les revenus totaux entre les profils 1 et 2
   */
  static synchronizeHouseholdIncome(userData: UserData): SynchronizedIncomeData {
    const personal = userData.personal || {};
    
    // Revenus individuels
    const person1Income = personal.salaire1 || 0;
    const person2Income = personal.salaire2 || 0;
    
    // Revenus totaux du ménage
    const totalHouseholdIncome = person1Income + person2Income;
    const monthlyHouseholdIncome = totalHouseholdIncome / 12;
    const annualHouseholdIncome = totalHouseholdIncome;
    
    // Multiplicateur basé sur les revenus (revenus plus élevés = meilleure santé)
    const incomeMultiplier = totalHouseholdIncome > 0 ? 
      Math.min(1.15, 1 + (totalHouseholdIncome / 100000) * 0.05) : 1.0;
    
    // Impact du secteur d'activité sur la longévité
    const sectorImpact = this.calculateSectorLongevityImpact(
      personal.secteurActivite1,
      personal.secteurActivite2
    );
    
    return {
      totalHouseholdIncome,
      person1Income,
      person2Income,
      monthlyHouseholdIncome,
      annualHouseholdIncome,
      incomeMultiplier,
      sectorImpact
    };
  }
  
  /**
   * Calcule l'impact du secteur d'activité sur la longévité
   */
  private static calculateSectorLongevityImpact(sector1?: string, sector2?: string): number {
    const sectorImpacts: { [key: string]: number } = {
      'sante': 0.5,        // Secteur santé = meilleure longévité
      'education': 0.3,     // Éducation = longévité positive
      'technologie': 0.2,   // Technologie = légèrement positif
      'finance': 0.1,       // Finance = légèrement positif
      'services': 0.0,      // Services = neutre
      'commerce': -0.1,     // Commerce = légèrement négatif
      'construction': -0.3, // Construction = plus risqué
      'manufacturier': -0.2, // Manufacturier = légèrement négatif
      'autre': 0.0          // Autre = neutre
    };
    
    const impact1 = sector1 ? (sectorImpacts[sector1] || 0) : 0;
    const impact2 = sector2 ? (sectorImpacts[sector2] || 0) : 0;
    
    // Moyenne des impacts des deux secteurs
    return (impact1 + impact2) / 2;
  }
  
  /**
   * Calcule l'impact des revenus sur l'espérance de vie
   */
  static calculateIncomeLongevityImpact(incomeData: SynchronizedIncomeData): {
    lifeExpectancyAdjustment: number;
    healthMultiplier: number;
    stressReduction: number;
  } {
    const { totalHouseholdIncome, incomeMultiplier, sectorImpact } = incomeData;
    
    // Ajustement de l'espérance de vie basé sur les revenus
    let lifeExpectancyAdjustment = 0;
    
    if (totalHouseholdIncome > 150000) {
      lifeExpectancyAdjustment = 2.0; // Revenus très élevés
    } else if (totalHouseholdIncome > 100000) {
      lifeExpectancyAdjustment = 1.5; // Revenus élevés
    } else if (totalHouseholdIncome > 75000) {
      lifeExpectancyAdjustment = 1.0; // Revenus moyens-élevés
    } else if (totalHouseholdIncome > 50000) {
      lifeExpectancyAdjustment = 0.5; // Revenus moyens
    } else if (totalHouseholdIncome > 30000) {
      lifeExpectancyAdjustment = 0.0; // Revenus moyens-faibles
    } else {
      lifeExpectancyAdjustment = -0.5; // Revenus faibles
    }
    
    // Multiplicateur de santé basé sur les revenus
    const healthMultiplier = incomeMultiplier;
    
    // Réduction du stress basée sur la stabilité financière
    const stressReduction = Math.min(0.3, totalHouseholdIncome / 200000);
    
    return {
      lifeExpectancyAdjustment: lifeExpectancyAdjustment + sectorImpact,
      healthMultiplier,
      stressReduction
    };
  }
  
  /**
   * Met à jour les données utilisateur avec les revenus synchronisés
   */
  static updateUserDataWithSynchronizedIncome(
    userData: UserData,
    updateUserData: (section: string, data: any) => void
  ): void {
    const incomeData = this.synchronizeHouseholdIncome(userData);
    
    // Mettre à jour les données personnelles avec les revenus synchronisés
    updateUserData('personal', {
      ...userData.personal,
      totalHouseholdIncome: incomeData.totalHouseholdIncome,
      monthlyHouseholdIncome: incomeData.monthlyHouseholdIncome,
      incomeMultiplier: incomeData.incomeMultiplier,
      sectorLongevityImpact: incomeData.sectorImpact
    });
  }
}
