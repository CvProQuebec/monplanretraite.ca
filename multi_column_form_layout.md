# Instructions Claude Code - Disposition multi-colonnes condensée

## OBJECTIF PRINCIPAL
Condenser les formulaires en disposant 2-3 champs par ligne selon l'espace disponible, réduire le scrolling vertical et appliquer la palette couleurs senior unifiée.

## STRATÉGIE DE DISPOSITION

### Règles de regroupement par ligne :
1. **Champs courts** (âge, pourcentage, montant) : **3 par ligne**
2. **Champs moyens** (dates, noms) : **2 par ligne**  
3. **Champs longs** (descriptions, montants complexes) : **1 par ligne**

## STRUCTURE CIBLE

### Disposition 3 colonnes (champs courts)
```typescript
<div className="senior-form-row-triple">
  <div className="senior-form-field">
    <label className="senior-form-label">Âge actuel</label>
    <input className="senior-form-input" value="58" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Prestation RRQ actuelle</label>
    <input className="senior-form-input" value="692" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Prestation RRQ à 70 ans</label>
    <input className="senior-form-input" value="1500" />
  </div>
</div>
```

### Disposition 2 colonnes (champs moyens)
```typescript
<div className="senior-form-row-double">
  <div className="senior-form-field">
    <label className="senior-form-label">Date de début AE</label>
    <input className="senior-form-input" value="2024-04-06" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Montant hebdomadaire brut</label>
    <input className="senior-form-input" value="693" />
  </div>
</div>
```

## CSS UNIFIÉ À APPLIQUER

```css
/* === CONTENEURS MULTI-COLONNES === */
.senior-form-row-triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--senior-bg-card, #ffffff);
  border-radius: var(--senior-radius, 8px);
  border: 1px solid var(--senior-border, #e2e8f0);
}

.senior-form-row-double {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--senior-bg-card, #ffffff);
  border-radius: var(--senior-radius, 8px);
  border: 1px solid var(--senior-border, #e2e8f0);
}

.senior-form-row-single {
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--senior-bg-card, #ffffff);
  border-radius: var(--senior-radius, 8px);
  border: 1px solid var(--senior-border, #e2e8f0);
}

/* === CHAMPS INDIVIDUELS === */
.senior-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.senior-form-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--senior-text-primary, #1a365d);
  line-height: 1.3;
}

.senior-form-input {
  font-size: 18px;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid var(--senior-border, #e2e8f0);
  border-radius: var(--senior-radius, 8px);
  background: var(--senior-bg-primary, #ffffff);
  color: var(--senior-text-primary, #1a365d);
}

.senior-form-input:focus {
  border-color: var(--senior-primary, #4c6ef5);
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
  outline: none;
}

/* === CARTES DE RÉSULTATS === */
.senior-result-card {
  background: var(--senior-bg-accent, #e3f2fd);
  border: 1px solid var(--senior-primary, #4c6ef5);
  border-radius: var(--senior-radius-lg, 12px);
  padding: 20px;
  margin-bottom: 20px;
}

.senior-result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.senior-result-item {
  background: var(--senior-bg-primary, #ffffff);
  padding: 16px;
  border-radius: var(--senior-radius, 8px);
  border-left: 4px solid var(--senior-success, #51cf66);
}

.senior-result-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--senior-primary, #4c6ef5);
  margin-bottom: 4px;
}

.senior-result-label {
  font-size: 14px;
  color: var(--senior-text-secondary, #4a5568);
}

/* === ALERTES COLORÉES === */
.senior-alert-warning {
  background: rgba(255, 212, 59, 0.1);
  border: 1px solid var(--senior-warning, #ffd43b);
  border-radius: var(--senior-radius, 8px);
  padding: 16px;
  margin-bottom: 20px;
}

.senior-alert-info {
  background: rgba(76, 110, 245, 0.1);
  border: 1px solid var(--senior-primary, #4c6ef5);
  border-radius: var(--senior-radius, 8px);
  padding: 16px;
  margin-bottom: 20px;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .senior-form-row-triple {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .senior-form-row-triple,
  .senior-form-row-double {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .senior-result-grid {
    grid-template-columns: 1fr;
  }
}
```

## TRANSFORMATIONS SPÉCIFIQUES PAR SECTION

### Section RRQ/CPP (Image 1)
```typescript
// Condenser les 3 champs principaux sur une ligne
<div className="senior-form-row-triple">
  <div className="senior-form-field">
    <label className="senior-form-label">Âge actuel</label>
    <input className="senior-form-input" value="58" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Prestation RRQ actuelle</label>
    <input className="senior-form-input" value="692" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Prestation RRQ à 70 ans</label>
    <input className="senior-form-input" value="1500" />
  </div>
</div>

// Résultats en cartes colorées
<div className="senior-result-grid">
  <div className="senior-result-item">
    <div className="senior-result-amount">4 152 $</div>
    <div className="senior-result-label">Période 1 - Janvier-Juin</div>
  </div>
  <div className="senior-result-item">
    <div className="senior-result-amount">1 944 $</div>
    <div className="senior-result-label">Période 2 - Juillet-Décembre</div>
  </div>
</div>
```

### Section Sécurité vieillesse (Image 2)
```typescript
// Garder les périodes côte à côte
<div className="senior-form-row-double">
  <div className="senior-result-item" style="border-left-color: var(--senior-success)">
    <div className="senior-result-amount">693 $</div>
    <div className="senior-result-label">Jan - Juin 2025</div>
  </div>
  <div className="senior-result-item" style="border-left-color: var(--senior-warning)">
    <div className="senior-result-amount">325 $</div>
    <div className="senior-result-label">Juil - Déc 2025</div>
  </div>
</div>
```

### Section Assurance emploi (Image 3)
```typescript
// Regrouper les champs par logique
<div className="senior-form-row-double">
  <div className="senior-form-field">
    <label className="senior-form-label">Date de début AE</label>
    <input className="senior-form-input" value="2024-04-06" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Montant hebdomadaire brut</label>
    <input className="senior-form-input" value="693" />
  </div>
</div>

<div className="senior-form-row-triple">
  <div className="senior-form-field">
    <label className="senior-form-label">Semaines maximum</label>
    <input className="senior-form-input" value="35" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Semaines utilisées</label>
    <input className="senior-form-input" value="0" />
  </div>
  <div className="senior-form-field">
    <label className="senior-form-label">Impôt fédéral</label>
    <input className="senior-form-input" value="21" />
  </div>
</div>
```

## VALIDATION DES TRANSFORMATIONS
- [ ] Maximum 3 champs par ligne sur desktop
- [ ] Responsive : 1 colonne sur mobile < 768px
- [ ] Palette couleurs senior appliquée
- [ ] Espacement minimum 48px pour zones cliquables
- [ ] Police minimum 18px pour les champs
- [ ] Étiquettes claires et visibles
- [ ] Réduction significative du scrolling vertical

## COMMANDE COURTE POUR CLAUDE CODE
```
Condenser les formulaires en multi-colonnes : 3 champs courts par ligne, 2 champs moyens par ligne, 1 champ long par ligne. 
Utiliser grid CSS avec gap de 20px. 
Appliquer palette couleurs senior avec variables CSS (--senior-primary, --senior-bg-card, etc.).
Objectif : réduire le scrolling vertical de 60% en optimisant l'espace horizontal.
```