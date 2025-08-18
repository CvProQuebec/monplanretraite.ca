# Plan d'implémentation détaillé pour l'IA Cursor

## 🎯 **ORDRE D'IMPLÉMENTATION RECOMMANDÉ**

### **ÉTAPE 1 : SAUVEGARDE ET PRÉPARATION (5 minutes)**

```bash
# 1. Sauvegarder l'ancien service
cp src/features/retirement/services/CalculationService.ts src/features/retirement/services/CalculationService_backup.ts

# 2. Sauvegarder les types existants
cp src/features/retirement/types/index.ts src/features/retirement/types/index_backup.ts
```

### **ÉTAPE 2 : CRÉER LES NOUVEAUX SERVICES (15 minutes)**

#### **2.1 Créer EnhancedRRQService.ts**
```typescript
// src/features/retirement/services/EnhancedRRQService.ts
// ✅ Copier intégralement le code de l'artefact "corrections_urgentes_phase1"
```

#### **2.2 Créer OASGISService.ts**
```typescript
// src/features/retirement/services/OASGISService.ts
// ✅ Copier la partie OASGISService de l'artefact "corrections_urgentes_phase1"
```

### **ÉTAPE 3 : METTRE À JOUR LES TYPES (10 minutes)**

#### **3.1 Étendre les types existants dans types/index.ts**
```typescript
// Ajouter à la fin du fichier existant (ne pas remplacer)

// ===== NOUVEAUX TYPES POUR LES AMÉLIORATIONS =====

export interface AdvancedRRQAnalysis extends RRQAnalysis {
  impactInflation: InflationImpactAnalysis;
  analyseSensibilite: SensitivityAnalysis;
  scenariosAlternatifs: AlternativeScenario[];
  recommandationPersonnalisee: PersonalizedRecommendation;
  riskAnalysis: RRQRiskAnalysis;
}

export interface PersonalizedRecommendation {
  decision: 'COMMENCER_MAINTENANT' | 'ATTENDRE_JUSQU_72' | 'STRATEGIE_FLEXIBLE';
  raisonnement: string[];
  actionsConcretes: ActionItem[];
  timelineOptimal: TimelineStep[];
  niveauConfiance: number; // 0-100%
}

export interface ActionItem {
  priorite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  action: string;
  delai: string;
  impact: string;
}

export interface TimelineStep {
  age: number;
  action: string;
  rationale: string;
}

export interface RRQRiskAnalysis {
  risqueLongevite: number;
  risqueInflation: number;
  risquePolitique: number;
  strategiesMitigation: RiskMitigationStrategy[];
}

export interface RiskMitigationStrategy {
  risque: string;
  strategie: string;
  impact: string;
  facilite: 'FACILE' | 'MODERE' | 'DIFFICILE';
}

export interface OASGISCalculation {
  securiteVieillesse: {
    montantMensuel: number;
    ageDebut: number;
    seuil_recuperation: number;
    recuperationPartielle: number;
    recuperationComplete: number;
  };
  supplementRevenuGaranti: {
    montantMensuel: number;
    seuilRevenu: number;
    eligible: boolean;
    combinaisonOptimale: boolean;
  };
  optimisationCombinaison: {
    strategieRecommandee: string;
    impactFiscal: number;
    revenuNetProjecte: number;
  };
}

// ===== ÉTENDRE LES TYPES EXISTANTS =====

// Étendre Calculations existant (ajouter les nouveaux champs optionnels)
export interface Calculations {
  // Conserver tous les champs existants
  netWorth: number;
  retirementCapital: number;
  sufficiency: number;
  taxSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  rrqOptimization?: RRQOptimizationResult;
  
  // NOUVEAUX CHAMPS (optionnels pour compatibilité)
  oasGisProjection?: any;
  riskAnalysis?: any;
  recommendedActions?: any;
}

// Étendre RRQOptimizationResult existant
export interface RRQOptimizationResult {
  // Conserver les champs existants si ils existent
  person1?: AdvancedRRQAnalysis;
  person2?: AdvancedRRQAnalysis;
  combinedStrategy?: any;
  householdImpact?: any;
  
  // Nouveaux champs optionnels
  totalMaintenant?: number;
  total70?: number;
  montantPerdu?: number;
  ageRentabilite?: number;
  valeurActualiseeMaintenant?: number;
  valeurActualisee70?: number;
  recommandation?: string;
  difference?: number;
}
```

