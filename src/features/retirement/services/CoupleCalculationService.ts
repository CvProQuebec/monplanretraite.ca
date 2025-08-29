// src/features/retirement/services/CoupleCalculationService.ts
// Service de calcul des pensions pour couples (CPP + RRQ)

import { 
  CoupleData, 
  CoupleCalculationResult, 
  PersonData, 
  CoupleOptimization, 
  SurvivorScenario, 
  CoupleRecommendation 
} from '../types/couple';
import { CPPService } from './CPPService';
import { CPPData } from '../types/cpp';

export class CoupleCalculationService {
  
  /**
   * Calcule les pensions pour un couple
   */
  static calculateCouplePensions(coupleData: CoupleData): CoupleCalculationResult {
    // Calculer les pensions individuelles
    const person1Results = this.calculatePersonPensions(coupleData.person1, coupleData);
    const person2Results = coupleData.person2 
      ? this.calculatePersonPensions(coupleData.person2, coupleData)
      : null;

    // Calculer les totaux combinés
    const totalMensuel = person1Results.total + (person2Results?.total || 0);
    const totalAnnuel = totalMensuel * 12;

    // Calculer les répartitions
    const totalCPP = person1Results.cpp.montantMensuel + (person2Results?.cpp.montantMensuel || 0);
    const totalRRQ = (person1Results.rrq?.montantMensuel || 0) + (person2Results?.rrq?.montantMensuel || 0);
    
    const repartitionCPP = totalMensuel > 0 ? (totalCPP / totalMensuel) * 100 : 0;
    const repartitionRRQ = totalMensuel > 0 ? (totalRRQ / totalMensuel) * 100 : 0;

    // Générer les optimisations
    const optimisations = this.generateOptimizations(coupleData, person1Results, person2Results);

    // Générer les scénarios de survivant
    const scenariosSurvivant = this.generateSurvivorScenarios(coupleData, person1Results, person2Results);

    // Générer les recommandations
    const recommandations = this.generateRecommendations(coupleData, person1Results, person2Results);

    return {
      person1: person1Results,
      person2: person2Results,
      couple: {
        totalMensuel,
        totalAnnuel,
        repartitionCPP,
        repartitionRRQ,
        optimisations,
        scenariosSurvivant
      },
      recommandations
    };
  }

  /**
   * Calcule les pensions pour une personne individuelle
   */
  private static calculatePersonPensions(person: PersonData, coupleData: CoupleData) {
    // Préparer les données CPP
    const cppData: CPPData = {
      personal: {
        dateNaissance: person.dateNaissance,
        dateRetraite: this.calculateRetirementDate(person.dateNaissance, person.ageRetraiteSouhaite),
        gainsAnnuels: person.cpp.gainsAnnuels,
        anneesCotisation: person.cpp.anneesCotisation,
        paysResidence: person.cpp.paysResidence,
        statutConjugal: coupleData.couple.statutConjugal
      },
      parameters: this.getDefaultCPPParameters(),
      calculations: {
        pensionBase: 0,
        pensionAjustee: 0,
        montantMensuel: 0,
        montantAnnuel: 0,
        reductionRetraiteAnticipee: 0,
        augmentationRetraiteReportee: 0
      },
      contributions: {
        annees: [],
        montants: [],
        gains: [],
        totalCotisations: 0
      },
      metadata: {
        dateCalcul: new Date(),
        version: '2025.1',
        source: 'USER_INPUT'
      }
    };

    // Calculer CPP
    const cppResult = CPPService.calculateCPPPension(cppData);

    // Calculer RRQ si applicable (résidents du Québec)
    let rrqResult = null;
    if (coupleData.couple.residenceQuebec && person.rrq) {
      rrqResult = this.calculateRRQPension(person, coupleData);
    }

    // Calculer le total
    const total = cppResult.montantMensuel + (rrqResult?.montantMensuel || 0);

    return {
      cpp: cppResult,
      rrq: rrqResult,
      total
    };
  }

