 INSTRUCTIONS CLAUDE CODE RÉVISÉES - TRANSFORMATION COSMÉTIQUE UNIQUEMENT
⚠️ RÈGLES ABSOLUES

NE PAS CRÉER DE NOUVELLE PAGE
NE PAS SUPPRIMER DE FONCTIONNALITÉS
NE PAS MODIFIER LA LOGIQUE MÉTIER
NE PAS CHANGER LES STRUCTURES DE DONNÉES
UNIQUEMENT REMPLACER LES CLASSES CSS ET LA DISPOSITION


📋 ÉTAPE 1 : ANALYSE AVANT TRANSFORMATION

# 1. Localiser la page profil exacte
find src/ -name "*[Pp]rofile*" -o -name "*[Pp]ersonal*" | grep -E '\.(tsx|ts)$'

# 2. Analyser la structure actuelle SANS MODIFIER
echo "=== ANALYSE DE LA PAGE PROFIL ==="
PROFILE_FILE=$(find src/ -name "*[Pp]rofile*" | grep "\.tsx$" | head -1)
echo "Fichier trouvé: $PROFILE_FILE"

# 3. Inventaire des composants existants
grep -n "import.*from" "$PROFILE_FILE" | head -20
echo ""
echo "=== COMPOSANTS UTILISÉS ==="
grep -n "<[A-Z][a-zA-Z]*" "$PROFILE_FILE" | head -20
echo ""
echo "=== CLASSES CSS ACTUELLES ==="
grep -o 'className="[^"]*"' "$PROFILE_FILE" | head -20

📋 ÉTAPE 2 : TRANSFORMATION CSS PURE
Commandes strictement cosmétiques :
css_replacement_rules.sh

📋 ÉTAPE 3 : TRANSFORMATION MANUELLE SÉLECTIVE
Pour les éléments que le script automatique ne peut pas gérer, modifier manuellement ET UNIQUEMENT :
🎯 TRANSFORMATIONS AUTORISÉES :
manual_transformations.ts

📋 ÉTAPE 4 : INSTRUCTIONS ULTRA-SPÉCIFIQUES
Commandes pour Claude Code :

# 1. ANALYSE OBLIGATOIRE avant toute modification
echo "=== ANALYSE OBLIGATOIRE AVANT MODIFICATION ==="
PROFILE_FILE=$(find src/ -name "*rofile*" | grep "\.tsx$" | head -1)
echo "Fichier: $PROFILE_FILE"

# Compter les éléments critiques
IMPORT_COUNT=$(grep -c "import" "$PROFILE_FILE")
COMPONENT_COUNT=$(grep -c "export\|function\|const.*=" "$PROFILE_FILE")
USEEFFECT_COUNT=$(grep -c "useEffect\|useState\|useCallback" "$PROFILE_FILE")

echo "AVANT modification:"
echo "- Imports: $IMPORT_COUNT"
echo "- Composants/fonctions: $COMPONENT_COUNT"  
echo "- Hooks: $USEEFFECT_COUNT"

# 2. TRANSFORMATION COSMÉTIQUE UNIQUEMENT
echo "=== DÉBUT TRANSFORMATION COSMÉTIQUE ==="

# Sauvegarde automatique
cp "$PROFILE_FILE" "${PROFILE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Application du script CSS
./css-replacement-script.sh "$PROFILE_FILE"

# 3. VALIDATION IMMÉDIATE
echo "=== VALIDATION POST-TRANSFORMATION ==="
IMPORT_COUNT_AFTER=$(grep -c "import" "$PROFILE_FILE")
COMPONENT_COUNT_AFTER=$(grep -c "export\|function\|const.*=" "$PROFILE_FILE")
USEEFFECT_COUNT_AFTER=$(grep -c "useEffect\|useState\|useCallback" "$PROFILE_FILE")

echo "APRÈS modification:"
echo "- Imports: $IMPORT_COUNT_AFTER"
echo "- Composants/fonctions: $COMPONENT_COUNT_AFTER"
echo "- Hooks: $USEEFFECT_COUNT_AFTER"

# ALERTES SI PERTE DE CONTENU
if [ "$IMPORT_COUNT" -ne "$IMPORT_COUNT_AFTER" ]; then
  echo "❌ ALERTE: Nombre d'imports changé!"
  echo "RESTAURER IMMÉDIATEMENT: cp ${PROFILE_FILE}.backup.* $PROFILE_FILE"
fi

if [ "$COMPONENT_COUNT" -ne "$COMPONENT_COUNT_AFTER" ]; then
  echo "❌ ALERTE: Nombre de composants changé!"
  echo "RESTAURER IMMÉDIATEMENT: cp ${PROFILE_FILE}.backup.* $PROFILE_FILE"
fi

# 4. TEST BUILD OBLIGATOIRE
echo "=== TEST BUILD OBLIGATOIRE ==="
npm run build 2>&1 | grep -i error
if [ $? -eq 0 ]; then
  echo "❌ ERREURS DE BUILD DÉTECTÉES!"
  echo "RESTAURER IMMÉDIATEMENT: cp ${PROFILE_FILE}.backup.* $PROFILE_FILE"
  exit 1
else
  echo "✅ Build successful"
fi

echo "✅ Transformation cosmétique validée"

📋 ÉTAPE 5 : CHECKLIST ULTRA-STRICTE
Validation obligatoire après chaque transformation :

echo "=== CHECKLIST DE VALIDATION STRICTE ==="
echo "[ ] Tous les imports sont préservés"
echo "[ ] Tous les composants existants sont utilisés"
echo "[ ] Toutes les fonctions métier sont intactes"
echo "[ ] Tous les hooks (useState, useEffect) sont préservés"
echo "[ ] Toutes les props sont transmises correctement"
echo "[ ] Le build compile sans erreur"
echo "[ ] Toutes les fonctionnalités marchent encore"
echo "[ ] Seulement l'apparence visuelle a changé"
echo "[ ] La navigation fonctionne identiquement"
echo "[ ] Les données sont sauvegardées correctement"

🚨 PROCÉDURE D'URGENCE EN CAS DE PROBLÈME
# Si quelque chose est cassé:
echo "🚨 RESTAURATION D'URGENCE"
PROFILE_FILE=$(find src/ -name "*rofile*" | grep "\.tsx$" | head -1)
BACKUP_FILE=$(ls -t "${PROFILE_FILE}.backup."* | head -1)

# Restaurer immédiatement
cp "$BACKUP_FILE" "$PROFILE_FILE"
echo "✅ Page restaurée depuis: $BACKUP_FILE"

# Vérifier la restauration
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Restauration réussie"
else
  echo "❌ Problème persiste - vérifier manuellement"
fi

🎯 RÉSUMÉ DES INSTRUCTIONS RÉVISÉES
Ce que Claude Code DOIT faire :

✅ Analyser la page existante complètement
✅ Sauvegarder avant toute modification
✅ Remplacer UNIQUEMENT les classes CSS
✅ Préserver 100% de la logique métier
✅ Valider immédiatement après chaque changement
✅ Tester que tout fonctionne encore

Ce que Claude Code NE DOIT JAMAIS faire :

❌ Créer une version "simplifiée"
❌ Supprimer des composants existants
❌ Modifier la logique métier
❌ Changer les structures de données
❌ Remplacer des composants complexes
❌ "Optimiser" ou "améliorer" le code existant

Cette approche garantit une transformation purement cosmétique qui conserve 100% des fonctionnalités existantes.RéessayerClaude peut faire des erreurs. Assurez-vous de vérifier ses réponses.RechercheUniformiser apparence du site web Sonnet 4