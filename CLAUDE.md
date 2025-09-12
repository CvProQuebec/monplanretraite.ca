# CLAUDE.md - Guide de référence pour les modifications

## 📋 RÉFÉRENCE OBLIGATOIRE

**Avant toute modification du site web**, consulter les **Instructions pour les modifications** dans :
`H:\monplanretraite.ca\private-docs\architecture\AGENTS.md` (section en haut du fichier)

## 🚨 RÈGLE CRITIQUE - FORMATAGE OQLF

**ATTENTION ABSOLUE** : Lors de l'application des règles OQLF, **NE JAMAIS** remplacer les guillemets droits " par des chevrons « » dans le code JavaScript/TypeScript. Les guillemets droits sont ESSENTIELS pour le fonctionnement du code.

**HISTORIQUE CRITIQUE** : Ce changement avait causé un crash complet du site et nous avons dû repartir d'une copie de sauvegarde.

**EXEMPLE CORRECT** :
```typescript
// ✅ GARDER LES GUILLEMETS DROITS DANS LE CODE
const message = "Prix : 119,99 $";
const className = "senior-btn senior-btn-primary";
const selectQuery = "SELECT * FROM users WHERE name = \"John\"";
```

**EXEMPLE INTERDIT** :
```typescript
// ❌ NE JAMAIS FAIRE CECI - CASSE LE CODE
const message = « Prix : 119,99 $ »;
const className = « senior-btn senior-btn-primary »;
const selectQuery = « SELECT * FROM users WHERE name = « John » »;
```

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

**Problème récurrent** : Menus s'affichent en haut de page ou à des positions incorrectes.

**Solution standardisée** :
```typescript
<SelectContent 
  position="item-aligned"     // Ancrage au parent direct
  side="bottom"              // Ouvre vers le bas
  avoidCollisions={false}    // IMPORTANT: évite le déplacement inattendu
  sideOffset={4}             // Espacement de 4px
  style={{zIndex: 9999}}     // Au-dessus de tout
  className="min-w-full"     // Largeur minimale du parent
>
  ```
### Gestion des dates - Standard Québec
// ✅ MÉTHODE RECOMMANDÉE - Fuseau local (EST/EDT Québec)
const quebecDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Crée en fuseau local
};

// ❌ ÉVITER - Interprété en UTC
const badDate = new Date('2025-05-01');

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

## 👥 **STANDARDS D'ACCESSIBILITÉ SENIORS (55-90 ANS)**

### Règles Absolues
- **Police minimum** : 18px pour TOUT texte
- **Zones cliquables minimum** : 48px (56px recommandé)
- **Contraste élevé** : Fond blanc pur, texte noir pour lisibilité
- **Espacement généreux** : Marges et padding suffisants
- **Messages bienveillants** : Langage niveau 6e année

### CSS Obligatoire
```css
/* Composants seniors - Standards minimums */
.senior-layout {
  background: #ffffff; /* Fond blanc pur obligatoire */
  font-size: 18px;     /* Taille minimum absolue */
  line-height: 1.6;    /* Espacement lignes */
  color: #1a365d;      /* Contraste élevé */
}

.senior-btn {
  min-height: 48px;    /* Zone cliquable minimum */
  min-width: 140px;    /* Largeur minimum */
  font-size: 18px;     /* Lisibilité */
  font-weight: 600;    /* Visibilité */
  padding: 12px 24px;  /* Espacement interne */
  border: 2px solid;   /* Bordure visible */
}

.senior-form-input {
  font-size: 18px;     /* Lisibilité saisie */
  min-height: 48px;    /* Zone cliquable */
  padding: 12px 16px;  /* Espacement interne */
  border: 2px solid #e2e8f0; /* Bordure visible */
  border-radius: 8px;  /* Coins arrondis */
}
```

### Palette de Couleurs Autorisée
```css
/* Variables CSS - UTILISER UNIQUEMENT CELLES-CI */
--senior-primary: #4c6ef5      /* Bleu doux */
--senior-success: #51cf66      /* Vert doux */
--senior-warning: #ffd43b      /* Jaune doux */
--senior-error: #ff6b6b        /* Rouge doux */
--senior-text-primary: #1a365d /* Texte principal */
--senior-bg-primary: #ffffff   /* Fond blanc pur */
--senior-border: #e2e8f0       /* Bordures */
```

---

## 🌐 **NORMES OQLF QUÉBÉCOISES**

### Format des Montants d'Argent
```typescript
// ❌ FORMATS INCORRECTS
"$1,234.56"     // Dollar avant, point décimal
"1234,56$"      // Pas d'espace avant $
"Prix:119,99$"  // Pas d'espace avant :

// ✅ FORMATS CORRECTS OQLF (DANS L'AFFICHAGE)
"1 234,56 $"    // Espace milliers, virgule décimale, espace avant $
"Prix : 119,99 $" // Espace avant : et avant $
```