  /**
   * Calcule la pension RRQ (simplifié pour l'exemple)
   */
  private static calculateRRQPension(person: PersonData, coupleData: CoupleData) {
    if (!person.rrq) return null;

    // Calcul simplifié RRQ - à remplacer par le service RRQ réel
    const gainsMoyens = person.rrq.gainsAnnuels.reduce((sum, gain) => sum + gain, 0) / person.rrq.gainsAnnuels.length;
    const pensionBase = gainsMoyens * 0.25; // 25% des gains moyens (simplifié)
    
    // Ajustement selon l'âge de retraite
    const ageRetraite = person.ageRetraiteSouhaite;
    let facteurAjustement = 1.0;
    
    if (ageRetraite < 65) {
      facteurAjustement = 1 - ((65 - ageRetraite) * 0.006); // -0.6% par mois
    } else if (ageRetraite > 65) {
      facteurAjustement = 1 + ((ageRetraite - 65) * 0.007); // +0.7% par mois
    }

    const pensionAjustee = pensionBase * facteurAjustement;
    const montantMensuel = Math.min(pensionAjustee / 12, 1500); // Maximum RRQ approximatif

    return {
      pensionBase: pensionBase / 12,
      pensionAjustee: pensionAjustee / 12,
      montantMensuel,
      montantAnnuel: montantMensuel * 12,
      details: {
        anneesCotisation: person.rrq.anneesCotisation,
        gainsMoyens,
        facteurAjustement
      },
      projections: {
        age60: montantMensuel * 0.76, // -24% à 60 ans
        age65: montantMensuel / facteurAjustement, // Base à 65 ans
        age70: montantMensuel * 1.42, // +42% à 70 ans
        age72: montantMensuel * 1.50  // +50% à 72 ans (nouveau)
      }
    };
  }

  /**
   * Génère les stratégies d'optimisation pour le couple
   */
  private static generateOptimizations(
    coupleData: CoupleData, 
    person1Results: any, 
    person2Results: any
  ): CoupleOptimization[] {
    const optimizations: CoupleOptimization[] = [];

    // Optimisation 1: Échelonnement des retraites
    if (person2Results && coupleData.person2) {
      const ageDiff = Math.abs(
        coupleData.person1.ageRetraiteSouhaite - coupleData.person2.ageRetraiteSouhaite
      );
      
      if (ageDiff < 2) {
        optimizations.push({
          type: 'ECHELONNEMENT',
          description: 'Échelonner les dates de retraite pour optimiser les revenus du couple',
          economieAnnuelle: 2400, // Estimation
          complexite: 'MOYENNE',
          applicabilite: 85,
          etapes: [
            'Analyser les pensions individuelles',
            'Déterminer qui devrait prendre sa retraite en premier',
            'Calculer l\'impact fiscal optimal',
            'Planifier la transition échelonnée'
          ]
        });
      }
    }

    // Optimisation 2: Partage de pension (si marié)
    if (coupleData.couple.statutConjugal === 'married' && person2Results) {
      optimizations.push({
        type: 'PARTAGE_PENSION',
        description: 'Partager jusqu\'à 50% des pensions CPP/RRQ pour optimiser l\'impôt',
        economieAnnuelle: 1800,
        complexite: 'FACILE',
        applicabilite: 95,
        etapes: [
          'Faire la demande de partage de pension',
          'Calculer le pourcentage optimal à partager',
          'Soumettre les formulaires requis',
          'Réviser annuellement'
        ]
      });
    }

    // Optimisation 3: Fractionnement de revenu
    if (person2Results) {
      const ecartRevenus = Math.abs(person1Results.total - person2Results.total);
      if (ecartRevenus > 500) {
        optimizations.push({
          type: 'FRACTIONNEMENT_REVENU',
          description: 'Utiliser le fractionnement de revenu de pension pour réduire l\'impôt',
          economieAnnuelle: ecartRevenus * 0.15 * 12, // Estimation basée sur l'écart
          complexite: 'MOYENNE',
          applicabilite: 80,
          etapes: [
            'Identifier les revenus admissibles au fractionnement',
            'Calculer le montant optimal à fractionner',
            'Remplir le formulaire T1032',
            'Optimiser chaque année'
          ]
        });
      }
    }

    return optimizations;
  }

