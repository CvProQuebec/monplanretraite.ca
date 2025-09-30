// Type augmentation for Employment Insurance (Assurance-emploi)
// Adds weekly tax fields so they are captured and saved.

declare module '@/types' {
  interface IncomeEntry {
    eiFederalTaxWeekly?: number;    // Impôt fédéral (hebdomadaire)
    eiProvincialTaxWeekly?: number; // Impôt provincial (hebdomadaire)
  }
}

