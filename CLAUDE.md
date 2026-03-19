# CLAUDE.md — MonPlanRetraite.ca
> Référence unique pour tous les agents IA (Claude, Cursor, Copilot…). Mis à jour : **mars 2026**.
> Remplace : `private-docs/LLM/AGENTS.md`, `private-docs/LLM/architecture.md`, `private-docs/LLM/Claude.md`

## Always Do First
- **Invoquer le skill `frontend-design`** avant d'écrire du code frontend, à chaque session, sans exception.

---

## Projet & Langue

MonPlanRetraite.ca est une **application React + TypeScript + Vite** de planification financière et retraite, destinée aux **Canadiens de 50 à 90 ans**. Site bilingue FR/EN, mais le **français est la langue primaire**.

### Règles de langue
- Tout le texte affiché à l'utilisateur : **français canadien** par défaut
- Labels, messages d'erreur, infobulles, placeholders : toujours en français
- Noms de variables et commentaires de code : peuvent rester en anglais
- Ne jamais inventer des traductions approximatives — demander si incertain
- Ton : professionnel, rassurant, simple (audience senior 50–90 ans)
- Exemple : préférer « Votre rente mensuelle » à « Pension Amount »
- **Termes québécois à respecter : RRQ (pas CPP), REER (pas RRSP), CELI (pas TFSA), AE (pas EI)**

### Règles OQLF (CRITIQUES)
- **JAMAIS** remplacer les guillemets droits `"` par des chevrons `« »` dans le code JS/TS — casse le code
- Montants : `1 234,56 $` (espaces, virgule décimale, espace avant `$`)
- Pourcentages : espace insécable avant `%` dans le texte affiché
- Heures : `13 h 05`, `9 h 30` (format québécois)
- Majuscules : seul le premier mot des titres en français (pas de Title Case)
- Centraliser les libellés FR/EN dans `src/features/retirement/translations/index.ts`

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| CSS | Tailwind CSS (config personnalisée) + CSS custom properties (MPR design system) |
| Icons | Lucide React |
| Routing | React Router v6 (modulaire — 6+ groupes) |
| Animations | Framer Motion |
| UI Primitives | Radix UI (accordion, dialog, dropdown, tabs…) |
| Charts | Recharts + Chart.js |
| Backend / Auth | Firebase |
| Tests | Vitest + Playwright (e2e) + Jest |
| Déploiement | Netlify |

---

## Serveur Local

- **Commande :** `npm run dev` (Vite, port 5173 par défaut)
- **URL :** `http://localhost:5173`
- Si le port 5173 est occupé par un autre projet : `npm run dev -- --port 5174`
- Ne jamais screenshooter depuis `file:///`
- Ne pas démarrer une deuxième instance si le serveur tourne déjà

---

## Workflow Screenshot (Playwright)

> `screenshot.mjs` n'existe pas dans ce projet. Utiliser Playwright avec Chrome système.

```js
// Depuis H:/monplanretraite.ca
const { chromium } = require('./node_modules/playwright');
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.screenshot({ path: './temporary screenshots/screenshot-label.png' });
await browser.close();
```

- Screenshots dans `./temporary screenshots/` (créer si absent)
- Après screenshot, lire le PNG avec l'outil Read pour analyse visuelle
- Vérifier : espacement/padding, taille/graisse de police, couleurs (hex exact), alignement, border-radius, ombres

---

## Navigation Actuelle (mars 2026)

Structure du header observée sur le site :

```
[Logo MPR]  Accueil  Commencer  Mes outils ▾  Mon dossier ▾  Articles  [FR/EN]
```

Sous-menus (dropdowns) :
- **Mes outils** → liens vers les outils par catégorie (`/outils`, `/tools`)
- **Mon dossier** → profil, revenus, budget, sauvegarde

Barre secondaire (connecté) :
```
Bonjour [Prénom]    [Déconnexion]
```

Pages principales accessibles :
- `/` ou `/accueil` → Page d'accueil
- `/commencer` → Parcours guidé / onboarding
- `/profil` → Mon Profil de Retraite (onglets : Profil | Prestations | Analyses | Rapport Intelligent | Tests | Optionnel)
- `/ma-retraite` → Dashboard retraite avec formulaire couple (Personne 1 + Personne 2 optionnel)
- `/mes-revenus` → Gestion des revenus
- `/budget` → Module Budget
- `/outils` (`/tools` EN) → Tous les outils par catégorie
- `/blog` → Articles bilingues

---

## Assets de Marque

