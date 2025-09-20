import jsPDF from 'jspdf';
import type { RobustnessReport } from './RobustnessService';

export interface TaxOptimizationPDFData {
  language: 'fr' | 'en';
  clientName?: string;
  horizonYears: number;
  targetNetAnnual: number;

  // Totals (30y or horizon window)
  greedy?: { totalTax: number; robust?: RobustnessReport };
  dp?: { totalTax: number; robust?: RobustnessReport; score?: number };
  baseline?: { totalTax: number; robust?: RobustnessReport };

  // Optional analytics (included if present)
  mc?: {
    successProb: number;   // 0..1
    p5: number;
    p50: number;
    p95: number;
    maxDrawdown: number;   // CAD
    iterations?: number;
    horizonYears?: number;
  };
  stress?: {
    sequence: number;   // 0..100 score
    inflation: number;  // 0..100 score
    longevity: number;  // 0..100 score
  };
}

function cad(v: number, lang: 'fr' | 'en') {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(v);
}

export class TaxOptimizationPDFService {
  static async generateSummary(data: TaxOptimizationPDFData): Promise<Blob> {
    const lang = data.language;
    const fr = lang === 'fr';
    const doc = new jsPDF({ unit: 'mm', format: 'letter' });

    // Title page
    doc.setFillColor(245, 247, 255);
    doc.rect(0, 0, 215.9, 279.4, 'F');

    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55);
    doc.text(fr ? 'Optimisation fiscale — Résumé' : 'Tax Optimization — Summary', 108, 50, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    const subtitle = fr
      ? `Client: ${data.clientName || '—'}   |   Horizon: ${data.horizonYears} ans   |   Besoin net annuel: ${cad(data.targetNetAnnual, lang)}`
      : `Client: ${data.clientName || '—'}   |   Horizon: ${data.horizonYears} years   |   Net annual need: ${cad(data.targetNetAnnual, lang)}`;
    doc.text(subtitle, 108, 64, { align: 'center' });

    // Section: Totals
    let y = 88;
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text(fr ? 'Impôts totaux (horizon)' : 'Total taxes (horizon)', 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);

    if (data.greedy) {
      doc.text(`• ${fr ? 'Greedy' : 'Greedy'}: ${cad(data.greedy.totalTax, lang)}`, 24, y);
      y += 6;
    }
    if (data.dp) {
      const scoreText = data.dp.score != null ? `  —  ${fr ? 'Score plan' : 'Plan score'}: ${Math.round(data.dp.score)}` : '';
      doc.text(`• DP/Beam: ${cad(data.dp.totalTax, lang)}${scoreText}`, 24, y);
      y += 6;
    }
    if (data.baseline) {
      doc.text(`• ${fr ? 'RRSP seulement' : 'RRSP only'}: ${cad(data.baseline.totalTax, lang)}`, 24, y);
      y += 8;
    }

    // Section: Robustness
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text(fr ? 'Robustesse (scénarios chocs)' : 'Robustness (shock scenarios)', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);

    const addRobust = (label: string, rob?: RobustnessReport) => {
      if (!rob) return;
      const line = `• ${label}: ${fr ? 'Score' : 'Score'} ${rob.robustScore} — seq:${rob.sequence.shortfallYears} inf:${rob.inflation.shortfallYears} lon:${rob.longevity.shortfallYears}`;
      const lines = doc.splitTextToSize(line, 175);
      doc.text(lines, 24, y);
      y += lines.length * 5 + 2;
    };

    addRobust('Greedy', data.greedy?.robust);
    addRobust('DP/Beam', data.dp?.robust);
    addRobust(fr ? 'RRSP seulement' : 'RRSP only', data.baseline?.robust);

    y += 6;

    // Section: Explanations (from best robust plan available)
    const candidates = [
      { name: 'DP/Beam', r: data.dp?.robust },
      { name: 'Greedy', r: data.greedy?.robust },
      { name: fr ? 'RRSP seulement' : 'RRSP only', r: data.baseline?.robust },
    ].filter(x => x.r) as Array<{ name: string; r: RobustnessReport }>;

    if (candidates.length > 0) {
      candidates.sort((a, b) => (a.r.robustScore - b.r.robustScore));
      const best = candidates[0];

      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text(fr ? `Explications (plan le plus robuste: ${best.name})` : `Explanations (most robust plan: ${best.name})`, 20, y);
      y += 10;

      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99);
      best.r.explanations.forEach(ex => {
        if (y > 270) { doc.addPage(); y = 20; }
        const bullets = doc.splitTextToSize('• ' + ex, 175);
        doc.text(bullets, 24, y);
        y += bullets.length * 5 + 2;
      });
    }

    // Optional: Monte Carlo section
    if (data.mc) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text(fr ? 'Monte Carlo (aperçu)' : 'Monte Carlo (overview)', 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(55, 65, 81);
      const successTxt = fr ? 'Prob. succès' : 'Success prob';
      const p5Txt = 'P5';
      const p50Txt = 'P50';
      const p95Txt = 'P95';
      const ddTxt = fr ? 'Drawdown max' : 'Max drawdown';
      const iterTxt = data.mc.iterations ? ` — ${data.mc.iterations} itérations` : '';
      const horizTxt = data.mc.horizonYears ? ` — ${fr ? 'Horizon' : 'Horizon'}: ${data.mc.horizonYears} ${fr ? 'ans' : 'years'}` : '';
      const line = `• ${successTxt}: ${(Math.round(data.mc.successProb * 100))}%  |  ${p5Txt}: ${cad(data.mc.p5, lang)}  |  ${p50Txt}: ${cad(data.mc.p50, lang)}  |  ${p95Txt}: ${cad(data.mc.p95, lang)}  |  ${ddTxt}: ${cad(data.mc.maxDrawdown, lang)}${iterTxt}${horizTxt}`;
      const lines = doc.splitTextToSize(line, 175);
      doc.text(lines, 24, y);
      y += lines.length * 5 + 4;
    }

    // Optional: Stress Test section
    if (data.stress) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.text(fr ? 'Stress tests (scores)' : 'Stress tests (scores)', 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(55, 65, 81);
      const seqTxt = fr ? 'Séquence' : 'Sequence';
      const infTxt = fr ? 'Inflation' : 'Inflation';
      const lonTxt = fr ? 'Longévité' : 'Longevity';
      const line = `• ${seqTxt}: ${data.stress.sequence}/100   |   ${infTxt}: ${data.stress.inflation}/100   |   ${lonTxt}: ${data.stress.longevity}/100`;
      const lines = doc.splitTextToSize(line, 175);
      doc.text(lines, 24, y);
      y += lines.length * 5 + 4;
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    const dateText = new Date().toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA');
    doc.text(`${fr ? 'Généré le' : 'Generated on'} ${dateText} — MonPlanRetraite.ca`, 108, 272, { align: 'center' });

    return doc.output('blob');
  }
}
