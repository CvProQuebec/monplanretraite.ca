# CLAUDE.md — MonPlanRetraite.ca

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

---

## Projet & Langue

MonPlanRetraite.ca est une **application React + TypeScript + Vite** de planification financière et retraite, destinée aux **Canadiens de 50 à 90 ans**. Site bilingue FR/EN, mais le **français est la langue primaire**.

### Règles de langue
- Tout le texte affiché à l'utilisateur doit être en **français canadien** par défaut
- Les labels, messages d'erreur, infobulles, placeholders : toujours en français
- Les noms de variables et commentaires de code peuvent rester en anglais
- Ne jamais inventer des traductions approximatives — demander si incertain
- Ton : professionnel, rassurant, simple (audience senior 50-90 ans)
- Exemple : préférer « Votre rente mensuelle » à « Pension Amount »
- Termes québécois à respecter : RRQ (pas CPP), REER (pas RRSP), CELI (pas TFSA), AE (pas EI)

---

## Stack Technique

- **Framework :** React 18 + TypeScript
- **Build :** Vite
- **CSS :** Tailwind CSS (config personnalisée) + CSS custom properties (MPR design system)
- **Icons :** Lucide React
- **Routing :** React Router v6
- **Animations :** Framer Motion
- **UI Primitives :** Radix UI (accordion, dialog, dropdown, tabs…)
- **Charts :** Recharts + Chart.js
- **Backend :** Firebase

---

## Serveur Local

- **URL :** `http://localhost:5173`
- Ne jamais screenshooter depuis `file:///`
- Si le serveur tourne déjà, ne pas démarrer une deuxième instance

### Démarrage via `preview_start` (méthode recommandée)

Fichier `.claude/launch.json` dans le worktree :
```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "dev",
      "runtimeExecutable": "node",
      "runtimeArgs": ["H:/monplanretraite.ca/node_modules/vite/bin/vite.js", "--port", "5173"],
      "port": 5173
    }
  ]
}
```

