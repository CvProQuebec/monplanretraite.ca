import { 
  CombinedPensionData, 
  CombinedCalculationResult, 
  RetirementScenario, 
  MonteCarloSimulation,
  TaxOptimizationData,
  SurvivorBenefits 
} from '../types/combined-pension';
import { CPPData, CPPCalculationResult } from '../types/cpp';
import { CPPService } from './CPPService';

export class CombinedPensionService {
  
  /**
   * Calcule le revenu de retraite combiné CPP + RRQ + Épargne personnelle
   */
  static calculateCombinedPension(data: CombinedPensionData): CombinedCalculationResult {
    // Calcul CPP
    const cppResult = CPPService.calculateCPPPension(data.cpp);
    
    // Calcul RRQ (à adapter selon votre logique existante)
    const rrqResult = this.calculateRRQPension(data.rrq);
    
    // Calcul épargne personnelle
    const savingsResult = this.calculatePersonalSavings(data.personalSavings, data.retirementAge, data.lifeExpectancy);
    
    // Calculs combinés
    const totalMonthlyIncome = cppResult.pensionMensuelle + rrqResult.pensionMensuelle + savingsResult.revenuMensuel;
    const totalAnnualIncome = totalMonthlyIncome * 12;
    
    // Taux de remplacement (basé sur un revenu moyen de 60,000$)
    const revenuMoyenAvantRetraite = 60000;
    const replacementRate = (totalAnnualIncome / revenuMoyenAvantRetraite) * 100;
    
    // Score de durabilité (0-100)
    const sustainabilityScore = this.calculateSustainabilityScore(data, totalMonthlyIncome);
    
    // Recommandations
    const recommendations = this.generateRecommendations(data, totalMonthlyIncome, replacementRate);
    
    return {
      cpp: cppResult,
      rrq: rrqResult,
      personalSavings: savingsResult,
      totalMonthlyIncome,
      totalAnnualIncome,
      replacementRate,
      sustainabilityScore,
      recommendations
    };
  }
  
  /**
   * Calcule la pension RRQ (logique simplifiée - à adapter)
   */
  private static calculateRRQPension(rrqData: any): any {
    // Logique RRQ existante - à adapter selon votre implémentation
    const pensionBase = rrqData.pensionBase || 0;
    const facteurAjustement = this.calculateRRQAdjustmentFactor(rrqData.dateNaissance, rrqData.dateRetraite);
    const pensionAjustee = pensionBase * facteurAjustement;
    
    return {
      pensionMensuelle: pensionAjustee / 12,
      pensionAnnuelle: pensionAjustee,
      facteurAjustement,
      pensionAjustee
    };
  }
  
  /**
   * Calcule le facteur d'ajustement RRQ selon l'âge de retraite
   */
  private static calculateRRQAdjustmentFactor(dateNaissance: Date, dateRetraite: Date): number {
    const ageRetraite = this.calculateAge(dateNaissance, dateRetraite);
    
    if (ageRetraite >= 65) {
      return 1.0; // Pension complète à 65 ans
    } else if (ageRetraite >= 60) {
      return 0.6 + (ageRetraite - 60) * 0.08; // Réduction de 0.6% par mois avant 65 ans
    } else {
      return 0.6; // Minimum à 60 ans
    }
  }
  
  /**
   * Calcule l'épargne personnelle et le revenu généré
   */
  private static calculatePersonalSavings(savingsData: any, ageRetraite: number, esperanceVie: number): any {
    const anneesEpargne = 65 - ageRetraite; // Supposons retraite à 65 ans
    const anneesRetrait = esperanceVie - 65;
    
    // Calcul du montant accumulé
    let montantAccumule = savingsData.montantInitial;
    for (let i = 0; i < anneesEpargne; i++) {
      montantAccumule += savingsData.contributionMensuelle * 12;
      montantAccumule *= (1 + savingsData.tauxRendement);
    }
    
    // Calcul du revenu mensuel (retrait de 4% par année)
    const tauxRetrait = 0.04;
    const revenuAnnuel = montantAccumule * tauxRetrait;
    const revenuMensuel = revenuAnnuel / 12;
    
    // Durée de soutien (montant / revenu annuel)
    const dureeSoutien = montantAccumule / revenuAnnuel;
    
    return {
      montantRetraite: montantAccumule,
      revenuMensuel,
      revenuAnnuel,
      dureeSoutien
    };
  }
  