- Assets dans **`/public/`** (pas de dossier `brand_assets/`)
  - Logo principal : `/public/logo-planretraite.png`
  - Favicon : `/public/logo-planretraite-favicon.png`
  - Icône Windows : `/public/MonPlanRetraite32.ico`
- **Toujours utiliser le vrai logo** — ne pas substituer par un placeholder
- Vérifier `/public/` avant toute conception

---

## Palette de Couleurs (Système MPR)

Définie dans `/src/styles/mpr-unified.css`. **Utiliser exclusivement ces valeurs :**

### Couleurs primaires
| Rôle | Variable CSS | Hex | Usage |
|------|-------------|-----|-------|
| Primaire | `--mpr-primary` | `#4c6ef5` | Boutons, liens, focus, résultats |
| Primaire hover | `--mpr-primary-hover` | `#364fc7` | Survol des éléments primaires |
| Accent orange | `--accent` | `#FF6B35` | Appels à l'action secondaires |
| Texte principal | `--mpr-text` | `#1a365d` | Corps de texte, labels |
| Texte discret | `--mpr-text-muted` | `#64748b` | Aide, sous-texte |

### Couleurs d'en-têtes
| Niveau | Hex |
|--------|-----|
| H1 | `#0f172a` |
| H2 | `#1a365d` |
| H3 | `#1e3a8a` |
| H4 | `#1f2937` |

### Couleurs de fond
| Rôle | Hex |
|------|-----|
| Fond principal | `#ffffff` |
| Fond section | `#f8fafc` |
| Fond carte résultat | `#f0f9ff` |
| Fond accent clair | `#e3f2fd` |

### Couleurs de bordure & état
| Rôle | Hex |
|------|-----|
| Bordure standard | `#e2e8f0` |
| Bordure focus | `#4c6ef5` |
| Succès | `#16a34a` |
| Avertissement | `#d97706` |
| Erreur | `#dc2626` |

### Accent navigation
- Soulignement hover des liens nav : **`#d97706`** (amber-600)

**Ne jamais utiliser :** indigo-500, blue-600 ou toute autre couleur Tailwind par défaut comme couleur primaire.

---

## Typographie

- **Une seule famille :** `Inter` (sans-serif)
- Stack : `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--mpr-text-sm` | `16px` | Minimum absolu |
| `--mpr-text-base` | `18px` | Corps de texte, inputs |
| `--mpr-text-lg` | `20px` | Labels de formulaire |
| `--mpr-text-xl` | `24px` | Titres de section |
| `--mpr-text-2xl` | `28px` | Titres de page |
| `--mpr-text-3xl` | `32px` | En-tête principal |

### Hiérarchie
- **H1 :** 32px, `#0f172a`, bold, letter-spacing 0.3px
- **H2 :** 28px, `#1a365d`, semibold
- **H3 :** 24px, `#1e3a8a`, semibold
- **H4 :** 20px, `#1f2937`, semibold
- **Corps :** 16–18px, `#1a365d`, regular, line-height 1.6–1.7
- `letter-spacing: 0.025em–0.03em` pour clarté senior
- Ne pas resserrer les titres (`-0.03em`) : nuit à la lisibilité senior

---

## Design Senior-Friendly (OBLIGATOIRE)

L'audience cible est 50–90 ans. Ces règles sont **non-négociables** :

- **Éléments cliquables :** `min-height: 48px`
- **Boutons :** `min-height: 56px`, `min-width: 120px`
- **Police minimum :** 16px (jamais en dessous)
- **Contraste :** Niveau AAA WCAG (ratio ≥ 7:1 sur texte normal)
- **Labels :** toujours descriptifs et visibles, jamais ambigus
- **États visuels :** hover, focus-visible et active obligatoires sur chaque élément interactif
- **Pas d'icônes seules :** toujours accompagnées d'un libellé texte
- **Focus visible :** `box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.15)`
- **Pas de sélecteur de calendrier natif** (masquer avec `appearance: none`)
- **Feedback immédiat** sur toute action

---

## Tokens de Design

### Espacements
```css
--mpr-gap-sm: 8px
--mpr-gap-md: 16px
--mpr-gap-lg: 24px
--mpr-gap-xl: 32px
```

### Border-radius
```css
--senior-radius: 8px
--senior-radius-lg: 12px
--senior-radius-xl: 16px
```

### Ombres (layered, jamais plates)
```css
--senior-shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05)
--senior-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)
--senior-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
```

---

## Patterns de Composants

### Boutons
```css
.mpr-btn-primary {
  background: #4c6ef5;
  color: white;
  min-height: 56px;
  min-width: 120px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
}
.mpr-btn-primary:hover { background: #364fc7; transform: translateY(-1px); }

.mpr-btn-secondary {
  background: #ffffff;
  color: #4c6ef5;
  border: 2px solid #4c6ef5;
}
```

