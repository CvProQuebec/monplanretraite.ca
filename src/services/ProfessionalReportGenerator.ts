/**
 * Générateur de rapports professionnels pour MonPlanRetraite.ca
 * Adapté aux besoins des comptables, planificateurs financiers, banquiers, etc.
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface ReportData {
  personal: any;
  financial: any;
  retirement: any;
  realEstate?: any;
  seasonal?: any;
  emergency?: any;
}

export interface ReportOptions {
  type: 'fiscal' | 'financial_planning' | 'banking' | 'legal' | 'real_estate' | 'emergency';
  recipient: 'comptable' | 'planificateur' | 'banquier' | 'avocat' | 'notaire' | 'general';
  includePersonalInfo: boolean;
  includeFinancialDetails: boolean;
  includeProjections: boolean;
  includeRecommendations: boolean;
  language: 'fr' | 'en';
}

export class ProfessionalReportGenerator {
  private static readonly VERSION = '2.1.0';
  
  /**
   * Génère un rapport fiscal pour comptable
   */
  static generateFiscalReport(data: ReportData, options: ReportOptions): string {
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    const taxYear = new Date().getFullYear();
    
    let report = this.getReportHeader('fiscal', currentDate);
    
    report += `
# RAPPORT D'ANALYSE FISCALE ${taxYear}

## INFORMATIONS PERSONNELLES
${this.formatPersonalInfo(data.personal, options.includePersonalInfo)}

## SITUATION FINANCIÈRE ACTUELLE
${this.formatFinancialSituation(data.financial)}

## REVENUS ET SOURCES
${this.formatIncomeAnalysis(data.financial)}

## DÉDUCTIONS ET CRÉDITS POTENTIELS
${this.formatTaxDeductions(data)}

## PLANIFICATION RETRAITE - IMPACTS FISCAUX
${this.formatRetirementTaxImpacts(data.retirement)}

## OPTIMISATIONS FISCALES RECOMMANDÉES
${this.formatTaxOptimizations(data)}

## PROJECTIONS FISCALES
${this.formatTaxProjections(data)}

${options.includeRecommendations ? this.formatFiscalRecommendations(data) : ''}

---
${this.getReportFooter('fiscal', currentDate)}
`;

    return report;
  }

  /**
   * Génère un rapport de planification financière
   */
  static generateFinancialPlanningReport(data: ReportData, options: ReportOptions): string {
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    
    let report = this.getReportHeader('financial_planning', currentDate);
    
    report += `
# RAPPORT D'ANALYSE PATRIMONIALE

## PROFIL CLIENT
${this.formatClientProfile(data.personal)}

## BILAN PATRIMONIAL
${this.formatNetWorthAnalysis(data)}

## ANALYSE DES FLUX DE TRÉSORERIE
${this.formatCashFlowAnalysis(data.financial)}

## STRATÉGIE DE PLACEMENT ACTUELLE
${this.formatInvestmentStrategy(data)}

## PLANIFICATION DE LA RETRAITE
${this.formatRetirementPlanning(data.retirement)}

## GESTION DES RISQUES
${this.formatRiskManagement(data)}

## OBJECTIFS FINANCIERS ET ÉCHÉANCIER
${this.formatFinancialGoals(data)}

## RECOMMANDATIONS STRATÉGIQUES
${this.formatStrategicRecommendations(data)}

---
${this.getReportFooter('financial_planning', currentDate)}
`;

    return report;
  }

  /**
   * Génère un rapport bancaire pour financement
   */
  static generateBankingReport(data: ReportData, options: ReportOptions): string {
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    
    let report = this.getReportHeader('banking', currentDate);
    
    report += `
# DOSSIER DE FINANCEMENT

## DEMANDEUR(S)
${this.formatBorrowerProfile(data.personal)}

## CAPACITÉ FINANCIÈRE
${this.formatBorrowingCapacity(data.financial)}

## ACTIFS ET GARANTIES
${this.formatAssetsAndCollateral(data)}

## HISTORIQUE FINANCIER
${this.formatFinancialHistory(data)}

## PROJET DE FINANCEMENT
${this.formatFinancingProject(data)}

## ANALYSE DE RISQUE CRÉDIT
${this.formatCreditRiskAnalysis(data)}

## DOCUMENTS JUSTIFICATIFS
${this.formatSupportingDocuments()}

---
${this.getReportFooter('banking', currentDate)}
`;

    return report;
  }

  /**
   * Génère un rapport immobilier pour vente de 2e propriété
   */
  static generateRealEstateReport(data: ReportData, options: ReportOptions): string {
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    
    let report = this.getReportHeader('real_estate', currentDate);
    
    report += `
# ANALYSE DE VENTE - SECONDE PROPRIÉTÉ

## PROPRIÉTAIRE(S)
${this.formatPropertyOwnerInfo(data.personal)}

## DESCRIPTION DE LA PROPRIÉTÉ
${this.formatPropertyDetails(data.realEstate)}

## ANALYSE FINANCIÈRE DE LA VENTE
${this.formatSaleAnalysis(data.realEstate)}

## IMPLICATIONS FISCALES
${this.formatRealEstateTaxImplications(data)}

## SCÉNARIOS DE VENTE
${this.formatSaleScenarios(data.realEstate)}

## OPTIMISATION FISCALE
${this.formatRealEstateTaxOptimization(data)}

## IMPACT SUR LA PLANIFICATION RETRAITE
${this.formatRetirementImpact(data)}

## RECOMMANDATIONS
${this.formatRealEstateRecommendations(data)}

---
${this.getReportFooter('real_estate', currentDate)}
`;

    return report;
  }

  /**
   * Génère un rapport de planification d'urgence (gratuit)
   */
  static generateEmergencyReport(data: ReportData, options: ReportOptions): string {
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    
    let report = this.getReportHeader('emergency', currentDate);
    
    report += `
# PLAN DE PLANIFICATION D'URGENCE

## INFORMATIONS ESSENTIELLES
${this.formatEmergencyContacts(data.emergency)}

## DOCUMENTS IMPORTANTS
${this.formatImportantDocuments(data.emergency)}

## ACCÈS NUMÉRIQUE
${this.formatDigitalAccess(data.emergency)}

## RESPONSABILITÉS FAMILIALES
${this.formatFamilyResponsibilities(data.emergency)}

## LISTE DE VÉRIFICATION EN CAS DE DÉCÈS
${this.formatDeathChecklist(data.emergency)}

## CONSEILS DE SÉCURITÉ
${this.formatSecurityTips(data.emergency)}

## PLAN D'ÉVACUATION
${this.formatEvacuationPlan(data.emergency)}

---
${this.getReportFooter('emergency', currentDate)}
`;

    return report;
  }

  /**
   * Génère un rapport légal/notarial
   */
  static generateLegalReport(data: ReportData, options: ReportOptions): string {
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    
    let report = this.getReportHeader('legal', currentDate);
    
    report += `
# DOSSIER JURIDIQUE ET SUCCESSORAL

## PARTIES CONCERNÉES
${this.formatLegalParties(data.personal)}

## PATRIMOINE ET ACTIFS
${this.formatLegalAssets(data)}

## SITUATION MATRIMONIALE ET RÉGIME
${this.formatMaritalStatus(data.personal)}

## PLANIFICATION SUCCESSORALE
${this.formatEstatePlanning(data)}

## DOCUMENTS JURIDIQUES EXISTANTS
${this.formatExistingLegalDocuments(data)}

## RECOMMANDATIONS JURIDIQUES
${this.formatLegalRecommendations(data)}

---
${this.getReportFooter('legal', currentDate)}
`;

    return report;
  }

  // Méthodes de formatage des sections

  private static formatPersonalInfo(personal: any, includeDetails: boolean): string {
    if (!includeDetails) return "Informations personnelles disponibles sur demande.";
    
    return `
**Nom :** ${personal.nom1 || 'Non spécifié'} ${personal.nom2 ? `et ${personal.nom2}` : ''}
**Âge :** ${personal.age1 || 'Non spécifié'} ans ${personal.age2 ? `et ${personal.age2} ans` : ''}
**Situation :** ${personal.situationFamiliale || 'Non spécifiée'}
**Province :** ${personal.province || 'Québec'}
`;
  }

  private static formatFinancialSituation(financial: any): string {
    const monthlyIncome = financial?.monthlyIncome || 0;
    const monthlyExpenses = financial?.monthlyExpenses || 0;
    const netWorth = financial?.netWorth || 0;
    
    return `
**Revenus mensuels nets :** ${this.formatCurrency(monthlyIncome)}
**Dépenses mensuelles :** ${this.formatCurrency(monthlyExpenses)}
**Flux de trésorerie net :** ${this.formatCurrency(monthlyIncome - monthlyExpenses)}
**Valeur nette estimée :** ${this.formatCurrency(netWorth)}
`;
  }

  private static formatIncomeAnalysis(financial: any): string {
    return `
### Sources de revenus identifiées :
- Revenus d'emploi
- Revenus de retraite (RRQ, PSV, régimes privés)
- Revenus de placement
- Autres sources

*Détails disponibles dans les données complètes du client.*
`;
  }

  private static formatTaxDeductions(data: ReportData): string {
    return `
### Déductions et crédits potentiels :
- Cotisations REER
- Frais médicaux
- Dons de charité
- Frais de garde d'enfants
- Crédit d'impôt pour aidant naturel
- Autres déductions applicables

*Analyse détaillée requise selon la situation spécifique.*
`;
  }

  private static formatRetirementTaxImpacts(retirement: any): string {
    return `
### Impacts fiscaux de la retraite :
- Stratégie de décaissement REER/FERR
- Optimisation des retraits CELI
- Fractionnement de revenus de pension
- Planification des retraits avant 65 ans

*Recommandations spécifiques selon l'âge et les objectifs.*
`;
  }

  private static formatTaxOptimizations(data: ReportData): string {
    return `
### Optimisations fiscales recommandées :
1. **Maximisation des cotisations REER/CELI**
2. **Planification du fractionnement de revenus**
3. **Optimisation des retraits de régimes**
4. **Stratégies de report d'impôt**
5. **Utilisation des crédits disponibles**

*Stratégies à adapter selon la situation personnelle et les objectifs.*
`;
  }

  private static formatTaxProjections(data: ReportData): string {
    const currentYear = new Date().getFullYear();
    return `
### Projections fiscales :
- **${currentYear} :** Estimation basée sur les revenus actuels
- **${currentYear + 1} :** Projections avec optimisations
- **À la retraite :** Impact des changements de revenus

*Projections sujettes aux changements de législation fiscale.*
`;
  }

  private static formatFiscalRecommendations(data: ReportData): string {
    return `
## RECOMMANDATIONS FISCALES PRIORITAIRES

### Court terme (0-2 ans) :
- Maximiser les cotisations REER avant la date limite
- Optimiser les déductions disponibles
- Planifier les retraits stratégiques

### Moyen terme (2-5 ans) :
- Stratégie de transition vers la retraite
- Optimisation des régimes de retraite
- Planification successorale

### Long terme (5+ ans) :
- Stratégie de décaissement optimale
- Minimisation de l'impôt successoral
- Transfert intergénérationnel

*Révision annuelle recommandée selon l'évolution de la situation.*
`;
  }

  private static formatClientProfile(personal: any): string {
    return `
**Profil de risque :** ${personal.profilRisque || 'À déterminer'}
**Horizon de placement :** ${personal.horizonPlacement || 'À déterminer'}
**Objectifs principaux :** ${personal.objectifsPrincipaux || 'À définir'}
**Contraintes particulières :** ${personal.contraintes || 'Aucune identifiée'}
`;
  }

  private static formatNetWorthAnalysis(data: ReportData): string {
    return `
### ACTIFS
- **Liquidités :** Comptes bancaires, placements à court terme
- **Placements :** REER, CELI, comptes non-enregistrés
- **Immobilier :** Résidence principale, propriétés locatives
- **Autres actifs :** Véhicules, biens personnels

### PASSIFS
- **Hypothèques :** Résidence principale et autres propriétés
- **Dettes de consommation :** Cartes de crédit, prêts personnels
- **Autres dettes :** Marges de crédit, dettes fiscales

### VALEUR NETTE
**Total des actifs - Total des passifs = Valeur nette**

*Évaluation détaillée disponible dans les données complètes.*
`;
  }

  private static formatCashFlowAnalysis(financial: any): string {
    return `
### REVENUS MENSUELS
- Salaires nets
- Revenus de placement
- Autres revenus

### DÉPENSES MENSUELLES
- Logement (hypothèque, taxes, entretien)
- Transport
- Alimentation
- Assurances
- Loisirs et divers

### CAPACITÉ D'ÉPARGNE
**Revenus - Dépenses = Capacité d'épargne mensuelle**

*Analyse détaillée des flux de trésorerie disponible.*
`;
  }

  private static formatInvestmentStrategy(data: ReportData): string {
    return `
### ALLOCATION D'ACTIFS ACTUELLE
- **Actions :** Pourcentage et répartition
- **Obligations :** Échéances et qualité
- **Liquidités :** Fonds d'urgence et placements court terme
- **Immobilier :** REITs et propriétés directes

### PERFORMANCE ET FRAIS
- Rendement historique des placements
- Frais de gestion et coûts de transaction
- Efficacité fiscale des placements

*Recommandations d'optimisation selon le profil de risque.*
`;
  }

  private static formatRetirementPlanning(retirement: any): string {
    return `
### OBJECTIFS DE RETRAITE
- **Âge de retraite souhaité :** ${retirement?.targetRetirementAge || 'À déterminer'}
- **Revenus de retraite cibles :** ${retirement?.targetIncome || 'À calculer'}
- **Style de vie souhaité :** ${retirement?.lifestyleGoals || 'À définir'}

### SOURCES DE REVENUS PRÉVUES
- **RRQ/PSV :** Estimations gouvernementales
- **Régimes d'employeur :** Pensions privées
- **Épargne personnelle :** REER, CELI, autres

### ANALYSE DES BESOINS
- **Capital requis à la retraite**
- **Stratégie d'accumulation**
- **Plan de décaissement**

*Projections basées sur les données actuelles et les hypothèses de rendement.*
`;
  }

  private static formatRiskManagement(data: ReportData): string {
    return `
### COUVERTURE D'ASSURANCE ACTUELLE
- **Assurance vie :** Montants et bénéficiaires
- **Assurance invalidité :** Couverture et conditions
- **Assurance maladie grave :** Protection complémentaire

### ANALYSE DES BESOINS
- **Protection du revenu familial**
- **Couverture des dettes**
- **Besoins de liquidités d'urgence**

### RECOMMANDATIONS
- Ajustements de couverture recommandés
- Optimisation des primes
- Révision des bénéficiaires

*Évaluation complète des risques financiers et personnels.*
`;
  }

  private static formatFinancialGoals(data: ReportData): string {
    return `
### OBJECTIFS À COURT TERME (0-2 ans)
- Fonds d'urgence
- Remboursement de dettes
- Projets spécifiques

### OBJECTIFS À MOYEN TERME (2-10 ans)
- Achat immobilier
- Éducation des enfants
- Voyages et loisirs

### OBJECTIFS À LONG TERME (10+ ans)
- Retraite confortable
- Héritage et succession
- Projets philanthropiques

*Priorisation et échéancier selon les ressources disponibles.*
`;
  }

  private static formatStrategicRecommendations(data: ReportData): string {
    return `
## RECOMMANDATIONS STRATÉGIQUES PRIORITAIRES

### 1. OPTIMISATION FISCALE
- Maximisation des abris fiscaux
- Stratégies de fractionnement
- Planification des retraits

### 2. GESTION DES PLACEMENTS
- Rééquilibrage du portefeuille
- Diversification géographique
- Optimisation des frais

### 3. PLANIFICATION DE LA RETRAITE
- Stratégie d'accumulation
- Plan de décaissement
- Optimisation des régimes

### 4. GESTION DES RISQUES
- Révision des assurances
- Protection du patrimoine
- Planification successorale

*Plan d'action détaillé avec échéancier et responsabilités.*
`;
  }

  private static formatBorrowerProfile(personal: any): string {
    return `
**Demandeur principal :** ${personal.nom1 || 'Non spécifié'}
**Co-demandeur :** ${personal.nom2 || 'N/A'}
**Âges :** ${personal.age1 || 'N/S'} ans ${personal.age2 ? `et ${personal.age2} ans` : ''}
**Situation d'emploi :** ${personal.emploi1 || 'À préciser'} ${personal.emploi2 ? `et ${personal.emploi2}` : ''}
**Revenus combinés :** ${this.formatCurrency(personal.revenusCombines || 0)}
`;
  }

  private static formatBorrowingCapacity(financial: any): string {
    const monthlyIncome = financial?.monthlyIncome || 0;
    const monthlyExpenses = financial?.monthlyExpenses || 0;
    const availableForDebt = monthlyIncome - monthlyExpenses;
    const maxBorrowing = availableForDebt * 12 * 5; // Estimation simple

    return `
**Revenus mensuels nets :** ${this.formatCurrency(monthlyIncome)}
**Charges mensuelles :** ${this.formatCurrency(monthlyExpenses)}
**Disponible pour service de dette :** ${this.formatCurrency(availableForDebt)}
**Capacité d'emprunt estimée :** ${this.formatCurrency(maxBorrowing)}

*Calculs préliminaires - Évaluation détaillée requise par l'institution financière.*
`;
  }

  private static formatAssetsAndCollateral(data: ReportData): string {
    return `
### ACTIFS LIQUIDES
- Comptes bancaires
- Placements facilement convertibles
- CELI disponible

### ACTIFS IMMOBILIERS
- Résidence principale (valeur estimée)
- Propriétés locatives
- Terrains et autres biens immobiliers

### AUTRES ACTIFS
- Véhicules
- Placements REER (si applicable)
- Biens de valeur

*Évaluations professionnelles requises pour garanties.*
`;
  }

  private static formatFinancialHistory(data: ReportData): string {
    return `
### HISTORIQUE DE CRÉDIT
- Cote de crédit actuelle
- Historique de paiements
- Dettes actuelles et gestion

### STABILITÉ FINANCIÈRE
- Ancienneté d'emploi
- Stabilité des revenus
- Historique d'épargne

### EXPÉRIENCE IMMOBILIÈRE
- Propriétés détenues précédemment
- Gestion de dettes hypothécaires
- Expérience de location (si applicable)

*Vérifications de crédit et références requises.*
`;
  }

  private static formatFinancingProject(data: ReportData): string {
    return `
### DÉTAILS DU PROJET
- **Type de financement :** [À spécifier]
- **Montant demandé :** [À déterminer]
- **Durée souhaitée :** [À négocier]
- **Utilisation des fonds :** [À préciser]

### GARANTIES PROPOSÉES
- Hypothèque sur propriété
- Autres garanties disponibles

### PLAN DE REMBOURSEMENT
- Capacité de paiement mensuel
- Sources de revenus pour remboursement
- Plan de contingence

*Détails spécifiques selon le type de financement demandé.*
`;
  }

  private static formatCreditRiskAnalysis(data: ReportData): string {
    return `
### FACTEURS DE RISQUE POSITIFS
- Stabilité d'emploi et de revenus
- Historique de crédit favorable
- Actifs substantiels en garantie
- Expérience de gestion financière

### FACTEURS À CONSIDÉRER
- Ratio d'endettement actuel
- Volatilité des revenus
- Obligations financières existantes

### MESURES D'ATTÉNUATION
- Garanties supplémentaires
- Co-signataire si nécessaire
- Assurance crédit

*Évaluation finale par l'institution prêteuse.*
`;
  }

  private static formatSupportingDocuments(): string {
    return `
### DOCUMENTS FOURNIS
- [ ] Relevés de revenus (T4, relevés de paie)
- [ ] Déclarations de revenus (2 dernières années)
- [ ] Relevés bancaires (3 derniers mois)
- [ ] Évaluations de propriétés
- [ ] Relevés de placements
- [ ] Preuves d'assurance

### DOCUMENTS ADDITIONNELS REQUIS
- [ ] Rapport de crédit récent
- [ ] Lettres d'emploi
- [ ] États financiers détaillés
- [ ] Autres selon le type de financement

*Liste complète selon les exigences de l'institution financière.*
`;
  }

  private static formatPropertyOwnerInfo(personal: any): string {
    return `
**Propriétaire(s) :** ${personal.nom1 || 'Non spécifié'} ${personal.nom2 ? `et ${personal.nom2}` : ''}
**Régime matrimonial :** ${personal.regimeMatrimonial || 'À préciser'}
**Résidence principale :** ${personal.residencePrincipale || 'À confirmer'}
**Nombre de propriétés :** ${personal.nombreProprietes || 'À déterminer'}
`;
  }

  private static formatPropertyDetails(realEstate: any): string {
    return `
### CARACTÉRISTIQUES DE LA PROPRIÉTÉ
- **Adresse :** ${realEstate?.adresse || 'À fournir'}
- **Type :** ${realEstate?.type || 'À spécifier'}
- **Superficie :** ${realEstate?.superficie || 'À mesurer'}
- **Année de construction :** ${realEstate?.anneeConstruction || 'À vérifier'}

### ÉVALUATION ACTUELLE
- **Valeur municipale :** ${this.formatCurrency(realEstate?.valeurMunicipale || 0)}
- **Valeur marchande estimée :** ${this.formatCurrency(realEstate?.valeurMarchande || 0)}
- **Date de la dernière évaluation :** ${realEstate?.dateEvaluation || 'À déterminer'}

### SITUATION HYPOTHÉCAIRE
- **Solde hypothécaire :** ${this.formatCurrency(realEstate?.soldeHypothecaire || 0)}
- **Paiements mensuels :** ${this.formatCurrency(realEstate?.paiementsMensuels || 0)}
- **Échéance :** ${realEstate?.echeanceHypothecaire || 'À vérifier'}

*Évaluation professionnelle recommandée pour la vente.*
`;
  }

  private static formatSaleAnalysis(realEstate: any): string {
    const valeurMarchande = realEstate?.valeurMarchande || 0;
    const soldeHypothecaire = realEstate?.soldeHypothecaire || 0;
    const fraisVente = valeurMarchande * 0.06; // Estimation 6%
    const produitNet = valeurMarchande - soldeHypothecaire - fraisVente;

    return `
### ANALYSE FINANCIÈRE DE LA VENTE
- **Valeur marchande estimée :** ${this.formatCurrency(valeurMarchande)}
- **Solde hypothécaire à rembourser :** ${this.formatCurrency(soldeHypothecaire)}
- **Frais de vente estimés (6%) :** ${this.formatCurrency(fraisVente)}
- **Produit net de la vente :** ${this.formatCurrency(produitNet)}

### RÉPARTITION DES FRAIS DE VENTE
- Commission immobilière : 5-6%
- Frais légaux : 0.5-1%
- Inspections et réparations : Variable
- Autres frais : 0.5%

*Estimations sujettes aux conditions du marché et négociations.*
`;
  }

  private static formatRealEstateTaxImplications(data: ReportData): string {
    return `
### IMPLICATIONS FISCALES DE LA VENTE
- **Gain en capital potentiel :** Calcul selon le prix d'acquisition
- **Exemption résidence principale :** Applicable si critères respectés
- **Récupération d'amortissement :** Si propriété locative
- **Impôt sur le gain :** 50% du gain imposable

### STRATÉGIES D'OPTIMISATION
- Utilisation de l'exemption pour résidence principale
- Report du gain par remplacement de propriété
- Fractionnement avec le conjoint si applicable
- Planification du moment de la vente

*Consultation fiscale spécialisée recommandée.*
`;
  }

  private static formatSaleScenarios(realEstate: any): string {
    const valeurBase = realEstate?.valeurMarchande || 500000;
    
    return `
### SCÉNARIOS DE VENTE

#### SCÉNARIO OPTIMISTE (+10%)
- **Prix de vente :** ${this.formatCurrency(valeurBase * 1.1)}
- **Produit net estimé :** ${this.formatCurrency(valeurBase * 1.1 * 0.94)}

#### SCÉNARIO RÉALISTE (valeur actuelle)
- **Prix de vente :** ${this.formatCurrency(valeurBase)}
- **Produit net estimé :** ${this.formatCurrency(valeurBase * 0.94)}

#### SCÉNARIO CONSERVATEUR (-10%)
- **Prix de vente :** ${this.formatCurrency(valeurBase * 0.9)}
- **Produit net estimé :** ${this.formatCurrency(valeurBase * 0.9 * 0.94)}

*Scénarios basés sur les conditions actuelles du marché.*
`;
  }

  private static formatRealEstateTaxOptimization(data: ReportData): string {
    return `
### STRATÉGIES D'OPTIMISATION FISCALE

#### AVANT LA VENTE
- Maximiser les dépenses déductibles
- Documenter les améliorations capitalisables
- Planifier le moment optimal de la vente

#### AU MOMENT DE LA VENTE
- Négocier les conditions fiscalement avantageuses
- Structurer la transaction optimalement
- Considérer le paiement échelonné si applicable

#### APRÈS LA VENTE
- Réinvestissement stratégique des produits
- Utilisation optimale des abris fiscaux
- Planification des retraits futurs

*Stratégies à adapter selon la situation fiscale globale.*
`;
  }

  private static formatRetirementImpact(data: ReportData): string {
    return `
### IMPACT SUR LA PLANIFICATION RETRAITE

#### LIQUIDITÉS ADDITIONNELLES
- Augmentation du capital disponible
- Possibilités de placement accrues
- Flexibilité financière améliorée

#### REVENUS DE RETRAITE
- Impact sur les revenus de placement
- Réduction des dépenses de propriété
- Modification du budget de retraite

#### STRATÉGIES DE PLACEMENT
- Diversification du portefeuille
- Optimisation de l'allocation d'actifs
- Planification des retraits

*Intégration dans la stratégie globale de retraite.*
`;
  }

  private static formatRealEstateRecommendations(data: ReportData): string {
    return `
## RECOMMANDATIONS

### PRÉPARATION À LA VENTE
1. **Évaluation professionnelle** de la propriété
2. **Consultation fiscale** pour optimisation
3. **Préparation de la propriété** pour maximiser la valeur

### STRATÉGIE DE VENTE
1. **Timing optimal** selon le marché
2. **Prix de vente stratégique**
3. **Négociation des conditions**

### GESTION DES PRODUITS
1. **Remboursement des dettes** prioritaires
2. **Réinvestissement stratégique**
3. **Optimisation fiscale** des placements

### SUIVI POST-VENTE
1. **Déclaration fiscale** appropriée
2. **Ajustement de la planification** de retraite
3. **Révision de la stratégie** globale

*Plan d'action détaillé avec échéancier recommandé.*
`;
  }

  // Méthodes pour les rapports d'urgence
  private static formatEmergencyContacts(emergency: any): string {
    return `
### CONTACTS D'URGENCE
- **Contact principal :** ${emergency?.contactPrincipal || 'À définir'}
- **Téléphone :** ${emergency?.telephonePrincipal || 'À fournir'}
- **Contact secondaire :** ${emergency?.contactSecondaire || 'À définir'}
- **Médecin de famille :** ${emergency?.medecinFamille || 'À préciser'}
- **Pharmacie :** ${emergency?.pharmacie || 'À identifier'}

*Maintenir ces informations à jour et accessibles.*
`;
  }

  private static formatImportantDocuments(emergency: any): string {
    return `
### DOCUMENTS ESSENTIELS
- [ ] Certificats de naissance
- [ ] Passeports et pièces d'identité
- [ ] Testaments et mandats
- [ ] Polices d'assurance
- [ ] Documents bancaires
- [ ] Titres de propriété

### LOCALISATION
- **Coffret de sûreté :** ${emergency?.coffretSurete || 'À préciser'}
- **Copies à domicile :** ${emergency?.copiesDomicile || 'À organiser'}
- **Accès numérique :** ${emergency?.accesNumerique || 'À configurer'}

*Assurer l'accès aux proches de confiance.*
`;
  }

  private static formatDigitalAccess(emergency: any): string {
    return `
### ACCÈS NUMÉRIQUES
- **Gestionnaire de mots de passe :** ${emergency?.gestionnaireMotsPasse || 'À installer'}
- **Comptes bancaires en ligne :** Accès sécurisé requis
- **Réseaux sociaux :** Procédures de fermeture
- **Services gouvernementaux :** Mon dossier Service Canada, Revenu Québec

### INSTRUCTIONS D'ACCÈS
- Mot de passe maître sécurisé
- Questions de sécurité documentées
- Procédures de récupération

*Révision régulière des accès et mots de passe.*
`;
  }

  private static formatFamilyResponsibilities(emergency: any): string {
    return `
### RESPONSABILITÉS FAMILIALES
- **Enfants mineurs :** ${emergency?.enfantsMineurs || 'N/A'}
- **Tuteur désigné :** ${emergency?.tuteurDesigne || 'À nommer'}
- **Personnes à charge :** ${emergency?.personnesCharge || 'À identifier'}
- **Animaux de compagnie :** ${emergency?.animaux || 'N/A'}

### ARRANGEMENTS SPÉCIAUX
- Besoins médicaux particuliers
- Arrangements scolaires
- Soins spécialisés requis

*Documenter tous les arrangements et contacts.*
`;
  }

  private static formatDeathChecklist(emergency: any): string {
    return `
### LISTE DE VÉRIFICATION EN CAS DE DÉCÈS

#### IMMÉDIAT (0-24h)
- [ ] Contacter les services d'urgence si nécessaire
- [ ] Obtenir le certificat de décès
- [ ] Contacter le salon funéraire
- [ ] Aviser la famille proche

#### COURT TERME (1-7 jours)
- [ ] Organiser les funérailles
- [ ] Publier l'avis de décès
- [ ] Contacter l'employeur
- [ ] Aviser les institutions financières

#### MOYEN TERME (1-4 semaines)
- [ ] Régler la succession
- [ ] Transférer les comptes
- [ ] Annuler les services
- [ ] Mettre à jour les documents

*Liste détaillée disponible dans le plan complet.*
`;
  }

  private static formatSecurityTips(emergency: any): String {
    return `
### CONSEILS DE SÉCURITÉ

#### SÉCURITÉ DOMICILIAIRE
- Systèmes d'alarme et codes
- Éclairage de sécurité
- Contacts des voisins de confiance
- Procédures d'urgence

#### SÉCURITÉ FINANCIÈRE
- Protection contre la fraude
- Surveillance des comptes
- Contacts bancaires d'urgence
- Procédures de blocage

#### SÉCURITÉ PERSONNELLE
- Informations médicales d'urgence
- Allergies et médicaments
- Contacts médicaux
- Procédures d'évacuation

*Révision et mise à jour régulières recommandées.*
`;
  }

  private static formatEvacuationPlan(emergency: any): string {
    return `
### PLAN D'ÉVACUATION

#### ROUTES D'ÉVACUATION
- **Route principale :** ${emergency?.routePrincipale || 'À planifier'}
- **Route alternative :** ${emergency?.routeAlternative || 'À identifier'}
- **Point de rassemblement :** ${emergency?.pointRassemblement || 'À désigner'}

#### TROUSSE D'URGENCE
- [ ] Eau (3 jours par personne)
- [ ] Nourriture non périssable
- [ ] Médicaments essentiels
- [ ] Documents importants
- [ ] Argent comptant
- [ ] Radio à piles

#### CONTACTS D'ÉVACUATION
- Services d'urgence locaux
- Centres d'hébergement
- Famille/amis hors région

*Plan à réviser et pratiquer régulièrement.*
`;
  }

  private static formatLegalParties(personal: any): string {
    return `
**Parties principales :** ${personal.nom1 || 'Non spécifié'} ${personal.nom2 ? `et ${personal.nom2}` : ''}
**État civil :** ${personal.etatCivil || 'À préciser'}
**Régime matrimonial :** ${personal.regimeMatrimonial || 'À déterminer'}
**Enfants :** ${personal.enfants || 'À documenter'}
**Héritiers potentiels :** ${personal.heritiers || 'À identifier'}
`;
  }

  private static formatLegalAssets(data: ReportData): string {
    return `
### PATRIMOINE IMMOBILIER
- Résidence principale
- Propriétés secondaires
- Terrains et investissements immobiliers

### PATRIMOINE MOBILIER
- Comptes bancaires et placements
- REER, CELI, régimes de retraite
- Véhicules et biens personnels
- Collections et objets de valeur

### DETTES ET OBLIGATIONS
- Hypothèques et prêts
- Dettes de consommation
- Obligations fiscales

*Évaluation détaillée requise pour planification successorale.*
`;
  }

  private static formatMaritalStatus(personal: any): string {
    return `
**Régime matrimonial :** ${personal.regimeMatrimonial || 'À préciser'}
**Date de mariage/union :** ${personal.dateMariage || 'À fournir'}
**Contrat de mariage :** ${personal.contratMariage ? 'Oui' : 'Non'}
**Séparation de biens :** ${personal.separationBiens ? 'Oui' : 'Non'}

### IMPLICATIONS LÉGALES
- Droits successoraux du conjoint
- Partage du patrimoine familial
- Droits sur la résidence familiale

*Révision recommandée selon l'évolution de la situation.*
`;
  }

  private static formatEstatePlanning(data: ReportData): string {
    return `
### DOCUMENTS SUCCESSORAUX EXISTANTS
- **Testament :** ${data.personal?.testament || 'À rédiger'}
- **Mandat en cas d'inaptitude :** ${data.personal?.mandat || 'À préparer'}
- **Directives médicales anticipées :** ${data.personal?.directivesMedicales || 'À compléter'}

### STRATÉGIES SUCCESSORALES
- Minimisation des impôts au décès
- Protection du patrimoine familial
- Transmission intergénérationnelle
- Planification charitable

### RECOMMANDATIONS
- Mise à jour régulière des documents
- Révision selon les changements familiaux
- Optimisation fiscale de la succession

*Consultation juridique spécialisée recommandée.*
`;
  }

  private static formatExistingLegalDocuments(data: ReportData): string {
    return `
### DOCUMENTS JURIDIQUES ACTUELS
- [ ] Testament notarié
- [ ] Mandat d'inaptitude
- [ ] Contrat de mariage
- [ ] Conventions entre actionnaires
- [ ] Fiducies existantes
- [ ] Procurations

### RÉVISIONS REQUISES
- Mise à jour selon la législation
- Adaptation aux changements familiaux
- Optimisation fiscale
- Clarification des volontés

*Révision juridique périodique recommandée.*
`;
  }

  private static formatLegalRecommendations(data: ReportData): string {
    return `
## RECOMMANDATIONS JURIDIQUES

### PRIORITÉ IMMÉDIATE
1. **Rédaction/mise à jour du testament**
2. **Mandat d'inaptitude complet**
3. **Directives médicales anticipées**

### PLANIFICATION AVANCÉE
1. **Optimisation de la structure successorale**
2. **Stratégies de protection d'actifs**
3. **Planification fiscale du décès**

### RÉVISIONS PÉRIODIQUES
1. **Mise à jour selon les changements législatifs**
2. **Adaptation aux évolutions familiales**
3. **Optimisation continue de la stratégie**

*Suivi juridique professionnel recommandé.*
`;
  }

  // Méthodes utilitaires
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  private static getReportHeader(type: string, date: string): string {
    const logoPath = '/logo-planretraite.png';
    const headers = {
      fiscal: `![MonPlanRetraite.ca](${logoPath})\n\n**RAPPORT D'ANALYSE FISCALE**\n*Document généré le ${date} par MonPlanRetraite.ca*\n*Analyse préparée par MonPlanRetraite.ca - Plateforme certifiée de planification financière et de retraite*\n\n`,
      financial_planning: `![MonPlanRetraite.ca](${logoPath})\n\n**RAPPORT D'ANALYSE PATRIMONIALE**\n*Document généré le ${date} par MonPlanRetraite.ca*\n*Rapport d'analyse patrimoniale établi par MonPlanRetraite.ca - Solution professionnelle de planification de retraite*\n\n`,
      banking: `![MonPlanRetraite.ca](${logoPath})\n\n**DOSSIER DE FINANCEMENT**\n*Document généré le ${date} par MonPlanRetraite.ca*\n*Document préparé à l'aide de MonPlanRetraite.ca - Plateforme spécialisée en optimisation fiscale et planification de retraite pour les résidents du Québec*\n\n`,
      real_estate: `![MonPlanRetraite.ca](${logoPath})\n\n**ANALYSE IMMOBILIÈRE**\n*Document généré le ${date} par MonPlanRetraite.ca*\n*Document préparé à l'aide de MonPlanRetraite.ca - Plateforme spécialisée en optimisation fiscale et planification de retraite pour les résidents du Québec*\n\n`,
      legal: `![MonPlanRetraite.ca](${logoPath})\n\n**DOSSIER JURIDIQUE**\n*Document généré le ${date} par MonPlanRetraite.ca*\n*Document préparé à l'aide de MonPlanRetraite.ca - Plateforme spécialisée en optimisation fiscale et planification de retraite pour les résidents du Québec*\n\n`,
      emergency: `![MonPlanRetraite.ca](${logoPath})\n\n**PLAN DE PLANIFICATION D'URGENCE**\n*Document généré le ${date} par MonPlanRetraite.ca*\n*Ce dossier de planification d'urgence vous est offert gracieusement par MonPlanRetraite.ca dans le cadre de notre mission d'accompagner les Québécois vers leur sécurité financière.*\n\n`
    };
    
    return headers[type as keyof typeof headers] || headers.emergency;
  }

  private static getReportFooter(type: string, date: string): string {
    const footers = {
      fiscal: `\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ\n\n**IMPORTANT :** Les données contenues dans ce rapport ont été saisies par l'utilisateur sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'utilisation de ce rapport pour des décisions financières, fiscales ou d'investissement.\n\n**Ce rapport ne constitue pas :** \n- Des conseils financiers personnalisés\n- Des recommandations d'investissement\n- Des conseils fiscaux ou juridiques\n- Une analyse professionnelle certifiée\n\n**Recommandation :** Consultez toujours un comptable, planificateur financier ou conseiller fiscal qualifié avant de prendre des décisions importantes basées sur ce rapport.\n\n---\n\n*Calculs effectués localement - Vos données demeurent confidentielles*\n*Analyse préparée par MonPlanRetraite.ca - Plateforme certifiée de planification financière et de retraite*\n*Version du document: ${this.VERSION} - ${date}*`,
      financial_planning: `\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ\n\n**IMPORTANT :** Les données contenues dans ce rapport ont été saisies par l'utilisateur sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'utilisation de ce rapport pour des décisions de placement, de planification financière ou de retraite.\n\n**Ce rapport ne constitue pas :** \n- Des conseils en planification financière personnalisés\n- Des recommandations de placement spécifiques\n- Une analyse de risque professionnelle\n- Des projections garanties de rendement\n\n**Recommandation :** Consultez toujours un planificateur financier certifié avant de prendre des décisions d'investissement ou de planification de retraite basées sur ce rapport.\n\n---\n\n*Calculs effectués localement - Vos données demeurent confidentielles*\n*Rapport d'analyse patrimoniale établi par MonPlanRetraite.ca - Solution professionnelle de planification de retraite*\n*Version du document: ${this.VERSION} - ${date}*`,
      banking: `\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ\n\n**IMPORTANT :** Les données contenues dans ce rapport ont été saisies par l'utilisateur sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'utilisation de ce rapport pour des demandes de financement ou d'évaluation de crédit.\n\n**Ce rapport ne constitue pas :** \n- Une évaluation officielle de solvabilité\n- Une garantie d'approbation de crédit\n- Une analyse de risque bancaire certifiée\n- Des conseils en financement personnalisés\n\n**Recommandation :** Les institutions financières effectueront leur propre évaluation indépendante. Ce rapport est fourni à titre informatif seulement.\n\n---\n\n*Calculs effectués localement - Vos données demeurent confidentielles*\n*Document préparé à l'aide de MonPlanRetraite.ca - Plateforme spécialisée en optimisation fiscale et planification de retraite pour les résidents du Québec*\n*Version du document: ${this.VERSION} - ${date}*`,
      real_estate: `\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ\n\n**IMPORTANT :** Les données contenues dans ce rapport ont été saisies par l'utilisateur sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'utilisation de ce rapport pour des décisions de vente immobilière ou de planification fiscale.\n\n**Ce rapport ne constitue pas :** \n- Une évaluation immobilière professionnelle\n- Des conseils fiscaux certifiés\n- Une analyse de marché officielle\n- Des recommandations de vente spécifiques\n\n**Recommandation :** Consultez toujours un évaluateur agréé, un fiscaliste et un courtier immobilier avant de prendre des décisions de vente basées sur ce rapport.\n\n---\n\n*Calculs effectués localement - Vos données demeurent confidentielles*\n*Document préparé à l'aide de MonPlanRetraite.ca - Plateforme spécialisée en optimisation fiscale et planification de retraite pour les résidents du Québec*\n*Version du document: ${this.VERSION} - ${date}*`,
      legal: `\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ\n\n**IMPORTANT :** Les données contenues dans ce rapport ont été saisies par l'utilisateur sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'utilisation de ce rapport pour des décisions juridiques ou de planification successorale.\n\n**Ce rapport ne constitue pas :** \n- Des conseils juridiques personnalisés\n- Une analyse successorale professionnelle\n- Des recommandations notariales certifiées\n- Une interprétation légale officielle\n\n**Recommandation :** Consultez toujours un avocat, notaire ou conseiller juridique qualifié avant de prendre des décisions légales ou successorales basées sur ce rapport.\n\n---\n\n*Calculs effectués localement - Vos données demeurent confidentielles*\n*Document préparé à l'aide de MonPlanRetraite.ca - Plateforme spécialisée en optimisation fiscale et planification de retraite pour les résidents du Québec*\n*Version du document: ${this.VERSION} - ${date}*`,
      emergency: `\n---\n\n## ⚠️ AVERTISSEMENT LÉGAL ET NON-RESPONSABILITÉ\n\n**IMPORTANT :** Les informations contenues dans ce plan d'urgence ont été saisies par l'utilisateur sans validation par un professionnel qualifié. MonPlanRetraite.ca se dégage de toute responsabilité quant à l'utilisation de ce plan pour des situations d'urgence réelles.\n\n**Ce plan ne constitue pas :** \n- Des conseils de sécurité professionnels\n- Un plan d'urgence certifié\n- Des recommandations médicales\n- Une analyse de risque officielle\n\n**Recommandation :** Consultez les autorités locales, services d'urgence et professionnels qualifiés pour valider et compléter votre plan d'urgence.\n\n---\n\n*Calculs effectués localement - Vos données demeurent confidentielles*\n*Document de planification d'urgence gracieusement offert par MonPlanRetraite.ca - Votre partenaire en planification financière*\n*Version du document: ${this.VERSION} - ${date}*`
    };
    
    return footers[type as keyof typeof footers] || footers.emergency;
  }

  /**
   * Génère un rapport personnalisé selon le type et les options
   */
  static generateReport(data: ReportData, options: ReportOptions): string {
    switch (options.type) {
      case 'fiscal':
        return this.generateFiscalReport(data, options);
      case 'financial_planning':
        return this.generateFinancialPlanningReport(data, options);
      case 'banking':
        return this.generateBankingReport(data, options);
      case 'real_estate':
        return this.generateRealEstateReport(data, options);
      case 'legal':
        return this.generateLegalReport(data, options);
      case 'emergency':
        return this.generateEmergencyReport(data, options);
      default:
        return this.generateFinancialPlanningReport(data, options);
    }
  }

  /**
   * Exporte le rapport en format téléchargeable
   */
  static exportReport(reportContent: string, filename: string): void {
    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
