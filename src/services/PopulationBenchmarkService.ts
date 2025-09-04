import { UserData } from '@/types';

export interface ProvincialBenchmark {
  province: string;
  provinceCode: string;
  lifeExpectancy: {
    male: number;
    female: number;
    average: number;
  };
  healthIndicators: {
    obesityRate: number;
    smokingRate: number;
    physicalActivityRate: number;
    diabetesRate: number;
  };
  socioeconomicFactors: {
    medianIncome: number;
    educationLevel: number;
    unemploymentRate: number;
  };
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
}

export interface BenchmarkComparison {
  userLifeExpectancy: number;
  provincialAverage: number;
  percentileRank: number;
  benchmarkGap: number;
  recommendations: string[];
  riskFactors: string[];
}

export class PopulationBenchmarkService {
  private static readonly PROVINCIAL_BENCHMARKS: ProvincialBenchmark[] = [
    {
      province: 'Québec',
      provinceCode: 'QC',
      lifeExpectancy: { male: 80.1, female: 84.3, average: 82.2 },
      healthIndicators: {
        obesityRate: 24.5,
        smokingRate: 18.2,
        physicalActivityRate: 52.3,
        diabetesRate: 8.7
      },
      socioeconomicFactors: {
        medianIncome: 65000,
        educationLevel: 62.1,
        unemploymentRate: 7.2
      },
      percentiles: { p25: 78.5, p50: 82.2, p75: 85.8, p90: 88.1, p95: 89.5 }
    },
    {
      province: 'Ontario',
      provinceCode: 'ON',
      lifeExpectancy: { male: 80.8, female: 84.8, average: 82.8 },
      healthIndicators: {
        obesityRate: 26.1,
        smokingRate: 16.8,
        physicalActivityRate: 54.7,
        diabetesRate: 9.2
      },
      socioeconomicFactors: {
        medianIncome: 72000,
        educationLevel: 65.3,
        unemploymentRate: 6.8
      },
      percentiles: { p25: 79.2, p50: 82.8, p75: 86.4, p90: 88.7, p95: 90.1 }
    },
    {
      province: 'British Columbia',
      provinceCode: 'BC',
      lifeExpectancy: { male: 81.2, female: 85.1, average: 83.2 },
      healthIndicators: {
        obesityRate: 23.8,
        smokingRate: 14.5,
        physicalActivityRate: 58.9,
        diabetesRate: 7.8
      },
      socioeconomicFactors: {
        medianIncome: 68000,
        educationLevel: 67.8,
        unemploymentRate: 5.9
      },
      percentiles: { p25: 79.6, p50: 83.2, p75: 86.8, p90: 89.1, p95: 90.5 }
    },
    {
      province: 'Alberta',
      provinceCode: 'AB',
      lifeExpectancy: { male: 80.5, female: 84.6, average: 82.6 },
      healthIndicators: {
        obesityRate: 27.3,
        smokingRate: 17.2,
        physicalActivityRate: 53.1,
        diabetesRate: 9.8
      },
      socioeconomicFactors: {
        medianIncome: 75000,
        educationLevel: 64.2,
        unemploymentRate: 6.5
      },
      percentiles: { p25: 79.0, p50: 82.6, p75: 86.2, p90: 88.5, p95: 89.9 }
    },
    {
      province: 'Manitoba',
      provinceCode: 'MB',
      lifeExpectancy: { male: 78.9, female: 83.1, average: 81.0 },
      healthIndicators: {
        obesityRate: 29.7,
        smokingRate: 19.8,
        physicalActivityRate: 48.6,
        diabetesRate: 10.5
      },
      socioeconomicFactors: {
        medianIncome: 58000,
        educationLevel: 58.9,
        unemploymentRate: 8.1
      },
      percentiles: { p25: 77.4, p50: 81.0, p75: 84.6, p90: 86.9, p95: 88.3 }
    },
    {
      province: 'Saskatchewan',
      provinceCode: 'SK',
      lifeExpectancy: { male: 79.2, female: 83.4, average: 81.3 },
      healthIndicators: {
        obesityRate: 28.9,
        smokingRate: 18.9,
        physicalActivityRate: 49.8,
        diabetesRate: 10.2
      },
      socioeconomicFactors: {
        medianIncome: 60000,
        educationLevel: 59.7,
        unemploymentRate: 7.8
      },
      percentiles: { p25: 77.7, p50: 81.3, p75: 84.9, p90: 87.2, p95: 88.6 }
    },
    {
      province: 'Nova Scotia',
      provinceCode: 'NS',
      lifeExpectancy: { male: 79.8, female: 83.9, average: 81.9 },
      healthIndicators: {
        obesityRate: 26.8,
        smokingRate: 20.1,
        physicalActivityRate: 51.2,
        diabetesRate: 9.5
      },
      socioeconomicFactors: {
        medianIncome: 62000,
        educationLevel: 61.3,
        unemploymentRate: 7.5
      },
      percentiles: { p25: 78.3, p50: 81.9, p75: 85.5, p90: 87.8, p95: 89.2 }
    },
    {
      province: 'New Brunswick',
      provinceCode: 'NB',
      lifeExpectancy: { male: 79.5, female: 83.7, average: 81.6 },
      healthIndicators: {
        obesityRate: 27.8,
        smokingRate: 19.5,
        physicalActivityRate: 50.1,
        diabetesRate: 9.8
      },
      socioeconomicFactors: {
        medianIncome: 59000,
        educationLevel: 60.1,
        unemploymentRate: 7.9
      },
      percentiles: { p25: 78.0, p50: 81.6, p75: 85.2, p90: 87.5, p95: 88.9 }
    },
    {
      province: 'Newfoundland and Labrador',
      provinceCode: 'NL',
      lifeExpectancy: { male: 78.7, female: 82.8, average: 80.8 },
      healthIndicators: {
        obesityRate: 30.2,
        smokingRate: 21.3,
        physicalActivityRate: 47.3,
        diabetesRate: 11.1
      },
      socioeconomicFactors: {
        medianIncome: 56000,
        educationLevel: 57.2,
        unemploymentRate: 8.5
      },
      percentiles: { p25: 77.2, p50: 80.8, p75: 84.4, p90: 86.7, p95: 88.1 }
    },
    {
      province: 'Prince Edward Island',
      provinceCode: 'PE',
      lifeExpectancy: { male: 79.9, female: 84.0, average: 82.0 },
      healthIndicators: {
        obesityRate: 26.5,
        smokingRate: 18.7,
        physicalActivityRate: 52.8,
        diabetesRate: 9.3
      },
      socioeconomicFactors: {
        medianIncome: 61000,
        educationLevel: 62.8,
        unemploymentRate: 7.3
      },
      percentiles: { p25: 78.4, p50: 82.0, p75: 85.6, p90: 87.9, p95: 89.3 }
    }
  ];

