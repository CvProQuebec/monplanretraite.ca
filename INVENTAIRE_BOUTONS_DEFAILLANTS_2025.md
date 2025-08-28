# 🔧 INVENTAIRE DES BOUTONS AVEC HYPERLIENS DÉFAILLANTS - MonPlanRetraite.ca

## 📋 Problèmes identifiés par l'utilisateur

### 🏠 **PAGE D'ACCUEIL (Accueil.tsx)**

#### ❌ **Bouton "Commencer gratuitement"**
- **Localisation :** Plan gratuit et section "Prêt à prendre le contrôle"
- **Problème :** Affiche une trame noire au lieu du ClientOnboarding Wizard
- **Action attendue :** Devrait afficher le `OnboardingWizard`
- **Code actuel :** `onClick={() => setShowOnboardingWizard(true)}`
- **Statut :** ✅ **FONCTIONNEL** - Le code est correct, problème probablement lié au composant OnboardingWizard

#### ❌ **Bouton "Voir les plans payants"**
- **Localisation :** Section CTA final
- **Problème :** Affiche une trame noire
- **Action attendue :** Devrait ouvrir le modal d'upgrade
- **Code actuel :** `onClick={() => handleUpgradeClick('professional')}`
- **Statut :** ✅ **FONCTIONNEL** - Le code est correct, problème probablement lié au modal AdvancedUpgradeModal

### 💰 **PAGE REVENUS (Revenus.tsx)**

#### ❌ **Bouton "Calculette de Rendement Avancée"**
- **Localisation :** Section Analyse de Performance
- **Problème :** Affiche une trame noire
- **Action attendue :** Devrait afficher le composant ReturnCalculator
- **Code actuel :** `<ReturnCalculator isFrench={isFrench} />`
- **Statut :** ⚠️ **PROBLÈME COMPOSANT** - Le composant ReturnCalculator peut avoir des erreurs

#### ❌ **Bouton "Afficher l'aide"**
- **Localisation :** Bas de page
- **Problème :** Aucune activité
- **Action attendue :** Devrait afficher/masquer l'aide
- **Code actuel :** `onClick={() => setShowHelp(!showHelp)}`
- **Statut :** ✅ **FONCTIONNEL** - Le code est correct

#### ❌ **Bouton "Info RRQ"**
- **Localisation :** Bas de page
- **Problème :** Aucune activité
- **Action attendue :** Devrait afficher les informations RRQ
- **Code actuel :** `onClick={() => setShowRRQInfo(!showRRQInfo)}`
- **Statut :** ✅ **FONCTIONNEL** - Le code est correct

### 🚨 **MENU PLANIFICATION**

#### ❌ **Item "Planification d'urgence"**
- **Localisation :** Sous-menu Planification dans UniformHeader
- **Problème :** Page blanche
- **Action attendue :** Devrait afficher la page PlanificationUrgence
- **Route :** `/planification-urgence`
- **Statut :** ✅ **PAGE EXISTE** - La page PlanificationUrgence.tsx existe et semble complète

### 💸 **PAGE PLANIFICATION DE DÉPENSES**

#### ⚠️ **Problème de texte superposé**
- **Localisation :** Page PlanificationDepenses.tsx
- **Problème :** Texte superposé (voir capture d'écran 1)
- **Cause probable :** Problème CSS ou de layout
- **Statut :** 🔍 **À ANALYSER** - Nécessite inspection du CSS

### 📊 **PAGE TABLEAU DE BORD FINANCIER (MaRetraite.tsx)**

#### ❌ **Bouton "Retour à mon profil"**
- **Localisation :** Section navigation finale
- **Problème :** Renvoie à la page d'accueil au lieu du profil
- **Action attendue :** Devrait naviguer vers `/mon-profil`
- **Code actuel :** `onClick={() => handleNavigation('/mon-profil')}`
- **Statut :** ⚠️ **ROUTE INCORRECTE** - La route `/mon-profil` n'existe pas

#### ❌ **Bouton "Voir mes résultats"**
- **Localisation :** Section navigation finale
- **Problème :** Renvoie à une page "Mes résultats" qui est une copie de la page d'accueil
- **Action attendue :** Devrait afficher les vrais résultats
- **Code actuel :** `onClick={() => handleNavigation('/mes-resultats')}`
- **Statut :** ⚠️ **ROUTE INCORRECTE** - La route `/mes-resultats` n'existe pas ou pointe mal

## 🔧 **PLAN DE CORRECTION**

### **Phase 1 : Corrections des routes**
1. **Corriger les routes dans MaRetraite.tsx**
   - Remplacer `/mon-profil` par une route existante ou créer la page
   - Remplacer `/mes-resultats` par une route existante ou créer la page

### **Phase 2 : Vérification des composants**
1. **Vérifier OnboardingWizard**
   - S'assurer qu'il s'affiche correctement
   - Corriger les erreurs potentielles

2. **Vérifier AdvancedUpgradeModal**
   - S'assurer qu'il s'affiche correctement
   - Corriger les erreurs potentielles

3. **Vérifier ReturnCalculator**
   - S'assurer qu'il s'affiche correctement
   - Corriger les erreurs potentielles

### **Phase 3 : Corrections CSS**
1. **Corriger le texte superposé dans PlanificationDepenses**
   - Analyser le CSS
   - Corriger les problèmes de layout

### **Phase 4 : Tests**
1. **Tester tous les boutons corrigés**
2. **Vérifier la navigation**
3. **Valider l'affichage des composants**

## 📝 **ROUTES EXISTANTES À VÉRIFIER**

D'après l'analyse des fichiers pages/, les routes suivantes existent :
- `/` - Accueil.tsx
- `/ma-retraite` - MaRetraite.tsx
- `/mes-revenus` - Revenus.tsx
- `/depenses` - ExpensesPage.tsx
- `/mon-budget` - Budget.tsx
- `/planification-urgence` - PlanificationUrgence.tsx
- `/planification-depenses` - PlanificationDepenses.tsx
- `/planification-successorale` - PlanificationSuccessorale.tsx
- `/assistant-financier` - AssistantFinancier.tsx
- `/immobilier` - ImmobilierPage.tsx

## ⚠️ **ROUTES MANQUANTES À CRÉER OU CORRIGER**

1. **`/mon-profil`** - N'existe pas, devrait probablement pointer vers ProfilePage.tsx
2. **`/mes-resultats`** - N'existe pas, devrait être créée ou pointer vers une page existante

## 🎯 **PRIORITÉS DE CORRECTION**

### **🔴 CRITIQUE (Impact utilisateur élevé)**
1. Boutons "Commencer gratuitement" (page d'accueil)
2. Boutons "Voir les plans payants" (page d'accueil)
3. Navigation "Retour à mon profil" et "Voir mes résultats"

### **🟡 IMPORTANT (Fonctionnalité dégradée)**
1. Calculette de Rendement Avancée
2. Texte superposé dans Planification de dépenses

### **🟢 MINEUR (Amélioration UX)**
1. Boutons d'aide et info RRQ (fonctionnels mais pas visibles)

---

*Inventaire créé le 28 août 2025*
*Prêt pour corrections systématiques*