  /**
   * Génère les scénarios de survivant
   */
  private static generateSurvivorScenarios(
    coupleData: CoupleData,
    person1Results: any,
    person2Results: any
  ): SurvivorScenario[] {
    if (!person2Results || !coupleData.person2) return [];

    const scenarios: SurvivorScenario[] = [];
    const esperanceVie = coupleData.objectifs.esperanceVieCouple;

    // Scénario 1: Person1 survit
    const pensionSurvivantP1 = this.calculateSurvivorPension(person2Results, person1Results);
    scenarios.push({
      scenarioType: 'PERSON1_SURVIT',
      ageDeces: esperanceVie - 5, // Estimation
      pensionSurvivant: pensionSurvivantP1,
      pensionConjoint: person1Results.total,
      totalMensuel: person1Results.total + pensionSurvivantP1,
      dureeProjection: 15,
      impactFinancier: pensionSurvivantP1 > 500 ? 'FAIBLE' : 'MOYEN'
    });

    // Scénario 2: Person2 survit
    const pensionSurvivantP2 = this.calculateSurvivorPension(person1Results, person2Results);
    scenarios.push({
      scenarioType: 'PERSON2_SURVIT',
      ageDeces: esperanceVie - 3, // Estimation
      pensionSurvivant: pensionSurvivantP2,
      pensionConjoint: person2Results.total,
      totalMensuel: person2Results.total + pensionSurvivantP2,
      dureeProjection: 18,
      impactFinancier: pensionSurvivantP2 > 500 ? 'FAIBLE' : 'MOYEN'
    });

    return scenarios;
  }

  /**
   * Calcule la pension de survivant
   */
  private static calculateSurvivorPension(deceasedResults: any, survivorResults: any): number {
    // Calcul simplifié de la pension de survivant
    // CPP: jusqu'à 60% de la pension du défunt
    const cppSurvivor = Math.min(deceasedResults.cpp.montantMensuel * 0.6, 860); // Max CPP survivant
    
    // RRQ: jusqu'à 60% de la pension du défunt
    const rrqSurvivor = deceasedResults.rrq 
      ? Math.min(deceasedResults.rrq.montantMensuel * 0.6, 900) // Max RRQ survivant
      : 0;

    return cppSurvivor + rrqSurvivor;
  }

  /**
   * Génère les recommandations personnalisées
   */
  private static generateRecommendations(
    coupleData: CoupleData,
    person1Results: any,
    person2Results: any
  ): CoupleRecommendation[] {
    const recommendations: CoupleRecommendation[] = [];
    const totalMensuel = person1Results.total + (person2Results?.total || 0);
    const objectifMensuel = coupleData.objectifs.revenuCibleMensuel;

    // Recommandation sur l'écart de revenus
    if (totalMensuel < objectifMensuel) {
      const ecart = objectifMensuel - totalMensuel;
      recommendations.push({
        priorite: 'HAUTE',
        categorie: 'OPTIMISATION',
        titre: 'Combler l\'écart de revenus de retraite',
        description: `Il manque ${ecart.toFixed(0)}$/mois pour atteindre votre objectif de ${objectifMensuel}$/mois`,
        actionsConcrete: [
          'Considérer reporter la retraite de 1-2 ans',
          'Maximiser les cotisations REER/CELI',
          'Évaluer un travail à temps partiel en retraite',
          'Réviser les dépenses prévues en retraite'
        ],
        impactFinancier: ecart * 12,
        delaiImplementation: '6-12 mois',
        difficulte: 'MOYENNE'
      });
    }

    // Recommandation sur l'optimisation fiscale
    if (person2Results && coupleData.couple.statutConjugal === 'married') {
      recommendations.push({
        priorite: 'MOYENNE',
        categorie: 'FISCALITE',
        titre: 'Optimiser la fiscalité du couple',
        description: 'Plusieurs stratégies fiscales peuvent réduire votre fardeau fiscal',
        actionsConcrete: [
          'Demander le partage de pension CPP/RRQ',
          'Utiliser le fractionnement de revenu de pension',
          'Optimiser les retraits de REER/FERR',
          'Planifier les revenus pour minimiser la récupération de la SV'
        ],
        impactFinancier: 2000,
        delaiImplementation: '3-6 mois',
        difficulte: 'MOYENNE'
      });
    }

    // Recommandation sur la protection du survivant
    if (person2Results) {
      recommendations.push({
        priorite: 'MOYENNE',
        categorie: 'PROTECTION',
        titre: 'Protéger le conjoint survivant',
        description: 'Assurer une sécurité financière adéquate au conjoint survivant',
        actionsConcrete: [
          'Réviser les bénéficiaires de tous les comptes',
          'Considérer une assurance-vie temporaire',
          'Planifier la transition des responsabilités financières',
          'Documenter toutes les sources de revenus'
        ],
        impactFinancier: 0,
        delaiImplementation: '1-3 mois',
        difficulte: 'FACILE'
      });
    }

    return recommendations;
  }