  /**
   * Get benchmark data for a specific province
   */
  static getProvincialBenchmark(provinceCode: string): ProvincialBenchmark | null {
    return this.PROVINCIAL_BENCHMARKS.find(benchmark =>
      benchmark.provinceCode === provinceCode
    ) || null;
  }

  /**
   * Get all provincial benchmarks
   */
  static getAllBenchmarks(): ProvincialBenchmark[] {
    return [...this.PROVINCIAL_BENCHMARKS];
  }

  /**
   * Calculate user's percentile rank compared to provincial population
   */
  static calculatePercentileRank(userLifeExpectancy: number, provinceCode: string): number {
    const benchmark = this.getProvincialBenchmark(provinceCode);
    if (!benchmark) return 50; // Default to median if province not found

    const percentiles = benchmark.percentiles;

    if (userLifeExpectancy <= percentiles.p25) return 25;
    if (userLifeExpectancy <= percentiles.p50) return 37.5;
    if (userLifeExpectancy <= percentiles.p75) return 62.5;
    if (userLifeExpectancy <= percentiles.p90) return 80;
    if (userLifeExpectancy <= percentiles.p95) return 90;

    return 95; // Above 95th percentile
  }

  /**
   * Generate comprehensive benchmark comparison
   */
  static generateBenchmarkComparison(
    userData: UserData,
    userLifeExpectancy: number,
    isFrench: boolean = false
  ): BenchmarkComparison {
    const provinceCode = userData.personal?.province || 'QC';
    const benchmark = this.getProvincialBenchmark(provinceCode);

    if (!benchmark) {
      return {
        userLifeExpectancy,
        provincialAverage: 82.0,
        percentileRank: 50,
        benchmarkGap: 0,
        recommendations: [],
        riskFactors: []
      };
    }

    const percentileRank = this.calculatePercentileRank(userLifeExpectancy, provinceCode);
    const benchmarkGap = userLifeExpectancy - benchmark.lifeExpectancy.average;

    const recommendations = this.generateRecommendations(
      userData,
      benchmark,
      percentileRank,
      isFrench
    );

    const riskFactors = this.identifyRiskFactors(
      userData,
      benchmark,
      percentileRank,
      isFrench
    );

    return {
      userLifeExpectancy,
      provincialAverage: benchmark.lifeExpectancy.average,
      percentileRank,
      benchmarkGap,
      recommendations,
      riskFactors
    };
  }

