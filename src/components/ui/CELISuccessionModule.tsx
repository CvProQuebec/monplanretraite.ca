import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { Label } from './label';
import { 
  Heart, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Users,
  FileText,
  Calculator,
  Shield,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface CELISuccessionData {
  beneficiaryType: 'successor-holder' | 'beneficiary' | 'estate' | 'none';
  relationshipStatus: 'married' | 'common-law' | 'single';
  celiAmount: number;
  spouseHasCELI: boolean;
  spouseCELIAmount: number;
}

const CELISuccessionModule: React.FC = () => {
  const [data, setData] = useState<CELISuccessionData>({
    beneficiaryType: 'none',
    relationshipStatus: 'single',
    celiAmount: 0,
    spouseHasCELI: false,
    spouseCELIAmount: 0
  });

  const [activeScenario, setActiveScenario] = useState<string>('1');

  const updateData = (field: keyof CELISuccessionData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const getScenarioInfo = (scenario: string) => {
    switch (scenario) {
      case '1':
        return {
          title: 'Conjoint comme "Successor Holder" (OPTIMAL)',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          color: 'green',
          benefits: [
            'Transfert automatique sans interruption',
            'Aucune implication fiscale',
            'Évite la probate complètement',
            'Peut doubler l\'espace CELI du couple',
            'Croissance continue tax-free'
          ],
          drawbacks: [],
          process: 'Le jour du décès = le jour où le conjoint prend contrôle du compte'
        };
      case '2':
        return {
          title: 'Conjoint comme "Beneficiary" (SOUS-OPTIMAL)',
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          color: 'yellow',
          benefits: [
            'Le conjoint reçoit l\'argent',
            'Formulaire RC240 permet contribution équivalente'
          ],
          drawbacks: [
            'Croissance après décès = IMPOSABLE',
            'Doit remplir formulaire RC240 dans 12 mois',
            'Processus plus complexe',
            'Délais avec l\'ARC'
          ],
          process: 'Compte liquidé → Formulaire RC240 → Contribution dans nouveau CELI'
        };
      case '3':
        return {
          title: 'Bénéficiaire Non-Conjoint',
          icon: <Info className="w-6 h-6 text-mpr-interactive" />,
          color: 'blue',
          benefits: [
            'Évite la probate',
            'Transfert direct au bénéficiaire',
            'Valeur au décès = tax-free'
          ],
          drawbacks: [
            'Croissance après décès = IMPOSABLE au bénéficiaire',
            'Pas de formulaire RC240 disponible',
            'Bénéficiaire doit avoir son propre espace CELI'
          ],
          process: 'Compte liquidé → Paiement direct → Croissance future imposable'
        };
      case '4':
        return {
          title: 'Aucun Bénéficiaire (PIRE SCÉNARIO)',
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          color: 'red',
          benefits: [],
          drawbacks: [
            'Passe par la probate (frais 1.4% en BC)',
            'Délais importants',
            'Croissance après décès = IMPOSABLE',
            'Complications administratives'
          ],
          process: 'Succession → Probate → Frais → Distribution selon testament'
        };
      default:
        return null;
    }
  };

  const calculatePotentialSavings = () => {
    if (data.relationshipStatus === 'married' || data.relationshipStatus === 'common-law') {
      const totalCELI = data.celiAmount + (data.spouseHasCELI ? data.spouseCELIAmount : 0);
      const probateFees = data.celiAmount * 0.014; // 1.4% en BC
      const potentialDoubleRoom = data.celiAmount; // Peut doubler l'espace CELI
      
      return {
        probateSavings: probateFees,
        doubleRoomBenefit: potentialDoubleRoom,
        totalPotentialValue: totalCELI + potentialDoubleRoom
      };
    }
    return null;
  };

  const savings = calculatePotentialSavings();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-mpr-interactive to-purple-600 bg-clip-text text-transparent mb-4">
          CELI et Succession
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Que devient votre CELI à votre décès ? La réponse dépend entièrement de qui vous nommez comme bénéficiaire 
          et comment vous le nommez. Les enjeux financiers peuvent être énormes.
        </p>
      </div>

      {/* Alerte critique */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertTitle className="text-red-800">⚠️ ATTENTION CRITIQUE</AlertTitle>
        <AlertDescription className="text-red-700 text-lg">
          <strong>Plus de 50% des CELI n'ont PAS de bénéficiaire désigné correctement.</strong> 
          Cela peut coûter des milliers de dollars en frais de probate et en impôts évitables. 
          Vérifiez MAINTENANT vos désignations !
        </AlertDescription>
      </Alert>

      {/* Calculateur personnel */}
      <Card className="bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt border-mpr-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-mpr-interactive" />
            Votre situation personnelle
          </CardTitle>
          <CardDescription>
            Entrez vos informations pour voir l'impact sur votre succession
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Statut relationnel</Label>
                <Select value={data.relationshipStatus} onValueChange={(value: any) => updateData('relationshipStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Célibataire</SelectItem>
                    <SelectItem value="married">Marié(e)</SelectItem>
                    <SelectItem value="common-law">Conjoint de fait</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Montant dans votre CELI</Label>
                <Input
                  type="number"
                  value={data.celiAmount}
                  onChange={(e) => updateData('celiAmount', Number(e.target.value))}
                  placeholder="Ex: 95000"
                />
              </div>

              {(data.relationshipStatus === 'married' || data.relationshipStatus === 'common-law') && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={data.spouseHasCELI}
                      onChange={(e) => updateData('spouseHasCELI', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Mon conjoint a aussi un CELI</Label>
                  </div>

                  {data.spouseHasCELI && (
                    <div>
                      <Label>Montant CELI du conjoint</Label>
                      <Input
                        type="number"
                        value={data.spouseCELIAmount}
                        onChange={(e) => updateData('spouseCELIAmount', Number(e.target.value))}
                        placeholder="Ex: 85000"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Résultats calculés */}
            {savings && (
              <div className="bg-white p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">💰 Impact financier potentiel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Frais de probate évités :</span>
                    <span className="font-bold text-green-600">${savings.probateSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Espace CELI doublé potentiel :</span>
                    <span className="font-bold text-mpr-interactive">${savings.doubleRoomBenefit.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Valeur totale protégée :</span>
                    <span className="font-bold text-purple-600 text-lg">${savings.totalPotentialValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Les 4 scénarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-600" />
            Les 4 scénarios possibles
          </CardTitle>
          <CardDescription>
            Cliquez sur chaque scénario pour comprendre les implications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeScenario} onValueChange={setActiveScenario}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="1" className="text-xs">Successor Holder</TabsTrigger>
              <TabsTrigger value="2" className="text-xs">Beneficiary</TabsTrigger>
              <TabsTrigger value="3" className="text-xs">Non-Conjoint</TabsTrigger>
              <TabsTrigger value="4" className="text-xs">Aucun</TabsTrigger>
            </TabsList>

            {['1', '2', '3', '4'].map(scenario => {
              const info = getScenarioInfo(scenario);
              if (!info) return null;

              return (
                <TabsContent key={scenario} value={scenario} className="mt-6">
                  <Card className={`border-${info.color}-200 bg-${info.color}-50`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {info.icon}
                        {info.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Avantages */}
                        {info.benefits.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Avantages
                            </h4>
                            <ul className="space-y-2">
                              {info.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Inconvénients */}
                        {info.drawbacks.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              Inconvénients
                            </h4>
                            <ul className="space-y-2">
                              {info.drawbacks.map((drawback, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span>{drawback}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Processus */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">📋 Comment ça fonctionne :</h4>
                        <p className="text-sm text-gray-700">{info.process}</p>
                      </div>

                      {/* Recommandation spécifique */}
                      {scenario === '1' && (
                        <Alert className="border-green-500 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800">✅ RECOMMANDATION FORTE</AlertTitle>
                          <AlertDescription className="text-green-700">
                            Si vous êtes marié(e) ou conjoint de fait, nommez ABSOLUMENT votre conjoint comme 
                            "Successor Holder" (pas juste bénéficiaire). C'est la seule façon de préserver 
                            complètement les avantages fiscaux du CELI.
                          </AlertDescription>
                        </Alert>
                      )}

                      {scenario === '2' && (
                        <Alert className="border-yellow-500 bg-yellow-50">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-yellow-800">⚠️ ATTENTION</AlertTitle>
                          <AlertDescription className="text-yellow-700">
                            Si votre conjoint est listé comme "bénéficiaire" seulement, vous perdez de l'argent ! 
                            Changez immédiatement pour "Successor Holder". Le formulaire RC240 est un plan B, 
                            pas la solution optimale.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Guide d'action */}
      <Card className="bg-gradient-to-br from-purple-50 to-mpr-interactive-lt border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-600" />
            Plan d'action immédiat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4 text-purple-800">📋 Étapes à suivre MAINTENANT :</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium">Vérifiez vos désignations actuelles</div>
                    <div className="text-sm text-gray-600">Contactez votre institution financière</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium">Changez pour "Successor Holder"</div>
                    <div className="text-sm text-gray-600">Si vous avez un conjoint</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium">Documentez vos changements</div>
                    <div className="text-sm text-gray-600">Gardez une copie des formulaires</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <div className="font-medium">Révisez annuellement</div>
                    <div className="text-sm text-gray-600">Lors de changements familiaux</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-purple-800">🏦 Institutions à contacter :</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="font-medium">Banques principales</div>
                  <div className="text-gray-600">Institution financière, Caisse populaire, Banque</div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border">
                  <div className="font-medium">Courtiers en ligne</div>
                  <div className="text-gray-600">Questrade, Wealthsimple, Interactive Brokers</div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border">
                  <div className="font-medium">Caisses populaires</div>
                  <div className="text-gray-600">Caisse populaire, autres caisses locales</div>
                </div>
              </div>

              <Alert className="mt-4">
                <HelpCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Phrase magique :</strong> "Je veux changer mon bénéficiaire CELI pour un 
                  'Successor Holder' au lieu d'un simple bénéficiaire."
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ressources et liens utiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ExternalLink className="w-6 h-6 text-mpr-interactive" />
            Ressources officielles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">📄 Documents gouvernementaux :</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.canada.ca/fr/agence-revenu/services/formulaires-publications/formulaires/rc240.html" 
                     className="text-mpr-interactive hover:underline flex items-center gap-2" 
                     target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                    Formulaire RC240 (ARC)
                  </a>
                </li>
                <li>
                  <a href="https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets-impot-particuliers/compte-epargne-libre-impot-celi.html" 
                     className="text-mpr-interactive hover:underline flex items-center gap-2" 
                     target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                    Guide CELI officiel
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">💡 Conseils d'experts :</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vérifiez TOUS vos comptes CELI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Informez votre conjoint de vos désignations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Gardez une copie des formulaires signés</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Révisez lors de changements familiaux</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CELISuccessionModule;
