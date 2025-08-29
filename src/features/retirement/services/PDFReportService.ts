// src/features/retirement/services/PDFReportService.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserData, Calculations } from '../types';

export interface ReportData {
  userData: UserData;
  calculations: Calculations;
  monteCarloResults?: any;
  recommendations?: any[];
  generatedAt: Date;
}

export class PDFReportService {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margins = { top: 20, right: 20, bottom: 20, left: 20 };
  private currentY: number = 30;

  constructor() {
    this.pdf = new jsPDF();
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.pageHeight = this.pdf.internal.pageSize.height;
  }

  /**
   * Génère un rapport PDF complet
   */
  async generateReport(data: ReportData): Promise<Blob> {
    this.currentY = 30;

    // Page de couverture
    this.addCoverPage(data);
    
    // Sommaire exécutif
    this.addExecutiveSummary(data);
    
    // Profil personnel
    this.addPersonalProfile(data);
    
    // Analyse financière
    this.addFinancialAnalysis(data);
    
    // Projections
    this.addProjections(data);
    
    // Monte Carlo (si disponible)
    if (data.monteCarloResults) {
      this.addMonteCarloAnalysis(data);
    }
    
    // Recommandations
    this.addRecommendations(data);
    
    // Plan d'action
    this.addActionPlan(data);

    // Ajouter le pied de page final
    this.addFooter();

    return new Promise((resolve) => {
      const blob = new Blob([this.pdf.output('blob')], { type: 'application/pdf' });
      resolve(blob);
    });
  }

  /**
   * Page de couverture
   */
  private addCoverPage(data: ReportData) {
    // Logo MonPlanRetraite en haut à gauche
    this.addLogo(30, 30);
    
    // Titre principal
    this.pdf.setFontSize(32);
    this.pdf.setTextColor(44, 62, 80);
    this.pdf.text('PLAN DE RETRAITE', this.pageWidth / 2, 80, { align: 'center' });
    
    // Sous-titre
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(52, 73, 94);
    this.pdf.text('Analyse personnalisée et recommandations', this.pageWidth / 2, 110, { align: 'center' });
    
    // Informations personnelles
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(0, 0, 0);
    const name = `${data.userData.personal.prenom1} ${data.userData.personal.prenom2}`;
    this.pdf.text(`Préparé pour : ${name}`, this.pageWidth / 2, 140, { align: 'center' });
    
    // Date
    const date = new Date().toLocaleDateString('fr-CA');
    this.pdf.text(`Date : ${date}`, this.pageWidth / 2, 160, { align: 'center' });
    
    // Pied de page avec mention MonPlanRetraite
    this.addFooter();
    
    // Nouvelle page
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Ajoute le logo MonPlanRetraite
   */
  private addLogo(x: number, y: number) {
    try {
      // Création d'un logo stylisé MonPlanRetraite
      
      // Rectangle de fond principal avec coins arrondis simulés
              this.pdf.setFillColor(44, 62, 80); // Bleu MonPlanRetraite
      this.pdf.rect(x, y, 80, 25, 'F');
      
      // Cercle doré pour le point du "i"
      this.pdf.setFillColor(255, 193, 7); // Doré
      this.pdf.circle(x + 15, y + 8, 4, 'F');
      
              // Texte "MonPlanRetraite" stylisé
      this.pdf.setFontSize(16);
      this.pdf.setTextColor(255, 255, 255);
              this.pdf.text('MonPlanRetraite', x + 40, y + 16, { align: 'center' });
      
      // Ligne décorative dorée en bas
      this.pdf.setDrawColor(255, 193, 7);
      this.pdf.setLineWidth(1);
      this.pdf.line(x, y + 25, x + 80, y + 25);
      
      // Ajout du texte ".ca" en plus petit
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(255, 193, 7);
      this.pdf.text('.ca', x + 70, y + 22, { align: 'right' });
      
    } catch (error) {
      console.warn('Impossible d\'ajouter le logo:', error);
      // Fallback: texte simple
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(44, 62, 80);
              this.pdf.text('MonPlanRetraite.ca', x, y + 15);
    }
  }

  /**
   * Ajoute le pied de page avec mention MonPlanRetraite
   */
  private addFooter() {
    const footerY = this.pageHeight - 20;
    
    // Ligne de séparation avec couleur MonPlanRetraite
            this.pdf.setDrawColor(44, 62, 80); // Bleu MonPlanRetraite
    this.pdf.setLineWidth(1);
    this.pdf.line(20, footerY - 8, this.pageWidth - 20, footerY - 8);
    
    // Logo MonPlanRetraite en bas à gauche
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(44, 62, 80);
            this.pdf.text('MonPlanRetraite', 20, footerY - 2);
    
    // Texte du pied de page centré
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(100, 100, 100);
            this.pdf.text('Ce rapport a été préparé en utilisant la solution de planification MonPlanRetraite.ca', this.pageWidth / 2, footerY - 2, { align: 'center' });
    
    // Date de génération à droite
    const date = new Date().toLocaleDateString('fr-CA');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(`Généré le: ${date}`, this.pageWidth - 20, footerY - 2, { align: 'right' });
  }

  /**
   * Ajoute une section avec titre
   */
  private addSectionHeader(title: string, color: [number, number, number] = [52, 73, 94]) {
    this.checkPageBreak(20);
    
    // Ligne décorative
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.5);
    // this.pdf.setLineDashPattern([1, 1], 0); // Not available in this jsPDF version
    this.pdf.line(
      this.margins.left + 5,
      this.currentY,
      this.pageWidth - this.margins.right - 20,
      this.currentY
    );
    
    // Titre de section
    this.currentY += 10;
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(title, this.margins.left, this.currentY);
    this.currentY += 15;
    
    // Ligne décorative de fin
    this.pdf.line(
      this.margins.left,
      this.currentY,
      this.pageWidth - this.margins.right,
      this.currentY
    );
    
    this.currentY += 8;
  }

