import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Edit, Users, Phone, Mail, MapPin, Percent, DollarSign } from 'lucide-react';
import { Beneficiaire } from '../../types/succession-planning';

interface BeneficiairesFormProps {
  beneficiaires: Beneficiaire[];
  onUpdate: (beneficiaires: Beneficiaire[]) => void;
}

const relations = [
  'Conjoint(e)',
  'Enfant',
  'Parent',
  'Frère/Sœur',
  'Grand-parent',
  'Petit-enfant',
  'Neveu/Nièce',
  'Ami(e)',
  'Organisme caritatif',
  'Autre'
];

const typesLegs = [
  { value: 'universel', label: 'Legs universel (tout ou partie de la succession)' },
  { value: 'particulier', label: 'Legs particulier (bien spécifique)' },
  { value: 'residuel', label: 'Legs résiduel (ce qui reste après les autres legs)' }
];

export const BeneficiairesForm: React.FC<BeneficiairesFormProps> = ({ beneficiaires, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Beneficiaire>>({
    prenom: '',
    nom: '',
    relation: '',
    adresse: '',
    telephone: '',
    email: '',
    pourcentage: undefined,
    montantFixe: undefined,
    typeLegs: 'particulier',
    conditions: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      relation: '',
      adresse: '',
      telephone: '',
      email: '',
      pourcentage: undefined,
      montantFixe: undefined,
      typeLegs: 'particulier',
      conditions: '',
      notes: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.prenom || !formData.nom || !formData.relation) {
      alert('Veuillez remplir les champs obligatoires (prénom, nom, relation)');
      return;
    }

    const beneficiaire: Beneficiaire = {
      id: editingIndex !== null ? beneficiaires[editingIndex].id : Date.now().toString(),
      prenom: formData.prenom!,
      nom: formData.nom!,
      relation: formData.relation!,
      adresse: formData.adresse || '',
      telephone: formData.telephone || '',
      email: formData.email || '',
      pourcentage: formData.pourcentage,
      montantFixe: formData.montantFixe,
      typeLegs: formData.typeLegs!,
      conditions: formData.conditions || '',
      notes: formData.notes || '',
      createdAt: editingIndex !== null ? beneficiaires[editingIndex].createdAt : new Date(),
      updatedAt: new Date()
    };

    let updatedBeneficiaires;
    if (editingIndex !== null) {
      updatedBeneficiaires = [...beneficiaires];
      updatedBeneficiaires[editingIndex] = beneficiaire;
    } else {
      updatedBeneficiaires = [...beneficiaires, beneficiaire];
    }

    onUpdate(updatedBeneficiaires);
    resetForm();
  };

  const handleEdit = (index: number) => {
    const beneficiaire = beneficiaires[index];
    setFormData({
      prenom: beneficiaire.prenom,
      nom: beneficiaire.nom,
      relation: beneficiaire.relation,
      adresse: beneficiaire.adresse,
      telephone: beneficiaire.telephone,
      email: beneficiaire.email,
      pourcentage: beneficiaire.pourcentage,
      montantFixe: beneficiaire.montantFixe,
      typeLegs: beneficiaire.typeLegs,
      conditions: beneficiaire.conditions,
      notes: beneficiaire.notes
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const beneficiaire = beneficiaires[index];
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${beneficiaire.prenom} ${beneficiaire.nom} de la liste des bénéficiaires ?`)) {
      const updatedBeneficiaires = beneficiaires.filter((_, i) => i !== index);
      onUpdate(updatedBeneficiaires);
    }
  };

  const getTotalPourcentage = () => {
    return beneficiaires.reduce((total, b) => total + (b.pourcentage || 0), 0);
  };

  const getTotalMontantFixe = () => {
    return beneficiaires.reduce((total, b) => total + (b.montantFixe || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-mpr-interactive" />
              <div>
                <p className="text-sm text-muted-foreground">Bénéficiaires</p>
                <p className="text-2xl font-bold">{beneficiaires.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total %</p>
                <p className="text-2xl font-bold">{getTotalPourcentage()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Montants fixes</p>
                <p className="text-2xl font-bold">
                  {getTotalMontantFixe().toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes */}
      {getTotalPourcentage() > 100 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            <strong>Attention :</strong> Le total des pourcentages dépasse 100 % ({getTotalPourcentage()}%). 
            Veuillez ajuster la répartition.
          </AlertDescription>
        </Alert>
      )}

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Liste des bénéficiaires</h3>
          <p className="text-sm text-muted-foreground">
            Définissez qui héritera de vos biens et dans quelles proportions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un bénéficiaire</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier le bénéficiaire' : 'Ajouter un bénéficiaire'}
            </CardTitle>
            <CardDescription>
              Renseignez les informations sur le bénéficiaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Prénom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom de famille"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relation">Relation *</Label>
                <Select
                  value={formData.relation}
                  onValueChange={(value) => setFormData({ ...formData, relation: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {relations.map(relation => (
                      <SelectItem key={relation} value={relation}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                placeholder="Adresse complète"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="(514) 555-0123"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Courriel</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="beneficiaire@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeLegs">Type de legs</Label>
              <Select
                value={formData.typeLegs}
                onValueChange={(value: 'universel' | 'particulier' | 'residuel') => 
                  setFormData({ ...formData, typeLegs: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typesLegs.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pourcentage">Pourcentage (%)</Label>
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
                  placeholder="Ex: 25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="montantFixe">Montant fixe ($)</Label>
                <Input
                  id="montantFixe"
                  type="number"
                  min="0"
                  value={formData.montantFixe || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    montantFixe: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  placeholder="Ex: 10000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Conditions particulières</Label>
              <Textarea
                id="conditions"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                placeholder="Ex: À recevoir à l'âge de 25 ans, pour les études..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations supplémentaires"
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

      {/* Liste des bénéficiaires */}
      <div className="space-y-4">
        {beneficiaires.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun bénéficiaire enregistré</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos bénéficiaires pour définir qui héritera de vos biens
              </p>
              <Button onClick={() => setShowForm(true)}>
                Ajouter votre premier bénéficiaire
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {beneficiaires.map((beneficiaire, index) => (
              <Card key={beneficiaire.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-lg">
                          {beneficiaire.prenom} {beneficiaire.nom}
                        </h4>
                        <Badge variant="outline">{beneficiaire.relation}</Badge>
                        <Badge className={
                          beneficiaire.typeLegs === 'universel' ? 'bg-mpr-interactive-lt text-mpr-navy' :
                          beneficiaire.typeLegs === 'particulier' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }>
                          {typesLegs.find(t => t.value === beneficiaire.typeLegs)?.label.split(' ')[1]}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {beneficiaire.adresse && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{beneficiaire.adresse}</span>
                          </div>
                        )}
                        
                        {beneficiaire.telephone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{beneficiaire.telephone}</span>
                          </div>
                        )}
                        
                        {beneficiaire.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{beneficiaire.email}</span>
                          </div>
                        )}
                        
                        {(beneficiaire.pourcentage || beneficiaire.montantFixe) && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {beneficiaire.pourcentage && `${beneficiaire.pourcentage}%`}
                              {beneficiaire.pourcentage && beneficiaire.montantFixe && ' + '}
                              {beneficiaire.montantFixe && 
                                beneficiaire.montantFixe.toLocaleString('fr-CA', { 
                                  style: 'currency', 
                                  currency: 'CAD' 
                                })
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {beneficiaire.conditions && (
                        <div className="mt-2 p-2 bg-mpr-interactive-lt rounded-md">
                          <p className="text-sm text-mpr-navy">
                            <strong>Conditions :</strong> {beneficiaire.conditions}
                          </p>
                        </div>
                      )}
                      
                      {beneficiaire.notes && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            <strong>Notes :</strong> {beneficiaire.notes}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