### **ÉTAPE 4 : METTRE À JOUR CalculationService.ts (20 minutes)**

#### **4.1 Stratégie de remplacement progressif**
```typescript
// src/features/retirement/services/CalculationService.ts

import { UserData, Calculations, RRQOptimizationResult } from '../types';
import { EnhancedRRQService } from './EnhancedRRQService';
import { OASGISService } from './OASGISService';

export class CalculationService {
  // ===== CONSERVER TOUTES LES CONSTANTES EXISTANTES =====
  // Mais mettre à jour les valeurs critiques
  
  private static readonly INFLATION_RATE = 0.025; // ✅ CORRIGÉ: 2.5% au lieu de 2%
  private static readonly INVESTMENT_RETURN = 0.06; // Garder 6%
  private static readonly TAX_RATE = 0.30; // Garder 30%
  private static readonly RETIREMENT_EXPENSE_RATIO = 0.75; // Garder 75%
  private static readonly WITHDRAWAL_RATE = 0.04; // Garder 4%
  
  // ===== MÉTHODE PRINCIPALE AMÉLIORÉE =====
  static calculateAll(userData: UserData): Calculations {
    try {
      // 1. Calculs de base (CONSERVER L'ANCIENNE LOGIQUE)
      const baseCalculations = {
        netWorth: this.calculateNetWorth(userData),
        retirementCapital: this.calculateRetirementCapital(userData),
        sufficiency: this.calculateSufficiency(userData),
        taxSavings: this.calculateTaxSavings(userData),
        monthlyIncome: this.calculateMonthlyIncome(userData),
        monthlyExpenses: this.calculateMonthlyExpenses(userData)
      };
      
      // 2. Calculs avancés (NOUVEAUX) avec fallbacks
      let rrqOptimization;
      try {
        rrqOptimization = this.calculateRRQOptimizationEnhanced(userData);
      } catch (error) {
        console.warn('Utilisation ancienne méthode RRQ:', error);
        rrqOptimization = this.calculateRRQOptimization(userData); // Ancienne méthode
      }
      
      let oasGisProjection;
      try {
        oasGisProjection = this.calculateOASGISProjection(userData);
      } catch (error) {
        console.warn('Erreur OAS/GIS, ignoré:', error);
        oasGisProjection = undefined;
      }
      
      let riskAnalysis;
      try {
        riskAnalysis = this.calculateRetirementRisks(userData);
      } catch (error) {
        console.warn('Erreur analyse risques, ignoré:', error);
        riskAnalysis = undefined;
      }
      
      let recommendedActions;
      try {
        recommendedActions = this.generateRecommendedActions(userData);
      } catch (error) {
        console.warn('Erreur recommandations, ignoré:', error);
        recommendedActions = undefined;
      }
      
      return {
        ...baseCalculations,
        rrqOptimization,
        oasGisProjection,
        riskAnalysis,
        recommendedActions
      };
      
    } catch (error) {
      console.error('Erreur dans calculateAll:', error);
      
      // FALLBACK : Utiliser uniquement les calculs de base
      return {
        netWorth: this.calculateNetWorth(userData),
        retirementCapital: this.calculateRetirementCapital(userData),
        sufficiency: this.calculateSufficiency(userData),
        taxSavings: this.calculateTaxSavings(userData),
        monthlyIncome: this.calculateMonthlyIncome(userData),
        monthlyExpenses: this.calculateMonthlyExpenses(userData),
        rrqOptimization: undefined,
        oasGisProjection: undefined,
        riskAnalysis: undefined,
        recommendedActions: undefined
      };
    }
  }
  
  // ===== CONSERVER TOUTES LES MÉTHODES EXISTANTES =====
  // Ne pas toucher à calculateNetWorth, calculateMonthlyIncome, etc.
  // Juste ajouter les nouvelles méthodes à la fin
  
  // ===== NOUVELLES MÉTHODES (ajouter à la fin) =====
  
  /**
   * NOUVEAU: Optimisation RRQ avec EnhancedRRQService
   */
  private static calculateRRQOptimizationEnhanced(userData: UserData): RRQOptimizationResult {
    try {
      const person1Analysis = this.analyzePersonRRQ(userData, 1);
      const person2Analysis = this.analyzePersonRRQ(userData, 2);
      
      return {
        person1: person1Analysis,
        person2: person2Analysis,
        combinedStrategy: this.optimizeCombinedRRQStrategy(person1Analysis, person2Analysis),
        householdImpact: this.calculateHouseholdImpact(person1Analysis, person2Analysis)
      };
    } catch (error) {
      console.error('Erreur calcul optimisation RRQ:', error);
      throw error; // Re-throw pour utiliser fallback
    }
  }
  
  /**
   * NOUVEAU: Analyse RRQ individuelle
   */
  private static analyzePersonRRQ(userData: UserData, personId: 1 | 2): any {
    const isFirstPerson = personId === 1;
    
    const ageActuel = isFirstPerson 
      ? this.calculateAge(userData.personal.naissance1)
      : this.calculateAge(userData.personal.naissance2);
    
    const montantActuel = isFirstPerson 
      ? userData.retirement.rrqMontantActuel1 
      : userData.retirement.rrqMontantActuel2;
    
    const montant70 = isFirstPerson 
      ? userData.retirement.rrqMontant70_1 
      : userData.retirement.rrqMontant70_2;
    
    // NOUVEAU: Calcul du montant à 72 ans
    const montant72 = this.calculateRRQAt72(montantActuel, ageActuel);
    
    const esperanceVie = isFirstPerson 
      ? userData.retirement.esperanceVie1 
      : userData.retirement.esperanceVie2;
    
    const sexe = isFirstPerson 
      ? userData.personal.sexe1 
      : userData.personal.sexe2;

    // Évaluation de la situation financière
    const situationFinanciere = this.evaluateFinancialSituation(userData);

    if (!montantActuel || !sexe) return null;

    return EnhancedRRQService.analyzeRRQAdvanced({
      ageActuel,
      montantActuel,
      montant70,
      montant72,
      esperanceVie,
      sexe,
      situationFinanciere,
      autrePension: isFirstPerson ? userData.retirement.pensionPrivee1 : userData.retirement.pensionPrivee2,
      conjointRRQ: isFirstPerson ? userData.retirement.rrqMontantActuel2 : userData.retirement.rrqMontantActuel1
    });
  }
  
  /**
   * NOUVEAU: Calcul du montant RRQ à 72 ans
   */
  private static calculateRRQAt72(montantBase: number, ageActuel: number): number {
    if (ageActuel >= 72) return montantBase;
    
    // Facteur de bonification: 0.7% par mois après 65 ans
    const moisBonification = (72 - 65) * 12; // 84 mois
    const facteurBonification = moisBonification * 0.007; // 58.8%
    
    // Estimation du montant à 65 ans
    let montantA65 = montantBase;
    if (ageActuel < 65) {
      const moisReduction = (65 - ageActuel) * 12;
      const facteurReduction = moisReduction * 0.006;
      montantA65 = montantBase / (1 - facteurReduction);
    } else if (ageActuel > 65) {
      const moisBonificationActuelle = (ageActuel - 65) * 12;
      const facteurBonificationActuelle = moisBonificationActuelle * 0.007;
      montantA65 = montantBase / (1 + facteurBonificationActuelle);
    }
    
    return montantA65 * (1 + facteurBonification);
  }
  
  /**
   * NOUVEAU: Évaluation de la situation financière
   */
  private static evaluateFinancialSituation(userData: UserData): 'URGENTE' | 'STABLE' | 'CONFORTABLE' {
    const monthlyIncome = this.calculateMonthlyIncome(userData);
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const netWorth = this.calculateNetWorth(userData);
    const liquidAssets = userData.savings.epargne1 + userData.savings.epargne2 + 
                        userData.savings.celi1 + userData.savings.celi2;

    const cashReserve = liquidAssets / monthlyExpenses;
    const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
    
    if (cashReserve < 6 || savingsRate < 0 || netWorth < monthlyExpenses * 60) {
      return 'URGENTE';
    } else if (cashReserve >= 12 && savingsRate >= 0.15 && netWorth >= monthlyExpenses * 240) {
      return 'CONFORTABLE';
    } else {
      return 'STABLE';
    }
  }
  
  // Ajouter les autres nouvelles méthodes de manière similaire...
  // (calculateOASGISProjection, calculateRetirementRisks, etc.)
  
  // ===== CONSERVER TOUTES LES MÉTHODES EXISTANTES INTACTES =====
  // calculateNetWorth, calculateRetirementCapital, calculateSufficiency,
  // calculateTaxSavings, calculateMonthlyIncome, calculateMonthlyExpenses, etc.
}
```