### Inputs (senior-friendly)
```css
min-height: 48px;
padding: 10px 12px;
border: 2px solid #e2e8f0;
border-radius: 8px;
font-size: 18px;
font-weight: 600;       /* Valeurs en gras pour clarté */
/* Focus: */
border-color: #4c6ef5;
box-shadow: 0 0 0 3px rgba(76,110,245,0.15);
```

### Grille de formulaire
- Pattern : **1 ligne = 1 label + 1 champ** (règle absolue)
- Composants : `FormGrid`, `FormRow`, `Field` dans `src/components/forms/FormGrid.tsx`
- Classes CSS : `.mpr-form`, `.mpr-form-row`, `.mpr-field`
- Mobile : `grid-template-columns: minmax(120px, 45%) 1fr`
- Labels en `white-space: nowrap` avec `text-overflow: ellipsis`
- Grilles : `.cols-1`, `.cols-2`, `.cols-3`, `.cols-4` avec `gap: 16px`

### Cartes de résultat
```css
.mpr-result-card {
  background: #f0f9ff;
  border: 1px solid #4c6ef5;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
}
.mpr-result-amount {
  font-size: 24px;
  font-weight: 700;
  color: #4c6ef5;
}
```

### Navigation (soulignement animé)
- Couleur : `#d97706` (amber-600)
- Animation : `scale-x` de `0` → `1` au hover (origin droite → gauche)
- Transition : `300ms ease`

### Menus déroulants (Radix UI)
```tsx
// Utiliser position="item-aligned" (pas "popper")
<SelectContent
  position="item-aligned"
  side="bottom"
  avoidCollisions={true}
  sideOffset={4}
  style={{ zIndex: 9999 }}
  className="min-w-full"
/>
```

---

## Architecture des Couches

```
UI (pages, composants)
  └─→ Domaine (src/domain/* — interfaces seulement, jamais d'implémentation)
        └─→ Services (src/services/* — implémentations)
              └─→ Infra (Vite, Firebase, WebCrypto, Workers)
```

### Règles de frontières (OBLIGATOIRES)
- UI n'importe **pas** `src/workers/*` directement
- Services n'importent **pas** `src/pages/*` ou `src/components/*`
- Routes n'importent **pas** de services ou workers directement
- Vérifier avec : `npm run lint:boundaries`

### Imports recommandés
```ts
// UI → Domaine (façade retraite)
import { RetirementHelpers } from '@/domain/retirement/RetirementDomainAdapter';

// UI → Services par thème (barrels)
import { EnhancedSaveManager } from '@/services/core/persistence';
import { GamificationService } from '@/services/core/engagement';
import { BudgetComputationService } from '@/services/budget';
import { NotificationSchedulerService } from '@/services/notifications';
import { PDFEmergencyService } from '@/services/security';
import { Tax, SRG, RREGOP } from '@/services/retirement';

// Flags
import { useFlags } from '@/hooks/useFlags';
const { SHOW_PLACEHOLDERS } = useFlags();
```

---

## Routage Modulaire

`App.tsx` est un shell — il ne contient que l'assemblage des fragments de routes.

| Fichier | Contenu |
|---------|---------|
| `src/routes/mainRoutes.tsx` | Accueil FR/EN (`/`, `/fr`, `/en`, `/accueil`, `/home`) |
| `src/routes/mainRoutesCore.tsx` | Profil, retraite, revenus, budget |
| `src/routes/retirementRoutes.tsx` | Planification urgence, successorale, dépenses, simulateurs, optimisation… |
| `src/routes/governmentRoutes.tsx` | CCQ, SRG, RREGOP, RRQ/CPP, OAS/GIS, prestations |
| `src/routes/reportsRoutes.tsx` | Rapports, Wizard, Scénarios |
| `src/routes/blogRoutes.tsx` | Blog FR/EN, catégories, articles |
| `src/routes/labsRoutes.tsx` | Démos/labs (guardées par `VITE_ENABLE_LABS=false` en prod) |

### LocalizedRoute
```tsx
// Même composant FR/EN
<LocalizedRoute path="/profil" component={ProfilePage} />

// Composants distincts
<LocalizedRoute path="/accueil" componentFr={Accueil} componentEn={Home} />
```

### DoD — Ajout de routes
- [ ] Groupe dédié dans `src/routes/*.tsx` (< 200 lignes)
- [ ] `LocalizedRoute` pour les paires FR/EN
- [ ] Pages lourdes en lazy ; chunk ≤ 500 kB
- [ ] `App.tsx` garde uniquement l'assemblage

