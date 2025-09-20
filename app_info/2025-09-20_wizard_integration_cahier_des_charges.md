# Cahier des charges — Intégration complète des fonctionnalités dans les Wizards (Base & Avancé)
Date: 20 septembre 2025  
Auteur: MonPlanRetraite.ca

## 0) Résumé exécutif

Objectif: s’assurer que le Wizard de base (“guide”) et le Wizard avancé (“libre”) exploitent toutes les fonctionnalités pertinentes selon le forfait (free, professional, expert), et combler les manques identifiés.

Constat actuel (audit rapide du code):
- Étapes Wizard (WizardPage.tsx): profil, revenus, actifs (MaRetraiteWithDashboard), prestations (RRQ Quick Compare + RRQ Delay + OAS/GIS), dépenses, budget, “optimisations” (placeholder), plan (ResultsWizardStep), rapports (placeholder).
- Étape “optimisations” non implémentée (placeholder).
- Étape “plan” (ResultsWizardStep) intègre: ordre de retraits conseillé (TaxOptimizationService), planification de rappels (NotificationSchedulerService), PDF Résumé/Banquier/Planificateur/Notaire (PDFExportService).
- Gating par forfait (plans.ts) disponible mais non appliqué systématiquement dans le Wizard.
- Modules supplémentaires disponibles mais non intégrés au Wizard:
  - Optimisation fiscale avancée v2/v2.1/v3 (DP/Beam + robustesse + Export PDF robuste)
  - Monte Carlo / Stress Test / Analyses prédictives (selon plan)
  - RREGOP / SRG (cartes/module dédiés)
  - Centre Budget complet, calculs IRR/TWR/MWR (présents hors wizard)

Conclusion: le Wizard ne couvre pas encore toutes les capacités par plan. Priorité: implémenter une “OptimisationsStep” dédiée avec gating et intégrer les modules manquants dans Prestations/Optimisations/Plan/Rapports.

---

## 1) Critères fonctionnels par forfait

Références: src/config/plans.ts (PLAN_CONFIG, checkFeatureAccess, isFeatureEnabled, getRequiredPlanForFeature)

- Free
  - Inclus: Profil, Revenus, Actifs/soldes de base, Prestations (RRQ/CPP basiques), Dépenses, Budget basique, Assistant Financier (conseils), Sécurité locale.
  - Exclusions (gating avec CTA upgrade): Export PDF pro, Monte Carlo, Optimisation fiscale avancée, RREGOP, SRG, OAS/GIS avancée, Tax Optimization Lab (DP/Beam), Rapports pro, Stress Test, Prédictif.
  - Optimisations: masquer/CTA “upgrade” pour “Optimisations”, “Rapports pro”.

- Professional
  - Inclus: Tout ce qui précède + Export PDF pro, Monte Carlo standard, Optimisation fiscale avancée (Greedy + DP/Beam v2/v2.1/v3 limité wizard), OAS/GIS, RREGOP, SRG, Calculs avancés (IRR/TWR/MWR), Budget complet.
  - Optimisations: intégrer une “OptimisationsStep” avec UI simplifiée (Greedy + DP/Beam avec robustesse, réglages essentiels).
  - Rapports: PDF pro (Banquier/Planificateur/Notaire) + “PDF Optimisation fiscale (résumé robuste)”.

- Expert
  - Inclus: Tout Professional + Analyses prédictives, Stress Test avancé, Monte Carlo 1000+, Rapports consultant.
  - Optimisations: “OptimisationsStep” avec contrôles avancés (beamWidth, stepSize, poids pénalité, ratio CG, Mode robuste) + Monte Carlo + Stress Test.
  - Remarque: “Optimisation immobilière avancée” est marquée “expert” dans plans.ts, mais le périmètre immobilier propriétaire est hors scope stratégique. Ne pas intégrer un comparateur/calculateur dédié (cf. architecture.md Politique Immobilier).

---

## 2) Gaps par étape et intégrations à réaliser

2.1 Prestations (WizardPage → “prestations”)
- Actuel: RRQQuickCompare + RRQDelaySimulator + OASGISAnalysis (déjà en place).
- Manques:
  - Gating plan (free → upgrade pro; pro/expert → accès).
  - Ajout de cartes pour RREGOP/SRG si plan ≥ pro (composants disponibles dans codebase; lazy load).
- Spécifications:
  - Encapsuler chaque carte dans un FeatureGate; si locked → afficher “advanced-upgrade-modal”.
  - Ajouter boutons “Appliquer âge RRQ/SV” connectés à wizardService.applyRRQAge/applyOASAge pour progression.

