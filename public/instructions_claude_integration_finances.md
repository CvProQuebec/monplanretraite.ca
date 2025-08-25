# INSTRUCTIONS CLAUDE - INTÉGRATION DOCUMENTS FINANCIERS 2025

## 🎯 **CONTEXTE ET OBJECTIFS**

Vous devez maintenant intégrer de nouvelles informations financières critiques découvertes dans les documents "Finances - *.txt" qui peuvent significativement améliorer votre module de planification de retraite existant. Ces documents contiennent des données actualisées sur :

- **Plafonds de cotisation 2025** (REER 32 490 $, CELI 7 000 $)
- **Seuils de récupération PSV 2025** (90 997 $ → 148 451 $)
- **Rendements réels des fonds de solidarité** (13.3-13.4% incluant crédits d'impôt)
- **Stratégies fiscales avancées** pour optimisation REER/CELI
- **Considérations successorales** (comptes conjoints, mandats d'inaptitude)
- **Gestion des dépenses à la retraite** (budgetisation spécialisée)

**Public cible :** Futurs retraités québécois de 60+ ans recherchant des stratégies personnalisées.

---

## 📊 **PHASE 1 : MISE À JOUR DES PARAMÈTRES DE BASE**

### **1.1 Service de Configuration Fiscale 2025**

Créez le fichier : `src/features/retirement/services/TaxParametersService2025.ts`

```typescript
// ===== SERVICE PARAMÈTRES FISCAUX 2025 =====
// Basé sur les nouveaux documents "Finances - *.txt"

export interface TaxParameters2025 {
  // Plafonds de cotisation mis à jour
  reerPlafond: 32490; // Augmentation vs 2024
  celiPlafond: 7000;  // Maintenu
  
  // Seuils PSV critiques
  psvSeuilRecuperationPartielle: 90997;   // Début récupération
  psvSeuilRecuperationComplete: 148451;   // Perte totale 65-74 ans
  psvSeuilRecuperationComplete75Plus: 153771; // Perte totale 75+ ans
  
  // Crédit en raison de l'âge
  creditAgeSeuilRevenu: 42335;
  creditAgeReductionTaux: 0.15; // 15% de réduction
  
  // Taux marginaux Québec 2025
  tauxMarginauxCombines: {
    tranche1: { min: 0, max: 51780, taux: 0.2779 },      // 27.79%
    tranche2: { min: 51780, max: 103545, taux: 0.3612 }, // 36.12%
    tranche3: { min: 103545, max: 126000, taux: 0.4612 }, // 46.12%
    tranche4: { min: 126000, max: Infinity, taux: 0.5312 } // 53.12%
  };
}

export class TaxOptimizationService2025 {
  
  private static readonly PARAMS: TaxParameters2025 = {
    reerPlafond: 32490,
    celiPlafond: 7000,
    psvSeuilRecuperationPartielle: 90997,
    psvSeuilRecuperationComplete: 148451,
    psvSeuilRecuperationComplete75Plus: 153771,
    creditAgeSeuilRevenu: 42335,
    creditAgeReductionTaux: 0.15,
    tauxMarginauxCombines: {
      tranche1: { min: 0, max: 51780, taux: 0.2779 },
      tranche2: { min: 51780, max: 103545, taux: 0.3612 },
      tranche3: { min: 103545, max: 126000, taux: 0.4612 },
      tranche4: { min: 126000, max: Infinity, taux: 0.5312 }
    }
  };
  
  /**
   * NOUVEAU: Analyse optimisation REER vs CELI personnalisée
   */
  static analyzeREERvsCELI(params: {
    revenuActuel: number;
    revenuProjetteRetraite: number;
    ageActuel: number;
    ageRetraite: number;
    montantDisponible: number;
    situationConjoint: 'SEUL' | 'COUPLE';
  }): REERCELIRecommendation {
    
    const { revenuActuel, revenuProjetteRetraite, ageActuel, montantDisponible } = params;
    
    // Calcul taux marginal actuel vs futur
    const tauxMarginalActuel = this.calculateTauxMarginal(revenuActuel);
    const tauxMarginalRetraite = this.calculateTauxMarginal(revenuProjetteRetraite);
    
    // Économie fiscale REER immédiate
    const economieREER = montantDisponible * tauxMarginalActuel;
    
    // Impact futur REER (imposition au retrait)
    const impactFiscalFutur = montantDisponible * tauxMarginalRetraite;
    
    // Avantage net REER vs CELI
    const avantageNetREER = economieREER - impactFiscalFutur;
    
    // Calcul seuils PSV
    const impactPSV = this.calculatePSVImpact(revenuProjetteRetraite, montantDisponible);
    
    // Analyse selon la situation
    let recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
    let raisonnement: string[] = [];
    
    if (tauxMarginalActuel > tauxMarginalRetraite + 0.05) {
      recommandation = 'REER_PRIORITE';
      raisonnement = [
        `Taux marginal actuel (${(tauxMarginalActuel*100).toFixed(1)}%) > taux futur (${(tauxMarginalRetraite*100).toFixed(1)}%)`,
        `Économie fiscale immédiate : ${this.formatCurrency(economieREER)}`,
        "Optimisation via déduction fiscale"
      ];
    } else if (revenuProjetteRetraite > this.PARAMS.psvSeuilRecuperationPartielle) {
      recommandation = 'CELI_PRIORITE';
      raisonnement = [
        "Revenu de retraite élevé → risque récupération PSV",
        "CELI ne compte pas comme revenu imposable",
        `Évite la récupération PSV (seuil: ${this.formatCurrency(this.PARAMS.psvSeuilRecuperationPartielle)})`
      ];
    } else {
      recommandation = 'EQUILIBRE';
      raisonnement = [
        "Taux marginaux similaires présent vs futur",
        "Diversification fiscale recommandée",
        "Flexibilité CELI + déduction REER"
      ];
    }
    
    return {
      recommandation,
      raisonnement,
      repartitionSuggeree: this.calculateOptimalSplit(montantDisponible, recommandation),
      impactFiscal: {
        economieImmediateREER: economieREER,
        impactFuturREER: impactFiscalFutur,
        avantageNetREER: avantageNetREER,
        impactPSV: impactPSV
      },
      strategiesComplementaires: this.generateComplementaryStrategies(params)
    };
  }
  
  /**
   * NOUVEAU: Stratégie de décaissement optimisée
   */
  static optimizeWithdrawalSequence(params: {
    ageDebut: number;
    reerValue: number;
    celiValue: number;
    placementsValue: number;
    revenuGaranti: number; // RRQ + PSV
    depensesAnnuelles: number;
    esperanceVie: number;
  }): WithdrawalStrategy {
    
    const { ageDebut, reerValue, celiValue, placementsValue, revenuGaranti, depensesAnnuelles, esperanceVie } = params;
    
    const anneesRetraite = esperanceVie - ageDebut;
    const deficitAnnuel = Math.max(0, depensesAnnuelles - revenuGaranti);
    
    // Stratégie séquentielle basée sur les documents
    const sequence: WithdrawalPhase[] = [];
    
    // Phase 1 (60-65 ans) : Si retraite anticipée
    if (ageDebut < 65) {
      sequence.push({
        ageDebut: ageDebut,
        ageFin: 65,
        sourcesPrioritaires: ['CELI', 'PLACEMENTS_NON_ENREGISTRES'],
        rationale: 'Éviter pénalités REER et préserver revenus garantis futurs',
        tauxRetrait: 0.035,
        impactFiscal: 'MINIMAL'
      });
    }
    
    // Phase 2 (65-71 ans) : Optimisation fiscale
    sequence.push({
      ageDebut: Math.max(ageDebut, 65),
      ageFin: 71,
      sourcesPrioritaires: this.determinePrioriteSources(revenuGaranti + deficitAnnuel),
      rationale: 'Équilibrer sources pour rester sous seuils PSV',
      tauxRetrait: 0.04,
      impactFiscal: 'OPTIMISE'
    });
    
    // Phase 3 (72+ ans) : Décaissement obligatoire FERR
    sequence.push({
      ageDebut: 72,
      ageFin: esperanceVie,
      sourcesPrioritaires: ['FERR', 'CELI_COMPLEMENT'],
      rationale: 'Décaissement FERR obligatoire + CELI pour équilibrer',
      tauxRetrait: 0.0527, // Minimum FERR à 72 ans
      impactFiscal: 'CONTRAINT'
    });
    
    return {
      sequencePhases: sequence,
      impactFiscalTotal: this.calculateTotalTaxImpact(sequence, reerValue),
      flexibiliteScore: this.assessFlexibilityScore(celiValue, reerValue + placementsValue),
      recommendationsSpeciales: this.generateSpecialRecommendations(params)
    };
  }
  
  /**
   * NOUVEAU: Optimisation fonds de solidarité
   */
  static analyzeFondsSolidarite(params: {
    revenuAnnuel: number;
    ageActuel: number;
    ageRetraite: number;
    capaciteEpargne: number;
  }): FondsSolidariteAnalysis {
    
    const { revenuAnnuel, ageActuel, ageRetraite, capaciteEpargne } = params;
    const anneesInvestissement = ageRetraite - ageActuel;
    
    // Données des documents : Fondaction 13.3%, FTQ 13.4% (10 ans)
    const rendementFondaction = 0.133;
    const rendementFTQ = 0.134;
    const creditImpot = 0.30; // 30% crédit d'impôt
    
    // Calcul avec crédit d'impôt intégré
    const investissementNet = capaciteEpargne * (1 - creditImpot); // Coût réel après crédit
    
    // Projection Fondaction
    const valeurFinaleFondaction = investissementNet * Math.pow(1 + rendementFondaction, Math.min(anneesInvestissement, 10));
    
    // Projection FTQ
    const valeurFinaleFTQ = investissementNet * Math.pow(1 + rendementFTQ, Math.min(anneesInvestissement, 10));
    
    // Comparaison avec REER traditionnel (6% rendement)
    const valeurFinaleREERTraditionnel = capaciteEpargne * Math.pow(1.06, anneesInvestissement);
    
    return {
      recommandation: this.evaluateFondsSolidariteViability(revenuAnnuel, anneesInvestissement),
      projections: {
        fondaction: {
          investissementNet,
          valeurFinale: valeurFinaleFondaction,
          rendementEffectif: rendementFondaction,
          avantageVsREER: valeurFinaleFondaction - valeurFinaleREERTraditionnel
        },
        ftq: {
          investissementNet,
          valeurFinale: valeurFinaleFTQ,
          rendementEffectif: rendementFTQ,
          avantageVsREER: valeurFinaleFTQ - valeurFinaleREERTraditionnel
        }
      },
      contraintes: [
        'Immobilisation jusqu\'à la retraite ou 65 ans',
        'Risque de liquidité en cas d\'urgence',
        'Performance liée à l\'économie québécoise'
      ],
      eligibilite: this.checkFondsSolidariteEligibility(revenuAnnuel)
    };
  }
  
  // Méthodes utilitaires
  private static calculateTauxMarginal(revenu: number): number {
    for (const tranche of Object.values(this.PARAMS.tauxMarginauxCombines)) {
      if (revenu >= tranche.min && revenu < tranche.max) {
        return tranche.taux;
      }
    }
    return this.PARAMS.tauxMarginauxCombines.tranche4.taux;
  }
  
  private static calculatePSVImpact(revenuRetraite: number, montantRetrait: number): number {
    const nouveauRevenu = revenuRetraite + montantRetrait;
    
    if (nouveauRevenu <= this.PARAMS.psvSeuilRecuperationPartielle) return 0;
    
    const tauxRecuperation = 0.15;
    const revenuExcedentaire = nouveauRevenu - this.PARAMS.psvSeuilRecuperationPartielle;
    
    return Math.min(
      revenuExcedentaire * tauxRecuperation,
      717.15 * 12 // PSV maximale annuelle
    );
  }
  
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

// Nouvelles interfaces
interface REERCELIRecommendation {
  recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
  raisonnement: string[];
  repartitionSuggeree: {
    reerPart: number;
    celiPart: number;
    justification: string;
  };
  impactFiscal: {
    economieImmediateREER: number;
    impactFuturREER: number;
    avantageNetREER: number;
    impactPSV: number;
  };
  strategiesComplementaires: string[];
}

interface WithdrawalStrategy {
  sequencePhases: WithdrawalPhase[];
  impactFiscalTotal: number;
  flexibiliteScore: number;
  recommendationsSpeciales: string[];
}

interface WithdrawalPhase {
  ageDebut: number;
  ageFin: number;
  sourcesPrioritaires: string[];
  rationale: string;
  tauxRetrait: number;
  impactFiscal: 'MINIMAL' | 'OPTIMISE' | 'CONTRAINT';
}

interface FondsSolidariteAnalysis {
  recommandation: 'RECOMMANDE' | 'ACCEPTABLE' | 'NON_RECOMMANDE';
  projections: {
    fondaction: FondsProjection;
    ftq: FondsProjection;
  };
  contraintes: string[];
  eligibilite: boolean;
}

interface FondsProjection {
  investissementNet: number;
  valeurFinale: number;
  rendementEffectif: number;
  avantageVsREER: number;
}
```

### **1.2 Service de Gestion Budgétaire Retraite**

Créez : `src/features/retirement/services/RetirementBudgetService.ts`

```typescript
// ===== SERVICE BUDGÉTAIRE RETRAITE =====
// Basé sur les documents EducFinance et guides spécialisés

export interface RetirementBudgetAnalysis {
  depensesProjectees: {
    eliminees: ExpenseCategory[];
    diminuees: ExpenseCategory[];
    stables: ExpenseCategory[];
    augmentees: ExpenseCategory[];
  };
  fondUrgenceRequis: number;
  repartitionComptes: AccountSeparationStrategy;
  optimisationFiscale: TaxOptimizationSuggestions;
}

export class RetirementBudgetService {
  
  /**
   * Analyse des changements de dépenses à la retraite
   * Basé sur le Tableau 4 des documents EducFinance
   */
  static analyzeRetirementExpenseChanges(
    currentExpenses: MonthlyExpenses
  ): RetirementBudgetAnalysis {
    
    // Classification selon les documents
    const depensesProjectees = {
      eliminees: [
        { categorie: 'Cotisations RRQ', montantActuel: currentExpenses.rrqCotisations || 0, pourcentageReduction: 100 },
        { categorie: 'Cotisations REER employeur', montantActuel: currentExpenses.reerEmployeur || 0, pourcentageReduction: 100 },
        { categorie: 'Cotisations professionnelles', montantActuel: currentExpenses.cotisationsPro || 0, pourcentageReduction: 100 },
        { categorie: 'Assurance-emploi', montantActuel: currentExpenses.assuranceEmploi || 0, pourcentageReduction: 100 }
      ],
      
      diminuees: [
        { categorie: 'Transport', montantActuel: currentExpenses.transport, pourcentageReduction: 30 },
        { categorie: 'Vêtements', montantActuel: currentExpenses.vetements, pourcentageReduction: 25 },
        { categorie: 'Entretien véhicule', montantActuel: currentExpenses.vehicule, pourcentageReduction: 20 }
      ],
      
      stables: [
        { categorie: 'Logement', montantActuel: currentExpenses.logement, pourcentageReduction: 0 },
        { categorie: 'Alimentation', montantActuel: currentExpenses.alimentation, pourcentageReduction: 0 }
      ],
      
      augmentees: [
        { categorie: 'Soins de santé', montantActuel: currentExpenses.sante, pourcentageAugmentation: 40 },
        { categorie: 'Activités sociales', montantActuel: currentExpenses.loisirs, pourcentageAugmentation: 25 },
        { categorie: 'Frais de voyage', montantActuel: currentExpenses.voyages || 0, pourcentageAugmentation: 60 }
      ]
    };
    
    // Calcul fond d'urgence (3-6 mois selon situation)
    const depensesTotalesRetraite = this.calculateTotalRetirementExpenses(depensesProjectees);
    const fondUrgenceRequis = depensesTotalesRetraite * 4; // 4 mois en moyenne
    
    // Stratégie comptes séparés (basée sur document EducFinance)
    const repartitionComptes = {
      compteDependesFixes: this.calculateFixedExpensesAccount(depensesProjectees),
      compteGestionCourante: this.calculateVariableExpensesAccount(depensesProjectees),
      justification: [
        'Séparation dépenses fixes vs variables pour meilleur contrôle',
        'Évite les frais bancaires avec soldes minimums',
        'Simplification gestion en couple'
      ]
    };
    
    return {
      depensesProjectees,
      fondUrgenceRequis,
      repartitionComptes,
      optimisationFiscale: this.generateTaxOptimizationSuggestions(depensesProjectees)
    };
  }
  
  /**
   * NOUVEAU: Planification successorale intégrée
   */
  static analyzeEstateConsiderations(params: {
    ageActuel: number;
    situationFamiliale: 'CELIBATAIRE' | 'COUPLE' | 'UNION_FAIT';
    enfants: boolean;
    valeursPatrimoine: {
      reer: number;
      celi: number;
      residence: number;
      placements: number;
    };
  }): EstateAnalysis {
    
    const { ageActuel, situationFamiliale, enfants, valeursPatrimoine } = params;
    
    // Priorités basées sur les documents
    const prioritesSuccessorales: Priority[] = [
      {
        ordre: 1,
        action: 'Rédiger/réviser testament',
        urgence: situationFamiliale === 'UNION_FAIT' || enfants ? 'CRITIQUE' : 'IMPORTANTE',
        justification: 'Protection des héritiers et respect des volontés'
      },
      {
        ordre: 2,
        action: 'Préparer mandat en cas d\'inaptitude',
        urgence: ageActuel >= 60 ? 'CRITIQUE' : 'IMPORTANTE',
        justification: 'Sécurité financière en cas d\'incapacité'
      },
      {
        ordre: 3,
        action: 'Éviter comptes entièrement conjoints',
        urgence: 'MOYENNE',
        justification: 'Éviter blocage fonds lors du décès (plusieurs semaines/mois)'
      }
    ];
    
    // Stratégies REER/CELI pour succession
    const strategiesSuccessorales = this.generateEstateStrategies(valeursPatrimoine, situationFamiliale);
    
    return {
      prioritesSuccessorales,
      strategiesSuccessorales,
      impactFiscalSuccession: this.calculateEstateImpact(valeursPatrimoine),
      documentsRequis: this.listRequiredDocuments(situationFamiliale, enfants),
      timelineActions: this.createEstateTimeline(prioritesSuccessorales)
    };
  }
}
```

---

## 📈 **PHASE 2 : INTÉGRATION DANS LE CALCULATIONSERVICE EXISTANT**

### **2.1 Mise à jour du CalculationService principal**

Modifiez votre `CalculationService.ts` existant :

```typescript
// Ajoutez ces imports
import { TaxOptimizationService2025 } from './TaxOptimizationService2025';
import { RetirementBudgetService } from './RetirementBudgetService';

// Dans la méthode calculateAll, ajoutez ces nouveaux calculs :
static calculateAll(userData: UserData): Calculations {
  try {
    const enhancedCalculations = {
      // ... calculs existants conservés
      netWorth: this.calculateNetWorth(userData),
      retirementCapital: this.calculateRetirementCapital(userData),
      sufficiency: this.calculateSufficiency(userData),
      
      // NOUVEAUX CALCULS 2025
      reerCeliOptimization: this.calculateREERCELIOptimization(userData),
      withdrawalStrategy: this.calculateWithdrawalStrategy(userData),
      budgetAnalysis: this.calculateRetirementBudgetAnalysis(userData),
      fondsSolidariteAnalysis: this.calculateFondsSolidariteAnalysis(userData),
      estateConsiderations: this.calculateEstateConsiderations(userData),
      
      // Calculs existants améliorés
      rrqOptimization: this.calculateRRQOptimizationEnhanced(userData),
      taxSavings: this.calculateEnhancedTaxSavings(userData)
    };
    
    return enhancedCalculations;
  } catch (error) {
    console.error('Erreur dans les calculs:', error);
    throw new Error('Erreur lors des calculs financiers');
  }
}

/**
 * NOUVEAU: Optimisation REER vs CELI personnalisée
 */
private static calculateREERCELIOptimization(userData: UserData): any {
  const revenuActuel = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
  const ageActuel = this.calculateAge(userData.personal.naissance1);
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  
  // Estimation revenu de retraite
  const revenuProjetteRetraite = this.estimateRetirementIncome(userData);
  
  // Capacité d'épargne disponible
  const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
  
  return TaxOptimizationService2025.analyzeREERvsCELI({
    revenuActuel,
    revenuProjetteRetraite,
    ageActuel,
    ageRetraite,
    montantDisponible: capaciteEpargne,
    situationConjoint: userData.personal.salaire2 > 0 ? 'COUPLE' : 'SEUL'
  });
}

/**
 * NOUVEAU: Stratégie de décaissement optimisée
 */
private static calculateWithdrawalStrategy(userData: UserData): any {
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  const esperanceVie = userData.retirement.esperanceVie1 || 85;
  
  const reerTotal = (userData.savings.reer1 || 0) + (userData.savings.reer2 || 0);
  const celiTotal = (userData.savings.celi1 || 0) + (userData.savings.celi2 || 0);
  const placementsTotal = (userData.savings.placements1 || 0) + (userData.savings.placements2 || 0);
  
  // Revenus garantis estimés
  const revenuRRQ = (userData.retirement.rrqMontantActuel1 || 0) + (userData.retirement.rrqMontantActuel2 || 0);
  const revenuPSV = 717.15 * 2; // Estimation couple
  const revenuGaranti = (revenuRRQ + revenuPSV) * 12;
  
  const depensesAnnuelles = this.calculateMonthlyExpenses(userData) * 12 * 0.75; // 75% dépenses actuelles
  
  return TaxOptimizationService2025.optimizeWithdrawalSequence({
    ageDebut: ageRetraite,
    reerValue: reerTotal,
    celiValue: celiTotal,
    placementsValue: placementsTotal,
    revenuGaranti,
    depensesAnnuelles,
    esperanceVie
  });
}

/**
 * NOUVEAU: Analyse budgétaire spécialisée retraite
 */
private static calculateRetirementBudgetAnalysis(userData: UserData): any {
  const currentExpenses = {
    logement: userData.cashflow.logement || 0,
    alimentation: userData.cashflow.alimentation || 0,
    transport: userData.cashflow.transport || 0,
    sante: userData.cashflow.sante || 0,
    loisirs: userData.cashflow.loisirs || 0,
    // Ajouter les autres catégories selon vos données
  };
  
  return RetirementBudgetService.analyzeRetirementExpenseChanges(currentExpenses);
}

/**
 * NOUVEAU: Analyse fonds de solidarité
 */
private static calculateFondsSolidariteAnalysis(userData: UserData): any {
  const revenuAnnuel = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
  const ageActuel = this.calculateAge(userData.personal.naissance1);
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
  
  return TaxOptimizationService2025.analyzeFondsSolidarite({
    revenuAnnuel,
    ageActuel,
    ageRetraite,
    capaciteEpargne
  });
}
```

---

## 🎨 **PHASE 3 : INTERFACE UTILISATEUR ENRICHIE**

### **3.1 Nouveau Composant de Stratégies Fiscales**

Créez : `src/features/retirement/components/TaxOptimizationDashboard.tsx`

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Calculator, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  AlertTriangle, CheckCircle, Info, Target, ArrowRightLeft, Banknote
} from 'lucide-react';

interface TaxOptimizationDashboardProps {
  calculations: any;
  userData: any;
}

export const TaxOptimizationDashboard: React.FC<TaxOptimizationDashboardProps> = ({
  calculations,
  userData
}) => {
  const [activeTab, setActiveTab] = useState('reer-celi');
  
  return (
    <div className="w-full space-y-6">
      {/* En-tête avec métriques fiscales clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Économies fiscales REER</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.economieImmediateREER || 0)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Impact PSV potentiel</div>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.impactPSV || 0)}
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avantage net REER</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.avantageNetREER || 0)}
                </div>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reer-celi">REER vs CELI</TabsTrigger>
          <TabsTrigger value="withdrawal">Décaissement</TabsTrigger>
          <TabsTrigger value="budget">Budget Retraite</TabsTrigger>
          <TabsTrigger value="estate">Succession</TabsTrigger>
        </TabsList>
        
        {/* Onglet REER vs CELI */}
        <TabsContent value="reer-celi" className="space-y-6">
          <REERCELIAnalysisTab 
            optimization={calculations.reerCeliOptimization}
            fondsSolidarite={calculations.fondsSolidariteAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Stratégie de décaissement */}
        <TabsContent value="withdrawal" className="space-y-6">
          <WithdrawalStrategyTab 
            strategy={calculations.withdrawalStrategy}
            userData={userData}
          />
        </TabsContent>
        
        {/* Onglet Budget retraite */}
        <TabsContent value="budget" className="space-y-6">
          <RetirementBudgetTab 
            budgetAnalysis={calculations.budgetAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Considérations successorales */}
        <TabsContent value="estate" className="space-y-6">
          <EstateConsiderationsTab 
            estateAnalysis={calculations.estateConsiderations}
            userData={userData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ===== COMPOSANTS ONGLETS =====

const REERCELIAnalysisTab: React.FC<any> = ({ optimization, fondsSolidarite }) => {
  return (
    <div className="space-y-6">
      {/* Recommandation principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stratégie recommandée : {optimization?.recommandation || 'En cours d\'analyse'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition suggérée */}
            <div>
              <h3 className="font-medium mb-3">Répartition optimale de votre épargne</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'REER', value: optimization?.repartitionSuggeree?.reerPart || 50, fill: '#3B82F6' },
                      { name: 'CELI', value: optimization?.repartitionSuggeree?.celiPart || 50, fill: '#10B981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#10B981" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Raisonnement */}
            <div>
              <h3 className="font-medium mb-3">Pourquoi cette stratégie ?</h3>
              <div className="space-y-2">
                {optimization?.raisonnement?.map((raison: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{raison}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Impact fiscal détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse de l'impact fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(optimization?.impactFiscal?.economieImmediateREER || 0)}
              </div>
              <div className="text-sm text-green-600">Économie immédiate REER</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(optimization?.impactFiscal?.impactFuturREER || 0)}
              </div>
              <div className="text-sm text-blue-600">Impact fiscal futur</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                {formatCurrency(optimization?.impactFiscal?.avantageNetREER || 0)}
              </div>
              <div className="text-sm text-purple-600">Avantage net REER</div>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-lg font-bold text-amber-700">
                {formatCurrency(optimization?.impactFiscal?.impactPSV || 0)}
              </div>
              <div className="text-sm text-amber-600">Impact PSV annuel</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fonds de solidarité */}
      {fondsSolidarite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Analyse des fonds de solidarité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Fondaction vs Fonds FTQ</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fondaction (10 ans)</span>
                    <span className="font-medium">13.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fonds FTQ (10 ans)</span>
                    <span className="font-medium">13.4%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    *Rendements incluant les crédits d'impôt de 30%
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Contraintes importantes</h3>
                <div className="space-y-2">
                  {fondsSolidarite?.contraintes?.map((contrainte: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{contrainte}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const WithdrawalStrategyTab: React.FC<any> = ({ strategy, userData }) => {
  return (
    <div className="space-y-6">
      {/* Séquence de décaissement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Séquence de décaissement optimisée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategy?.sequencePhases?.map((phase: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Phase {index + 1}: {phase.ageDebut}-{phase.ageFin} ans
                  </h3>
                  <Badge variant={phase.impactFiscal === 'OPTIMISE' ? 'default' : 'secondary'}>
                    {phase.impactFiscal}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Sources prioritaires</div>
                    <div className="space-y-1">
                      {phase.sourcesPrioritaires?.map((source: string, i: number) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Taux de retrait</div>
                    <div className="text-lg font-medium">{(phase.tauxRetrait * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Rationale:</strong> {phase.rationale}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Score de flexibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Flexibilité de votre stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Score de flexibilité</span>
              <Progress value={strategy?.flexibiliteScore || 0} className="flex-1" />
              <span className="text-sm font-medium">
                {strategy?.flexibiliteScore || 0}/100
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Avantages de votre stratégie</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Optimisation fiscale progressive
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Préservation des prestations gouvernementales
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Flexibilité d'ajustement selon les besoins
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Recommandations spéciales</h3>
                <div className="space-y-1">
                  {strategy?.recommendationsSpeciales?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RetirementBudgetTab: React.FC<any> = ({ budgetAnalysis }) => {
  const depensesData = [
    { 
      categorie: 'Éliminées', 
      montant: budgetAnalysis?.depensesProjectees?.eliminees?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#EF4444'
    },
    { 
      categorie: 'Diminuées', 
      montant: budgetAnalysis?.depensesProjectees?.diminuees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 - dep.pourcentageReduction/100), 0) || 0,
      color: '#F59E0B'
    },
    { 
      categorie: 'Stables', 
      montant: budgetAnalysis?.depensesProjectees?.stables?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#6B7280'
    },
    { 
      categorie: 'Augmentées', 
      montant: budgetAnalysis?.depensesProjectees?.augmentees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 + dep.pourcentageAugmentation/100), 0) || 0,
      color: '#10B981'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Changements de dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de vos dépenses à la retraite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={depensesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categorie" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="montant" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Détail par catégorie</h3>
              {depensesData.map((categorie, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded" style={{backgroundColor: categorie.color + '20'}}>
                  <span className="text-sm font-medium">{categorie.categorie}</span>
                  <span className="text-sm">{formatCurrency(categorie.montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fond d'urgence et stratégie comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fond d'urgence recommandé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(budgetAnalysis?.fondUrgenceRequis || 0)}
              </div>
              <div className="text-sm text-gray-600">
                Équivaut à 4 mois de dépenses de retraite
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <strong>Recommandation:</strong> Placer dans CELI pour accessibilité maximale sans impact fiscal
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stratégie de comptes séparés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte dépenses fixes</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteDependesFixes || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Loyer, assurances, taxes, abonnements
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte gestion courante</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteGestionCourante || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Épicerie, essence, loisirs, imprévus
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EstateConsiderationsTab: React.FC<any> = ({ estateAnalysis, userData }) => {
  return (
    <div className="space-y-6">
      {/* Priorités successorales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Actions successorales prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estateAnalysis?.prioritesSuccessorales?.map((priorite: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">#{priorite.ordre} - {priorite.action}</h3>
                  <Badge variant={priorite.urgence === 'CRITIQUE' ? 'destructive' : 'secondary'}>
                    {priorite.urgence}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{priorite.justification}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Avertissement comptes conjoints */}
      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <strong>Important:</strong> En cas de décès, l'argent d'un compte conjoint sera bloqué le temps du règlement de la succession, 
          ce qui peut prendre plusieurs semaines, voire des mois. Assurez-vous que chaque conjoint ait un compte personnel 
          pour continuer les transactions courantes.
        </AlertDescription>
      </Alert>
      
      {/* Timeline des actions */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline des actions recommandées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estateAnalysis?.timelineActions?.map((action: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{action.action}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <div className="text-xs text-blue-600 mt-1">Délai: {action.delai}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== FONCTION UTILITAIRE =====
function formatCurrency(amount: number, short: boolean = false): string {
  if (short && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M # INSTRUCTIONS CLAUDE - INTÉGRATION DOCUMENTS FINANCIERS 2025

## 🎯 **CONTEXTE ET OBJECTIFS**

Vous devez maintenant intégrer de nouvelles informations financières critiques découvertes dans les documents "Finances - *.txt" qui peuvent significativement améliorer votre module de planification de retraite existant. Ces documents contiennent des données actualisées sur :

- **Plafonds de cotisation 2025** (REER 32 490 $, CELI 7 000 $)
- **Seuils de récupération PSV 2025** (90 997 $ → 148 451 $)
- **Rendements réels des fonds de solidarité** (13.3-13.4% incluant crédits d'impôt)
- **Stratégies fiscales avancées** pour optimisation REER/CELI
- **Considérations successorales** (comptes conjoints, mandats d'inaptitude)
- **Gestion des dépenses à la retraite** (budgetisation spécialisée)

**Public cible :** Futurs retraités québécois de 60+ ans recherchant des stratégies personnalisées.

---

## 📊 **PHASE 1 : MISE À JOUR DES PARAMÈTRES DE BASE**

### **1.1 Service de Configuration Fiscale 2025**

Créez le fichier : `src/features/retirement/services/TaxParametersService2025.ts`

```typescript
// ===== SERVICE PARAMÈTRES FISCAUX 2025 =====
// Basé sur les nouveaux documents "Finances - *.txt"

export interface TaxParameters2025 {
  // Plafonds de cotisation mis à jour
  reerPlafond: 32490; // Augmentation vs 2024
  celiPlafond: 7000;  // Maintenu
  
  // Seuils PSV critiques
  psvSeuilRecuperationPartielle: 90997;   // Début récupération
  psvSeuilRecuperationComplete: 148451;   // Perte totale 65-74 ans
  psvSeuilRecuperationComplete75Plus: 153771; // Perte totale 75+ ans
  
  // Crédit en raison de l'âge
  creditAgeSeuilRevenu: 42335;
  creditAgeReductionTaux: 0.15; // 15% de réduction
  
  // Taux marginaux Québec 2025
  tauxMarginauxCombines: {
    tranche1: { min: 0, max: 51780, taux: 0.2779 },      // 27.79%
    tranche2: { min: 51780, max: 103545, taux: 0.3612 }, // 36.12%
    tranche3: { min: 103545, max: 126000, taux: 0.4612 }, // 46.12%
    tranche4: { min: 126000, max: Infinity, taux: 0.5312 } // 53.12%
  };
}

export class TaxOptimizationService2025 {
  
  private static readonly PARAMS: TaxParameters2025 = {
    reerPlafond: 32490,
    celiPlafond: 7000,
    psvSeuilRecuperationPartielle: 90997,
    psvSeuilRecuperationComplete: 148451,
    psvSeuilRecuperationComplete75Plus: 153771,
    creditAgeSeuilRevenu: 42335,
    creditAgeReductionTaux: 0.15,
    tauxMarginauxCombines: {
      tranche1: { min: 0, max: 51780, taux: 0.2779 },
      tranche2: { min: 51780, max: 103545, taux: 0.3612 },
      tranche3: { min: 103545, max: 126000, taux: 0.4612 },
      tranche4: { min: 126000, max: Infinity, taux: 0.5312 }
    }
  };
  
  /**
   * NOUVEAU: Analyse optimisation REER vs CELI personnalisée
   */
  static analyzeREERvsCELI(params: {
    revenuActuel: number;
    revenuProjetteRetraite: number;
    ageActuel: number;
    ageRetraite: number;
    montantDisponible: number;
    situationConjoint: 'SEUL' | 'COUPLE';
  }): REERCELIRecommendation {
    
    const { revenuActuel, revenuProjetteRetraite, ageActuel, montantDisponible } = params;
    
    // Calcul taux marginal actuel vs futur
    const tauxMarginalActuel = this.calculateTauxMarginal(revenuActuel);
    const tauxMarginalRetraite = this.calculateTauxMarginal(revenuProjetteRetraite);
    
    // Économie fiscale REER immédiate
    const economieREER = montantDisponible * tauxMarginalActuel;
    
    // Impact futur REER (imposition au retrait)
    const impactFiscalFutur = montantDisponible * tauxMarginalRetraite;
    
    // Avantage net REER vs CELI
    const avantageNetREER = economieREER - impactFiscalFutur;
    
    // Calcul seuils PSV
    const impactPSV = this.calculatePSVImpact(revenuProjetteRetraite, montantDisponible);
    
    // Analyse selon la situation
    let recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
    let raisonnement: string[] = [];
    
    if (tauxMarginalActuel > tauxMarginalRetraite + 0.05) {
      recommandation = 'REER_PRIORITE';
      raisonnement = [
        `Taux marginal actuel (${(tauxMarginalActuel*100).toFixed(1)}%) > taux futur (${(tauxMarginalRetraite*100).toFixed(1)}%)`,
        `Économie fiscale immédiate : ${this.formatCurrency(economieREER)}`,
        "Optimisation via déduction fiscale"
      ];
    } else if (revenuProjetteRetraite > this.PARAMS.psvSeuilRecuperationPartielle) {
      recommandation = 'CELI_PRIORITE';
      raisonnement = [
        "Revenu de retraite élevé → risque récupération PSV",
        "CELI ne compte pas comme revenu imposable",
        `Évite la récupération PSV (seuil: ${this.formatCurrency(this.PARAMS.psvSeuilRecuperationPartielle)})`
      ];
    } else {
      recommandation = 'EQUILIBRE';
      raisonnement = [
        "Taux marginaux similaires présent vs futur",
        "Diversification fiscale recommandée",
        "Flexibilité CELI + déduction REER"
      ];
    }
    
    return {
      recommandation,
      raisonnement,
      repartitionSuggeree: this.calculateOptimalSplit(montantDisponible, recommandation),
      impactFiscal: {
        economieImmediateREER: economieREER,
        impactFuturREER: impactFiscalFutur,
        avantageNetREER: avantageNetREER,
        impactPSV: impactPSV
      },
      strategiesComplementaires: this.generateComplementaryStrategies(params)
    };
  }
  
  /**
   * NOUVEAU: Stratégie de décaissement optimisée
   */
  static optimizeWithdrawalSequence(params: {
    ageDebut: number;
    reerValue: number;
    celiValue: number;
    placementsValue: number;
    revenuGaranti: number; // RRQ + PSV
    depensesAnnuelles: number;
    esperanceVie: number;
  }): WithdrawalStrategy {
    
    const { ageDebut, reerValue, celiValue, placementsValue, revenuGaranti, depensesAnnuelles, esperanceVie } = params;
    
    const anneesRetraite = esperanceVie - ageDebut;
    const deficitAnnuel = Math.max(0, depensesAnnuelles - revenuGaranti);
    
    // Stratégie séquentielle basée sur les documents
    const sequence: WithdrawalPhase[] = [];
    
    // Phase 1 (60-65 ans) : Si retraite anticipée
    if (ageDebut < 65) {
      sequence.push({
        ageDebut: ageDebut,
        ageFin: 65,
        sourcesPrioritaires: ['CELI', 'PLACEMENTS_NON_ENREGISTRES'],
        rationale: 'Éviter pénalités REER et préserver revenus garantis futurs',
        tauxRetrait: 0.035,
        impactFiscal: 'MINIMAL'
      });
    }
    
    // Phase 2 (65-71 ans) : Optimisation fiscale
    sequence.push({
      ageDebut: Math.max(ageDebut, 65),
      ageFin: 71,
      sourcesPrioritaires: this.determinePrioriteSources(revenuGaranti + deficitAnnuel),
      rationale: 'Équilibrer sources pour rester sous seuils PSV',
      tauxRetrait: 0.04,
      impactFiscal: 'OPTIMISE'
    });
    
    // Phase 3 (72+ ans) : Décaissement obligatoire FERR
    sequence.push({
      ageDebut: 72,
      ageFin: esperanceVie,
      sourcesPrioritaires: ['FERR', 'CELI_COMPLEMENT'],
      rationale: 'Décaissement FERR obligatoire + CELI pour équilibrer',
      tauxRetrait: 0.0527, // Minimum FERR à 72 ans
      impactFiscal: 'CONTRAINT'
    });
    
    return {
      sequencePhases: sequence,
      impactFiscalTotal: this.calculateTotalTaxImpact(sequence, reerValue),
      flexibiliteScore: this.assessFlexibilityScore(celiValue, reerValue + placementsValue),
      recommendationsSpeciales: this.generateSpecialRecommendations(params)
    };
  }
  
  /**
   * NOUVEAU: Optimisation fonds de solidarité
   */
  static analyzeFondsSolidarite(params: {
    revenuAnnuel: number;
    ageActuel: number;
    ageRetraite: number;
    capaciteEpargne: number;
  }): FondsSolidariteAnalysis {
    
    const { revenuAnnuel, ageActuel, ageRetraite, capaciteEpargne } = params;
    const anneesInvestissement = ageRetraite - ageActuel;
    
    // Données des documents : Fondaction 13.3%, FTQ 13.4% (10 ans)
    const rendementFondaction = 0.133;
    const rendementFTQ = 0.134;
    const creditImpot = 0.30; // 30% crédit d'impôt
    
    // Calcul avec crédit d'impôt intégré
    const investissementNet = capaciteEpargne * (1 - creditImpot); // Coût réel après crédit
    
    // Projection Fondaction
    const valeurFinaleFondaction = investissementNet * Math.pow(1 + rendementFondaction, Math.min(anneesInvestissement, 10));
    
    // Projection FTQ
    const valeurFinaleFTQ = investissementNet * Math.pow(1 + rendementFTQ, Math.min(anneesInvestissement, 10));
    
    // Comparaison avec REER traditionnel (6% rendement)
    const valeurFinaleREERTraditionnel = capaciteEpargne * Math.pow(1.06, anneesInvestissement);
    
    return {
      recommandation: this.evaluateFondsSolidariteViability(revenuAnnuel, anneesInvestissement),
      projections: {
        fondaction: {
          investissementNet,
          valeurFinale: valeurFinaleFondaction,
          rendementEffectif: rendementFondaction,
          avantageVsREER: valeurFinaleFondaction - valeurFinaleREERTraditionnel
        },
        ftq: {
          investissementNet,
          valeurFinale: valeurFinaleFTQ,
          rendementEffectif: rendementFTQ,
          avantageVsREER: valeurFinaleFTQ - valeurFinaleREERTraditionnel
        }
      },
      contraintes: [
        'Immobilisation jusqu\'à la retraite ou 65 ans',
        'Risque de liquidité en cas d\'urgence',
        'Performance liée à l\'économie québécoise'
      ],
      eligibilite: this.checkFondsSolidariteEligibility(revenuAnnuel)
    };
  }
  
  // Méthodes utilitaires
  private static calculateTauxMarginal(revenu: number): number {
    for (const tranche of Object.values(this.PARAMS.tauxMarginauxCombines)) {
      if (revenu >= tranche.min && revenu < tranche.max) {
        return tranche.taux;
      }
    }
    return this.PARAMS.tauxMarginauxCombines.tranche4.taux;
  }
  
  private static calculatePSVImpact(revenuRetraite: number, montantRetrait: number): number {
    const nouveauRevenu = revenuRetraite + montantRetrait;
    
    if (nouveauRevenu <= this.PARAMS.psvSeuilRecuperationPartielle) return 0;
    
    const tauxRecuperation = 0.15;
    const revenuExcedentaire = nouveauRevenu - this.PARAMS.psvSeuilRecuperationPartielle;
    
    return Math.min(
      revenuExcedentaire * tauxRecuperation,
      717.15 * 12 // PSV maximale annuelle
    );
  }
  
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

// Nouvelles interfaces
interface REERCELIRecommendation {
  recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
  raisonnement: string[];
  repartitionSuggeree: {
    reerPart: number;
    celiPart: number;
    justification: string;
  };
  impactFiscal: {
    economieImmediateREER: number;
    impactFuturREER: number;
    avantageNetREER: number;
    impactPSV: number;
  };
  strategiesComplementaires: string[];
}

interface WithdrawalStrategy {
  sequencePhases: WithdrawalPhase[];
  impactFiscalTotal: number;
  flexibiliteScore: number;
  recommendationsSpeciales: string[];
}

interface WithdrawalPhase {
  ageDebut: number;
  ageFin: number;
  sourcesPrioritaires: string[];
  rationale: string;
  tauxRetrait: number;
  impactFiscal: 'MINIMAL' | 'OPTIMISE' | 'CONTRAINT';
}

interface FondsSolidariteAnalysis {
  recommandation: 'RECOMMANDE' | 'ACCEPTABLE' | 'NON_RECOMMANDE';
  projections: {
    fondaction: FondsProjection;
    ftq: FondsProjection;
  };
  contraintes: string[];
  eligibilite: boolean;
}

interface FondsProjection {
  investissementNet: number;
  valeurFinale: number;
  rendementEffectif: number;
  avantageVsREER: number;
}
```

### **1.2 Service de Gestion Budgétaire Retraite**

Créez : `src/features/retirement/services/RetirementBudgetService.ts`

```typescript
// ===== SERVICE BUDGÉTAIRE RETRAITE =====
// Basé sur les documents EducFinance et guides spécialisés

export interface RetirementBudgetAnalysis {
  depensesProjectees: {
    eliminees: ExpenseCategory[];
    diminuees: ExpenseCategory[];
    stables: ExpenseCategory[];
    augmentees: ExpenseCategory[];
  };
  fondUrgenceRequis: number;
  repartitionComptes: AccountSeparationStrategy;
  optimisationFiscale: TaxOptimizationSuggestions;
}

export class RetirementBudgetService {
  
  /**
   * Analyse des changements de dépenses à la retraite
   * Basé sur le Tableau 4 des documents EducFinance
   */
  static analyzeRetirementExpenseChanges(
    currentExpenses: MonthlyExpenses
  ): RetirementBudgetAnalysis {
    
    // Classification selon les documents
    const depensesProjectees = {
      eliminees: [
        { categorie: 'Cotisations RRQ', montantActuel: currentExpenses.rrqCotisations || 0, pourcentageReduction: 100 },
        { categorie: 'Cotisations REER employeur', montantActuel: currentExpenses.reerEmployeur || 0, pourcentageReduction: 100 },
        { categorie: 'Cotisations professionnelles', montantActuel: currentExpenses.cotisationsPro || 0, pourcentageReduction: 100 },
        { categorie: 'Assurance-emploi', montantActuel: currentExpenses.assuranceEmploi || 0, pourcentageReduction: 100 }
      ],
      
      diminuees: [
        { categorie: 'Transport', montantActuel: currentExpenses.transport, pourcentageReduction: 30 },
        { categorie: 'Vêtements', montantActuel: currentExpenses.vetements, pourcentageReduction: 25 },
        { categorie: 'Entretien véhicule', montantActuel: currentExpenses.vehicule, pourcentageReduction: 20 }
      ],
      
      stables: [
        { categorie: 'Logement', montantActuel: currentExpenses.logement, pourcentageReduction: 0 },
        { categorie: 'Alimentation', montantActuel: currentExpenses.alimentation, pourcentageReduction: 0 }
      ],
      
      augmentees: [
        { categorie: 'Soins de santé', montantActuel: currentExpenses.sante, pourcentageAugmentation: 40 },
        { categorie: 'Activités sociales', montantActuel: currentExpenses.loisirs, pourcentageAugmentation: 25 },
        { categorie: 'Frais de voyage', montantActuel: currentExpenses.voyages || 0, pourcentageAugmentation: 60 }
      ]
    };
    
    // Calcul fond d'urgence (3-6 mois selon situation)
    const depensesTotalesRetraite = this.calculateTotalRetirementExpenses(depensesProjectees);
    const fondUrgenceRequis = depensesTotalesRetraite * 4; // 4 mois en moyenne
    
    // Stratégie comptes séparés (basée sur document EducFinance)
    const repartitionComptes = {
      compteDependesFixes: this.calculateFixedExpensesAccount(depensesProjectees),
      compteGestionCourante: this.calculateVariableExpensesAccount(depensesProjectees),
      justification: [
        'Séparation dépenses fixes vs variables pour meilleur contrôle',
        'Évite les frais bancaires avec soldes minimums',
        'Simplification gestion en couple'
      ]
    };
    
    return {
      depensesProjectees,
      fondUrgenceRequis,
      repartitionComptes,
      optimisationFiscale: this.generateTaxOptimizationSuggestions(depensesProjectees)
    };
  }
  
  /**
   * NOUVEAU: Planification successorale intégrée
   */
  static analyzeEstateConsiderations(params: {
    ageActuel: number;
    situationFamiliale: 'CELIBATAIRE' | 'COUPLE' | 'UNION_FAIT';
    enfants: boolean;
    valeursPatrimoine: {
      reer: number;
      celi: number;
      residence: number;
      placements: number;
    };
  }): EstateAnalysis {
    
    const { ageActuel, situationFamiliale, enfants, valeursPatrimoine } = params;
    
    // Priorités basées sur les documents
    const prioritesSuccessorales: Priority[] = [
      {
        ordre: 1,
        action: 'Rédiger/réviser testament',
        urgence: situationFamiliale === 'UNION_FAIT' || enfants ? 'CRITIQUE' : 'IMPORTANTE',
        justification: 'Protection des héritiers et respect des volontés'
      },
      {
        ordre: 2,
        action: 'Préparer mandat en cas d\'inaptitude',
        urgence: ageActuel >= 60 ? 'CRITIQUE' : 'IMPORTANTE',
        justification: 'Sécurité financière en cas d\'incapacité'
      },
      {
        ordre: 3,
        action: 'Éviter comptes entièrement conjoints',
        urgence: 'MOYENNE',
        justification: 'Éviter blocage fonds lors du décès (plusieurs semaines/mois)'
      }
    ];
    
    // Stratégies REER/CELI pour succession
    const strategiesSuccessorales = this.generateEstateStrategies(valeursPatrimoine, situationFamiliale);
    
    return {
      prioritesSuccessorales,
      strategiesSuccessorales,
      impactFiscalSuccession: this.calculateEstateImpact(valeursPatrimoine),
      documentsRequis: this.listRequiredDocuments(situationFamiliale, enfants),
      timelineActions: this.createEstateTimeline(prioritesSuccessorales)
    };
  }
}
```

---

## 📈 **PHASE 2 : INTÉGRATION DANS LE CALCULATIONSERVICE EXISTANT**

### **2.1 Mise à jour du CalculationService principal**

Modifiez votre `CalculationService.ts` existant :

```typescript
// Ajoutez ces imports
import { TaxOptimizationService2025 } from './TaxOptimizationService2025';
import { RetirementBudgetService } from './RetirementBudgetService';

// Dans la méthode calculateAll, ajoutez ces nouveaux calculs :
static calculateAll(userData: UserData): Calculations {
  try {
    const enhancedCalculations = {
      // ... calculs existants conservés
      netWorth: this.calculateNetWorth(userData),
      retirementCapital: this.calculateRetirementCapital(userData),
      sufficiency: this.calculateSufficiency(userData),
      
      // NOUVEAUX CALCULS 2025
      reerCeliOptimization: this.calculateREERCELIOptimization(userData),
      withdrawalStrategy: this.calculateWithdrawalStrategy(userData),
      budgetAnalysis: this.calculateRetirementBudgetAnalysis(userData),
      fondsSolidariteAnalysis: this.calculateFondsSolidariteAnalysis(userData),
      estateConsiderations: this.calculateEstateConsiderations(userData),
      
      // Calculs existants améliorés
      rrqOptimization: this.calculateRRQOptimizationEnhanced(userData),
      taxSavings: this.calculateEnhancedTaxSavings(userData)
    };
    
    return enhancedCalculations;
  } catch (error) {
    console.error('Erreur dans les calculs:', error);
    throw new Error('Erreur lors des calculs financiers');
  }
}

/**
 * NOUVEAU: Optimisation REER vs CELI personnalisée
 */
private static calculateREERCELIOptimization(userData: UserData): any {
  const revenuActuel = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
  const ageActuel = this.calculateAge(userData.personal.naissance1);
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  
  // Estimation revenu de retraite
  const revenuProjetteRetraite = this.estimateRetirementIncome(userData);
  
  // Capacité d'épargne disponible
  const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
  
  return TaxOptimizationService2025.analyzeREERvsCELI({
    revenuActuel,
    revenuProjetteRetraite,
    ageActuel,
    ageRetraite,
    montantDisponible: capaciteEpargne,
    situationConjoint: userData.personal.salaire2 > 0 ? 'COUPLE' : 'SEUL'
  });
}

/**
 * NOUVEAU: Stratégie de décaissement optimisée
 */
private static calculateWithdrawalStrategy(userData: UserData): any {
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  const esperanceVie = userData.retirement.esperanceVie1 || 85;
  
  const reerTotal = (userData.savings.reer1 || 0) + (userData.savings.reer2 || 0);
  const celiTotal = (userData.savings.celi1 || 0) + (userData.savings.celi2 || 0);
  const placementsTotal = (userData.savings.placements1 || 0) + (userData.savings.placements2 || 0);
  
  // Revenus garantis estimés
  const revenuRRQ = (userData.retirement.rrqMontantActuel1 || 0) + (userData.retirement.rrqMontantActuel2 || 0);
  const revenuPSV = 717.15 * 2; // Estimation couple
  const revenuGaranti = (revenuRRQ + revenuPSV) * 12;
  
  const depensesAnnuelles = this.calculateMonthlyExpenses(userData) * 12 * 0.75; // 75% dépenses actuelles
  
  return TaxOptimizationService2025.optimizeWithdrawalSequence({
    ageDebut: ageRetraite,
    reerValue: reerTotal,
    celiValue: celiTotal,
    placementsValue: placementsTotal,
    revenuGaranti,
    depensesAnnuelles,
    esperanceVie
  });
}

/**
 * NOUVEAU: Analyse budgétaire spécialisée retraite
 */
private static calculateRetirementBudgetAnalysis(userData: UserData): any {
  const currentExpenses = {
    logement: userData.cashflow.logement || 0,
    alimentation: userData.cashflow.alimentation || 0,
    transport: userData.cashflow.transport || 0,
    sante: userData.cashflow.sante || 0,
    loisirs: userData.cashflow.loisirs || 0,
    // Ajouter les autres catégories selon vos données
  };
  
  return RetirementBudgetService.analyzeRetirementExpenseChanges(currentExpenses);
}

/**
 * NOUVEAU: Analyse fonds de solidarité
 */
private static calculateFondsSolidariteAnalysis(userData: UserData): any {
  const revenuAnnuel = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
  const ageActuel = this.calculateAge(userData.personal.naissance1);
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
  
  return TaxOptimizationService2025.analyzeFondsSolidarite({
    revenuAnnuel,
    ageActuel,
    ageRetraite,
    capaciteEpargne
  });
}
```

---

## 🎨 **PHASE 3 : INTERFACE UTILISATEUR ENRICHIE**

### **3.1 Nouveau Composant de Stratégies Fiscales**

Créez : `src/features/retirement/components/TaxOptimizationDashboard.tsx`

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Calculator, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  AlertTriangle, CheckCircle, Info, Target, ArrowRightLeft, Banknote
} from 'lucide-react';

interface TaxOptimizationDashboardProps {
  calculations: any;
  userData: any;
}

export const TaxOptimizationDashboard: React.FC<TaxOptimizationDashboardProps> = ({
  calculations,
  userData
}) => {
  const [activeTab, setActiveTab] = useState('reer-celi');
  
  return (
    <div className="w-full space-y-6">
      {/* En-tête avec métriques fiscales clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Économies fiscales REER</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.economieImmediateREER || 0)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Impact PSV potentiel</div>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.impactPSV || 0)}
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avantage net REER</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.avantageNetREER || 0)}
                </div>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reer-celi">REER vs CELI</TabsTrigger>
          <TabsTrigger value="withdrawal">Décaissement</TabsTrigger>
          <TabsTrigger value="budget">Budget Retraite</TabsTrigger>
          <TabsTrigger value="estate">Succession</TabsTrigger>
        </TabsList>
        
        {/* Onglet REER vs CELI */}
        <TabsContent value="reer-celi" className="space-y-6">
          <REERCELIAnalysisTab 
            optimization={calculations.reerCeliOptimization}
            fondsSolidarite={calculations.fondsSolidariteAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Stratégie de décaissement */}
        <TabsContent value="withdrawal" className="space-y-6">
          <WithdrawalStrategyTab 
            strategy={calculations.withdrawalStrategy}
            userData={userData}
          />
        </TabsContent>
        
        {/* Onglet Budget retraite */}
        <TabsContent value="budget" className="space-y-6">
          <RetirementBudgetTab 
            budgetAnalysis={calculations.budgetAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Considérations successorales */}
        <TabsContent value="estate" className="space-y-6">
          <EstateConsiderationsTab 
            estateAnalysis={calculations.estateConsiderations}
            userData={userData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ===== COMPOSANTS ONGLETS =====

const REERCELIAnalysisTab: React.FC<any> = ({ optimization, fondsSolidarite }) => {
  return (
    <div className="space-y-6">
      {/* Recommandation principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stratégie recommandée : {optimization?.recommandation || 'En cours d\'analyse'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition suggérée */}
            <div>
              <h3 className="font-medium mb-3">Répartition optimale de votre épargne</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'REER', value: optimization?.repartitionSuggeree?.reerPart || 50, fill: '#3B82F6' },
                      { name: 'CELI', value: optimization?.repartitionSuggeree?.celiPart || 50, fill: '#10B981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#10B981" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Raisonnement */}
            <div>
              <h3 className="font-medium mb-3">Pourquoi cette stratégie ?</h3>
              <div className="space-y-2">
                {optimization?.raisonnement?.map((raison: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{raison}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Impact fiscal détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse de l'impact fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(optimization?.impactFiscal?.economieImmediateREER || 0)}
              </div>
              <div className="text-sm text-green-600">Économie immédiate REER</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(optimization?.impactFiscal?.impactFuturREER || 0)}
              </div>
              <div className="text-sm text-blue-600">Impact fiscal futur</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                {formatCurrency(optimization?.impactFiscal?.avantageNetREER || 0)}
              </div>
              <div className="text-sm text-purple-600">Avantage net REER</div>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-lg font-bold text-amber-700">
                {formatCurrency(optimization?.impactFiscal?.impactPSV || 0)}
              </div>
              <div className="text-sm text-amber-600">Impact PSV annuel</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fonds de solidarité */}
      {fondsSolidarite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Analyse des fonds de solidarité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Fondaction vs Fonds FTQ</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fondaction (10 ans)</span>
                    <span className="font-medium">13.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fonds FTQ (10 ans)</span>
                    <span className="font-medium">13.4%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    *Rendements incluant les crédits d'impôt de 30%
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Contraintes importantes</h3>
                <div className="space-y-2">
                  {fondsSolidarite?.contraintes?.map((contrainte: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{contrainte}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const WithdrawalStrategyTab: React.FC<any> = ({ strategy, userData }) => {
  return (
    <div className="space-y-6">
      {/* Séquence de décaissement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Séquence de décaissement optimisée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategy?.sequencePhases?.map((phase: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Phase {index + 1}: {phase.ageDebut}-{phase.ageFin} ans
                  </h3>
                  <Badge variant={phase.impactFiscal === 'OPTIMISE' ? 'default' : 'secondary'}>
                    {phase.impactFiscal}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Sources prioritaires</div>
                    <div className="space-y-1">
                      {phase.sourcesPrioritaires?.map((source: string, i: number) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Taux de retrait</div>
                    <div className="text-lg font-medium">{(phase.tauxRetrait * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Rationale:</strong> {phase.rationale}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Score de flexibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Flexibilité de votre stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Score de flexibilité</span>
              <Progress value={strategy?.flexibiliteScore || 0} className="flex-1" />
              <span className="text-sm font-medium">
                {strategy?.flexibiliteScore || 0}/100
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Avantages de votre stratégie</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Optimisation fiscale progressive
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Préservation des prestations gouvernementales
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Flexibilité d'ajustement selon les besoins
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Recommandations spéciales</h3>
                <div className="space-y-1">
                  {strategy?.recommendationsSpeciales?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RetirementBudgetTab: React.FC<any> = ({ budgetAnalysis }) => {
  const depensesData = [
    { 
      categorie: 'Éliminées', 
      montant: budgetAnalysis?.depensesProjectees?.eliminees?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#EF4444'
    },
    { 
      categorie: 'Diminuées', 
      montant: budgetAnalysis?.depensesProjectees?.diminuees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 - dep.pourcentageReduction/100), 0) || 0,
      color: '#F59E0B'
    },
    { 
      categorie: 'Stables', 
      montant: budgetAnalysis?.depensesProjectees?.stables?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#6B7280'
    },
    { 
      categorie: 'Augmentées', 
      montant: budgetAnalysis?.depensesProjectees?.augmentees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 + dep.pourcentageAugmentation/100), 0) || 0,
      color: '#10B981'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Changements de dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de vos dépenses à la retraite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={depensesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categorie" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="montant" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Détail par catégorie</h3>
              {depensesData.map((categorie, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded" style={{backgroundColor: categorie.color + '20'}}>
                  <span className="text-sm font-medium">{categorie.categorie}</span>
                  <span className="text-sm">{formatCurrency(categorie.montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fond d'urgence et stratégie comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fond d'urgence recommandé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(budgetAnalysis?.fondUrgenceRequis || 0)}
              </div>
              <div className="text-sm text-gray-600">
                Équivaut à 4 mois de dépenses de retraite
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <strong>Recommandation:</strong> Placer dans CELI pour accessibilité maximale sans impact fiscal
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stratégie de comptes séparés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte dépenses fixes</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteDependesFixes || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Loyer, assurances, taxes, abonnements
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte gestion courante</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteGestionCourante || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Épicerie, essence, loisirs, imprévus
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

;
    } else {
      return `${(amount / 1000).toFixed(0)}k # INSTRUCTIONS CLAUDE - INTÉGRATION DOCUMENTS FINANCIERS 2025

## 🎯 **CONTEXTE ET OBJECTIFS**

Vous devez maintenant intégrer de nouvelles informations financières critiques découvertes dans les documents "Finances - *.txt" qui peuvent significativement améliorer votre module de planification de retraite existant. Ces documents contiennent des données actualisées sur :

- **Plafonds de cotisation 2025** (REER 32 490 $, CELI 7 000 $)
- **Seuils de récupération PSV 2025** (90 997 $ → 148 451 $)
- **Rendements réels des fonds de solidarité** (13.3-13.4% incluant crédits d'impôt)
- **Stratégies fiscales avancées** pour optimisation REER/CELI
- **Considérations successorales** (comptes conjoints, mandats d'inaptitude)
- **Gestion des dépenses à la retraite** (budgetisation spécialisée)

**Public cible :** Futurs retraités québécois de 60+ ans recherchant des stratégies personnalisées.

---

## 📊 **PHASE 1 : MISE À JOUR DES PARAMÈTRES DE BASE**

### **1.1 Service de Configuration Fiscale 2025**

Créez le fichier : `src/features/retirement/services/TaxParametersService2025.ts`

```typescript
// ===== SERVICE PARAMÈTRES FISCAUX 2025 =====
// Basé sur les nouveaux documents "Finances - *.txt"

export interface TaxParameters2025 {
  // Plafonds de cotisation mis à jour
  reerPlafond: 32490; // Augmentation vs 2024
  celiPlafond: 7000;  // Maintenu
  
  // Seuils PSV critiques
  psvSeuilRecuperationPartielle: 90997;   // Début récupération
  psvSeuilRecuperationComplete: 148451;   // Perte totale 65-74 ans
  psvSeuilRecuperationComplete75Plus: 153771; // Perte totale 75+ ans
  
  // Crédit en raison de l'âge
  creditAgeSeuilRevenu: 42335;
  creditAgeReductionTaux: 0.15; // 15% de réduction
  
  // Taux marginaux Québec 2025
  tauxMarginauxCombines: {
    tranche1: { min: 0, max: 51780, taux: 0.2779 },      // 27.79%
    tranche2: { min: 51780, max: 103545, taux: 0.3612 }, // 36.12%
    tranche3: { min: 103545, max: 126000, taux: 0.4612 }, // 46.12%
    tranche4: { min: 126000, max: Infinity, taux: 0.5312 } // 53.12%
  };
}

export class TaxOptimizationService2025 {
  
  private static readonly PARAMS: TaxParameters2025 = {
    reerPlafond: 32490,
    celiPlafond: 7000,
    psvSeuilRecuperationPartielle: 90997,
    psvSeuilRecuperationComplete: 148451,
    psvSeuilRecuperationComplete75Plus: 153771,
    creditAgeSeuilRevenu: 42335,
    creditAgeReductionTaux: 0.15,
    tauxMarginauxCombines: {
      tranche1: { min: 0, max: 51780, taux: 0.2779 },
      tranche2: { min: 51780, max: 103545, taux: 0.3612 },
      tranche3: { min: 103545, max: 126000, taux: 0.4612 },
      tranche4: { min: 126000, max: Infinity, taux: 0.5312 }
    }
  };
  
  /**
   * NOUVEAU: Analyse optimisation REER vs CELI personnalisée
   */
  static analyzeREERvsCELI(params: {
    revenuActuel: number;
    revenuProjetteRetraite: number;
    ageActuel: number;
    ageRetraite: number;
    montantDisponible: number;
    situationConjoint: 'SEUL' | 'COUPLE';
  }): REERCELIRecommendation {
    
    const { revenuActuel, revenuProjetteRetraite, ageActuel, montantDisponible } = params;
    
    // Calcul taux marginal actuel vs futur
    const tauxMarginalActuel = this.calculateTauxMarginal(revenuActuel);
    const tauxMarginalRetraite = this.calculateTauxMarginal(revenuProjetteRetraite);
    
    // Économie fiscale REER immédiate
    const economieREER = montantDisponible * tauxMarginalActuel;
    
    // Impact futur REER (imposition au retrait)
    const impactFiscalFutur = montantDisponible * tauxMarginalRetraite;
    
    // Avantage net REER vs CELI
    const avantageNetREER = economieREER - impactFiscalFutur;
    
    // Calcul seuils PSV
    const impactPSV = this.calculatePSVImpact(revenuProjetteRetraite, montantDisponible);
    
    // Analyse selon la situation
    let recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
    let raisonnement: string[] = [];
    
    if (tauxMarginalActuel > tauxMarginalRetraite + 0.05) {
      recommandation = 'REER_PRIORITE';
      raisonnement = [
        `Taux marginal actuel (${(tauxMarginalActuel*100).toFixed(1)}%) > taux futur (${(tauxMarginalRetraite*100).toFixed(1)}%)`,
        `Économie fiscale immédiate : ${this.formatCurrency(economieREER)}`,
        "Optimisation via déduction fiscale"
      ];
    } else if (revenuProjetteRetraite > this.PARAMS.psvSeuilRecuperationPartielle) {
      recommandation = 'CELI_PRIORITE';
      raisonnement = [
        "Revenu de retraite élevé → risque récupération PSV",
        "CELI ne compte pas comme revenu imposable",
        `Évite la récupération PSV (seuil: ${this.formatCurrency(this.PARAMS.psvSeuilRecuperationPartielle)})`
      ];
    } else {
      recommandation = 'EQUILIBRE';
      raisonnement = [
        "Taux marginaux similaires présent vs futur",
        "Diversification fiscale recommandée",
        "Flexibilité CELI + déduction REER"
      ];
    }
    
    return {
      recommandation,
      raisonnement,
      repartitionSuggeree: this.calculateOptimalSplit(montantDisponible, recommandation),
      impactFiscal: {
        economieImmediateREER: economieREER,
        impactFuturREER: impactFiscalFutur,
        avantageNetREER: avantageNetREER,
        impactPSV: impactPSV
      },
      strategiesComplementaires: this.generateComplementaryStrategies(params)
    };
  }
  
  /**
   * NOUVEAU: Stratégie de décaissement optimisée
   */
  static optimizeWithdrawalSequence(params: {
    ageDebut: number;
    reerValue: number;
    celiValue: number;
    placementsValue: number;
    revenuGaranti: number; // RRQ + PSV
    depensesAnnuelles: number;
    esperanceVie: number;
  }): WithdrawalStrategy {
    
    const { ageDebut, reerValue, celiValue, placementsValue, revenuGaranti, depensesAnnuelles, esperanceVie } = params;
    
    const anneesRetraite = esperanceVie - ageDebut;
    const deficitAnnuel = Math.max(0, depensesAnnuelles - revenuGaranti);
    
    // Stratégie séquentielle basée sur les documents
    const sequence: WithdrawalPhase[] = [];
    
    // Phase 1 (60-65 ans) : Si retraite anticipée
    if (ageDebut < 65) {
      sequence.push({
        ageDebut: ageDebut,
        ageFin: 65,
        sourcesPrioritaires: ['CELI', 'PLACEMENTS_NON_ENREGISTRES'],
        rationale: 'Éviter pénalités REER et préserver revenus garantis futurs',
        tauxRetrait: 0.035,
        impactFiscal: 'MINIMAL'
      });
    }
    
    // Phase 2 (65-71 ans) : Optimisation fiscale
    sequence.push({
      ageDebut: Math.max(ageDebut, 65),
      ageFin: 71,
      sourcesPrioritaires: this.determinePrioriteSources(revenuGaranti + deficitAnnuel),
      rationale: 'Équilibrer sources pour rester sous seuils PSV',
      tauxRetrait: 0.04,
      impactFiscal: 'OPTIMISE'
    });
    
    // Phase 3 (72+ ans) : Décaissement obligatoire FERR
    sequence.push({
      ageDebut: 72,
      ageFin: esperanceVie,
      sourcesPrioritaires: ['FERR', 'CELI_COMPLEMENT'],
      rationale: 'Décaissement FERR obligatoire + CELI pour équilibrer',
      tauxRetrait: 0.0527, // Minimum FERR à 72 ans
      impactFiscal: 'CONTRAINT'
    });
    
    return {
      sequencePhases: sequence,
      impactFiscalTotal: this.calculateTotalTaxImpact(sequence, reerValue),
      flexibiliteScore: this.assessFlexibilityScore(celiValue, reerValue + placementsValue),
      recommendationsSpeciales: this.generateSpecialRecommendations(params)
    };
  }
  
  /**
   * NOUVEAU: Optimisation fonds de solidarité
   */
  static analyzeFondsSolidarite(params: {
    revenuAnnuel: number;
    ageActuel: number;
    ageRetraite: number;
    capaciteEpargne: number;
  }): FondsSolidariteAnalysis {
    
    const { revenuAnnuel, ageActuel, ageRetraite, capaciteEpargne } = params;
    const anneesInvestissement = ageRetraite - ageActuel;
    
    // Données des documents : Fondaction 13.3%, FTQ 13.4% (10 ans)
    const rendementFondaction = 0.133;
    const rendementFTQ = 0.134;
    const creditImpot = 0.30; // 30% crédit d'impôt
    
    // Calcul avec crédit d'impôt intégré
    const investissementNet = capaciteEpargne * (1 - creditImpot); // Coût réel après crédit
    
    // Projection Fondaction
    const valeurFinaleFondaction = investissementNet * Math.pow(1 + rendementFondaction, Math.min(anneesInvestissement, 10));
    
    // Projection FTQ
    const valeurFinaleFTQ = investissementNet * Math.pow(1 + rendementFTQ, Math.min(anneesInvestissement, 10));
    
    // Comparaison avec REER traditionnel (6% rendement)
    const valeurFinaleREERTraditionnel = capaciteEpargne * Math.pow(1.06, anneesInvestissement);
    
    return {
      recommandation: this.evaluateFondsSolidariteViability(revenuAnnuel, anneesInvestissement),
      projections: {
        fondaction: {
          investissementNet,
          valeurFinale: valeurFinaleFondaction,
          rendementEffectif: rendementFondaction,
          avantageVsREER: valeurFinaleFondaction - valeurFinaleREERTraditionnel
        },
        ftq: {
          investissementNet,
          valeurFinale: valeurFinaleFTQ,
          rendementEffectif: rendementFTQ,
          avantageVsREER: valeurFinaleFTQ - valeurFinaleREERTraditionnel
        }
      },
      contraintes: [
        'Immobilisation jusqu\'à la retraite ou 65 ans',
        'Risque de liquidité en cas d\'urgence',
        'Performance liée à l\'économie québécoise'
      ],
      eligibilite: this.checkFondsSolidariteEligibility(revenuAnnuel)
    };
  }
  
  // Méthodes utilitaires
  private static calculateTauxMarginal(revenu: number): number {
    for (const tranche of Object.values(this.PARAMS.tauxMarginauxCombines)) {
      if (revenu >= tranche.min && revenu < tranche.max) {
        return tranche.taux;
      }
    }
    return this.PARAMS.tauxMarginauxCombines.tranche4.taux;
  }
  
  private static calculatePSVImpact(revenuRetraite: number, montantRetrait: number): number {
    const nouveauRevenu = revenuRetraite + montantRetrait;
    
    if (nouveauRevenu <= this.PARAMS.psvSeuilRecuperationPartielle) return 0;
    
    const tauxRecuperation = 0.15;
    const revenuExcedentaire = nouveauRevenu - this.PARAMS.psvSeuilRecuperationPartielle;
    
    return Math.min(
      revenuExcedentaire * tauxRecuperation,
      717.15 * 12 // PSV maximale annuelle
    );
  }
  
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

// Nouvelles interfaces
interface REERCELIRecommendation {
  recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
  raisonnement: string[];
  repartitionSuggeree: {
    reerPart: number;
    celiPart: number;
    justification: string;
  };
  impactFiscal: {
    economieImmediateREER: number;
    impactFuturREER: number;
    avantageNetREER: number;
    impactPSV: number;
  };
  strategiesComplementaires: string[];
}

interface WithdrawalStrategy {
  sequencePhases: WithdrawalPhase[];
  impactFiscalTotal: number;
  flexibiliteScore: number;
  recommendationsSpeciales: string[];
}

interface WithdrawalPhase {
  ageDebut: number;
  ageFin: number;
  sourcesPrioritaires: string[];
  rationale: string;
  tauxRetrait: number;
  impactFiscal: 'MINIMAL' | 'OPTIMISE' | 'CONTRAINT';
}

interface FondsSolidariteAnalysis {
  recommandation: 'RECOMMANDE' | 'ACCEPTABLE' | 'NON_RECOMMANDE';
  projections: {
    fondaction: FondsProjection;
    ftq: FondsProjection;
  };
  contraintes: string[];
  eligibilite: boolean;
}

interface FondsProjection {
  investissementNet: number;
  valeurFinale: number;
  rendementEffectif: number;
  avantageVsREER: number;
}
```

### **1.2 Service de Gestion Budgétaire Retraite**

Créez : `src/features/retirement/services/RetirementBudgetService.ts`

```typescript
// ===== SERVICE BUDGÉTAIRE RETRAITE =====
// Basé sur les documents EducFinance et guides spécialisés

export interface RetirementBudgetAnalysis {
  depensesProjectees: {
    eliminees: ExpenseCategory[];
    diminuees: ExpenseCategory[];
    stables: ExpenseCategory[];
    augmentees: ExpenseCategory[];
  };
  fondUrgenceRequis: number;
  repartitionComptes: AccountSeparationStrategy;
  optimisationFiscale: TaxOptimizationSuggestions;
}

export class RetirementBudgetService {
  
  /**
   * Analyse des changements de dépenses à la retraite
   * Basé sur le Tableau 4 des documents EducFinance
   */
  static analyzeRetirementExpenseChanges(
    currentExpenses: MonthlyExpenses
  ): RetirementBudgetAnalysis {
    
    // Classification selon les documents
    const depensesProjectees = {
      eliminees: [
        { categorie: 'Cotisations RRQ', montantActuel: currentExpenses.rrqCotisations || 0, pourcentageReduction: 100 },
        { categorie: 'Cotisations REER employeur', montantActuel: currentExpenses.reerEmployeur || 0, pourcentageReduction: 100 },
        { categorie: 'Cotisations professionnelles', montantActuel: currentExpenses.cotisationsPro || 0, pourcentageReduction: 100 },
        { categorie: 'Assurance-emploi', montantActuel: currentExpenses.assuranceEmploi || 0, pourcentageReduction: 100 }
      ],
      
      diminuees: [
        { categorie: 'Transport', montantActuel: currentExpenses.transport, pourcentageReduction: 30 },
        { categorie: 'Vêtements', montantActuel: currentExpenses.vetements, pourcentageReduction: 25 },
        { categorie: 'Entretien véhicule', montantActuel: currentExpenses.vehicule, pourcentageReduction: 20 }
      ],
      
      stables: [
        { categorie: 'Logement', montantActuel: currentExpenses.logement, pourcentageReduction: 0 },
        { categorie: 'Alimentation', montantActuel: currentExpenses.alimentation, pourcentageReduction: 0 }
      ],
      
      augmentees: [
        { categorie: 'Soins de santé', montantActuel: currentExpenses.sante, pourcentageAugmentation: 40 },
        { categorie: 'Activités sociales', montantActuel: currentExpenses.loisirs, pourcentageAugmentation: 25 },
        { categorie: 'Frais de voyage', montantActuel: currentExpenses.voyages || 0, pourcentageAugmentation: 60 }
      ]
    };
    
    // Calcul fond d'urgence (3-6 mois selon situation)
    const depensesTotalesRetraite = this.calculateTotalRetirementExpenses(depensesProjectees);
    const fondUrgenceRequis = depensesTotalesRetraite * 4; // 4 mois en moyenne
    
    // Stratégie comptes séparés (basée sur document EducFinance)
    const repartitionComptes = {
      compteDependesFixes: this.calculateFixedExpensesAccount(depensesProjectees),
      compteGestionCourante: this.calculateVariableExpensesAccount(depensesProjectees),
      justification: [
        'Séparation dépenses fixes vs variables pour meilleur contrôle',
        'Évite les frais bancaires avec soldes minimums',
        'Simplification gestion en couple'
      ]
    };
    
    return {
      depensesProjectees,
      fondUrgenceRequis,
      repartitionComptes,
      optimisationFiscale: this.generateTaxOptimizationSuggestions(depensesProjectees)
    };
  }
  
  /**
   * NOUVEAU: Planification successorale intégrée
   */
  static analyzeEstateConsiderations(params: {
    ageActuel: number;
    situationFamiliale: 'CELIBATAIRE' | 'COUPLE' | 'UNION_FAIT';
    enfants: boolean;
    valeursPatrimoine: {
      reer: number;
      celi: number;
      residence: number;
      placements: number;
    };
  }): EstateAnalysis {
    
    const { ageActuel, situationFamiliale, enfants, valeursPatrimoine } = params;
    
    // Priorités basées sur les documents
    const prioritesSuccessorales: Priority[] = [
      {
        ordre: 1,
        action: 'Rédiger/réviser testament',
        urgence: situationFamiliale === 'UNION_FAIT' || enfants ? 'CRITIQUE' : 'IMPORTANTE',
        justification: 'Protection des héritiers et respect des volontés'
      },
      {
        ordre: 2,
        action: 'Préparer mandat en cas d\'inaptitude',
        urgence: ageActuel >= 60 ? 'CRITIQUE' : 'IMPORTANTE',
        justification: 'Sécurité financière en cas d\'incapacité'
      },
      {
        ordre: 3,
        action: 'Éviter comptes entièrement conjoints',
        urgence: 'MOYENNE',
        justification: 'Éviter blocage fonds lors du décès (plusieurs semaines/mois)'
      }
    ];
    
    // Stratégies REER/CELI pour succession
    const strategiesSuccessorales = this.generateEstateStrategies(valeursPatrimoine, situationFamiliale);
    
    return {
      prioritesSuccessorales,
      strategiesSuccessorales,
      impactFiscalSuccession: this.calculateEstateImpact(valeursPatrimoine),
      documentsRequis: this.listRequiredDocuments(situationFamiliale, enfants),
      timelineActions: this.createEstateTimeline(prioritesSuccessorales)
    };
  }
}
```

---

## 📈 **PHASE 2 : INTÉGRATION DANS LE CALCULATIONSERVICE EXISTANT**

### **2.1 Mise à jour du CalculationService principal**

Modifiez votre `CalculationService.ts` existant :

```typescript
// Ajoutez ces imports
import { TaxOptimizationService2025 } from './TaxOptimizationService2025';
import { RetirementBudgetService } from './RetirementBudgetService';

// Dans la méthode calculateAll, ajoutez ces nouveaux calculs :
static calculateAll(userData: UserData): Calculations {
  try {
    const enhancedCalculations = {
      // ... calculs existants conservés
      netWorth: this.calculateNetWorth(userData),
      retirementCapital: this.calculateRetirementCapital(userData),
      sufficiency: this.calculateSufficiency(userData),
      
      // NOUVEAUX CALCULS 2025
      reerCeliOptimization: this.calculateREERCELIOptimization(userData),
      withdrawalStrategy: this.calculateWithdrawalStrategy(userData),
      budgetAnalysis: this.calculateRetirementBudgetAnalysis(userData),
      fondsSolidariteAnalysis: this.calculateFondsSolidariteAnalysis(userData),
      estateConsiderations: this.calculateEstateConsiderations(userData),
      
      // Calculs existants améliorés
      rrqOptimization: this.calculateRRQOptimizationEnhanced(userData),
      taxSavings: this.calculateEnhancedTaxSavings(userData)
    };
    
    return enhancedCalculations;
  } catch (error) {
    console.error('Erreur dans les calculs:', error);
    throw new Error('Erreur lors des calculs financiers');
  }
}

/**
 * NOUVEAU: Optimisation REER vs CELI personnalisée
 */
private static calculateREERCELIOptimization(userData: UserData): any {
  const revenuActuel = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
  const ageActuel = this.calculateAge(userData.personal.naissance1);
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  
  // Estimation revenu de retraite
  const revenuProjetteRetraite = this.estimateRetirementIncome(userData);
  
  // Capacité d'épargne disponible
  const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
  
  return TaxOptimizationService2025.analyzeREERvsCELI({
    revenuActuel,
    revenuProjetteRetraite,
    ageActuel,
    ageRetraite,
    montantDisponible: capaciteEpargne,
    situationConjoint: userData.personal.salaire2 > 0 ? 'COUPLE' : 'SEUL'
  });
}

/**
 * NOUVEAU: Stratégie de décaissement optimisée
 */
private static calculateWithdrawalStrategy(userData: UserData): any {
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  const esperanceVie = userData.retirement.esperanceVie1 || 85;
  
  const reerTotal = (userData.savings.reer1 || 0) + (userData.savings.reer2 || 0);
  const celiTotal = (userData.savings.celi1 || 0) + (userData.savings.celi2 || 0);
  const placementsTotal = (userData.savings.placements1 || 0) + (userData.savings.placements2 || 0);
  
  // Revenus garantis estimés
  const revenuRRQ = (userData.retirement.rrqMontantActuel1 || 0) + (userData.retirement.rrqMontantActuel2 || 0);
  const revenuPSV = 717.15 * 2; // Estimation couple
  const revenuGaranti = (revenuRRQ + revenuPSV) * 12;
  
  const depensesAnnuelles = this.calculateMonthlyExpenses(userData) * 12 * 0.75; // 75% dépenses actuelles
  
  return TaxOptimizationService2025.optimizeWithdrawalSequence({
    ageDebut: ageRetraite,
    reerValue: reerTotal,
    celiValue: celiTotal,
    placementsValue: placementsTotal,
    revenuGaranti,
    depensesAnnuelles,
    esperanceVie
  });
}

/**
 * NOUVEAU: Analyse budgétaire spécialisée retraite
 */
private static calculateRetirementBudgetAnalysis(userData: UserData): any {
  const currentExpenses = {
    logement: userData.cashflow.logement || 0,
    alimentation: userData.cashflow.alimentation || 0,
    transport: userData.cashflow.transport || 0,
    sante: userData.cashflow.sante || 0,
    loisirs: userData.cashflow.loisirs || 0,
    // Ajouter les autres catégories selon vos données
  };
  
  return RetirementBudgetService.analyzeRetirementExpenseChanges(currentExpenses);
}

/**
 * NOUVEAU: Analyse fonds de solidarité
 */
private static calculateFondsSolidariteAnalysis(userData: UserData): any {
  const revenuAnnuel = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
  const ageActuel = this.calculateAge(userData.personal.naissance1);
  const ageRetraite = userData.personal.ageRetraiteSouhaite1 || 65;
  const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
  
  return TaxOptimizationService2025.analyzeFondsSolidarite({
    revenuAnnuel,
    ageActuel,
    ageRetraite,
    capaciteEpargne
  });
}
```

---

## 🎨 **PHASE 3 : INTERFACE UTILISATEUR ENRICHIE**

### **3.1 Nouveau Composant de Stratégies Fiscales**

Créez : `src/features/retirement/components/TaxOptimizationDashboard.tsx`

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Calculator, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  AlertTriangle, CheckCircle, Info, Target, ArrowRightLeft, Banknote
} from 'lucide-react';

interface TaxOptimizationDashboardProps {
  calculations: any;
  userData: any;
}

export const TaxOptimizationDashboard: React.FC<TaxOptimizationDashboardProps> = ({
  calculations,
  userData
}) => {
  const [activeTab, setActiveTab] = useState('reer-celi');
  
  return (
    <div className="w-full space-y-6">
      {/* En-tête avec métriques fiscales clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Économies fiscales REER</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.economieImmediateREER || 0)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Impact PSV potentiel</div>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.impactPSV || 0)}
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avantage net REER</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.avantageNetREER || 0)}
                </div>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reer-celi">REER vs CELI</TabsTrigger>
          <TabsTrigger value="withdrawal">Décaissement</TabsTrigger>
          <TabsTrigger value="budget">Budget Retraite</TabsTrigger>
          <TabsTrigger value="estate">Succession</TabsTrigger>
        </TabsList>
        
        {/* Onglet REER vs CELI */}
        <TabsContent value="reer-celi" className="space-y-6">
          <REERCELIAnalysisTab 
            optimization={calculations.reerCeliOptimization}
            fondsSolidarite={calculations.fondsSolidariteAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Stratégie de décaissement */}
        <TabsContent value="withdrawal" className="space-y-6">
          <WithdrawalStrategyTab 
            strategy={calculations.withdrawalStrategy}
            userData={userData}
          />
        </TabsContent>
        
        {/* Onglet Budget retraite */}
        <TabsContent value="budget" className="space-y-6">
          <RetirementBudgetTab 
            budgetAnalysis={calculations.budgetAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Considérations successorales */}
        <TabsContent value="estate" className="space-y-6">
          <EstateConsiderationsTab 
            estateAnalysis={calculations.estateConsiderations}
            userData={userData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ===== COMPOSANTS ONGLETS =====

const REERCELIAnalysisTab: React.FC<any> = ({ optimization, fondsSolidarite }) => {
  return (
    <div className="space-y-6">
      {/* Recommandation principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stratégie recommandée : {optimization?.recommandation || 'En cours d\'analyse'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition suggérée */}
            <div>
              <h3 className="font-medium mb-3">Répartition optimale de votre épargne</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'REER', value: optimization?.repartitionSuggeree?.reerPart || 50, fill: '#3B82F6' },
                      { name: 'CELI', value: optimization?.repartitionSuggeree?.celiPart || 50, fill: '#10B981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#10B981" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Raisonnement */}
            <div>
              <h3 className="font-medium mb-3">Pourquoi cette stratégie ?</h3>
              <div className="space-y-2">
                {optimization?.raisonnement?.map((raison: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{raison}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Impact fiscal détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse de l'impact fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(optimization?.impactFiscal?.economieImmediateREER || 0)}
              </div>
              <div className="text-sm text-green-600">Économie immédiate REER</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(optimization?.impactFiscal?.impactFuturREER || 0)}
              </div>
              <div className="text-sm text-blue-600">Impact fiscal futur</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                {formatCurrency(optimization?.impactFiscal?.avantageNetREER || 0)}
              </div>
              <div className="text-sm text-purple-600">Avantage net REER</div>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-lg font-bold text-amber-700">
                {formatCurrency(optimization?.impactFiscal?.impactPSV || 0)}
              </div>
              <div className="text-sm text-amber-600">Impact PSV annuel</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fonds de solidarité */}
      {fondsSolidarite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Analyse des fonds de solidarité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Fondaction vs Fonds FTQ</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fondaction (10 ans)</span>
                    <span className="font-medium">13.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fonds FTQ (10 ans)</span>
                    <span className="font-medium">13.4%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    *Rendements incluant les crédits d'impôt de 30%
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Contraintes importantes</h3>
                <div className="space-y-2">
                  {fondsSolidarite?.contraintes?.map((contrainte: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{contrainte}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const WithdrawalStrategyTab: React.FC<any> = ({ strategy, userData }) => {
  return (
    <div className="space-y-6">
      {/* Séquence de décaissement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Séquence de décaissement optimisée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategy?.sequencePhases?.map((phase: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Phase {index + 1}: {phase.ageDebut}-{phase.ageFin} ans
                  </h3>
                  <Badge variant={phase.impactFiscal === 'OPTIMISE' ? 'default' : 'secondary'}>
                    {phase.impactFiscal}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Sources prioritaires</div>
                    <div className="space-y-1">
                      {phase.sourcesPrioritaires?.map((source: string, i: number) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Taux de retrait</div>
                    <div className="text-lg font-medium">{(phase.tauxRetrait * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Rationale:</strong> {phase.rationale}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Score de flexibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Flexibilité de votre stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Score de flexibilité</span>
              <Progress value={strategy?.flexibiliteScore || 0} className="flex-1" />
              <span className="text-sm font-medium">
                {strategy?.flexibiliteScore || 0}/100
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Avantages de votre stratégie</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Optimisation fiscale progressive
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Préservation des prestations gouvernementales
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Flexibilité d'ajustement selon les besoins
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Recommandations spéciales</h3>
                <div className="space-y-1">
                  {strategy?.recommendationsSpeciales?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RetirementBudgetTab: React.FC<any> = ({ budgetAnalysis }) => {
  const depensesData = [
    { 
      categorie: 'Éliminées', 
      montant: budgetAnalysis?.depensesProjectees?.eliminees?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#EF4444'
    },
    { 
      categorie: 'Diminuées', 
      montant: budgetAnalysis?.depensesProjectees?.diminuees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 - dep.pourcentageReduction/100), 0) || 0,
      color: '#F59E0B'
    },
    { 
      categorie: 'Stables', 
      montant: budgetAnalysis?.depensesProjectees?.stables?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#6B7280'
    },
    { 
      categorie: 'Augmentées', 
      montant: budgetAnalysis?.depensesProjectees?.augmentees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 + dep.pourcentageAugmentation/100), 0) || 0,
      color: '#10B981'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Changements de dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de vos dépenses à la retraite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={depensesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categorie" />
                  <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="montant" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Détail par catégorie</h3>
              {depensesData.map((categorie, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded" style={{backgroundColor: categorie.color + '20'}}>
                  <span className="text-sm font-medium">{categorie.categorie}</span>
                  <span className="text-sm">{formatCurrency(categorie.montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fond d'urgence et stratégie comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fond d'urgence recommandé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(budgetAnalysis?.fondUrgenceRequis || 0)}
              </div>
              <div className="text-sm text-gray-600">
                Équivaut à 4 mois de dépenses de retraite
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <strong>Recommandation:</strong> Placer dans CELI pour accessibilité maximale sans impact fiscal
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stratégie de comptes séparés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte dépenses fixes</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteDependesFixes || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Loyer, assurances, taxes, abonnements
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte gestion courante</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteGestionCourante || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Épicerie, essence, loisirs, imprévus
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

;
    }
  }
  
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    