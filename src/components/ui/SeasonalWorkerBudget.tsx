/**
 * Module Budget pour Travailleurs Saisonniers
 * Adapté aux besoins spécifiques des emplois saisonniers au Québec
 * Guide touristique, paysagiste, déneigeur, étudiant, etc.
 */

import React, { useState, useEffect } from 'react';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Snowflake,
  Sun,
  Leaf,
  GraduationCap,
  MapPin,
  Truck,
  IceCream,
  AlertTriangle,
  CheckCircle,
  PiggyBank,
  Target,
  Clock,
  Calculator,
  BookOpen,
  Home
} from 'lucide-react';

interface SeasonalJob {
  id: string;
  type: 'guide_touristique' | 'paysagiste' | 'deneigeur' | 'etudiant_ete' | 'crème_glacee' | 'autre';
  nom: string;
  salaireHoraire: number;
  heuresParSemaine: number;
  semainesParAnnee: number;
  moisActifs: number[];
  avantages?: {
    assuranceEmploi: boolean;
    rqap: boolean;
    rrq: boolean;
    vacances: number; // pourcentage
  };
}

interface SeasonalExpense {
  id: string;
  nom: string;
  montant: number;
  type: 'fixe' | 'variable' | 'saisonnier';
  moisConcernes?: number[];
  categorie: 'logement' | 'transport' | 'alimentation' | 'education' | 'loisirs' | 'epargne' | 'autre';
  priorite: 'essentiel' | 'important' | 'optionnel';
}

interface SeasonalBudgetData {
  emplois: SeasonalJob[];
  depenses: SeasonalExpense[];
  objectifs: {
    fondsUrgence: number;
    epargneEtudes?: number;
    vacances?: number;
    equipement?: number;
  };
  strategieEpargne: 'conservateur' | 'equilibre' | 'agressif';
}

const jobTypes = [
  {
    value: 'guide_touristique',
    label: 'Guide touristique',
    icon: <MapPin className="w-4 h-4" />,
    saison: 'Été (Mai-Octobre)',
    salaireMoyen: 18,
    description: 'Visites guidées, animation touristique'
  },
  {
    value: 'paysagiste',
    label: 'Entretien paysager',
    icon: <Leaf className="w-4 h-4" />,
    saison: 'Été (Avril-Novembre)',
    salaireMoyen: 20,
    description: 'Aménagement, entretien, jardinage'
  },
  {
    value: 'deneigeur',
    label: 'Déneigement',
    icon: <Snowflake className="w-4 h-4" />,
    saison: 'Hiver (Décembre-Mars)',
    salaireMoyen: 22,
    description: 'Déneigement résidentiel/commercial'
  },
  {
    value: 'etudiant_ete',
    label: 'Emploi étudiant',
    icon: <GraduationCap className="w-4 h-4" />,
    saison: 'Été (Mai-Août)',
    salaireMoyen: 16,
    description: 'Emploi d\'été pour financer les études'
  },
  {
    value: 'crème_glacee',
    label: 'Comptoir crème glacée',
    icon: <IceCream className="w-4 h-4" />,
    saison: 'Été (Mai-Septembre)',
    salaireMoyen: 15,
    description: 'Service alimentaire saisonnier'
  },
  {
    value: 'autre',
    label: 'Autre emploi saisonnier',
    icon: <Sun className="w-4 h-4" />,
    saison: 'Variable',
    salaireMoyen: 18,
    description: 'Autre type d\'emploi saisonnier'
  }
];

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const expenseCategories = [
  { value: 'logement', label: 'Logement', icon: <Home className="w-4 h-4" />, color: 'bg-blue-500' },
  { value: 'transport', label: 'Transport', icon: <Truck className="w-4 h-4" />, color: 'bg-green-500' },
  { value: 'alimentation', label: 'Alimentation', icon: <IceCream className="w-4 h-4" />, color: 'bg-orange-500' },
  { value: 'education', label: 'Éducation', icon: <BookOpen className="w-4 h-4" />, color: 'bg-purple-500' },
  { value: 'loisirs', label: 'Loisirs', icon: <Sun className="w-4 h-4" />, color: 'bg-yellow-500' },
  { value: 'epargne', label: 'Épargne', icon: <PiggyBank className="w-4 h-4" />, color: 'bg-indigo-500' },
  { value: 'autre', label: 'Autre', icon: <Calculator className="w-4 h-4" />, color: 'bg-gray-500' }
];

