# Instructions Claude Code - Agent Police OQLF (Version Révisée)

## 🚨 RÈGLE CRITIQUE DE SÉCURITÉ

**ATTENTION ABSOLUE** : **NE JAMAIS** remplacer les guillemets droits " par des chevrons « » dans le code JavaScript/TypeScript/JSX. Les guillemets droits sont ESSENTIELS pour le fonctionnement du code.

**HISTORIQUE CRITIQUE** : Ce remplacement a causé un crash complet du site et nécessité une restauration depuis sauvegarde.

## Commande pour créer l'agent

```bash
claude-code create oqlf-agent --type=inspector --scope=display-text-only
```

## Configuration de l'agent

### 1. Fichier de configuration `.claude-code/oqlf-agent.json`

```json
{
  "name": "Agent Police OQLF",
  "description": "Inspecteur automatique des normes du français québécois POUR TEXTE D'AFFICHAGE UNIQUEMENT",
  "scope": "display-content-french",
  "critical_exclusions": {
    "never_modify": [
      "javascript_code",
      "typescript_code", 
      "jsx_code",
      "tsx_code",
      "css_selectors",
      "html_attributes",
      "json_properties",
      "english_text"
    ]
  },
  "rules": {
    "typography": {
      "spaces_before": {
        "semicolon": false,
        "exclamation": false,
        "question": false,
        "colon": true,
        "percent": true,
        "dollar": true
      },
      "quotes": {
        "preserve_code_quotes": true,
        "use_french_display_only": true,
        "pattern_display": "« … »"
      },
      "numbers": {
        "thousand_separator": " ",
        "decimal_separator": ","
      },
      "currency": {
        "format": "1 234,56 $",
        "space_before_symbol": true
      },
      "percentage": {
        "format": "97,5 %",
        "decimal_comma": true,
        "space_before_percent": true
      },
      "time": {
        "format": "15 h 5",
        "no_leading_zero": true,
        "space_around_h": true
      }
    },
    "capitalization": {
      "titles": "first_word_only",
      "preserve_proper_nouns": true,
      "examples": {
        "correct": "Mon plan de retraite",
        "incorrect": "Mon Plan De Retraite"
      }
    },
    "language": {
      "no_anglicisms": true,
      "quebec_context": true,
      "replacements": {
        "email": "courriel",
        "password": "mot de passe",
        "login": "connexion",
        "logout": "déconnexion",
        "submit": "soumettre",
        "cancel": "annuler",
        "save": "enregistrer",
        "update": "mettre à jour",
        "delete": "supprimer",
        "backup": "sauvegarde",
        "blog": "blogue",
        "newsletter": "infolettre",
        "template": "modèle",
        "frame": "structure",
        "loader": "charger",
        "preview": "aperçu",
        "drag and drop": "glisser et déposer",
        "cash flow": "flux de trésorerie",
        "coastfire": "liberté financière précoce",
        "chatter": "clavarder",
        "downloader": "télécharger",
        "spliter": "partager",
        "se loguer": "se connecter",
        "controle": "contrôle",
        "license": "licence",
        "transfer": "transfert",
        "ampoule LED": "ampoule DEL"
      }
    }
  },
  "file_patterns": [
    "**/*.html",
    "**/*.vue", 
    "**/*.jsx",
    "**/*.tsx"
  ],
  "exclude_patterns": [
    "**/*.txt",
    "**/*.md",
    "**/*.js",
    "**/*.ts",
    "**/*.json",
    "**/*.css"
  ]
}
```

### 2. Prompt système révisé pour l'agent

```
Vous êtes un agent spécialisé dans l'application des normes OQLF (Office québécois de la langue française).

MISSION : Corriger UNIQUEMENT le texte français d'affichage dans les interfaces web.

⚠️  RÈGLES DE SÉCURITÉ CRITIQUES ⚠️

1. NE JAMAIS modifier le code JavaScript/TypeScript/JSX/TSX
2. NE JAMAIS remplacer les guillemets droits " dans le code
3. NE JAMAIS modifier le texte anglais
4. NE JAMAIS modifier les fichiers .txt ou .md
5. UNIQUEMENT corriger le texte français destiné à l'affichage

IDENTIFICATEURS DE TEXTE À CORRIGER :
- Texte dans les balises HTML pour affichage
- Chaînes marquées avec {isFrench && "texte français"}
- Propriétés label="texte français"
- Contenu title="texte français"
- Texte après traduction française

RÈGLES OQLF À APPLIQUER :

1. TYPOGRAPHIE
   - Aucune espace avant : ; ! ?
   - Espace insécable avant : : % $
   - Format monétaire : 1 234,56 $
   - Format pourcentage : 97,5 %
   - Format horaire : 15 h 5 (avec espaces autour du h)
   - Séparateur de milliers : espace insécable

2. MAJUSCULES - CRITIQUE
   - Titres : SEUL le premier mot en majuscule
   - "Mon plan de retraite" ✅
   - "Mon Plan De Retraite" ❌
   - Conserver les noms propres et acronymes

3. TERMINOLOGIE QUÉBÉCOISE
   - Remplacer les anglicismes par les termes OQLF
   - email → courriel, password → mot de passe, etc.

PROCESSUS DE CORRECTION :
1. Identifier UNIQUEMENT le texte français d'affichage
2. Vérifier conformité OQLF
3. Appliquer corrections si nécessaire
4. IGNORER tout le reste (code, anglais, fichiers système)

RÉPONSE ATTENDUE :
- Liste des corrections apportées au texte d'affichage français
- Score de conformité OQLF
- Aucune modification au code ou texte anglais
```

