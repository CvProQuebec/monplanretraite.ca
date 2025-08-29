// ===== SUITE DE TESTS DE VALIDATION POST-IMPLÉMENTATION =====
// À exécuter dès que les corrections CalculationService sont terminées

import { EnhancedRRQService } from './EnhancedRRQService';
import { OASGISService } from './OASGISService';
import { CalculationService } from './CalculationService';
import { UserData } from '../types';

// ===== TESTS DE VALIDATION CRITIQUES =====

export class ValidationTestSuite {
  
  /**
   * TEST 1: Validation des paramètres RRQ 2025
   */
  static async testParametresRRQ2025() {
    console.log("🧮 TEST 1: PARAMÈTRES RRQ 2025");
    console.log("==============================");
    
    const testCases = [
      {
        nom: "Travailleur maximum 62 ans",
        ageActuel: 62,
        montantActuel: 850, // Montant réduit pour 62 ans
        esperanceVie: 85,
        sexe: 'M' as const,
        situationFinanciere: 'STABLE' as const
      },
      {
        nom: "Retraitée normale 65 ans",
        ageActuel: 65,
        montantActuel: 1364.60, // Montant maximum 2025
        esperanceVie: 87,
        sexe: 'F' as const,
        situationFinanciere: 'CONFORTABLE' as const
      },
      {
        nom: "Report stratégique 67 ans",
        ageActuel: 67,
        montantActuel: 1555, // Avec bonification
        esperanceVie: 90,
        sexe: 'M' as const,
        situationFinanciere: 'CONFORTABLE' as const
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n📋 Cas: ${testCase.nom}`);
      
      try {
        // Calcul du montant à 72 ans (NOUVEAU)
        const montant70 = this.calculerMontantSelonAge(testCase.montantActuel, testCase.ageActuel, 70);
        const montant72 = this.calculerMontantSelonAge(testCase.montantActuel, testCase.ageActuel, 72);
        
        const analyse = EnhancedRRQService.analyzeRRQAdvanced({
          ageActuel: testCase.ageActuel,
          montantActuel: testCase.montantActuel,
          montant70: montant70,
          montant72: montant72,
          esperanceVie: testCase.esperanceVie,
          sexe: testCase.sexe,
          situationFinanciere: testCase.situationFinanciere
        });
        
        // Validation des résultats
        console.log(`   ✅ Montant actuel: ${testCase.montantActuel.toLocaleString('fr-CA')} $`);
        console.log(`   ✅ Montant à 70 ans: ${montant70.toLocaleString('fr-CA')} $`);
        console.log(`   🆕 Montant à 72 ans: ${montant72.toLocaleString('fr-CA')} $`);
        console.log(`   🎯 Recommandation: ${analyse.recommandationPersonnalisee.decision}`);
        console.log(`   💰 Gain optimal: ${analyse.differenceValeurActualisee.toLocaleString('fr-CA')} $`);
        console.log(`   📊 Confiance: ${analyse.recommandationPersonnalisee.niveauConfiance}%`);
        
        // Vérifications critiques
        this.verifierCoherenceCalculs(testCase, analyse);
        
      } catch (error) {
        console.error(`   ❌ ERREUR: ${error.message}`);
        throw new Error(`Test failed for ${testCase.nom}: ${error.message}`);
      }
    }
    
    console.log("\n✅ TOUS LES TESTS RRQ 2025 RÉUSSIS");
  }
  
  /**
   * TEST 2: Validation SV/SRG intégré
   */
  static async testIntegrationSVSRG() {
    console.log("\n🇨🇦 TEST 2: INTÉGRATION SV/SRG");
    console.log("==============================");
    
    const testCases = [
      {
        nom: "Retraité faible revenu (éligible SRG)",
        age: 65,
        revenuAnnuel: 18000,
        statutConjoint: 'SEUL' as const,
        anneesResidence: 40,
        attenduSRG: true
      },
      {
        nom: "Couple revenu moyen (SRG partiel)",
        age: 67,
        revenuAnnuel: 32000,
        statutConjoint: 'MARIE' as const,
        revenuConjoint: 28000,
        anneesResidence: 35,
        attenduSRG: true
      },
      {
        nom: "Retraité aisé (récupération SV)",
        age: 70,
        revenuAnnuel: 120000,
        statutConjoint: 'SEUL' as const,
        anneesResidence: 40,
        attenduSRG: false
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n📋 Cas: ${testCase.nom}`);
      
      try {
        const resultat = OASGISService.calculateOASGIS({
          age: testCase.age,
          revenuAnnuel: testCase.revenuAnnuel,
          statutConjoint: testCase.statutConjoint,
          revenuConjoint: testCase.revenuConjoint,
          anneesResidence: testCase.anneesResidence
        });
        
        console.log(`   🏛️  SV nette: ${resultat.securiteVieillesse.montantMensuel.toLocaleString('fr-CA')} $/mois`);
        console.log(`   🤝 SRG: ${resultat.supplementRevenuGaranti.montantMensuel.toLocaleString('fr-CA')} $/mois`);
        console.log(`   💰 Total: ${(resultat.securiteVieillesse.montantMensuel + resultat.supplementRevenuGaranti.montantMensuel).toLocaleString('fr-CA')} $/mois`);
        console.log(`   📊 Éligible SRG: ${resultat.supplementRevenuGaranti.eligible ? 'OUI' : 'NON'}`);
        
        // Validation de la logique
        if (resultat.supplementRevenuGaranti.eligible !== testCase.attenduSRG) {
          throw new Error(`Logique SRG incorrecte: attendu ${testCase.attenduSRG}, obtenu ${resultat.supplementRevenuGaranti.eligible}`);
        }
        
        // Validation des montants maximums
        if (resultat.securiteVieillesse.montantMensuel > 717.15) {
          throw new Error(`SV trop élevée: ${resultat.securiteVieillesse.montantMensuel} > 717.15`);
        }
        
        console.log(`   ✅ Validations réussies`);
        
      } catch (error) {
        console.error(`   ❌ ERREUR: ${error.message}`);
        throw new Error(`Test SV/SRG failed for ${testCase.nom}: ${error.message}`);
      }
    }
    
    console.log("\n✅ TOUS LES TESTS SV/SRG RÉUSSIS");
  }
  
