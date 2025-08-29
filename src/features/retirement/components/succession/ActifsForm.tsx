import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Building, Home, Car, CreditCard, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { Actif } from '../../types/succession-planning';

interface ActifsFormProps {
  actifs: Actif[];
  onUpdate: (actifs: Actif[]) => void;
}

const typesActifs = [
  { value: 'immobilier', label: 'Immobilier', icon: Home },
  { value: 'vehicule', label: 'Véhicule', icon: Car },
  { value: 'compte_bancaire', label: 'Compte bancaire', icon: CreditCard },
  { value: 'placement', label: 'Placement/Investissement', icon: TrendingUp },
  { value: 'assurance_vie', label: 'Assurance vie', icon: Shield },
  { value: 'entreprise', label: 'Entreprise/Actions', icon: Building },
  { value: 'autre', label: 'Autre', icon: DollarSign }
];

export const ActifsForm: React.FC<ActifsFormProps> = ({ actifs, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Actif>>({
    nom: '',
    type: 'autre',
    description: '',
    valeurEstimee: 0,
    localisation: '',
    numeroCompte: '',
    institution: '',
    beneficiaireDesigne: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      nom: '',
      type: 'autre',
      description: '',
      valeurEstimee: 0,
      localisation: '',
      numeroCompte: '',
      institution: '',
      beneficiaireDesigne: '',
      notes: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.type || formData.valeurEstimee === undefined) {
      alert('Veuillez remplir les champs obligatoires (nom, type, valeur estimée)');
      return;
    }

    const actif: Actif = {
      id: editingIndex !== null ? actifs[editingIndex].id : Date.now().toString(),
      nom: formData.nom!,
      type: formData.type!,
      description: formData.description || '',
      valeurEstimee: formData.valeurEstimee!,
      localisation: formData.localisation || '',
      numeroCompte: formData.numeroCompte || '',
      institution: formData.institution || '',
      beneficiaireDesigne: formData.beneficiaireDesigne || '',
      notes: formData.notes || '',
      createdAt: editingIndex !== null ? actifs[editingIndex].createdAt : new Date(),
      updatedAt: new Date()
    };

    let updatedActifs;
    if (editingIndex !== null) {
      updatedActifs = [...actifs];
      updatedActifs[editingIndex] = actif;
    } else {
      updatedActifs = [...actifs, actif];
    }

    onUpdate(updatedActifs);
    resetForm();
  };

  const handleEdit = (index: number) => {
    const actif = actifs[index];
    setFormData({
      nom: actif.nom,
      type: actif.type,
      description: actif.description,
      valeurEstimee: actif.valeurEstimee,
      localisation: actif.localisation,
      numeroCompte: actif.numeroCompte,
      institution: actif.institution,
      beneficiaireDesigne: actif.beneficiaireDesigne,
      notes: actif.notes
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const actif = actifs[index];
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${actif.nom}" de la liste des actifs ?`)) {
      const updatedActifs = actifs.filter((_, i) => i !== index);
      onUpdate(updatedActifs);
    }
  };

  const getValeurTotale = () => {
    return actifs.reduce((total, actif) => total + actif.valeurEstimee, 0);
  };

  const getActifsByType = () => {
    const grouped = actifs.reduce((acc, actif) => {
      acc[actif.type] = (acc[actif.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return grouped;
  };

  const actifsByType = getActifsByType();

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total actifs</p>
                <p className="text-2xl font-bold">{actifs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valeur totale</p>
                <p className="text-2xl font-bold">
                  {getValeurTotale().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Types d'actifs</p>
                <p className="text-2xl font-bold">{Object.keys(actifsByType).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Inventaire des actifs</h3>
          <p className="text-sm text-muted-foreground">
            Répertoriez tous vos biens et leur valeur estimée
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un actif</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier l\'actif' : 'Ajouter un actif'}
            </CardTitle>
            <CardDescription>
              Renseignez les informations sur l'actif
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de l'actif *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Résidence principale, Compte épargne..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type d'actif *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesActifs.map(type => {
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée de l'actif"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valeurEstimee">Valeur estimée ($) *</Label>
                <Input
                  id="valeurEstimee"
                  type="number"
                  min="0"
                  value={formData.valeurEstimee || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    valeurEstimee: e.target.value ? parseFloat(e.target.value) : 0 
                  })}
                  placeholder="Ex: 350000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation/Emplacement</Label>
                <Input
                  id="localisation"
                  value={formData.localisation}
                  onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  placeholder="Ex: Coffre-fort, garage, bureau..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution/Entreprise</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Ex: Institution financière, Caisse populaire..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numeroCompte">Numéro de compte/référence</Label>
                <Input
                  id="numeroCompte"
                  value={formData.numeroCompte}
                  onChange={(e) => setFormData({ ...formData, numeroCompte: e.target.value })}
                  placeholder="Numéro de compte ou référence"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaireDesigne">Bénéficiaire désigné</Label>
              <Input
                id="beneficiaireDesigne"
                value={formData.beneficiaireDesigne}
                onChange={(e) => setFormData({ ...formData, beneficiaireDesigne: e.target.value })}
                placeholder="Bénéficiaire déjà désigné (assurances, REER, etc.)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations supplémentaires, conditions particulières..."
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

      {/* Liste des actifs */}
      <div className="space-y-4">
        {actifs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun actif enregistré</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos biens pour constituer votre inventaire successoral
              </p>
              <Button onClick={() => setShowForm(true)}>
                Ajouter votre premier actif
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {actifs.map((actif, index) => {
              const typeInfo = typesActifs.find(t => t.value === actif.type);
              const IconComponent = typeInfo?.icon || Building;
              
              return (
                <Card key={actif.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{actif.nom}</h4>
                          <Badge variant="outline">{typeInfo?.label}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {actif.valeurEstimee.toLocaleString('fr-CA', { 
                              style: 'currency', 
                              currency: 'CAD' 
                            })}
                          </Badge>
                        </div>
                        
                        {actif.description && (
                          <p className="text-sm text-muted-foreground">{actif.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {actif.institution && (
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Institution :</strong> {actif.institution}</span>
                            </div>
                          )}
                          
                          {actif.numeroCompte && (
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Compte :</strong> {actif.numeroCompte}</span>
                            </div>
                          )}
                          
                          {actif.localisation && (
                            <div className="flex items-center space-x-2">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Localisation :</strong> {actif.localisation}</span>
                            </div>
                          )}
                          
                          {actif.beneficiaireDesigne && (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Bénéficiaire :</strong> {actif.beneficiaireDesigne}</span>
                            </div>
                          )}
                        </div>
                        
                        {actif.notes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes :</strong> {actif.notes}
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

      {/* Résumé par type d'actif */}
      {actifs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé par type d'actif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {typesActifs.map(type => {
                const count = actifsByType[type.value] || 0;
                const valeurType = actifs
                  .filter(a => a.type === type.value)
                  .reduce((sum, a) => sum + a.valeurEstimee, 0);
                const IconComponent = type.icon;
                
                if (count === 0) return null;
                
                return (
                  <div key={type.value} className="text-center p-3 bg-muted rounded-lg">
                    <IconComponent className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{count} actif{count > 1 ? 's' : ''}</p>
                    <p className="text-sm font-medium">
                      {valeurType.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
