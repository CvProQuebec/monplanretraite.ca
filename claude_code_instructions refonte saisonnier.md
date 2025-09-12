# Instructions précises pour Claude Code - Refonte du module dépenses saisonnières

## OBJECTIF
Remplacer le système actuel de "répartition mensuelle" des dépenses saisonnières par un planificateur basé sur des cases à cocher et des dates de planification réelles.

## CONTRAINTES STRICTES
- NE PAS toucher aux autres modules (CashflowSection, MonthlyBudgetPlanningModule)
- NE PAS modifier la structure UserData existante
- NE PAS supprimer les fonctionnalités de sauvegarde localStorage
- CONSERVER tous les imports et dépendances existants
- GARDER la même interface handleUpdate pour la compatibilité

## ÉTAPES D'IMPLÉMENTATION

### ÉTAPE 1 : Créer le nouveau composant SeasonalExpensesPlannerModule

**Créer le fichier :** `src/components/ui/SeasonalExpensesPlannerModule.tsx`

**Structure TypeScript :**
```typescript
interface SeasonalExpense {
  id: string;
  category: 'automobile' | 'maison' | 'sante' | 'taxes' | 'personnel';
  name: string;
  description: string;
  isActive: boolean;
  estimatedAmount: number;
  frequency: 'annually' | 'biannually' | 'every2years' | 'every3years' | 'every5years' | 'asNeeded';
  isPlanned: boolean;
  plannedDate?: string;
  notes?: string;
}

interface SeasonalExpensesPlannerProps {
  data: UserData;
  onUpdate: (updates: any) => void;
  language: string;
}
```

**Données prédéfinies à inclure :**
- Automobile : changement huile, pneus été/hiver, inspection
- Maison : émondage, piscine ouverture/fermeture, déneigement, réparations
- Santé : soins dentaires majeurs, lunettes, équipements médicaux
- Taxes : municipales, scolaires
- Personnel : vacances, cadeaux

**Fonctionnalités requises :**
1. Navigation par onglets de catégories
2. Cases à cocher "S'applique à moi"
3. Champs montant estimé (quand isActive = true)
4. Case "Planifié cette année" + champ date
5. Calcul impact budgétaire : dépenses planifiées + provision recommandée
6. Sauvegarde automatique via onUpdate

### ÉTAPE 2 : Créer les types TypeScript nécessaires

**Ajouter dans :** `src/features/retirement/types.ts` (ou fichier types existant)

```typescript
// Ajouter à l'interface UserData existante
interface UserData {
  // ... propriétés existantes
  seasonalExpenses?: {
    expenses: SeasonalExpense[];
    lastUpdated?: string;
  };
}
```

### ÉTAPE 3 : Remplacer SeasonalIrregularExpensesModule dans ExpensesPage

**Fichier cible :** `src/pages/ExpensesPage.tsx`

**Actions précises :**
1. IMPORTER le nouveau composant : `import SeasonalExpensesPlannerModule from '@/components/ui/SeasonalExpensesPlannerModule';`
2. REMPLACER uniquement la section SeasonalIrregularExpensesModule :

**REMPLACER :**
```typescript
<div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-300">
  <SeasonalIrregularExpensesModule
    data={userData}
    onUpdate={(updates) => handleUpdate('cashflow', updates)}
    language={language}
  />
</div>
```

**PAR :**
```typescript
<div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-300">
  <SeasonalExpensesPlannerModule
    data={userData}
    onUpdate={(updates) => handleUpdate('seasonalExpenses', updates)}
    language={language}
  />
</div>
```

### ÉTAPE 4 : Ajuster la fonction handleUpdate

**Fichier :** `src/pages/ExpensesPage.tsx`

**Modifier UNIQUEMENT la fonction handleUpdate pour supporter seasonalExpenses :**

```typescript
const handleUpdate = (section: keyof UserData, updates: any) => {
  setUserData(prevData => {
    const newData = {
      ...prevData,
      [section]: {
        ...prevData[section],
        ...updates
      }
    };
    
    // Sauvegarde localStorage INCHANGÉE
    try {
      localStorage.setItem('retirement_data', JSON.stringify(newData));
      console.log('Données sauvegardées dans localStorage:', newData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
    
    return newData;
  });
};
```

### ÉTAPE 5 : Ajuster le useEffect de chargement

**Fichier :** `src/pages/ExpensesPage.tsx`

**AJOUTER dans le useEffect existant (ne pas remplacer) :**

```typescript
useEffect(() => {
  try {
    const savedData = localStorage.getItem('retirement_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // Code existant pour cashflow INCHANGÉ
      if (data.cashflow) {
        // ... code existant
      }
      
      // AJOUTER seulement cette section :
      if (data.seasonalExpenses) {
        setUserData(prevData => ({
          ...prevData,
          seasonalExpenses: data.seasonalExpenses
        }));
        console.log('Dépenses saisonnières chargées:', data.seasonalExpenses);
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
}, []);
```

## SPÉCIFICATIONS DÉTAILLÉES DU COMPOSANT

### Interface utilisateur requise :
1. **En-tête :** "Planificateur de dépenses saisonnières et occasionnelles"
2. **Navigation onglets :** Automobile, Maison, Santé, Taxes, Personnel
3. **Cartes d'items :** Pour chaque dépense
   - Case à cocher principale "S'applique à moi"
   - Titre et description
   - Si cochée : champs montant + case "Planifié cette année" + date
4. **Résumé budgétaire :** Deux colonnes :
   - Dépenses planifiées cette année (somme des isPlanned = true)
   - Provision annuelle recommandée (calcul selon fréquences)

### Logique de calcul provision annuelle :
```typescript
const frequencyMultiplier = {
  'annually': 1,
  'biannually': 2, 
  'every2years': 0.5,
  'every3years': 0.33,
  'every5years': 0.2,
  'asNeeded': 0
};
```

### Style et design :
- UTILISER les mêmes classes CSS que les modules existants
- Onglets : bg-blue-500 pour actif, bg-gray-100 pour inactif
- Cartes : border rounded-lg p-4 hover:bg-gray-50
- Résumé : bg-blue-50 rounded-lg p-4

## TESTS REQUIS APRÈS IMPLÉMENTATION

1. **Vérifier que les autres modules restent fonctionnels :**
   - CashflowSection doit fonctionner normalement
   - MonthlyBudgetPlanningModule doit fonctionner normalement
   - Sauvegarde localStorage des autres sections doit marcher

2. **Tester le nouveau module :**
   - Navigation entre onglets
   - Cases à cocher activent/désactivent les champs
   - Saisie montants et dates
   - Calculs du résumé budgétaire
   - Sauvegarde/chargement localStorage

3. **Vérifier la cohérence :**
   - Rafraîchir la page doit restaurer toutes les données
   - Console.log doit montrer les sauvegardes

## FICHIERS À NE PAS MODIFIER
- `src/components/ui/MonthlyBudgetPlanningModule.tsx`
- `src/features/retirement/sections/CashflowSection.tsx`
- Tous les autres composants non mentionnés

## VALIDATION FINALE
Le module doit permettre à un utilisateur de :
1. Cocher "Changement d'huile" → Entrer 80$ → Cocher "Planifié cette année" → Sélectionner une date
2. Voir dans le résumé : "Dépenses planifiées cette année : 80$"
3. Rafraîchir la page et retrouver toutes ses sélections

IMPORTANT : Ne créer AUCUNE autre fonctionnalité que celles spécifiquement demandées.