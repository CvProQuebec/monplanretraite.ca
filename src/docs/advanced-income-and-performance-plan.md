# Plan d'amélioration — Calculateur de revenus avancé et Calculateur de rendement professionnel (IRR/TWR/MWR + Monte Carlo)

Objectif
Offrir un module de calcul des revenus et de performance de niveau professionnel, 100 % local, robuste et pédagogique, permettant:
- des calculs fiables IRR/XIRR (MWR), TWR (rendement pondéré dans le temps) et annualisation;
- des comparaisons multi‑comptes (REER, CELI, CRI, non enregistrés);
- des scénarios (périodes, contributions, frais) et rapports prêts à partager avec un spécialiste de leur choix.

Etat actuel (après nos changements)
- Service central de calculs créé: src/services/PerformanceCalculationService.ts
  - IRR/XIRR (MWR), TWR, annualisation; méthodes robustes (Newton-Raphson + fallback bissection).
- UI ReturnCalculator refactorée pour utiliser le service (IRR/MWR) avec formatage OQLF des pourcentages.
- Tests unitaires ajoutés: src/tests/performanceCalculations.test.ts (IRR/TWR/annualisation).
- Revenus.tsx expose déjà le ReturnCalculator (entrée modale).

Problèmes et limites identifiés
- TWR calculé dans ReturnCalculator est encore local à l’UI (périodes implicites); il faut standardiser la segmentation des périodes (p. ex. r_i = (V_end - flow)/V_start).
- Pas d’outil de segmentation/facteurs “frais/benchmarks/flux” pour TWR prêt à l’emploi.
- Pas de bornage UI avancé: comparer 2+ comptes, impact des frais (TER), index/benchmark, taxes et frais de transaction (optionnel).
- Intégration Monte Carlo: exploiter les métriques (ex: distribution annualisée attendue vs réalisée).

Feuille de route (itérative)

1) Noyau de calcul (Service) — Consolidation
- [x] IRR/XIRR (MWR) robuste avec fallback de bissection, bornes et tolérances.
- [x] TWR total + annualisation (API: twr(periods: ValuationPeriod[])).
- [ ] Helper de segmentation TWR:
  - Construire automatiquement des périodes [V_start, V_end, netFlow] à partir d’un “time series” de contributions et de valorisations.
  - API proposée: buildTwrPeriods(timeseries) => ValuationPeriod[].
- [ ] Extension d’API: calcul des métriques additionnelles (volatilité simple, drawdown max sur séries de rendements périodiques) utile en rapport.

2) UI Calculateur de rendement professionnel — Expérience Pro/Expert
- Comparaison multi‑comptes (déjà partielle): permettre d’épingler 2 comptes pour comparaison directe (REER vs CELI).
- [ ] TWR avec segmentation explicite:
  - Ajout d’un “mode avancé” pour indiquer les flux à des dates de cut‑off (p. ex. contributions mensuelles) et/ou importer une série CSV (date, valeur, flux net).
  - Utiliser PerformanceCalculationService.twr(periods) pour le TWR; annualiser si dates disponibles.
- [ ] Frais/benchmarks:
  - Entrée facultative du coût moyen (TER %) et simulation de l’impact sur TWR/MWR (avant/après frais) — formatage OQLF (ex.: 1,50 %).
  - Comparaison à un benchmark simple (p. ex., “60/40 ~ 6 %/an constant” comme base pédagogique).
- [ ] Export rapport prêt à partager:
  - Résumé (TWR/MWR/annualisé), graphiques simples (distribution des rendements périodiques si disponibles), légende pédagogique.
  - PDF via PDFExportService (sections FR/EN avec OQLF).
- [ ] Accessibilité plans:
  - Free: aperçu des recommandations (un seul compte, fonctions limitées).
  - Pro: étude complète multi‑comptes + export PDF “essentiel”.
  - Expert: étude avancée (TWR segmentée, frais, benchmarks, comparaisons étendues).

3) Calculateur de revenus avancé — IRR/TWR côté “Revenus”
- [ ] Section “Performance des revenus d’investissement” dans Revenus.tsx:
  - Lister les comptes d’investissement (REER/CELI/CRI + non enregistrés).
  - Lancer le ReturnCalculator modal depuis Revenus avec contexte (pré‑remplissage).
  - Résumé intégré: IRR annualisé et TWR “essentiel” (Pro/Expert).
- [ ] Scénarios: “Et si je “top up” 200 $/mois ?” → démontrer l’impact sur MWR/TWR et sur objectif retraite.

4) Intégration Monte Carlo (optionnel)
- [ ] Ajouter un onglet “Analyse de performance vs distributions Monte Carlo”:
  - Comparer le MWR/TWR réalisé vs la distribution simulée attendue pour un profil de risque.
  - Mettre en évidence un écart (surperformance/sous‑performance) et recommandations pédagogiques (partage au spécialiste).

5) Qualité, conformité et documentation
- [x] OQLF: espace insécable avant % sur toutes les sorties UI modifiées.
- [ ] Tests unitaires supplémentaires:
  - CAS “pas de changement de signe” (IRM=0), dates irrégulières, flux consécutifs, bornes importantes, TWR avec flux aux bornes de périodes.
- [ ] Documentation:
  - Créer src/docs/performance-calculations.md (exemples de calculs, conventions, limites); exemples FR/EN.
- [ ] DX (import/export):
  - Import CSV (date, flux, valeur) pour TWR/IRR; validations UX.
  - Export CSV/JSON/PDF des résultats (Pro/Expert).

Décisions algorithmiques clés
- IRR/XIRR:
  - npvAtRate sur base des dates réelles; Newton-Raphson avec fallback bissection; bornes: [-0.999 ; 10].
  - Nécessite au moins un flux positif et un négatif.
- TWR:
  - Convention r_i = (V_end_i - netFlow_i) / V_start_i; produit sur toutes les périodes − 1.
  - Annualisation si (startDate, endDate) fournis.
- Annualisation:
  - (1+R_total)^(1/years) − 1; years via fraction annuelle (act/365.25).

Gating et Copy (harmonisé Pro/Expert)
- Free: “Aperçu des recommandations” (limité).
- Pro: “Générer mon étude (Pro)” → étude complète, export “essentiel”.
- Expert: “Générer mon étude (Expert)” → segmentation TWR avancée, frais/benchmarks, comparaisons étendues et export complet.

Prochaines étapes proposées (exécutables)
1. Ajouter le helper de segmentation TWR (service) + tests (0.5 j).
2. Brancher TWR du ReturnCalculator sur le helper (0.5 j).
3. UI avancée: saisie des frais (%) et benchmark simple (0.5–1 j).
4. Intégration Revenus.tsx — bloc “Performance des revenus d’investissement” (0.5 j).
5. Export PDF “essentiel” (Pro) + “complet” (Expert) (1 j).
6. (Optionnel) Panneau Monte Carlo vs réalisé (1–2 j).

Critères d’acceptation
- IRR/XIRR/TWR cohérents avec Excel/XIRR/TWR sur cas tests.
- Pas d’échecs numériques pour cas courants (retourne 0 si irrésoluble).
- Rapports clairs et partageables (PDF) avec labels FR/EN; OQLF respectée.
- Parcours d’upgrade aligné CTA “Générer mon étude (Pro/Expert)”.
