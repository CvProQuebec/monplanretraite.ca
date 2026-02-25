import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  WeeklyFinancialSnapshot, 
  FinancialAlert, 
  UpcomingExpense,
  ExpenseCategory 
} from '../types/expense-scenarios';
import { ExpenseScenarioService } from '../services/ExpenseScenarioService';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Plus,
  Edit,
  Target,
  BarChart3,
  PieChart,
  Clock
} from 'lucide-react';

interface WeeklyFinancialTrackerProps {
  onSnapshotUpdate?: (snapshot: WeeklyFinancialSnapshot) => void;
}

export const WeeklyFinancialTracker: React.FC<WeeklyFinancialTrackerProps> = ({
  onSnapshotUpdate
}) => {
  const [currentSnapshot, setCurrentSnapshot] = useState<WeeklyFinancialSnapshot | null>(null);
  const [weeklySnapshots, setWeeklySnapshots] = useState<WeeklyFinancialSnapshot[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [plannedIncome, setPlannedIncome] = useState(0);
  const [actualIncome, setActualIncome] = useState(0);
  const [plannedExpenses, setPlannedExpenses] = useState(0);
  const [actualExpenses, setActualExpenses] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(5000);

  useEffect(() => {
    loadWeeklyData();
    generateCurrentSnapshot();
  }, []);

  const loadWeeklyData = () => {
    try {
      const saved = localStorage.getItem('weekly_financial_snapshots');
      if (saved) {
        const snapshots = JSON.parse(saved);
        setWeeklySnapshots(snapshots.map((s: any) => ({
          ...s,
          weekStartDate: new Date(s.weekStartDate),
          weekEndDate: new Date(s.weekEndDate),
          alerts: s.alerts.map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt)
          })),
          upcomingExpenses: s.upcomingExpenses.map((e: any) => ({
            ...e,
            dueDate: new Date(e.dueDate)
          }))
        })));
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
    }
  };

  const saveWeeklyData = (snapshots: WeeklyFinancialSnapshot[]) => {
    try {
      localStorage.setItem('weekly_financial_snapshots', JSON.stringify(snapshots));
    } catch (error) {
      console.error('Error saving weekly data:', error);
    }
  };

  const generateCurrentSnapshot = () => {
    const snapshot = ExpenseScenarioService.generateWeeklySnapshot(
      currentBalance,
      plannedIncome,
      actualIncome,
      plannedExpenses,
      actualExpenses
    );
    setCurrentSnapshot(snapshot);
    onSnapshotUpdate?.(snapshot);
  };

  const saveCurrentWeek = () => {
    if (!currentSnapshot) return;

    const updatedSnapshots = [...weeklySnapshots, currentSnapshot];
    setWeeklySnapshots(updatedSnapshots);
    saveWeeklyData(updatedSnapshots);
    setIsEditing(false);
    
    // Reset for next week
    setPlannedIncome(0);
    setActualIncome(0);
    setPlannedExpenses(0);
    setActualExpenses(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getAlertIcon = (severity: 'info' | 'warning' | 'error') => {
    switch (severity) {
      case 'info': return <CheckCircle className="h-4 w-4 text-mpr-interactive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getAlertColor = (severity: 'info' | 'warning' | 'error') => {
    switch (severity) {
      case 'info': return 'border-mpr-border bg-mpr-interactive-lt';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
    }
  };

  const calculateWeeklyTrends = () => {
    if (weeklySnapshots.length < 2) return null;

    const recent = weeklySnapshots.slice(-4); // Last 4 weeks
    const avgIncome = recent.reduce((sum, s) => sum + s.actualIncome, 0) / recent.length;
    const avgExpenses = recent.reduce((sum, s) => sum + s.actualExpenses, 0) / recent.length;
    const avgBalance = recent.reduce((sum, s) => sum + s.accountBalance, 0) / recent.length;

    return { avgIncome, avgExpenses, avgBalance };
  };

  const trends = calculateWeeklyTrends();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Suivi financier hebdomadaire</h1>
          <p className="text-gray-600">
            Surveillez vos finances semaine par semaine pour éviter les surprises
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Terminer' : 'Modifier'}
          </Button>
        </div>
      </div>

      {/* Current Week Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Solde actuel</p>
                <p className="text-xl font-bold">{formatCurrency(currentBalance)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenus cette semaine</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(actualIncome)}</p>
                {plannedIncome > 0 && (
                  <p className="text-xs text-gray-400">Prévu: {formatCurrency(plannedIncome)}</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dépenses cette semaine</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(actualExpenses)}</p>
                {plannedExpenses > 0 && (
                  <p className="text-xs text-gray-400">Prévu: {formatCurrency(plannedExpenses)}</p>
                )}
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Flux net</p>
                <p className={`text-xl font-bold ${
                  actualIncome - actualExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(actualIncome - actualExpenses)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Semaine actuelle</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Saisie des données hebdomadaires</CardTitle>
                <CardDescription>
                  Mettez à jour vos revenus et dépenses pour cette semaine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-700">Revenus</h3>
                    <div>
                      <Label htmlFor="planned-income">Revenus prévus</Label>
                      <Input
                        id="planned-income"
                        type="number"
                        value={plannedIncome}
                        onChange={(e) => setPlannedIncome(Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actual-income">Revenus réels</Label>
                      <Input
                        id="actual-income"
                        type="number"
                        value={actualIncome}
                        onChange={(e) => setActualIncome(Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-700">Dépenses</h3>
                    <div>
                      <Label htmlFor="planned-expenses">Dépenses prévues</Label>
                      <Input
                        id="planned-expenses"
                        type="number"
                        value={plannedExpenses}
                        onChange={(e) => setPlannedExpenses(Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actual-expenses">Dépenses réelles</Label>
                      <Input
                        id="actual-expenses"
                        type="number"
                        value={actualExpenses}
                        onChange={(e) => setActualExpenses(Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="current-balance">Solde de compte actuel</Label>
                  <Input
                    id="current-balance"
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateCurrentSnapshot}>
                    Prévisualiser
                  </Button>
                  <Button onClick={saveCurrentWeek} variant="default">
                    Sauvegarder la semaine
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            currentSnapshot && (
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la semaine</CardTitle>
                  <CardDescription>
                    Du {currentSnapshot.weekStartDate.toLocaleDateString('fr-CA')} au {currentSnapshot.weekEndDate.toLocaleDateString('fr-CA')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Revenus</p>
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(currentSnapshot.actualIncome)}</p>
                      {currentSnapshot.plannedIncome > 0 && (
                        <p className="text-xs text-green-500">
                          vs {formatCurrency(currentSnapshot.plannedIncome)} prévu
                        </p>
                      )}
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">Dépenses</p>
                      <p className="text-2xl font-bold text-red-700">{formatCurrency(currentSnapshot.actualExpenses)}</p>
                      {currentSnapshot.plannedExpenses > 0 && (
                        <p className="text-xs text-red-500">
                          vs {formatCurrency(currentSnapshot.plannedExpenses)} prévu
                        </p>
                      )}
                    </div>
                    
                    <div className={`text-center p-4 rounded-lg ${
                      currentSnapshot.netCashFlow >= 0 ? 'bg-mpr-interactive-lt' : 'bg-yellow-50'
                    }`}>
                      <p className={`text-sm ${
                        currentSnapshot.netCashFlow >= 0 ? 'text-mpr-interactive' : 'text-yellow-600'
                      }`}>Flux net</p>
                      <p className={`text-2xl font-bold ${
                        currentSnapshot.netCashFlow >= 0 ? 'text-mpr-navy' : 'text-yellow-700'
                      }`}>
                        {formatCurrency(currentSnapshot.netCashFlow)}
                      </p>
                    </div>
                  </div>

                  {currentSnapshot.plannedIncome > 0 && currentSnapshot.plannedExpenses > 0 && (
                    <div className="space-y-2">
                      <Label>Respect du budget</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenus</span>
                          <span>{((currentSnapshot.actualIncome / currentSnapshot.plannedIncome) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(currentSnapshot.actualIncome / currentSnapshot.plannedIncome) * 100} 
                          className="h-2"
                        />
                        
                        <div className="flex justify-between text-sm">
                          <span>Dépenses</span>
                          <span>{((currentSnapshot.actualExpenses / currentSnapshot.plannedExpenses) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(currentSnapshot.actualExpenses / currentSnapshot.plannedExpenses) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {weeklySnapshots.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                <p className="text-gray-600">
                  Commencez à saisir vos données hebdomadaires pour voir l'historique.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {weeklySnapshots.slice().reverse().map((snapshot, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        Semaine du {snapshot.weekStartDate.toLocaleDateString('fr-CA')}
                      </CardTitle>
                      <Badge variant={snapshot.netCashFlow >= 0 ? "default" : "destructive"}>
                        {formatCurrency(snapshot.netCashFlow)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Revenus</p>
                        <p className="font-semibold text-green-600">{formatCurrency(snapshot.actualIncome)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Dépenses</p>
                        <p className="font-semibold text-red-600">{formatCurrency(snapshot.actualExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Solde</p>
                        <p className="font-semibold">{formatCurrency(snapshot.accountBalance)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {trends ? (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances sur 4 semaines</CardTitle>
                  <CardDescription>Moyennes basées sur les 4 dernières semaines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600">Revenus moyens</p>
                      <p className="text-xl font-bold text-green-700">{formatCurrency(trends.avgIncome)}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-red-600">Dépenses moyennes</p>
                      <p className="text-xl font-bold text-red-700">{formatCurrency(trends.avgExpenses)}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
                      <DollarSign className="h-8 w-8 text-mpr-interactive mx-auto mb-2" />
                      <p className="text-sm text-mpr-interactive">Solde moyen</p>
                      <p className="text-xl font-bold text-mpr-navy">{formatCurrency(trends.avgBalance)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pas assez de données</h3>
                <p className="text-gray-600">
                  Saisissez au moins 2 semaines de données pour voir les tendances.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {currentSnapshot?.alerts && currentSnapshot.alerts.length > 0 ? (
            <div className="space-y-4">
              {currentSnapshot.alerts.map((alert, index) => (
                <Alert key={index} className={getAlertColor(alert.severity)}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <AlertDescription>
                        <p className="font-medium mb-1">{alert.message}</p>
                        {alert.suggestedActions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Actions suggérées:</p>
                            <ul className="text-sm space-y-1">
                              {alert.suggestedActions.map((action, i) => (
                                <li key={i} className="flex items-center">
                                  <Target className="h-3 w-3 mr-2" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune alerte</h3>
                <p className="text-gray-600">
                  Votre situation financière semble stable cette semaine.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
