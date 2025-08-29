// ===== SERVICE BUDGÉTAIRE RETRAITE =====
// Basé sur les documents EducFinance et guides spécialisés

export interface ExpenseCategory {
  categorie: string;
  montantActuel: number;
  pourcentageReduction?: number;
  pourcentageAugmentation?: number;
}

export interface MonthlyExpenses {
  logement: number;
  alimentation: number;
  transport: number;
  sante: number;
  loisirs: number;
  vetements: number;
  vehicule: number;
  rrqCotisations?: number;
  reerEmployeur?: number;
  cotisationsPro?: number;
  assuranceEmploi?: number;
  voyages?: number;
}

export interface AccountSeparationStrategy {
  compteDependesFixes: number;
  compteGestionCourante: number;
  justification: string[];
}

export interface TaxOptimizationSuggestions {
  strategies: string[];
  impactPotentiel: number;
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
}

export interface Priority {
  ordre: number;
  action: string;
  urgence: 'CRITIQUE' | 'IMPORTANTE' | 'MOYENNE';
  justification: string;
}

export interface EstateStrategy {
  type: 'REER_CONJOINT' | 'CELI_INDIVIDUEL' | 'COMPTE_SEPARE' | 'MANDAT_INAPTITUDE';
  description: string;
  avantages: string[];
  inconvenients: string[];
}

