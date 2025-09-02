// ===== INDEX PRINCIPAL - MONPLANRETRAITE.CA =====
// Point d'entrée central pour tous les exports du projet

// React et React Router
export { default as App } from './App';

// Export des composants principaux
export { default as Layout } from './components/layout/Layout';
export { default as Header } from './components/layout/header/UniformHeader';
export { default as LanguageSelector } from './components/layout/header/LanguageSelector';

// Pages principales
export { default as RetraiteFr } from './pages/RetraiteFr';
export { default as RetraiteEn } from './pages/RetraiteEn';
export { default as RetraiteEntreeFr } from './pages/RetraiteEntreeFr';
export { default as RetraiteEntreeEn } from './pages/RetraiteEn';
export { default as RetraiteModuleFr } from './pages/RetraiteModuleFr';
export { default as RetraiteModuleEn } from './pages/RetraiteModuleEn';
export { default as RetraiteModulePhase1Fr } from './pages/RetraiteModulePhase1Fr';
export { default as RetraiteModulePhase1En } from './pages/RetraiteModulePhase1En';
export { default as RapportsRetraiteFr } from './pages/RapportsRetraiteFr';
export { default as RetirementReportsEn } from './pages/RetirementReportsEn';

// Composants UI principaux
export { Button } from './components/ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
export { Input } from './components/ui/input';
export { Label } from './components/ui/label';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
export { Badge } from './components/ui/badge';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
export { Progress } from './components/ui/progress';
export { Alert, AlertDescription } from './components/ui/alert';
export { Toast } from './components/ui/toast';
export { Toaster } from './components/ui/toaster';

// Hooks principaux
export { useAuth } from './hooks/useAuth';
export { useLanguage } from './features/retirement/hooks/useLanguage';
export { useIsMobile as useMobile } from './hooks/use-mobile';
export { useToast } from './hooks/use-toast';
export { useContactForm } from './hooks/use-contact-form';
export { useSubscriptionLimits } from './hooks/useSubscriptionLimits';

// Services principaux
export { CalculationService } from './features/retirement/services/CalculationService';
export { EnhancedRRQService } from './features/retirement/services/EnhancedRRQService';
export { OASGISService } from './features/retirement/services/OASGISService';

// Types principaux
export type { SubscriptionPlan, PlanLimits, UpgradePath } from './types/subscription';
export type { EmergencyInfoData as EmergencyInfo } from './features/retirement/types/emergency-info';

// Configuration
export { SITE_CONFIG } from './config/branding';
export { PLANS, PLAN_CONFIG } from './config/plans';

// Utilitaires
export { cn } from './lib/utils';
export { formatCurrency, formatPercentage, formatDate } from './features/retirement/utils/formatters';
export { formatPhoneForDisplay } from './utils/formatters.tsx';
