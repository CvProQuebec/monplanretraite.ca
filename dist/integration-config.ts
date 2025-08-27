// ===== INTÉGRATION AVEC LE SYSTÈME EXISTANT =====

// 1. Mise à jour de plans.ts - Ajouter la fonctionnalité immobilier
export const PLAN_CONFIG_UPDATED = {
  // ... config existante ...
  free: {
    // ... features existantes ...
    hasRealEstateOptimization: false, // RESTREINT : Plans payants uniquement
  },
  professional: {
    // ... features existantes ...
    hasRealEstateOptimization: true, // INCLUS : Module Immobilier Complet
    hasRealEstateAdvancedAnalytics: true, // Comparaisons et VAN
    hasRealEstateExecutionPlan: true, // Plans d'exécution
  },
  ultimate: {
    // ... features existantes ...
    hasRealEstateOptimization: true, // INCLUS : Tout
    hasRealEstateAdvancedAnalytics: true,
    hasRealEstateExecutionPlan: true,
    hasRealEstateMonteCarloSim: true, // Simulations Monte Carlo immobilières
    hasRealEstateAIRecommendations: true, // Recommandations IA
  }
};

// 2. Extension du CalculationService existant
// Ajouter dans src/features/retirement/services/CalculationService.ts

import { RealEstateOptimizationService } from './RealEstateOptimizationService';

export class CalculationServiceExtended {
  
  /**
   * NOUVELLE MÉTHODE: Calculs immobiliers intégrés
   */
  static calculateRealEstateImpact(userData: UserData): RealEstateResults {
    try {
      // Extraction automatique des données immobilières depuis userData
      const propertyData = this.extractPropertyDataFromUser(userData);
      const rregopContext = this.extractRREGOPContextFromUser(userData);
      
      if (!propertyData || !rregopContext) {
        return { hasProperty: false, message: 'Aucune propriété à revenus détectée' };
      }
      
      // Analyse complète
      const analysis = RealEstateOptimizationService.analyzeProperty(propertyData);
      const scenarios = RealEstateOptimizationService.generateSaleScenarios(
        propertyData, 
        rregopContext, 
        this.getUserContext(userData)
      );
      
      const bestScenario = scenarios[0];
      const strategies = RealEstateOptimizationService.generateReinvestmentStrategies(
        bestScenario.liquiditeNette,
        rregopContext,
        this.getUserInvestmentProfile(userData)
      );
      
      return {
        hasProperty: true,
        currentValue: propertyData.valeurMarchande,
        currentReturn: analysis.rendements.net,
        saleImpact: bestScenario.impotTotalDu,
        netLiquidity: bestScenario.liquiditeNette,
        rregopOpportunity: {
          maxYears: rregopContext.anneesManquantes,
          totalCost: rregopContext.anneesManquantes * rregopContext.coutRachatParAnnee,
          monthlyBoost: rregopContext.anneesManquantes * rregopContext.impactPensionViagere
        },
        recommendation: strategies[0]?.type || 'ANALYSE_REQUISE'
      };
      
    } catch (error) {
      console.error('Erreur calcul immobilier:', error);
      return { hasProperty: false, error: 'Erreur lors du calcul' };
    }
  }
  
  private static extractPropertyDataFromUser(userData: UserData): RealEstateProperty | null {
    // Extraire depuis les champs utilisateur existants ou nouveaux champs
    if (!userData.assets?.realEstate) return null;
    
    return {
      valeurMarchande: userData.assets.realEstate.currentValue || 0,
      coutBaseAjuste: userData.assets.realEstate.adjustedCostBase || 0,
      amortissementCumule: userData.assets.realEstate.accumulatedDepreciation || 0,
      anneeAcquisition: userData.assets.realEstate.acquisitionYear || 2020,
      typeProprieteDuplex: userData.assets.realEstate.propertyType || 'DUPLEX',
      revenusLocatifsAnnuels: userData.assets.realEstate.annualRentalIncome || 0,
      depensesAnnuelles: userData.assets.realEstate.annualExpenses || {
        entretien: 0, taxes: 0, assurances: 0, hypotheque: 0, gestion: 0, autres: 0
      },
      appreciationAnnuelle: 3.5,
      augmentationLoyersAnnuelle: 2.5
    };
  }
  
  private static extractRREGOPContextFromUser(userData: UserData): RREGOPContext | null {
    if (!userData.retirement?.rregopMembre1) return null;
    
    const ageActuel = this.calculateAge(userData.personal?.naissance1);
    const salaireAnnuel = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
    
    return {
      anneesCotisees: userData.retirement.rregopAnneesCotisees1 || 0,
      salaireAnnuelMoyen: salaireAnnuel,
      ageActuel,
      ageRetraitePrevu: userData.personal?.ageRetraiteSouhaite1 || 62,
      anneesManquantes: Math.max(0, 35 - (userData.retirement.rregopAnneesCotisees1 || 0)),
      coutRachatParAnnee: this.calculateRREGOPBuybackCost(salaireAnnuel, ageActuel),
      impactPensionViagere: this.calculateRREGOPPensionImpact(salaireAnnuel)
    };
  }
}

// 3. Extension des types UserData
// Ajouter dans src/types/userData.ts

