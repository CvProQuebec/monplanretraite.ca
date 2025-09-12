import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Building2, 
  Calculator, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  Info,
  Shield,
  Users,
  Mountain,
  Car,
  TreePine
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import '../../senior-unified-styles.css';

/* CSS pour disposition horizontale des formulaires */
const inlineFormStyles = `
.senior-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  min-height: 48px;
}

.senior-form-label {
  font-size: 18px;
  font-weight: 600;
  color: #1a365d;
  text-align: left;
}

.senior-form-input {
  font-size: 18px;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.senior-form-input:focus {
  border-color: #4c6ef5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
  outline: none;
}

@media (max-width: 768px) {
  .senior-form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .senior-form-label {
    text-align: left;
  }
}
`;

// Données initiales vides pour la confidentialité
const initialImmobilierData = {
  residencePrincipale: {
    valeur: 0,
    hypotheque: 0,
    taxes: 0,
    assurances: 0
  },
  deuxiemeResidence: {
    valeur: 0,
    hypotheque: 0,
    revenus: 0,
    charges: 0
  },
  troisiemePropriete: {
    valeur: 0,
    hypotheque: 0,
    revenus: 0,
    charges: 0
  },
  quatriemePropriete: {
    valeur: 0,
    hypotheque: 0,
    revenus: 0,
    charges: 0
  }
};