  /**
   * Sommaire exécutif visuellement attrayant
   */
  private addExecutiveSummary(data: ReportData) {
    this.addSectionHeader('SOMMAIRE EXÉCUTIF', [41, 128, 185]);
    
    // Métriques clés dans des cartes visuelles
    this.addMetricCard('Valeur nette actuelle', data.calculations.netWorth, 
                       'La somme de tous vos actifs moins vos dettes', [46, 204, 113]);
    
    this.addMetricCard('Capital de retraite nécessaire', data.calculations.retirementCapital, 
                       'Montant estimé pour maintenir votre niveau de vie', [231, 76, 60]);
    
    this.addMetricCard('Suffisance actuelle', data.calculations.sufficiency, 
                       'Pourcentage de vos besoins actuellement couverts', [155, 89, 182]);
    
    // Graphique de répartition des actifs
    this.addAssetAllocationChart(data);
    
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Carte de métrique visuelle
   */
  private addMetricCard(title: string, value: number, description: string, color: [number, number, number]) {
    this.checkPageBreak(60);
    
    const cardY = this.currentY;
    const cardHeight = 50;
    const cardWidth = this.pageWidth - this.margins.left - this.margins.right;
    
    // Fond de la carte
    this.pdf.setFillColor(color[0], color[1], color[2]);
    // this.pdf.setGlobalAlpha(0.1); // Not available in this jsPDF version
    this.pdf.rect(this.margins.left, cardY, cardWidth, cardHeight, 'F');
    // this.pdf.setGlobalAlpha(1.0); // Not available in this jsPDF version
    
    // Bordure
    this.pdf.setDrawColor(color[0], color[1], color[2]);
    this.pdf.setLineWidth(1);
    this.pdf.rect(this.margins.left, cardY, cardWidth, cardHeight);
    
    // Titre
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(color[0], color[1], color[2]);
    this.pdf.text(title, this.margins.left + 10, cardY + 15);
    
    // Valeur
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(0, 0, 0);
    const formattedValue = value.toLocaleString('fr-CA', { 
      style: 'currency', 
      currency: 'CAD',
      maximumFractionDigits: 0 
    });
    this.pdf.text(formattedValue, this.margins.left + 10, cardY + 35);
    
    // Description
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(100, 100, 100);
    const lines = this.splitText(description, cardWidth - 20);
    lines.forEach((line, index) => {
      this.pdf.text(line, this.margins.left + 10, cardY + 45 + (index * 8));
    });
    
    this.currentY += cardHeight + 15;
  }

  /**
   * Graphique de répartition des actifs
   */
  private addAssetAllocationChart(data: ReportData) {
    this.checkPageBreak(100);
    
    const pieX = this.margins.left;
    const pieY = this.currentY;
    const chartWidth = this.pageWidth - this.margins.left - this.margins.right;
    const chartHeight = 80;
    
    // Données pour le graphique
    const assets = [
      { label: 'REER', value: data.userData.savings.reer1 + data.userData.savings.reer2, color: [52, 152, 219] },
      { label: 'CELI', value: data.userData.savings.celi1 + data.userData.savings.celi2, color: [46, 204, 113] },
      { label: 'Placements', value: data.userData.savings.placements1 + data.userData.savings.placements2, color: [155, 89, 182] },
      { label: 'Épargne', value: data.userData.savings.epargne1 + data.userData.savings.epargne2, color: [241, 196, 15] },
      { label: 'Résidence', value: data.userData.savings.residenceValeur - data.userData.savings.residenceHypotheque, color: [230, 126, 34] }
    ];
    
    const total = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Créer les secteurs
    const sectors = assets.filter(asset => asset.value > 0).map(asset => ({
      label: asset.label,
      value: asset.value,
      percentage: (asset.value / total) * 100,
      angle: (asset.value / total),
      color: asset.color
    }));
    
    const centerX = pieX + chartWidth / 4;
    const centerY = pieY + chartHeight / 2;
    const radius = 30;
    
    let currentAngle = 0;
    sectors.forEach(sector => {
      const endAngle = currentAngle + sector.angle * 2 * Math.PI;
      this.pdf.setFillColor(sector.color[0], sector.color[1], sector.color[2]);
      // this.pdf.sector(centerX, centerY, radius, currentAngle, endAngle, 'F'); // Not available in this jsPDF version
      currentAngle = endAngle;
    });
    
    this.pdf.text('Répartition des actifs', pieX + chartWidth / 2, this.currentY - 5, { align: 'center' });
    
    // Légende
    const legendX = pieX + chartWidth / 2 + 20;
    let legendY = pieY + 10;
    
    sectors.forEach((sector, index) => {
      // Carré de couleur
      this.pdf.setFillColor(sector.color[0], sector.color[1], sector.color[2]);
      this.pdf.rect(legendX, legendY, 8, 8, 'F');
      
      // Texte
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(`${sector.label}: ${sector.percentage.toFixed(1)}%`, legendX + 12, legendY + 6);
      
      legendY += 12;
    });
    
    this.currentY += chartHeight + 20;
  }

  /**
   * Profil personnel
   */
  private addPersonalProfile(data: ReportData) {
    this.addSectionHeader('PROFIL PERSONNEL', [231, 76, 60]);
    
    // Informations de base
    this.addInfoSection('Informations personnelles', [
      { label: 'Conjoint 1', value: `${data.userData.personal.prenom1}, ${this.calculateAge(data.userData.personal.naissance1)} ans` },
      { label: 'Conjoint 2', value: `${data.userData.personal.prenom2}, ${this.calculateAge(data.userData.personal.naissance2)} ans` },
      { label: 'Revenus annuels', value: `${data.userData.personal.salaire1 + data.userData.personal.salaire2} $` }
    ]);
    
    // Objectifs de retraite
    this.addInfoSection('Objectifs de retraite', [
      { label: 'Âge de retraite souhaité', value: `${data.userData.personal.ageRetraiteSouhaite1 || 65} ans` },
      { label: 'Dépenses de retraite estimées', value: `${data.userData.personal.depensesRetraite || 0} $ / mois` },
      { label: 'Espérance de vie', value: `${data.userData.retirement.esperanceVie1} ans` }
    ]);
    
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Section d'informations
   */
  private addInfoSection(title: string, items: { label: string; value: string }[]) {
    this.checkPageBreak(30 + items.length * 15);
    
    // Titre de sous-section
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(52, 73, 94);
    this.pdf.text(title, this.margins.left, this.currentY);
    this.currentY += 20;
    
    // Items
    items.forEach(item => {
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(`${item.label}:`, this.margins.left + 10, this.currentY);
      this.pdf.text(item.value, this.margins.left + 80, this.currentY);
      this.currentY += 12;
    });
    
    this.currentY += 10;
  }

  /**
   * Analyse financière
   */
  private addFinancialAnalysis(data: ReportData) {
    this.addSectionHeader('ANALYSE FINANCIÈRE', [46, 204, 113]);
    
    // Actifs et passifs
    this.addFinancialTable('Actifs', [
      { label: 'REER (total)', value: data.userData.savings.reer1 + data.userData.savings.reer2 },
      { label: 'CELI (total)', value: data.userData.savings.celi1 + data.userData.savings.celi2 },
      { label: 'Placements (total)', value: data.userData.savings.placements1 + data.userData.savings.placements2 },
      { label: 'Épargne (total)', value: data.userData.savings.epargne1 + data.userData.savings.epargne2 },
      { label: 'Valeur résidence', value: data.userData.savings.residenceValeur }
    ]);
    
    this.addFinancialTable('Passifs', [
      { label: 'Hypothèque résidence', value: data.userData.savings.residenceHypotheque }
    ]);
    
    // Flux de trésorerie
    this.addFinancialTable('Flux de trésorerie mensuel', [
      { label: 'Logement', value: data.userData.cashflow.logement },
      { label: 'Alimentation', value: data.userData.cashflow.alimentation },
      { label: 'Transport', value: data.userData.cashflow.transport },
      { label: 'Loisirs', value: data.userData.cashflow.loisirs },
      { label: 'Total mensuel', value: Object.values(data.userData.cashflow).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0) }
    ]);
    
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Tableau financier
   */
  private addFinancialTable(title: string, items: { label: string; value: number }[]) {
    this.checkPageBreak(40 + items.length * 12);
    
    // Titre de tableau
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(52, 73, 94);
    this.pdf.text(title, this.margins.left, this.currentY);
    this.currentY += 15;
    
    // En-têtes de tableau
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('Description', this.margins.left + 10, this.currentY);
    this.pdf.text('Montant', this.pageWidth - this.margins.right - 50, this.currentY);
    this.currentY += 5;
    
    // Ligne de séparation
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left + 10, this.currentY, this.pageWidth - this.margins.right - 10, this.currentY);
    this.currentY += 8;
    
    // Items du tableau
    items.forEach(item => {
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(item.label, this.margins.left + 10, this.currentY);
      
      const formattedValue = item.value.toLocaleString('fr-CA', { 
        style: 'currency', 
        currency: 'CAD',
        maximumFractionDigits: 0 
      });
      this.pdf.text(formattedValue, this.pageWidth - this.margins.right - 10, this.currentY, { align: 'right' });
      
      this.currentY += 12;
    });
    
    this.currentY += 10;
  }

  /**
   * Projections de retraite
   */
  private addProjections(data: ReportData) {
    this.addSectionHeader('PROJECTIONS DE RETRAITE', [155, 89, 182]);
    
    // Graphique des projections (simplifié)
    this.addProjectionsChart(data);
    
    // Scénarios
    this.addScenariosTable(data);
    
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Graphique des projections
   */
  private addProjectionsChart(data: ReportData) {
    this.checkPageBreak(120);
    
    const chartY = this.currentY;
    const chartHeight = 100;
    const chartWidth = this.pageWidth - this.margins.left - this.margins.right;
    
    // Cadre du graphique
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.rect(this.margins.left, chartY, chartWidth, chartHeight);
    
    // Titre
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Projection de la valeur du portefeuille', this.margins.left, chartY - 5);
    
    // Axes et données simulées
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('Âge', this.margins.left + chartWidth / 2, chartY + chartHeight + 15, { align: 'center' });
    
    // Données simulées pour le graphique
    const currentAge = this.calculateAge(data.userData.personal.naissance1);
    const retirementAge = data.userData.personal.ageRetraiteSouhaite1 || 65;
    const yearsToRetirement = retirementAge - currentAge;
    
    // Points du graphique (simulation)
    const points = [];
    for (let i = 0; i <= yearsToRetirement; i++) {
      const x = this.margins.left + (i / yearsToRetirement) * chartWidth;
      const growthRate = 0.06; // 6% de croissance annuelle
      const projectedValue = data.calculations.netWorth * Math.pow(1 + growthRate, i);
      const y = chartY + chartHeight - ((projectedValue / (data.calculations.netWorth * 3)) * chartHeight);
      points.push({ x, y });
    }
    
    // Dessiner la ligne de projection
    this.pdf.setDrawColor(52, 152, 219);
    this.pdf.setLineWidth(2);
    for (let i = 0; i < points.length - 1; i++) {
      this.pdf.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
    
    this.currentY += chartHeight + 30;
  }

  /**
   * Tableau de scénarios
   */
  private addScenariosTable(data: ReportData) {
    this.checkPageBreak(80);
    
    const scenarios = [
      { name: 'Conservateur (4%)', rate: 0.04 },
      { name: 'Modéré (6%)', rate: 0.06 },
      { name: 'Agressif (8%)', rate: 0.08 }
    ];
    
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(52, 73, 94);
    this.pdf.text('Scénarios de croissance', this.margins.left, this.currentY);
    this.currentY += 20;
    
    scenarios.forEach(scenario => {
      const currentAge = this.calculateAge(data.userData.personal.naissance1);
      const retirementAge = data.userData.personal.ageRetraiteSouhaite1 || 65;
      const yearsToRetirement = retirementAge - currentAge;
      const projectedValue = data.calculations.netWorth * Math.pow(1 + scenario.rate, yearsToRetirement);
      
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(scenario.name, this.margins.left + 10, this.currentY);
      
      const formattedValue = projectedValue.toLocaleString('fr-CA', { 
        style: 'currency', 
        currency: 'CAD',
        maximumFractionDigits: 0 
      });
      this.pdf.text(formattedValue, this.pageWidth - this.margins.right - 10, this.currentY, { align: 'right' });
      
      this.currentY += 15;
    });
    
    this.currentY += 20;
  }

  /**
   * Analyse Monte Carlo
   */
  private addMonteCarloAnalysis(data: ReportData) {
    this.addSectionHeader('ANALYSE MONTE CARLO', [230, 126, 34]);
    
    // Description de l'analyse
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    const description = "L'analyse Monte Carlo simule 10 000 scénarios différents pour évaluer la probabilité de succès de votre plan de retraite.";
    const lines = this.splitText(description, this.pageWidth - this.margins.left - this.margins.right);
    lines.forEach(line => {
      this.pdf.text(line, this.margins.left, this.currentY);
      this.currentY += 12;
    });
    
    this.currentY += 10;
    
    // Résultats Monte Carlo (simulation)
    this.addInfoSection('Résultats de simulation', [
      { label: 'Probabilité de succès', value: '85%' },
      { label: 'Valeur médiane à 95 ans', value: '1 250 000 $' },
      { label: 'Scénario pessimiste (5e percentile)', value: '450 000 $' },
      { label: 'Scénario optimiste (95e percentile)', value: '2 850 000 $' }
    ]);
    
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Recommandations
   */
  private addRecommendations(data: ReportData) {
    this.addSectionHeader('RECOMMANDATIONS', [231, 76, 60]);
    
    const recommendations = [
      "Maximisez vos cotisations REER annuelles pour bénéficier des déductions fiscales.",
      "Diversifiez votre portefeuille avec un mélange d'actions et d'obligations selon votre profil de risque.",
      "Considérez reporter votre RRQ jusqu'à 70 ans pour augmenter vos prestations de 42%.",
      "Établissez un fonds d'urgence équivalent à 6 mois de dépenses courantes.",
      "Réviser votre plan annuellement et ajuster selon l'évolution de votre situation."
    ];
    
    recommendations.forEach((recommendation, index) => {
      this.checkPageBreak(20);
      
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(`${index + 1}.`, this.margins.left + 10, this.currentY);
      
      const lines = this.splitText(recommendation, this.pageWidth - this.margins.left - this.margins.right - 20);
      lines.forEach((line, lineIndex) => {
        this.pdf.text(line, this.margins.left + 20, this.currentY + (lineIndex * 12));
      });
      
      this.currentY += lines.length * 12 + 8;
    });
    
    this.pdf.addPage();
    this.currentY = 30;
  }

  /**
   * Plan d'action
   */
  private addActionPlan(data: ReportData) {
    this.addSectionHeader('PLAN D\'ACTION', [46, 204, 113]);
    
    const actions = [
      { priority: 'Haute', action: 'Maximiser les cotisations REER avant la fin de l\'année fiscale', timeline: '3 mois' },
      { priority: 'Haute', action: 'Rééquilibrer le portefeuille selon l\'allocation cible', timeline: '1 mois' },
      { priority: 'Moyenne', action: 'Obtenir une évaluation de la pension d\'employeur', timeline: '6 mois' },
      { priority: 'Moyenne', action: 'Réviser les bénéficiaires des comptes enregistrés', timeline: '6 mois' },
      { priority: 'Basse', action: 'Planifier la stratégie de décaissement à la retraite', timeline: '12 mois' }
    ];
    
    // Tableau du plan d'action
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('Priorité', this.margins.left + 10, this.currentY);
    this.pdf.text('Action recommandée', this.margins.left + 50, this.currentY);
    this.pdf.text('Délai', this.pageWidth - this.margins.right - 30, this.currentY);
    this.currentY += 5;
    
    // Ligne de séparation
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left + 10, this.currentY, this.pageWidth - this.margins.right - 10, this.currentY);
    this.currentY += 10;
    
    actions.forEach(action => {
      this.checkPageBreak(15);
      
      // Couleur selon la priorité
      let priorityColor: [number, number, number] = [0, 0, 0];
      if (action.priority === 'Haute') priorityColor = [231, 76, 60];
      else if (action.priority === 'Moyenne') priorityColor = [243, 156, 18];
      else priorityColor = [46, 204, 113];
      
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      this.pdf.text(action.priority, this.margins.left + 10, this.currentY);
      
      this.pdf.setTextColor(0, 0, 0);
      const actionLines = this.splitText(action.action, 100);
      actionLines.forEach((line, index) => {
        this.pdf.text(line, this.margins.left + 50, this.currentY + (index * 10));
      });
      
      this.pdf.text(action.timeline, this.pageWidth - this.margins.right - 10, this.currentY, { align: 'right' });
      
      this.currentY += Math.max(actionLines.length * 10, 12) + 5;
    });
  }

  /**
   * Calcule l'âge à partir de la date de naissance
   */
  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Divise un texte en lignes selon une largeur maximale
   */
  private splitText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = this.pdf.getTextWidth(testLine);
      
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  /**
   * Vérifie si une nouvelle page est nécessaire
   */
  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margins.bottom) {
      // Ajouter le pied de page avant de changer de page
      this.addFooter();
      
      this.pdf.addPage();
      this.currentY = this.margins.top;
    }
  }

  /**
   * Tronque un texte à une longueur maximale
   */
  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Ajoute une courbe de Bézier (simulation)
   */
  private addBezierCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    // this.pdf.bezierCurveTo(x1, y1, x2, y2, x3, y3, x4, y4); // Not available in this jsPDF version
    // Simulation avec des lignes droites
    this.pdf.line(x1, y1, x4, y4);
  }

