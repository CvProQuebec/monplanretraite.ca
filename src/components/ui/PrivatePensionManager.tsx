import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  X,
  Calendar,
  Building
} from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { PrivatePension } from '@/features/retirement/types';
import MoneyInput from '@/components/ui/MoneyInput';

interface PrivatePensionManagerProps {
  personNumber: 1 | 2;
  personName: string;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
}

const PrivatePensionManager: React.FC<PrivatePensionManagerProps> = React.memo(({
  personNumber,
  personName,
  userData,
  onDataChange,
  isFrench
}) => {
  const [pensions, setPensions] = useState<PrivatePension[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PrivatePension>>({
    name: '',
    monthlyAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'monthly',
    description: '',
    isActive: true
  });

  // Charger les données existantes
  useEffect(() => {
    const field = personNumber === 1 ? 'privatePensions1' : 'privatePensions2';
    const existingPensions = userData?.retirement?.[field] || [];
    setPensions(existingPensions);
  }, [userData, personNumber]);

  // Calculer le total des rentes privées
  const calculateTotal = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    return pensions.reduce((total, pension) => {
      if (!pension.isActive) return total;
      
      const startDate = new Date(pension.startDate);
      const startMonth = startDate.getMonth() + 1;
      const startYear = startDate.getFullYear();
      
      // Calculer le nombre de mois depuis le début
      const monthsElapsed = (currentYear - startYear) * 12 + (currentMonth - startMonth);
      const monthsCompleted = Math.max(0, monthsElapsed);
      
      // Calculer le montant selon la fréquence
      let monthlyAmount = pension.monthlyAmount;
      if (pension.frequency === 'quarterly') {
        monthlyAmount = pension.monthlyAmount / 3;
      } else if (pension.frequency === 'annually') {
        monthlyAmount = pension.monthlyAmount / 12;
      }
      
      return total + (monthlyAmount * monthsCompleted);
    }, 0);
  };

  const savePensions = useCallback((updatedPensions: PrivatePension[]) => {
    const field = personNumber === 1 ? 'privatePensions1' : 'privatePensions2';
    onDataChange({ [field]: updatedPensions });
  }, [personNumber, onDataChange]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      monthlyAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      description: '',
      isActive: true
    });
    setIsAdding(false);
    setEditingId(null);
  }, []);

  const handleAdd = useCallback(() => {
    if (!formData.name || formData.monthlyAmount <= 0) return;
    
    const newPension: PrivatePension = {
      id: Date.now().toString(),
      name: formData.name || '',
      monthlyAmount: formData.monthlyAmount || 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate,
      frequency: formData.frequency || 'monthly',
      description: formData.description || '',
      isActive: true
    };
    
    const updatedPensions = [...pensions, newPension];
    setPensions(updatedPensions);
    savePensions(updatedPensions);
    resetForm();
  }, [formData, pensions, savePensions, resetForm]);

  const handleEdit = useCallback((id: string) => {
    const pension = pensions.find(p => p.id === id);
    if (pension) {
      setFormData(pension);
      setEditingId(id);
      setIsAdding(true);
    }
  }, [pensions]);

  const handleUpdate = useCallback(() => {
    if (!editingId || !formData.name || formData.monthlyAmount <= 0) return;
    
    const updatedPensions = pensions.map(p => 
      p.id === editingId 
        ? { ...p, ...formData }
        : p
    );
    
    setPensions(updatedPensions);
    savePensions(updatedPensions);
    resetForm();
  }, [editingId, formData, pensions, savePensions, resetForm]);

  const handleDelete = useCallback((id: string) => {
    const updatedPensions = pensions.filter(p => p.id !== id);
    setPensions(updatedPensions);
    savePensions(updatedPensions);
  }, [pensions, savePensions]);

  const handleToggleActive = useCallback((id: string) => {
    const updatedPensions = pensions.map(p => 
      p.id === id 
        ? { ...p, isActive: !p.isActive }
        : p
    );
    
    setPensions(updatedPensions);
    savePensions(updatedPensions);
  }, [pensions, savePensions]);

  const handleFrequencyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      frequency: e.target.value as 'monthly' | 'quarterly' | 'annually'
    }));
  }, []);

  const totalToDate = calculateTotal();

  return (
    <Card className="bg-white border-2 border-orange-200 shadow-lg">
      <CardHeader className="bg-orange-50 border-b-2 border-orange-200">
        <CardTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          {isFrench ? 'Rentes privées' : 'Private Pensions'} - {personName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Liste des rentes existantes */}
        {pensions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-800">
              {isFrench ? 'Rentes configurées' : 'Configured Pensions'}
            </h4>
            {pensions.map((pension) => (
              <div key={pension.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-gray-800">{pension.name}</h5>
                      <span className={`px-2 py-1 rounded text-xs ${
                        pension.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pension.isActive 
                          ? (isFrench ? 'Actif' : 'Active') 
                          : (isFrench ? 'Inactif' : 'Inactive')
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(pension.monthlyAmount)} / {isFrench ? 'mois' : 'month'} 
                      ({isFrench ? 'Fréquence' : 'Frequency'}: {pension.frequency})
                    </p>
                    {pension.description && (
                      <p className="text-xs text-gray-500 mt-1">{pension.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(pension.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {pension.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pension.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pension.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire d'ajout/modification */}
        {isAdding && (
          <Card className="border-2 border-orange-300">
            <CardHeader className="bg-orange-100">
              <CardTitle className="text-lg text-orange-800">
                {editingId 
                  ? (isFrench ? 'Modifier la rente privée' : 'Edit Private Pension')
                  : (isFrench ? 'Ajouter une rente privée' : 'Add Private Pension')
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pensionName">
                    {isFrench ? 'Nom de la rente' : 'Pension Name'}
                  </Label>
                  <Input
                    id="pensionName"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isFrench ? "Ex: Rente de l'employeur" : "Ex: Employer Pension"}
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthlyAmount">
                    {isFrench ? 'Montant mensuel' : 'Monthly Amount'}
                  </Label>
                  <MoneyInput
                    value={formData.monthlyAmount || 0}
                    onChange={(value) => setFormData(prev => ({ ...prev, monthlyAmount: value }))}
                    className="w-full"
                    placeholder={isFrench ? "Ex: 500" : "Ex: 500"}
                    allowDecimals={true}
                  />
                </div>
                
                <div>
                  <Label htmlFor="startDate">
                    {isFrench ? 'Date de début' : 'Start Date'}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="frequency">
                    {isFrench ? 'Fréquence' : 'Frequency'}
                  </Label>
                  <select
                    id="frequency"
                    value={formData.frequency || 'monthly'}
                    onChange={handleFrequencyChange}
                    title={isFrench ? 'Sélectionner la fréquence de paiement' : 'Select payment frequency'}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="monthly">
                      {isFrench ? 'Mensuel' : 'Monthly'}
                    </option>
                    <option value="quarterly">
                      {isFrench ? 'Trimestriel' : 'Quarterly'}
                    </option>
                    <option value="annually">
                      {isFrench ? 'Annuel' : 'Annually'}
                    </option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">
                  {isFrench ? 'Description (optionnel)' : 'Description (optional)'}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isFrench 
                    ? "Ex: Rente de l'ancien employeur, rente viagère, etc."
                    : "Ex: Former employer pension, annuity, etc."
                  }
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {editingId 
                    ? (isFrench ? 'Modifier' : 'Update')
                    : (isFrench ? 'Ajouter' : 'Add')
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-400 text-gray-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  {isFrench ? 'Annuler' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bouton d'ajout */}
        {!isAdding && (
          <div className="text-center">
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              size="lg"
              className="border-orange-400 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isFrench ? 'Ajouter une rente privée' : 'Add Private Pension'}
            </Button>
          </div>
        )}

        {/* Total à ce jour */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-orange-800">
                {isFrench ? 'Total à ce jour' : 'Total to Date'}
              </h4>
              <p className="text-sm text-gray-600">
                {isFrench 
                  ? 'Calculé automatiquement basé sur les rentes actives'
                  : 'Automatically calculated based on active pensions'
                }
              </p>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalToDate)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PrivatePensionManager.displayName = 'PrivatePensionManager';

export default PrivatePensionManager;
