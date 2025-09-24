## Guide d’Architecture et Uniformisation (OQLF/UI) – MonPlanRetraite.ca

Ce guide formalise les règles d’architecture, d’UI “seniors-friendly”, d’OQLF et de sécurité pour toute nouvelle feature. Il compile et opérationnalise AGENTS.md, architecture.md et “2025‑09‑18 Instructions uniformisation web.md”.

---

## 1) Couches d’architecture et responsabilités

### Couches

- UI (présentation): `src/pages`, `src/components`, `src/features/*/components`, `src/styles`
  - Affichage, interactions, routing, i18n. Zéro logique métier.
- Domaine (métier): `src/features/*/services`, `src/services/*` (calculs, optimisation, agrégations), `src/types`
  - Règles de calcul, orchestrations, score/optimisation. Strictement pur (sans accès DOM).
- Données (persistance locale): `src/lib/secureStorage`, `src/services/BackgroundBackupService`, `EnhancedSaveManager`, `DataMigrationService`, `useRetirementData` (façade UI)
  - Chargement/sauvegarde session/localStorage/IDB, chiffrement, migrations.
- Infra (sécurité/config/build): `src/lib/*`, `public/_headers`, `vite.config.ts`, `tailwind.config.ts`, `scripts/*`
  - CSP, chiffrement, middlewares, partition des bundles.

### Règles de dépendance

- UI → Domaine → Données → Infra (sens descendant uniquement)

- Interdits:

  - Domaine n’importe pas l’UI.
  - Données n’importe pas l’UI.
  - UI n’importe pas directement l’infra bas niveau (passer par des façades).

- Recommandations:
  - Exporter des interfaces du domaine (p. ex. `TaxEngine`, `ProjectionEngine`) et implémenter côté services. UI consomme les interfaces, pas les impls concrètes si possible.

---

## 2) Structure des dossiers et conventions

### Nouveau module (blueprint)

```javascript
src/features/<domain>/
├── components/        # UI spécifique au domaine (présentation)
├── services/          # Règles métier (pur TS)
├── hooks/             # Hooks de façade pour usages UI
├── types/             # Interfaces du domaine
├── utils/             # Formatters et helpers du domaine
└── sections/          # Sections composables (pages)
```

### Nommage

- Composants React: `PascalCase.tsx` (un composant = un fichier).
- Services: `SomethingService.ts` (méthodes pures, non-UI).
- Types: `something.types.ts` OU `types/*.ts` avec exports nommés.
- Hooks: `useSomething.ts(x)`.
- Pages: `UpperCamelCase.tsx`, mappées à une route unique.

### Routes

- Déclarer les routes dans des fichiers dédiés (ex. `src/routes/blogRoutes.tsx`, `src/routes/mainRoutes.tsx`), et composer dans `App.tsx` pour éviter le “fichier Dieu”.
- Lazy load par domaine (chunk ≤ 500 kB).

---

## 3) Règles UI “Seniors-Friendly” (Uniformisation formulaires)

Source: “2025‑09‑18 Instructions uniformisation web.md”

### Principe absolu

- 1 ligne = 1 label (gauche) + 1 champ (droite). Jamais de label au-dessus du champ, y compris en mobile.
- Le label ne wrap pas; il est tronqué avec ellipsis.

### Grille et classes à utiliser

- Conteneur: `.mpr-form`
- Lignes: `.mpr-form-row cols-3|cols-2|cols-1` selon densité
- Paires label+champ: `.mpr-field` (+ `.span-2|.span-3` pour champs longs)
- Gaps: 8 px entre label et champ; 16–20 px entre colonnes/lignes
- Hauteurs: champs ≥ 48 px; boutons ≥ 56 px
- Focus visible: outline/box-shadow 3 px
- Responsive mobile: conserver 2 colonnes (label à gauche, champ à droite), `grid-template-columns: minmax(120px,45%) 1fr`

### Patron TSX (extrait)

```tsx
<div className="mpr-form">
  {/* Lignes 3 colonnes (champs courts) */}
  <div className="mpr-form-row cols-3">
    <div className="mpr-field">
      <label htmlFor="age">Âge actuel</label>
      <input id="age" type="number" />
    </div>
    <div className="mpr-field">
      <label htmlFor="rrqActuelle">RRQ actuelle (mois)</label>
      <input id="rrqActuelle" type="text" />
    </div>
    <div className="mpr-field">
      <label htmlFor="rrq70">RRQ à 70 ans (mois)</label>
      <input id="rrq70" type="text" />
    </div>
  </div>

  {/* Lignes 2 colonnes (champs moyens) */}
  <div className="mpr-form-row cols-2">
    <div className="mpr-field">
      <label htmlFor="dateDebut">Date de début</label>
      <input id="dateDebut" type="date" />
    </div>
    <div className="mpr-field">
      <label htmlFor="montantMensuel">Montant mensuel</label>
      <input id="montantMensuel" type="text" />
    </div>
  </div>
</div>
```

