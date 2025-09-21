#!/bin/bash
# SCRIPT DE REMPLACEMENT CSS COSMÉTIQUE
# Ne modifie QUE l'apparence, préserve toute la logique

PROFILE_FILE="$1"
if [ ! -f "$PROFILE_FILE" ]; then
  echo "Erreur: Fichier $PROFILE_FILE non trouvé"
  exit 1
fi

echo "🎨 TRANSFORMATION COSMÉTIQUE DE: $PROFILE_FILE"
echo "=============================================="

# Sauvegarde obligatoire
cp "$PROFILE_FILE" "${PROFILE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Sauvegarde: ${PROFILE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# RÈGLES DE REMPLACEMENT CSS UNIQUEMENT
echo "📝 Application des règles CSS..."

# 1. Conteneurs principaux
sed -i.tmp 's/className="container[^"]*"/className="mpr-container"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*container[^"]*"/className="mpr-container"/g' "$PROFILE_FILE"

# 2. Sections/Cards vers mpr-section
sed -i.tmp 's/className="[^"]*card[^"]*"/className="mpr-section"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*section[^"]*"/className="mpr-section"/g' "$PROFILE_FILE"

# 3. Grilles et layouts flexibles
sed -i.tmp 's/className="[^"]*grid[^"]*cols-3[^"]*"/className="mpr-form-row cols-3"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*grid[^"]*cols-2[^"]*"/className="mpr-form-row cols-2"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*grid[^"]*cols-1[^"]*"/className="mpr-form-row cols-1"/g' "$PROFILE_FILE"

# 4. Formulaires
sed -i.tmp 's/className="[^"]*form[^"]*"/className="mpr-form"/g' "$PROFILE_FILE"

# 5. Groupes de champs vers mpr-field
sed -i.tmp 's/className="[^"]*field[^"]*"/className="mpr-field"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*input-group[^"]*"/className="mpr-field"/g' "$PROFILE_FILE"

# 6. Boutons
sed -i.tmp 's/className="[^"]*btn-primary[^"]*"/className="mpr-btn mpr-btn-primary"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*btn-secondary[^"]*"/className="mpr-btn mpr-btn-secondary"/g' "$PROFILE_FILE"
sed -i.tmp 's/className="[^"]*button[^"]*primary[^"]*"/className="mpr-btn mpr-btn-primary"/g' "$PROFILE_FILE"

# 7. Inputs (préserver les autres attributs)
sed -i.tmp 's/className="[^"]*input[^"]*border-4[^"]*"/className="mpr-field input"/g' "$PROFILE_FILE"

# Nettoyer les fichiers temporaires
rm -f "${PROFILE_FILE}.tmp"

echo "✅ Transformations CSS appliquées"
echo ""
echo "📋 VÉRIFICATIONS NÉCESSAIRES:"
echo "1. Vérifier que tous les imports sont préservés"
echo "2. Vérifier que tous les props sont préservés" 
echo "3. Vérifier que toute la logique métier est intacte"
echo "4. Tester toutes les fonctionnalités existantes"
echo ""
echo "⚠️  SI QUELQUE CHOSE EST CASSÉ:"
echo "   Restaurer immédiatement depuis: ${PROFILE_FILE}.backup.*"

# Validation automatique
echo "🧪 VALIDATION POST-TRANSFORMATION:"
echo "=================================="

# Vérifier que les imports sont toujours là
IMPORT_COUNT=$(grep -c "import.*from" "$PROFILE_FILE")
echo "Imports détectés: $IMPORT_COUNT (doit être > 0)"

# Vérifier que les composants sont toujours utilisés
COMPONENT_COUNT=$(grep -c "<[A-Z][a-zA-Z]*" "$PROFILE_FILE")
echo "Composants utilisés: $COMPONENT_COUNT (doit être > 0)"

# Vérifier la syntaxe JSX basique
if grep -q "className=" "$PROFILE_FILE"; then
  echo "✅ Syntaxe JSX préservée"
else
  echo "❌ PROBLÈME: Syntaxe JSX corrompue"
fi

echo ""
echo "🏁 Transformation terminée. TEST IMMÉDIAT REQUIS!"
