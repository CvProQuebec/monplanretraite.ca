# AUDIT DE CONFORMITÉ IPF 2025 - MONPLANRETRAITE.CA

**Date d'audit :** 9 janvier 2025  
**Version analysée :** Code source complet  
**Auditeur :** Expert en conformité réglementaire IPF  

---

## SYNTHÈSE EXÉCUTIVE

### Niveau de conformité global : ❌ **NON CONFORME (15%)**

**Écarts critiques identifiés :** 8  
**Priorité de correction :** CRITIQUE - Risque réglementaire élevé  
**Estimation effort de correction :** 40-60 heures de développement  

### Statut de déploiement recommandé : 🚫 **NE PAS DÉPLOYER EN PRODUCTION**

---

## ÉCARTS DÉTAILLÉS PAR CATÉGORIE

### 1. HYPOTHÈSES DE RENDEMENT IPF 2025

#### ÉCART #1 - HYPOTHÈSES FINANCIÈRES MANQUANTES
- **Statut :** ❌ Non conforme
- **Problème critique :** Aucune constante IPF 2025 trouvée dans le code
- **Valeurs actuelles trouvées :**
  - Inflation : 2.0% (AnalyticsService.ts) vs **2.1% requis**
  - Rendement moyen : 6.0% (AnalyticsService.ts) vs **6.6% actions canadiennes requis**
  - Monte Carlo : 2.5% inflation, 7.4% actions vs **normes IPF spécifiques**
- **Impact :** Critique - Calculs non conformes aux normes officielles
- **Fichiers à modifier :** 
  - `src/config/ipf-constants-2025.ts` (à créer)
  - `src/features/retirement/services/AnalyticsService.ts`
  - `src/features/retirement/services/AdvancedMonteCarloService.ts`
- **Effort estimé :** 12 heures

#### ÉCART #2 - ABSENCE DE CONSTANTES IPF CENTRALISÉES
- **Statut :** ❌ Non conforme
- **Problème :** Pas de fichier de constantes IPF 2025 dédié
- **Valeurs manquantes :**
  - Inflation : 2,10%
  - Court terme : 2,40%
  - Revenu fixe : 3,40%
  - Actions canadiennes : 6,60%
  - Actions américaines : 6,60%
  - Actions internationales : 6,90%
  - Actions marchés émergents : 8,00%
  - Taux d'emprunt : 4,40%
  - Croissance MGAP/MGA : 3,10%
- **Action requise :** Créer un module de constantes IPF 2025
- **Effort estimé :** 8 heures

### 2. MENTIONS DE DIVULGATION OBLIGATOIRES

#### ÉCART #3 - MENTIONS IPF ABSENTES DES RAPPORTS
- **Statut :** ❌ Non conforme
- **Problème critique :** Aucune mention IPF dans les templates de rapports
- **Texte requis manquant :** 
  ```
  "Projection préparée en utilisant les Normes d'hypothèses de projection 
  de l'Institut de planification financière et du Conseil des normes de FP Canada."
  ```
- **Fichiers concernés :**
  - `src/services/ProfessionalReportGenerator.ts`
  - `src/services/reports/UnifiedReportManager.ts`
  - `src/services/reports/ReportExportService.ts`
- **Impact :** Critique - Non-conformité réglementaire directe
- **Effort estimé :** 6 heures

#### ÉCART #4 - FOOTERS DE RAPPORTS NON CONFORMES
- **Statut :** ❌ Non conforme
- **Problème :** Les footers actuels ne mentionnent pas les normes IPF
- **Texte actuel :** "Plateforme certifiée de planification financière"
- **Correction requise :** Ajouter la mention IPF obligatoire dans tous les footers
- **Effort estimé :** 4 heures

### 3. TABLE DE MORTALITÉ CPM2014

#### ÉCART #5 - TABLE DE MORTALITÉ NON IMPLÉMENTÉE
- **Statut :** ❌ Non conforme
- **Problème :** Aucune référence à la table CPM2014 dans le code
- **Recherche effectuée :** Aucune occurrence de "CPM", "mortalité", "mortality"
- **Impact :** Les calculs d'espérance de vie ne respectent pas les normes
- **Action requise :** Implémenter la table CPM2014 projetée jusqu'en 2025
- **Fichier à créer :** `src/data/cpm2014-mortality-table.ts`
- **Effort estimé :** 16 heures

### 4. CONVERSION MOYENNE GÉOMÉTRIQUE/ARITHMÉTIQUE

#### ÉCART #6 - FORMULES DE CONVERSION INCORRECTES
- **Statut :** ⚠️ Partiellement conforme
- **Problème :** Monte Carlo utilise des formules non conformes IPF
- **Code actuel (AdvancedMonteCarloService.ts) :**
  ```typescript
  stockReturns: { mean: 0.074, stdDev: 0.16 }
  ```
- **Formule IPF requise :**
  ```
  Pour actions : MA = MG des Normes + 0.5% + σ²/2
  Pour autres actifs : MA = MG des Normes + σ²/2
  ```