### CSS (doit vivre dans `senior-unified-styles.css`)

- Utiliser strictement le bloc publié (variables, `.mpr-form`, `.mpr-form-row`, `.mpr-field`, focus, responsive).
- Interdits: styles inline contradictoires, empilement vertical label/champ, labels multilignes.

### Accessibilité

- Police ≥ 18 px, zones cliquables ≥ 48 px
- Contraste AAA via variables `--mpr-h1..--mpr-h4`
- ARIA: pour champs verrouillés, `readOnly` + `aria-readonly="true"` (préférer readOnly à disabled si focus requis)
- Tooltips pour libellés trop longs (icône “?” ou attribut `title`), sans casser la règle 1-ligne.

---

## 4) Règles OQLF et i18n

### OQLF – Critiques non négociables

- Ne jamais remplacer les guillemets droits " par « » dans le code JS/TS/TSX.
- Montants FR: « 1 234,56 $ » (espace insécable avant $).
- Heures FR: « 9 h 30 », « 13 h 5 ».
- Majuscules: éviter la capitalisation non justifiée en FR.

### Implémentation

- Utils de formatage dédiés (FR: `formatCurrencyOQLF`, EN: `formatCurrencyLocale`).
- Blog bilingue: front-matter `relatedSlugFr/relatedSlugEn` obligatoire; le parseur est tolérant (tags/string|array).
- Hooks i18n: `useLanguage`, props `language`/`isEnglish`, routes `/fr/*` et `/en/*`.

---

## 5) Sécurité & Confidentialité (100 % local)

- Aucune transmission réseau de données sensibles (vérifier DevTools → Network: 0 request avec payload utilisateur).

- Chiffrement local AES‑256‑GCM (WebCrypto) via `secureStorage` et `fileCrypto`.

- Planification d’urgence:

  - Export/Import `.mpru` chiffré (PBKDF2‑SHA256 ≥ 200 000 itérations, IV 96b, salt 128b).
  - Verrouillage manuel + auto (5 min).
  - CSP stricte sur routes d’urgence (`public/_headers`).

- Sauvegardes:

  - `BackgroundBackupService` + File System Access API (Edge/Chrome).
  - Option “vider local après sauvegarde”.

- Logs:

  - Pas de PII en clair.
  - Utiliser `securityLogger` pour événements sensibles.

---

## 6) Dates, fuseaux, menus, formats

- Dates: interdits `new Date('YYYY-MM-DD')` (UTC). Faire parsing local:

```ts
const [y, m, d] = dateStr.split('-').map(Number);
const localDate = new Date(y, m - 1, d);
```

- Menus (Radix): utiliser `SelectContent` avec `position="item-aligned"`, `side="bottom"`, `sideOffset={4}`, `avoidCollisions`, `z-index` élevé, `min-w-full`.
- Fréquences spécifiques: `rentalFrequency: 'weekend'|'weekly'|'monthly'` (≈4.33/mois pour weekend/weekly).

---

## 7) Performance (seniors)

- Lazy load par domaine; seuil d’alerte 500 kB/chunk.
- Workers pour charges lourdes (Monte Carlo, DP/Beam): non-bloquant UI, progression/cancel.
- Exemple Vite `manualChunks`:

```ts
manualChunks(id: string) {
  if (id.includes('./src/config/financial-assumptions') ||
      id.includes('./src/config/cpm2014-mortality-table')) return 'financial-core';
  if (id.includes('./src/features/retirement/services/AnalyticsService') ||
      id.includes('./src/features/retirement/services/AdvancedMonteCarloService')) return 'analytics';
  if (id.includes('date-fns')) return 'date-lib';
}
```

- Cache chaud calculs: `CacheService`, mémoïsation (useMemo/useCallback).

---

## 8) Patron d’état & persistance

- UI consomme un hook façade (ex: `useRetirementData`) pour lire/écrire `UserData`.

- Le hook délègue:

  - Au “repository” (persistance: session/local/secureStorage, migrations).
  - Aux “services métier” (calculs) via appels explicites.

- Interdits:

  - Logique métier directement dans les composants.
  - Accès direct UI → secureStorage/fileCrypto (passer par services).

