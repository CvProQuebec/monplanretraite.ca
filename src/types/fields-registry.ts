/**
 * FieldsRegistry — Source de vérité des champs (Phase 1 déduplication)
 * 
 * Objectif: centraliser le mapping entre les champs "source" (Immobilier) et les vues "consommateurs"
 * (Dépenses/Cashflow, Budget), afin d&#39;éviter toute double saisie (hypothèque, taxes municipales, assurance habitation).
 *
 * Règle Phase 1:
 * - Source: SavingsData (résidence*)
 * - Vue liée: Cashflow/logementBreakdown synchronisé automatiquement (lecture seule pour ces 3 postes)
 *
 * NOTE OQLF: Ces constantes ne concernent pas l&#39;affichage; les formats OQLF s&#39;appliquent dans les UI de présentation.
 */

export type FieldKey = keyof typeof FIELDS_SOURCE;

/**
 * Champs source (résidence) dans SavingsData
 */
export const FIELDS_SOURCE = {
  residencePaiementHypothecaireMensuel: 'savings.residencePaiementHypothecaireMensuel',
  residenceTaxesMunicipalesAnnuelles: 'savings.residenceTaxesMunicipalesAnnuelles',
  residenceAssuranceHabitationAnnuelle: 'savings.residenceAssuranceHabitationAnnuelle',
} as const;

/**
 * Champs de vue (Cashflow/logement breakdown)
 * - Ces clés sont verrouillées (lecture seule) et alimentées depuis les FIELDS_SOURCE.
 */
export const FIELDS_VIEW_CASHFLOW_LOGEMENT = {
  hypotheque: 'cashflow.logementBreakdown.hypotheque',
  taxesMunicipales: 'cashflow.logementBreakdown.taxesMunicipales',
  assuranceHabitation: 'cashflow.logementBreakdown.assuranceHabitation',
} as const;

/**
 * Convertisseurs simples (annuel → mensuel)
 */
export function annualToMonthly(amount: number | undefined | null): number {
  const v = Number(amount || 0);
  return v > 0 ? v / 12 : 0;
}

/**
 * Aide: calcule les valeurs mensuelles verrouillées à partir du modèle SavingsData partiel
 */
export function computeLockedHousingMonthly(savings?: {
  residencePaiementHypothecaireMensuel?: number;
  residenceTaxesMunicipalesAnnuelles?: number;
  residenceAssuranceHabitationAnnuelle?: number;
}) {
  const mortgage = Number(savings?.residencePaiementHypothecaireMensuel || 0);
  const municipalTaxes = annualToMonthly(savings?.residenceTaxesMunicipalesAnnuelles);
  const homeInsurance = annualToMonthly(savings?.residenceAssuranceHabitationAnnuelle);
  return {
    hypotheque: mortgage,
    taxesMunicipales: municipalTaxes,
    assuranceHabitation: homeInsurance,
  };
}

/**
 * Liste des clés breakdown verouillées pour le logement
 */
export const LOCKED_LOGEMENT_KEYS = ['hypotheque', 'taxesMunicipales', 'assuranceHabitation'] as const;
export type LockedLogementKey = (typeof LOCKED_LOGEMENT_KEYS)[number];
