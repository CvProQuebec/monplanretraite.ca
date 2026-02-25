// Onglet de succession et préférences funéraires
// Plan Professional - Gestion avancée de la succession
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
import { FileText, Plus, Trash2, Edit, Calendar as CalendarIcon, User, Building, Heart, AlertTriangle, Info, Shield, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { WillAndSuccession, FuneralPreferences, FuneralHome, Cemetery } from '../../types/emergency-info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../../hooks/useLanguage';

interface SuccessionTabProps {
  data: {
    willAndSuccession: WillAndSuccession;
    funeralPreferences: FuneralPreferences;
  };
  onUpdate: (data: { willAndSuccession: WillAndSuccession; funeralPreferences: FuneralPreferences }) => void;
}

export const SuccessionTab: React.FC<SuccessionTabProps> = ({ data, onUpdate }) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const [activeTab, setActiveTab] = useState('will');
  const [showWillForm, setShowWillForm] = useState(false);
  const [showFuneralForm, setShowFuneralForm] = useState(false);
  const [showFuneralHomeForm, setShowFuneralHomeForm] = useState(false);
  const [showCemeteryForm, setShowCemeteryForm] = useState(false);
  const [editingFuneralHomeIndex, setEditingFuneralHomeIndex] = useState<number | null>(null);
  const [editingCemeteryIndex, setEditingCemeteryIndex] = useState<number | null>(null);

  const [newFuneralHome, setNewFuneralHome] = useState<Partial<FuneralHome>>({
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
    contactPerson: '',
    notes: ''
  });

  const [newCemetery, setNewCemetery] = useState<Partial<Cemetery>>({
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    plotNumber: '',
    section: '',
    notes: ''
  });

  const provinces = isEnglish ? [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
  ] : [
    'Alberta', 'Colombie-Britannique', 'Manitoba', 'Nouveau-Brunswick',
    'Terre-Neuve-et-Labrador', 'Nouvelle-Écosse', 'Ontario', 'Île-du-Prince-Édouard',
    'Québec', 'Saskatchewan', 'Territoires du Nord-Ouest', 'Nunavut', 'Yukon'
  ];

  const funeralTypes = [
    { value: 'traditional', label: isEnglish ? 'Traditional' : 'Traditionnel' },
    { value: 'cremation', label: isEnglish ? 'Cremation' : 'Crémation' },
    { value: 'green', label: isEnglish ? 'Green' : 'Écologique' },
    { value: 'memorial', label: isEnglish ? 'Memorial Service' : 'Service commémoratif' },
    { value: 'other', label: isEnglish ? 'Other' : 'Autre' }
  ];

  const burialTypes = [
    { value: 'ground', label: isEnglish ? 'Ground Burial' : 'En terre' },
    { value: 'mausoleum', label: isEnglish ? 'Mausoleum' : 'Mausolée' },
    { value: 'columbarium', label: isEnglish ? 'Columbarium' : 'Columbarium' },
    { value: 'scattering', label: isEnglish ? 'Ash Scattering' : 'Dispersion des cendres' },
    { value: 'other', label: isEnglish ? 'Other' : 'Autre' }
  ];

  const handleAddFuneralHome = () => {
    if (!newFuneralHome.name || !newFuneralHome.city) return;

    const funeralHome: FuneralHome = {
      id: Date.now().toString(),
      name: newFuneralHome.name!,
      address: newFuneralHome.address || '',
      city: newFuneralHome.city!,
      province: newFuneralHome.province || '',
      postalCode: newFuneralHome.postalCode || '',
      phone: newFuneralHome.phone || '',
      email: newFuneralHome.email || '',
      contactPerson: newFuneralHome.contactPerson || '',
      notes: newFuneralHome.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedFuneralHomes = [...data.funeralPreferences.funeralHomes, funeralHome];
    const updatedFuneralPreferences = {
      ...data.funeralPreferences,
      funeralHomes: updatedFuneralHomes
    };
    
    onUpdate({ ...data, funeralPreferences: updatedFuneralPreferences });
    
    setNewFuneralHome({
      name: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      email: '',
      contactPerson: '',
      notes: ''
    });
    setShowFuneralHomeForm(false);
  };

  const handleAddCemetery = () => {
    if (!newCemetery.name || !newCemetery.city) return;

    const cemetery: Cemetery = {
      id: Date.now().toString(),
      name: newCemetery.name!,
      address: newCemetery.address || '',
      city: newCemetery.city!,
      province: newCemetery.province || '',
      postalCode: newCemetery.postalCode || '',
      phone: newCemetery.phone || '',
      plotNumber: newCemetery.plotNumber || '',
      section: newCemetery.section || '',
      notes: newCemetery.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedCemeteries = [...data.funeralPreferences.cemeteries, cemetery];
    const updatedFuneralPreferences = {
      ...data.funeralPreferences,
      cemeteries: updatedCemeteries
    };
    
    onUpdate({ ...data, funeralPreferences: updatedFuneralPreferences });
    
    setNewCemetery({
      name: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      plotNumber: '',
      section: '',
      notes: ''
    });
    setShowCemeteryForm(false);
  };

  const handleDeleteFuneralHome = (index: number) => {
    const updatedFuneralHomes = data.funeralPreferences.funeralHomes.filter((_, i) => i !== index);
    const updatedFuneralPreferences = {
      ...data.funeralPreferences,
      funeralHomes: updatedFuneralHomes
    };
    onUpdate({ ...data, funeralPreferences: updatedFuneralPreferences });
  };

  const handleDeleteCemetery = (index: number) => {
    const updatedCemeteries = data.funeralPreferences.cemeteries.filter((_, i) => i !== index);
    const updatedFuneralPreferences = {
      ...data.funeralPreferences,
      cemeteries: updatedCemeteries
    };
    onUpdate({ ...data, funeralPreferences: updatedFuneralPreferences });
  };

  const handleUpdateWill = (field: keyof WillAndSuccession, value: any) => {
    const updatedWill = {
      ...data.willAndSuccession,
      [field]: value,
      updatedAt: new Date()
    };
    onUpdate({ ...data, willAndSuccession: updatedWill });
  };

  const handleUpdateFuneral = (field: keyof FuneralPreferences, value: any) => {
    const updatedFuneral = {
      ...data.funeralPreferences,
      [field]: value,
      updatedAt: new Date()
    };
    onUpdate({ ...data, funeralPreferences: updatedFuneral });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-mpr-interactive" />
              <div>
                <p className="text-sm text-muted-foreground">{isEnglish ? 'Will' : 'Testament'}</p>
                <p className="text-2xl font-bold">
                  {data.willAndSuccession.hasWill ? (isEnglish ? 'Present' : 'Présent') : (isEnglish ? 'Absent' : 'Absent')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{isEnglish ? 'Funeral Homes' : 'Salons funéraires'}</p>
                <p className="text-2xl font-bold">{data.funeralPreferences.funeralHomes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{isEnglish ? 'Cemeteries' : 'Cimetières'}</p>
                <p className="text-2xl font-bold">{data.funeralPreferences.cemeteries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes importantes */}
      {!data.willAndSuccession.hasWill && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>{isEnglish ? 'Important Recommendation:' : 'Recommandation importante :'}</strong> {isEnglish ? 'You do not have a will yet. Consider writing one to protect your loved ones and assets.' : 'Vous n\'avez pas encore de testament. Considérez en rédiger un pour protéger vos proches et vos biens.'}
          </AlertDescription>
        </Alert>
      )}

      {!data.funeralPreferences.hasFuneralPreferences && (
        <Alert className="border-mpr-border bg-mpr-interactive-lt">
          <Info className="h-4 w-4 text-mpr-interactive" />
          <AlertDescription>
            <strong>{isEnglish ? 'Information:' : 'Information :'}</strong> {isEnglish ? 'You have not yet expressed your funeral preferences. This can help your loved ones make difficult decisions.' : 'Vous n\'avez pas encore exprimé vos préférences funéraires. Cela peut aider vos proches à prendre des décisions difficiles.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="will">{isEnglish ? 'Will & Estate' : 'Testament et succession'}</TabsTrigger>
          <TabsTrigger value="funeral">{isEnglish ? 'Funeral Preferences' : 'Préférences funéraires'}</TabsTrigger>
        </TabsList>

        {/* Onglet Testament et succession */}
        <TabsContent value="will" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{isEnglish ? 'Will & Estate' : 'Testament et succession'}</h3>
              <p className="text-sm text-muted-foreground">
                {isEnglish ? 'Manage your estate and will information' : 'Gérez vos informations de succession et testament'}
              </p>
            </div>
            <Button onClick={() => setShowWillForm(true)} className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>{isEnglish ? 'Edit' : 'Modifier'}</span>
            </Button>
          </div>

          {/* Formulaire d'édition du testament */}
          {showWillForm && (
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'Edit Estate Information' : 'Modifier les informations de succession'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Update your will and estate information' : 'Mettez à jour vos informations de testament et succession'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-will"
                    checked={data.willAndSuccession.hasWill}
                    onCheckedChange={(checked) => 
                      handleUpdateWill('hasWill', checked)
                    }
                  />
                  <Label htmlFor="has-will">{isEnglish ? 'I have a will' : 'J\'ai un testament'}</Label>
                </div>

                {data.willAndSuccession.hasWill && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="will-date">{isEnglish ? 'Will Date' : 'Date du testament'}</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {data.willAndSuccession.willDate ? 
                                format(new Date(data.willAndSuccession.willDate), 'PPP', { locale: isEnglish ? enUS : fr }) : 
                                (isEnglish ? 'Select a date' : 'Sélectionner une date')
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={data.willAndSuccession.willDate ? new Date(data.willAndSuccession.willDate) : undefined}
                              onSelect={(date) => handleUpdateWill('willDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="will-location">{isEnglish ? 'Will Location' : 'Emplacement du testament'}</Label>
                        <Input
                          id="will-location"
                          value={data.willAndSuccession.willLocation || ''}
                          onChange={(e) => handleUpdateWill('willLocation', e.target.value)}
                          placeholder={isEnglish ? 'Ex: Safe, Law Office' : 'Ex : Coffre-fort, Cabinet d\'avocat'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="executor-name">{isEnglish ? 'Executor Name' : 'Nom de l\'exécuteur testamentaire'}</Label>
                      <Input
                        id="executor-name"
                        value={data.willAndSuccession.executorName || ''}
                        onChange={(e) => handleUpdateWill('executorName', e.target.value)}
                        placeholder={isEnglish ? 'Full name of executor' : 'Nom complet de l\'exécuteur'}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="space-y-2">
                          <Label htmlFor="executor-phone">{isEnglish ? 'Executor Phone' : 'Téléphone de l\'exécuteur'}</Label>
                          <Input
                            id="executor-phone"
                            value={data.willAndSuccession.executorPhone || ''}
                            onChange={(e) => handleUpdateWill('executorPhone', e.target.value)}
                            placeholder="(514) 555-0123"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="executor-email">{isEnglish ? 'Executor Email' : 'Email de l\'exécuteur'}</Label>
                        <Input
                          id="executor-email"
                          type="email"
                          value={data.willAndSuccession.executorEmail || ''}
                          onChange={(e) => handleUpdateWill('executorEmail', e.target.value)}
                          placeholder={isEnglish ? 'executor@email.com' : 'executeur@email.com'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="succession-notes">{isEnglish ? 'Estate Notes' : 'Notes sur la succession'}</Label>
                      <Textarea
                        id="succession-notes"
                        value={data.willAndSuccession.notes || ''}
                        onChange={(e) => handleUpdateWill('notes', e.target.value)}
                        placeholder={isEnglish ? 'Important information about your estate, special instructions...' : 'Informations importantes sur votre succession, instructions spéciales...'}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowWillForm(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affichage des informations de succession */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-mpr-interactive" />
                  <h4 className="text-lg font-semibold">État du testament</h4>
                  <Badge className={data.willAndSuccession.hasWill ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {data.willAndSuccession.hasWill ? 'Présent' : 'Absent'}
                  </Badge>
                </div>

                {data.willAndSuccession.hasWill ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.willAndSuccession.willDate && (
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Date :</strong> {format(new Date(data.willAndSuccession.willDate), 'PPP', { locale: fr })}</span>
                      </div>
                    )}
                    
                    {data.willAndSuccession.willLocation && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Emplacement :</strong> {data.willAndSuccession.willLocation}</span>
                      </div>
                    )}
                    
                    {data.willAndSuccession.executorName && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Exécuteur :</strong> {data.willAndSuccession.executorName}</span>
                      </div>
                    )}
                    
                    {data.willAndSuccession.executorPhone && (
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Téléphone :</strong> {data.willAndSuccession.executorPhone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Aucun testament n'est actuellement enregistré. 
                    Considérez en rédiger un pour protéger vos proches.
                  </p>
                )}

                {data.willAndSuccession.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes :</strong> {data.willAndSuccession.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences funéraires */}
        <TabsContent value="funeral" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Préférences funéraires</h3>
              <p className="text-sm text-muted-foreground">
                Exprimez vos souhaits pour vos funérailles
              </p>
            </div>
            <Button onClick={() => setShowFuneralForm(true)} className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </Button>
          </div>

          {/* Formulaire d'édition des préférences funéraires */}
          {showFuneralForm && (
            <Card>
              <CardHeader>
                <CardTitle>Modifier les préférences funéraires</CardTitle>
                <CardDescription>
                  Exprimez vos souhaits pour vos funérailles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-funeral-preferences"
                    checked={data.funeralPreferences.hasFuneralPreferences}
                    onCheckedChange={(checked) => 
                      handleUpdateFuneral('hasFuneralPreferences', checked)
                    }
                  />
                  <Label htmlFor="has-funeral-preferences">J'ai des préférences funéraires</Label>
                </div>

                {data.funeralPreferences.hasFuneralPreferences && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="funeral-type">Type de funérailles</Label>
                        <Select
                          value={data.funeralPreferences.funeralType || ''}
                          onValueChange={(value) => handleUpdateFuneral('funeralType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            {funeralTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="burial-type">Type d'inhumation</Label>
                        <Select
                          value={data.funeralPreferences.burialType || ''}
                          onValueChange={(value) => handleUpdateFuneral('burialType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            {burialTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="funeral-notes">Notes et préférences</Label>
                      <Textarea
                        id="funeral-notes"
                        value={data.funeralPreferences.notes || ''}
                        onChange={(e) => handleUpdateFuneral('notes', e.target.value)}
                        placeholder="Vos souhaits spécifiques, musique, lectures, fleurs..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFuneralForm(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affichage des préférences funéraires */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <h4 className="text-lg font-semibold">Préférences funéraires</h4>
                  <Badge className={data.funeralPreferences.hasFuneralPreferences ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {data.funeralPreferences.hasFuneralPreferences ? 'Définies' : 'Non définies'}
                  </Badge>
                </div>

                {data.funeralPreferences.hasFuneralPreferences ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.funeralPreferences.funeralType && (
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Type :</strong> {funeralTypes.find(t => t.value === data.funeralPreferences.funeralType)?.label}
                        </span>
                      </div>
                    )}
                    
                    {data.funeralPreferences.burialType && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Inhumation :</strong> {burialTypes.find(t => t.value === data.funeralPreferences.burialType)?.label}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Aucune préférence funéraire n'est actuellement définie. 
                    Exprimez vos souhaits pour aider vos proches.
                  </p>
                )}

                {data.funeralPreferences.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes :</strong> {data.funeralPreferences.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section Salons funéraires */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Salons funéraires</h3>
                <p className="text-sm text-muted-foreground">
                  Gérez vos contacts de salons funéraires
                </p>
              </div>
              <Button onClick={() => setShowFuneralHomeForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Ajouter un salon</span>
              </Button>
            </div>

            {/* Formulaire d'ajout de salon funéraire */}
            {showFuneralHomeForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un salon funéraire</CardTitle>
                  <CardDescription>
                    Renseignez les informations sur le salon funéraire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-name">Nom du salon *</Label>
                      <Input
                        id="funeral-home-name"
                        value={newFuneralHome.name}
                        onChange={(e) => setNewFuneralHome({ ...newFuneralHome, name: e.target.value })}
                        placeholder="Nom du salon funéraire"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-city">Ville *</Label>
                      <Input
                        id="funeral-home-city"
                        value={newFuneralHome.city}
                        onChange={(e) => setNewFuneralHome({ ...newFuneralHome, city: e.target.value })}
                        placeholder="Ville"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="funeral-home-address">Adresse</Label>
                    <Input
                      id="funeral-home-address"
                      value={newFuneralHome.address}
                      onChange={(e) => setNewFuneralHome({ ...newFuneralHome, address: e.target.value })}
                      placeholder="Adresse complète"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-province">Province</Label>
                      <Select
                        value={newFuneralHome.province}
                        onValueChange={(value) => setNewFuneralHome({ ...newFuneralHome, province: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map(province => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-postal">Code postal</Label>
                      <Input
                        id="funeral-home-postal"
                        value={newFuneralHome.postalCode}
                        onChange={(e) => setNewFuneralHome({ ...newFuneralHome, postalCode: e.target.value })}
                        placeholder="Code postal"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-phone">Téléphone</Label>
                      <Input
                        id="funeral-home-phone"
                        value={newFuneralHome.phone}
                        onChange={(e) => setNewFuneralHome({ ...newFuneralHome, phone: e.target.value })}
                        placeholder="(514) 555-0123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-email">Email</Label>
                      <Input
                        id="funeral-home-email"
                        type="email"
                        value={newFuneralHome.email}
                        onChange={(e) => setNewFuneralHome({ ...newFuneralHome, email: e.target.value })}
                        placeholder="contact@salon.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="funeral-home-contact">Personne contact</Label>
                      <Input
                        id="funeral-home-contact"
                        value={newFuneralHome.contactPerson}
                        onChange={(e) => setNewFuneralHome({ ...newFuneralHome, contactPerson: e.target.value })}
                        placeholder="Nom du contact"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="funeral-home-notes">Notes</Label>
                    <Textarea
                      id="funeral-home-notes"
                      value={newFuneralHome.notes}
                      onChange={(e) => setNewFuneralHome({ ...newFuneralHome, notes: e.target.value })}
                      placeholder="Informations supplémentaires"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFuneralHomeForm(false);
                        setNewFuneralHome({
                          name: '',
                          address: '',
                          city: '',
                          province: '',
                          postalCode: '',
                          phone: '',
                          email: '',
                          contactPerson: '',
                          notes: ''
                        });
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleAddFuneralHome}
                      disabled={!newFuneralHome.name || !newFuneralHome.city}
                    >
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des salons funéraires */}
            <div className="space-y-4">
              {data.funeralPreferences.funeralHomes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun salon funéraire enregistré</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par ajouter vos contacts de salons funéraires
                    </p>
                    <Button onClick={() => setShowFuneralHomeForm(true)}>
                      Ajouter votre premier salon
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {data.funeralPreferences.funeralHomes.map((funeralHome, index) => (
                    <Card key={funeralHome.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-lg">{funeralHome.name}</h4>
                              <Badge variant="outline">{funeralHome.city}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {funeralHome.address && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{funeralHome.address}</span>
                                </div>
                              )}
                              
                              {funeralHome.phone && (
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{funeralHome.phone}</span>
                                </div>
                              )}
                              
                              {funeralHome.contactPerson && (
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span><strong>Contact :</strong> {funeralHome.contactPerson}</span>
                                </div>
                              )}
                              
                              {funeralHome.email && (
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{funeralHome.email}</span>
                                </div>
                              )}
                            </div>
                            
                            {funeralHome.notes && (
                              <div className="mt-2 p-2 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">{funeralHome.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFuneralHome(index)}
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

          {/* Section Cimetières */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Cimetières</h3>
                <p className="text-sm text-muted-foreground">
                  Gérez vos informations de cimetières
                </p>
              </div>
              <Button onClick={() => setShowCemeteryForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Ajouter un cimetière</span>
              </Button>
            </div>

            {/* Formulaire d'ajout de cimetière */}
            {showCemeteryForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un cimetière</CardTitle>
                  <CardDescription>
                    Renseignez les informations sur le cimetière
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cemetery-name">Nom du cimetière *</Label>
                      <Input
                        id="cemetery-name"
                        value={newCemetery.name}
                        onChange={(e) => setNewCemetery({ ...newCemetery, name: e.target.value })}
                        placeholder="Nom du cimetière"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cemetery-city">Ville *</Label>
                      <Input
                        id="cemetery-city"
                        value={newCemetery.city}
                        onChange={(e) => setNewCemetery({ ...newCemetery, city: e.target.value })}
                        placeholder="Ville"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cemetery-address">Adresse</Label>
                    <Input
                      id="cemetery-address"
                      value={newCemetery.address}
                      onChange={(e) => setNewCemetery({ ...newCemetery, address: e.target.value })}
                      placeholder="Adresse complète"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cemetery-province">Province</Label>
                      <Select
                        value={newCemetery.province}
                        onValueChange={(value) => setNewCemetery({ ...newCemetery, province: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map(province => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cemetery-postal">Code postal</Label>
                      <Input
                        id="cemetery-postal"
                        value={newCemetery.postalCode}
                        onChange={(e) => setNewCemetery({ ...newCemetery, postalCode: e.target.value })}
                        placeholder="Code postal"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cemetery-plot">Numéro de lot</Label>
                      <Input
                        id="cemetery-plot"
                        value={newCemetery.plotNumber}
                        onChange={(e) => setNewCemetery({ ...newCemetery, plotNumber: e.target.value })}
                        placeholder="Numéro de lot"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cemetery-section">Section</Label>
                      <Input
                        id="cemetery-section"
                        value={newCemetery.section}
                        onChange={(e) => setNewCemetery({ ...newCemetery, section: e.target.value })}
                        placeholder="Section"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cemetery-phone">Téléphone</Label>
                    <Input
                      id="cemetery-phone"
                      value={newCemetery.phone}
                      onChange={(e) => setNewCemetery({ ...newCemetery, phone: e.target.value })}
                      placeholder="(514) 555-0123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cemetery-notes">Notes</Label>
                    <Textarea
                      id="cemetery-notes"
                      value={newCemetery.notes}
                      onChange={(e) => setNewCemetery({ ...newCemetery, notes: e.target.value })}
                      placeholder="Informations supplémentaires"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCemeteryForm(false);
                        setNewCemetery({
                          name: '',
                          address: '',
                          city: '',
                          province: '',
                          postalCode: '',
                          phone: '',
                          plotNumber: '',
                          section: '',
                          notes: ''
                        });
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleAddCemetery}
                      disabled={!newCemetery.name || !newCemetery.city}
                    >
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des cimetières */}
            <div className="space-y-4">
              {data.funeralPreferences.cemeteries.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun cimetière enregistré</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par ajouter vos informations de cimetières
                    </p>
                    <Button onClick={() => setShowCemeteryForm(true)}>
                      Ajouter votre premier cimetière
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {data.funeralPreferences.cemeteries.map((cemetery, index) => (
                    <Card key={cemetery.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-lg">{cemetery.name}</h4>
                              <Badge variant="outline">{cemetery.city}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {cemetery.address && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{cemetery.address}</span>
                                </div>
                              )}
                              
                              {cemetery.plotNumber && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span><strong>Lot :</strong> {cemetery.plotNumber}</span>
                                </div>
                              )}
                              
                              {cemetery.section && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span><strong>Section :</strong> {cemetery.section}</span>
                                </div>
                              )}
                              
                              {cemetery.phone && (
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{cemetery.phone}</span>
                                </div>
                              )}
                            </div>
                            
                            {cemetery.notes && (
                              <div className="mt-2 p-2 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">{cemetery.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCemetery(index)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
