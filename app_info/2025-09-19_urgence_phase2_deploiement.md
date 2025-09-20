# 2025-09-19 — Déploiement Phase 2 — Planification d’Urgence (Export/Import chiffrés)

Statut: LIVRÉ (build production OK)

Résumé
- Implémentation des export/import chiffrés (.mpru) 100 % local avec WebCrypto (AES‑256‑GCM + PBKDF2‑SHA256, 200k itérations).
- Prévisualisation à l’import (date, version de schéma, taille) et avertissement si JSON non chiffré.
- Intégration UI complète dans la page du module Urgence (boutons Exporter/Importer).
- CSP stricte appliquée aux routes d’urgence via public/_headers.
- Aucune donnée ne quitte le poste de l’utilisateur.

Commandes exécutées
- npm run build → OK (Vite 7, TypeScript 5)
- Résultats dist/ générés, incluant PlanificationUrgence-*.js et PlanificationUrgence-*.css

Fichiers modifiés / ajoutés
- src/pages/PlanificationUrgence.tsx
  - Ajout exportEncrypted() (.mpru) et importEncrypted() (mpru/json) + modal de prévisualisation
  - Dépendances: encryptToEnvelope, decryptFromEnvelope, isExportEnvelope (src/lib/fileCrypto.ts)
  - Écran de verrouillage (Phase 1), stockage chiffré secureStorage (Phase 1), auto-lock 5 min
- src/components/emergency-planning/PersonnelSection.tsx
  - Champs sensibles (NAS, carte santé) → type="password" + toggle d’affichage + label/id pour A11y
- src/lib/fileCrypto.ts (NOUVEAU)
  - encryptToEnvelope, decryptFromEnvelope, isExportEnvelope
  - AES‑GCM 256 bits, IV 96 bits, salt 128 bits, PBKDF2‑SHA256 200 000 itérations
- public/_headers
  - CSP stricte ciblée: /planification-urgence*, /fr/planification-urgence*, /en/emergency-planning*, /PlanificationUrgence*

Points de sécurité (rappel)
- Export chiffré uniquement par défaut (fichiers .mpru — enveloppe JSON avec ciphertext base64)
- Import .mpru requiert que la session soit déverrouillée (phrase secrète)
- Import JSON non chiffré (legacy) → avertissement + chiffrement local après import
- Stockage local chiffré (secureStorage) pour les données en session

Procédure de vérification (post-déploiement Netlify)
1) Routage + CSP
   - Ouvrir les routes Planification d’Urgence
   - Vérifier les en‑têtes CSP via DevTools (Network → Headers)
   - Aucune ressource externe non autorisée
2) Export .mpru
   - Déverrouiller (phrase secrète)
   - Saisir quelques données
   - “Exporter chiffré (.mpru)” → choisir nom/emplacement (clé USB ou dossier local)
   - Ouvrir le fichier .mpru dans un éditeur → vérifier enveloppe JSON (pas de données en clair, ciphertext base64)
3) Import .mpru
   - “Importer fichier (.mpru/.json)” → choisir le .mpru
   - Vérifier la prévisualisation (date/size/version)
   - “Charger” → données visibles dans le formulaire + sauvegarde chiffrée locale
4) Import JSON (legacy)
   - Importer un ancien .json
   - Confirmer l’avertissement → données chargées et chiffrées localement
5) Verrouillage
   - “Verrouiller” ou inactivité 5 minutes → retour à l’écran de phrase secrète

Risques et mitigations
- Perte de la phrase secrète: les fichiers .mpru et le stockage chiffré local seront inaccessibles. Mitigation: messages clairs à l’utilisateur, inciter à conserver sa phrase secrète en lieu sûr.
- Extensions navigateur agressives: CSP protège en production, éviter extensions intrusives durant l’usage.
- JSON non chiffré issu d’anciennes versions: avertissement et chiffrement local automatique après import.

Definition of Done — Phase 2
- [x] Export chiffré .mpru
- [x] Import .mpru avec prévisualisation (métadonnées)
- [x] Import .json legacy avec avertissement et chiffrement local
- [x] Zéro transmission réseau de données
- [x] CSP stricte active sur routes d’urgence
- [x] Build production OK

Prochaines étapes (Phase 3)
- Gabarits PDF ciblés (Conjoint/Enfant, Notaire, Planificateur, Liquidateur) avec redaction par défaut
- Extensions de schéma EmergencyData (funérailles, fiducies, REEE, etc.)
- Section Vérification (checklist de complétion par section)
- Tests unitaires et intégration (WebCrypto, import/export, A11y onglets)

Annexes (références)
- Cahier des charges: private-docs/PHASE_URGENCE_CAHIER_DES_CHARGES.md
- Architecture globale: architecture.md
- AGENTS (consignes): private-docs/architecture/AGENTS.md
- CLAUDE: CLAUDE.md (règles OQLF/code, workflow documentaire)
