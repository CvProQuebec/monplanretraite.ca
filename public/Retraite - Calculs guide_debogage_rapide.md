# Guide de débogage rapide - Solutions aux problèmes courants

## 🚨 **PROBLÈMES FRÉQUENTS ET SOLUTIONS IMMÉDIATES**

### **1. Erreurs d'importation TypeScript**

#### ❌ **Problème :** "Cannot find module 'EnhancedRRQService'"
```typescript
// ERREUR
import { EnhancedRRQService } from './EnhancedRRQService';
```

#### ✅ **Solution :**
```typescript
// 1. Vérifiez que le fichier existe bien dans le bon dossier
// src/features/retirement/services/EnhancedRRQService.ts

// 2. Vérifiez l'export dans EnhancedRRQService.ts
export class EnhancedRRQService extends RRQService {
  // ... code
}

// 3. Import correct
import { EnhancedRRQService } from '../services/EnhancedRRQService';
```

### **2. Erreurs de types TypeScript**

#### ❌ **Problème :** Types manquants pour les nouvelles interfaces
```typescript
// ERREUR
Property 'recommandationPersonnalisee' does not exist
```

#### ✅ **Solution :**
```typescript
// Ajoutez les types manquants dans votre fichier types/index.ts
export interface RRQOptimizationResult {
  person1?: AdvancedRRQAnalysis;
  person2?: AdvancedRRQAnalysis;
  combinedStrategy?: any;
  householdImpact?: any;
}

export interface AdvancedRRQAnalysis extends RRQAnalysis {
  recommandationPersonnalisee: PersonalizedRecommendation;
  riskAnalysis: RRQRiskAnalysis;
  // ... autres propriétés
}
```

### **3. Calculs RRQ incorrects**

#### ❌ **Problème :** Les montants ne correspondent pas aux calculateurs officiels

#### ✅ **Solution étape par étape :**

1. **Vérifiez les constantes 2025 :**
```typescript
const MGA_2025 = 68500; // ✅ Correct
const FACTEUR_BONIFICATION = 0.007; // ✅ 0.7% (pas 0.6%)
const AGE_MAXIMUM = 72; // ✅ Nouveau
```

2. **Testez avec un cas simple :**
```typescript
// Test : Montant maximum à 65 ans devrait être 1364.60$
const test = calculerMontantSelonAge(1364.60, 65, 65);
console.log(test); // Devrait afficher 1364.60
```

3. **Testez la bonification à 72 ans :**
```typescript
// Test : 7 ans × 12 mois × 0.7% = 58.8% de bonification
const montant72 = 1364.60 * (1 + 0.588);
console.log(montant72); // Devrait être ≈ 2166.98$
```

### **4. Erreurs dans calculateAll()**

#### ❌ **Problème :** "Cannot read property of undefined"
```typescript
// ERREUR
calculations.rrqOptimization.person1.recommandationPersonnalisee
```

#### ✅ **Solution avec gestion des erreurs :**
```typescript
static calculateAll(userData: UserData): Calculations {
  try {
    const enhancedCalculations = {
      // Calculs de base (toujours présents)
      netWorth: this.calculateNetWorth(userData),
      retirementCapital: this.calculateRetirementCapital(userData),
      sufficiency: this.calculateSufficiency(userData),
      taxSavings: this.calculateTaxSavings(userData),
      monthlyIncome: this.calculateMonthlyIncome(userData),
      monthlyExpenses: this.calculateMonthlyExpenses(userData),
      
      // Nouveaux calculs avec fallbacks
      rrqOptimization: undefined as any,
      oasGisProjection: undefined as any,
      riskAnalysis: undefined as any,
      recommendedActions: undefined as any
    };

    // Calculs avancés avec gestion d'erreur
    try {
      enhancedCalculations.rrqOptimization = this.calculateRRQOptimizationEnhanced(userData);
    } catch (error) {
      console.warn('Erreur RRQ optimization:', error);
      enhancedCalculations.rrqOptimization = undefined;
    }

    try {
      enhancedCalculations.oasGisProjection = this.calculateOASGISProjection(userData);
    } catch (error) {
      console.warn('Erreur OAS/GIS projection:', error);
      enhancedCalculations.oasGisProjection = undefined;
    }

    return enhancedCalculations;
    
  } catch (error) {
    console.error('Erreur dans calculateAll:', error);
    // Retour aux calculs de base en cas d'erreur
    return this.calculateBasicOnly(userData);
  }
}
```

### **5. Problèmes de performance**

#### ❌ **Problème :** Calculs trop lents (> 2 secondes)

#### ✅ **Solutions d'optimisation :**

1. **Simplifiez temporairement :**
```typescript
// Version simple pour tester
static calculateRRQOptimizationEnhanced(userData: UserData): any {
  // Pour l'instant, utiliser l'ancienne méthode
  return this.calculateRRQOptimization(userData);
}
```

2. **Optimisez les boucles :**
```typescript
// Au lieu de boucles complexes, utilisez des calculs directs
private static calculatePresentValue(montant: number, age: number, esperance: number): number {
  const annees = esperance - age;
  const facteur = (1 - Math.pow(1.025, -annees)) / 0.025;
  return montant * 12 * facteur;
}
```

### **6. Données utilisateur manquantes**

#### ❌ **Problème :** "Cannot read property 'naissance1' of undefined"

#### ✅ **Solution avec validation :**
```typescript
private static validateUserData(userData: UserData): void {
  if (!userData.personal?.naissance1) {
    throw new Error('Date de naissance manquante pour personne 1');
  }
  if (!userData.retirement?.rrqMontantActuel1) {
    throw new Error('Montant RRQ manquant pour personne 1');
  }
  // Ajouter d'autres validations nécessaires
}

static calculateAll(userData: UserData): Calculations {
  this.validateUserData(userData);
  // ... reste du code
}
```

---

## 🛠️ **CHECKLIST DE DÉBOGAGE SYSTÉMATIQUE**

### **Étape 1 : Vérification des fichiers**
- [ ] EnhancedRRQService.ts créé et exporté correctement
- [ ] OASGISService.ts créé et exporté correctement  
- [ ] CalculationService.ts mis à jour
- [ ] Types ajoutés dans types/index.ts

### **Étape 2 : Tests unitaires basiques**
```typescript
// Test minimal à exécuter
console.log('Test 1: EnhancedRRQService existe?', !!EnhancedRRQService);
console.log('Test 2: OASGISService existe?', !!OASGISService);
console.log('Test 3: CalculationService.calculateAll existe?', !!CalculationService.calculateAll);
```

### **Étape 3 : Test avec données minimales**
```typescript
const minimalUserData = {
  personal: {
    naissance1: '1962-01-01',
    sexe1: 