  /**
   * Calcule le score de durabilité du plan de retraite
   */
  private static calculateSustainabilityScore(data: CombinedPensionData, revenuMensuel: number): number {
    let score = 100;
    
    // Facteur âge de retraite
    if (data.retirementAge < 60) score -= 20;
    else if (data.retirementAge < 65) score -= 10;
    else if (data.retirementAge > 70) score -= 15;
    
    // Facteur taux de remplacement
    const tauxRemplacement = (revenuMensuel * 12) / 60000;
    if (tauxRemplacement < 0.5) score -= 30;
    else if (tauxRemplacement < 0.7) score -= 15;
    else if (tauxRemplacement > 1.2) score += 10;
    
    // Facteur épargne personnelle
    if (data.personalSavings.contributionMensuelle < 500) score -= 20;
    else if (data.personalSavings.contributionMensuelle > 1000) score += 15;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Génère des recommandations personnalisées
   */
  private static generateRecommendations(data: CombinedPensionData, revenuMensuel: number, tauxRemplacement: number): string[] {
    const recommendations: string[] = [];
    
    if (tauxRemplacement < 0.7) {
      recommendations.push("Considérez augmenter vos contributions à l'épargne de retraite");
      recommendations.push("Évaluez la possibilité de retarder votre retraite de quelques années");
    }
    
    if (data.retirementAge < 65) {
      recommendations.push("La retraite anticipée réduit significativement vos prestations");
    }
    
    if (data.personalSavings.contributionMensuelle < 500) {
      recommendations.push("Augmentez vos contributions mensuelles pour améliorer votre sécurité financière");
    }
    
    if (data.inflationRate > 0.03) {
      recommendations.push("Planifiez pour l'inflation en diversifiant vos investissements");
    }
    
    return recommendations;
  }
  
  /**
   * Génère des scénarios de retraite personnalisés
   */
  static generateRetirementScenarios(data: CombinedPensionData): RetirementScenario[] {
    const scenarios: RetirementScenario[] = [];
    
    // Scénario conservateur
    scenarios.push({
      id: 'conservateur',
      nom: 'Scénario Conservateur',
      description: 'Retraite à 65 ans avec épargne modérée et rendements faibles',
      parametres: {
        ageRetraite: 65,
        tauxInflation: 0.02,
        rendementInvestissement: 0.04,
        contributionSupplementaire: 0
      },
      resultats: this.calculateCombinedPension({
        ...data,
        retirementAge: 65,
        inflationRate: 0.02,
        investmentReturn: 0.04
      }),
      probabiliteReussite: 0.85,
      niveauRisque: 'Faible'
    });
    
    // Scénario modéré
    scenarios.push({
      id: 'modere',
      nom: 'Scénario Modéré',
      description: 'Retraite à 63 ans avec épargne équilibrée et rendements moyens',
      parametres: {
        ageRetraite: 63,
        tauxInflation: 0.025,
        rendementInvestissement: 0.06,
        contributionSupplementaire: 200
      },
      resultats: this.calculateCombinedPension({
        ...data,
        retirementAge: 63,
        inflationRate: 0.025,
        investmentReturn: 0.06,
        personalSavings: {
          ...data.personalSavings,
          contributionMensuelle: data.personalSavings.contributionMensuelle + 200
        }
      }),
      probabiliteReussite: 0.70,
      niveauRisque: 'Modéré'
    });
    
    // Scénario agressif
    scenarios.push({
      id: 'agressif',
      nom: 'Scénario Agressif',
      description: 'Retraite à 60 ans avec épargne importante et rendements élevés',
      parametres: {
        ageRetraite: 60,
        tauxInflation: 0.03,
        rendementInvestissement: 0.08,
        contributionSupplementaire: 500
      },
      resultats: this.calculateCombinedPension({
        ...data,
        retirementAge: 60,
        inflationRate: 0.03,
        investmentReturn: 0.08,
        personalSavings: {
          ...data.personalSavings,
          contributionMensuelle: data.personalSavings.contributionMensuelle + 500
        }
      }),
      probabiliteReussite: 0.55,
      niveauRisque: 'Élevé'
    });
    
    return scenarios;
  }
  
  /**
   * Exécute une simulation Monte Carlo pour évaluer les risques
   */
  static runMonteCarloSimulation(data: CombinedPensionData, iterations: number = 1000): MonteCarloSimulation {
    const scenarios: RetirementScenario[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // Génération de paramètres aléatoires
      const randomInflation = 0.02 + (Math.random() - 0.5) * 0.04; // 0% à 4%
      const randomReturn = 0.04 + (Math.random() - 0.5) * 0.08; // 0% à 8%
      const randomAge = 60 + Math.random() * 10; // 60 à 70 ans
      
      const scenarioData = {
        ...data,
        retirementAge: randomAge,
        inflationRate: randomInflation,
        investmentReturn: randomReturn
      };
      
      const resultats = this.calculateCombinedPension(scenarioData);
      
      scenarios.push({
        id: `mc_${i}`,
        nom: `Simulation ${i + 1}`,
        description: `Simulation Monte Carlo avec paramètres aléatoires`,
        parametres: {
          ageRetraite: randomAge,
          tauxInflation: randomInflation,
          rendementInvestissement: randomReturn,
          contributionSupplementaire: 0
        },
        resultats,
        probabiliteReussite: this.calculateSuccessProbability(resultats),
        niveauRisque: this.calculateRiskLevel(resultats)
      });
    }
    
    // Calcul des statistiques
    const revenus = scenarios.map(s => s.resultats.totalAnnualIncome);
    const revenuMoyen = revenus.reduce((a, b) => a + b, 0) / revenus.length;
    const revenuMedian = this.calculateMedian(revenus);
    const ecartType = this.calculateStandardDeviation(revenus, revenuMoyen);
        
    return {
      iterations,
      scenarios,
      statistiques: {
        revenuMoyen,
        revenuMedian,
        ecartType,
        probabiliteReussite: scenarios.filter(s => s.probabiliteReussite > 0.7).length / scenarios.length,
        percentiles: this.calculatePercentiles(revenus)
      }
    };
  }
  
  /**
   * Calcule l'optimisation fiscale pour la retraite
   */
  static calculateTaxOptimization(combinedResult: CombinedCalculationResult): TaxOptimizationData {
    const revenuImposable = combinedResult.totalAnnualIncome;
    let creditsFiscaux = 0;
    
    // Crédit d'impôt pour personnes âgées (65+)
    if (combinedResult.cpp.ageRetraite >= 65) {
      creditsFiscaux += 2000;
    }
    
    // Crédit pour revenu de pension
    if (revenuImposable > 2000) {
      creditsFiscaux += Math.min(2000, revenuImposable - 2000) * 0.15;
    }
    
    // Calcul du taux d'imposition effectif
    const impots = this.calculateTaxes(revenuImposable);
    const tauxImpositionEffectif = (impots / revenuImposable) * 100;
    
    // Stratégies d'optimisation
    const strategies = this.generateTaxStrategies(combinedResult, revenuImposable);
    
    return {
      revenuImposable,
      creditsFiscaux,
      tauxImpositionEffectif,
      strategies
    };
  }
  
  /**
   * Calcule les prestations de survivant CPP + RRQ
   */
  static calculateSurvivorBenefits(cppData: CPPData, rrqData: any): SurvivorBenefits {
    // Prestations CPP survivant (60% de la pension du conjoint décédé)
    const cppSurvivor = {
      montantMensuel: 0, // À calculer selon les règles CPP
      conditions: ['Conjoint survivant de 65 ans ou plus', 'Pension CPP du conjoint décédé'],
      duree: 0 // À vie
    };
    
    // Prestations RRQ survivant (similaire)
    const rrqSurvivor = {
      montantMensuel: 0, // À calculer selon les règles RRQ
      conditions: ['Conjoint survivant', 'Pension RRQ du conjoint décédé'],
      duree: 0 // À vie
    };
    
    const total = cppSurvivor.montantMensuel + rrqSurvivor.montantMensuel;
    
    return {
      cpp: cppSurvivor,
      rrq: rrqSurvivor,
      total,
      impactFiscal: total * 0.15 // Estimation simplifiée
    };
  }
  
  // Méthodes utilitaires
  private static calculateAge(dateNaissance: Date, dateReference: Date): number {
    const age = dateReference.getFullYear() - dateNaissance.getFullYear();
    const monthDiff = dateReference.getMonth() - dateNaissance.getMonth();
    return monthDiff < 0 || (monthDiff === 0 && dateReference.getDate() < dateNaissance.getDate()) ? age - 1 : age;
  }
  
  private static calculateSuccessProbability(resultats: CombinedCalculationResult): number {
    if (resultats.sustainabilityScore >= 80) return 0.9;
    if (resultats.sustainabilityScore >= 60) return 0.7;
    if (resultats.sustainabilityScore >= 40) return 0.5;
    return 0.3;
  }
  
  private static calculateRiskLevel(resultats: CombinedCalculationResult): 'Faible' | 'Modéré' | 'Élevé' {
    if (resultats.sustainabilityScore >= 70) return 'Faible';
    if (resultats.sustainabilityScore >= 40) return 'Modéré';
    return 'Élevé';
  }
  
  private static calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }
  
