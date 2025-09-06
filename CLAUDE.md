# CLAUDE.md - Guide de référence pour les modifications

## 📋 RÉFÉRENCE OBLIGATOIRE

**Avant toute modification du site web**, consulter les **Instructions pour les Modifications** dans :
`H:\monplanretraite.ca\private-docs\architecture\AGENTS.md` (section en haut du fichier)

### Points clés à vérifier :

1. **Gestion des champs de données**
   - Récupération des données existantes
   - Mapping correct des nouveaux champs
   - Initialisation des valeurs par défaut

2. **Documentation et références**
   - Mise à jour du fichier AGENTS.md
   - Référence au roadmap du projet
   - Documentation des nouvelles fonctionnalités

3. **Checklist de validation**
   - Tests post-implémentation
   - Vérification des calculs
   - Validation de l'interface utilisateur

## 📚 WORKFLOW DE DOCUMENTATION OBLIGATOIRE

### Avant implémentation
**Créer** : `app_info/YYYY-MM-DD_desired_app_functionality.md`
- ✅ Documenter les changements désirés et exigences
- ✅ Spécifier les restrictions de niveau et logique métier
- ✅ Définir les critères de succès

### Après implémentation  
**Créer** : `app_info/YYYY-MM-DD_implementation_update.md`
- ✅ Lister tous les fichiers créés/modifiés
- ✅ Documenter les détails d'implémentation technique
- ✅ Inclure le statut de build et résultats des tests
- ✅ Noter les problèmes en attente ou issues connues

### État actuel
**Maintenir** : `app_info/YYYY-MM-DD_app_functionality.md`
- ✅ Garder un instantané à jour de la fonctionnalité actuelle
- ✅ Organiser par fonctionnalités et niveaux
- ✅ Inclure les fonctionnalités implémentées ET planifiées
- ✅ Marquer clairement comme ✅ Complété ou ⏳ En attente

---

## 🏗️ Architecture du Projet

### Structure des composants principaux

- **`src/components/ui/GlobalSummary.tsx`** - Résumé familial et calculs globaux
- **`src/components/ui/SeniorsFriendlyIncomeTable.tsx`** - Table des revenus pour Personne 1 et 2
- **`src/pages/Revenus.tsx`** - Page principale des revenus
- **`src/types/index.ts`** - Définitions des types TypeScript

### Composants de calcul

- **`src/utils/incomeCalculationUtils.ts`** - Utilitaires de calcul des revenus
- **`src/services/`** - Services de calcul et de gestion des données

---

## 🔧 Bonnes pratiques pour les modifications

### Ajout de nouveaux types de revenus

1. **Mettre à jour l'interface `IncomeEntry`** dans `SeniorsFriendlyIncomeTable.tsx`
2. **Ajouter les nouvelles options** dans les constantes (ex: `rentalFrequencies`)
3. **Mettre à jour la logique de calcul** dans `GlobalSummary.tsx`
4. **Tester** avec différentes valeurs et fréquences

### Correction de bugs de positionnement (menus déroulants)

- Utiliser `position="item-aligned"` et `side="bottom"` pour les `SelectContent`
- Éviter `position="popper"` qui cause des problèmes de positionnement
- Augmenter le z-index si nécessaire (`style={{zIndex: 9999}}`)

### Problèmes de fuseau horaire avec les dates

- **Éviter** `new Date('YYYY-MM-DD')` qui est interprété en UTC
- **Utiliser** `new Date(year, month-1, day)` pour les dates locales
- **Exemple** : 
  ```typescript
  const dateParts = dateString.split('-').map(Number);
  const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  ```

---

## 🧮 Calculs et logique métier

### Emplois saisonniers

- Calculer le nombre de mois réels entre `startDate` et `endDate`
- Utiliser `effectiveEndDate` pour les périodes passées
- Formule : `(endYear - startYear) * 12 + (endMonth - startMonth) + 1`

### Revenus de location

- **Week-end** : ~4,33 week-ends par mois (52 semaines / 12 mois)
- **Semaine** : ~4,33 semaines par mois
- **Mensuel** : montant × mois écoulés

---

## 🚀 Commandes utiles

### Développement
- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run lint` - Vérifier le code
- `npm run typecheck` - Vérifier les types TypeScript

### Git
- `git status` - Voir l'état du repository
- `git diff` - Voir les changements
- `git add .` - Ajouter tous les fichiers
- `git commit -m "message"` - Créer un commit

---

## 📝 Historique des modifications importantes

### 2025-09-06
- **Correction** : Bug de calcul emplois saisonniers (problème fuseau horaire)
- **Ajout** : Fréquences pour revenus de location (week-end, semaine, mensuel)
- **Correction** : Positionnement des menus déroulants avec `position="item-aligned"`

---

## ⚠️ Points d'attention

### Tests à effectuer après modifications
1. **Calculs** : Vérifier que les montants sont corrects dans le "Résumé familial"
2. **Interface** : Tester tous les menus déroulants et champs de saisie
3. **Persistance** : S'assurer que les données se sauvegardent correctement
4. **Responsive** : Vérifier l'affichage sur mobile/tablette

### Fichiers critiques à ne pas casser
- **Types principaux** : `src/types/index.ts`
- **Calculs globaux** : `src/components/ui/GlobalSummary.tsx` 
- **Configuration** : `package.json`, `tsconfig.json`

---

*Ce fichier est maintenu à jour pour faciliter les futures modifications et éviter les erreurs courantes.*