---

## 9) Blueprints d’implémentation

### A. Nouveau formulaire “Retraite”

1. Créer un composant dans `src/features/retirement/components/MyForm.tsx`.

2. Layout:

   - `.mpr-form` + `.mpr-form-row` (cols-3/2 selon champs).
   - Chaque couple label+champ dans `.mpr-field`.
   - Labels tronqués (ellipsis), tooltips si nécessaire.

3. Validation/règles:

   - Utiliser utils de formatage OQLF.
   - États contrôlés: `value`/`onChange` reliés à `updateUserData('personal'|'retirement', updates)`.

4. Accessibilité:
   - `label htmlFor`, focus, aria-*, `readOnly` vs `disabled` selon besoin.

5. Tests visuels:

   - Desktop ≥1024px: 2–3 paires/ligne.
   - Mobile <768px: grid minmax(120px,45%) 1fr (toujours label à gauche).

### B. Nouvelle logique métier

1. Types: `src/features/<domain>/types/*.ts`.
2. Service pur: `src/features/<domain>/services/MyService.ts` (zéro UI/DOM).
3. Hook façade si nécessaire: `src/features/<domain>/hooks/useMyFeature.ts`.
4. Appel UI via hook/service; pas de dépendance inversée.

---

## 10) Checklists DoD (Definition of Done)

### UI Formulaires (Uniformisation)

- [ ] 1 ligne = 1 label + 1 champ (desktop et mobile)
- [ ] Aucun label sur 2 lignes (ellipsis + tooltip si nécessaire)
- [ ] `.mpr-form` + `.mpr-form-row` (cols-3/2/1) + `.mpr-field`
- [ ] Hauteurs: champs ≥ 48 px; boutons ≥ 56 px; focus visible
- [ ] Réduction notable du scroll vertical
- [ ] Titres H1–H4 via variables de thème (contraste AAA)
- [ ] Aucune règle inline qui contredit la grille

### OQLF

- [ ] Guillemets droits " conservés dans le code
- [ ] Montants FR formatés correctement (1 234,56 $)
- [ ] Heures FR conformes (9 h 30, 13 h 5)
- [ ] Langage simple (niveau 6e), labels FR courts

### Sécurité/Local-only

- [ ] 0 transmission réseau de données utilisateur (DevTools → Network)
- [ ] Données sensibles chiffrées (secureStorage/fileCrypto)
- [ ] Export/Import conforme (si applicable), pas de données en clair

### Performance

- [ ] Lazy load pour composant lourd
- [ ] Chunk ≤ 500 kB (sinon: découper)
- [ ] Workers pour calculs lourds (progress/cancel)

### Architecture

- [ ] UI ne dépend pas du domaine/infrastructures de façon inversée
- [ ] Service métier pur (sans dépendance UI)
- [ ] Hook façade isole persistance/migrations

---

## 11) Modèle de PR (à coller dans description PR)

```javascript
### Portée
- [ ] UI
- [ ] Domaine
- [ ] Données
- [ ] Infra

### Uniformisation UI
- [ ] `.mpr-form` / `.mpr-form-row` / `.mpr-field`
- [ ] Labels tronqués (ellipsis), tooltips
- [ ] Champs ≥ 48 px / Boutons ≥ 56 px / Focus visible

### OQLF
- [ ] Guillemets droits " respectés
- [ ] Montants FR « 1 234,56 $ » ; Heures FR « 13 h 5 »

### Sécurité
- [ ] 0 requête réseau avec données utilisateur
- [ ] Chiffrement local validé

### Performance
- [ ] Lazy/lazy-chunk (≤ 500 kB)
- [ ] Worker si calcul lourd

### Architecture
- [ ] Respect des dépendances (UI→Domaine→Données→Infra)
- [ ] Service(s) pur(s) testé(s)
- [ ] Hook façade uniquement pour orchestration

### Tests
- [ ] Type-check OK / Lint OK / Build vite OK
- [ ] Scénarios seniors (desktop/mobile) validés
```

---

## 12) Exemples anti-patterns (à éviter)

- “Fichier Dieu” de routes: ajouter des routes “one-off” directement dans `App.tsx`. Solution: routes modulaires.
- Logique de calcul directement dans un composant. Solution: refactor en `MyService` + hook façade.
- Formulaires ad hoc (flex/stack) non conformes `.mpr-*`. Solution: patron du §3.
- Utilisation de `new Date('YYYY-MM-DD')`. Solution: parsing manuel local.
- Export JSON contenant des données en clair pour l’urgence. Solution: `.mpru` chiffré.