export interface EstateAnalysis {
  prioritesSuccessorales: Priority[];
  strategiesSuccessorales: EstateStrategy[];
  impactFiscalSuccession: number;
  documentsRequis: string[];
  timelineActions: {
    action: string;
    description: string;
    delai: string;
  }[];
}

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
  
  // Méthodes utilitaires privées
  private static calculateTotalRetirementExpenses(depensesProjectees: any): number {
    let total = 0;
    
    // Dépenses éliminées
    total += depensesProjectees.eliminees.reduce((sum: number, dep: ExpenseCategory) => sum + (dep.montantActuel * 0), 0);
    
    // Dépenses diminuées
    total += depensesProjectees.diminuees.reduce((sum: number, dep: ExpenseCategory) => 
      sum + (dep.montantActuel * (1 - (dep.pourcentageReduction || 0) / 100)), 0);
    
    // Dépenses stables
    total += depensesProjectees.stables.reduce((sum: number, dep: ExpenseCategory) => sum + dep.montantActuel, 0);
    
    // Dépenses augmentées
    total += depensesProjectees.augmentees.reduce((sum: number, dep: ExpenseCategory) => 
      sum + (dep.montantActuel * (1 + (dep.pourcentageAugmentation || 0) / 100)), 0);
    
    return total;
  }
  
  private static calculateFixedExpensesAccount(depensesProjectees: any): number {
    // Logement + assurances + taxes + abonnements
    const logement = depensesProjectees.stables.find((d: ExpenseCategory) => d.categorie === 'Logement')?.montantActuel || 0;
    const sante = depensesProjectees.augmentees.find((d: ExpenseCategory) => d.categorie === 'Soins de santé')?.montantActuel || 0;
    
    return logement + (sante * 1.4); // 40% augmentation
  }
  
  private static calculateVariableExpensesAccount(depensesProjectees: any): number {
    // Alimentation + transport + loisirs + imprévus
    const alimentation = depensesProjectees.stables.find((d: ExpenseCategory) => d.categorie === 'Alimentation')?.montantActuel || 0;
    const transport = depensesProjectees.diminuees.find((d: ExpenseCategory) => d.categorie === 'Transport')?.montantActuel || 0;
    const loisirs = depensesProjectees.augmentees.find((d: ExpenseCategory) => d.categorie === 'Activités sociales')?.montantActuel || 0;
    
    return alimentation + (transport * 0.7) + (loisirs * 1.25); // 30% réduction transport, 25% augmentation loisirs
  }
  
  private static generateTaxOptimizationSuggestions(depensesProjectees: any): TaxOptimizationSuggestions {
    const depensesTotales = this.calculateTotalRetirementExpenses(depensesProjectees);
    
    let priorite: 'HAUTE' | 'MOYENNE' | 'BASSE' = 'BASSE';
    let impactPotentiel = 0;
    
    if (depensesTotales > 60000) {
      priorite = 'HAUTE';
      impactPotentiel = depensesTotales * 0.15; // 15% d'économies potentielles
    } else if (depensesTotales > 40000) {
      priorite = 'MOYENNE';
      impactPotentiel = depensesTotales * 0.10; // 10% d'économies potentielles
    }
    
    return {
      strategies: [
        'Utiliser CELI pour dépenses variables (pas d\'impact sur PSV)',
        'Planifier retraits REER en début d\'année pour optimiser impôts',
        'Considérer revenus de dividendes pour crédits d\'impôt'
      ],
      impactPotentiel,
      priorite
    };
  }
  
  private static generateEstateStrategies(valeursPatrimoine: any, situationFamiliale: string): EstateStrategy[] {
    const strategies: EstateStrategy[] = [];
    
    if (situationFamiliale === 'COUPLE') {
      strategies.push({
        type: 'REER_CONJOINT',
        description: 'Attribuer les REER au conjoint à revenu plus faible',
        avantages: ['Réduction de l\'impôt au retrait', 'Optimisation des seuils PSV'],
        inconvenients: ['Perte de contrôle sur les fonds', 'Risque en cas de séparation']
      });
    }
    
    strategies.push({
      type: 'CELI_INDIVIDUEL',
      description: 'Maintenir des CELI individuels pour chaque personne',
      avantages: ['Flexibilité maximale', 'Pas d\'impact sur PSV', 'Accessibilité immédiate'],
      inconvenients: ['Pas de déduction fiscale à la cotisation']
    });
    
    strategies.push({
      type: 'COMPTE_SEPARE',
      description: 'Éviter les comptes entièrement conjoints',
      avantages: ['Évite le blocage lors du décès', 'Contrôle individuel maintenu'],
      inconvenients: ['Gestion plus complexe', 'Frais bancaires potentiels']
    });
    
    strategies.push({
      type: 'MANDAT_INAPTITUDE',
      description: 'Préparer un mandat en cas d\'inaptitude',
      avantages: ['Protection financière', 'Décisions médicales respectées'],
      inconvenients: ['Coûts de préparation', 'Révision régulière nécessaire']
    });
    
    return strategies;
  }
  
  private static calculateEstateImpact(valeursPatrimoine: any): number {
    // Estimation de l'impact fiscal sur la succession
    const totalPatrimoine = valeursPatrimoine.reer + valeursPatrimoine.celi + valeursPatrimoine.residence + valeursPatrimoine.placements;
    
    // REER imposé au décès, CELI et résidence principale généralement non imposés
    const impactREER = valeursPatrimoine.reer * 0.25; // Taux moyen estimé
    const impactPlacements = valeursPatrimoine.placements * 0.15; // Gains en capital
    
    return impactREER + impactPlacements;
  }
  
  private static listRequiredDocuments(situationFamiliale: string, enfants: boolean): string[] {
    const documents = ['Testament', 'Mandat en cas d\'inaptitude'];
    
    if (situationFamiliale === 'UNION_FAIT') {
      documents.push('Contrat de vie commune', 'Protocole d\'entente');
    }
    
    if (enfants) {
      documents.push('Nomination de tuteur', 'Protection du patrimoine familial');
    }
    
    documents.push('Directives médicales anticipées', 'Assurance-vie (si applicable)');
    
    return documents;
  }
  
  private static createEstateTimeline(prioritesSuccessorales: Priority[]): any[] {
    return prioritesSuccessorales.map((priorite, index) => {
      let delai = 'Immédiat';
      
      if (priorite.urgence === 'CRITIQUE') {
        delai = 'Dans les 30 jours';
      } else if (priorite.urgence === 'IMPORTANTE') {
        delai = 'Dans les 3 mois';
      } else {
        delai = 'Dans les 6 mois';
      }
      
      return {
        action: priorite.action,
        description: priorite.justification,
        delai
      };
    });
  }
}
