// Onglet des documents importants
// Plan Professional - Gestion avancée des documents
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Plus, Trash2, Calendar as CalendarIcon, AlertTriangle, Info, File, FolderOpen, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ImportantDocument } from '../../types/emergency-info';

interface DocumentsTabProps {
  data: ImportantDocument[];
  onUpdate: (documents: ImportantDocument[]) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ data, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDocument, setNewDocument] = useState<Partial<ImportantDocument>>({
    name: '',
    type: 'personal',
    location: '',
    description: '',
    expiryDate: null,
    renewalReminder: false,
    renewalFrequency: 'yearly',
    isDigital: false,
    backupLocation: '',
    notes: ''
  });

  const documentTypes = [
    { value: 'personal', label: 'Personnel' },
    { value: 'medical', label: 'Médical' },
    { value: 'financial', label: 'Financier' },
    { value: 'legal', label: 'Légal' },
    { value: 'property', label: 'Propriété' },
    { value: 'insurance', label: 'Assurance' },
    { value: 'employment', label: 'Emploi' },
    { value: 'other', label: 'Autre' }
  ];

  const renewalFrequencies = [
    { value: 'monthly', label: 'Mensuel' },
    { value: 'quarterly', label: 'Trimestriel' },
    { value: 'yearly', label: 'Annuel' },
    { value: 'biennial', label: 'Biennal' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  const handleAddDocument = () => {
    if (!newDocument.name || !newDocument.type) return;

    const document: ImportantDocument = {
      id: Date.now().toString(),
      name: newDocument.name!,
      type: newDocument.type!,
      location: newDocument.location || '',
      description: newDocument.description || '',
      expiryDate: newDocument.expiryDate,
      renewalReminder: newDocument.renewalReminder || false,
      renewalFrequency: newDocument.renewalFrequency || 'yearly',
      isDigital: newDocument.isDigital || false,
      backupLocation: newDocument.backupLocation || '',
      notes: newDocument.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onUpdate([...data, document]);
    setNewDocument({
      name: '',
      type: 'personal',
      location: '',
      description: '',
      expiryDate: null,
      renewalReminder: false,
      renewalFrequency: 'yearly',
      isDigital: false,
      backupLocation: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleEditDocument = (index: number) => {
    const doc = data[index];
    setNewDocument({
      name: doc.name,
      type: doc.type,
      location: doc.location,
      description: doc.description,
      expiryDate: doc.expiryDate,
      renewalReminder: doc.renewalReminder,
      renewalFrequency: doc.renewalFrequency,
      isDigital: doc.isDigital,
      backupLocation: doc.backupLocation,
      notes: doc.notes
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateDocument = () => {
    if (editingIndex === null || !newDocument.name || !newDocument.type) return;

    const updatedDocuments = [...data];
    updatedDocuments[editingIndex] = {
      ...updatedDocuments[editingIndex],
      ...newDocument,
      updatedAt: new Date()
    };

    onUpdate(updatedDocuments);
    setEditingIndex(null);
    setShowAddForm(false);
    setNewDocument({
      name: '',
      type: 'personal',
      location: '',
      description: '',
      expiryDate: null,
      renewalReminder: false,
      renewalFrequency: 'yearly',
      isDigital: false,
      backupLocation: '',
      notes: ''
    });
  };

  const handleDeleteDocument = (index: number) => {
    const updatedDocuments = data.filter((_, i) => i !== index);
    onUpdate(updatedDocuments);
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      personal: 'bg-blue-100 text-blue-800',
      medical: 'bg-red-100 text-red-800',
      financial: 'bg-green-100 text-green-800',
      legal: 'bg-purple-100 text-purple-800',
      property: 'bg-orange-100 text-orange-800',
      insurance: 'bg-yellow-100 text-yellow-800',
      employment: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const getExpiringDocuments = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return data.filter(doc => 
      doc.expiryDate && 
      new Date(doc.expiryDate) <= thirtyDaysFromNow &&
      new Date(doc.expiryDate) >= now
    );
  };

  const expiringDocuments = getExpiringDocuments();

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total des documents</p>
                <p className="text-2xl font-bold">{data.length}</p>
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
                <p className="text-2xl font-bold">{expiringDocuments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avec sauvegarde</p>
                <p className="text-2xl font-bold">
                  {data.filter(doc => doc.backupLocation).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes pour documents expirant bientôt */}
      {expiringDocuments.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>{expiringDocuments.length}</strong> document(s) expire(nt) dans les 30 prochains jours.
            Vérifiez vos renouvellements.
          </AlertDescription>
        </Alert>
      )}

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Documents importants</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos documents essentiels avec des rappels de renouvellement
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un document</span>
        </Button>
      </div>

      {/* Formulaire d'ajout/édition */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Modifier le document' : 'Ajouter un document'}
            </CardTitle>
            <CardDescription>
              Renseignez les informations sur votre document important
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document-name">Nom du document *</Label>
                <Input
                  id="document-name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  placeholder="Ex : Passeport, Permis de conduire"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-type">Type de document *</Label>
                <Select
                  value={newDocument.type}
                  onValueChange={(value) => setNewDocument({ ...newDocument, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document-location">Emplacement physique</Label>
                <Input
                  id="document-location"
                  value={newDocument.location}
                  onChange={(e) => setNewDocument({ ...newDocument, location: e.target.value })}
                  placeholder="Ex : Coffre-fort, Tiroir bureau"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-expiry">Date d'expiration</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDocument.expiryDate ? 
                        format(newDocument.expiryDate, 'PPP', { locale: fr }) : 
                        'Sélectionner une date'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newDocument.expiryDate}
                      onSelect={(date) => setNewDocument({ ...newDocument, expiryDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-description">Description</Label>
              <Textarea
                id="document-description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                placeholder="Description détaillée du document"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document-backup">Emplacement de sauvegarde</Label>
                <Input
                  id="document-backup"
                  value={newDocument.backupLocation}
                  onChange={(e) => setNewDocument({ ...newDocument, backupLocation: e.target.value })}
                  placeholder="Ex : Cloud, Disque externe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-frequency">Fréquence de renouvellement</Label>
                <Select
                  value={newDocument.renewalFrequency}
                  onValueChange={(value) => setNewDocument({ ...newDocument, renewalFrequency: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {renewalFrequencies.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-notes">Notes additionnelles</Label>
              <Textarea
                id="document-notes"
                value={newDocument.notes}
                onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                placeholder="Informations supplémentaires, instructions spéciales..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="renewal-reminder"
                  checked={newDocument.renewalReminder}
                  onCheckedChange={(checked) => 
                    setNewDocument({ ...newDocument, renewalReminder: checked as boolean })
                  }
                />
                <Label htmlFor="renewal-reminder">Activer les rappels de renouvellement</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-digital"
                  checked={newDocument.isDigital}
                  onCheckedChange={(checked) => 
                    setNewDocument({ ...newDocument, isDigital: checked as boolean })
                  }
                />
                <Label htmlFor="is-digital">Document numérique</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingIndex(null);
                  setNewDocument({
                    name: '',
                    type: 'personal',
                    location: '',
                    description: '',
                    expiryDate: null,
                    renewalReminder: false,
                    renewalFrequency: 'yearly',
                    isDigital: false,
                    backupLocation: '',
                    notes: ''
                  });
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={editingIndex !== null ? handleUpdateDocument : handleAddDocument}
                disabled={!newDocument.name || !newDocument.type}
              >
                {editingIndex !== null ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des documents */}
      <div className="space-y-4">
        {data.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun document enregistré</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos documents importants pour les garder organisés
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                Ajouter votre premier document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.map((document, index) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-lg">{document.name}</h4>
                        <Badge className={getDocumentTypeColor(document.type)}>
                          {documentTypes.find(t => t.value === document.type)?.label}
                        </Badge>
                        {document.isDigital && (
                          <Badge variant="secondary">Numérique</Badge>
                        )}
                        {document.renewalReminder && (
                          <Badge variant="outline" className="text-orange-600">
                            Rappels actifs
                          </Badge>
                        )}
                      </div>
                      
                      {document.description && (
                        <p className="text-muted-foreground">{document.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {document.location && (
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            <span><strong>Emplacement :</strong> {document.location}</span>
                          </div>
                        )}
                        
                        {document.expiryDate && (
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <strong>Expire le :</strong> {format(new Date(document.expiryDate), 'PPP', { locale: fr })}
                            </span>
                          </div>
                        )}
                        
                        {document.backupLocation && (
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span><strong>Sauvegarde :</strong> {document.backupLocation}</span>
                          </div>
                        )}
                        
                        {document.renewalFrequency && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <strong>Renouvellement :</strong> {
                                renewalFrequencies.find(f => f.value === document.renewalFrequency)?.label
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {document.notes && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">{document.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDocument(index)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(index)}
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
