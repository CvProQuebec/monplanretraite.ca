import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserData } from '@/types';
import { AllocationTotals } from '@/services/BudgetComputationService';
import { BudgetTargets, SinkingFund, DebtSnowballState } from '@/types/budget';

export interface PDFReportOptions {
  includeCharts?: boolean;
  includeComparisons?: boolean;
  includeCoupleAnalysis?: boolean;
  includeRecommendations?: boolean;
  language?: 'fr' | 'en';
  reportTitle?: string;
  authorName?: string;
}

export interface PDFSection {
  title: string;
  content: string[];
  charts?: string[];
  recommendations?: string[];
}

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210; // A4 width in mm
  private static readonly PAGE_HEIGHT = 297; // A4 height in mm
  private static readonly MARGIN = 20;
  private static readonly CONTENT_WIDTH = PDFExportService.PAGE_WIDTH - (2 * PDFExportService.MARGIN);

  /**
   * Generate comprehensive longevity report PDF
   */
  static async generateLongevityReport(
    userData: UserData,
    userLifeExpectancy: number,
    options: PDFReportOptions = {}
  ): Promise<Blob> {
    const {
      includeCharts = true,
      includeComparisons = true,
      includeCoupleAnalysis = true,
      includeRecommendations = true,
      language = 'fr',
      reportTitle,
      authorName
    } = options;

    const doc = new jsPDF();
    let currentY = this.MARGIN;

    // Title page
    currentY = this.addTitlePage(doc, userData, userLifeExpectancy, {
      title: reportTitle,
      author: authorName,
      language
    });

    // Executive Summary
    currentY = this.addExecutiveSummary(doc, userData, userLifeExpectancy, currentY, language);

    // Personal Analysis
    currentY = this.addPersonalAnalysis(doc, userData, userLifeExpectancy, currentY, language);

    // Charts and Visualizations (if enabled)
    if (includeCharts) {
      currentY = this.addChartsSection(doc, userData, currentY, language);
    }

    // Provincial Comparisons (if enabled)
    if (includeComparisons) {
      currentY = this.addComparisonsSection(doc, userData, userLifeExpectancy, currentY, language);
    }

    // Couple Analysis (if enabled and applicable)
    if (includeCoupleAnalysis && this.hasCoupleData(userData)) {
      currentY = this.addCoupleAnalysisSection(doc, userData, currentY, language);
    }

    // Recommendations (if enabled)
    if (includeRecommendations) {
      currentY = this.addRecommendationsSection(doc, userData, userLifeExpectancy, currentY, language);
    }

    // Footer
    this.addFooter(doc, language);

    return doc.output('blob');
  }

  /**
   * Add title page to PDF
   */
  private static addTitlePage(
    doc: jsPDF,
    userData: UserData,
    userLifeExpectancy: number,
    options: { title?: string; author?: string; language: 'fr' | 'en' }
  ): number {
    const { title, author, language } = options;
    const isFrench = language === 'fr';

    // Background
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');

    // Title
    doc.setFontSize(24);
    doc.setTextColor(31, 41, 55);
    const titleText = title || (isFrench ? 'Rapport d\'Analyse de Longévité' : 'Longevity Analysis Report');
    doc.text(titleText, this.PAGE_WIDTH / 2, 80, { align: 'center' });

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(107, 114, 128);
    const subtitleText = isFrench ? 'Analyse Personnalisée et Recommandations' : 'Personalized Analysis and Recommendations';
    doc.text(subtitleText, this.PAGE_WIDTH / 2, 100, { align: 'center' });

    // User info
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    const userInfo = this.getUserInfo(userData, isFrench);
    doc.text(userInfo, this.PAGE_WIDTH / 2, 130, { align: 'center' });

    // Life expectancy highlight
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    const lifeExpectancyText = `${userLifeExpectancy.toFixed(1)} ${isFrench ? 'ans d\'espérance de vie' : 'years life expectancy'}`;
    doc.text(lifeExpectancyText, this.PAGE_WIDTH / 2, 160, { align: 'center' });

    // Date and author
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const dateText = new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA');
    doc.text(`${isFrench ? 'Généré le' : 'Generated on'} ${dateText}`, this.PAGE_WIDTH / 2, 200, { align: 'center' });

    if (author) {
      doc.text(`${isFrench ? 'Par' : 'By'} ${author}`, this.PAGE_WIDTH / 2, 210, { align: 'center' });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    const footerText = isFrench ? 'Rapport confidentiel - À usage personnel uniquement' : 'Confidential Report - For personal use only';
    doc.text(footerText, this.PAGE_WIDTH / 2, 280, { align: 'center' });

    return this.MARGIN;
  }

  /**
   * Add executive summary section
   */
  private static addExecutiveSummary(
    doc: jsPDF,
    userData: UserData,
    userLifeExpectancy: number,
    startY: number,
    language: 'fr' | 'en'
  ): number {
    const isFrench = language === 'fr';

    // New page
    doc.addPage();
    let currentY = this.MARGIN;

    // Section title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Résumé Exécutif' : 'Executive Summary', this.MARGIN, currentY);
    currentY += 15;

    // Key metrics
    doc.setFontSize(12);
    const summaryPoints = this.generateExecutiveSummary(userData, userLifeExpectancy, isFrench);

    summaryPoints.forEach(point => {
      if (currentY > this.PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = this.MARGIN;
      }

      doc.setTextColor(75, 85, 99);
      const lines = doc.splitTextToSize(point, this.CONTENT_WIDTH);
      doc.text(lines, this.MARGIN, currentY);
      currentY += lines.length * 5 + 5;
    });

    return currentY + 10;
  }

  /**
   * Add personal analysis section
   */
  private static addPersonalAnalysis(
    doc: jsPDF,
    userData: UserData,
    userLifeExpectancy: number,
    startY: number,
    language: 'fr' | 'en'
  ): number {
    const isFrench = language === 'fr';

    // New page
    doc.addPage();
    let currentY = this.MARGIN;

    // Section title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Analyse Personnelle' : 'Personal Analysis', this.MARGIN, currentY);
    currentY += 15;

    // Personal details
    doc.setFontSize(12);
    const personalAnalysis = this.generatePersonalAnalysis(userData, userLifeExpectancy, isFrench);

    personalAnalysis.forEach(section => {
      if (currentY > this.PAGE_HEIGHT - 50) {
        doc.addPage();
        currentY = this.MARGIN;
      }

      // Subsection title
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.text(section.title, this.MARGIN, currentY);
      currentY += 10;

      // Content
      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99);
      section.content.forEach(point => {
        const lines = doc.splitTextToSize(point, this.CONTENT_WIDTH);
        doc.text(lines, this.MARGIN + 5, currentY);
        currentY += lines.length * 5 + 3;
      });

      currentY += 5;
    });

    return currentY + 10;
  }

  /**
   * Add charts section (placeholder for chart images)
   */
  private static addChartsSection(
    doc: jsPDF,
    userData: UserData,
    startY: number,
    language: 'fr' | 'en'
  ): number {
    const isFrench = language === 'fr';

    doc.addPage();
    let currentY = this.MARGIN;

    // Section title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Visualisations et Graphiques' : 'Charts and Visualizations', this.MARGIN, currentY);
    currentY += 15;

    // Placeholder for charts
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    const chartNote = isFrench
      ? 'Les graphiques interactifs sont disponibles dans la version web de l\'application.'
      : 'Interactive charts are available in the web version of the application.';
    const lines = doc.splitTextToSize(chartNote, this.CONTENT_WIDTH);
    doc.text(lines, this.MARGIN, currentY);
    currentY += lines.length * 5 + 10;

    return currentY;
  }

  /**
   * Add comparisons section
   */
  private static addComparisonsSection(
    doc: jsPDF,
    userData: UserData,
    userLifeExpectancy: number,
    startY: number,
    language: 'fr' | 'en'
  ): number {
    const isFrench = language === 'fr';

    doc.addPage();
    let currentY = this.MARGIN;

    // Section title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Comparaisons Provinciales' : 'Provincial Comparisons', this.MARGIN, currentY);
    currentY += 15;

    // Comparison data
    const comparisonData = this.generateComparisonData(userData, userLifeExpectancy, isFrench);

    doc.setFontSize(12);
    comparisonData.forEach(item => {
      if (currentY > this.PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = this.MARGIN;
      }

      doc.setTextColor(75, 85, 99);
      const lines = doc.splitTextToSize(item, this.CONTENT_WIDTH);
      doc.text(lines, this.MARGIN, currentY);
      currentY += lines.length * 5 + 5;
    });

    return currentY + 10;
  }

  /**
   * Add couple analysis section
   */
  private static addCoupleAnalysisSection(
    doc: jsPDF,
    userData: UserData,
    startY: number,
    language: 'fr' | 'en'
  ): number {
    const isFrench = language === 'fr';

    doc.addPage();
    let currentY = this.MARGIN;

    // Section title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Analyse de Couple' : 'Couple Analysis', this.MARGIN, currentY);
    currentY += 15;

    // Couple analysis data
    const coupleData = this.generateCoupleAnalysisData(userData, isFrench);

    doc.setFontSize(12);
    coupleData.forEach(item => {
      if (currentY > this.PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = this.MARGIN;
      }

      doc.setTextColor(75, 85, 99);
      const lines = doc.splitTextToSize(item, this.CONTENT_WIDTH);
      doc.text(lines, this.MARGIN, currentY);
      currentY += lines.length * 5 + 5;
    });

    return currentY + 10;
  }

  /**
   * Add recommendations section
   */
  private static addRecommendationsSection(
    doc: jsPDF,
    userData: UserData,
    userLifeExpectancy: number,
    startY: number,
    language: 'fr' | 'en'
  ): number {
    const isFrench = language === 'fr';

    doc.addPage();
    let currentY = this.MARGIN;

    // Section title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Recommandations' : 'Recommendations', this.MARGIN, currentY);
    currentY += 15;

    // Recommendations
    const recommendations = this.generateRecommendations(userData, userLifeExpectancy, isFrench);

    doc.setFontSize(12);
    recommendations.forEach((rec, index) => {
      if (currentY > this.PAGE_HEIGHT - 40) {
        doc.addPage();
        currentY = this.MARGIN;
      }

      // Recommendation number
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(`${index + 1}.`, this.MARGIN, currentY);
      currentY += 8;

      // Recommendation text
      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99);
      const lines = doc.splitTextToSize(rec, this.CONTENT_WIDTH - 10);
      doc.text(lines, this.MARGIN + 8, currentY);
      currentY += lines.length * 5 + 8;
    });

    return currentY + 10;
  }

  /**
   * Add footer to all pages
   */
  private static addFooter(doc: jsPDF, language: 'fr' | 'en'): void {
    const isFrench = language === 'fr';
    const pageCount = (doc as any).getNumberOfPages?.() ?? 1;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(229, 231, 235);
      doc.line(this.MARGIN, this.PAGE_HEIGHT - 15, this.PAGE_WIDTH - this.MARGIN, this.PAGE_HEIGHT - 15);

      // Page number
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      const pageText = `${isFrench ? 'Page' : 'Page'} ${i} ${isFrench ? 'de' : 'of'} ${pageCount}`;
      doc.text(pageText, this.PAGE_WIDTH / 2, this.PAGE_HEIGHT - 8, { align: 'center' });
    }
  }

  /**
   * Helper methods for data generation
   */
  private static getUserInfo(userData: UserData, isFrench: boolean): string {
    const personal = userData.personal;
    const age = personal?.naissance1 ? new Date().getFullYear() - new Date(personal.naissance1).getFullYear() : 65;
    const gender = personal?.sexe1 === 'F' ? (isFrench ? 'Femme' : 'Female') : (isFrench ? 'Homme' : 'Male');
    const province = personal?.province || 'QC';

    return `${age} ${isFrench ? 'ans' : 'years old'}, ${gender}, ${province}`;
  }

  private static generateExecutiveSummary(
    userData: UserData,
    userLifeExpectancy: number,
    isFrench: boolean
  ): string[] {
    const summary = [];

    if (isFrench) {
      summary.push(`Votre espérance de vie estimée est de ${userLifeExpectancy.toFixed(1)} ans.`);
      summary.push('Cette analyse est basée sur vos données personnelles, votre état de santé, et vos habitudes de vie.');
      summary.push('Les résultats tiennent compte des dernières données démographiques canadiennes (CPM2014).');
      summary.push('Cette évaluation vous aidera à planifier votre retraite et vos besoins financiers futurs.');
    } else {
      summary.push(`Your estimated life expectancy is ${userLifeExpectancy.toFixed(1)} years.`);
      summary.push('This analysis is based on your personal data, health status, and lifestyle habits.');
      summary.push('Results account for the latest Canadian demographic data (CPM2014).');
      summary.push('This assessment will help you plan your retirement and future financial needs.');
    }

    return summary;
  }

  private static generatePersonalAnalysis(
    userData: UserData,
    userLifeExpectancy: number,
    isFrench: boolean
  ): Array<{ title: string; content: string[] }> {
    const personal: any = (userData as any).personal || {};
    const sections = [];

    // Health factors
    const healthFactors = {
      title: isFrench ? 'Facteurs de Santé' : 'Health Factors',
      content: []
    };

    if (personal.etatSante1) {
      healthFactors.content.push(
        isFrench
          ? `État de santé: ${personal.etatSante1}`
          : `Health status: ${personal.etatSante1}`
      );
    }

    if (personal.modeVieActif1) {
      healthFactors.content.push(
        isFrench
          ? `Mode de vie actif: ${personal.modeVieActif1}`
          : `Active lifestyle: ${personal.modeVieActif1}`
      );
    }

    sections.push(healthFactors);

    // Socioeconomic factors
    const socioeconomicFactors = {
      title: isFrench ? 'Facteurs Socioéconomiques' : 'Socioeconomic Factors',
      content: []
    };

    if (personal.niveauCompetences1) {
      socioeconomicFactors.content.push(
        isFrench
          ? `Niveau de compétences: ${personal.niveauCompetences1}`
          : `Education level: ${personal.niveauCompetences1}`
      );
    }

    sections.push(socioeconomicFactors);

    return sections;
  }

  private static generateComparisonData(
    userData: UserData,
    userLifeExpectancy: number,
    isFrench: boolean
  ): string[] {
    const comparisons = [];

    if (isFrench) {
      comparisons.push(`Votre espérance de vie de ${userLifeExpectancy.toFixed(1)} ans est comparée aux moyennes provinciales.`);
      comparisons.push('Cette comparaison vous situe par rapport à la population de votre province.');
      comparisons.push('Les données provinciales tiennent compte des facteurs locaux de santé et de mortalité.');
    } else {
      comparisons.push(`Your life expectancy of ${userLifeExpectancy.toFixed(1)} years is compared to provincial averages.`);
      comparisons.push('This comparison positions you relative to your province\'s population.');
      comparisons.push('Provincial data accounts for local health and mortality factors.');
    }

    return comparisons;
  }

  private static generateCoupleAnalysisData(userData: UserData, isFrench: boolean): string[] {
    const coupleData = [];

    if (isFrench) {
      coupleData.push('L\'analyse de couple évalue les probabilités de survie conjointe.');
      coupleData.push('Elle aide à planifier les besoins financiers en cas de survie d\'un conjoint.');
      coupleData.push('Les calculs tiennent compte des différences d\'espérance de vie entre conjoints.');
    } else {
      coupleData.push('Couple analysis evaluates joint survival probabilities.');
      coupleData.push('It helps plan financial needs in case of spousal survival.');
      coupleData.push('Calculations account for life expectancy differences between spouses.');
    }

    return coupleData;
  }

  private static generateRecommendations(
    userData: UserData,
    userLifeExpectancy: number,
    isFrench: boolean
  ): string[] {
    const recommendations = [];

    if (isFrench) {
      recommendations.push('Consultez régulièrement votre médecin pour des bilans de santé préventifs.');
      recommendations.push('Maintenez un mode de vie actif et équilibré.');
      recommendations.push('Planifiez votre retraite financière en tenant compte de votre espérance de vie.');
      recommendations.push('Envisagez des assurances adaptées à vos besoins spécifiques.');
      recommendations.push('Préparez un plan successoral complet.');
    } else {
      recommendations.push('Consult your physician regularly for preventive health check-ups.');
      recommendations.push('Maintain an active and balanced lifestyle.');
      recommendations.push('Plan your financial retirement considering your life expectancy.');
      recommendations.push('Consider insurance policies adapted to your specific needs.');
      recommendations.push('Prepare a comprehensive estate plan.');
    }

    return recommendations;
  }

  private static hasCoupleData(userData: UserData): boolean {
    const personal: any = (userData as any).personal || {};
    return !!(personal.sexe2 && personal.naissance2);
  }

  /**
   * Export chart as image for PDF inclusion
   */
  static async exportChartAsImage(chartElement: HTMLElement): Promise<string> {
    try {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error exporting chart as image:', error);
      return '';
    }
  }

  // ===== Budget Report (Personal Budget) =====
  static async generateBudgetReport(
    language: 'fr' | 'en',
    params: {
      netMonthlyIncome: number;
      allocations: AllocationTotals;
      targets: BudgetTargets;
      emergencyMonthsTarget?: number;
      emergencySaved?: number;
      sinkingFunds?: SinkingFund[];
      debt?: DebtSnowballState;
      reportTitle?: string;
      authorName?: string;
    }
  ): Promise<Blob> {
    const isFrench = language === 'fr';
    const {
      netMonthlyIncome,
      allocations,
      targets,
      emergencyMonthsTarget = 0,
      emergencySaved = 0,
      sinkingFunds = [],
      debt,
      reportTitle,
      authorName
    } = params;

    const doc = new jsPDF();

    // Title page (reuse style)
    let currentY = this.addTitleLikePage(doc, {
      title: reportTitle || (isFrench ? 'Budget personnel' : 'Personal Budget'),
      subtitle: isFrench ? 'Résumé financier et objectifs' : 'Financial summary and goals',
      info: isFrench
        ? `Revenu net mensuel: ${netMonthlyIncome.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`
        : `Net monthly income: ${netMonthlyIncome.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}`,
      author: authorName,
      language
    });

    // Page — 50/30/20
    doc.addPage();
    currentY = this.MARGIN;
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Règle 50/30/20' : '50/30/20 Rule', this.MARGIN, currentY);
    currentY += 10;

    const lines_503020 = [
      isFrench ? `Cibles: Besoins ${targets.needsPct} %, Envies ${targets.wantsPct} %, Épargne/Dettes ${targets.savingsDebtPct} %`
               : `Targets: Needs ${targets.needsPct}%, Wants ${targets.wantsPct}%, Savings/Debt ${targets.savingsDebtPct}%`,
      isFrench ? `Réalisé: Besoins ${allocations.pctNeeds.toFixed(1)} %, Envies ${allocations.pctWants.toFixed(1)} %, Épargne/Dettes ${allocations.pctSavingsDebt.toFixed(1)} %`
               : `Actual: Needs ${allocations.pctNeeds.toFixed(1)}%, Wants ${allocations.pctWants.toFixed(1)}%, Savings/Debt ${allocations.pctSavingsDebt.toFixed(1)}%`,
      isFrench ? `Montants mensuels: Besoins ${allocations.totalNeeds.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}, Envies ${allocations.totalWants.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}, Épargne/Dettes ${allocations.totalSavingsDebt.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`
               : `Monthly amounts: Needs ${allocations.totalNeeds.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}, Wants ${allocations.totalWants.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}, Savings/Debt ${allocations.totalSavingsDebt.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}`
    ];
    currentY = this.writeBulletPoints(doc, lines_503020, currentY);

    // Page — Emergency Fund
    doc.addPage();
    currentY = this.MARGIN;
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Fonds d’urgence' : 'Emergency Fund', this.MARGIN, currentY);
    currentY += 10;

    const monthlyNeeds = Math.max(0, allocations.totalNeeds);
    const monthsSaved = monthlyNeeds > 0 ? emergencySaved / monthlyNeeds : 0;
    const efLines = [
      isFrench
        ? `Cible: ${emergencyMonthsTarget} mois de besoins essentiels`
        : `Target: ${emergencyMonthsTarget} months of essential needs`,
      isFrench
        ? `Montant épargné: ${emergencySaved.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} (${monthsSaved.toFixed(1)} mois)`
        : `Amount saved: ${emergencySaved.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} (${monthsSaved.toFixed(1)} months)`,
      isFrench
        ? `Besoins essentiels mensuels estimés: ${monthlyNeeds.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`
        : `Estimated essential needs (monthly): ${monthlyNeeds.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}`
    ];
    currentY = this.writeBulletPoints(doc, efLines, currentY);

    // Page — Sinking Funds
    doc.addPage();
    currentY = this.MARGIN;
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Objectifs planifiés' : 'Planned goals', this.MARGIN, currentY);
    currentY += 10;

    if (sinkingFunds.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.text(isFrench ? 'Aucun objectif enregistré.' : 'No goals recorded.', this.MARGIN, currentY);
      currentY += 8;
    } else {
      doc.setFontSize(12);
      doc.setTextColor(75, 85, 99);
      for (const f of sinkingFunds) {
        const line = isFrench
          ? `• ${f.name}: cible ${f.goalAmount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}, échéance ${f.dueDate}, mensualité requise ~ ${Math.max(0, f.monthlyRequired || 0).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}, épargné ${Math.max(0, f.saved || 0).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`
          : `• ${f.name}: target ${f.goalAmount.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}, due ${f.dueDate}, required monthly ~ ${Math.max(0, f.monthlyRequired || 0).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}, saved ${Math.max(0, f.saved || 0).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}`;
        const lines = doc.splitTextToSize(line, this.CONTENT_WIDTH);
        if (currentY > this.PAGE_HEIGHT - 20) { doc.addPage(); currentY = this.MARGIN; }
        doc.text(lines, this.MARGIN, currentY);
        currentY += lines.length * 5 + 3;
      }
    }

    // Page — Debts (Snowball)
    doc.addPage();
    currentY = this.MARGIN;
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(isFrench ? 'Dettes — stratégie “boule de neige”' : 'Debts — snowball strategy', this.MARGIN, currentY);
    currentY += 10;

    const debtLines: string[] = [];
    const debtCount = debt?.debts?.length || 0;
    debtLines.push(
      isFrench ? `Nombre de dettes: ${debtCount}` : `Debts count: ${debtCount}`
    );
    debtLines.push(
      isFrench
        ? `Méthode: ${debt?.method === 'rate' ? 'par plus haut taux' : 'par plus petit solde'}`
        : `Method: ${debt?.method === 'rate' ? 'highest rate' : 'lowest balance'}`
    );
    debtLines.push(
      isFrench
        ? `Montant additionnel mensuel: ${(debt?.extraPerMonth || 0).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`
        : `Extra per month: ${(debt?.extraPerMonth || 0).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}`
    );
    currentY = this.writeBulletPoints(doc, debtLines, currentY);

    // Footer
    this.addFooter(doc, language);
    return doc.output('blob');
  }

  // Helper: title-like page
  private static addTitleLikePage(
    doc: jsPDF,
    opts: { title: string; subtitle: string; info: string; author?: string; language: 'fr' | 'en' }
  ): number {
    const { title, subtitle, info, author, language } = opts;
    // Background
    doc.setFillColor(245, 247, 255);
    doc.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');

    // Title
    doc.setFontSize(24);
    doc.setTextColor(31, 41, 55);
    doc.text(title, this.PAGE_WIDTH / 2, 80, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(107, 114, 128);
    doc.text(subtitle, this.PAGE_WIDTH / 2, 95, { align: 'center' });

    // Info
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    doc.text(info, this.PAGE_WIDTH / 2, 115, { align: 'center' });

    // Author/date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const dateText = new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA');
    doc.text(`${language === 'fr' ? 'Généré le' : 'Generated on'} ${dateText}`, this.PAGE_WIDTH / 2, 135, { align: 'center' });
    if (author) {
      doc.text(`${language === 'fr' ? 'Par' : 'By'} ${author}`, this.PAGE_WIDTH / 2, 145, { align: 'center' });
    }

    return this.MARGIN;
  }

  // Helper: bullet list
  private static writeBulletPoints(doc: jsPDF, points: string[], startY: number): number {
    let y = startY;
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    for (const p of points) {
      if (y > this.PAGE_HEIGHT - 20) {
        doc.addPage();
        y = this.MARGIN;
      }
      const text = `• ${p}`;
      const lines = doc.splitTextToSize(text, this.CONTENT_WIDTH);
      doc.text(lines, this.MARGIN, y);
      y += lines.length * 5 + 3;
    }
    return y + 4;
  }

  /**
   * Generate quick summary PDF
   */
  static async generateQuickSummary(
    userData: UserData,
    userLifeExpectancy: number,
    language: 'fr' | 'en' = 'fr'
  ): Promise<Blob> {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(31, 41, 55);
    const title = language === 'fr' ? 'Résumé de Longévité' : 'Longevity Summary';
    doc.text(title, this.PAGE_WIDTH / 2, 30, { align: 'center' });

    // Key metrics
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    const lifeExpectancyText = `${userLifeExpectancy.toFixed(1)} ${language === 'fr' ? 'ans' : 'years'}`;
    doc.text(lifeExpectancyText, this.PAGE_WIDTH / 2, 60, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const dateText = new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA');
    doc.text(dateText, this.PAGE_WIDTH / 2, 80, { align: 'center' });

    return doc.output('blob');
  }
}
