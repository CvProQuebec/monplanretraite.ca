import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserData } from '@/types';

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
    const pageCount = doc.getNumberOfPages();

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
    const personal = userData.personal || {};
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
    const personal = userData.personal || {};
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
