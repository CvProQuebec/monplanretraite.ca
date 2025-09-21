// TRANSFORMATIONS MANUELLES AUTORISÉES
// Modifier UNIQUEMENT ces patterns, PRÉSERVER tout le reste

// ✅ AUTORISÉ: Remplacer les classes CSS
// AVANT:
<div className="container-fluid px-4">
  <div className="row">
    <div className="col-md-6">
      <label className="form-label">Nom</label>
      <input className="form-control" {...existingProps} />
    </div>
  </div>
</div>

// APRÈS:
<div className="mpr-container">
  <div className="mpr-form">
    <div className="mpr-form-row cols-2">
      <div className="mpr-field">
        <label className="mpr-label">Nom</label>
        <input className="mpr-input" {...existingProps} />
      </div>
    </div>
  </div>
</div>

// ✅ AUTORISÉ: Ajouter des wrappers pour le layout
// AVANT:
<input value={userData.name} onChange={handleNameChange} />

// APRÈS:
<div className="mpr-field">
  <label htmlFor="userName">Nom</label>
  <input 
    id="userName"
    value={userData.name} 
    onChange={handleNameChange} 
  />
</div>

// ✅ AUTORISÉ: Restructurer le layout visuel
// AVANT:
<div className="grid grid-cols-1 md:grid-cols-3">
  <input ... />
  <input ... />
  <input ... />
</div>

// APRÈS:
<div className="mpr-form-row cols-3">
  <div className="mpr-field">
    <label>...</label>
    <input ... />
  </div>
  <div className="mpr-field">
    <label>...</label>  
    <input ... />
  </div>
  <div className="mpr-field">
    <label>...</label>
    <input ... />
  </div>
</div>

// ❌ INTERDIT: Modifier la logique
// NE PAS changer:
const handleSubmit = (e) => {
  // PRÉSERVER INTÉGRALEMENT cette logique
  e.preventDefault();
  updateUserData({ personal: newData });
  navigate('/next-page');
};

// ❌ INTERDIT: Modifier les props ou données
// NE PAS changer:
<ComplexeComponent 
  userData={userData}
  onUpdate={handleUpdate}
  config={complexConfig}
  // PRÉSERVER tous ces props
/>

// ❌ INTERDIT: Supprimer des composants
// NE PAS supprimer:
<ExistingComplexeComponent />

// ✅ AUTORISÉ: Envelopper dans du styling
<div className="mpr-section">
  <h2 className="mpr-section-title">Section Title</h2>
  <ExistingComplexeComponent />
</div>

// ✅ RÈGLE D'OR: Si c'est visuel → modifier. Si c'est logique → PRÉSERVER.
