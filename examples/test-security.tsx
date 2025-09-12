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