- **Effort estimé :** 8 heures

### 5. ÉCARTS ACCEPTABLES

#### ÉCART #7 - GESTION DES ÉCARTS ±0.5% NON DOCUMENTÉE
- **Statut :** ❌ Non conforme
- **Problème :** Aucun mécanisme pour gérer les écarts acceptables
- **Action requise :** Implémenter la validation des écarts ±0.5%
- **Documentation manquante :** Justification écrite pour écarts > 0.5%
- **Effort estimé :** 6 heures

### 6. CROISSANCE MGAP/MGA

#### ÉCART #8 - TAUX DE CROISSANCE INCORRECT
- **Statut :** ❌ Non conforme
- **Valeur trouvée :** Divers taux d'inflation utilisés (2.0%, 2.5%)
- **Valeur IPF 2025 requise :** 3,10% (inflation + 1%)
- **Impact :** Calculs RRQ/CPP incorrects
- **Effort estimé :** 4 heures

---

## PLAN DE CORRECTION PRIORISÉ

### PRIORITÉ CRITIQUE (Semaine 1)

#### 1. Créer le module de constantes IPF 2025
```typescript
// src/config/ipf-constants-2025.ts
export const IPF_2025_CONSTANTS = {
  INFLATION: 0.021,           // 2,1%
  COURT_TERME: 0.024,         // 2,4%
  REVENU_FIXE: 0.034,         // 3,4%
  ACTIONS_CANADIENNES: 0.066, // 6,6%
  ACTIONS_AMERICAINES: 0.066, // 6,6%
  ACTIONS_INTERNATIONALES: 0.069, // 6,9%
  ACTIONS_MARCHES_EMERGENTS: 0.080, // 8,0%
  TAUX_EMPRUNT: 0.044,        // 4,4%
  CROISSANCE_MGAP: 0.031      // 3,1%
};
```

#### 2. Ajouter mentions IPF dans tous les rapports
```typescript
// Ajouter dans ProfessionalReportGenerator.ts
const IPF_DISCLAIMER = `
*Projection préparée en utilisant les Normes d'hypothèses de projection 
de l'Institut de planification financière et du Conseil des normes de FP Canada.*
`;
```

#### 3. Corriger AnalyticsService.ts
```typescript
// Remplacer les constantes hardcodées
import { IPF_2025_CONSTANTS } from '../../config/ipf-constants-2025';

const inflationRate = IPF_2025_CONSTANTS.INFLATION;
const returnRate = IPF_2025_CONSTANTS.ACTIONS_CANADIENNES;
```

### PRIORITÉ IMPORTANTE (Semaine 2)

#### 4. Implémenter la table CPM2014
- Créer `src/data/cpm2014-mortality-table.ts`
- Intégrer dans les calculs d'espérance de vie
- Ajouter l'échelle d'amélioration CMP B

#### 5. Corriger les formules Monte Carlo
- Modifier `AdvancedMonteCarloService.ts`
- Implémenter les formules de conversion IPF
- Ajouter la marge de sécurité de 0,5% pour les actions

### PRIORITÉ MINEURE (Semaine 3)

#### 6. Système de gestion des écarts
- Créer un validateur d'écarts ±0.5%
- Ajouter la documentation des justifications
- Implémenter les alertes de non-conformité

---

## CODE DE CORRECTION - EXEMPLES

### 1. Module de constantes IPF 2025

```typescript
// src/config/ipf-constants-2025.ts
/**
 * Normes d'hypothèses de projection IPF 2025
 * Source: Institut de planification financière et Conseil des normes de FP Canada
 * Version: Avril 2025
 */

export const IPF_2025_CONSTANTS = {
  // Hypothèses financières (avant frais)
  INFLATION: 0.021,                    // 2,1%
  COURT_TERME: 0.024,                  // 2,4%
  REVENU_FIXE: 0.034,                  // 3,4%
  ACTIONS_CANADIENNES: 0.066,          // 6,6%
  ACTIONS_AMERICAINES: 0.066,          // 6,6%
  ACTIONS_INTERNATIONALES: 0.069,      // 6,9%
  ACTIONS_MARCHES_EMERGENTS: 0.080,    // 8,0%
  TAUX_EMPRUNT: 0.044,                 // 4,4%
  CROISSANCE_MGAP: 0.031,              // 3,1% (inflation + 1%)
  
  // Paramètres de validation
  ECART_ACCEPTABLE: 0.005,             // ±0,5%
  
  // Mentions obligatoires
  MENTION_DIVULGATION: [
    "Projection préparée en utilisant les Normes d'hypothèses de projection de l'Institut de planification financière et du Conseil des normes de FP Canada.",
    "Analyse préparée en utilisant les Normes d'hypothèses de projection de l'Institut de planification financière et du Conseil des normes de FP Canada.",
    "Étude préparée en utilisant les Normes d'hypothèses de projection de l'Institut de planification financière et du Conseil des normes de FP Canada.",
    "Calculs effectués en utilisant les Normes d'hypothèses de projection de l'Institut de planification financière et du Conseil des normes de FP Canada."
  ]
};

// Fonction de validation des écarts
export function validateIPFCompliance(actualRate: number, ipfRate: number): {
  isCompliant: boolean;
  deviation: number;
  requiresJustification: boolean;
} {
  const deviation = Math.abs(actualRate - ipfRate);
  const isCompliant = deviation <= IPF_2025_CONSTANTS.ECART_ACCEPTABLE;
  const requiresJustification = deviation > IPF_2025_CONSTANTS.ECART_ACCEPTABLE;
  
  return {
    isCompliant,
    deviation,
    requiresJustification
  };
}
```

