// ===== SERVICE POUR SITUATIONS D'EMPLOI PRÉCAIRE =====
// Gestion complète du chômage, contrats temporaires et impact sur la retraite

import { 
  EmploymentStatusData, 
  EmploymentStatus, 
  UnemploymentInsuranceData,
  TemporaryContractData,
  EmploymentImpactAnalysis,
  EmploymentStrategy,
  EmploymentAction,
  EmploymentScenario,
  UnemploymentInsuranceParameters2025,
  EmploymentHistory
} from '../types/employment-status';

export class EmploymentStatusService {
  
  // Paramètres officiels 2025
  private static readonly EI_PARAMS_2025: UnemploymentInsuranceParameters2025 = {
    gainsMoyensMaximum: 668,
    tauxPrestation: 0.55,
    semainesMinimum: 16,
    semainesMaximum: 40,
    heuresRequises: {
      regionFaibleChomage: 700,
      regionMoyenChomage: 595,
      regionFortChomage: 490
    },
    delaiCarence: 1,
    tauxCotisationEmploye: 0.0229,
    tauxCotisationEmployeur: 0.0321,
    plafondCotisable: 68500
  };

  /**
   * Analyse complète de l'impact de l'emploi précaire sur la retraite
   */
  static analyzeEmploymentImpact(
    employmentData: EmploymentStatusData,
    currentAge: number,
    baseIncome: number,
    retirementAge: number
  ): EmploymentImpactAnalysis {
    
    // Calcul des revenus ajustés
    const revenuActuelAjuste = this.calculateAdjustedCurrentIncome(
      employmentData,
      baseIncome
    );
    
    const revenuAnnuelProjetee = this.projectAnnualIncome(
      employmentData,
      baseIncome,
      currentAge,
      retirementAge
    );
    
    const revenuMoyenSur5Ans = this.calculateAverageIncome5Years(
      employmentData,
      baseIncome
    );
    
    // Impact sur les cotisations retraite
    const cotisationsImpact = this.calculateRetirementContributionsImpact(
      baseIncome,
      revenuActuelAjuste,
      retirementAge - currentAge
    );
    
    // Analyse des risques
    const risques = this.assessEmploymentRisks(
      employmentData,
      currentAge,
      baseIncome
    );
    
    // Génération des stratégies et actions
    const strategiesRecommandees = this.generateEmploymentStrategies(
      employmentData,
      currentAge,
      risques
    );
    
    const actionsUrgentes = this.identifyUrgentActions(
      employmentData,
      currentAge,
      risques
    );
    
    // Scénarios de planification
    const scenarios = this.generatePlanningScenarios(
      employmentData,
      currentAge,
      baseIncome,
      retirementAge
    );
    
    return {
      revenuActuelAjuste,
      revenuAnnuelProjetee,
      revenuMoyenSur5Ans,
      cotisationsRRQPerdues: cotisationsImpact.rrqLoss,
      cotisationsRPCPerdues: cotisationsImpact.cppLoss,
      impactPensionFinale: cotisationsImpact.pensionImpact,
      risqueChomageRecurrent: risques.unemploymentRecurrence,
      risqueRevenuInstable: risques.incomeInstability,
      risqueRetraiteRetardee: risques.delayedRetirement,
      strategiesRecommandees,
      actionsUrgentes,
      scenarioOptimiste: scenarios.optimistic,
      scenarioRealiste: scenarios.realistic,
      scenarioPessimiste: scenarios.pessimistic
    };
  }