### **ÉTAPE 5 : MISE À JOUR DES COMPOSANTS (15 minutes)**

#### **5.1 Identifier les composants à mettre à jour**
```bash
# Chercher tous les fichiers qui utilisent CalculationService
grep -r "CalculationService" src/features/retirement/components/
grep -r "calculations.rrqOptimization" src/features/retirement/components/
```

#### **5.2 Mise à jour des composants (exemple)**
```typescript
// Exemple : src/features/retirement/components/SomeComponent.tsx

// AVANT
const { rrqOptimization } = calculations;
if (rrqOptimization) {
  console.log(rrqOptimization.recommandation);
}

// APRÈS (avec gestion des nouveaux champs)
const { rrqOptimization } = calculations;
if (rrqOptimization?.person1) {
  // Nouvelle structure
  console.log(rrqOptimization.person1.recommandationPersonnalisee?.decision);
} else if (rrqOptimization?.recommandation) {
  // Ancienne structure (fallback)
  console.log(rrqOptimization.recommandation);
}
```

### **ÉTAPE 6 : TESTS ET VALIDATION (10 minutes)**

#### **6.1 Test de compilation**
```bash
npm run build
# ou
yarn build
```

#### **6.2 Test fonctionnel minimal**
```typescript
// Dans la console du navigateur
import { CalculationService } from './services/CalculationService';

const testData = /* données minimales */;
const result = CalculationService.calculateAll(testData);
console.log('Test réussi:', result);
```