const ImmobilierPage: React.FC = () => {
  const { language } = useLanguage();

  // Injecter les styles CSS pour les formulaires horizontaux
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = inlineFormStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Fonction de formatage monétaire québécoise
  const formatCurrencyQuebec = (amount: number): string => {
    if (amount === 0) return '0 $';
    
    return new Intl.NumberFormat('fr-CA', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' $';
  };
  const [activeTab, setActiveTab] = useState('residence');
  const [immobilierData, setImmobilierData] = useState(initialImmobilierData);

  const handleChange = (section: string, field: string, value: string | number) => {
    // Traiter les leading zeros et convertir en nombre
    let numericValue: number;
    
    if (typeof value === 'string') {
      // Éliminer les leading zeros et convertir en nombre
      const cleanValue = value.replace(/^0+/, '') || '0';
      numericValue = Number(cleanValue);
    } else {
      numericValue = value;
    }
    
    setImmobilierData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: numericValue
      }
    }));
  };

  // Fonction pour formater les pourcentages selon les normes OQLF
  const formatPourcentageOQLF = (pourcentage: number): string => {
    if (pourcentage === 0) return '0 %';
    if (pourcentage === 100) return '100 %';
    
    // Pour les autres valeurs, arrondir à l'entier le plus proche
    const pourcentageArrondi = Math.round(pourcentage);
    return `${pourcentageArrondi} %`;
  };

  const t = {
    fr: {
      title: 'Gestion immobilière',
      subtitle: 'Planifiez votre patrimoine immobilier pour optimiser votre retraite',
      residence: 'Résidence principale',
      deuxiemeResidence: '2e résidence',
      troisiemePropriete: '3e propriété (à revenus)',
      quatriemePropriete: '4e propriété (chalet, etc.)',
      valeurActuelle: 'Valeur actuelle',
      soldeHypotheque: 'Solde d\'hypothèque',
      revenus: 'Revenus locatifs',
      charges: 'Charges annuelles',
      revenusNets: 'Revenus nets',
      taxes: 'Taxes municipales',
      assurances: 'Assurances',
      equite: 'Équité nette',
      patrimoineTotal: 'Patrimoine immobilier total',
      conseils: 'Conseils d\'optimisation',
      analyse: 'Analyse financière'
    },
    en: {
      title: 'Real Estate Management',
      subtitle: 'Plan your real estate portfolio to optimize your retirement',
      residence: 'Primary residence',
      deuxiemeResidence: '2nd residence',
      troisiemePropriete: '3rd property (income)',
      quatriemePropriete: '4th property (cottage, etc.)',
      valeurActuelle: 'Current value',
      soldeHypotheque: 'Mortgage balance',
      revenus: 'Rental income',
      charges: 'Annual expenses',
      taxes: 'Municipal taxes',
      assurances: 'Insurance',
      equite: 'Net equity',
      patrimoineTotal: 'Total real estate portfolio',
      conseils: 'Optimization advice',
      analyse: 'Financial analysis'
    }
  };

  const currentT = t[language as keyof typeof t];

  // Calculs
  const calculerEquite = (valeur: number, hypotheque: number) => Math.max(0, valeur - hypotheque);
  const equiteResidence = calculerEquite(immobilierData.residencePrincipale.valeur, immobilierData.residencePrincipale.hypotheque);
  const equite2e = calculerEquite(immobilierData.deuxiemeResidence.valeur, immobilierData.deuxiemeResidence.hypotheque);
  const equite3e = calculerEquite(immobilierData.troisiemePropriete.valeur, immobilierData.troisiemePropriete.hypotheque);
  const equite4e = calculerEquite(immobilierData.quatriemePropriete.valeur, immobilierData.quatriemePropriete.hypotheque);
  
  const patrimoineTotal = equiteResidence + equite2e + equite3e + equite4e;
  const revenusTotaux = immobilierData.deuxiemeResidence.revenus + immobilierData.troisiemePropriete.revenus + immobilierData.quatriemePropriete.revenus;
  const chargesTotales = immobilierData.deuxiemeResidence.charges + immobilierData.troisiemePropriete.charges + immobilierData.quatriemePropriete.charges;

  return (
    <div className="senior-layout min-h-screen" style={{ background: 'linear-gradient(135deg, var(--senior-bg-secondary) 0%, var(--senior-bg-accent) 100%)', color: 'var(--senior-text-primary)' }}>
      {/* Particules de fond avec couleurs douces */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--senior-primary-light)' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'var(--senior-secondary)' }}></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--senior-primary)' }}></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Home className="w-16 h-16" style={{ color: 'var(--senior-primary)' }} />
            <h1 style={{ 
              fontSize: 'var(--senior-font-3xl)', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, var(--senior-primary) 0%, var(--senior-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {currentT.title}
            </h1>
          </div>
          <p style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-secondary)' }} className="max-w-4xl mx-auto leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
            <CardContent className="p-6 text-center">
              <Home className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--senior-primary)' }} />
              <p style={{ fontSize: 'var(--senior-font-lg)', fontWeight: '700', color: 'var(--senior-text-primary)' }}>
                {formatCurrencyQuebec(patrimoineTotal)}
              </p>
              <p style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>{currentT.patrimoineTotal}</p>
            </CardContent>
          </Card>

          <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--senior-success)' }} />
              <p style={{ fontSize: 'var(--senior-font-lg)', fontWeight: '700', color: 'var(--senior-text-primary)' }}>
                {formatCurrencyQuebec(revenusTotaux)}
              </p>
              <p style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>{language === 'fr' ? 'Revenus locatifs annuels' : 'Annual rental income'}</p>
            </CardContent>
          </Card>

          <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
            <CardContent className="p-6 text-center">
              <Calculator className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--senior-warning)' }} />
              <p style={{ fontSize: 'var(--senior-font-lg)', fontWeight: '700', color: 'var(--senior-text-primary)' }}>
                {formatCurrencyQuebec(chargesTotales)}
              </p>
              <p style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>{language === 'fr' ? 'Charges annuelles' : 'Annual expenses'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation par onglets */}
        <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 p-2 rounded-xl h-16 border-2 shadow-lg" style={{ background: 'var(--senior-bg-secondary)', borderColor: 'var(--senior-border)' }}>
                <TabsTrigger 
                  value="residence" 
                  className="px-6 py-3 font-bold rounded-lg transition-all duration-200 min-height-48px"
                  style={{ 
                    fontSize: 'var(--senior-font-sm)',
                    minHeight: '48px'
                  }}
                  data-active-style={{
                    background: 'var(--senior-primary)',
                    color: 'var(--senior-text-inverse)'
                  }}
                >
                  <Home className="w-5 h-5 mr-2" />
                  {currentT.residence}
                </TabsTrigger>
                <TabsTrigger 
                  value="deuxieme"
                  className="px-6 py-3 font-bold rounded-lg transition-all duration-200"
                  style={{ 
                    fontSize: 'var(--senior-font-sm)',
                    minHeight: '48px'
                  }}
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  {currentT.deuxiemeResidence}
                </TabsTrigger>
                <TabsTrigger 
                  value="troisieme"
                  className="px-6 py-3 font-bold rounded-lg transition-all duration-200"
                  style={{ 
                    fontSize: 'var(--senior-font-sm)',
                    minHeight: '48px'
                  }}
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {currentT.troisiemePropriete}
                </TabsTrigger>
                <TabsTrigger 
                  value="quatrieme"
                  className="px-6 py-3 font-bold rounded-lg transition-all duration-200"
                  style={{ 
                    fontSize: 'var(--senior-font-sm)',
                    minHeight: '48px'
                  }}
                >
                  <Mountain className="w-5 h-5 mr-2" />
                  {currentT.quatriemePropriete}
                </TabsTrigger>
              </TabsList>

              {/* Onglet Résidence principale */}
              <TabsContent value="residence" className="mt-8">
                <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                      <Home className="w-8 h-8" style={{ color: 'var(--senior-primary)' }} />
                      {currentT.residence}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.valeur}
                          onChange={(e) => handleChange('residencePrincipale', 'valeur', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.hypotheque}
                          onChange={(e) => handleChange('residencePrincipale', 'hypotheque', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.taxes}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.taxes}
                          onChange={(e) => handleChange('residencePrincipale', 'taxes', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.assurances}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.assurances}
                          onChange={(e) => handleChange('residencePrincipale', 'assurances', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="p-6 rounded-lg border" style={{ background: 'rgba(76, 110, 245, 0.1)', borderColor: 'var(--senior-primary)' }}>
                      <div className="text-center">
                        <p className="font-bold mb-2" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                          {currentT.equite}: {formatCurrencyQuebec(equiteResidence)}
                        </p>
                        <Progress 
                          value={immobilierData.residencePrincipale.valeur > 0 ? (equiteResidence / immobilierData.residencePrincipale.valeur) * 100 : 0} 
                          className="h-3"
                          style={{ backgroundColor: 'var(--senior-bg-secondary)' }}
                        />
                        <p className="mt-2" style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>
                          {immobilierData.residencePrincipale.valeur > 0 ? ((equiteResidence / immobilierData.residencePrincipale.valeur) * 100).toFixed(1) : 0} % d'équité
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 2e résidence */}
              <TabsContent value="deuxieme" className="mt-8">
                <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                      <Building2 className="w-8 h-8" style={{ color: 'var(--senior-secondary)' }} />
                      {currentT.deuxiemeResidence}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.valeur}
                          onChange={(e) => handleChange('deuxiemeResidence', 'valeur', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.hypotheque}
                          onChange={(e) => handleChange('deuxiemeResidence', 'hypotheque', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.revenus}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.revenus}
                          onChange={(e) => handleChange('deuxiemeResidence', 'revenus', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.charges}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.charges}
                          onChange={(e) => handleChange('deuxiemeResidence', 'charges', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="p-6 rounded-lg border" style={{ background: 'rgba(151, 117, 250, 0.1)', borderColor: 'var(--senior-secondary)' }}>
                      <div className="text-center">
                        <p className="font-bold mb-2" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                          {currentT.equite}: {formatCurrencyQuebec(equite2e)}
                        </p>
                        <p style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>
                          Revenus nets: {formatCurrencyQuebec(immobilierData.deuxiemeResidence.revenus - immobilierData.deuxiemeResidence.charges)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 3e propriété */}
              <TabsContent value="troisieme" className="mt-8">
                <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                      <TrendingUp className="w-8 h-8" style={{ color: 'var(--senior-success)' }} />
                      {currentT.troisiemePropriete}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.valeur}
                          onChange={(e) => handleChange('troisiemePropriete', 'valeur', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.hypotheque}
                          onChange={(e) => handleChange('troisiemePropriete', 'hypotheque', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.revenus}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.revenus}
                          onChange={(e) => handleChange('troisiemePropriete', 'revenus', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.charges}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.charges}
                          onChange={(e) => handleChange('troisiemePropriete', 'charges', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="p-6 rounded-lg border" style={{ background: 'rgba(81, 207, 102, 0.1)', borderColor: 'var(--senior-success)' }}>
                      <div className="text-center">
                        <p className="font-bold mb-2" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                          {currentT.equite}: {formatCurrencyQuebec(equite3e)}
                        </p>
                        <p style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>
                          Revenus nets: {formatCurrencyQuebec(immobilierData.troisiemePropriete.revenus - immobilierData.troisiemePropriete.charges)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 4e propriété */}
              <TabsContent value="quatrieme" className="mt-8">
                <Card className="senior-card" style={{ background: 'var(--senior-bg-card)', border: '1px solid var(--senior-border)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                      <Mountain className="w-8 h-8" style={{ color: 'var(--senior-secondary-light)' }} />
                      {currentT.quatriemePropriete}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.valeur}
                          onChange={(e) => handleChange('quatriemePropriete', 'valeur', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.hypotheque}
                          onChange={(e) => handleChange('quatriemePropriete', 'hypotheque', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.revenus}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.revenus}
                          onChange={(e) => handleChange('quatriemePropriete', 'revenus', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                      <div className="senior-form-row">
                        <Label className="senior-form-label">
                          {currentT.charges}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.charges}
                          onChange={(e) => handleChange('quatriemePropriete', 'charges', e.target.value)}
                          className="senior-form-input"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="p-6 rounded-lg border" style={{ background: 'rgba(177, 151, 252, 0.1)', borderColor: 'var(--senior-secondary-light)' }}>
                      <div className="text-center">
                        <p className="font-bold mb-2" style={{ fontSize: 'var(--senior-font-lg)', color: 'var(--senior-text-primary)' }}>
                          {currentT.equite}: {formatCurrencyQuebec(equite4e)}
                        </p>
                        <p style={{ fontSize: 'var(--senior-font-sm)', color: 'var(--senior-text-secondary)' }}>
                          Revenus nets: {formatCurrencyQuebec(immobilierData.quatriemePropriete.revenus - immobilierData.quatriemePropriete.charges)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImmobilierPage;