  /**
   * Generate personalized recommendations based on benchmark comparison
   */
  private static generateRecommendations(
    userData: UserData,
    benchmark: ProvincialBenchmark,
    percentileRank: number,
    isFrench: boolean
  ): string[] {
    const recommendations: string[] = [];
    const personal = userData.personal || {};
    const fieldSuffix = '1'; // Default to person 1

    if (isFrench) {
      if (percentileRank < 50) {
        recommendations.push('Consultez un professionnel de la santé pour une évaluation complète');
        recommendations.push('Envisagez d\'améliorer votre activité physique quotidienne');
      }

      if (personal[`etatSante${fieldSuffix}`] === 'fragile' || personal[`etatSante${fieldSuffix}`] === 'moyen') {
        recommendations.push('Priorisez les soins préventifs et les bilans de santé réguliers');
      }

      if (personal[`modeVieActif${fieldSuffix}`] === 'sedentaire' || personal[`modeVieActif${fieldSuffix}`] === 'legerementActif') {
        recommendations.push('Augmentez graduellement votre activité physique (marche, vélo, natation)');
      }

      if (personal[`statutTabagique${fieldSuffix}`] === 'current') {
        recommendations.push('Considérez un programme d\'arrêt du tabac avec soutien professionnel');
      }

      if (benchmark.healthIndicators.obesityRate > 25) {
        recommendations.push('Surveillez votre indice de masse corporelle et consultez un nutritionniste si nécessaire');
      }

      recommendations.push('Maintenez un suivi régulier avec votre médecin de famille');
      recommendations.push('Considérez des examens préventifs adaptés à votre âge');
    } else {
      if (percentileRank < 50) {
        recommendations.push('Consult a healthcare professional for a comprehensive assessment');
        recommendations.push('Consider improving your daily physical activity');
      }

      if (personal[`etatSante${fieldSuffix}`] === 'fragile' || personal[`etatSante${fieldSuffix}`] === 'moyen') {
        recommendations.push('Prioritize preventive care and regular health check-ups');
      }

      if (personal[`modeVieActif${fieldSuffix}`] === 'sedentaire' || personal[`modeVieActif${fieldSuffix}`] === 'legerementActif') {
        recommendations.push('Gradually increase your physical activity (walking, cycling, swimming)');
      }

      if (personal[`statutTabagique${fieldSuffix}`] === 'current') {
        recommendations.push('Consider a smoking cessation program with professional support');
      }

      if (benchmark.healthIndicators.obesityRate > 25) {
        recommendations.push('Monitor your BMI and consult a nutritionist if needed');
      }

      recommendations.push('Maintain regular follow-up with your family physician');
      recommendations.push('Consider age-appropriate preventive screenings');
    }

    return recommendations;
  }