  private static calculateStandardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  
  private static calculatePercentiles(values: number[]): any {
    const sorted = [...values].sort((a, b) => a - b);
    return {
      p10: sorted[Math.floor(sorted.length * 0.1)],
      p25: sorted[Math.floor(sorted.length * 0.25)],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p75: sorted[Math.floor(sorted.length * 0.75)],
      p90: sorted[Math.floor(sorted.length * 0.9)]
    };
  }
  
  private static calculateTaxes(revenu: number): number {
    // Calcul simplifié des impôts fédéraux
    if (revenu <= 53359) return revenu * 0.15;
    if (revenu <= 106717) return 8004 + (revenu - 53359) * 0.205;
    if (revenu <= 165430) return 18986 + (revenu - 106717) * 0.26;
    if (revenu <= 235675) return 34288 + (revenu - 165430) * 0.29;
    return 54630 + (revenu - 235675) * 0.33;
  }
  
  private static generateTaxStrategies(combinedResult: CombinedCalculationResult, revenuImposable: number): any[] {
    const strategies = [];
    
    // Stratégie REER vs CELI
    if (revenuImposable > 50000) {
      strategies.push({
        nom: 'Contribution REER',
        description: 'Contribuer à un REER pour réduire le revenu imposable',
        impactAnnuel: revenuImposable * 0.26 * 0.18, // 18% de contribution, taux marginal 26%
        impactCumulatif: 0,
        difficulte: 'Facile',
        recommandation: true
      });
    }
    
    // Stratégie fractionnement de revenu
    if (combinedResult.cpp.ageRetraite >= 65) {
      strategies.push({
        nom: 'Fractionnement de revenu',
        description: 'Partager jusqu\'à 50% de la pension avec le conjoint',
        impactAnnuel: revenuImposable * 0.05, // Estimation 5% d'économie
        impactCumulatif: 0,
        difficulte: 'Modérée',
        recommandation: true
      });
    }
    
    return strategies;
  }
}
