# Instructions de Validation pour l'Agent OQLF

## Tests de Sécurité à Effectuer

### 1. Test sur le fichier de sécurité
```bash
# Tester que l'agent ne modifie que le texte français d'affichage
claude-code test --agent=oqlf-agent --dry-run --validate-scope

# Tester sur fichier de contrôle
claude-code test --agent=oqlf-agent examples/test-security.tsx
```

### 2. Résultats Attendus du Test de Sécurité

Le fichier `examples/test-security.tsx` DOIT être modifié comme suit :

#### AVANT (état actuel)
```typescript
{isFrench && "Mon Plan De Retraite"} {/* ← DOIT ÊTRE CORRIGÉ */}
<span>Prix:100$</span> {/* ← DOIT ÊTRE CORRIGÉ */}
```

#### APRÈS (corrections OQLF attendues)
```typescript
{isFrench && "Mon plan de retraite"} {/* ← CORRIGÉ : première majuscule seulement */}
<span>Prix : 100 $</span> {/* ← CORRIGÉ : espace avant : et avant $ */}
```

#### ÉLÉMENTS QUI NE DOIVENT JAMAIS CHANGER
```typescript
const className = "btn-primary"; // ← NE DOIT PAS ÊTRE MODIFIÉ
{isEnglish && "My Retirement Plan"} // ← NE DOIT PAS ÊTRE MODIFIÉ
export default Component; // ← NE DOIT PAS ÊTRE MODIFIÉ
```

### 3. Commandes d'Utilisation Sécurisées

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

### 4. Validation Post-Application

Après application de l'agent OQLF, TOUJOURS vérifier :

1. **Compilation TypeScript**
```bash
npm run typecheck
```

2. **Build réussi**
```bash
npm run build
```

3. **Aucune erreur de syntaxe**
```bash
npm run lint
```

### 5. Points de Contrôle Critiques

- [ ] Les guillemets droits \" dans le code sont PRÉSERVÉS
- [ ] Le texte anglais n'est PAS modifié
- [ ] Les noms de classe CSS ne sont PAS touchés
- [ ] Les imports/exports fonctionnent toujours
- [ ] Le site se compile sans erreur

### 6. Rollback d'Urgence

En cas de problème détecté :
```bash
# Rollback si problème détecté
claude-code rollback --agent=oqlf-agent --to-backup

# Ou restauration manuelle
git checkout HEAD -- [fichiers_problématiques]
```

## Configuration de l'Agent

L'agent OQLF a été configuré avec les règles de sécurité suivantes :

- **Exclusions critiques** : JavaScript, TypeScript, JSX, TSX code
- **Portée limitée** : Texte d'affichage français uniquement  
- **Préservation** : Guillemets droits, texte anglais, attributs HTML
- **Fichiers ciblés** : *.html, *.vue, *.jsx, *.tsx uniquement

## Prompt Système de l'Agent

L'agent utilise le prompt système suivant :

```
Vous êtes un agent spécialisé dans l'application des normes OQLF (Office québécois de la langue française).

MISSION : Corriger UNIQUEMENT le texte français d'affichage dans les interfaces web.

⚠️  RÈGLES DE SÉCURITÉ CRITIQUES ⚠️

1. NE JAMAIS modifier le code JavaScript/TypeScript/JSX/TSX
2. NE JAMAIS remplacer les guillemets droits " dans le code
3. NE JAMAIS modifier le texte anglais
4. NE JAMAIS modifier les fichiers .txt ou .md
5. UNIQUEMENT corriger le texte français destiné à l'affichage
```