### 3. Commandes d'utilisation sécurisées

#### Inspection ciblée - texte français seulement
```bash
claude-code inspect --agent=oqlf-agent --scope=french-display-only src/
```

#### Mode correction sécurisé
```bash
claude-code fix --agent=oqlf-agent --french-text-only --no-code-modification src/
```

#### Rapport de conformité français
```bash
claude-code report --agent=oqlf-agent --french-content-only --output=oqlf-report.html
```

### 4. Configuration de sécurité avancée

#### Fichier `.oqlf-safe-config`
```json
{
  "safety_rules": {
    "preserve_code_quotes": true,
    "english_text_untouched": true,
    "french_display_only": true,
    "exclude_system_files": true
  },
  "scope_identifiers": {
    "french_content": [
      "{isFrench && \"",
      "label=\"[français]",
      "title=\"[français]",
      "<span>[français]</span>"
    ]
  },
  "forbidden_modifications": [
    "className=\"",
    "import \"",
    "export \"",
    "const \"",
    "function \"",
    "interface \"",
    "style={{",
    "\"use strict\""
  ]
}
```

#### Règles d'exclusion strictes
```json
{
  "exclusion_patterns": {
    "code_blocks": [
      "```*```",
      "<script>*</script>",
      "<style>*</style>",
      "className=*",
      "import *",
      "export *"
    ],
    "english_content": [
      "{isEnglish && *}",
      "lang=\"en\"*",
      "<!-- EN: * -->"
    ],
    "system_files": [
      "*.txt",
      "*.md", 
      "*.json",
      "*.config.*",
      "package.*"
    ]
  }
}
```

### 5. Exemples de corrections autorisées

#### ✅ CORRECTIONS AUTORISÉES

```typescript
// AVANT
{isFrench && "Mon Plan De Retraite"}
{isFrench && "Prix:100$"}
{isFrench && "15:30"}
{isFrench && "97.5%"}
{isFrench && "Email:"}

// APRÈS
{isFrench && "Mon plan de retraite"}
{isFrench && "Prix : 100 $"}
{isFrench && "15 h 30"}
{isFrench && "97,5 %"}
{isFrench && "Courriel :"}
```

#### ❌ MODIFICATIONS INTERDITES

```typescript
// NE JAMAIS MODIFIER LE CODE
const className = "btn-primary"; // ← GARDER LES GUILLEMETS
import { Component } from "react"; // ← NE PAS TOUCHER
const price = "100$"; // ← VARIABLE INTERNE, IGNORER

// NE JAMAIS MODIFIER L'ANGLAIS
{isEnglish && "My Retirement Plan"} // ← LAISSER INTACT
```

### 6. Tests de sécurité obligatoires

#### Validation avant application
```bash
# Vérifier que l'agent ne modifie que le texte français d'affichage
claude-code test --agent=oqlf-agent --dry-run --validate-scope

# Tester sur fichier de contrôle
claude-code test --agent=oqlf-agent examples/test-security.tsx
```

#### Fichier de test de sécurité `examples/test-security.tsx`
```typescript
// Ce fichier teste que l'agent ne casse rien

const Component = () => {
  const className = "btn-primary"; // ← NE DOIT PAS ÊTRE MODIFIÉ
  
  return (
    <div className={className}>
      {isFrench && "Mon Plan De Retraite"} {/* ← DOIT ÊTRE CORRIGÉ */}
      {isEnglish && "My Retirement Plan"} {/* ← NE DOIT PAS ÊTRE MODIFIÉ */}
      <span>Prix:100$</span> {/* ← DOIT ÊTRE CORRIGÉ */}
    </div>
  );
};

export default Component; // ← NE DOIT PAS ÊTRE MODIFIÉ
```

### 7. Intégration CI/CD sécurisée

#### GitHub Actions avec vérifications
```yaml
name: Vérification OQLF Sécurisée
on: [push, pull_request]
jobs:
  oqlf-safe-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Vérification sécurité avant OQLF
        run: |
          # Backup avant modifications
          cp -r src/ src-backup/
      - uses: anthropic/claude-code@v1
      - name: Test OQLF sécurisé
        run: |
          claude-code inspect --agent=oqlf-agent --french-only --validate
      - name: Vérification intégrité code
        run: |
          # Vérifier que le code compile toujours
          npm run typecheck
          npm run build
```

### 8. Monitoring et récupération

#### Surveillance des modifications
```bash
# Générer diff des modifications pour review
claude-code diff --agent=oqlf-agent --before-after

# Rollback si problème détecté
claude-code rollback --agent=oqlf-agent --to-backup
```

## Utilisation recommandée sécurisée

1. **Test initial** : `claude-code test --dry-run`
2. **Backup obligatoire** : Toujours sauvegarder avant modifications
3. **Scope français uniquement** : `--french-display-only`
4. **Vérification post-modification** : Compiler et tester
5. **Review manuelle** : Examiner le diff avant commit

## Exemples de normes OQLF révisées

### Format des montants (texte d'affichage seulement)
```typescript
// Dans le texte affiché à l'utilisateur
{isFrench && "Prix : 1 234,56 $"}   // ✅ Correct
{isFrench && "Total : 97,5 %"}      // ✅ Correct  
{isFrench && "Heure : 15 h 30"}     // ✅ Correct
{isFrench && "Titre : Mon plan de retraite"} // ✅ Correct
```

Cette configuration révisée met l'accent sur la sécurité et évite les modifications destructrices du code tout en appliquant correctement les normes OQLF au contenu français destiné à l'affichage.