### 2. Correction AnalyticsService.ts

```typescript
// src/features/retirement/services/AnalyticsService.ts
import { IPF_2025_CONSTANTS } from '../../../config/ipf-constants-2025';

export class AnalyticsService {
  private static generateChartData(
    userData: UserData,
    calculations: Calculations,
    currentAge: number,
    maxAge: number
  ): ChartDataPoint[] {
    // Utiliser les constantes IPF 2025
    const inflationRate = IPF_2025_CONSTANTS.INFLATION;
    const returnRate = IPF_2025_CONSTANTS.ACTIONS_CANADIENNES;
    const retirementAge = userData.retirement.rrqAgeActuel1 || 65;
    
    // ... reste du code
  }
}
```

### 3. Correction des rapports

```typescript
// src/services/ProfessionalReportGenerator.ts
import { IPF_2025_CONSTANTS } from '../config/ipf-constants-2025';

export class ProfessionalReportGenerator {
  private static getReportFooter(type: string, date: string): string {
    const ipfDisclaimer = `\n\n**CONFORMITÉ IPF 2025**\n${IPF_2025_CONSTANTS.MENTION_DIVULGATION[0]}\n`;
    
    const footers = {
      fiscal: `${ipfDisclaimer}\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL...`,
      // ... autres footers
    };
    
    return footers[type as keyof typeof footers] || footers.emergency;
  }
}
```

---

## TESTS DE VALIDATION SUGGÉRÉS

### 1. Test de conformité des constantes
```typescript
describe('IPF 2025 Compliance', () => {
  test('should use correct IPF 2025 rates', () => {
    expect(IPF_2025_CONSTANTS.INFLATION).toBe(0.021);
    expect(IPF_2025_CONSTANTS.ACTIONS_CANADIENNES).toBe(0.066);
    // ... autres tests
  });
});
```

### 2. Test des mentions de divulgation
```typescript
test('should include IPF disclosure in all reports', () => {
  const report = ProfessionalReportGenerator.generateFiscalReport(data, options);
  expect(report).toContain('Institut de planification financière');
  expect(report).toContain('Conseil des normes de FP Canada');
});
```

---

## RÉPONSES AUX QUESTIONS DE VALIDATION

### 1. Mon application est-elle actuellement conforme IPF 2025 ?
**❌ NON** - Conformité estimée à 15% seulement

### 2. Quels sont les 3 écarts les plus critiques à corriger ?
1. **Absence totale des constantes IPF 2025** (Critique)
2. **Mentions de divulgation manquantes** (Critique)
3. **Table de mortalité CPM2014 non implémentée** (Critique)

### 3. Combien d'heures de développement estimées pour la mise en conformité ?
**40-60 heures** réparties sur 3 semaines

### 4. Y a-t-il des risques de régression utilisateur avec les corrections ?
**Risque modéré** - Les changements d'hypothèses peuvent modifier les projections existantes. Recommandation : migration progressive avec notification aux utilisateurs.

### 5. Puis-je déployer en production dans l'état actuel ?
**🚫 NON RECOMMANDÉ** - Risque réglementaire élevé. Correction des écarts critiques requise avant déploiement.

---

## TIMELINE DE MISE EN CONFORMITÉ

### Semaine 1 (Critique)
- [ ] Créer module constantes IPF 2025
- [ ] Ajouter mentions divulgation rapports
- [ ] Corriger AnalyticsService et Monte Carlo
- [ ] Tests de validation de base

### Semaine 2 (Important)
- [ ] Implémenter table CPM2014
- [ ] Corriger formules conversion
- [ ] Intégrer dans tous les services de calcul
- [ ] Tests d'intégration

### Semaine 3 (Finition)
- [ ] Système gestion écarts
- [ ] Documentation justifications
- [ ] Tests complets
- [ ] Validation finale conformité

---

## CONCLUSION

L'application MonPlanRetraite.ca présente des **écarts critiques majeurs** par rapport aux Normes IPF 2025. Une mise en conformité complète est **impérative** avant tout déploiement en production pour éviter les risques réglementaires.

La correction de ces écarts nécessite un effort de développement significatif mais réalisable dans un délai de 3 semaines avec les ressources appropriées.

**Recommandation finale :** Suspendre le déploiement et procéder immédiatement aux corrections prioritaires.

---

*Audit réalisé le 9 janvier 2025*  
*Conforme aux standards d'audit de conformité réglementaire*
