import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Gift, Heart, MapPin, DollarSign, Percent } from 'lucide-react';
import { DonCaritatif } from '../../types/succession-planning';

interface DonsFormProps {
  dons: DonCaritatif[];
  onUpdate: (dons: DonCaritatif[]) => void;
}

const typesLegs = [
  { value: 'montant_fixe', label: 'Montant fixe', icon: DollarSign },
  { value: 'pourcentage', label: 'Pourcentage de la succession', icon: Percent },
  { value: 'residuel', label: 'Legs résiduel (ce qui reste)', icon: Gift }
];

export const DonsForm: React.FC<DonsFormProps> = ({ dons, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DonCaritatif>>({
    organisme: '',
    adresse: '',
    numeroCharite: '',
    montant: undefined,
    pourcentage: undefined,
    typeLegs: 'montant_fixe',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      organisme: '',
      adresse: '',
      numeroCharite: '',
      montant: undefined,
      pourcentage: undefined,
      typeLegs: 'montant_fixe',
      notes: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.organisme || !formData.typeLegs) {
      alert('Veuillez remplir les champs obligatoires (organisme, type de legs)');
      return;
    }

    if (formData.typeLegs === 'montant_fixe' && !formData.montant) {
      alert('Veuillez spécifier le montant pour un legs à montant fixe');
      return;
    }

    if (formData.typeLegs === 'pourcentage' && !formData.pourcentage) {
      alert('Veuillez spécifier le pourcentage pour un legs en pourcentage');
      return;
    }

    const don: DonCaritatif = {
      id: editingIndex !== null ? dons[editingIndex].id : Date.now().toString(),
      organisme: formData.organisme!,
      adresse: formData.adresse || '',
      numeroCharite: formData.numeroCharite || '',
      montant: formData.montant,
      pourcentage: formData.pourcentage,
      typeLegs: formData.typeLegs!,
      notes: formData.notes || '',
      createdAt: editingIndex !== null ? dons[editingIndex].createdAt : new Date(),
      updatedAt: new Date()
    };

    let updatedDons;
    if (editingIndex !== null) {
      updatedDons = [...dons];
      updatedDons[editingIndex] = don;
    } else {
      updatedDons = [...dons, don];
    }

    onUpdate(updatedDons);
    resetForm();
  };

  const handleEdit = (index: number) => {
    const don = dons[index];
    setFormData({
      organisme: don.organisme,
      adresse: don.adresse,
      numeroCharite: don.numeroCharite,
      montant: don.montant,
      pourcentage: don.pourcentage,
      typeLegs: don.typeLegs,
      notes: don.notes
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const don = dons[index];
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le don à "${don.organisme}" ?`)) {
      const updatedDons = dons.filter((_, i) => i !== index);
      onUpdate(updatedDons);
    }
  };

  const getTotalMontantFixe = () => {
    return dons.reduce((total, don) => total + (don.montant || 0), 0);
  };

  const getTotalPourcentage = () => {
    return dons.reduce((total, don) => total + (don.pourcentage || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-mpr-interactive" />
              <div>
                <p className="text-sm text-muted-foreground">Organismes</p>
                <p className="text-2xl font-bold">{dons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Montants fixes</p>
                <p className="text-2xl font-bold">
                  {getTotalMontantFixe().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total %</p>
                <p className="text-2xl font-bold">{getTotalPourcentage()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Dons caritatifs</h3>
          <p className="text-sm text-muted-foreground">
            Organismes que vous souhaitez soutenir après votre décès
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un don</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier le don' : 'Ajouter un don caritatif'}
            </CardTitle>
            <CardDescription>
              Renseignez les informations sur l'organisme bénéficiaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organisme">Nom de l'organisme *</Label>
              <Input
                id="organisme"
                value={formData.organisme}
                onChange={(e) => setFormData({ ...formData, organisme: e.target.value })}
                placeholder="Ex: Fondation du cœur, Société canadienne du cancer..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse de l'organisme</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numeroCharite">Numéro d'organisme de charité</Label>
                <Input
                  id="numeroCharite"
                  value={formData.numeroCharite}
                  onChange={(e) => setFormData({ ...formData, numeroCharite: e.target.value })}
                  placeholder="Ex: 123456789RR0001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeLegs">Type de legs *</Label>
              <Select
                value={formData.typeLegs}
                onValueChange={(value: any) => setFormData({ ...formData, typeLegs: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typesLegs.map(type => {
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

            {formData.typeLegs === 'montant_fixe' && (
              <div className="space-y-2">
                <Label htmlFor="montant">Montant du don ($) *</Label>
                <Input
                  id="montant"
                  type="number"
                  min="0"
                  value={formData.montant || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    montant: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  placeholder="Ex: 5000"
                />
              </div>
            )}

            {formData.typeLegs === 'pourcentage' && (
              <div className="space-y-2">
                <Label htmlFor="pourcentage">Pourcentage de la succession (%) *</Label>
                <Input
                  id="pourcentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.pourcentage || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    pourcentage: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  placeholder="Ex: 10"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes et instructions</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Instructions spéciales, utilisation souhaitée des fonds..."
                rows={3}
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

      {/* Liste des dons */}
      <div className="space-y-4">
        {dons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun don caritatif planifié</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez des organismes que vous souhaitez soutenir après votre décès
              </p>
              <Button onClick={() => setShowForm(true)}>
                Planifier votre premier don
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {dons.map((don, index) => {
              const typeInfo = typesLegs.find(t => t.value === don.typeLegs);
              const IconComponent = typeInfo?.icon || Gift;
              
              return (
                <Card key={don.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-5 w-5 text-red-600" />
                          <h4 className="font-semibold text-lg">{don.organisme}</h4>
                          <Badge variant="outline">{typeInfo?.label}</Badge>
                          {don.typeLegs === 'montant_fixe' && don.montant && (
                            <Badge className="bg-green-100 text-green-800">
                              {don.montant.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                            </Badge>
                          )}
                          {don.typeLegs === 'pourcentage' && don.pourcentage && (
                            <Badge className="bg-mpr-interactive-lt text-mpr-navy">
                              {don.pourcentage}%
                            </Badge>
                          )}
                          {don.typeLegs === 'residuel' && (
                            <Badge className="bg-purple-100 text-purple-800">
                              Résiduel
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {don.adresse && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{don.adresse}</span>
                            </div>
                          )}
                          
                          {don.numeroCharite && (
                            <div className="flex items-center space-x-2">
                              <Gift className="h-4 w-4 text-muted-foreground" />
                              <span><strong>N° charité :</strong> {don.numeroCharite}</span>
                            </div>
                          )}
                        </div>
                        
                        {don.notes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <strong>Instructions :</strong> {don.notes}
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

      {/* Avantages fiscaux */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Avantages fiscaux des dons caritatifs</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Crédit d'impôt :</strong> Les dons donnent droit à un crédit d'impôt non remboursable</li>
            <li>• <strong>Taux avantageux :</strong> Crédit de 15% (fédéral) + crédit provincial sur les premiers 200$</li>
            <li>• <strong>Taux supérieur :</strong> Crédit de 29% (fédéral) + crédit provincial sur l'excédent</li>
            <li>• <strong>Report :</strong> Les crédits inutilisés peuvent être reportés sur 5 ans</li>
            <li>• <strong>Succession :</strong> Les dons testamentaires peuvent réduire l'impôt final</li>
          </ul>
        </CardContent>
      </Card>

      {/* Conseils */}
      <Card className="bg-mpr-interactive-lt border-mpr-border">
        <CardHeader>
          <CardTitle className="text-mpr-navy">Conseils pour vos dons caritatifs</CardTitle>
        </CardHeader>
        <CardContent className="text-mpr-navy">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Vérifiez l'admissibilité :</strong> Assurez-vous que l'organisme est reconnu par l'ARC</li>
            <li>• <strong>Numéro d'enregistrement :</strong> Notez le numéro d'organisme de charité</li>
            <li>• <strong>Instructions claires :</strong> Spécifiez l'utilisation souhaitée des fonds si applicable</li>
            <li>• <strong>Équilibre :</strong> Considérez l'impact sur vos héritiers</li>
            <li>• <strong>Planification :</strong> Consultez un fiscaliste pour optimiser les avantages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
