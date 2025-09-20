import jsPDF from 'jspdf';
import { EmergencyData } from '@/components/emergency-planning/types';

export type EmergencyAudience = 'trusted' | 'notary' | 'planner' | 'liquidator';

export interface EmergencyPdfOptions {
  language?: 'fr' | 'en';
  authorName?: string;
  showFullSensitive?: boolean; // par défaut false (redaction)
}

/**
 * Utilitaire basique de redaction: conserve les 4 derniers caractères.
 */
function redact(value: string, showFull: boolean, keepLast: number = 4): string {
  if (showFull) return value;
  if (!value) return '';
  const visible = value.slice(-keepLast);
  return '•••• ' + visible;
}

/**
 * Formate une ligne en puces, retour à la ligne si dépasse largeur.
 */
function writeBullet(doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number {
  const lines = doc.splitTextToSize(`• ${text}`, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * 5 + 2;
}

export async function generateEmergencyPDF(
  data: EmergencyData,
  audience: EmergencyAudience,
  opts: EmergencyPdfOptions = {}
): Promise<Blob> {
  const language: 'fr' | 'en' = opts.language || 'fr';
  const isFr = language === 'fr';
  const showFull = !!opts.showFullSensitive;

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });

  // Dimensions
  const PAGE_WIDTH = 215.9;
  const PAGE_HEIGHT = 279.4;
  const MARGIN = 20;
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

  // Page de garde
  doc.setFillColor(245, 247, 255);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  doc.setFontSize(22);
  doc.setTextColor(31, 41, 55);
  const titles: Record<EmergencyAudience, string> = {
    trusted: isFr ? 'Dossier urgence — Personne de confiance' : 'Emergency dossier — Trusted person',
    notary: isFr ? 'Dossier urgence — Notaire' : 'Emergency dossier — Notary',
    planner: isFr ? 'Dossier urgence — Planificateur' : 'Emergency dossier — Planner',
    liquidator: isFr ? 'Dossier urgence — Liquidateur' : 'Emergency dossier — Liquidator',
  };
  doc.text(titles[audience], PAGE_WIDTH / 2, 80, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128);
  const subtitle = isFr
    ? 'Informations essentielles en cas d’urgence — document confidentiel'
    : 'Essential information in case of emergency — confidential document';
  doc.text(subtitle, PAGE_WIDTH / 2, 95, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  const info = `${isFr ? 'Nom' : 'Name'}: ${data.prenom || ''} ${data.nom || ''}`;
  doc.text(info, PAGE_WIDTH / 2, 112, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  const dateText = new Date().toLocaleDateString(isFr ? 'fr-CA' : 'en-CA');
  const author = opts.authorName ? ` • ${isFr ? 'Par' : 'By'} ${opts.authorName}` : '';
  doc.text(`${isFr ? 'Généré le' : 'Generated on'} ${dateText}${author}`, PAGE_WIDTH / 2, 124, { align: 'center' });

  // Mention confidentialité
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const warn = isFr
    ? 'Document à conserver en lieu sûr. Ne pas transmettre par courriel non chiffré.'
    : 'Store securely. Do not send by unencrypted email.';
  doc.text(warn, PAGE_WIDTH / 2, 135, { align: 'center' });

  // Contenu — Section 1: Coordonnées & Contacts d’urgence
  doc.addPage();
  let y = MARGIN;
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? '1) Coordonnées & Contacts' : '1) Contacts & Details', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  y = writeBullet(doc, (isFr ? 'Adresse' : 'Address') + `: ${data.adresse || '—'}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Téléphone' : 'Phone') + `: ${data.telephone || '—'}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Courriel' : 'Email') + `: ${data.courriel || '—'}`, MARGIN, y, CONTENT_WIDTH);

  const nasText = (isFr ? 'NAS' : 'SIN') + `: ${redact(data.nas || '', showFull)}`;
  y = writeBullet(doc, nasText, MARGIN, y, CONTENT_WIDTH);
  const healthText = (isFr ? 'Carte santé' : 'Health card') + `: ${redact(data.assuranceMaladie || '', showFull)}`;
  y = writeBullet(doc, healthText, MARGIN, y, CONTENT_WIDTH);

  y += 4;
  doc.setFontSize(13);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? 'Contact d’urgence principal' : 'Primary emergency contact', MARGIN, y);
  y += 7;
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  y = writeBullet(doc, (isFr ? 'Nom' : 'Name') + `: ${data.contactUrgenceNom || '—'}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Téléphone' : 'Phone') + `: ${data.contactUrgenceTelephone || '—'}`, MARGIN, y, CONTENT_WIDTH);

  // Contenu — Section 2: Documents juridiques & emplacements
  doc.addPage();
  y = MARGIN;
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? '2) Documents juridiques & emplacements' : '2) Legal documents & locations', MARGIN, y);
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);

  y = writeBullet(doc, (isFr ? 'Testament' : 'Will') + `: ${data.possedeTestament ? (isFr ? 'Oui' : 'Yes') : (isFr ? 'Non' : 'No')}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Lieu du testament' : 'Will location') + `: ${data.lieuTestament || data.testamentEmplacement || '—'}`, MARGIN, y, CONTENT_WIDTH);
  if (audience !== 'trusted' || showFull) {
    y = writeBullet(doc, (isFr ? 'Exécuteur testamentaire' : 'Executor') + `: ${data.executeurTestamentaire || '—'}`, MARGIN, y, CONTENT_WIDTH);
    y = writeBullet(doc, (isFr ? 'Téléphone exécuteur' : 'Executor phone') + `: ${data.executeurTelephone || '—'}`, MARGIN, y, CONTENT_WIDTH);
    y = writeBullet(doc, (isFr ? 'Notaire' : 'Notary') + `: ${data.notaire || '—'}`, MARGIN, y, CONTENT_WIDTH);
    y = writeBullet(doc, (isFr ? 'Coordonnées notaire' : 'Notary contact') + `: ${data.notaireTelephone || '—'} • ${data.notaireAdresse || ''}`, MARGIN, y, CONTENT_WIDTH);
  }
  y = writeBullet(doc, (isFr ? 'Mandat de protection' : 'Protection mandate') + `: ${data.mandatProtectionPossede ? (isFr ? 'Oui' : 'Yes') : (isFr ? 'Non' : 'No')}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Emplacement mandat' : 'Mandate location') + `: ${data.mandatProtectionEmplacement || '—'}`, MARGIN, y, CONTENT_WIDTH);

  // Contenu — Section 3: Aperçu financier (sans identifiants complets)
  doc.addPage();
  y = MARGIN;
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? '3) Aperçu financier' : '3) Financial overview', MARGIN, y);
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);

  const comptes = data.comptesBancaires?.length || 0;
  const cartes = data.cartesCredit?.length || 0;
  const investCount = (data.reers?.length || 0) + (data.celis?.length || 0) + (data.cris?.length || 0) + (data.ferrs?.length || 0) + (data.brokerAccounts?.length || 0);
  y = writeBullet(doc, (isFr ? 'Comptes bancaires' : 'Bank accounts') + `: ${comptes}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Cartes de crédit' : 'Credit cards') + `: ${cartes}`, MARGIN, y, CONTENT_WIDTH);
  y = writeBullet(doc, (isFr ? 'Comptes d’investissement' : 'Investment accounts') + `: ${investCount}`, MARGIN, y, CONTENT_WIDTH);

  // Institutions (noms uniquement, sans numéros)
  const institutions = Array.from(
    new Set([
      ...(data.comptesBancaires || []).map((c) => c.institution).filter(Boolean),
      ...(data.reers || []).map((r) => r.institution).filter(Boolean),
      ...(data.celis || []).map((r) => r.institution).filter(Boolean),
      ...(data.cris || []).map((r) => r.institution).filter(Boolean),
      ...(data.ferrs || []).map((r) => r.institution).filter(Boolean),
      ...(data.brokerAccounts || []).map((r) => r.courtier).filter(Boolean),
    ])
  );
  if (institutions.length) {
    y = writeBullet(doc, (isFr ? 'Institutions' : 'Institutions') + `: ${institutions.join(', ')}`, MARGIN, y, CONTENT_WIDTH);
  }

  // Contenu — Section 4: Biens & résidences
  doc.addPage();
  y = MARGIN;
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? '4) Biens & résidences' : '4) Assets & residences', MARGIN, y);
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);

  if (data.residencePrincipale?.adresse) {
    y = writeBullet(doc, (isFr ? 'Résidence principale' : 'Primary residence') + `: ${data.residencePrincipale.adresse}`, MARGIN, y, CONTENT_WIDTH);
  }
  if (data.residenceSecondaire?.adresse) {
    y = writeBullet(doc, (isFr ? 'Résidence secondaire' : 'Secondary residence') + `: ${data.residenceSecondaire.adresse}`, MARGIN, y, CONTENT_WIDTH);
  }
  if (data.autresProprietes?.length) {
    y = writeBullet(doc, (isFr ? 'Autres propriétés' : 'Other properties') + `: ${data.autresProprietes.length}`, MARGIN, y, CONTENT_WIDTH);
  }
  if (data.vehiculePrincipal?.marqueModeleAnnee) {
    y = writeBullet(doc, (isFr ? 'Véhicule principal' : 'Primary vehicle') + `: ${data.vehiculePrincipal.marqueModeleAnnee}`, MARGIN, y, CONTENT_WIDTH);
  }

  // Contenu — Section 5: Instructions spéciales & funérailles
  doc.addPage();
  y = MARGIN;
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? '5) Instructions & volontés' : '5) Instructions & wishes', MARGIN, y);
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);

  const wishes: string[] = [];
  if (data.instructionsSpeciales) wishes.push((isFr ? 'Instructions spéciales' : 'Special instructions') + `: ${data.instructionsSpeciales}`);
  if (data.volontesFuneraires) wishes.push((isFr ? 'Volontés funéraires' : 'Funeral wishes') + `: ${data.volontesFuneraires}`);
  if (data.donOrganes) wishes.push((isFr ? 'Don d’organes' : 'Organ donation') + `: ${data.donOrganes}`);
  if (!wishes.length) {
    wishes.push(isFr ? '—' : '—');
  }
  for (const w of wishes) {
    y = writeBullet(doc, w, MARGIN, y, CONTENT_WIDTH);
    if (y > PAGE_HEIGHT - 20) { doc.addPage(); y = MARGIN; }
  }

  // Notes audience spécifiques
  doc.addPage();
  y = MARGIN;
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text(isFr ? 'Notes' : 'Notes', MARGIN, y);
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  let note = '';
  switch (audience) {
    case 'trusted':
      note = isFr
        ? 'Ce document est destiné à un conjoint, enfant ou ami de confiance. Les identifiants sensibles sont masqués par défaut.'
        : 'This document is intended for a trusted spouse, child or friend. Sensitive identifiers are redacted by default.';
      break;
    case 'notary':
      note = isFr
        ? 'Ce document offre un aperçu des éléments juridiques pertinents. Les emplacements de documents et contacts clés sont fournis.'
        : 'This document provides an overview of relevant legal elements. Locations of documents and key contacts are provided.';
      break;
    case 'planner':
      note = isFr
        ? 'Ce document synthétise les informations utiles à la planification financière, sans exposer les identifiants complets.'
        : 'This document synthesizes information useful for financial planning, without exposing full identifiers.';
      break;
    case 'liquidator':
      note = isFr
        ? 'Ce document assiste le liquidateur dans l’inventaire initial et la localisation des documents et coordonnées.'
        : 'This document assists the liquidator with the initial inventory and locating documents and contacts.';
      break;
  }
  const lines = doc.splitTextToSize(note, CONTENT_WIDTH);
  doc.text(lines, MARGIN, y);

  // Pied de page simple avec pagination
  const pageCount = (doc as any).getNumberOfPages?.() ?? 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(229, 231, 235);
    doc.line(MARGIN, PAGE_HEIGHT - 15, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 15);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    const pageText = `${isFr ? 'Page' : 'Page'} ${i} ${isFr ? 'de' : 'of'} ${pageCount}`;
    doc.text(pageText, PAGE_WIDTH / 2, PAGE_HEIGHT - 8, { align: 'center' });
  }

  return doc.output('blob');
}
