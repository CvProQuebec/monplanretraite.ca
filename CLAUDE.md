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

- **Commande de démarrage :** `npm run dev` (Vite sur port 5173)
- **URL :** `http://localhost:5173`
- Ne jamais screenshooter depuis `file:///`
- Si le serveur tourne déjà, ne pas démarrer une deuxième instance

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

Le design system officiel est défini dans `/src/styles/mpr-unified.css`. **Utiliser exclusivement ces valeurs :**

### Couleurs primaires
| Rôle | Variable CSS | Hex | Usage |
|------|-------------|-----|-------|
| Primaire | `--mpr-primary` | `#4c6ef5` | Boutons, liens, focus, résultats |
| Primaire hover | `--mpr-primary-hover` | `#364fc7` | État survol des éléments primaires |
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

### Police
- **Une seule famille :** `Inter` (sans-serif), pas de pairing avec une serif
- Stack complète : `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`

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
- **H1 :** 32px, `#0f172a`, bold, letter-spacing 0.3px
- **H2 :** 28px, `#1a365d`, semibold
- **H3 :** 24px, `#1e3a8a`, semibold
- **H4 :** 20px, `#1f2937`, semibold
- **Corps :** 16–18px, `#1a365d`, regular, line-height 1.6–1.7
- **Discret :** 14px, `#4a5568`

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
- **Focus visible :** `box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.15)` sur focus
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
- Pattern horizontal : label (160–200px fixe) + input (1fr)
- Grilles : `.cols-1`, `.cols-2`, `.cols-3`, `.cols-4` avec `gap: 16px`
- Labels en `white-space: nowrap` avec `text-overflow: ellipsis`

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