  /**
   * Identify risk factors based on user data and provincial benchmarks
   */
  private static identifyRiskFactors(
    userData: UserData,
    benchmark: ProvincialBenchmark,
    percentileRank: number,
    isFrench: boolean
  ): string[] {
    const riskFactors: string[] = [];
    const personal = userData.personal || {};
    const fieldSuffix = '1';

    if (isFrench) {
      if (personal[`statutTabagique${fieldSuffix}`] === 'current') {
        riskFactors.push('Tabagisme actif');
      }

      if (personal[`etatSante${fieldSuffix}`] === 'fragile') {
        riskFactors.push('État de santé fragile');
      }

      if (personal[`modeVieActif${fieldSuffix}`] === 'sedentaire') {
        riskFactors.push('Mode de vie sédentaire');
      }

      if (benchmark.healthIndicators.obesityRate > 28) {
        riskFactors.push('Province avec taux d\'obésité élevé');
      }

      if (benchmark.healthIndicators.smokingRate > 19) {
        riskFactors.push('Province avec taux de tabagisme élevé');
      }

      if (percentileRank < 25) {
        riskFactors.push('Espérance de vie significativement en dessous de la moyenne provinciale');
      }
    } else {
      if (personal[`statutTabagique${fieldSuffix}`] === 'current') {
        riskFactors.push('Active smoking');
      }

      if (personal[`etatSante${fieldSuffix}`] === 'fragile') {
        riskFactors.push('Fragile health condition');
      }

      if (personal[`modeVieActif${fieldSuffix}`] === 'sedentaire') {
        riskFactors.push('Sedentary lifestyle');
      }

      if (benchmark.healthIndicators.obesityRate > 28) {
        riskFactors.push('Province with high obesity rate');
      }

      if (benchmark.healthIndicators.smokingRate > 19) {
        riskFactors.push('Province with high smoking rate');
      }

      if (percentileRank < 25) {
        riskFactors.push('Life expectancy significantly below provincial average');
      }
    }

    return riskFactors;
  }

  /**
   * Get provincial rankings for visualization
   */
  static getProvincialRankings(): Array<{
    province: string;
    provinceCode: string;
    lifeExpectancy: number;
    rank: number;
  }> {
    const sorted = [...this.PROVINCIAL_BENCHMARKS].sort(
      (a, b) => b.lifeExpectancy.average - a.lifeExpectancy.average
    );

    return sorted.map((benchmark, index) => ({
      province: benchmark.province,
      provinceCode: benchmark.provinceCode,
      lifeExpectancy: benchmark.lifeExpectancy.average,
      rank: index + 1
    }));
  }

  /**
   * Calculate health score based on provincial benchmarks
   */
  static calculateHealthScore(userData: UserData, provinceCode: string): number {
    const benchmark = this.getProvincialBenchmark(provinceCode);
    if (!benchmark) return 50;

    const personal = userData.personal || {};
    const fieldSuffix = '1';

    let score = 50; // Base score

    // Health status adjustment
    const healthStatus = personal[`etatSante${fieldSuffix}`];
    if (healthStatus === 'excellent') score += 15;
    else if (healthStatus === 'tresbon') score += 10;
    else if (healthStatus === 'bon') score += 5;
    else if (healthStatus === 'moyen') score -= 10;
    else if (healthStatus === 'fragile') score -= 20;

    // Lifestyle adjustment
    const lifestyle = personal[`modeVieActif${fieldSuffix}`];
    if (lifestyle === 'tresActif') score += 10;
    else if (lifestyle === 'actif') score += 5;
    else if (lifestyle === 'modere') score += 0;
    else if (lifestyle === 'legerementActif') score -= 5;
    else if (lifestyle === 'sedentaire') score -= 15;

    // Smoking adjustment
    const smoking = personal[`statutTabagique${fieldSuffix}`];
    if (smoking === 'never') score += 10;
    else if (smoking === 'former') score += 5;
    else if (smoking === 'current') score -= 15;

    // Education adjustment
    const education = personal[`niveauCompetences${fieldSuffix}`];
    if (education === 'maitrise') score += 8;
    else if (education === 'universitaire') score += 5;
    else if (education === 'college') score += 2;
    else if (education === 'secondaire') score += 0;
    else if (education === 'debutant') score -= 5;

    // Bound the score between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
}