2.2 Optimisations (nouvelle étape “OptimisationsStep”)
- Actuel: placeholder.
- À intégrer (selon plan):
  - Professional:
    - GreedyBaselineOptimizer (v1) → run et afficher résultats (impôts totaux, target met).
    - DP/Beam (v2/v2.1/v3) via worker (dpBeamWorker.ts): bouton “Optimiser v2 (DP/Beam)”, progression/Arrêter, score, total impôts, heatmaps MTR/OAS/GIS (liste simple).
    - Mode robuste (v3) activable: score robuste + explications (RobustnessService).
    - Export “PDF Optimisation (résumé robuste)” (TaxOptimizationPDFService).
  - Expert:
    - Tout ci-dessus + Monte Carlo (module existant) + Stress Test (StressTestService) + affichage synthétique.
  - Free:
    - Masqué → CTA upgrade (Pro/Expert).
- Spécifications UI:
  - Mode “guide”: contrôles minimaux (seulement boutons run + Mode robuste toggle).
  - Mode “libre”: afficher réglages avancés (beamWidth, stepSize, weightTargetMiss, nonRegCGRatio).
  - Réutiliser une version simplifiée de TaxOptimizationLab (extraction en composant WizardOptimizationsStep.tsx).
  - Gating contextuel: isFeatureEnabled(userPlan,'hasTaxOptimization') etc.

2.3 Plan (ResultsWizardStep)
- Actuel: Ordre de retraits (suggest + apply), Rappels (préavis + fin de mois), PDF Résumé/Banquier/Planificateur/Notaire, Buckets (coussin op, court terme).
- Améliorations:
  - Si (pro/expert) et un plan DP/Beam a été généré dans l’étape “Optimisations”: ajouter bouton “Exporter PDF Optimisation (résumé robuste)” (TaxOptimizationPDFService) directement ici.
  - Ajout CTA “Aller à Optimisations” si aucun plan optimisé n’existe.
  - Intégrer gating (free → CTA upgrade pour rapports pro).

2.4 Rapports (WizardPage → “rapports”)
- Actuel: placeholder.
- À intégrer:
  - Liste d’exports disponibles selon plan: Résumé, Banquier/Planificateur/Notaire, Performance (IRR/TWR/MWR), Optimisation fiscale (résumé robuste), Urgence (via route séparée).
  - Gating par plan (free: Résumé simple, pro: rapports pro, expert: + consultant).
  - Lazy load des services PDF.

---

## 3) Spécifications techniques

3.1 Nouveaux fichiers à créer
- src/pages/WizardOptimizationsStep.tsx
  - Props: none (lit user plan via hook), utilise services existants:
    - GreedyBaselineOptimizer (simulateYears + rendu synthétique)
    - DPBeamOptimizer via worker (dpBeamWorker.ts)
    - RobustnessService (score/explanations)
    - TaxOptimizationPDFService (export summary)
  - UI:
    - Section Greedy: impôt total, objectif net atteint
    - Section DP/Beam: impôt total, score, progression/arrêt, heatmaps MTR/OAS/GIS minimalistes
    - Section Robustesse: scores + explications; bouton Export PDF
    - Contrôles avancés (mode “libre” seulement): beamWidth, stepSize, poids, ratio CG
  - Gating: bascule CTA upgrade si feature indisponible (use plan_config isFeatureEnabled).

- src/components/wizard/FeatureGate.tsx (si non existant à unifier)
  - Wrapper qui lit userPlan (hook useSubscriptionLimits ou équivalent) et applique isFeatureEnabled/checkFeatureAccess.

3.2 Modifications de fichiers
- src/pages/WizardPage.tsx
  - Remplacer placeholder “optimisations” par lazy import de WizardOptimizationsStep.
  - “rapports”: liste d’exports (lazy modules PDFExportService, Performance report, TaxOptimizationPDFService). Gating.

- src/components/wizard/WizardLayout.tsx
  - Injecter FeatureGate autour des boutons Continue/Actions si prochaine étape est verrouillée (afficher CTA upgrade).
  - Lire mode (“guide/libre”) déjà présent; propager mode à OptimisationsStep (contexte ou props).

- src/pages/ResultsWizardStep.tsx
  - Ajouter bouton “Export PDF (Optimisation robuste)” si plan ≥ pro; utiliser TaxOptimizationPDFService.generateSummary avec données de la dernière optimisation si disponible; sinon CTA “Générer un plan (Optimisations)”.
  - Gating pour rapports pro selon plan.

