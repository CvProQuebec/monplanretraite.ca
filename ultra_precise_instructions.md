# Instructions Ultra-Précises pour Claude Code - Condensation Forcée

## RÈGLE ABSOLUE
**INTERDICTION** de créer des sections qui prennent plus de 300px de hauteur. Chaque section doit être **CONDENSÉE AU MAXIMUM**.

## TRANSFORMATIONS OBLIGATOIRES - EXEMPLES CONCRETS

### 1. Section Sécurité de la vieillesse - AVANT/APRÈS

#### AVANT (INTERDIT - trop long)
```typescript
<div>
  <h3>Sécurité de la vieillesse - Profil 1</h3>
  <p>Gérez vos montants SV par période...</p>
  
  <div>
    <div>Jan - Juin 2025</div>
    <div>0 $</div>
    <div>par mois</div>
  </div>
  
  <div>
    <div>Juil - Déc 2025</div>
    <div>0 $</div>
    <div>par mois</div>
  </div>
  
  <div>
    <div>Total annuel</div>
    <div>Sécurité de la vieillesse</div>
    <div>0 $</div>
    <div>Moyenne : 0 $/mois</div>
  </div>
</div>
```

#### APRÈS (OBLIGATOIRE - condensé)
```typescript
<div className="senior-compact-section">
  <h3>Sécurité de la vieillesse - Profil 1</h3>
  
  <div className="senior-inline-grid-3">
    <div className="senior-period-card">
      <span className="period-label">Jan-Juin 2025</span>
      <span className="amount">0 $</span>
    </div>
    <div className="senior-period-card">
      <span className="period-label">Juil-Déc 2025</span>
      <span className="amount">0 $</span>
    </div>
    <div className="senior-total-card">
      <span className="total-label">Total annuel</span>
      <span className="total-amount">0 $</span>
    </div>
  </div>
  
  <div className="senior-info-line">
    <span>Montant maximum SV 2025 : 713 $/mois</span>
    <button className="senior-btn-mini">Modifier</button>
  </div>
</div>
```

### 2. Section RRQ/CPP - CONDENSATION FORCÉE

#### STRUCTURE OBLIGATOIRE
```typescript
<div className="senior-compact-section">
  <h3>RRQ/CPP - Gestion 2025</h3>
  
  <div className="senior-inline-grid-3">
    <div className="senior-field-inline">
      <label>Âge actuel</label>
      <input value="58" />
    </div>
    <div className="senior-field-inline">
      <label>Prestation actuelle</label>
      <input value="692" />
    </div>
    <div className="senior-field-inline">
      <label>Prestation à 70 ans</label>
      <input value="1500" />
    </div>
  </div>
  
  <div className="senior-results-inline">
    <div className="result-item">
      <span className="period">Période 1</span>
      <span className="amount">4 152 $</span>
    </div>
    <div className="result-item">
      <span className="period">Période 2</span>
      <span className="amount">1 944 $</span>
    </div>
    <div className="result-total">
      <span>Total 2025: 6 096 $</span>
    </div>
  </div>
</div>
```

### 3. Section Assurance Emploi - ULTRA-CONDENSÉE

#### STRUCTURE OBLIGATOIRE
```typescript
<div className="senior-compact-section">
  <h3>Assurance emploi (AE)</h3>
  
  <div className="senior-inline-grid-2">
    <div className="senior-field-inline">
      <label>Date début</label>
      <input value="2024-04-06" />
    </div>
    <div className="senior-field-inline">
      <label>Montant hebdo</label>
      <input value="693" />
    </div>
  </div>
  
  <div className="senior-inline-grid-4">
    <div className="senior-field-mini">
      <label>Sem. max</label>
      <input value="35" />
    </div>
    <div className="senior-field-mini">
      <label>Sem. util.</label>
      <input value="0" />
    </div>
    <div className="senior-field-mini">
      <label>Impôt féd.</label>
      <input value="21" />
    </div>
    <div className="senior-field-mini">
      <label>Impôt prov.</label>
      <input value="37" />
    </div>
  </div>
  
  <div className="senior-result-inline">
    <span className="result-label">Montant à ce jour:</span>
    <span className="result-amount">0 $</span>
    <button className="senior-btn-mini">Calculer</button>
  </div>
</div>
```

## CSS OBLIGATOIRE À APPLIQUER

```css
/* === SECTIONS COMPACTES === */
.senior-compact-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  max-height: 280px; /* HAUTEUR MAXIMUM FORCÉE */
}

.senior-compact-section h3 {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: #1a365d;
}

/* === GRILLES INLINE === */
.senior-inline-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.senior-inline-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.senior-inline-grid-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

/* === CHAMPS INLINE === */
.senior-field-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.senior-field-inline label {
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
  flex-shrink: 0;
}

.senior-field-inline input {
  flex: 1;
  height: 36px;
  padding: 6px 8px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.senior-field-mini {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.senior-field-mini label {
  font-size: 12px;
  font-weight: 600;
}

.senior-field-mini input {
  height: 32px;
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

/* === CARTES PÉRIODE === */
.senior-period-card {
  background: #f0f9ff;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.period-label {
  font-size: 12px;
  color: #64748b;
}

.amount {
  font-size: 18px;
  font-weight: 700;
  color: #1e40af;
}

/* === RÉSULTATS INLINE === */
.senior-results-inline {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.result-item .period {
  font-size: 12px;
  color: #64748b;
}

.result-item .amount {
  font-size: 16px;
  font-weight: 600;
  color: #059669;
}

.result-total {
  margin-left: auto;
  font-size: 16px;
  font-weight: 700;
  color: #1e40af;
}

/* === LIGNE D'INFO === */
.senior-info-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #fffbeb;
  border-radius: 4px;
  font-size: 14px;
}

.senior-result-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f0f9ff;
  border-radius: 4px;
}

.result-label {
  font-size: 14px;
  color: #374151;
}

.result-amount {
  font-size: 18px;
  font-weight: 700;
  color: #1e40af;
}

/* === BOUTONS MINI === */
.senior-btn-mini {
  padding: 4px 12px;
  font-size: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .senior-inline-grid-3,
  .senior-inline-grid-4 {
    grid-template-columns: 1fr 1fr;
  }
  
  .senior-inline-grid-2 {
    grid-template-columns: 1fr;
  }
}
```

## VALIDATION OBLIGATOIRE

Après transformation, chaque section doit respecter :
- [ ] Hauteur maximum 280px
- [ ] 2-4 éléments par ligne selon l'espace
- [ ] Étiquettes et champs sur même ligne
- [ ] Résultats groupés visuellement
- [ ] Boutons intégrés dans le flux
- [ ] Aucun espace vide inutile

## COMMANDE DIRECTE POUR CLAUDE CODE

```
TRANSFORMATION OBLIGATOIRE : Condenser TOUTES les sections pour qu'elles prennent maximum 280px de hauteur.

ACTIONS SPÉCIFIQUES :
1. Section SV : Mettre les 2 périodes + total sur même ligne
2. Section RRQ : 3 champs principaux sur même ligne + résultats condensés  
3. Section AE : Date+montant sur ligne 1, 4 champs courts sur ligne 2
4. Tous les champs : étiquette À GAUCHE du champ, pas au-dessus

CSS : Utiliser grid avec 2-4 colonnes selon contenu. Hauteur champs = 36px max.

RÉSULTAT : Page complète visible sans scroll vertical.
```