# Instructions Claude Code - Disposition horizontale des champs

## OBJECTIF PRÉCIS
Transformer TOUS les champs de formulaire pour afficher l'étiquette et le champ de saisie sur la même ligne horizontale au lieu de lignes séparées.

## STRUCTURE ACTUELLE (à modifier)
```typescript
// AVANT (problématique - étiquette au-dessus du champ)
<div>
  <label>Épargne actuelle ($)</label>
  <input value="50000" />
</div>

<div>
  <label>Dépenses annuelles à la retraite ($)</label>
  <input value="48000" />
</div>
```

## STRUCTURE CIBLE (solution)
```typescript
// APRÈS (solution - étiquette à gauche du champ)
<div className="senior-form-row">
  <label className="senior-form-label">Épargne actuelle ($)</label>
  <input className="senior-form-input" value="50000" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Dépenses annuelles à la retraite ($)</label>
  <input className="senior-form-input" value="48000" />
</div>
```

## CSS REQUIS À AJOUTER
```css
/* Disposition horizontale étiquette + champ */
.senior-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  min-height: 48px;
}

.senior-form-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--senior-text-primary, #1a365d);
  text-align: left;
}

.senior-form-input {
  font-size: 18px;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.senior-form-input:focus {
  border-color: #4c6ef5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
  outline: none;
}

/* Responsive pour mobile */
@media (max-width: 768px) {
  .senior-form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .senior-form-label {
    text-align: left;
  }
}
```

## TRANSFORMATION ÉTAPE PAR ÉTAPE

### Étape 1 : Identifier tous les groupes label/input
```typescript
// Rechercher tous les patterns comme :
<div>
  <label>...</label>
  <input ... />
</div>

// Ou variations avec className existantes
```

### Étape 2 : Appliquer la nouvelle structure
```typescript
// Remplacer CHAQUE groupe par :
<div className="senior-form-row">
  <label className="senior-form-label">{texte_étiquette}</label>
  <input className="senior-form-input" {...props_existantes} />
</div>
```

### Étape 3 : Sections spécifiques à transformer

#### Section "Vos informations" (gauche)
```typescript
<div className="senior-form-row">
  <label className="senior-form-label">Épargne actuelle ($)</label>
  <input className="senior-form-input" value="50000" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Dépenses annuelles à la retraite ($)</label>
  <input className="senior-form-input" value="48000" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Âge actuel</label>
  <input className="senior-form-input" value="30" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Âge de retraite souhaité</label>
  <input className="senior-form-input" value="65" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Rendement annuel attendu (%)</label>
  <input className="senior-form-input" value="7" />
</div>
```

#### Section immobilière (image 2)
```typescript
<div className="senior-form-row">
  <label className="senior-form-label">Valeur actuelle</label>
  <input className="senior-form-input" value="0" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Solde d'hypothèque</label>
  <input className="senior-form-input" value="0" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Taxes municipales</label>
  <input className="senior-form-input" value="0" />
</div>

<div className="senior-form-row">
  <label className="senior-form-label">Assurances</label>
  <input className="senior-form-input" value="0" />
</div>
```

## RÉSULTAT ATTENDU
```
Épargne actuelle ($)                    [50000]
Dépenses annuelles à la retraite ($)    [48000]
Âge actuel                              [30]
Âge de retraite souhaité                [65]
Rendement annuel attendu (%)            [7]
```

Au lieu de :
```
Épargne actuelle ($)
[50000]

Dépenses annuelles à la retraite ($)
[48000]

Âge actuel
[30]
```

## VALIDATION
- [ ] Chaque étiquette est immédiatement à gauche de son champ
- [ ] Hauteur minimum 48px respectée
- [ ] Police 18px respectée
- [ ] Responsive fonctionne (mobile revient en colonne)
- [ ] Tous les formulaires transformés
- [ ] Espacement cohérent entre les lignes

## COMMANDE COURTE POUR CLAUDE CODE
```
Transforme TOUS les champs de formulaire pour disposer l'étiquette et le champ sur la même ligne horizontale. 
Utilise CSS grid avec grid-template-columns: 1fr 1fr pour chaque groupe label/input.
Applique la classe "senior-form-row" à chaque groupe.
Objectif : condenser l'espace vertical en éliminant les lignes séparées.
```