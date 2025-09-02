// Service commun pour l'export de rapports
// Centralise les fonctionnalités d'export en différents formats
// Respecte les exigences de sécurité (traitement 100 % local)

import { ReportMetadataService, StandardReportMetadata } from './ReportMetadataService';

export interface ExportOptions {
  format: 'markdown' | 'json' | 'html' | 'txt';
  includeMetadata: boolean;
  includeLogo: boolean;
  includeDisclaimers: boolean;
  includeSecuritySummary: boolean;
  fileName?: string;
  userName?: string;
}

export interface ExportResult {
  success: boolean;
  content?: string;
  fileName: string;
  mimeType: string;
  size: number;
  error?: string;
}

export class ReportExportService {
  private static readonly DEFAULT_OPTIONS: ExportOptions = {
    format: 'markdown',
    includeMetadata: true,
    includeLogo: true,
    includeDisclaimers: true,
    includeSecuritySummary: false,
    fileName: undefined,
    userName: undefined
  };

  /**
   * Exporte un rapport en format Markdown
   */
  static exportToMarkdown(
    reportContent: string,
    reportTitle: string,
    reportType: string = 'général',
    options: Partial<ExportOptions> = {}
  ): ExportResult {
    try {
      const opts = { ...this.DEFAULT_OPTIONS, ...options, format: 'markdown' as const };
      let content = '';

      // En-tête avec logo
      if (opts.includeLogo) {
        content += ReportMetadataService.generateReportHeader(
          reportType,
          reportTitle,
          undefined,
          opts.userName
        );
      }

      // Contenu principal du rapport
      content += reportContent;

      // Résumé de sécurité
      if (opts.includeSecuritySummary) {
        content += '\n\n' + ReportMetadataService.generateSecuritySummary();
      }

      // Clauses de non-responsabilité
      if (opts.includeDisclaimers) {
        content += '\n\n' + ReportMetadataService.addLegalDisclaimers(reportType, opts.userName);
      }

      // Pied de page
      if (opts.includeLogo) {
        content += '\n\n' + ReportMetadataService.generateStandardFooter();
      }

      const fileName = opts.fileName || this.generateFileName(reportTitle, 'md');

      return {
        success: true,
        content,
        fileName,
        mimeType: 'text/markdown',
        size: new Blob([content]).size
      };
    } catch (error) {
      return {
        success: false,
        fileName: 'error.md',
        mimeType: 'text/markdown',
        size: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Exporte un rapport en format JSON
   */
  static exportToJSON(
    reportData: any,
    reportTitle: string,
    reportType: string = 'général',
    options: Partial<ExportOptions> = {}
  ): ExportResult {
    try {
      const opts = { ...this.DEFAULT_OPTIONS, ...options, format: 'json' as const };
      
      const exportData = {
        metadata: opts.includeMetadata ? {
          ...ReportMetadataService.generateStandardMetadata('personal'),
          reportTitle,
          reportType,
          userName: opts.userName,
          exportedAt: new Date(),
          confidentialityWarning: 'Document confidentiel - Ne pas partager sans autorisation',
          dataSourceWarning: 'Données personnelles - Responsabilité du propriétaire'
        } : undefined,
        content: reportData,
        disclaimers: opts.includeDisclaimers ? {
          legalWarning: 'Les données ont été saisies par l\'utilisateur sans validation professionnelle',
          noResponsibility: 'MonPlanRetraite.ca se dégage de toute responsabilité',
          personalUseOnly: 'Usage personnel uniquement',
          consultProfessional: 'Consultez un professionnel qualifié'
        } : undefined,
        security: opts.includeSecuritySummary ? {
          localProcessing: true,
          noDataTransmission: true,
          aes256Encryption: true,
          auditCompliant: true
        } : undefined
      };

      const content = JSON.stringify(exportData, null, 2);
      const fileName = opts.fileName || this.generateFileName(reportTitle, 'json');

      return {
        success: true,
        content,
        fileName,
        mimeType: 'application/json',
        size: new Blob([content]).size
      };
    } catch (error) {
      return {
        success: false,
        fileName: 'error.json',
        mimeType: 'application/json',
        size: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Exporte un rapport en format HTML
   */
  static exportToHTML(
    reportContent: string,
    reportTitle: string,
    reportType: string = 'général',
    options: Partial<ExportOptions> = {}
  ): ExportResult {
    try {
      const opts = { ...this.DEFAULT_OPTIONS, ...options, format: 'html' as const };
      
      const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle} - MonPlanRetraite.ca</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 200px;
            margin-bottom: 10px;
        }
        .disclaimer {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .security-summary {
            background-color: #ecfdf5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            font-size: 0.9em;
            color: #6b7280;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f9fafb;
            font-weight: 600;
        }
        .metadata-table {
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    ${opts.includeLogo ? `
    <div class="header">
        <img src="/logo-planretraite.png" alt="MonPlanRetraite.ca" class="logo">
        <h1>${reportTitle}</h1>
        <p><strong>Type de rapport :</strong> ${reportType}</p>
        ${opts.userName ? `<p><strong>Préparé pour :</strong> ${opts.userName}</p>` : ''}
        <p><strong>Date de génération :</strong> ${new Date().toLocaleDateString('fr-CA')}</p>
    </div>
    ` : ''}
    
    <div class="content">
        ${this.markdownToHTML(reportContent)}
    </div>
    
    ${opts.includeSecuritySummary ? `
    <div class="security-summary">
        ${this.markdownToHTML(ReportMetadataService.generateSecuritySummary())}
    </div>
    ` : ''}
    
    ${opts.includeDisclaimers ? `
    <div class="disclaimer">
        ${this.markdownToHTML(ReportMetadataService.addLegalDisclaimers(reportType, opts.userName))}
    </div>
    ` : ''}
    
    ${opts.includeLogo ? `
    <div class="footer">
        <img src="/logo-planretraite.png" alt="MonPlanRetraite.ca" style="max-width: 150px;">
        <p><strong>MonPlanRetraite.ca</strong> - Planification financière sécurisée et confidentielle</p>
        <p><em>Généré le ${new Date().toLocaleDateString('fr-CA')} | Version 2.1.0 | Traitement 100% local</em></p>
        <p><strong>Confidentialité garantie :</strong> Vos données restent sur votre appareil et ne sont jamais transmises à nos serveurs.</p>
    </div>
    ` : ''}
</body>
</html>`;

      const fileName = opts.fileName || this.generateFileName(reportTitle, 'html');

      return {
        success: true,
        content: htmlContent,
        fileName,
        mimeType: 'text/html',
        size: new Blob([htmlContent]).size
      };
    } catch (error) {
      return {
        success: false,
        fileName: 'error.html',
        mimeType: 'text/html',
        size: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Exporte un rapport en format texte simple
   */
  static exportToText(
    reportContent: string,
    reportTitle: string,
    reportType: string = 'général',
    options: Partial<ExportOptions> = {}
  ): ExportResult {
    try {
      const opts = { ...this.DEFAULT_OPTIONS, ...options, format: 'txt' as const };
      let content = '';

      // En-tête
      if (opts.includeLogo) {
        content += `MONPLANRETRAITE.CA\n`;
        content += `Votre partenaire en planification financière\n`;
        content += `${'='.repeat(50)}\n\n`;
        content += `${reportTitle.toUpperCase()}\n\n`;
        content += `Type de rapport : ${reportType}\n`;
        if (opts.userName) content += `Préparé pour : ${opts.userName}\n`;
        content += `Date de génération : ${new Date().toLocaleDateString('fr-CA')}\n\n`;
        content += `${'='.repeat(50)}\n\n`;
      }

      // Contenu principal (conversion Markdown vers texte)
      content += this.markdownToText(reportContent);

      // Résumé de sécurité
      if (opts.includeSecuritySummary) {
        content += '\n\n' + this.markdownToText(ReportMetadataService.generateSecuritySummary());
      }

      // Clauses de non-responsabilité
      if (opts.includeDisclaimers) {
        content += '\n\n' + this.markdownToText(ReportMetadataService.addLegalDisclaimers(reportType, opts.userName));
      }

      // Pied de page
      if (opts.includeLogo) {
        content += '\n\n' + `${'='.repeat(50)}\n`;
        content += `MONPLANRETRAITE.CA - Planification financière sécurisée\n`;
        content += `Généré le ${new Date().toLocaleDateString('fr-CA')} | Version 2.1.0\n`;
        content += `Confidentialité garantie : Traitement 100 % local\n`;
      }

      const fileName = opts.fileName || this.generateFileName(reportTitle, 'txt');

      return {
        success: true,
        content,
        fileName,
        mimeType: 'text/plain',
        size: new Blob([content]).size
      };
    } catch (error) {
      return {
        success: false,
        fileName: 'error.txt',
        mimeType: 'text/plain',
        size: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Télécharge automatiquement le rapport exporté
   */
  static downloadReport(exportResult: ExportResult): boolean {
    if (!exportResult.success || !exportResult.content) {
      console.error('Impossible de télécharger le rapport:', exportResult.error);
      return false;
    }

    try {
      const blob = new Blob([exportResult.content], { type: exportResult.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = exportResult.fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL après un délai
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      return false;
    }
  }

  /**
   * Génère un nom de fichier sécurisé
   */
  private static generateFileName(title: string, extension: string): string {
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const timestamp = new Date().toISOString().split('T')[0];
    return `${sanitizedTitle}-${timestamp}.${extension}`;
  }

  /**
   * Conversion simple Markdown vers HTML
   */
  private static markdownToHTML(markdown: string): string {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gim, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/---/g, '<hr>');
  }

  /**
   * Conversion simple Markdown vers texte
   */
  private static markdownToText(markdown: string): string {
    return markdown
      .replace(/^### (.*$)/gim, '$1\n' + '-'.repeat(20))
      .replace(/^## (.*$)/gim, '$1\n' + '='.repeat(30))
      .replace(/^# (.*$)/gim, '$1\n' + '='.repeat(40))
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^- (.*$)/gim, '• $1')
      .replace(/---/g, '-'.repeat(50))
      .replace(/!\[.*?\]\(.*?\)/g, '[IMAGE]');
  }

  /**
   * Valide les options d'export
   */
  static validateExportOptions(options: Partial<ExportOptions>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation du format
    if (options.format && !['markdown', 'json', 'html', 'txt'].includes(options.format)) {
      errors.push('Format d\'export non supporté');
    }

    // Validation du nom de fichier
    if (options.fileName && options.fileName.length > 100) {
      warnings.push('Nom de fichier très long, il sera tronqué');
    }

    // Avertissements de sécurité
    if (options.includeDisclaimers === false) {
      warnings.push('Les clauses de non-responsabilité ne seront pas incluses');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Obtient les statistiques d'un export
   */
  static getExportStats(exportResult: ExportResult): {
    sizeKB: number;
    estimatedReadingTime: number;
    wordCount: number;
    lineCount: number;
  } {
    if (!exportResult.content) {
      return { sizeKB: 0, estimatedReadingTime: 0, wordCount: 0, lineCount: 0 };
    }

    const content = exportResult.content;
    const sizeKB = Math.round(exportResult.size / 1024 * 100) / 100;
    const wordCount = content.split(/\s+/).length;
    const lineCount = content.split('\n').length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // 200 mots par minute

    return {
      sizeKB,
      estimatedReadingTime,
      wordCount,
      lineCount
    };
  }
}