export const SeasonalWorkerBudget: React.FC = () => {
  const { userData, updateUserData } = useRetirementData();
  
  const [budgetData, setBudgetData] = useState<SeasonalBudgetData>({
    emplois: [],
    depenses: [],
    objectifs: {
      fondsUrgence: 3000,
      epargneEtudes: 0,
      vacances: 0,
      equipement: 0
    },
    strategieEpargne: 'equilibre'
  });

  const [activeTab, setActiveTab] = useState('emplois');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Calculs financiers
  const calculateMonthlyIncome = (mois: number): number => {
    return budgetData.emplois.reduce((total, emploi) => {
      if (emploi.moisActifs.includes(mois)) {
        const salaireHebdo = emploi.salaireHoraire * emploi.heuresParSemaine;
        const salaireMensuel = salaireHebdo * 4.33; // Moyenne semaines/mois
        
        // Ajouter les avantages
        let totalAvecAvantages = salaireMensuel;
        if (emploi.avantages?.vacances) {
          totalAvecAvantages += salaireMensuel * (emploi.avantages.vacances / 100);
        }
        
        return total + totalAvecAvantages;
      }
      return total;
    }, 0);
  };

  const calculateMonthlyExpenses = (mois: number): number => {
    return budgetData.depenses.reduce((total, depense) => {
      if (depense.type === 'fixe' || 
          (depense.type === 'saisonnier' && depense.moisConcernes?.includes(mois))) {
        return total + depense.montant;
      }
      return total;
    }, 0);
  };

  const calculateAnnualIncome = (): number => {
    let total = 0;
    for (let mois = 0; mois < 12; mois++) {
      total += calculateMonthlyIncome(mois);
    }
    return total;
  };

  const calculateAnnualExpenses = (): number => {
    let total = 0;
    for (let mois = 0; mois < 12; mois++) {
      total += calculateMonthlyExpenses(mois);
    }
    return total;
  };

  const getSeasonalAdvice = (): string[] => {
    const advice = [];
    const revenuAnnuel = calculateAnnualIncome();
    const depensesAnnuelles = calculateAnnualExpenses();
    const surplus = revenuAnnuel - depensesAnnuelles;

    if (surplus < 0) {
      advice.push("⚠️ Vos dépenses dépassent vos revenus. Révisez votre budget ou cherchez des revenus supplémentaires.");
    }

    if (budgetData.objectifs.fondsUrgence > surplus * 0.3) {
      advice.push("💡 Votre fonds d'urgence représente plus de 30% de votre surplus. Considérez l'ajuster.");
    }

    const moisActifs = budgetData.emplois.reduce((acc, emploi) => acc + emploi.moisActifs.length, 0);
    if (moisActifs < 8) {
      advice.push("📅 Avec moins de 8 mois de travail, planifiez soigneusement vos dépenses hors-saison.");
    }

    if (budgetData.emplois.some(e => e.type === 'etudiant_ete') && !budgetData.objectifs.epargneEtudes) {
      advice.push("🎓 En tant qu'étudiant, définissez un objectif d'épargne pour vos études.");
    }

    return advice;
  };

  const addJob = () => {
    const newJob: SeasonalJob = {
      id: `job-${Date.now()}`,
      type: 'autre',
      nom: '',
      salaireHoraire: 18,
      heuresParSemaine: 35,
      semainesParAnnee: 20,
      moisActifs: [5, 6, 7, 8], // Mai à Août par défaut
      avantages: {
        assuranceEmploi: true,
        rqap: true,
        rrq: true,
        vacances: 4
      }
    };

    setBudgetData(prev => ({
      ...prev,
      emplois: [...prev.emplois, newJob]
    }));
  };

  const updateJob = (jobId: string, updates: Partial<SeasonalJob>) => {
    setBudgetData(prev => ({
      ...prev,
      emplois: prev.emplois.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    }));
  };

  const removeJob = (jobId: string) => {
    setBudgetData(prev => ({
      ...prev,
      emplois: prev.emplois.filter(job => job.id !== jobId)
    }));
  };

  const addExpense = () => {
    const newExpense: SeasonalExpense = {
      id: `expense-${Date.now()}`,
      nom: '',
      montant: 0,
      type: 'fixe',
      categorie: 'autre',
      priorite: 'important'
    };

    setBudgetData(prev => ({
      ...prev,
      depenses: [...prev.depenses, newExpense]
    }));
  };

  const updateExpense = (expenseId: string, updates: Partial<SeasonalExpense>) => {
    setBudgetData(prev => ({
      ...prev,
      depenses: prev.depenses.map(expense => 
        expense.id === expenseId ? { ...expense, ...updates } : expense
      )
    }));
  };

  const removeExpense = (expenseId: string) => {
    setBudgetData(prev => ({
      ...prev,
      depenses: prev.depenses.filter(expense => expense.id !== expenseId)
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Sauvegarder automatiquement les données de manière chiffrée
  const saveSeasonalData = () => {
    updateUserData('personal', { seasonalBudgetData: budgetData } as any);
  };

  // Charger les données sauvegardées au montage
  useEffect(() => {
    const savedSeasonalData = (userData.personal as any)?.seasonalBudgetData;
    if (savedSeasonalData) {
      setBudgetData(savedSeasonalData);
    }
  }, [userData]);

  // Sauvegarder automatiquement à chaque modification
  useEffect(() => {
    // Ne pas sauvegarder lors du premier rendu (données par défaut)
    if (budgetData.emplois.length > 0 || budgetData.depenses.length > 0 || 
        budgetData.objectifs.fondsUrgence !== 3000) {
      saveSeasonalData();
    }
  }, [budgetData]);

  const revenuAnnuel = calculateAnnualIncome();
  const depensesAnnuelles = calculateAnnualExpenses();
  const surplus = revenuAnnuel - depensesAnnuelles;
  const revenuMensuelActuel = calculateMonthlyIncome(selectedMonth);
  const depensesMensuellesActuelles = calculateMonthlyExpenses(selectedMonth);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-orange-900">
            <Sun className="h-6 w-6 mr-2" />
            Budget pour Travailleurs Saisonniers
          </CardTitle>
          <CardDescription className="text-orange-700">
            Planifiez vos finances avec des revenus variables selon les saisons. 
            Optimisé pour guides touristiques, paysagistes, déneigeurs, étudiants et plus.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-100 to-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-800">
              {formatCurrency(revenuAnnuel)}
            </div>
            <div className="text-sm text-green-700">Revenus annuels</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-100 to-red-200">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-red-800">
              {formatCurrency(depensesAnnuelles)}
            </div>
            <div className="text-sm text-red-700">Dépenses annuelles</div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${surplus >= 0 ? 'from-blue-100 to-blue-200' : 'from-red-100 to-red-200'}`}>
          <CardContent className="p-4 text-center">
            <Calculator className={`w-6 h-6 mx-auto mb-2 ${surplus >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            <div className={`text-lg font-bold ${surplus >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              {formatCurrency(surplus)}
            </div>
            <div className={`text-sm ${surplus >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {surplus >= 0 ? 'Surplus annuel' : 'Déficit annuel'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-800">
              {formatCurrency(budgetData.objectifs.fondsUrgence)}
            </div>
            <div className="text-sm text-purple-700">Fonds d'urgence</div>
          </CardContent>
        </Card>
      </div>

      {/* Conseils saisonniers */}
      {getSeasonalAdvice().length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="space-y-2">
              <strong className="text-yellow-800">Conseils pour travailleurs saisonniers :</strong>
              {getSeasonalAdvice().map((conseil, index) => (
                <div key={index} className="text-yellow-700 text-sm">{conseil}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emplois">Emplois saisonniers</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
        </TabsList>

        {/* Gestion des emplois */}
        <TabsContent value="emplois" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vos emplois saisonniers</h3>
            <Button onClick={addJob}>
              <Sun className="w-4 h-4 mr-2" />
              Ajouter un emploi
            </Button>
          </div>

          {budgetData.emplois.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Sun className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">Aucun emploi saisonnier configuré</p>
                <Button onClick={addJob}>Ajouter votre premier emploi</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {budgetData.emplois.map((emploi) => {
                const jobType = jobTypes.find(t => t.value === emploi.type);
                const revenuAnnuelEmploi = emploi.salaireHoraire * emploi.heuresParSemaine * emploi.semainesParAnnee;
                
                return (
                  <Card key={emploi.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {jobType?.icon}
                          <CardTitle className="text-lg">{emploi.nom || jobType?.label}</CardTitle>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeJob(emploi.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Type d'emploi</Label>
                          <Select
                            value={emploi.type}
                            onValueChange={(value) => updateJob(emploi.id, { type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    {type.icon}
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Nom de l'emploi</Label>
                          <Input
                            value={emploi.nom}
                            onChange={(e) => updateJob(emploi.id, { nom: e.target.value })}
                            placeholder="Ex: Guide au Vieux-Québec"
                          />
                        </div>

                        <div>
                          <Label>Salaire horaire ($)</Label>
                          <Input
                            type="number"
                            value={emploi.salaireHoraire}
                            onChange={(e) => updateJob(emploi.id, { salaireHoraire: parseFloat(e.target.value) || 0 })}
                            step="0.50"
                          />
                        </div>

                        <div>
                          <Label>Heures par semaine</Label>
                          <Input
                            type="number"
                            value={emploi.heuresParSemaine}
                            onChange={(e) => updateJob(emploi.id, { heuresParSemaine: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div>
                          <Label>Semaines par année</Label>
                          <Input
                            type="number"
                            value={emploi.semainesParAnnee}
                            onChange={(e) => updateJob(emploi.id, { semainesParAnnee: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div>
                          <Label>Revenus annuels estimés</Label>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(revenuAnnuelEmploi)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Mois actifs</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {monthNames.map((month, index) => (
                            <Button
                              key={index}
                              variant={emploi.moisActifs.includes(index) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const newMoisActifs = emploi.moisActifs.includes(index)
                                  ? emploi.moisActifs.filter(m => m !== index)
                                  : [...emploi.moisActifs, index];
                                updateJob(emploi.id, { moisActifs: newMoisActifs });
                              }}
                            >
                              {month.substring(0, 3)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Gestion des dépenses */}
        <TabsContent value="depenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vos dépenses</h3>
            <Button onClick={addExpense}>
              <DollarSign className="w-4 h-4 mr-2" />
              Ajouter une dépense
            </Button>
          </div>

          {budgetData.depenses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">Aucune dépense configurée</p>
                <Button onClick={addExpense}>Ajouter votre première dépense</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {budgetData.depenses.map((depense) => {
                const category = expenseCategories.find(c => c.value === depense.categorie);
                
                return (
                  <Card key={depense.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <Label>Nom</Label>
                          <Input
                            value={depense.nom}
                            onChange={(e) => updateExpense(depense.id, { nom: e.target.value })}
                            placeholder="Ex: Loyer"
                          />
                        </div>

                        <div>
                          <Label>Montant ($)</Label>
                          <Input
                            type="number"
                            value={depense.montant}
                            onChange={(e) => updateExpense(depense.id, { montant: parseFloat(e.target.value) || 0 })}
                          />
                        </div>

                        <div>
                          <Label>Type</Label>
                          <Select
                            value={depense.type}
                            onValueChange={(value) => updateExpense(depense.id, { type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixe">Fixe (mensuel)</SelectItem>
                              <SelectItem value="variable">Variable</SelectItem>
                              <SelectItem value="saisonnier">Saisonnier</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Catégorie</Label>
                          <Select
                            value={depense.categorie}
                            onValueChange={(value) => updateExpense(depense.id, { categorie: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {expenseCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  <div className="flex items-center gap-2">
                                    {cat.icon}
                                    {cat.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Priorité</Label>
                          <Select
                            value={depense.priorite}
                            onValueChange={(value) => updateExpense(depense.id, { priorite: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="essentiel">Essentiel</SelectItem>
                              <SelectItem value="important">Important</SelectItem>
                              <SelectItem value="optionnel">Optionnel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExpense(depense.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Calendrier saisonnier */}
        <TabsContent value="calendrier" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Calendrier financier</h3>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenus - {monthNames[selectedMonth]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-4">
                  {formatCurrency(revenuMensuelActuel)}
                </div>
                
                {budgetData.emplois.map((emploi) => {
                  if (!emploi.moisActifs.includes(selectedMonth)) return null;
                  
                  const revenuMensuel = (emploi.salaireHoraire * emploi.heuresParSemaine * 4.33);
                  return (
                    <div key={emploi.id} className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">{emploi.nom || jobTypes.find(t => t.value === emploi.type)?.label}</span>
                      <span className="font-medium">{formatCurrency(revenuMensuel)}</span>
                    </div>
                  );
                })}
                
                {revenuMensuelActuel === 0 && (
                  <p className="text-gray-500 text-sm">Aucun revenu prévu ce mois-ci</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dépenses - {monthNames[selectedMonth]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 mb-4">
                  {formatCurrency(depensesMensuellesActuelles)}
                </div>
                
                {budgetData.depenses.map((depense) => {
                  if (depense.type === 'fixe' || 
                      (depense.type === 'saisonnier' && depense.moisConcernes?.includes(selectedMonth))) {
                    return (
                      <div key={depense.id} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm">{depense.nom}</span>
                        <span className="font-medium">{formatCurrency(depense.montant)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
                
                {depensesMensuellesActuelles === 0 && (
                  <p className="text-gray-500 text-sm">Aucune dépense prévue ce mois-ci</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Graphique annuel */}
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble annuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthNames.map((month, index) => {
                  const revenus = calculateMonthlyIncome(index);
                  const depenses = calculateMonthlyExpenses(index);
                  const solde = revenus - depenses;
                  const maxAmount = Math.max(revenus, depenses) || 1;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{month}</span>
                        <span className={`text-sm font-bold ${solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(solde)}
                        </span>
                      </div>
                      <div className="flex gap-1 h-4">
                        <div 
                          className="bg-green-200 rounded-l"
                          style={{ width: `${(revenus / maxAmount) * 100}%` }}
                          title={`Revenus: ${formatCurrency(revenus)}`}
                        />
                        <div 
                          className="bg-red-200 rounded-r"
                          style={{ width: `${(depenses / maxAmount) * 100}%` }}
                          title={`Dépenses: ${formatCurrency(depenses)}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectifs d'épargne */}
        <TabsContent value="objectifs" className="space-y-4">
          <h3 className="text-lg font-semibold">Objectifs financiers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  Fonds d'urgence
                </CardTitle>
                <CardDescription>
                  Recommandé : 3-6 mois de dépenses pour les travailleurs saisonniers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Objectif fonds d'urgence ($)</Label>
                  <Input
                    type="number"
                    value={budgetData.objectifs.fondsUrgence}
                    onChange={(e) => setBudgetData(prev => ({
                      ...prev,
                      objectifs: {
                        ...prev.objectifs,
                        fondsUrgence: parseFloat(e.target.value) || 0
                      }
                    }))}
                    step="100"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Recommandation basée sur vos dépenses : {formatCurrency(depensesAnnuelles / 2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Épargne études
                </CardTitle>
                <CardDescription>
                  Pour les étudiants : frais de scolarité, livres, résidence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Objectif épargne études ($)</Label>
                  <Input
                    type="number"
                    value={budgetData.objectifs.epargneEtudes || 0}
                    onChange={(e) => setBudgetData(prev => ({
                      ...prev,
                      objectifs: {
                        ...prev.objectifs,
                        epargneEtudes: parseFloat(e.target.value) || 0
                      }
                    }))}
                    step="100"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Coûts typiques au Québec :
                  <br />• Cégep : ~200$/session
                  <br />• Université : ~3,000$/session
                  <br />• Résidence : ~4,000$/session
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Vacances/Loisirs
                </CardTitle>
                <CardDescription>
                  Budget pour les périodes hors-saison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Objectif vacances ($)</Label>
                  <Input
                    type="number"
                    value={budgetData.objectifs.vacances || 0}
                    onChange={(e) => setBudgetData(prev => ({
                      ...prev,
                      objectifs: {
                        ...prev.objectifs,
                        vacances: parseFloat(e.target.value) || 0
                      }
                    }))}
                    step="100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Équipement professionnel
                </CardTitle>
                <CardDescription>
                  Outils, véhicule, équipement spécialisé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Objectif équipement ($)</Label>
                  <Input
                    type="number"
                    value={budgetData.objectifs.equipement || 0}
                    onChange={(e) => setBudgetData(prev => ({
                      ...prev,
                      objectifs: {
                        ...prev.objectifs,
                        equipement: parseFloat(e.target.value) || 0
                      }
                    }))}
                    step="100"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stratégie d'épargne */}
          <Card>
            <CardHeader>
              <CardTitle>Stratégie d'épargne</CardTitle>
              <CardDescription>
                Choisissez votre approche selon votre tolérance au risque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    value: 'conservateur',
                    label: 'Conservateur',
                    description: 'Compte épargne, CPG',
                    rendement: '2-3%',
                    risque: 'Très faible'
                  },
                  {
                    value: 'equilibre',
                    label: 'Équilibré',
                    description: 'Mix épargne/placements',
                    rendement: '4-6%',
                    risque: 'Modéré'
                  },
                  {
                    value: 'agressif',
                    label: 'Agressif',
                    description: 'Placements diversifiés',
                    rendement: '6-8%',
                    risque: 'Élevé'
                  }
                ].map((strategie) => (
                  <div
                    key={strategie.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      budgetData.strategieEpargne === strategie.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBudgetData(prev => ({
                      ...prev,
                      strategieEpargne: strategie.value as any
                    }))}
                  >
                    <div className="font-medium">{strategie.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{strategie.description}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Rendement: {strategie.rendement}<br />
                      Risque: {strategie.risque}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

        {/* Conseils spécialisés */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CheckCircle className="w-5 h-5" />
            Conseils pour travailleurs saisonniers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">💰 Gestion des revenus</h4>
              <ul className="space-y-1">
                <li>• Épargnez 20-30% pendant la haute saison</li>
                <li>• Ouvrez un compte séparé pour les impôts</li>
                <li>• Planifiez l'assurance-emploi hors-saison</li>
                <li>• Négociez des paiements différés si possible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📅 Planification saisonnière</h4>
              <ul className="space-y-1">
                <li>• Réduisez les dépenses non-essentielles hors-saison</li>
                <li>• Profitez des rabais hors-saison pour l'équipement</li>
                <li>• Considérez un emploi complémentaire l'hiver</li>
                <li>• Planifiez les grosses dépenses en haute saison</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎓 Spécial étudiants</h4>
              <ul className="space-y-1">
                <li>• Maximisez les crédits d'impôt pour études</li>
                <li>• Explorez les bourses et aide financière</li>
                <li>• Considérez les programmes coop/stages</li>
                <li>• Budgetez pour les manuels et matériel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🏠 Logement flexible</h4>
              <ul className="space-y-1">
                <li>• Explorez la colocation saisonnière</li>
                <li>• Négociez des baux flexibles</li>
                <li>• Considérez le logement fourni par l'employeur</li>
                <li>• Planifiez les déménagements selon les saisons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateur de sauvegarde sécurisée */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">🔒 Données sécurisées</span>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Toutes vos données personnelles sont automatiquement chiffrées avec AES-256 
            et stockées localement dans votre navigateur. Aucune information n'est transmise 
            vers des serveurs externes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalWorkerBudget;