### **ÉTAPE 7 : VALIDATION AVEC SUITE DE TESTS (5 minutes)**

```typescript
// Copier ValidationTestSuite.ts et exécuter
ValidationTestSuite.executerTousLesTests();
```

## ✅ **CHECKLIST DE VALIDATION FINALE**

- [ ] ✅ Compilation TypeScript sans erreurs
- [ ] ✅ Application démarre correctement
- [ ] ✅ Calculs de base fonctionnent (netWorth, monthlyIncome, etc.)
- [ ] ✅ Nouveaux calculs RRQ fonctionnent ou fallback vers anciens
- [ ] ✅ Interface utilisateur affiche les résultats
- [ ] ✅ Aucune régression sur les fonctionnalités existantes
- [ ] ✅ Suite de tests passe (au moins les tests de base)

## 🚨 **PLAN DE RÉCUPÉRATION EN CAS D'URGENCE**

Si quelque chose se casse :

```bash
# Restaurer immédiatement l'ancien service
cp src/features/retirement/services/CalculationService_backup.ts src/features/retirement/services/CalculationService.ts

# Restaurer les anciens types
cp src/features/retirement/types/index_backup.ts src/features/retirement/types/index.ts

# Redémarrer l'application
npm start
```

## 🎯 **RÉSUMÉ POUR L'IA CURSOR**

**✅ PROCÉDEZ AVEC L'IMPLÉMENTATION COMPLÈTE** en suivant cet ordre :

1. **Sauvegardes** (critiques)
2. **Nouveaux services** (EnhancedRRQService + OASGISService)
3. **Types étendus** (garder compatibilité)
4. **CalculationService amélioré** (avec fallbacks)
5. **Composants adaptés** (gestion nouvelle/ancienne structure)
6. **Tests et validation**

**L'approche progressive avec fallbacks garantit que rien ne se casse !** 🛡️

**Bonne implémentation ! 🚀**