export interface UserDataExtended extends UserData {
  assets?: {
    // ... autres actifs existants ...
    realEstate?: {
      hasRentalProperty: boolean;
      currentValue: number;
      adjustedCostBase: number;
      accumulatedDepreciation: number;
      acquisitionYear: number;
      propertyType: 'DUPLEX' | 'TRIPLEX' | 'IMMEUBLE' | 'LOGEMENT_SOUS_SOL';
      annualRentalIncome: number;
      annualExpenses: {
        entretien: number;
        taxes: number;
        assurances: number;
        hypotheque: number;
        gestion: number;
        autres: number;
      };
    };
  };
  
  retirement?: {
    // ... champs existants ...
    rregopAnneesCotisees1?: number;
    rregopAnneesCotisees2?: number;
    rregopSalaireReconnu1?: number;
    rregopSalaireReconnu2?: number;
  };
}

// 4. Composant d'intégration dans le menu principal
// src/features/retirement/components/NavigationMenu.tsx

const NavigationMenuExtended = () => {
  return (
    <nav>
      {/* ... éléments de navigation existants ... */}
      
      <NavigationItem
        href="/retraite-module/immobilier"
        icon={Home}
        title="Immobilier"
        description="Optimisation de votre propriété à revenus"
        badge={hasFeatureAccess('hasRealEstateOptimization', userPlan) ? null : 'Pro'}
        restricted={!hasFeatureAccess('hasRealEstateOptimization', userPlan)}
      />
    </nav>
  );
};

// 5. Hook personnalisé pour les données immobilières
// src/hooks/useRealEstateData.ts

export const useRealEstateData = () => {
  const { userData, updateUserData } = useRetirementData();
  const [realEstateResults, setRealEstateResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const hasRealEstate = userData?.assets?.realEstate?.hasRentalProperty || false;
  
  const updateRealEstateData = (updates: Partial<RealEstateProperty>) => {
    updateUserData({
      assets: {
        ...userData.assets,
        realEstate: {
          ...userData.assets?.realEstate,
          ...updates,
          hasRentalProperty: true
        }
      }
    });
  };
  
  const calculateRealEstateImpact = async () => {
    if (!hasRealEstate) return;
    
    setIsCalculating(true);
    try {
      const results = CalculationServiceExtended.calculateRealEstateImpact(userData);
      setRealEstateResults(results);
    } catch (error) {
      console.error('Erreur calcul immobilier:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  return {
    hasRealEstate,
    realEstateData: userData?.assets?.realEstate,
    realEstateResults,
    isCalculating,
    updateRealEstateData,
    calculateRealEstateImpact
  };
};

// 6. Widget résumé pour le dashboard principal
// src/features/retirement/components/widgets/RealEstateWidget.tsx

export const RealEstateWidget: React.FC<{ userPlan: string }> = ({ userPlan }) => {
  const { hasRealEstate, realEstateResults, calculateRealEstateImpact } = useRealEstateData();
  const hasAccess = hasFeatureAccess('hasRealEstateOptimization', userPlan);
  
  if (!hasAccess) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Immobilier</span>
            </div>
            <Badge variant="secondary">Pro</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Optimisez votre propriété à revenus
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!hasRealEstate) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-600">Immobilier</span>
          </div>
          <p className="text-sm text-gray-500">
            Aucune propriété à revenus configurée
          </p>
          <Button size="sm" variant="outline" className="mt-2">
            Ajouter une propriété
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-green-600" />
            <span className="font-medium">Immobilier</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Actif
          </Badge>
        </div>
        
        {realEstateResults ? (
          <div className="space-y-2">
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Valeur actuelle:</span>
                <span className="font-medium">${realEstateResults.currentValue?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Rendement:</span>
                <span className="font-medium text-green-600">{realEstateResults.currentReturn?.toFixed(1)}%</span>
              </div>
              {realEstateResults.rregopOpportunity && (
                <div className="flex justify-between">
                  <span>Opportunité RREGOP:</span>
                  <span className="font-medium text-blue-600">
                    +${realEstateResults.rregopOpportunity.monthlyBoost}/mois
                  </span>
                </div>
              )}
            </div>
            
            <Button size="sm" variant="outline" className="w-full mt-2">
              Voir l'analyse complète
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Propriété configurée - Analyse disponible
            </p>
            <Button size="sm" onClick={calculateRealEstateImpact} className="w-full">
              Analyser l'optimisation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 7. Route et configuration
// src/App.tsx ou équivalent

const routes = [
  // ... routes existantes ...
  {
    path: '/fr/retraite-module/immobilier',
    component: RealEstateOptimizationSection,
    requiresAuth: true,
    requiresPlan: 'professional'
  }
];

// 8. Messages d'upgrade spécifiques
export const REAL_ESTATE_UPGRADE_MESSAGES = {
  'hasRealEstateOptimization': 'Le module d\'optimisation immobilière fait partie du forfait Professional.',
  'hasRealEstateAdvancedAnalytics': 'Les analyses comparatives avancées nécessitent le forfait Professional.',
  'hasRealEstateMonteCarloSim': 'Les simulations Monte Carlo immobilières font partie du forfait Ultimate.',
  'hasRealEstateAIRecommendations': 'Les recommandations IA personnalisées nécessitent le forfait Ultimate.'
};