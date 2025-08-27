import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, Edit, FileText, Calendar as CalendarIcon, MapPin, User, Building } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentLegal } from '../../types/succession-planning';

interface DocumentsFormProps {
  documents: DocumentLegal[];
  onUpdate: (documents: DocumentLegal[]) => void;
}

const typesDocuments = [
  { value: 'testament', label: 'Testament', icon: FileText },
  { value: 'mandat_inaptitude', label: 'Mandat en cas d\'inaptitude', icon: User },
  { value: 'procuration', label: 'Procuration', icon: FileText },
  { value: 'assurance_vie', label: 'Police d\'assurance vie', icon: Building },
  { value: 'autre', label: 'Autre document', icon: FileText }
];

export const DocumentsForm: React.FC<DocumentsFormProps> = ({ documents, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DocumentLegal>>({
    type: 'testament',
    nom: '',
    dateCreation: undefined,
    localisation: '',
    notaire: '',
    numeroReference: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      type: 'testament',
      nom: '',
      dateCreation: undefined,
      localisation: '',
      notaire: '',
      numeroReference: '',
      notes: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.type || !formData.localisation) {
      alert('Veuillez remplir les champs obligatoires (nom, type, localisation)');
      return;
    }

    const document: DocumentLegal = {
      id: editingIndex !== null ? documents[editingIndex].id : Date.now().toString(),
      type: formData.type!,
      nom: formData.nom!,
      dateCreation: formData.dateCreation,
      localisation: formData.localisation!,
      notaire: formData.notaire || '',
      numeroReference: formData.numeroReference || '',
      notes: formData.notes || '',
      createdAt: editingIndex !== null ? documents[editingIndex].createdAt : new Date(),
      updatedAt: new Date()
    };

    let updatedDocuments;
    if (editingIndex !== null) {
      updatedDocuments = [...documents];
      updatedDocuments[editingIndex] = document;
    } else {
      updatedDocuments = [...documents, document];
    }

    onUpdate(updatedDocuments);
    resetForm();
  };

  const handleEdit = (index: number) => {
    const document = documents[index];
    setFormData({
      type: document.type,
      nom: document.nom,
      dateCreation: document.dateCreation,
      localisation: document.localisation,
      notaire: document.notaire,
      numeroReference: document.numeroReference,
      notes: document.notes
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const document = documents[index];
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${document.nom}" de la liste des documents ?`)) {
      const updatedDocuments = documents.filter((_, i) => i !== index);
      onUpdate(updatedDocuments);
    }
  };

  const getDocumentsByType = () => {
    const grouped = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return grouped;
  };

  const documentsByType = getDocumentsByType();

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Testaments</p>
                <p className="text-2xl font-bold">{documentsByType.testament || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avec notaire</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.notaire && d.notaire.trim() !== '').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Documents légaux</h3>
          <p className="text-sm text-muted-foreground">
            Testament, mandats, procurations et autres documents importants
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un document</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier le document' : 'Ajouter un document'}
            </CardTitle>
            <CardDescription>
              Renseignez les informations sur le document légal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du document *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Testament olographe, Mandat d'inaptitude..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type de document *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesDocuments.map(type => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateCreation">Date de création</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateCreation ? 
                        format(new Date(formData.dateCreation), 'PPP', { locale: fr }) : 
                        'Sélectionner une date'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateCreation ? new Date(formData.dateCreation) : undefined}
                      onSelect={(date) => setFormData({ ...formData, dateCreation: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numeroReference">Numéro de référence</Label>
                <Input
                  id="numeroReference"
                  value={formData.numeroReference}
                  onChange={(e) => setFormData({ ...formData, numeroReference: e.target.value })}
                  placeholder="Numéro de dossier, référence..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localisation">Localisation/Emplacement *</Label>
              <Input
                id="localisation"
                value={formData.localisation}
                onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                placeholder="Ex: Coffre-fort, Cabinet d'avocat, Classeur personnel..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notaire">Notaire/Professionnel</Label>
              <Input
                id="notaire"
                value={formData.notaire}
                onChange={(e) => setFormData({ ...formData, notaire: e.target.value })}
                placeholder="Nom du notaire, avocat ou autre professionnel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations supplémentaires, instructions particulières..."
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

      {/* Liste des documents */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun document enregistré</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos documents légaux importants
              </p>
              <Button onClick={() => setShowForm(true)}>
                Ajouter votre premier document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((document, index) => {
              const typeInfo = typesDocuments.find(t => t.value === document.type);
              const IconComponent = typeInfo?.icon || FileText;
              
              return (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{document.nom}</h4>
                          <Badge variant="outline">{typeInfo?.label}</Badge>
                          {document.notaire && (
                            <Badge className="bg-green-100 text-green-800">
                              Notarié
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {document.dateCreation && (
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>
                                <strong>Créé le :</strong> {format(new Date(document.dateCreation), 'PPP', { locale: fr })}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span><strong>Localisation :</strong> {document.localisation}</span>
                          </div>
                          
                          {document.notaire && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Notaire :</strong> {document.notaire}</span>
                            </div>
                          )}
                          
                          {document.numeroReference && (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Référence :</strong> {document.numeroReference}</span>
                            </div>
                          )}
                        </div>
                        
                        {document.notes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes :</strong> {document.notes}
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

      {/* Résumé par type de document */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé par type de document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {typesDocuments.map(type => {
                const count = documentsByType[type.value] || 0;
                const IconComponent = type.icon;
                
                if (count === 0) return null;
                
                return (
                  <div key={type.value} className="text-center p-3 bg-muted rounded-lg">
                    <IconComponent className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{count} document{count > 1 ? 's' : ''}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils et rappels */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Conseils importants</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Testament :</strong> Assurez-vous qu'il soit valide légalement (olographe, notarié ou devant témoins)</li>
            <li>• <strong>Copies :</strong> Conservez des copies dans plusieurs endroits sûrs</li>
            <li>• <strong>Mise à jour :</strong> Révisez vos documents après tout changement majeur de situation</li>
            <li>• <strong>Accès :</strong> Informez une personne de confiance de l'emplacement de vos documents</li>
            <li>• <strong>Mandat d'inaptitude :</strong> Essentiel pour désigner qui prendra les décisions si vous ne pouvez plus le faire</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
