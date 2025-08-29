import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Calculator, TrendingUp, Building, DollarSign, User } from 'lucide-react';
import { ConsiderationFiscale } from '../../types/succession-planning';

interface FiscaliteFormProps {
  considerations: ConsiderationFiscale[];
  onUpdate: (considerations: ConsiderationFiscale[]) => void;
}

const typesConsiderations = [
  { value: 'reer_ferr', label: 'REER/FERR', icon: TrendingUp },
  { value: 'celi', label: 'CELI', icon: DollarSign },
  { value: 'gains_capital', label: 'Gains en capital', icon: Calculator },
  { value: 'entreprise', label: 'Entreprise/Actions', icon: Building },
  { value: 'autre', label: 'Autre considération', icon: Calculator }
];

export const FiscaliteForm: React.FC<FiscaliteFormProps> = ({ considerations, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ConsiderationFiscale>>({
    type: 'reer_ferr',
    description: '',
    strategie: '',
    impactEstime: undefined,
    conseillerFiscal: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      type: 'reer_ferr',
      description: '',
      strategie: '',
      impactEstime: undefined,
      conseillerFiscal: '',
      notes: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.type) {
      alert('Veuillez remplir les champs obligatoires (type, description)');
      return;
    }

    const consideration: ConsiderationFiscale = {
      id: editingIndex !== null ? considerations[editingIndex].id : Date.now().toString(),
      type: formData.type!,
      description: formData.description!,
      strategie: formData.strategie || '',
      impactEstime: formData.impactEstime,
      conseillerFiscal: formData.conseillerFiscal || '',
      notes: formData.notes || '',
      createdAt: editingIndex !== null ? considerations[editingIndex].createdAt : new Date(),
      updatedAt: new Date()
    };

    let updatedConsiderations;
    if (editingIndex !== null) {
      updatedConsiderations = [...considerations];
      updatedConsiderations[editingIndex] = consideration;
    } else {
      updatedConsiderations = [...considerations, consideration];
    }

    onUpdate(updatedConsiderations);
    resetForm();
  };

  const handleEdit = (index: number) => {
    const consideration = considerations[index];
    setFormData({
      type: consideration.type,
      description: consideration.description,
      strategie: consideration.strategie,
      impactEstime: consideration.impactEstime,
      conseillerFiscal: consideration.conseillerFiscal,
      notes: consideration.notes
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const consideration = considerations[index];
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette considération fiscale ?`)) {
      const updatedConsiderations = considerations.filter((_, i) => i !== index);
      onUpdate(updatedConsiderations);
    }
  };

  const getTotalImpactEstime = () => {
    return considerations.reduce((total, c) => total + (c.impactEstime || 0), 0);
  };

  const getConsiderationsByType = () => {
    const grouped = considerations.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return grouped;
  };

  const considerationsByType = getConsiderationsByType();

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Considérations</p>
                <p className="text-2xl font-bold">{considerations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Impact estimé</p>
                <p className="text-2xl font-bold">
                  {getTotalImpactEstime().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avec conseiller</p>
                <p className="text-2xl font-bold">
                  {considerations.filter(c => c.conseillerFiscal && c.conseillerFiscal.trim() !== '').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Considérations fiscales</h3>
          <p className="text-sm text-muted-foreground">
            Optimisation fiscale et planification des impôts successoraux
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter une considération</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier la considération' : 'Ajouter une considération fiscale'}
            </CardTitle>
            <CardDescription>
              Documentez les aspects fiscaux importants de votre succession
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de considération *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typesConsiderations.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impactEstime">Impact fiscal estimé ($)</Label>
                <Input
                  id="impactEstime"
                  type="number"
                  value={formData.impactEstime || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    impactEstime: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  placeholder="Ex: 15000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description de la situation *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez la situation fiscale, les actifs concernés..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategie">Stratégie d'optimisation</Label>
              <Textarea
                id="strategie"
                value={formData.strategie}
                onChange={(e) => setFormData({ ...formData, strategie: e.target.value })}
                placeholder="Stratégies envisagées pour minimiser l'impact fiscal..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conseillerFiscal">Conseiller fiscal</Label>
              <Input
                id="conseillerFiscal"
                value={formData.conseillerFiscal}
                onChange={(e) => setFormData({ ...formData, conseillerFiscal: e.target.value })}
                placeholder="Nom du comptable, fiscaliste ou conseiller"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes supplémentaires</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations complémentaires, références légales..."
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editingIndex !== null ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des considérations */}
      <div className="space-y-4">
        {considerations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune considération fiscale documentée</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez les aspects fiscaux importants de votre planification successorale
              </p>
              <Button onClick={() => setShowForm(true)}>
                Ajouter votre première considération
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {considerations.map((consideration, index) => {
              const typeInfo = typesConsiderations.find(t => t.value === consideration.type);
              const IconComponent = typeInfo?.icon || Calculator;
              
              return (
                <Card key={consideration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{typeInfo?.label}</h4>
                          <Badge variant="outline">{typeInfo?.label}</Badge>
                          {consideration.impactEstime && (
                            <Badge className="bg-red-100 text-red-800">
                              Impact: {consideration.impactEstime.toLocaleString('fr-CA', { 
                                style: 'currency', 
                                currency: 'CAD' 
                              })}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <h5 className="font-medium text-sm text-muted-foreground">Description :</h5>
                            <p className="text-sm">{consideration.description}</p>
                          </div>
                          
                          {consideration.strategie && (
                            <div>
                              <h5 className="font-medium text-sm text-muted-foreground">Stratégie :</h5>
                              <p className="text-sm">{consideration.strategie}</p>
                            </div>
                          )}
                          
                          {consideration.conseillerFiscal && (
                            <div className="flex items-center space-x-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Conseiller :</strong> {consideration.conseillerFiscal}</span>
                            </div>
                          )}
                        </div>
                        
                        {consideration.notes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes :</strong> {consideration.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(index)}
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

      {/* Résumé par type */}
      {considerations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé par type de considération</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {typesConsiderations.map(type => {
                const count = considerationsByType[type.value] || 0;
                const IconComponent = type.icon;
                
                if (count === 0) return null;
                
                return (
                  <div key={type.value} className="text-center p-3 bg-muted rounded-lg">
                    <IconComponent className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{count} considération{count > 1 ? 's' : ''}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations fiscales importantes */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Aspects fiscaux importants au décès</CardTitle>
        </CardHeader>
        <CardContent className="text-orange-800">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Disposition réputée :</strong> Tous les biens sont réputés vendus à leur juste valeur marchande</li>
            <li>• <strong>REER/FERR :</strong> Inclusion complète au revenu, sauf transfert au conjoint ou enfant mineur</li>
            <li>• <strong>Gains en capital :</strong> 50% des gains sont imposables dans la déclaration finale</li>
            <li>• <strong>Résidence principale :</strong> Généralement exempte d'impôt sur les gains en capital</li>
            <li>• <strong>Report d'impôt :</strong> Possible avec certains transferts au conjoint survivant</li>
          </ul>
        </CardContent>
      </Card>

      {/* Stratégies d'optimisation */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Stratégies d'optimisation fiscale</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Fractionnement du revenu :</strong> Répartir les revenus entre les années</li>
            <li>• <strong>Dons caritatifs :</strong> Utiliser les crédits pour réduire l'impôt final</li>
            <li>• <strong>Transfert au conjoint :</strong> Reporter l'impôt avec le roulement fiscal</li>
            <li>• <strong>Fiducie testamentaire :</strong> Planifier la distribution sur plusieurs années</li>
            <li>• <strong>Assurance vie :</strong> Financer les obligations fiscales</li>
            <li>• <strong>Gel successoral :</strong> Limiter la croissance future des actifs</li>
          </ul>
        </CardContent>
      </Card>

      {/* Avertissement */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">Important</CardTitle>
        </CardHeader>
        <CardContent className="text-red-800">
          <p className="text-sm">
            <strong>Consultation professionnelle recommandée :</strong> La fiscalité successorale est complexe et 
            les lois changent régulièrement. Il est fortement recommandé de consulter un fiscaliste, un comptable 
            ou un planificateur financier pour optimiser votre planification fiscale et vous assurer de la 
            conformité avec les lois en vigueur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
