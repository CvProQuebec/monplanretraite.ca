# 2025-09-19 — Déploiement Phase 3 — Planification d’Urgence (Rapports PDF ciblés)

Statut: LIVRÉ (build production OK)

Résumé
- Rapports PDF ciblés 100 % locaux, avec caviardage (redaction) par défaut:
  - Conjoint/Enfant (trusted)
  - Notaire (notary)
  - Planificateur/Conseiller (planner)
  - Liquidateur (liquidator)
- Aucune donnée transmise au réseau — génération locale via jsPDF.
- Option explicite “afficher intégralement” (confirmation) si l’utilisateur veut des identifiants complets — déconseillé pour partage non chiffré.

Commandes exécutées
- npm run build → OK (Vite 7, TypeScript 5)
- Résultats dist/ mis à jour; bundle “PlanificationUrgence-*.js” inclut les boutons d’export PDF.

Fichiers modifiés / ajoutés
- src/pages/PlanificationUrgence.tsx
  - Intégration de 4 boutons d’export PDF (toolbar):
    - PDF Conjoint/Enfant → audience 'trusted'
    - PDF Notaire → audience 'notary'
    - PDF Planificateur → audience 'planner'
    - PDF Liquidateur → audience 'liquidator'
  - Confirmation avant d’inclure les champs sensibles en clair; redaction par défaut.
  - Dépendance: import { generateEmergencyPDF } from '@/services/PDFEmergencyService'
- src/services/PDFEmergencyService.ts (NOUVEAU)
  - API: generateEmergencyPDF(data, audience, { language, showFullSensitive })
  - Caviardage: utilitaire “redact” (•••• 1234) si showFullSensitive=false
  - Sections couvertes: Coordonnées/Contacts, Lieux des documents juridiques, Aperçu financier (sans numéros complets), Biens & résidences, Instructions/volontés, Notes selon l’audience
- Documentation:
  - CLAUDE.md: ajout “Rapports PDF Urgence — Lignes directrices (Phase 3)” + checklist QA
  - private-docs/architecture/AGENTS.md: ajout “Rapports PDF Urgence — Consignes (Phase 3)” + checklist QA PDF

Procédure QA recommandée (pré-production / post-déploiement Netlify)
1) Génération PDF par audience
   - Ouvrir la Planification d’Urgence
   - Cliquer “PDF Conjoint/Enfant” → Vérifier que NAS/carte santé et numéros ne sont PAS complets (•••• 1234)
   - Répéter pour “PDF Notaire”, “PDF Planificateur”, “PDF Liquidateur”
2) Option “inclure sensibles”
   - Cliquer un des boutons → Accepter l’affichage intégral
   - Vérifier que les identifiants sont visibles (réservé aux usages sécurisés)
3) Zéro réseau
   - DevTools → Network: aucun appel réseau pendant la génération/export des PDF
4) Build
   - npm run build: aucune erreur; fichier dist/assets/PlanificationUrgence-*.js mis à jour
5) CSP (rappel production)
   - public/_headers déjà en place (Phase 1); valider CSP en prod sur les routes d’urgence

Risques et mitigations
- Partage non chiffré de PDF avec infos sensibles: redaction par défaut + confirmation explicite avant d’afficher intégralement; avertissement documentaire.
- Extensions navigateur intrusives: CSP protège en production; éviter extensions agressives lors de l’utilisation.
- Évolution de schéma EmergencyData: les rapports utilisent des champs existants — si extension future, étendre PDFEmergencyService de façon additive.

Definition of Done — Phase 3
- [x] 4 modèles PDF ciblés, génération locale
- [x] Redaction par défaut + confirmation pour affichage intégral
- [x] Intégration UI (toolbar) + noms de fichiers explicites
- [x] Zéro transmission réseau
- [x] Build production OK
- [x] Documentation mise à jour (CLAUDE.md, AGENTS.md)

Prochaines étapes (optionnel / Phases suivantes)
- Compléter les gabarits PDF par des sous-sections additionnelles lorsque les champs EmergencyData seront étendus (funérailles, fiducies, REEE, etc.)
- Section “Vérification” dans l’UI (checklist complétion) avant export PDF
- Tests automatisés (smoke tests) sur la génération PDF locale et la redaction

Références
- Service PDF Urgence: src/services/PDFEmergencyService.ts
- Intégration UI: src/pages/PlanificationUrgence.tsx (boutons export PDF ciblés)
- Sécurité (CSP): public/_headers
- Lignes directrices PDF: CLAUDE.md (section Rapports PDF Urgence), private-docs/architecture/AGENTS.md (section Phase 3)