- src/features/retirement/sections (PrestationsStep consolidée)
  - Ajouter cartes RREGOPAnalysis/SRGAnalysis (lazy) avec FeatureGate.

3.3 Sources plan utilisateur
- Unifier source du plan (ex: hook useSubscriptionLimits.ts) pour:
  - isFeatureEnabled(feature)
  - getRequiredPlanForFeature(feature) pour CTA upgrade.
- Si le hook n’existe pas ou est incomplet: lire plan courant du profil (userData.personal?.subscriptionPlan || ‘free’) avec fallback.

3.4 Performances
- Lazy-load systématique des modules lourds (PDF, Monte Carlo, DP worker déjà en place).
- Worker: déjà utilisé pour DP/Beam; garder progression/stop.
- Pas de réseau (100% local) respecté.

---

## 4) Gating & Upgrade CTA

- Réutiliser src/components/ui/advanced-upgrade-modal.tsx pour présenter:
  - Message: getUpgradeMessage(feature, requiredPlan) + getContextualUpgradeMessage.
  - Bouton “Voir les forfaits” → route pricing / section PremiumFeatures.
- Afficher CTA inline dans panneaux verrouillés (badge “PRO”/“EXPERT”).

---

## 5) Données & Persistance

- userData (retirement_data):
  - OptimisationsStep peut consommer uniquement les soldes et besoins; pas d’écriture obligatoire.
  - ResultsWizardStep: continue de lire localStorage pour besoin net; prévoir synchronisation avec Wizard state si nécessaire.
- wizard state (secureStorage):
  - wizardService.markStepComplete() appelé après calcul réussi d’optimisation.
  - wizardService.applyWithdrawalOrder déjà en place.

---

## 6) Tests & QA

- Free:
  - OptimisationsStep doit afficher un gating propre (sans erreurs console).
  - Prestations: OAS/GIS/RREGOP/SRG verrouillés avec CTA upgrade.
  - Rapports: un seul Résumé simple; autres → CTA upgrade.

- Professional:
  - OptimisationsStep: DP/Beam + robustesse opérationnels; Export PDF Optimisation OK.
  - Prestations: RRQ/OAS/GIS/RREGOP/SRG accessibles.
  - Results: export pro OK; rappel planifié OK.

- Expert:
  - OptimisationsStep: contrôles avancés (mode “libre”), Stress Test & Monte Carlo accessibles.
  - Rapports consultant accessibles.

- Accessibilité/OQLF:
  - Labels/ar ia complètes sur inputs/boutons ajoutés.
  - Pas de chevrons « » dans code.

---

## 7) Planning & Livrables

- Semaine 1:
  - Créer WizardOptimizationsStep.tsx (pro + expert)
  - Gating FeatureGate + intégration à WizardPage
  - Prestations: cartes RREGOP/SRG avec gating
- Semaine 2:
  - Rapports: page “rapports” avec gating + PDF robust optimisation
  - ResultsWizardStep: ajout export optimisation + CTA
- Semaine 3:
  - Expert: intégration Monte Carlo / Stress Test dans OptimisationsStep
  - QA (free/pro/expert), Accessibilité, OQLF
- Semaine 4:
  - Documentation (AGENTS.md, architecture.md), checklists, démonstrations

Livrables:
- src/pages/WizardOptimizationsStep.tsx
- MàJ: WizardPage.tsx, ResultsWizardStep.tsx, WizardLayout.tsx
- PrestationsStep consolidée: ajout RREGOP/SRG
- Gating: FeatureGate + CTA upgrade
- QA scripts/checklists

---

## 8) Risques & Décisions

- Immobilier: hors périmètre pour comparateurs/calculateur propriétaire (voir architecture.md).
- Performance: limiter faisceau initial (beamWidth) en mode “guide”.
- Données: ne pas mêler dossier d’urgence (module et sauvegarde distincts) dans le Wizard retraite.

---

## 9) Acceptation

- Le Wizard utilise toutes les fonctionnalités pertinentes par forfait:
  - Free: parcours découverte basique; gating propre.
  - Pro: optimisations fiscales opérationnelles, prestations complètes, PDF pro.
  - Expert: optimisation avancée + Monte Carlo/Stress Test + rapports consultant.
- Absence d’erreurs console, navigation fluide, labels/accessibilité conformes.
- Aucune transmission réseau.