### Format Horaire Québécois
```typescript
// ❌ FORMATS INCORRECTS
"13:05"         // Format avec deux-points
"1:05 PM"       // Format 12h anglais
"13h05"         // Pas d'espace

// ✅ FORMATS CORRECTS OQLF
"13 h 5"        // Espace avant/après h, pas de zéro
"9 h 30"        // Format lisible
"0 h 15"        // Minuit et quart
```

### Terminologie Française Obligatoire
```typescript
// Remplacements obligatoires dans l'interface
email → courriel
password → mot de passe
login → connexion
logout → déconnexion
submit → soumettre/envoyer
cancel → annuler
save → enregistrer
update → mettre à jour
delete → supprimer
```

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

### Décembre 2025 - Consolidation Documentation
- **Correction** : Règle critique sur guillemets droits ajoutée
- **Ajout** : Standards accessibilité seniors consolidés
- **Correction** : Normes OQLF précisées avec exemples

### Septembre 2025 - Accessibilité Seniors
- **Ajout** : Mode seniors activé globalement
- **Correction** : Navigation simplifiée 4 sections
- **Ajout** : Composants SeniorsLoadingSpinner, SeniorsFriendlyInput

### Septembre 2025 - Optimisations Performance
- **Correction** : Code splitting avancé chunks <500kB
- **Ajout** : Cache intelligent avec timeouts
- **Amélioration** : Temps de chargement réduits de 60%

### Septembre 2025 - Consolidation "Ma Retraite" + CPM2014
- **Correction** : Bug de calcul emplois saisonniers (fuseau horaire)
- **Ajout** : Analyse CPM2014 avec champs requis
- **Intégration** : Synchronisation espérance de vie automatique

### Janvier 2025 - Module Hypothèses de Calcul
- **Ajout** : Transparence totale normes IPF 2025
- **Correction** : Interface éducative avec tooltips
- **Différenciation** : Avantage concurrentiel unique

---

## ⚠️ Points d'attention

### Tests à effectuer après modifications
1. **Calculs** : Vérifier que les montants sont corrects dans le "Résumé familial"
2. **Interface** : Tester tous les menus déroulants et champs de saisie
3. **Persistance** : S'assurer que les données se sauvegardent correctement
4. **Responsive** : Vérifier l'affichage sur mobile/tablette
5. **Accessibilité** : Valider contraste, tailles de police, zones cliquables

### Fichiers critiques à ne pas casser
- **Types principaux** : `src/types/index.ts`
- **Calculs globaux** : `src/components/ui/GlobalSummary.tsx` 
- **Configuration** : `package.json`, `tsconfig.json`
- **Styles seniors** : `src/styles/accessibility-seniors.css`

### Vérifications de performance
- **Build réussi** : `npm run build` sans erreurs
- **Chunks <500kB** : Vérifier les avertissements Vite
- **Temps de chargement** : <3s sur connexion lente
- **Responsive** : Test sur mobile, tablette, desktop

---

## 📊 **MODULES MÉTIER PRINCIPAUX**

### Services de Calcul
- **SRGService** : Calculs Supplément de Revenu Garanti
- **RREGOPService** : Régime gouvernement et organismes publics
- **RealEstateOptimizationService** : Optimisation immobilière
- **PopulationBenchmarkService** : Benchmarks provinciaux longévité

### Composants d'Interface
- **SeniorsFriendlyIncomeTable** : Saisie revenus adaptée seniors
- **GlobalSummary** : Agrégation et totaux familiaux
- **UnifiedReportManager** : Gestion centralisée des rapports
- **LongevityDashboard** : Analyse de longévité complète

### Types de Données
```typescript
interface UserData {
  personal: PersonalData      // Infos personnelles + revenus
  retirement: RetirementData  // Prestations gouvernementales
  savings: SavingsData       // Épargne et investissements
  cashflow: CashflowData     // Dépenses et budget
}
```

---

## 🔄 **WORKFLOW DE MODIFICATION RECOMMANDÉ**

### 1. Préparation
- Lire cette documentation complètement
- Identifier les fichiers à modifier
- Vérifier la cohérence avec l'architecture existante

### 2. Développement
- Respecter les standards d'accessibilité seniors
- Appliquer les normes OQLF (SANS toucher aux guillemets code)
- Utiliser les composants et services existants
- Tester au fur et à mesure

### 3. Validation
- Tests de compilation et build
- Vérification accessibilité (18px, 48px, contraste)
- Test sur différents navigateurs et appareils
- Validation des calculs et logique métier

### 4. Documentation
- Mettre à jour AGENTS.md si nécessaire
- Documenter les nouveaux composants/services
- Ajouter des commentaires dans le code complexe

---

*Ce fichier est maintenu à jour pour faciliter les futures modifications et éviter les erreurs courantes, particulièrement le problème critique des guillemets qui avait causé un crash complet du site.*