  /**
   * Calcule les prestations d'assurance-emploi
   */
  static calculateUnemploymentBenefits(
    weeklyEarnings: number,
    hoursWorked: number,
    regionalUnemploymentRate: number,
    region: string
  ): UnemploymentInsuranceData {
    
    // Déterminer les heures requises selon la région
    let heuresRequises: number;
    if (regionalUnemploymentRate < 6) {
      heuresRequises = this.EI_PARAMS_2025.heuresRequises.regionFaibleChomage;
    } else if (regionalUnemploymentRate <= 8.9) {
      heuresRequises = this.EI_PARAMS_2025.heuresRequises.regionMoyenChomage;
    } else {
      heuresRequises = this.EI_PARAMS_2025.heuresRequises.regionFortChomage;
    }
    
    // Vérifier l'éligibilité
    const eligible = hoursWorked >= heuresRequises;
    
    if (!eligible) {
      return {
        enCours: false,
        dateDebut: '',
        montantHebdomadaire: 0,
        nombreSemainesEligibles: 0,
        nombreSemainesUtilisees: 0,
        montantMensuel: 0,
        montantAnnuelProrate: 0,
        typePrestation: 'reguliere',
        regionEconomique: region,
        tauxChomageRegional: regionalUnemploymentRate,
        cotisationsRRQSuspendues: true,
        cotisationsRPCSuspendues: true,
        rechercheEmploiActive: false
      };
    }
    
    // Calculer le montant des prestations
    const montantHebdomadaire = Math.min(
      weeklyEarnings * this.EI_PARAMS_2025.tauxPrestation,
      this.EI_PARAMS_2025.gainsMoyensMaximum
    );
    
    // Déterminer la durée des prestations
    const nombreSemainesEligibles = this.calculateBenefitDuration(
      hoursWorked,
      regionalUnemploymentRate
    );
    
    const montantMensuel = montantHebdomadaire * 4.33;
    const montantAnnuelProrate = montantHebdomadaire * nombreSemainesEligibles;
    
    return {
      enCours: true,
      dateDebut: new Date().toISOString().split('T')[0],
      montantHebdomadaire,
      nombreSemainesEligibles,
      nombreSemainesUtilisees: 0,
      montantMensuel,
      montantAnnuelProrate,
      typePrestation: 'reguliere',
      regionEconomique: region,
      tauxChomageRegional: regionalUnemploymentRate,
      cotisationsRRQSuspendues: true,
      cotisationsRPCSuspendues: true,
      rechercheEmploiActive: true
    };
  }

  /**
   * Projette les revenus avec les périodes de chômage et contrats
   */
  static projectIncomeWithEmploymentGaps(
    baseIncome: number,
    employmentData: EmploymentStatusData,
    yearsToProject: number
  ): number[] {
    
    const yearlyIncomes: number[] = [];
    
    for (let year = 0; year < yearsToProject; year++) {
      let yearIncome = baseIncome;
      
      // Ajuster selon le statut d'emploi
      if (employmentData.statutEmploi1 === 'chomage_assurance') {
        const eiData = employmentData.assuranceChomage1;
        if (eiData?.enCours) {
          yearIncome = eiData.montantAnnuelProrate;
        }
      } else if (employmentData.statutEmploi1 === 'contrat_determine') {
        const contractData = employmentData.contratTravail1;
        if (contractData) {
          yearIncome = this.calculateContractIncome(contractData, year);
        }
      }
      
      // Appliquer l'inflation et la croissance salariale
      yearIncome *= Math.pow(1.025, year); // 2.5% d'inflation
      
      yearlyIncomes.push(yearIncome);
    }
    
    return yearlyIncomes;
  }