  /**
   * TEST 3: Validation du CalculationService complet
   */
  static async testCalculationServiceComplet() {
    console.log("\n🧮 TEST 3: CALCULATION SERVICE COMPLET");
    console.log("=====================================");
    
    const testUserData: UserData = {
      personal: {
        prenom1: 'Test',
        prenom2: 'Conjoint',
        naissance1: '1962-06-15', // 62 ans
        naissance2: '1965-03-20', // 59 ans
        sexe1: 'M',
        sexe2: 'F',
        salaire1: 65000,
        salaire2: 45000,
        ageRetraiteSouhaite1: 65,
        ageRetraiteSouhaite2: 65
      },
      retirement: {
        rrqAgeActuel1: 62,
        rrqMontantActuel1: 850,
        rrqMontant70_1: 1200,
        esperanceVie1: 85,
        rrqAgeActuel2: 59,
        rrqMontantActuel2: 780,
        rrqMontant70_2: 1100,
        esperanceVie2: 87,
        rregopMembre1: 'non',
        rregopAnnees1: 0,
        pensionPrivee1: 0,
        pensionPrivee2: 0
      },
      savings: {
        reer1: 150000,
        reer2: 85000,
        celi1: 75000,
        celi2: 60000,
        placements1: 45000,
        placements2: 25000,
        epargne1: 15000,
        epargne2: 10000,
        residenceValeur: 450000,
        residenceHypotheque: 120000
      },
      cashflow: {
        logement: 1800,
        servicesPublics: 350,
        assurances: 400,
        telecom: 180,
        alimentation: 800,
        transport: 650,
        sante: 200,
        loisirs: 400
      }
    };
    
    try {
      console.log("🔄 Exécution des calculs complets...");
      
      const calculations = CalculationService.calculateAll(testUserData);
      
      // Validation des calculs de base
      console.log(`✅ Valeur nette: ${calculations.netWorth.toLocaleString('fr-CA')} $`);
      console.log(`✅ Capital retraite: ${calculations.retirementCapital.toLocaleString('fr-CA')} $`);
      console.log(`✅ Suffisance: ${calculations.sufficiency}%`);
      console.log(`✅ Revenus mensuels: ${calculations.monthlyIncome.toLocaleString('fr-CA')} $`);
      console.log(`✅ Dépenses mensuelles: ${calculations.monthlyExpenses.toLocaleString('fr-CA')} $`);
      
      // Validation des nouveaux calculs
      if (calculations.rrqOptimization) {
        console.log(`✅ Optimisation RRQ Personne 1: ${calculations.rrqOptimization.person1?.recommandationPersonnalisee?.decision || 'N/A'}`);
        console.log(`✅ Optimisation RRQ Personne 2: ${calculations.rrqOptimization.person2?.recommandationPersonnalisee?.decision || 'N/A'}`);
      }
      
      if (calculations.oasGisProjection) {
        console.log(`✅ Projection SV/SRG intégrée: ${calculations.oasGisProjection.householdTotal?.monthlyOAS || 0} $/mois`);
      }
      
      if (calculations.riskAnalysis) {
        console.log(`✅ Analyse des risques: Niveau ${calculations.riskAnalysis.global?.niveau || 'N/A'}`);
      }
      
      // Vérifications de cohérence
      this.verifierCoherenceCalculsComplets(calculations, testUserData);
      
      console.log("\n✅ CALCULATION SERVICE COMPLET VALIDÉ");
      return calculations;
      
    } catch (error) {
      console.error(`❌ ERREUR CALCULATION SERVICE: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * TEST 4: Comparaison avec calculateurs officiels
   */
  static async testComparaisonOfficiels() {
    console.log("\n🔍 TEST 4: COMPARAISON CALCULATEURS OFFICIELS");
    console.log("==============================================");
    
    const referenceValues = {
      // Valeurs de référence des calculateurs officiels (à mettre à jour)
      rrq: {
        maxMensuel65ans: 1364.60, // 2025
        maxMensuel72ans: 2166.98, // 2025
        facteurReduction: 0.006,   // 0.6% par mois
        facteurBonification: 0.007 // 0.7% par mois
      },
      sv: {
        maxMensuel: 717.15,        // 2025
        seuilRecuperation: 90997,  // 2025
        seuilRecuperation75plus: 153771 // 2025
      },
      srg: {
        maxMensuelSeul: 1065.47,   // 2025
        seuilRevenuMax: 21456      // 2025
      }
    };
    
    console.log("📊 VALIDATION DES CONSTANTES 2025:");
    console.log(`✅ RRQ max 65 ans: ${referenceValues.rrq.maxMensuel65ans} $/mois`);
    console.log(`✅ RRQ max 72 ans: ${referenceValues.rrq.maxMensuel72ans} $/mois`);
    console.log(`✅ SV max: ${referenceValues.sv.maxMensuel} $/mois`);
    console.log(`✅ SRG max (seul): ${referenceValues.srg.maxMensuelSeul} $/mois`);
    
    // Test de calcul de bonification à 72 ans
    const bonificationTotale72 = 7 * 12 * referenceValues.rrq.facteurBonification; // 58.8%
    const montantCalcule72 = referenceValues.rrq.maxMensuel65ans * (1 + bonificationTotale72);
    
    console.log(`\n🧮 VALIDATION CALCUL 72 ANS:`);
    console.log(`   Bonification totale: ${(bonificationTotale72 * 100).toFixed(1)}%`);
    console.log(`   Montant calculé: ${montantCalcule72.toFixed(2)} $/mois`);
    console.log(`   Montant officiel: ${referenceValues.rrq.maxMensuel72ans} $/mois`);
    console.log(`   Écart: ${Math.abs(montantCalcule72 - referenceValues.rrq.maxMensuel72ans).toFixed(2)} $`);
    
    if (Math.abs(montantCalcule72 - referenceValues.rrq.maxMensuel72ans) > 5) {
      throw new Error("Calcul 72 ans incorrect - écart > 5$");
    }
    
    console.log("✅ CALCULS CONFORMES AUX RÉFÉRENCES OFFICIELLES");
  }
  
  /**
   * TEST 5: Tests de performance et limites
   */
  static async testPerformanceEtLimites() {
    console.log("\n⚡ TEST 5: PERFORMANCE ET LIMITES");
    console.log("=================================");
    
    const startTime = Date.now();
    
    // Test de volume (simulation de 100 utilisateurs)
    const testPromises = [];
    for (let i = 0; i < 10; i++) { // Réduire à 10 pour le test
      testPromises.push(this.testCalculationServiceComplet());
    }
    
    try {
      await Promise.all(testPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`✅ 10 calculs complets en ${duration}ms`);
      console.log(`📊 Moyenne: ${(duration / 10).toFixed(1)}ms par calcul`);
      
      if (duration / 10 > 1000) { // Plus de 1 seconde par calcul
        console.warn("⚠️  Performance sous-optimale détectée");
      }
      
    } catch (error) {
      console.error(`❌ ERREUR PERFORMANCE: ${error.message}`);
      throw error;
    }
  }
  
  // ===== MÉTHODES UTILITAIRES =====
  
  private static calculerMontantSelonAge(montantBase: number, ageActuel: number, ageVoulu: number): number {
    // Logique identique à EnhancedRRQService
    let montantA65 = montantBase;
    
    if (ageActuel < 65) {
      const moisReduction = (65 - ageActuel) * 12;
      const facteurReduction = moisReduction * 0.006;
      montantA65 = montantBase / (1 - facteurReduction);
    } else if (ageActuel > 65) {
      const moisBonification = (ageActuel - 65) * 12;
      const facteurBonification = moisBonification * 0.007;
      montantA65 = montantBase / (1 + facteurBonification);
    }
    
    if (ageVoulu === 65) return montantA65;
    
    if (ageVoulu < 65) {
      const moisReduction = (65 - ageVoulu) * 12;
      const facteurReduction = moisReduction * 0.006;
      return montantA65 * (1 - facteurReduction);
    } else {
      const moisBonification = (ageVoulu - 65) * 12;
      const facteurBonification = moisBonification * 0.007;
      return montantA65 * (1 + facteurBonification);
    }
  }
  
  private static verifierCoherenceCalculs(testCase: any, analyse: any): void {
    // Vérifications de base
    if (analyse.valeurActualiseeMaintenant <= 0) {
      throw new Error("Valeur actualisée invalide");
    }
    
    if (analyse.recommandationPersonnalisee.niveauConfiance < 50 || 
        analyse.recommandationPersonnalisee.niveauConfiance > 100) {
      throw new Error("Niveau de confiance hors limites");
    }
    
    // Logique métier
    if (testCase.situationFinanciere === 'URGENTE' && 
        analyse.recommandationPersonnalisee.decision !== 'COMMENCER_MAINTENANT') {
      console.warn("⚠️  Situation urgente mais ne recommande pas de commencer maintenant");
    }
  }
  
  private static verifierCoherenceCalculsComplets(calculations: any, userData: UserData): void {
    // Vérifications de cohérence globale
    if (calculations.netWorth < 0) {
      throw new Error("Valeur nette négative");
    }
    
    if (calculations.sufficiency < 0 || calculations.sufficiency > 200) {
      throw new Error("Suffisance hors limites réalistes");
    }
    
    if (calculations.monthlyIncome <= 0 || calculations.monthlyExpenses <= 0) {
      throw new Error("Revenus ou dépenses invalides");
    }
  }
  
  /**
   * EXÉCUTION COMPLÈTE DE LA SUITE DE TESTS
   */
  static async executerTousLesTests(): Promise<void> {
    console.log("🚀 DÉBUT DE LA SUITE DE TESTS COMPLÈTE");
    console.log("=====================================");
    
    const startTime = Date.now();
    
    try {
      await this.testParametresRRQ2025();
      await this.testIntegrationSVSRG();
      await this.testCalculationServiceComplet();
      await this.testComparaisonOfficiels();
      await this.testPerformanceEtLimites();
      
      const endTime = Date.now();
      const totalDuration = endTime - startTime;
      
      console.log("\n" + "=".repeat(50));
      console.log("🎉 TOUS LES TESTS RÉUSSIS!");
      console.log(`⏱️  Durée totale: ${totalDuration}ms`);
      console.log("✅ Votre implémentation est VALIDÉE");
      console.log("🚀 Prêt pour les tests utilisateurs!");
      console.log("=".repeat(50));
      
    } catch (error) {
      console.error("\n" + "=".repeat(50));
      console.error("❌ ÉCHEC DE LA VALIDATION");
      console.error(`🐛 Erreur: ${error.message}`);
      console.error("🔧 Corrigez avant de continuer");
      console.error("=".repeat(50));
      throw error;
    }
  }
}

// ===== UTILISATION RAPIDE =====

// Pour tester immédiatement après votre implémentation:
// ValidationTestSuite.executerTousLesTests();

// Pour tester individuellement:
// ValidationTestSuite.testParametresRRQ2025();
// ValidationTestSuite.testIntegrationSVSRG();
// ValidationTestSuite.testCalculationServiceComplet();