---

## 13) Outils recommandés (prévention)

- Bundle/Chunks: `npm run build:analyze` (analyser tailles).
- Tests seniors/perf: `npm run performance:audit` (et Lighthouse si applicable).
- Règles import/dependences (optionnel): depcruise/madge (CI) pour prévenir cycles UI↔Domaine.

---

## 14) Références canoniques

- AGENTS.md (règles OQLF, sécurité, plans, module urgence)
- 2025‑09‑18 Uniformisation (CSS `.mpr-*`, patrons TSX, DoD)
- architecture.md (structure globale, navigation, données, budget/notifications)
- `public/_headers` (CSP routes urgence)

---

### Mini-exemple complet (TSX + CSS utilisés)

```tsx
// src/features/retirement/components/IncomeShortForm.tsx
export function IncomeShortForm({ data, onChange }: { data: any; onChange: (u: any) => void; }) {
  return (
    <div className="mpr-form">
      <div className="mpr-form-row cols-3">
        <div className="mpr-field">
          <label htmlFor="salary1" title="Salaire net Personne 1">Salaire P1</label>
          <input id="salary1" type="number" value={data.salary1 ?? ''} onChange={e => onChange({ salary1: +e.target.value || 0 })} />
        </div>
        <div className="mpr-field">
          <label htmlFor="salary2" title="Salaire net Personne 2">Salaire P2</label>
          <input id="salary2" type="number" value={data.salary2 ?? ''} onChange={e => onChange({ salary2: +e.target.value || 0 })} />
        </div>
        <div className="mpr-field">
          <label htmlFor="monthlyRent">Loyer mensuel</label>
          <input id="monthlyRent" type="number" value={data.monthlyRent ?? ''} onChange={e => onChange({ monthlyRent: +e.target.value || 0 })} />
        </div>
      </div>
    </div>
  );
}
```

Le CSS requis est déjà fourni dans `senior-unified-styles.css`. Ne pas le dupliquer; l’étendre si nécessaire via variables CSS.

---

Ce guide doit être référencé dans les PRs et revu périodiquement (jalon: Mars 2026, cf. AGENTS.md).

## Guide d’Architecture — Addendum OQLF/UI (conforme “OQLF gd.md”)

Cet addendum complète la section OQLF/i18n du Guide. Il incorpore explicitement:

- Titres: seul le premier mot est en majuscule (noms propres/acronymes conservés).
- Typographie: aucune espace avant ; ! ?, espace (insécable en affichage) avant : % $.
- Langue: aucun anglicisme. Terminologie OQLF obligatoire.

Référence: “OQLF gd.md” (typography.spaces_before, capitalization.titles=first_word_only, language.no_anglicisms), AGENTS.md (exception critique pour les guillemets en code).

---

## 1) Règles OQLF formelles

### 1.1 Capitalisation des titres (français)

- Seul le premier mot prend la majuscule.

- Conserver les noms propres, acronymes (RRQ, SV, SRG), entités.

- Exemples:

  - Correct: “Planification d’urgence: guide pratique”
  - Incorrect: “Planification D’Urgence: Guide Pratique” (sur-capitalisation)

### 1.2 Espaces et ponctuation (français)

- Aucune espace avant ; ! ? (ex: “Prêt?” “Attention!” “Oui; non.”)

- Espace (insécable) avant:

  - Deux-points “:” → “Prix : 119,99 $”
  - Pourcentage “%” → “Taux : 4,5 %”
  - Dollar “$” → “1 234,56 $”

- Formats canoniques:

  - Monétaire FR (affichage): “1 234,56 $”
  - Horaire FR: “13 h 5”, “9 h 30” (sans zéro superflu)
  - Séparateurs: espace pour milliers, virgule pour décimales

### 1.3 Guillemets

- En code TS/JS/TSX: ne jamais remplacer les "guillemets droits" par « » (AGENTS.md — règle critique).
- En contenu UI (texte affiché): guillemets français autorisés (selon style éditorial), mais jamais dans les littéraux de code.

### 1.4 Terminologie (anti‑anglicismes)

- “email” → “courriel”
- “password” → “mot de passe”
- “login/logout” → “connexion/déconnexion”
- “submit” → “soumettre”/“envoyer”
- “save/update/delete” → “enregistrer/mettre à jour/supprimer”
- “settings” → “paramètres”
- “profile” → “profil”
- “budget report” → “rapport budgétaire”
- “download” → “télécharger”

Conformité vérifiée avec “OQLF gd.md”:

