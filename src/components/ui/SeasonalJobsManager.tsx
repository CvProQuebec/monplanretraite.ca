import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MoneyInput from '@/components/ui/MoneyInput';
import { 
  Calendar, 
  Plus,
  Trash2,
  Calculator,
  Info,
  Sun,
  Snowflake,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export interface SeasonalJob {
  id: string;
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate: string;
  estimatedEarnings: number;
  actualEarnings?: number;
  isCompleted: boolean;
  jobType: 'summer' | 'winter' | 'spring' | 'fall' | 'custom';
  notes?: string;
}

interface SeasonalJobsManagerProps {
  personNumber: 1 | 2;
  personName: string;
  data?: SeasonalJob[];
  onDataChange: (data: SeasonalJob[]) => void;
  isFrench: boolean;
}

const SeasonalJobsManager: React.FC<SeasonalJobsManagerProps> = ({
  personNumber,
  personName,
  data = [],
  onDataChange,
  isFrench
}) => {
  
  const [seasonalJobs, setSeasonalJobs] = useState<SeasonalJob[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Types d'emplois saisonniers prédéfinis
  const jobTypes = [
    { 
      value: 'summer', 
      label: isFrench ? 'Été' : 'Summer',
      icon: <Sun className="w-4 h-4 text-yellow-500" />,
      color: 'bg-yellow-500',
      examples: isFrench 
        ? ['Kiosque de crème glacée', 'Guide touristique', 'Sauveteur', 'Animateur de camp']
        : ['Ice cream stand', 'Tour guide', 'Lifeguard', 'Camp counselor']
    },
    { 
      value: 'winter', 
      label: isFrench ? 'Hiver' : 'Winter',
      icon: <Snowflake className="w-4 h-4 text-mpr-interactive" />,
      color: 'bg-mpr-interactive',
      examples: isFrench 
        ? ['Déneigeur', 'Moniteur de ski', 'Préparateur fiscal', 'Vendeur temps des fêtes']
        : ['Snow removal', 'Ski instructor', 'Tax preparer', 'Holiday sales']
    },
    { 
      value: 'spring', 
      label: isFrench ? 'Printemps' : 'Spring',
      icon: <span className="w-4 h-4 text-green-500">🌱</span>,
      color: 'bg-green-500',
      examples: isFrench 
        ? ['Jardinier', 'Paysagiste', 'Préparateur jardins', 'Nettoyage printemps']
        : ['Gardener', 'Landscaper', 'Garden prep', 'Spring cleaning']
    },
    { 
      value: 'fall', 
      label: isFrench ? 'Automne' : 'Fall',
      icon: <span className="w-4 h-4 text-orange-500">🍂</span>,
      color: 'bg-orange-500',
      examples: isFrench 
        ? ['Récolte', 'Ramassage feuilles', 'Préparation hiver', 'Vendanges']
        : ['Harvest', 'Leaf collection', 'Winter prep', 'Grape harvest']
    },
    { 
      value: 'custom', 
      label: isFrench ? 'Personnalisé' : 'Custom',
      icon: <Calendar className="w-4 h-4 text-purple-500" />,
      color: 'bg-purple-500',
      examples: isFrench 
        ? ['Période spécifique', 'Contrat particulier', 'Événement spécial']
        : ['Specific period', 'Special contract', 'Special event']
    }
  ];

  // Synchroniser avec les props
  useEffect(() => {
    setSeasonalJobs(data);
  }, [data]);

  // Calculer la durée en jours
  const calculateDuration = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculer le salaire journalier estimé
  const calculateDailyRate = (earnings: number, startDate: string, endDate: string): number => {
    const duration = calculateDuration(startDate, endDate);
    return duration > 0 ? earnings / duration : 0;
  };

  // Ajouter un nouvel emploi saisonnier
  const addSeasonalJob = () => {
    const newJob: SeasonalJob = {
      id: `seasonal-${Date.now()}`,
      jobTitle: '',
      employer: '',
      startDate: '',
      endDate: '',
      estimatedEarnings: 0,
      isCompleted: false,
      jobType: 'summer',
      notes: ''
    };
    
    const updated = [...seasonalJobs, newJob];
    setSeasonalJobs(updated);
    onDataChange(updated);
    setEditingId(newJob.id);
  };

  // Mettre à jour un emploi
  const updateSeasonalJob = (id: string, updates: Partial<SeasonalJob>) => {
    const updated = seasonalJobs.map(job => 
      job.id === id ? { ...job, ...updates } : job
    );
    
    setSeasonalJobs(updated);
    onDataChange(updated);
  };

  // Supprimer un emploi
  const removeSeasonalJob = (id: string) => {
    const updated = seasonalJobs.filter(job => job.id !== id);
    setSeasonalJobs(updated);
    onDataChange(updated);
  };

  // Obtenir les informations du type d'emploi
  const getJobTypeInfo = (type: string) => {
    return jobTypes.find(t => t.value === type) || jobTypes[0];
  };

  // Formater la devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculer les totaux
  const calculateTotals = () => {
    const currentYear = new Date().getFullYear();
    
    const totals = {
      totalEstimated: 0,
      totalActual: 0,
      completedJobs: 0,
      upcomingJobs: 0,
      currentYearEstimated: 0,
      currentYearActual: 0
    };

    seasonalJobs.forEach(job => {
      const jobYear = new Date(job.startDate).getFullYear();
      
      totals.totalEstimated += job.estimatedEarnings;
      totals.totalActual += job.actualEarnings || 0;
      
      if (job.isCompleted) {
        totals.completedJobs++;
      } else {
        totals.upcomingJobs++;
      }
      
      if (jobYear === currentYear) {
        totals.currentYearEstimated += job.estimatedEarnings;
        totals.currentYearActual += job.actualEarnings || 0;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <Card className="bg-white border border-gray-300">
      <CardHeader className="border-b border-gray-300">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            {personNumber}
          </div>
          <Calendar className="w-6 h-6 text-gray-600" />
          {isFrench ? 'Emplois saisonniers' : 'Seasonal Jobs'} - {personName}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isFrench 
            ? 'Gérez vos emplois saisonniers avec périodes et gains approximatifs'
            : 'Manage your seasonal jobs with periods and estimated earnings'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        
        {/* Résumé des totaux */}
        <Card className="bg-gray-50 border border-gray-300">
          <CardContent className="p-4">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              {isFrench ? 'Résumé des emplois saisonniers' : 'Seasonal Jobs Summary'}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(totals.currentYearEstimated)}
                </div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Estimé cette année' : 'Estimated This Year'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(totals.currentYearActual)}
                </div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Réel cette année' : 'Actual This Year'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totals.completedJobs}
                </div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Emplois terminés' : 'Completed Jobs'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totals.upcomingJobs}
                </div>
                <div className="text-sm text-gray-600">
                  {isFrench ? 'Emplois à venir' : 'Upcoming Jobs'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des emplois saisonniers */}
        <div className="space-y-4">
          {seasonalJobs.map((job) => {
            const typeInfo = getJobTypeInfo(job.jobType);
            const isEditing = editingId === job.id;
            const duration = calculateDuration(job.startDate, job.endDate);
            const dailyRate = calculateDailyRate(job.estimatedEarnings, job.startDate, job.endDate);
            
            return (
              <Card key={job.id} className={`border-2 ${job.isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-slate-600 bg-slate-700/50'}`}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Type et statut */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        {typeInfo.icon}
                        <span className="text-sm font-medium text-white">{typeInfo.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateSeasonalJob(job.id, { isCompleted: !job.isCompleted })}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            job.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                          }`}
                          title={job.isCompleted ? (isFrench ? 'Marquer comme en cours' : 'Mark as ongoing') : (isFrench ? 'Marquer comme terminé' : 'Mark as completed')}
                        >
                          {job.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </button>
                        <span className="text-xs text-gray-400">
                          {job.isCompleted ? (isFrench ? 'Terminé' : 'Completed') : (isFrench ? 'En cours' : 'Ongoing')}
                        </span>
                      </div>
                    </div>

                    {/* Titre et employeur */}
                    <div className="md:col-span-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={job.jobTitle}
                            onChange={(e) => updateSeasonalJob(job.id, { jobTitle: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            placeholder={isFrench ? 'Titre du poste...' : 'Job title...'}
                          />
                          <Input
                            value={job.employer}
                            onChange={(e) => updateSeasonalJob(job.id, { employer: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            placeholder={isFrench ? 'Employeur...' : 'Employer...'}
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-white">
                            {job.jobTitle || (isFrench ? 'Emploi sans nom' : 'Unnamed job')}
                          </div>
                          <div className="text-sm text-gray-400">
                            {job.employer || (isFrench ? 'Employeur non spécifié' : 'Employer not specified')}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="md:col-span-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <DateInput
                            value={job.startDate}
                            onChange={(value) => updateSeasonalJob(job.id, { startDate: value })}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            placeholder={isFrench ? 'Date début' : 'Start date'}
                          />
                          <DateInput
                            value={job.endDate}
                            onChange={(value) => updateSeasonalJob(job.id, { endDate: value })}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            placeholder={isFrench ? 'Date fin' : 'End date'}
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-white">
                            {job.startDate ? new Date(job.startDate).toLocaleDateString('fr-CA') : '-'} 
                            {' → '}
                            {job.endDate ? new Date(job.endDate).toLocaleDateString('fr-CA') : '-'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {duration > 0 ? `${duration} ${isFrench ? 'jours' : 'days'}` : '-'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gains */}
                    <div className="md:col-span-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <MoneyInput
                            value={job.estimatedEarnings}
                            onChange={(value) => updateSeasonalJob(job.id, { estimatedEarnings: value })}
                            className="bg-slate-600 border-slate-500 text-white text-sm"
                            placeholder="0"
                            allowDecimals={true}
                          />
                          {job.isCompleted && (
                            <MoneyInput
                              value={job.actualEarnings || 0}
                              onChange={(value) => updateSeasonalJob(job.id, { actualEarnings: value })}
                              className="bg-slate-600 border-slate-500 text-white text-sm"
                              placeholder="0"
                              allowDecimals={true}
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-green-400">
                            {isFrench ? 'Est:' : 'Est:'} {formatCurrency(job.estimatedEarnings)}
                          </div>
                          {job.isCompleted && job.actualEarnings && (
                            <div className="text-sm font-medium text-mpr-interactive">
                              {isFrench ? 'Réel:' : 'Act:'} {formatCurrency(job.actualEarnings)}
                            </div>
                          )}
                          {dailyRate > 0 && (
                            <div className="text-xs text-gray-400">
                              {formatCurrency(dailyRate)}/{isFrench ? 'jour' : 'day'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(isEditing ? null : job.id)}
                        className="text-mpr-interactive hover:text-mpr-interactive hover:bg-mpr-navy/20"
                      >
                        {isEditing ? (isFrench ? 'Terminer' : 'Done') : (isFrench ? 'Modifier' : 'Edit')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSeasonalJob(job.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes (si en édition) */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <Label className="text-gray-200 text-sm">
                        {isFrench ? 'Notes (optionnel)' : 'Notes (optional)'}
                      </Label>
                      <textarea
                        value={job.notes || ''}
                        onChange={(e) => updateSeasonalJob(job.id, { notes: e.target.value })}
                        className="w-full mt-2 bg-slate-600 border-slate-500 text-white placeholder-gray-400 rounded-md p-3 min-h-[60px] text-sm"
                        placeholder={isFrench ? 'Détails supplémentaires sur cet emploi...' : 'Additional details about this job...'}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bouton d'ajout */}
        <div className="text-center">
          <Button
            onClick={addSeasonalJob}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isFrench ? 'Ajouter un emploi saisonnier' : 'Add Seasonal Job'}
          </Button>
        </div>

        {/* Conseils et informations */}
        <Alert className="border-amber-400 bg-amber-900/20 text-amber-200">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>{isFrench ? 'Conseils pour les emplois saisonniers :' : 'Tips for seasonal jobs:'}</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>{isFrench ? 'Planifiez vos finances pour les périodes sans revenus' : 'Plan your finances for periods without income'}</li>
              <li>{isFrench ? 'Considérez l\'assurance emploi entre les contrats' : 'Consider employment insurance between contracts'}</li>
              <li>{isFrench ? 'Gardez des registres détaillés pour vos impôts' : 'Keep detailed records for your taxes'}</li>
              <li>{isFrench ? 'Épargnez pendant les périodes de revenus élevés' : 'Save during high-income periods'}</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Exemples d'emplois par saison */}
        <Card className="bg-gradient-to-r from-mpr-navy/50 to-purple-900/50 border border-mpr-interactive/30">
          <CardContent className="p-4">
            <h4 className="text-lg font-bold text-mpr-interactive mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {isFrench ? 'Exemples d\'emplois saisonniers' : 'Seasonal Job Examples'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobTypes.slice(0, 4).map(type => (
                <div key={type.value} className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-white">
                    {type.icon}
                    {type.label}
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {type.examples.slice(0, 3).map((example, index) => (
                      <li key={index}>• {example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SeasonalJobsManager;