> **⚠️ Windows spécifique :** `npm.cmd` et `npx` lèvent `spawn EINVAL` / `ENOENT` avec `preview_start` — **ne pas les utiliser**.
> Utiliser `node` + chemin absolu vers `vite.js` dans le **dépôt principal** (le worktree n'a pas son propre `node_modules`).

### Démarrage manuel (fallback)
```bash
node H:/monplanretraite.ca/node_modules/vite/bin/vite.js --port 5173
```

---

## Workflow Screenshot

- Puppeteer installé à `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache : `C:/Users/nateh/.cache/puppeteer/`.
- **Toujours screenshooter depuis localhost :** `node screenshot.mjs http://localhost:5173`
- Screenshots sauvegardés dans `./temporary screenshots/screenshot-N.png` (auto-incrémenté, jamais écrasé)
- Suffix optionnel : `node screenshot.mjs http://localhost:5173 label` → `screenshot-N-label.png`
- `screenshot.mjs` se trouve à la racine du projet. L'utiliser tel quel.
- Après screenshot, lire le PNG depuis `temporary screenshots/` avec l'outil Read pour analyse visuelle
- Comparaison spécifique : « titre à 32px mais référence montre ~24px », « espacement carte 16px, devrait être 24px »
- Vérifier : espacement/padding, taille/graisse/interligne de police, couleurs (hex exact), alignement, border-radius, ombres, taille images

---

## Assets de Marque

- Les assets se trouvent dans **`/public/`** (pas de dossier `brand_assets/`)
  - Logo principal : `/public/logo-planretraite.png`
  - Favicon : `/public/logo-planretraite-favicon.png`
  - Icône Windows : `/public/MonPlanRetraite32.ico`
- **Toujours utiliser le vrai logo** — ne pas substituer par un placeholder
- Vérifier `/public/` avant toute conception

---

## Palette de Couleurs (Système MPR)

La palette est **ancrée dans le logo** (fleur de lis marine + flèche dorée). Source de vérité unique : `src/styles/mpr-unified.css`.

### Bleu marine — couleur maîtresse (logo, titres, header)
| Variable CSS | Classe Tailwind | Hex | Usage |
|-------------|-----------------|-----|-------|
| `--mpr-navy` | `mpr-navy` | `#1B3868` | Logo pur — H1, header, éléments institutionnels |
| `--mpr-navy-dark` | `mpr-navy-dark` | `#142B52` | Hover marine |
| `--mpr-navy-mid` | `mpr-navy-mid` | `#243F80` | H2, éléments forts |

### Bleu interactif — boutons / liens / focus
| Variable CSS | Classe Tailwind | Hex | Usage |
|-------------|-----------------|-----|-------|
| `--mpr-primary` | `mpr-interactive` | `#2B5BA8` | Boutons primaires, liens |
| `--mpr-primary-hover` | `mpr-interactive-dk` | `#1F4A8F` | Hover des boutons |
| `--mpr-primary-light` | `mpr-interactive-lt` | `#EBF0FA` | Fonds actifs, hover discrets |

### Or MPR — accent (flèche logo, CTA)
| Variable CSS | Classe Tailwind | Hex | Usage |
|-------------|-----------------|-----|-------|
| `--mpr-gold` | `mpr-gold` | `#C8922A` | CTA principaux, badges, progression |
| `--mpr-gold-hover` | `mpr-gold-dark` | `#A87620` | Hover gold |
| `--mpr-gold-light` | `mpr-gold-light` | `#F5D89B` | Fonds dorés |
| `--mpr-gold-faint` | `mpr-gold-faint` | `#FDF6E3` | Alertes positives |

### Texte, fonds, statuts
| Variable CSS | Hex | Usage |
|-------------|-----|-------|
| `--mpr-text` | `#1a2744` | Corps de texte (AAA) |
| `--mpr-text-muted` | `#4A5568` | Aide, sous-texte |
| `--mpr-bg-section` | `#f8fafc` | Sections alternées |
| `--mpr-bg-accent` | `#EBF0FA` | Fond accent marine clair |
| `--mpr-border` | `#e2e8f0` | Bordures standard |
| `--mpr-success` | `#16a34a` | Succès |
| `--mpr-warning` | `#C8922A` | Avertissements (or MPR) |
| `--mpr-error` | `#dc2626` | Erreurs |

### Titres (hiérarchie marine → interactif)
| Niveau | Hex |
|--------|-----|
| H1 | `#1B3868` (marine logo) |
| H2 | `#243F80` (marine mid) |
| H3 | `#2B5BA8` (interactif) |
| H4 | `#1f2937` (gris foncé) |

**Ne jamais utiliser :** `#4c6ef5`, `#2B4C8C`, `#FF6B35`, `#364fc7`, ou tout bleu Tailwind par défaut (indigo-500, blue-600). Ces couleurs sont des anciens résidus supprimés.

---

## Typographie

### Polices (deux familles complémentaires)
- **Affichage / titres héros :** `Poppins` 700/800 — grands titres, accroches (écho au logo)
- **Corps / UI :** `Inter` 400/500/600/700 — formulaires, texte courant, labels
- Stack corps : `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
- Chargement : Google Fonts importé dans `mpr-unified.css`

### Tailles (optimisées seniors — accessibilité prioritaire)
| Variable | Valeur | Usage |
|----------|--------|-------|
| `--mpr-text-sm` | `16px` | Minimum absolu |
| `--mpr-text-base` | `18px` | Corps de texte, inputs |
| `--mpr-text-lg` | `20px` | Labels de formulaire |
| `--mpr-text-xl` | `24px` | Titres de section |
| `--mpr-text-2xl` | `28px` | Titres de page |
| `--mpr-text-3xl` | `32px` | En-tête principal |

### Hiérarchie typographique
- **H1 :** Poppins 800, 32–40px, `#1B3868`, line-height 1.25
- **H2 :** Poppins 700, 28px, `#243F80`, line-height 1.3
- **H3 :** Inter 600, 24px, `#2B5BA8`, line-height 1.4
- **H4 :** Inter 600, 20px, `#1f2937`, line-height 1.45
- **Corps :** Inter 400/500, 17–18px, `#1a2744`, line-height 1.7
- **Discret :** Inter 400, 14–16px, `#4A5568`

### Règles typographiques
- `letter-spacing: 0.025em–0.03em` pour clarté (public senior)
- `line-height: 1.6–1.7` sur corps, `1.3–1.4` sur titres
- Ne pas resserrer (`-0.03em`) les titres : nuirait à la lisibilité senior

---

## Design Senior-Friendly (OBLIGATOIRE)

L'audience cible est 50–90 ans. Ces règles sont non-négociables :

- **Taille minimale des éléments cliquables :** 48px de hauteur (`min-height: 48px`)
- **Taille minimale des boutons :** 56px × 120px
- **Police minimum :** 16px (jamais en dessous)
- **Contraste :** Niveau AAA WCAG obligatoire (ratio ≥ 7:1 sur texte normal)
- **Labels :** Jamais ambigus — toujours descriptifs et visibles
- **États visuels clairs :** Hover, focus-visible et active obligatoires sur chaque élément interactif
- **Pas d'icônes seules :** Toujours accompagnées d'un libellé texte
- **Focus visible :** `box-shadow: 0 0 0 3px rgba(43, 91, 168, 0.15)` sur focus
- **Pas de sélecteur de calendrier natif** (masquer avec `appearance: none`)
- **Feedback immédiat** sur toute action (confirmation, animation légère)

---

## Tokens de Design (Espacements, Bordures, Ombres)

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
  background: #2B5BA8;   /* mpr-interactive */
  color: white;
  min-height: 56px;
  min-width: 120px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
}
.mpr-btn-primary:hover { background: #1F4A8F; transform: translateY(-1px); } /* mpr-interactive-dk */

.mpr-btn-secondary {
  background: #ffffff;
  color: #2B5BA8;        /* mpr-interactive */
  border: 2px solid #2B5BA8;
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
border-color: #2B5BA8;  /* mpr-interactive */
box-shadow: 0 0 0 3px rgba(43, 91, 168, 0.15);
```

### Grille de formulaire
- Pattern horizontal : label (160–200px fixe) + input (1fr)
- Grilles : `.cols-1`, `.cols-2`, `.cols-3`, `.cols-4` avec `gap: 16px`
- Labels en `white-space: nowrap` avec `text-overflow: ellipsis`

### Cartes de résultat
```css
.mpr-result-card {
  background: #EBF0FA;   /* mpr-interactive-lt */
  border: 1px solid #2B5BA8; /* mpr-interactive */
  border-radius: 8px;
  padding: 8px;
  text-align: center;
}
.mpr-result-amount {
  font-size: 24px;
  font-weight: 700;
  color: #2B5BA8;        /* mpr-interactive */
}
```

### Navigation (soulignement animé)
- Couleur : `#d97706` (amber-600)
- Animation : `scale-x` de `0` → `1` au hover (origin droite → gauche)
- Transition : `300ms ease`

---

## Architecture CSS — Règles de Priorité

### Problème de spécificité `.seniors-mode`

**Contexte :** `Layout.tsx` enveloppe toutes les pages dans `.seniors-mode`. Cela crée un conflit de spécificité avec les classes utilitaires Tailwind.

| Sélecteur | Spécificité | Exemple |
|-----------|-------------|---------|
| `.seniors-mode h2` (dans `accessibility-seniors.css`) | 0-1-1 | **Gagne** sur Tailwind |
| `text-mpr-navy` (Tailwind utilitaire) | 0-1-0 | **Perd** contre `.seniors-mode h2` |

**Solution appliquée :** La propriété `color` a été **retirée** des règles `.seniors-mode h1/h2/h3/h4/p` dans `accessibility-seniors.css`, de sorte que les classes Tailwind (`text-white`, `text-mpr-navy`, etc.) s'appliquent normalement.

**Règle de secours** dans `mpr-unified.css` pour les titres sur fonds sombres :
```css
.seniors-mode [class*="from-mpr-navy"] h1,
.seniors-mode [class*="from-mpr-navy"] h2,
.seniors-mode [class*="from-mpr-navy"] h3,
.seniors-mode [class*="from-mpr-navy"] h4 {
  color: white !important;
}
```

**Règle à retenir :** Ne jamais mettre `color` sur les éléments HTML nus dans les CSS globaux — toujours laisser les classes Tailwind contrôler la couleur.

---

## Règles Anti-Générique

- **Couleurs :** Utiliser exclusivement la palette MPR définie ci-dessus
- **Ombres :** Jamais `shadow-md` plat. Ombres layered avec faible opacité
- **Typographie :** Inter uniquement. Tailles généreuses (min 16px). Pas de condensé
- **Gradients :** Multiples gradients radiaux superposés si besoin de profondeur
- **Animations :** Animer uniquement `transform` et `opacity`. Jamais `transition-all`
- **États interactifs :** Hover + focus-visible + active sur chaque élément cliquable
- **Espacement :** Tokens définis ci-dessus — pas de valeurs Tailwind aléatoires
- **Profondeur :** Système de calques : base → élevé → flottant (pas tout au même niveau z)

---

## Règles Strictes

- Ne pas ajouter de sections, features ou contenus absents de la référence
- Ne pas « améliorer » un design de référence — le reproduire fidèlement
- Ne pas s'arrêter après un seul pass de screenshot
- Ne jamais utiliser `transition-all`
- Ne jamais utiliser les couleurs Tailwind par défaut (blue, indigo) comme couleur primaire
- Tout texte UI visible par l'utilisateur doit être en **français**
- Respecter les termes québécois : RRQ, REER, CELI, AE
- Contraste AAA WCAG obligatoire (audience senior)
- Taille de police minimum : **16px** sans exception