---

## Structure des Données

### Interface principale
```typescript
interface UserData {
  personal: PersonalData      // Profil + revenus + immobilier
  retirement: RetirementData  // RRQ/SV/SRG/RREGOP/CCQ
  savings: SavingsData        // REER, CELI, CRI, hypothèque
  cashflow: CashflowData      // Dépenses et budget
}
```

### Types de revenus
```typescript
type IncomeType =
  | 'salaire' | 'emploi-saisonnier' | 'rentes'
  | 'assurance-emploi' | 'dividendes'
  | 'revenus-location' | 'travail-autonome' | 'autres';
```

### Persistance des données
- `personal.netWorth`, `personal.netWorthSnapshots`
- `personal.smartGoals`, `personal.budgetIncomeHistory`
- `personal.immobilierData` (source de vérité pour hypothèque/taxes/assurance)

---

## Sauvegarde Locale

Toute action « Sauvegarder » doit utiliser :
```ts
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';

const result = await EnhancedSaveManager.saveWithDialog(userData, { includeTimestamp: true });
// Afficher feedback selon result.success / result.blocked / result.error
```

- **Chrome/Edge récents** : ouvre un sélecteur (dossier + nom de fichier)
- **Fallback** : téléchargement `<a download>` avec nom suggéré
- Ne jamais afficher un faux succès sans consulter le résultat du service

---

## Sécurité & Confidentialité (ABSOLUE)

- ❌ AUCUNE transmission réseau des données confidentielles
- ❌ AUCUN workflow n8n ou service externe
- ✅ Calculs 100 % locaux dans le navigateur
- ✅ Chiffrement AES-256-GCM (WebCrypto) + PBKDF2-SHA-256 (≥ 200 000 itérations)
- ✅ `secureStorage` (AES-GCM) pour la persistance locale
- ✅ CSP stricte sur les routes d'urgence (`public/_headers`)
- Fichiers export urgence : format `.mpru` — enveloppe JSON chiffrée, aucune donnée en clair

---

## Encodage

- Tous les fichiers `.ts/.tsx/.md` : **UTF-8 sans BOM**
- Éviter le copier-coller depuis une console non UTF-8
- Refuser tout patch qui introduit `Ã©`, `Â`, ou `\uFFFD` dans des chaînes visibles
- Pas de retours de ligne « durs » dans les littéraux de chaîne

---

## Scripts QA

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur local (port 5173) |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint:boundaries` | Frontières UI ↔ Services ↔ Workers |
| `npm run lint:mpr` | Conformité `.mpr-form` / `FormGrid` (formulaires seniors) |
| `npm run deps:check` | Cycles + imports transverses interdits |
| `npm run test` | Jest |
| `npm run test:vitest` | Vitest |
| `npm run test:e2e` | Playwright |
| `npm run qa:all` | Suite complète (typecheck + lint + deps + tests) |

**Tests prioritaires :**
- `BackgroundBackupService` : vérifier qu'aucune donnée en clair n'est écrite
- `secureStorage` : AES-GCM, edge cases, corruption
- PDF reports : aucune fuite réseau, caviardage par défaut

---

## Règles Anti-Générique

- **Couleurs :** palette MPR exclusivement (jamais `blue-600`, `indigo-500` Tailwind)
- **Ombres :** layered avec faible opacité — jamais `shadow-md` plat
- **Typographie :** Inter uniquement, tailles généreuses (min 16px), pas de condensé
- **Gradients :** multiples gradients radiaux superposés pour la profondeur
- **Animations :** uniquement `transform` et `opacity` — **jamais `transition-all`**
- **États interactifs :** hover + focus-visible + active sur chaque élément cliquable
- **Espacement :** tokens définis ci-dessus, pas de valeurs Tailwind aléatoires
- **Profondeur :** système de calques : base → élevé → flottant

---

## Règles Strictes

- Ne pas ajouter de sections, features ou contenus absents de la référence
- Ne pas « améliorer » un design de référence — le reproduire fidèlement
- Ne pas s'arrêter après un seul pass de screenshot
- **Jamais `transition-all`**
- **Jamais les couleurs Tailwind par défaut** comme couleur primaire
- Tout texte UI visible par l'utilisateur : **en français**
- Respecter les termes québécois : RRQ, REER, CELI, AE
- Contraste AAA WCAG obligatoire
- Police minimum : **16px** sans exception
- JAMAIS remplacer `"` par `« »` dans le code TypeScript/JSX