  /**
   * Évalue les risques d'emploi selon l'âge et le secteur
   */
  static assessEmploymentRiskByAge(
    age: number,
    sector: string,
    skillLevel: string,
    employmentHistory: EmploymentHistory[]
  ): number {
    
    let riskScore = 0;
    
    // Risque selon l'âge
    if (age >= 55) {
      riskScore += 30; // Discrimination âgiste
    } else if (age >= 45) {
      riskScore += 15;
    } else if (age < 25) {
      riskScore += 10; // Manque d'expérience
    }
    
    // Risque selon le secteur
    const secteurRisque: Record<string, number> = {
      'technologie': 5,
      'sante': 10,
      'education': 15,
      'finance': 20,
      'manufacturier': 35,
      'retail': 40,
      'restauration': 45,
      'construction': 30
    };
    
    riskScore += secteurRisque[sector.toLowerCase()] || 25;
    
    // Risque selon le niveau de compétences
    const competenceRisque: Record<string, number> = {
      'specialise': 5,
      'expert': 10,
      'intermediaire': 20,
      'debutant': 35
    };
    
    riskScore += competenceRisque[skillLevel] || 25;
    
    // Historique d'emploi
    const emploisRecents = employmentHistory.filter(emp => {
      const finEmploi = new Date(emp.dateFin);
      const maintenant = new Date();
      const diffAnnees = (maintenant.getTime() - finEmploi.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return diffAnnees <= 5;
    });
    
    const licenciements = emploisRecents.filter(emp => 
      emp.raisonFin === 'licenciement' || emp.raisonFin === 'fermeture'
    ).length;
    
    riskScore += licenciements * 10;
    
    return Math.min(100, Math.max(0, riskScore));
  }

  // ===== MÉTHODES PRIVÉES =====

  private static calculateAdjustedCurrentIncome(
    employmentData: EmploymentStatusData,
    baseIncome: number
  ): number {
    
    if (employmentData.statutEmploi1 === 'chomage_assurance') {
      const eiData = employmentData.assuranceChomage1;
      return eiData?.montantAnnuelProrate || 0;
    }
    
    if (employmentData.statutEmploi1 === 'contrat_determine') {
      const contractData = employmentData.contratTravail1;
      if (contractData) {
        const contractDuration = this.calculateContractDurationMonths(contractData);
        return (contractData.salaireContrat / contractDuration) * 12;
      }
    }
    
    return baseIncome;
  }

  private static projectAnnualIncome(
    employmentData: EmploymentStatusData,
    baseIncome: number,
    currentAge: number,
    retirementAge: number
  ): number {
    
    const yearsToRetirement = retirementAge - currentAge;
    const incomeProjections = this.projectIncomeWithEmploymentGaps(
      baseIncome,
      employmentData,
      yearsToRetirement
    );
    
    return incomeProjections.reduce((sum, income) => sum + income, 0) / yearsToRetirement;
  }

  private static calculateAverageIncome5Years(
    employmentData: EmploymentStatusData,
    baseIncome: number
  ): number {
    
    const incomeProjections = this.projectIncomeWithEmploymentGaps(
      baseIncome,
      employmentData,
      5
    );
    
    return incomeProjections.reduce((sum, income) => sum + income, 0) / 5;
  }

  private static calculateRetirementContributionsImpact(
    normalIncome: number,
    actualIncome: number,
    yearsAffected: number
  ): { rrqLoss: number; cppLoss: number; pensionImpact: number } {
    
    const incomeLoss = normalIncome - actualIncome;
    const annualRRQLoss = incomeLoss * 0.0652; // Taux cotisation RRQ 2025
    const annualCPPLoss = incomeLoss * 0.0595; // Taux cotisation RPC 2025
    
    const totalRRQLoss = annualRRQLoss * yearsAffected;
    const totalCPPLoss = annualCPPLoss * yearsAffected;
    
    // Impact approximatif sur la pension finale (2% de la pension par année de cotisation perdue)
    const pensionImpact = (totalRRQLoss + totalCPPLoss) * 0.02;
    
    return {
      rrqLoss: totalRRQLoss,
      cppLoss: totalCPPLoss,
      pensionImpact
    };
  }

  private static assessEmploymentRisks(
    employmentData: EmploymentStatusData,
    currentAge: number,
    baseIncome: number
  ): { unemploymentRecurrence: number; incomeInstability: number; delayedRetirement: number } {
    
    let unemploymentRecurrence = 0;
    let incomeInstability = 0;
    let delayedRetirement = 0;
    
    // Analyser le statut actuel
    if (employmentData.statutEmploi1 === 'chomage_assurance' || 
        employmentData.statutEmploi1 === 'chomage_sans_assurance') {
      unemploymentRecurrence = 60;
      incomeInstability = 80;
      delayedRetirement = 40;
    }
    
    if (employmentData.statutEmploi1 === 'contrat_determine' || 
        employmentData.statutEmploi1 === 'emploi_temporaire') {
      unemploymentRecurrence = 40;
      incomeInstability = 60;
      delayedRetirement = 25;
    }
    
    // Ajuster selon l'âge
    if (currentAge >= 55) {
      unemploymentRecurrence += 20;
      delayedRetirement += 30;
    }
    
    return {
      unemploymentRecurrence: Math.min(100, unemploymentRecurrence),
      incomeInstability: Math.min(100, incomeInstability),
      delayedRetirement: Math.min(100, delayedRetirement)
    };
  }

  private static generateEmploymentStrategies(
    employmentData: EmploymentStatusData,
    currentAge: number,
    risks: { unemploymentRecurrence: number; incomeInstability: number; delayedRetirement: number }
  ): EmploymentStrategy[] {
    
    const strategies: EmploymentStrategy[] = [];
    
    // Stratégie pour chômage
    if (employmentData.statutEmploi1 === 'chomage_assurance') {
      strategies.push({
        nom: 'Maximiser la période d\'assurance-emploi',
        description: 'Utiliser pleinement les prestations tout en cherchant activement un emploi',
        priorite: 'haute',
        delaiImplementation: 'Immédiat',
        impactFinancier: 15000,
        difficulte: 'facile',
        etapes: [
          'Confirmer l\'éligibilité maximale aux prestations',
          'S\'inscrire aux services d\'aide à l\'emploi',
          'Maintenir un journal de recherche d\'emploi',
          'Considérer la formation subventionnée'
        ],
        ressourcesNecessaires: ['Accès internet', 'CV à jour', 'Références professionnelles'],
        indicateursSucces: ['Prestations reçues', 'Entrevues obtenues', 'Formation complétée']
      });
    }
    
    // Stratégie pour contrat temporaire
    if (employmentData.statutEmploi1 === 'contrat_determine') {
      strategies.push({
        nom: 'Planification de fin de contrat',
        description: 'Préparer la transition avant la fin du contrat',
        priorite: 'haute',
        delaiImplementation: '3 mois avant la fin',
        impactFinancier: 0,
        difficulte: 'modere',
        etapes: [
          'Négocier une extension si possible',
          'Commencer la recherche d\'emploi 3 mois avant',
          'Constituer un fonds d\'urgence',
          'Évaluer l\'éligibilité à l\'assurance-emploi'
        ],
        ressourcesNecessaires: ['Épargne d\'urgence', 'Réseau professionnel'],
        indicateursSucces: ['Nouveau contrat signé', 'Fonds d\'urgence constitué']
      });
    }
    
    // Stratégie générale pour emploi précaire
    if (risks.incomeInstability > 50) {
      strategies.push({
        nom: 'Diversification des sources de revenus',
        description: 'Créer des revenus multiples pour réduire la dépendance',
        priorite: 'moyenne',
        delaiImplementation: '6-12 mois',
        impactFinancier: 5000,
        difficulte: 'difficile',
        etapes: [
          'Identifier des compétences monétisables',
          'Développer une activité secondaire',
          'Créer des revenus passifs',
          'Maximiser les crédits d\'impôt'
        ],
        ressourcesNecessaires: ['Temps libre', 'Compétences spécialisées', 'Capital initial'],
        indicateursSucces: ['Revenus secondaires générés', 'Stabilité financière améliorée']
      });
    }
    
    return strategies;
  }

  private static identifyUrgentActions(
    employmentData: EmploymentStatusData,
    currentAge: number,
    risks: { unemploymentRecurrence: number; incomeInstability: number; delayedRetirement: number }
  ): EmploymentAction[] {
    
    const actions: EmploymentAction[] = [];
    
    // Actions pour chômage actuel
    if (employmentData.statutEmploi1 === 'chomage_assurance') {
      actions.push({
        action: 'Faire une demande d\'assurance-emploi immédiatement',
        delai: '4 semaines maximum après la perte d\'emploi',
        impact: 'critique',
        cout: 0,
        situationApplicable: ['chomage_assurance'],
        ressourcesGouvernementales: [
          'https://www.canada.ca/fr/services/prestations/ae.html',
          'Service Canada - 1-800-206-7218'
        ]
      });
      
      actions.push({
        action: 'Constituer un fonds d\'urgence de 6 mois',
        delai: 'Dès que possible',
        impact: 'critique',
        cout: 0,
        situationApplicable: ['chomage_assurance', 'chomage_sans_assurance'],
        organismesSoutien: ['Centres d\'aide financière locaux']
      });
    }
    
    // Actions pour fin de contrat imminente
    if (employmentData.statutEmploi1 === 'contrat_determine') {
      const contractData = employmentData.contratTravail1;
      if (contractData) {
        const finContrat = new Date(contractData.dateFin);
        const maintenant = new Date();
        const moisRestants = (finContrat.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (moisRestants <= 3) {
          actions.push({
            action: 'Intensifier la recherche d\'emploi',
            delai: 'Immédiatement',
            impact: 'critique',
            cout: 0,
            situationApplicable: ['contrat_determine'],
            organismesSoutien: ['Centres d\'emploi locaux', 'Agences de placement']
          });
        }
      }
    }
    
    // Actions selon l'âge
    if (currentAge >= 55 && risks.delayedRetirement > 50) {
      actions.push({
        action: 'Consulter un planificateur financier spécialisé en retraite',
        delai: '1 mois',
        impact: 'important',
        cout: 500,
        situationApplicable: ['chomage_assurance', 'contrat_determine', 'emploi_temporaire'],
        ageMinimum: 55,
        organismesSoutien: ['Institut québécois de planification financière']
      });
    }
    
    return actions;
  }

  private static generatePlanningScenarios(
    employmentData: EmploymentStatusData,
    currentAge: number,
    baseIncome: number,
    retirementAge: number
  ): { optimistic: EmploymentScenario; realistic: EmploymentScenario; pessimistic: EmploymentScenario } {
    
    const yearsToRetirement = retirementAge - currentAge;
    
    // Scénario optimiste
    const optimistic: EmploymentScenario = {
      nom: 'Scénario optimiste',
      probabilite: 25,
      revenuAnnuelMoyen: baseIncome * 1.1,
      dureeEmploiMoyenne: 36,
      periodesChomage: 0,
      ageRetraiteRealiste: retirementAge,
      capitalRetraiteProjetee: baseIncome * 15,
      pensionsGouvernementales: baseIncome * 0.4,
      epargneUrgenceRequise: baseIncome * 0.5,
      assurancesRecommandees: ['Assurance invalidité'],
      formationsUtiles: ['Perfectionnement professionnel']
    };
    
    // Scénario réaliste
    const realistic: EmploymentScenario = {
      nom: 'Scénario réaliste',
      probabilite: 50,
      revenuAnnuelMoyen: baseIncome * 0.9,
      dureeEmploiMoyenne: 24,
      periodesChomage: 1,
      ageRetraiteRealiste: retirementAge + 2,
      capitalRetraiteProjetee: baseIncome * 12,
      pensionsGouvernementales: baseIncome * 0.35,
      epargneUrgenceRequise: baseIncome * 0.75,
      assurancesRecommandees: ['Assurance invalidité', 'Assurance vie'],
      formationsUtiles: ['Reconversion professionnelle', 'Compétences numériques']
    };
    
    // Scénario pessimiste
    const pessimistic: EmploymentScenario = {
      nom: 'Scénario pessimiste',
      probabilite: 25,
      revenuAnnuelMoyen: baseIncome * 0.7,
      dureeEmploiMoyenne: 18,
      periodesChomage: 2,
      ageRetraiteRealiste: retirementAge + 5,
      capitalRetraiteProjetee: baseIncome * 8,
      pensionsGouvernementales: baseIncome * 0.3,
      epargneUrgenceRequise: baseIncome * 1.0,
      assurancesRecommandees: ['Assurance invalidité', 'Assurance vie', 'Assurance maladie grave'],
      formationsUtiles: ['Reconversion complète', 'Entrepreneuriat', 'Compétences de base']
    };
    
    return { optimistic, realistic, pessimistic };
  }

  private static calculateBenefitDuration(
    hoursWorked: number,
    regionalUnemploymentRate: number
  ): number {
    
    // Logique simplifiée - en réalité c'est plus complexe
    let baseDuration = this.EI_PARAMS_2025.semainesMinimum;
    
    // Plus d'heures = plus de semaines
    if (hoursWorked >= 1000) baseDuration += 8;
    if (hoursWorked >= 1500) baseDuration += 8;
    if (hoursWorked >= 2000) baseDuration += 8;
    
    // Taux de chômage régional
    if (regionalUnemploymentRate > 9) baseDuration += 8;
    else if (regionalUnemploymentRate > 6) baseDuration += 4;
    
    return Math.min(baseDuration, this.EI_PARAMS_2025.semainesMaximum);
  }

  private static calculateContractIncome(
    contractData: TemporaryContractData,
    year: number
  ): number {
    
    const contractStart = new Date(contractData.dateDebut);
    const contractEnd = new Date(contractData.dateFin);
    const contractDurationMonths = this.calculateContractDurationMonths(contractData);
    
    // Si le contrat se termine dans l'année, calculer pro-rata
    const monthlyIncome = contractData.salaireContrat / contractDurationMonths;
    
    // Logique simplifiée - à améliorer selon les besoins
    return monthlyIncome * 12;
  }

  private static calculateContractDurationMonths(contractData: TemporaryContractData): number {
    const start = new Date(contractData.dateDebut);
    const end = new Date(contractData.dateFin);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  }
}
