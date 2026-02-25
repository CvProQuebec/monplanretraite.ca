import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DateInput from '@/components/ui/DateInput';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  DollarSign, 
  Info, 
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Pause,
  Play
} from 'lucide-react';
import { SVAdjustment } from '@/features/retirement/types';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import MoneyInput from '@/components/ui/MoneyInput';

interface SVAdjustmentManagerProps {
  personNumber: 1 | 2;
  personName: string;
  adjustments: SVAdjustment[];
  onAdjustmentsChange: (adjustments: SVAdjustment[]) => void;
  isFrench: boolean;
}

const SVAdjustmentManager: React.FC<SVAdjustmentManagerProps> = ({
  personNumber,
  personName,
  adjustments = [],
  onAdjustmentsChange,
  isFrench
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAdjustment, setNewAdjustment] = useState<Partial<SVAdjustment>>({
    dateDebut: '',
    dateFin: '',
    montantMensuel: 0,
    raison: '',
    typeAjustement: 'reduction',
    montantOriginal: 713.34 // Montant maximum SV juillet-septembre 2025
  });

  const typeAjustementOptions = [
    { value: 'reduction', label: isFrench ? 'Réduction' : 'Reduction', icon: TrendingDown, color: 'text-red-500' },
    { value: 'augmentation', label: isFrench ? 'Augmentation' : 'Increase', icon: TrendingUp, color: 'text-green-500' },
    { value: 'suspension', label: isFrench ? 'Suspension' : 'Suspension', icon: Pause, color: 'text-orange-500' },
    { value: 'retablissement', label: isFrench ? 'Rétablissement' : 'Restoration', icon: Play, color: 'text-mpr-interactive' }
  ];

  const raisonsPredefines = [
    isFrench ? 'Ajustement basé sur les revenus de l\'année précédente' : 'Adjustment based on previous year\'s income',
    isFrench ? 'Récupération fiscale (revenus élevés)' : 'Tax clawback (high income)',
    isFrench ? 'Changement de statut de résidence' : 'Change in residence status',
    isFrench ? 'Révision administrative' : 'Administrative review',
    isFrench ? 'Autre (préciser)' : 'Other (specify)'
  ];

  const generateId = () => `sv-adj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const calculatePercentageAdjustment = (original: number, nouveau: number) => {
    if (original === 0) return 0;
    return Math.round(((nouveau - original) / original) * 100);
  };

  const handleAddAdjustment = () => {
    if (!newAdjustment.dateDebut || !newAdjustment.dateFin || !newAdjustment.montantMensuel) {
      return;
    }

    const adjustment: SVAdjustment = {
      id: generateId(),
      dateDebut: newAdjustment.dateDebut!,
      dateFin: newAdjustment.dateFin!,
      montantMensuel: newAdjustment.montantMensuel!,
      raison: newAdjustment.raison || (isFrench ? 'Ajustement personnalisé' : 'Custom adjustment'),
      typeAjustement: newAdjustment.typeAjustement!,
      montantOriginal: newAdjustment.montantOriginal || getBaseSVAmount(),
      pourcentageAjustement: calculatePercentageAdjustment(
        newAdjustment.montantOriginal || getBaseSVAmount(),
        newAdjustment.montantMensuel!
      )
    };

    const updatedAdjustments = [...adjustments, adjustment].sort((a, b) => 
      new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
    );

    onAdjustmentsChange(updatedAdjustments);
                  setNewAdjustment({
                    dateDebut: '',
                    dateFin: '',
                    montantMensuel: 0,
                    raison: '',
                    typeAjustement: 'reduction',
                    montantOriginal: getBaseSVAmount()
                  });
    setIsAddingNew(false);
  };

  const handleDeleteAdjustment = (id: string) => {
    const updatedAdjustments = adjustments.filter(adj => adj.id !== id);
    onAdjustmentsChange(updatedAdjustments);
  };

  const handleEditAdjustment = (id: string, updates: Partial<SVAdjustment>) => {
    const updatedAdjustments = adjustments.map(adj => 
      adj.id === id 
        ? { 
            ...adj, 
            ...updates,
            pourcentageAjustement: calculatePercentageAdjustment(
              adj.montantOriginal || getBaseSVAmount(),
              updates.montantMensuel || adj.montantMensuel
            )
          }
        : adj
    );
    onAdjustmentsChange(updatedAdjustments);
    setEditingId(null);
  };

  // Calcul du montant de base SV selon les critères officiels
  const getBaseSVAmount = () => {
    // Montant maximum SV juillet-septembre 2025 selon Service Canada
    const maxSV = 713.34;
    // Pour l'exemple, on assume 40 ans de résidence (montant maximum)
    // Dans une vraie application, ceci serait basé sur les données utilisateur
    return maxSV;
  };

  const getCurrentAmount = () => {
    const now = new Date();
    const currentAdjustment = adjustments.find(adj => {
      const debut = new Date(adj.dateDebut);
      const fin = new Date(adj.dateFin);
      return debut <= now && now <= fin;
    });
    
    return currentAdjustment ? currentAdjustment.montantMensuel : getBaseSVAmount();
  };

  const getTypeIcon = (type: SVAdjustment['typeAjustement']) => {
    const option = typeAjustementOptions.find(opt => opt.value === type);
    return option ? option.icon : Info;
  };

  const getTypeColor = (type: SVAdjustment['typeAjustement']) => {
    const option = typeAjustementOptions.find(opt => opt.value === type);
    return option ? option.color : 'text-gray-500';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-800/90 to-pink-800/90 border-0 shadow-2xl backdrop-blur-sm">
      <CardHeader className="border-b border-purple-600 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-3">
          <div className={`w-6 h-6 bg-gradient-to-r ${personNumber === 1 ? 'from-purple-500 to-pink-500' : 'from-pink-500 to-purple-500'} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {personNumber}
          </div>
          {isFrench ? 'Ajustements SV' : 'OAS Adjustments'} - {personName}
        </CardTitle>
        <CardDescription className="text-purple-200">
          {isFrench 
            ? 'Gérez les variations de vos prestations de Sécurité de la vieillesse'
            : 'Manage variations in your Old Age Security benefits'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Montant actuel */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-purple-300">
                {isFrench ? 'Montant actuel' : 'Current Amount'}
              </h4>
              <p className="text-sm text-gray-400">
                {isFrench ? 'Basé sur les ajustements en cours' : 'Based on current adjustments'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(getCurrentAmount())}
              </div>
              <div className="text-sm text-gray-400">
                {isFrench ? 'par mois' : 'per month'}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des ajustements existants */}
        {adjustments.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {isFrench ? 'Ajustements programmés' : 'Scheduled Adjustments'}
            </h4>
            
            {adjustments.map((adjustment) => {
              const TypeIcon = getTypeIcon(adjustment.typeAjustement);
              const isActive = new Date(adjustment.dateDebut) <= new Date() && new Date() <= new Date(adjustment.dateFin);
              
              return (
                <div key={adjustment.id} className={`bg-slate-700/50 rounded-lg p-4 border ${isActive ? 'border-green-500/50 bg-green-900/20' : 'border-slate-600'}`}>
                  {editingId === adjustment.id ? (
                    // Mode édition
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-200 text-sm">
                            {isFrench ? 'Date de début' : 'Start Date'}
                          </Label>
                          <DateInput
                            value={adjustment.dateDebut}
                            onChange={(value) => handleEditAdjustment(adjustment.id, { dateDebut: value })}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-200 text-sm">
                            {isFrench ? 'Date de fin' : 'End Date'}
                          </Label>
                          <DateInput
                            value={adjustment.dateFin}
                            onChange={(value) => handleEditAdjustment(adjustment.id, { dateFin: value })}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-200 text-sm">
                            {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                          </Label>
                          <MoneyInput
                            value={adjustment.montantMensuel}
                            onChange={(value) => handleEditAdjustment(adjustment.id, { montantMensuel: value })}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder={isFrench ? "Ex: 713,34" : "Ex: 713.34"}
                            allowDecimals={true}
                          />
                        </div>
                        <div>
                          <Label className="text-gray-200 text-sm">
                            {isFrench ? 'Type d\'ajustement' : 'Adjustment Type'}
                          </Label>
                          <Select
                            value={adjustment.typeAjustement}
                            onValueChange={(value: SVAdjustment['typeAjustement']) => 
                              handleEditAdjustment(adjustment.id, { typeAjustement: value })
                            }
                          >
                            <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {typeAjustementOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <option.icon className={`w-4 h-4 ${option.color}`} />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-gray-200 text-sm">
                          {isFrench ? 'Raison de l\'ajustement' : 'Reason for Adjustment'}
                        </Label>
                        <Input
                          value={adjustment.raison}
                          onChange={(e) => handleEditAdjustment(adjustment.id, { raison: e.target.value })}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder={isFrench ? 'Décrivez la raison...' : 'Describe the reason...'}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setEditingId(null)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {isFrench ? 'Sauvegarder' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="border-gray-500 text-gray-300"
                        >
                          {isFrench ? 'Annuler' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TypeIcon className={`w-5 h-5 ${getTypeColor(adjustment.typeAjustement)}`} />
                          <span className="font-semibold text-white">
                            {formatCurrency(adjustment.montantMensuel)}
                          </span>
                          {adjustment.pourcentageAjustement !== 0 && (
                            <span className={`text-sm px-2 py-1 rounded ${
                              adjustment.pourcentageAjustement > 0 
                                ? 'bg-green-900/50 text-green-300' 
                                : 'bg-red-900/50 text-red-300'
                            }`}>
                              {adjustment.pourcentageAjustement > 0 ? '+' : ''}{adjustment.pourcentageAjustement}%
                            </span>
                          )}
                          {isActive && (
                            <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">
                              {isFrench ? 'ACTIF' : 'ACTIVE'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          <div>{adjustment.dateDebut} → {adjustment.dateFin}</div>
                          <div className="mt-1">{adjustment.raison}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(adjustment.id)}
                          className="border-purple-500 text-purple-300 hover:bg-purple-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdjustment(adjustment.id)}
                          className="border-red-500 text-red-300 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Formulaire d'ajout */}
        {isAddingNew ? (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/30 space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">
              {isFrench ? 'Nouvel ajustement' : 'New Adjustment'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-200 text-sm">
                  {isFrench ? 'Date de début' : 'Start Date'}
                </Label>
                <DateInput
                  value={newAdjustment.dateDebut || ''}
                  onChange={(value) => setNewAdjustment(prev => ({ ...prev, dateDebut: value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="AAAA-MM-JJ"
                />
              </div>
              <div>
                <Label className="text-gray-200 text-sm">
                  {isFrench ? 'Date de fin' : 'End Date'}
                </Label>
                <DateInput
                  value={newAdjustment.dateFin || ''}
                  onChange={(value) => setNewAdjustment(prev => ({ ...prev, dateFin: value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="AAAA-MM-JJ"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-200 text-sm">
                  {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                </Label>
                <MoneyInput
                  value={newAdjustment.montantMensuel || 0}
                  onChange={(value) => setNewAdjustment(prev => ({ ...prev, montantMensuel: value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder={isFrench ? "Ex: 713,34" : "Ex: 713.34"}
                  allowDecimals={true}
                />
              </div>
              <div>
                <Label className="text-gray-200 text-sm">
                  {isFrench ? 'Type d\'ajustement' : 'Adjustment Type'}
                </Label>
                <Select
                  value={newAdjustment.typeAjustement || 'reduction'}
                  onValueChange={(value: SVAdjustment['typeAjustement']) => 
                    setNewAdjustment(prev => ({ ...prev, typeAjustement: value }))
                  }
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {typeAjustementOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className={`w-4 h-4 ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-200 text-sm">
                {isFrench ? 'Raison de l\'ajustement' : 'Reason for Adjustment'}
              </Label>
              <Select
                value={newAdjustment.raison || ''}
                onValueChange={(value) => setNewAdjustment(prev => ({ ...prev, raison: value }))}
              >
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder={isFrench ? 'Sélectionnez une raison...' : 'Select a reason...'} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {raisonsPredefines.map((raison, index) => (
                    <SelectItem key={index} value={raison}>
                      {raison}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {newAdjustment.raison === (isFrench ? 'Autre (préciser)' : 'Other (specify)') && (
              <div>
                <Label className="text-gray-200 text-sm">
                  {isFrench ? 'Précisez la raison' : 'Specify the reason'}
                </Label>
                <Input
                  value={newAdjustment.raison}
                  onChange={(e) => setNewAdjustment(prev => ({ ...prev, raison: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder={isFrench ? 'Décrivez la raison...' : 'Describe the reason...'}
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleAddAdjustment}
                disabled={!newAdjustment.dateDebut || !newAdjustment.dateFin || !newAdjustment.montantMensuel}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isFrench ? 'Ajouter' : 'Add'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewAdjustment({
                    dateDebut: '',
                    dateFin: '',
                    montantMensuel: 0,
                    raison: '',
                    typeAjustement: 'reduction',
                    montantOriginal: 692.89
                  });
                }}
                className="border-gray-500 text-gray-300"
              >
                {isFrench ? 'Annuler' : 'Cancel'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isFrench ? 'Ajouter un ajustement' : 'Add Adjustment'}
          </Button>
        )}

        {/* Informations sur l'estimateur officiel */}
        {adjustments.length === 0 && !isAddingNew && (
          <Alert className="border-mpr-interactive bg-mpr-navy/20 text-mpr-interactive-lt">
            <Info className="h-5 w-5 text-mpr-interactive" />
            <AlertDescription>
              <strong>{isFrench ? 'Utilisez l\'estimateur officiel :' : 'Use the official estimator:'}</strong>
              <br />
              {isFrench ? (
                <>
                  • Montant de base SV 2025 : {formatCurrency(getBaseSVAmount())} par mois<br />
                  • Consultez l'estimateur de Service Canada pour votre montant personnalisé<br />
                  • Ajoutez vos ajustements réels selon vos avis de paiement
                </>
              ) : (
                <>
                  • Base OAS amount 2025: {formatCurrency(getBaseSVAmount())} per month<br />
                  • Check Service Canada's estimator for your personalized amount<br />
                  • Add your actual adjustments based on your payment notices
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SVAdjustmentManager;
