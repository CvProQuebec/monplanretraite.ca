// src/features/retirement/services/CalculationService.ts - MODIFICATIONS POUR RREGOP

// Ajouts à faire dans votre CalculationService existant

import { RREGOPService, RREGOPData } from './RREGOPService';
import { RREGOPIntegratedCalculation } from '../types/rregop-types';

// ===== NOUVEAUX TYPES POUR INTEGRATION =====

export interface CalculationsWithRREGOP extends Calculations {
  // Résultats RREGOP pour chaque personne
  rregopAnalysis?: {
    person1?: RREGOPIntegratedCalculation;
    person2?: RREGOPIntegratedCalculation;
  };
  
  // Impact RREGOP sur les calculs existants
  rregopIntegration?: {
    totalMonthlyIncomeWithRREGOP: number;
    replacementRateWithRREGOP: number;
    retirementGapWithRREGOP: number;
    recommendedAdditionalSavingsWithRREGOP: number;
  };
}

// ===== AJOUTS DANS LA CLASSE CALCULATIONSERVICE =====

export class CalculationService {
  
  // ... toutes vos méthodes existantes restent inchangées ...

  /**
   * NOUVELLE MÉTHODE: Calcule tout avec intégration RREGOP
   */
  static calculateAllWithRREGOP(userData: UserDataRREGOPExtended): CalculationsWithRREGOP {
    try {
      // 1. Calculs de base existants (inchangés)
      const baseCalculations = this.calculateAll(userData as UserData);
      
      // 2. Calculs RREGOP spécifiques
      const rregopAnalysis = this.calculateRREGOPAnalysis(userData);
      
      // 3. Intégration RREGOP avec les autres calculs
      const rregopIntegration = this.integrateRREGOPWithOtherCalculations(
        baseCalculations, 
        rregopAnalysis, 
        userData
      );
      
      return {
        ...baseCalculations,
        rregopAnalysis,
        rregopIntegration
      };
      
    } catch (error) {
      console.error('Erreur calculs avec RREGOP:', error);
      // Fallback vers calculs de base si RREGOP échoue
      return {
        ...this.calculateAll(userData as UserData),
        rregopAnalysis: undefined,
        rregopIntegration: undefined
      };
    }
  }

  /**
   * NOUVELLE MÉTHODE: Analyse RREGOP pour les deux personnes
   */
  private static calculateRREGOPAnalysis(userData: UserDataRREGOPExtended): {
    person1?: RREGOPIntegratedCalculation;
    person2?: RREGOPIntegratedCalculation;
  } {
    const analysis: any = {};

    // Analyse personne 1
    if (userData.rregopData?.person1?.estMembreRREGOP) {
      try {
        analysis.person1 = this.calculatePersonRREGOP(userData, 'person1');
      } catch (error) {
        console.error('Erreur RREGOP personne 1:', error);
      }
    }

    // Analyse personne 2
    if (userData.rregopData?.person2?.estMembreRREGOP) {
      try {
        analysis.person2 = this.calculatePersonRREGOP(userData, 'person2');
      } catch (error) {
        console.error('Erreur RREGOP personne 2:', error);
      }
    }

    return analysis;
  }

  /**
   * NOUVELLE MÉTHODE: Calcul RREGOP pour une personne
   */
  private static calculatePersonRREGOP(
    userData: UserDataRREGOPExtended, 
    person: 'person1' | 'person2'
  ): RREGOPIntegratedCalculation {
    
    const rregopMemberData = userData.rregopData?.[person];
    if (!rregopMemberData || !rregopMemberData.estMembreRREGOP) {
      throw new Error(`Pas de données RREGOP pour ${person}`);
    }

    // Construire les données RREGOP pour le service
    const rregopData: RREGOPData = {
      numeroMembre: rregopMemberData.numeroMembre || '',
      dateEmbauche: new Date(rregopMemberData.dateEmbauche || ''),
      statutEmploi: rregopMemberData.statutEmploi || 'actif',
      salaireAdmissible: rregopMemberData.salaireAdmissibleActuel || 0,
      salairesMoyens: rregopMemberData.historiqueSalaires?.map(h => h.salaire) || [],
      anneesService: rregopMemberData.anneesServiceTotal || 0,
      anneesServiceCredit: (rregopMemberData.anneesServiceTotal || 0) + (rregopMemberData.anneesRachetees || 0),
      typeRegime: rregopMemberData.typeRegime || 'RREGOP',
      planRetraite: this.mapPlanRetraite(rregopMemberData.planRetraiteChoisi),
      coordinationRRQ: rregopMemberData.coordinationRRQActivée !== false,
      facteurCoordination: 0.7,
      cotisationsAccumulees: rregopMemberData.cotisationsEmploye || 0,
      cotisationsEmployeur: rregopMemberData.cotisationsEmployeur || 0,
      ageRetraiteNormale: 60,
      ageRetraiteAnticipee: rregopMemberData.planRetraiteChoisi === 'anticipe' ? rregopMemberData.ageRetraitePrevu : undefined,
      ageRetraiteDifferee: rregopMemberData.planRetraiteChoisi === 'differe' ? rregopMemberData.ageRetraitePrevu : undefined
    };

    //