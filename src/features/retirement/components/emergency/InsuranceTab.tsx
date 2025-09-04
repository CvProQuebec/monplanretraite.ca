// Onglet des assurances
// Plan Professional - Gestion avancée des assurances
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import DateInput from '@/components/ui/DateInput';
import { Shield, Plus, Trash2, Edit, Calendar as CalendarIcon, DollarSign, AlertTriangle, Info, FileText, Clock, User, Building, Car, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Insurance } from '../../types/emergency-info';

interface InsuranceTabProps {
  data: Insurance[];
  onUpdate: (data: Insurance[]) => void;
}

export const InsuranceTab: React.FC<InsuranceTabProps> = ({ data, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newInsurance, setNewInsurance] = useState<Partial<Insurance>>({
    type: 'life',
    provider: '',
    policyNumber: '',
    startDate: null,
    endDate: null,
    premiumAmount: '',
    premiumFrequency: 'monthly',
    coverageAmount: '',
    beneficiaries: '',
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    notes: '',
    isActive: true,
    autoRenewal: true
  });

  const insuranceTypes = [
    { value: 'life', label: 'Vie', icon: Heart },
    { value: 'health', label: 'Santé', icon: Heart },
    { value: 'auto', label: 'Automobile', icon: Car },
    { value: 'home', label: 'Habitation', icon: Building },
    { value: 'disability', label: 'Invalidité', icon: User },
    { value: 'travel', label: 'Voyage', icon: Building },
    { value: 'business', label: 'Entreprise', icon: Building },
    { value: 'other', label: 'Autre', icon: Shield }
  ];

  const premiumFrequencies = [
    { value: 'monthly', label: 'Mensuel' },
    { value: 'quarterly', label: 'Trimestriel' },
    { value: 'semi-annual', label: 'Semestriel' },
    { value: 'annual', label: 'Annuel' }
  ];

  const handleAddInsurance = () => {
    if (!newInsurance.type || !newInsurance.provider || !newInsurance.policyNumber) return;

    const insurance: Insurance = {
      id: Date.now().toString(),
      type: newInsurance.type!,
      provider: newInsurance.provider!,
      policyNumber: newInsurance.policyNumber!,
      startDate: newInsurance.startDate,
      endDate: newInsurance.endDate,
      premiumAmount: newInsurance.premiumAmount || '',
      premiumFrequency: newInsurance.premiumFrequency || 'monthly',
      coverageAmount: newInsurance.coverageAmount || '',
      beneficiaries: newInsurance.beneficiaries || '',
      agentName: newInsurance.agentName || '',
      agentPhone: newInsurance.agentPhone || '',
      agentEmail: newInsurance.agentEmail || '',
      notes: newInsurance.notes || '',
      isActive: newInsurance.isActive || true,
      autoRenewal: newInsurance.autoRenewal || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onUpdate([...data, insurance]);
    
    setNewInsurance({
      type: 'life',
      provider: '',
      policyNumber: '',
      startDate: null,
      endDate: null,
      premiumAmount: '',
      premiumFrequency: 'monthly',
      coverageAmount: '',
      beneficiaries: '',
      agentName: '',
      agentPhone: '',
      agentEmail: '',
      notes: '',
      isActive: true,
      autoRenewal: true
    });
    setShowForm(false);
  };

  const handleEditInsurance = (index: number) => {
    const insurance = data[index];
    setNewInsurance({
      type: insurance.type,
      provider: insurance.provider,
      policyNumber: insurance.policyNumber,
      startDate: insurance.startDate,
      endDate: insurance.endDate,
      premiumAmount: insurance.premiumAmount,
      premiumFrequency: insurance.premiumFrequency,
      coverageAmount: insurance.coverageAmount,
      beneficiaries: insurance.beneficiaries,
      agentName: insurance.agentName,
      agentPhone: insurance.agentPhone,
      agentEmail: insurance.agentEmail,
      notes: insurance.notes,
      isActive: insurance.isActive,
      autoRenewal: insurance.autoRenewal
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateInsurance = () => {
    if (editingIndex === null || !newInsurance.type || !newInsurance.provider || !newInsurance.policyNumber) return;

    const updatedInsurance = [...data];
    updatedInsurance[editingIndex] = {
      ...updatedInsurance[editingIndex],
      ...newInsurance,
      updatedAt: new Date()
    };

    onUpdate(updatedInsurance);
    setEditingIndex(null);
    setShowForm(false);
    setNewInsurance({
      type: 'life',
      provider: '',
      policyNumber: '',
      startDate: null,
      endDate: null,
      premiumAmount: '',
      premiumFrequency: 'monthly',
      coverageAmount: '',
      beneficiaries: '',
      agentName: '',
      agentPhone: '',
      agentEmail: '',
      notes: '',
      isActive: true,
      autoRenewal: true
    });
  };

  const handleDeleteInsurance = (index: number) => {
    const updatedInsurance = data.filter((_, i) => i !== index);
    onUpdate(updatedInsurance);
  };

  const getInsuranceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      life: 'bg-red-100 text-red-800',
      health: 'bg-green-100 text-green-800',
      auto: 'bg-blue-100 text-blue-800',
      home: 'bg-orange-100 text-orange-800',
      disability: 'bg-purple-100 text-purple-800',
      travel: 'bg-yellow-100 text-yellow-800',
      business: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const getInsuranceTypeIcon = (type: string) => {
    const iconData = insuranceTypes.find(t => t.value === type);
    return iconData ? iconData.icon : Shield;
  };

  const getExpiringInsurance = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return data.filter(insurance => 
      insurance.endDate && 
      new Date(insurance.endDate) <= thirtyDaysFromNow &&
      new Date(insurance.endDate) >= now
    );
  };

  const expiringInsurance = getExpiringInsurance();

  const totalAnnualPremium = data.reduce((sum, insurance) => {
    const premium = parseFloat(insurance.premiumAmount.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    let multiplier = 1;
    
    switch (insurance.premiumFrequency) {
      case 'monthly': multiplier = 12; break;
      case 'quarterly': multiplier = 4; break;
      case 'semi-annual': multiplier = 2; break;
      case 'annual': multiplier = 1; break;
    }
    
    return sum + (premium * multiplier);
  }, 0);

  const totalCoverage = data.reduce((sum, insurance) => {
    const coverage = parseFloat(insurance.coverageAmount.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + coverage;
  }, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total des polices</p>
                <p className="text-2xl font-bold">{data.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Prime annuelle</p>
                <p className="text-2xl font-bold">{totalAnnualPremium.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Couverture totale</p>
                <p className="text-2xl font-bold">{totalCoverage.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Expirent bientôt</p>
                <p className="text-2xl font-bold">{expiringInsurance.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes pour assurances expirant bientôt */}
      {expiringInsurance.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>{expiringInsurance.length}</strong> police(s) d'assurance expire(nt) dans les 30 prochains jours.
            Vérifiez vos renouvellements.
          </AlertDescription>
        </Alert>
      )}

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Assurances</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos polices d'assurance et leurs informations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter une assurance</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/édition */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier l\'assurance' : 'Ajouter une assurance'}
            </CardTitle>
            <CardDescription>
              Renseignez les informations sur votre police d'assurance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance-type">Type d'assurance *</Label>
                <Select
                  value={newInsurance.type}
                  onValueChange={(value) => setNewInsurance({ ...newInsurance, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance-provider">Compagnie d'assurance *</Label>
                <Input
                  id="insurance-provider"
                  value={newInsurance.provider}
                  onChange={(e) => setNewInsurance({ ...newInsurance, provider: e.target.value })}
                  placeholder="Ex : Assureur, Intact, SSQ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-number">Numéro de police *</Label>
                <Input
                  id="policy-number"
                  value={newInsurance.policyNumber}
                  onChange={(e) => setNewInsurance({ ...newInsurance, policyNumber: e.target.value })}
                  placeholder="Numéro de police"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverage-amount">Montant de couverture</Label>
                <Input
                  id="coverage-amount"
                  value={newInsurance.coverageAmount}
                  onChange={(e) => setNewInsurance({ ...newInsurance, coverageAmount: e.target.value })}
                  placeholder="500 000,00 $"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <DateInput
                  value={newInsurance.startDate ? format(newInsurance.startDate, 'yyyy-MM-dd') : ''}
                  onChange={(value) => setNewInsurance({ ...newInsurance, startDate: value ? new Date(value) : undefined })}
                  placeholder="AAAA-MM-JJ"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin</Label>
                <DateInput
                  value={newInsurance.endDate ? format(newInsurance.endDate, 'yyyy-MM-dd') : ''}
                  onChange={(value) => setNewInsurance({ ...newInsurance, endDate: value ? new Date(value) : undefined })}
                  placeholder="AAAA-MM-JJ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="premium-amount">Montant de la prime</Label>
                <Input
                  id="premium-amount"
                  value={newInsurance.premiumAmount}
                  onChange={(e) => setNewInsurance({ ...newInsurance, premiumAmount: e.target.value })}
                  placeholder="150,00 $"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="premium-frequency">Fréquence de paiement</Label>
                <Select
                  value={newInsurance.premiumFrequency}
                  onValueChange={(value) => setNewInsurance({ ...newInsurance, premiumFrequency: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {premiumFrequencies.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaries">Bénéficiaires</Label>
              <Input
                id="beneficiaries"
                value={newInsurance.beneficiaries}
                onChange={(e) => setNewInsurance({ ...newInsurance, beneficiaries: e.target.value })}
                placeholder="Nom des bénéficiaires"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Nom de l'agent</Label>
                <Input
                  id="agent-name"
                  value={newInsurance.agentName}
                  onChange={(e) => setNewInsurance({ ...newInsurance, agentName: e.target.value })}
                  placeholder="Nom de l'agent"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agent-phone">Téléphone de l'agent</Label>
                <Input
                  id="agent-phone"
                  value={newInsurance.agentPhone}
                  onChange={(e) => setNewInsurance({ ...newInsurance, agentPhone: e.target.value })}
                  placeholder="(514) 555-0123"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agent-email">Email de l'agent</Label>
                <Input
                  id="agent-email"
                  type="email"
                  value={newInsurance.agentEmail}
                  onChange={(e) => setNewInsurance({ ...newInsurance, agentEmail: e.target.value })}
                  placeholder="agent@assurance.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance-notes">Notes</Label>
              <Textarea
                id="insurance-notes"
                value={newInsurance.notes}
                onChange={(e) => setNewInsurance({ ...newInsurance, notes: e.target.value })}
                placeholder="Informations supplémentaires, conditions spéciales..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-active"
                  checked={newInsurance.isActive}
                  onCheckedChange={(checked) => 
                    setNewInsurance({ ...newInsurance, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="is-active">Police active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-renewal"
                  checked={newInsurance.autoRenewal}
                  onCheckedChange={(checked) => 
                    setNewInsurance({ ...newInsurance, autoRenewal: checked as boolean })
                  }
                />
                <Label htmlFor="auto-renewal">Renouvellement automatique</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                  setNewInsurance({
                    type: 'life',
                    provider: '',
                    policyNumber: '',
                    startDate: null,
                    endDate: null,
                    premiumAmount: '',
                    premiumFrequency: 'monthly',
                    coverageAmount: '',
                    beneficiaries: '',
                    agentName: '',
                    agentPhone: '',
                    agentEmail: '',
                    notes: '',
                    isActive: true,
                    autoRenewal: true
                  });
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={editingIndex !== null ? handleUpdateInsurance : handleAddInsurance}
                disabled={!newInsurance.type || !newInsurance.provider || !newInsurance.policyNumber}
              >
                {editingIndex !== null ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des assurances */}
      <div className="space-y-4">
        {data.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune assurance enregistrée</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos polices d'assurance
              </p>
              <Button onClick={() => setShowForm(true)}>
                Ajouter votre première assurance
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.map((insurance, index) => {
              const IconComponent = getInsuranceTypeIcon(insurance.type);
              return (
                <Card key={insurance.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-semibold text-lg">{insurance.provider}</h4>
                          <Badge className={getInsuranceTypeColor(insurance.type)}>
                            {insuranceTypes.find(t => t.value === insurance.type)?.label}
                          </Badge>
                          {!insurance.isActive && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                          {insurance.autoRenewal && (
                            <Badge variant="outline" className="text-green-600">
                              Renouvellement auto
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span><strong>Police :</strong> {insurance.policyNumber}</span>
                          </div>
                          
                          {insurance.coverageAmount && (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Couverture :</strong> {insurance.coverageAmount}</span>
                            </div>
                          )}
                          
                          {insurance.premiumAmount && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>
                                <strong>Prime :</strong> {insurance.premiumAmount} 
                                ({premiumFrequencies.find(f => f.value === insurance.premiumFrequency)?.label})
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {insurance.startDate && (
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>
                                <strong>Début :</strong> {format(new Date(insurance.startDate), 'PPP', { locale: fr })}
                              </span>
                            </div>
                          )}
                          
                          {insurance.endDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                <strong>Fin :</strong> {format(new Date(insurance.endDate), 'PPP', { locale: fr })}
                              </span>
                            </div>
                          )}
                          
                          {insurance.beneficiaries && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Bénéficiaires :</strong> {insurance.beneficiaries}</span>
                            </div>
                          )}
                        </div>
                        
                        {(insurance.agentName || insurance.agentPhone || insurance.agentEmail) && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {insurance.agentName && (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Agent :</strong> {insurance.agentName}</span>
                              </div>
                            )}
                            
                            {insurance.agentPhone && (
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Téléphone :</strong> {insurance.agentPhone}</span>
                              </div>
                            )}
                            
                            {insurance.agentEmail && (
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Email :</strong> {insurance.agentEmail}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {insurance.notes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">{insurance.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInsurance(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInsurance(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
