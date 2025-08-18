import { useCallback, useState } from "react";

export interface FormData {
  // Section 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  // Section 2
  sector: string;
  companySize: string;
  // Section 3
  mainChallenge: string;
  currentSituation: string;
  // Section 4
  workVolume: string;
  currentCost: string;
  // Section 5
  urgency: string;
  budget: string;
  // Section 6
  idealSolution: string;
  expectedImpact: string;
  constraints: string;
}

export const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  sector: "",
  companySize: "",
  mainChallenge: "",
  currentSituation: "",
  workVolume: "",
  currentCost: "",
  urgency: "",
  budget: "",
  idealSolution: "",
  expectedImpact: "",
  constraints: "",
};

export const totalSections = 6;

// Champs par section pour validation
export function getSectionFields(section: number) {
  switch (section) {
    case 1:
      return [
        { name: "firstName", required: true },
        { name: "lastName", required: true },
        { name: "email", required: true },
        { name: "phone", required: true },
        { name: "company", required: true },
        { name: "role", required: true },
      ];
    case 2:
      return [
        { name: "sector", required: true },
        { name: "companySize", required: true },
      ];
    case 3:
      return [
        { name: "mainChallenge", required: true },
        { name: "currentSituation", required: true },
      ];
    case 4:
      return [
        { name: "workVolume", required: true },
        { name: "currentCost", required: false },
      ];
    case 5:
      return [
        { name: "urgency", required: true },
        { name: "budget", required: true },
      ];
    case 6:
      return [
        { name: "idealSolution", required: true },
        { name: "expectedImpact", required: true },
        { name: "constraints", required: false },
      ];
    default:
      return [];
  }
}

// Règles de scoring (identiques à la maquette HTML)
const scoringRules = {
  companySize: { startup: 15, small: 20, medium: 25, large: 30 },
  mainChallenge: {
    'customer-service': 25,
    'sales-marketing': 20,
    'data-processing': 30,
    'operations': 20,
    'other': 15
  },
  workVolume: { light: 10, moderate: 20, heavy: 30, massive: 40 },
  currentCost: { unknown: 5, low: 10, medium: 20, high: 30 },
  urgency: { asap: 30, high: 25, medium: 15, low: 5 },
  budget: { 'under-5k': 10, '5k-15k': 20, '15k-50k': 30, 'over-50k': 40, 'unknown': 15 }
};

function getQualificationLevel(score: number) {
  if (score >= 80) return 'Premium';
  if (score >= 60) return 'Qualifié';
  if (score >= 40) return 'Intéressant';
  return 'Exploratoire';
}

function getEstimatedROI(formData: FormData) {
  const { currentCost, workVolume } = formData;
  if (currentCost === 'high' && workVolume === 'massive') return '200-500\u00A0% sur 12 mois';
  if (currentCost === 'medium' && workVolume === 'heavy') return '150-300\u00A0% sur 12 mois';
  if (currentCost === 'low' && workVolume === 'moderate') return '100-200\u00A0% sur 18 mois';
  return "100-250\u00A0% selon l'implémentation";
}

function getRecommendedApproach(formData: FormData) {
  const { urgency, budget } = formData;
  if (urgency === 'asap') return 'un déploiement express avec MVP en 2-4 semaines';
  if (budget === 'over-50k') return 'une transformation complète par phases';
  if (budget === 'under-5k') return "une solution ciblée avec maximum d'impact";
  return 'une approche équilibrée coût/bénéfice';
}

function getAIPotentialText(score: number, isEnglish: boolean) {
  if (score < 30) return isEnglish ? 'Limited potential - Targeted solutions recommended' : 'Potentiel limité - Solutions ciblées recommandées';
  if (score < 60) return isEnglish ? 'Good potential - Moderate automations possible' : 'Bon potentiel - Automatisations modérées possibles';
  if (score < 80) return isEnglish ? 'High potential - Significant gains expected' : 'Fort potentiel - Gains significatifs attendus';
  return isEnglish ? 'Exceptional potential - Transformation possible' : 'Potentiel exceptionnel - Transformation possible';
}

function getCTAContent(score: number, isEnglish: boolean) {
  if (score >= 80) {
    return {
      title: isEnglish ? 'Priority consultation - Dedicated expert' : 'Consultation prioritaire - Expert dédié',
      subtitle: isEnglish ? 'Your profile deserves our immediate attention • Response within 2h guaranteed' : 'Votre profil mérite notre attention immédiate • Réponse sous 2h garantie',
      buttonText: isEnglish ? 'Get my VIP consultation' : 'Obtenir ma consultation VIP',
    };
  } else if (score >= 60) {
    return {
      title: isEnglish ? 'In-depth personalized analysis' : 'Analyse approfondie personnalisée',
      subtitle: isEnglish ? 'Detailed case study with projected ROI • Response within 8h' : 'Étude de cas détaillée avec ROI projeté • Réponse sous 8h',
      buttonText: isEnglish ? 'Receive my personalized study' : 'Recevoir mon étude personnalisée',
    };
  } else {
    return {
      title: isEnglish ? 'Free tailored consultation' : 'Consultation gratuite adaptée',
      subtitle: isEnglish ? 'Custom recommendations for your situation' : 'Recommandations sur mesure pour votre situation',
      buttonText: isEnglish ? 'Get my recommendations' : 'Obtenir mes recommandations',
    };
  }
}

