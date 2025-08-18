# Module de Retraite - Système Bilingue

## 🎯 Vue d'ensemble

Ce module offre une **planification de retraite complète** avec support bilingue français/anglais, optimisé pour les utilisateurs seniors.

## 🌐 Système Bilingue

### Fonctionnalités
- **Détection automatique** de la langue (URL, localStorage, navigateur)
- **Changement de langue** sans rechargement de page
- **Préservation de la page active** lors du changement de langue
- **Traductions centralisées** et typées

### Structure des URLs
```
/fr/retirement  → Version française
/en/retirement  → Version anglaise
```

### Utilisation

#### 1. Provider de langue
```tsx
import { LanguageProvider } from '@/features/retirement';

function App() {
  return (
    <LanguageProvider>
      <RetirementApp />
    </LanguageProvider>
  );
}
```

#### 2. Hook de langue
```tsx
import { useLanguage } from '@/features/retirement';

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t('personalData.title')}</h1>
      <button onClick={() => setLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

#### 3. Composant de sélection de langue
```tsx
import { LanguageSwitcher } from '@/features/retirement';

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## 📁 Structure des fichiers

```
src/features/retirement/
├── components/
│   ├── RetirementApp.tsx      # Composant principal avec LanguageProvider
│   ├── LanguageSwitcher.tsx   # Sélecteur de langue
│   ├── HelpTooltip.tsx        # Tooltips d'aide
│   └── ErrorBoundary.tsx      # Gestion d'erreurs
├── hooks/
│   ├── useLanguage.ts         # Hook de gestion de langue
│   └── useRetirementData.ts   # Hook de données
├── sections/
│   ├── HeroSection.tsx        # Section d'introduction
│   ├── PersonalDataSection.tsx # Données personnelles
│   └── DashboardSection.tsx   # Tableau de bord
├── translations/
│   └── index.ts              # Traductions centralisées
├── types/
│   └── index.ts              # Types TypeScript
├── services/
│   └── CalculationService.ts # Services de calcul
├── utils/
│   └── formatters.ts         # Utilitaires de formatage
├── styles/
│   └── senior-friendly.css   # Styles pour seniors
└── index.ts                  # Exports principaux
```

## 🎨 Interface Senior-Friendly

### Caractéristiques
- **Textes grossis** : Titres jusqu'à `text-7xl`, texte de base `text-lg`
- **Boutons grands** : Minimum `h-16` avec `text-xl`
- **Espacement généreux** : Marges et padding augmentés
- **Contraste élevé** : Couleurs optimisées pour la lisibilité
- **Navigation simple** : Évite les panneaux complexes

### Classes CSS spéciales
```css
.retirement-app {
  font-size: 16px;  /* Base plus grande */
}

.retirement-app h1 {
  font-size: 2.5rem;  /* Titres très gros */
}

.retirement-app button {
  min-height: 3.5rem;  /* Boutons grands */
  font-size: 1.125rem;
}
```

## 🔧 Configuration

### 1. Ajouter de nouvelles traductions
```typescript
// src/features/retirement/translations/index.ts
export const translations = {
  fr: {
    newSection: {
      title: 'Nouveau titre',
      description: 'Nouvelle description'
    }
  },
  en: {
    newSection: {
      title: 'New title',
      description: 'New description'
    }
  }
};
```

### 2. Utiliser les traductions
```typescript
const { language } = useLanguage();
const t = useTranslation(language);

return <h1>{t.newSection.title}</h1>;
```

### 3. Ajouter une nouvelle page
```typescript
// src/pages/NouvellePage.tsx
import { RetirementApp } from '@/features/retirement';

const NouvellePage = () => <RetirementApp />;
export default NouvellePage;
```

## 🚀 Déploiement

### Routes nécessaires
```typescript
// Dans votre routeur
<Route path="/fr/retirement" element={<RetraiteFr />} />
<Route path="/en/retirement" element={<RetraiteEn />} />
```

### Variables d'environnement
```env
# Optionnel : langue par défaut
REACT_APP_DEFAULT_LANGUAGE=fr
```

## 📱 Responsive Design

Le module s'adapte automatiquement :
- **Mobile** : Textes encore plus gros (`text-18px`)
- **Tablette** : Layout adaptatif
- **Desktop** : Interface complète

## ♿ Accessibilité

- **WCAG 2.1 AA** compatible
- **Contraste élevé** automatique
- **Navigation clavier** supportée
- **Lecteurs d'écran** optimisés
- **Réduction de mouvement** respectée

## 🔒 Sécurité

- **Données locales** uniquement (localStorage)
- **Aucune transmission** de données personnelles
- **Chiffrement** des données sensibles (optionnel)

## 🐛 Dépannage

### Problème : Changement de langue ne fonctionne pas
**Solution** : Vérifier que le `LanguageProvider` entoure l'application

### Problème : Traductions manquantes
**Solution** : Vérifier que les clés existent dans `translations/index.ts`

### Problème : Page revient à l'intro
**Solution** : Utiliser `navigate()` au lieu de `window.location`

## 📈 Performance

- **Lazy loading** des traductions
- **Memoization** des calculs
- **Optimisation** des re-renders
- **Bundle splitting** automatique

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024  
**Compatibilité** : React 18+, TypeScript 4.8+