  /**
   * Utilitaires
   */
  private static calculateRetirementDate(birthDate: Date, retirementAge: number): Date {
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(birthDate.getFullYear() + retirementAge);
    return retirementDate;
  }

  private static getDefaultCPPParameters() {
    return {
      ageRetraiteStandard: 65,
      ageRetraiteMin: 60,
      ageRetraiteMax: 70,
      facteurReduction: 0.006,
      facteurAugmentation: 0.007,
      montantMaximum2025: 1433,
      montantMoyen2024: 899.67
    };
  }

  /**
   * Convertit les données du profil utilisateur en format CoupleData
   */
  static convertProfileToCouple(userData: any): CoupleData {
    const person1: PersonData = {
      id: 'person1',
      prenom: userData.personal?.prenom1 || '',
      dateNaissance: userData.personal?.naissance1 ? new Date(userData.personal.naissance1) : new Date(),
      sexe: userData.personal?.sexe1 === 'femme' ? 'F' : 'M',
      ageRetraiteSouhaite: userData.personal?.ageRetraiteSouhaite1 || 65,
      cpp: {
        gainsAnnuels: userData.personal?.salaire1 ? [userData.personal.salaire1] : [50000],
        anneesCotisation: 35, // Valeur par défaut
        paysResidence: 'CA'
      },
      rrq: userData.personal?.residenceQuebec ? {
        gainsAnnuels: userData.personal?.salaire1 ? [userData.personal.salaire1] : [50000],
        anneesCotisation: 35
      } : undefined,
      autresRevenus: {
        reer: 0,
        celi: 0,
        regimeEmployeur: 0,
        autres: 0
      }
    };

    let person2: PersonData | undefined;
    if (userData.personal?.prenom2) {
      person2 = {
        id: 'person2',
        prenom: userData.personal.prenom2,
        dateNaissance: userData.personal?.naissance2 ? new Date(userData.personal.naissance2) : new Date(),
        sexe: userData.personal?.sexe2 === 'femme' ? 'F' : 'M',
        ageRetraiteSouhaite: userData.personal?.ageRetraiteSouhaite2 || 65,
        cpp: {
          gainsAnnuels: userData.personal?.salaire2 ? [userData.personal.salaire2] : [45000],
          anneesCotisation: 30,
          paysResidence: 'CA'
        },
        rrq: userData.personal?.residenceQuebec ? {
          gainsAnnuels: userData.personal?.salaire2 ? [userData.personal.salaire2] : [45000],
          anneesCotisation: 30
        } : undefined,
        autresRevenus: {
          reer: 0,
          celi: 0,
          regimeEmployeur: 0,
          autres: 0
        }
      };
    }

    return {
      person1,
      person2,
      couple: {
        statutConjugal: person2 ? 'married' : 'single',
        residenceQuebec: false, // À déterminer selon les données utilisateur
        strategieOptimisation: 'COUPLE'
      },
      objectifs: {
        revenuCibleMensuel: userData.personal?.depensesRetraite || 4000,
        ageRetraiteCouple: Math.min(person1.ageRetraiteSouhaite, person2?.ageRetraiteSouhaite || 65),
        esperanceVieCouple: 85,
        prioriteSecurite: 'MOYENNE'
      }
    };
  }
}