- spaces_before: semicolon/exclamation/question = false; colon/percent/dollar = true → aligné
- capitalization.titles = first_word_only → aligné
- language.no_anglicisms = true → aligné

---

## 2) Helpers d’implémentation (UI – affichage)

Note: ces helpers sont pour l’affichage UI. Ne pas altérer les littéraux en code (AGENTS.md).

### 2.1 Normalisation ponctuation FR

```ts
// src/utils/frenchTypography.ts
export function normalizeFrenchPunctuation(text: string): string {
  if (!text) return text;
  let s = text;

  // 1) Interdire les espaces avant ; ! ?
  s = s.replace(/\s+([;!?])/g, '$1');

  // 2) Exiger une espace avant :
  // Cas “Prix: 119” -> “Prix : 119”
  s = s.replace(/(\S):/g, '$1 :');

  // 3) Espace avant % et $ (si chiffre avant, pas déjà avec espace)
  s = s.replace(/(\d)\s*%/g, '$1 %');
  s = s.replace(/(\d)\s*\$/g, '$1 $');

  // 4) Convertir l’espace avant : % $ en NBSP pour l’affichage (optionnel)
  s = s.replace(/( :)/g, '\u00A0:');
  s = s.replace(/(\d) (\%)/g, '$1\u00A0$2');
  s = s.replace(/(\d) (\$)/g, '$1\u00A0$2');

  return s;
}
```

### 2.2 Titre: première majuscule uniquement

```ts
// src/utils/frenchTypography.ts
export function toFrenchTitleCase(str: string): string {
  if (!str) return str;
  const words = str.trim().split(/\s+/);
  return words
    .map((w, i) => {
      // préserver acronymes (RRQ/SRG, etc.)
      if (/^[A-Z]{2,}$/.test(w)) return w;
      // préserver noms propres si déjà capitalisés correctement
      if (i > 0 && /^[A-Z][a-zÀ-ÖØ-öø-ÿ-]+$/.test(w)) return w;
      // premier mot → Capitaliser première lettre, le reste minuscules (accents inclus)
      if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      // autres mots → minuscules
      return w.toLowerCase();
    })
    .join(' ');
}
```

### 2.3 Format monétaire et horaire (rappel)

- Utiliser vos utilitaires existants:

  - `formatCurrencyOQLF(1234.56) → "1 234,56 $"` (avec NBSP avant $ en rendu)
  - Heures: construire “h” avec espaces: `13 h 5`, `9 h 30` (éviter “13:05”, “13h05”)

---

## 3) Linting de contenu (prévention)

Propositions de regex (CI ou script de vérif. de contenus/labels):

- Espace interdite avant ; ! ?:
  - /\s+[;!?]/ → flagged
- Manque d’espace avant “:” (texte UI):
  - /(\S):(\S)/ → flagged (corriger en “$1 : $2”)
- Manque d’espace avant “%” / “$” après chiffres:
  - /(\d)(%)/, /(\d)(\\$)/ → flagged (corriger en “$1 $2”)
- Anglicismes (liste évolutive, insensible à la casse):
  - /(email|password|login|logout|submit|save|update|delete|settings|profile|download)/i
- Titres sur-capitalisés (heuristique):
  - /\b([A-Z][a-z]+ ){2,}/ sur titres FR → à valider manuellement

Intégration suggérée:

- Script Node dans `scripts/` qui scanne `src/**/*.tsx?` pour chaînes UI visibles et `.md` de contenu.
- Rapport CI avec compte rendu (fichiers/lignes/avant→après).

---

## 4) Checklists DoD — OQLF étendu

- [ ] Titres FR: première majuscule uniquement (noms propres/acronymes conservés)
- [ ] Aucune espace avant ; ! ?
- [ ] Espace (NBSP en affichage) avant : % $
- [ ] Montants: « 1 234,56 $ » ; Heures: « 13 h 5 »
- [ ] Guillemets français uniquement dans le contenu UI, jamais dans le code
- [ ] Aucun anglicisme dans libellés/texte; terminologie OQLF appliquée
- [ ] Vérifié contre “OQLF gd.md”

---

## 5) Cartouche de conformité à insérer dans PRs

```javascript
### OQLF (FR)
- [ ] Titres: first_word_only
- [ ] Pas d’espace avant ; ! ? ; espace avant : % $
- [ ] Montants/Heures conformes
- [ ] Pas d’anglicisme (terminologie OQLF)
- [ ] Respect de l’exception: guillemets droits en code (AGENTS.md)
- [ ] Vérifié avec OQLF gd.md
```