// --- SCORING AUDIT + FINAL ---
export const calculateAuditScore = (formData: any): number => {
  let auditScore = 0;
  // 1. TEMPS PERDU (20 points max)
  const timeWastedScore = (() => {
    if (formData.weeklyTimeWasted >= 25) return 20;
    if (formData.weeklyTimeWasted >= 15) return 15;
    if (formData.weeklyTimeWasted >= 8) return 10;
    if (formData.weeklyTimeWasted >= 3) return 5;
    return 0;
  })();
  // 2. DÉFI OPÉRATIONNEL (18 points max)
  const challengeScore = (() => {
    switch(formData.operationalChallenge) {
      case 'scaling_bottlenecks': return 18;
      case 'manual_processes': return 15;
      case 'tools_disconnected': return 12;
      case 'data_scattered': return 10;
      case 'quality_consistency': return 8;
      default: return 0;
    }
  })();
  // 3. MESURE PERFORMANCE (20 points max)
  const performanceScore = (() => {
    switch(formData.performanceMeasurement) {
      case 'no_measurement': return 20;
      case 'gut_feeling': return 18;
      case 'manual_excel': return 15;
      case 'multiple_tools': return 12;
      case 'basic_dashboard': return 8;
      case 'automated_system': return 2;
      default: return 0;
    }
  })();
  auditScore = timeWastedScore + challengeScore + performanceScore;
  // 4. BONUS COHÉRENCE (max +10)
  let coherenceBonus = 0;
  if (formData.weeklyTimeWasted >= 15 && ['manual_processes', 'scaling_bottlenecks'].includes(formData.operationalChallenge)) {
    coherenceBonus += 5;
  }
  if (formData.performanceMeasurement === 'no_measurement' && formData.weeklyTimeWasted >= 10) {
    coherenceBonus += 5;
  }
  return Math.min(68, auditScore + coherenceBonus);
};

export const calculateFinalScore = (formData: any, businessScore: number): number => {
  const auditScore = calculateAuditScore(formData);
  // Pondération : 60% audit + 40% business
  const finalScore = Math.round((auditScore * 0.6) + (businessScore * 0.4));
  return Math.min(100, finalScore);
};

const useFormScoring = (formData: FormData, isEnglish: boolean) => {
  const [aiPotentialScore, setAIPotentialScore] = useState(0);
  const [auditScore, setAuditScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [needsDiscoveryGuide, setNeedsDiscoveryGuide] = useState(false);

  const updateScore = useCallback(() => {
    let score = 0;
    // companySize
    if (formData.companySize && scoringRules.companySize[formData.companySize]) {
      score += scoringRules.companySize[formData.companySize];
    }
    // mainChallenge
    if (formData.mainChallenge && scoringRules.mainChallenge[formData.mainChallenge]) {
      score += scoringRules.mainChallenge[formData.mainChallenge];
    }
    // workVolume
    if (formData.workVolume && scoringRules.workVolume[formData.workVolume]) {
      score += scoringRules.workVolume[formData.workVolume];
    }
    // currentCost
    if (formData.currentCost && scoringRules.currentCost[formData.currentCost]) {
      score += scoringRules.currentCost[formData.currentCost];
    }
    // urgency
    if (formData.urgency && scoringRules.urgency[formData.urgency]) {
      score += scoringRules.urgency[formData.urgency];
    }
    // budget
    if (formData.budget && scoringRules.budget[formData.budget]) {
      score += scoringRules.budget[formData.budget];
    }
    setAIPotentialScore(Math.min(100, score));
    // --- Audit scoring ---
    const audit = calculateAuditScore(formData);
    setAuditScore(audit);
    // --- Final score ---
    const final = calculateFinalScore(formData, score);
    setFinalScore(final);
    setNeedsDiscoveryGuide(final >= 80);
  }, [formData]);

  const aiPotentialText = getAIPotentialText(aiPotentialScore, isEnglish);
  const qualificationLevel = getQualificationLevel(aiPotentialScore);
  const estimatedROI = getEstimatedROI(formData);
  const recommendedApproach = getRecommendedApproach(formData);
  const ctaContent = getCTAContent(aiPotentialScore, isEnglish);

  return {
    aiPotentialScore,
    aiPotentialText,
    qualificationLevel,
    estimatedROI,
    recommendedApproach,
    ctaContent,
    updateScore,
    auditScore,
    finalScore,
    needsDiscoveryGuide,
  };
};

export default useFormScoring; 