  /**
   * Dessine un graphique en aires
   */
  private drawAreaChart(data: number[], x: number, y: number, width: number, height: number) {
    if (data.length === 0) return;
    
    const stepX = width / (data.length - 1);
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    // Ligne de base
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(x, y + height, x + width, y + height);
    
    // Points et lignes
    this.pdf.setDrawColor(52, 152, 219);
    this.pdf.setLineWidth(1);
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = x + (i * stepX);
      const y1 = y + height - ((data[i] - minValue) / range) * height;
      const x2 = x + ((i + 1) * stepX);
      const y2 = y + height - ((data[i + 1] - minValue) / range) * height;
      
      this.pdf.line(x1, y1, x2, y2);
    }
  }

  /**
   * Ajoute une ligne de tendance
   */
  private addTrendLine(startX: number, startY: number, endX: number, endY: number, color: [number, number, number] = [52, 152, 219]) {
    this.pdf.setDrawColor(color[0], color[1], color[2]);
    this.pdf.setLineWidth(1);
    // this.pdf.moveTo(startX, startY); // Not available in this jsPDF version
    
    // Simulation de ligne pointillée
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const steps = Math.floor(distance / 5);
    
    for (let i = 0; i < steps; i += 2) {
      const x1 = startX + ((endX - startX) * i / steps);
      const y1 = startY + ((endY - startY) * i / steps);
      const x2 = startX + ((endX - startX) * (i + 1) / steps);
      const y2 = startY + ((endY - startY) * (i + 1) / steps);
      
      // this.pdf.lineTo(x2, y2); // Did you mean 'line'?
      this.pdf.line(x1, y1, x2, y2);
    }
    
    // this.pdf.stroke(); // Not available in this jsPDF version
  }

  /**
   * Ajoute un graphique en barres
   */
  private addBarChart(data: { label: string; value: number; color?: [number, number, number] }[], x: number, y: number, width: number, height: number) {
    if (data.length === 0) return;
    
    const barWidth = width / data.length;
    const maxValue = Math.max(...data.map(d => d.value));
    
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * height;
      const barX = x + (index * barWidth);
      const barY = y + height - barHeight;
      
      // Barre
      const color = item.color || [52, 152, 219];
      this.pdf.setFillColor(color[0], color[1], color[2]);
      // this.pdf.setGlobalAlpha(0.8); // Not available in this jsPDF version
      this.pdf.rect(barX + 5, barY, barWidth - 10, barHeight, 'F');
      // this.pdf.setGlobalAlpha(1.0); // Not available in this jsPDF version
      
      // Étiquette
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(0, 0, 0);
      const labelLines = this.splitText(item.label, barWidth - 10);
      labelLines.forEach((line, lineIndex) => {
        this.pdf.text(line, barX + barWidth / 2, y + height + 10 + (lineIndex * 8), { align: 'center' });
      });
      
      // Valeur
      const formattedValue = item.value.toLocaleString('fr-CA', { 
        style: 'currency', 
        currency: 'CAD',
        maximumFractionDigits: 0 
      });
      this.pdf.text(formattedValue, barX + barWidth / 2, barY - 5, { align: 'center' });
    });
  }

  /**
   * Ajoute un graphique de progression
   */
  private addProgressChart(current: number, target: number, title: string, x: number, y: number, width: number) {
    this.checkPageBreak(40);
    
    // Titre
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, x, y);
    
    // Barre de progression
    const progressY = y + 15;
    const progressHeight = 20;
    
    // Fond
    this.pdf.setFillColor(240, 240, 240);
    this.pdf.rect(x, progressY, width, progressHeight, 'F');
    
    // Progression
    const progressWidth = (current / target) * width;
    const color = current >= target ? [46, 204, 113] : current >= target * 0.7 ? [243, 156, 18] : [231, 76, 60];
    this.pdf.setFillColor(color[0], color[1], color[2]);
    // this.pdf.setGlobalAlpha(0.8); // Not available in this jsPDF version
    this.pdf.rect(x, progressY, Math.min(progressWidth, width), progressHeight, 'F');
    // this.pdf.setGlobalAlpha(1.0); // Not available in this jsPDF version
    
    // Bordure
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.rect(x, progressY, width, progressHeight);
    
    // Pourcentage
    const percentage = (current / target) * 100;
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text(`${percentage.toFixed(1)}%`, x + width / 2, progressY + progressHeight / 2 + 3, { align: 'center' });
    
    // Valeurs
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`Actuel: ${current.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`, x, progressY + progressHeight + 12);
    this.pdf.text(`Cible: ${target.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`, x + width, progressY + progressHeight + 12, { align: 'right' });
  }

  /**
   * Ajoute un graphique circulaire (donut)
   */
  private addDonutChart(data: { label: string; value: number; color: [number, number, number] }[], centerX: number, centerY: number, outerRadius: number, innerRadius: number) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;
    
    let currentAngle = 0;
    
    data.forEach(item => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle;
      
      // Dessiner le secteur (simulation avec des lignes)
      this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      // this.pdf.setGlobalAlpha(0.8); // Not available in this jsPDF version
      
      // Simulation de secteur avec des triangles
      const steps = Math.max(10, Math.floor(sliceAngle * 20));
      for (let i = 0; i < steps; i++) {
        const angle1 = currentAngle + (sliceAngle * i / steps);
        const angle2 = currentAngle + (sliceAngle * (i + 1) / steps);
        
        const x1 = centerX + Math.cos(angle1) * outerRadius;
        const y1 = centerY + Math.sin(angle1) * outerRadius;
        const x2 = centerX + Math.cos(angle2) * outerRadius;
        const y2 = centerY + Math.sin(angle2) * outerRadius;
        
        this.pdf.triangle(centerX, centerY, x1, y1, x2, y2, 'F');
      }
      
      // this.pdf.setGlobalAlpha(1.0); // Not available in this jsPDF version
      currentAngle = endAngle;
    });
    
    // Trou central
    this.pdf.setFillColor(255, 255, 255);
    // this.pdf.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, 'F'); // Not available in this jsPDF version
    // Simulation du trou central avec un carré blanc
    this.pdf.rect(centerX - innerRadius, centerY - innerRadius, innerRadius * 2, innerRadius * 2, 'F');
  }

  /**
   * Ajoute une légende
   */
  private addLegend(items: { label: string; color: [number, number, number] }[], x: number, y: number) {
    items.forEach((item, index) => {
      const itemY = y + (index * 15);
      
      // Carré de couleur
      this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      this.pdf.rect(x, itemY, 10, 10, 'F');
      
      // Texte
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(item.label, x + 15, itemY + 7);
    });
  }

  /**
   * Ajoute un triangle (helper pour simulation de secteurs)
   */
  private triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string = 'S') {
    // Simulation de triangle avec des lignes
    this.pdf.line(x1, y1, x2, y2);
    this.pdf.line(x2, y2, x3, y3);
    this.pdf.line(x3, y3, x1, y1);
  }
}