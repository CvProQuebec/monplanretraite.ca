// Onglet des propriétés et biens entreposés
// Plan Professional - Gestion avancée des biens
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
import { Home, Plus, Trash2, Edit, MapPin, DollarSign, Shield, Package, Building, Car, Info, AlertTriangle } from 'lucide-react';
import { Property, StoredGoods } from '../../types/emergency-info';

interface PropertiesTabProps {
  data: {
    properties: Property[];
    storedGoods: StoredGoods[];
  };
  onUpdate: (data: { properties: Property[]; storedGoods: StoredGoods[] }) => void;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({ data, onUpdate }) => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showGoodsForm, setShowGoodsForm] = useState(false);
  const [editingPropertyIndex, setEditingPropertyIndex] = useState<number | null>(null);
  const [editingGoodsIndex, setEditingGoodsIndex] = useState<number | null>(null);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    type: 'residential',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    description: '',
    estimatedValue: '',
    mortgageInfo: '',
    insuranceInfo: '',
    maintenanceNotes: '',
    isPrimary: false
  });
  const [newGoods, setNewGoods] = useState<Partial<StoredGoods>>({
    name: '',
    category: 'furniture',
    location: '',
    description: '',
    estimatedValue: '',
    condition: 'good',
    isInsured: false,
    insuranceDetails: '',
    storageNotes: ''
  });

  const propertyTypes = [
    { value: 'residential', label: 'Résidentiel' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'vacation', label: 'Vacances' },
    { value: 'investment', label: 'Investissement' },
    { value: 'land', label: 'Terrain' },
    { value: 'other', label: 'Autre' }
  ];

  const goodsCategories = [
    { value: 'furniture', label: 'Meubles' },
    { value: 'electronics', label: 'Électronique' },
    { value: 'jewelry', label: 'Bijoux' },
    { value: 'art', label: 'Art' },
    { value: 'collectibles', label: 'Collection' },
    { value: 'documents', label: 'Documents' },
    { value: 'clothing', label: 'Vêtements' },
    { value: 'tools', label: 'Outils' },
    { value: 'other', label: 'Autre' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Bon' },
    { value: 'fair', label: 'Acceptable' },
    { value: 'poor', label: 'Mauvais' },
    { value: 'damaged', label: 'Endommagé' }
  ];

  const provinces = [
    'Alberta', 'Colombie-Britannique', 'Manitoba', 'Nouveau-Brunswick',
    'Terre-Neuve-et-Labrador', 'Nouvelle-Écosse', 'Ontario', 'Île-du-Prince-Édouard',
    'Québec', 'Saskatchewan', 'Territoires du Nord-Ouest', 'Nunavut', 'Yukon'
  ];

  const handleAddProperty = () => {
    if (!newProperty.type || !newProperty.address || !newProperty.city) return;

    const property: Property = {
      id: Date.now().toString(),
      type: newProperty.type!,
      address: newProperty.address!,
      city: newProperty.city!,
      province: newProperty.province || '',
      postalCode: newProperty.postalCode || '',
      description: newProperty.description || '',
      estimatedValue: newProperty.estimatedValue || '',
      mortgageInfo: newProperty.mortgageInfo || '',
      insuranceInfo: newProperty.insuranceInfo || '',
      maintenanceNotes: newProperty.maintenanceNotes || '',
      isPrimary: newProperty.isPrimary || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProperties = [...data.properties, property];
    onUpdate({ ...data, properties: updatedProperties });
    
    setNewProperty({
      type: 'residential',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      description: '',
      estimatedValue: '',
      mortgageInfo: '',
      insuranceInfo: '',
      maintenanceNotes: '',
      isPrimary: false
    });
    setShowPropertyForm(false);
  };

  const handleAddGoods = () => {
    if (!newGoods.name || !newGoods.category || !newGoods.location) return;

    const goods: StoredGoods = {
      id: Date.now().toString(),
      name: newGoods.name!,
      category: newGoods.category!,
      location: newGoods.location!,
      description: newGoods.description || '',
      estimatedValue: newGoods.estimatedValue || '',
      condition: newGoods.condition || 'good',
      isInsured: newGoods.isInsured || false,
      insuranceDetails: newGoods.insuranceDetails || '',
      storageNotes: newGoods.storageNotes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedGoods = [...data.storedGoods, goods];
    onUpdate({ ...data, storedGoods: updatedGoods });
    
    setNewGoods({
      name: '',
      category: 'furniture',
      location: '',
      description: '',
      estimatedValue: '',
      condition: 'good',
      isInsured: false,
      insuranceDetails: '',
      storageNotes: ''
    });
    setShowGoodsForm(false);
  };

  const handleEditProperty = (index: number) => {
    const property = data.properties[index];
    setNewProperty({
      type: property.type,
      address: property.address,
      city: property.city,
      province: property.province,
      postalCode: property.postalCode,
      description: property.description,
      estimatedValue: property.estimatedValue,
      mortgageInfo: property.mortgageInfo,
      insuranceInfo: property.insuranceInfo,
      maintenanceNotes: property.maintenanceNotes,
      isPrimary: property.isPrimary
    });
    setEditingPropertyIndex(index);
    setShowPropertyForm(true);
  };

  const handleEditGoods = (index: number) => {
    const goods = data.storedGoods[index];
    setNewGoods({
      name: goods.name,
      category: goods.category,
      location: goods.location,
      description: goods.description,
      estimatedValue: goods.estimatedValue,
      condition: goods.condition,
      isInsured: goods.isInsured,
      insuranceDetails: goods.insuranceDetails,
      storageNotes: goods.storageNotes
    });
    setEditingGoodsIndex(index);
    setShowGoodsForm(true);
  };

  const handleUpdateProperty = () => {
    if (editingPropertyIndex === null || !newProperty.type || !newProperty.address || !newProperty.city) return;

    const updatedProperties = [...data.properties];
    updatedProperties[editingPropertyIndex] = {
      ...updatedProperties[editingPropertyIndex],
      ...newProperty,
      updatedAt: new Date()
    };

    onUpdate({ ...data, properties: updatedProperties });
    setEditingPropertyIndex(null);
    setShowPropertyForm(false);
    setNewProperty({
      type: 'residential',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      description: '',
      estimatedValue: '',
      mortgageInfo: '',
      insuranceInfo: '',
      maintenanceNotes: '',
      isPrimary: false
    });
  };

  const handleUpdateGoods = () => {
    if (editingGoodsIndex === null || !newGoods.name || !newGoods.category || !newGoods.location) return;

    const updatedGoods = [...data.storedGoods];
    updatedGoods[editingGoodsIndex] = {
      ...updatedGoods[editingGoodsIndex],
      ...newGoods,
      updatedAt: new Date()
    };

    onUpdate({ ...data, storedGoods: updatedGoods });
    setEditingGoodsIndex(null);
    setShowGoodsForm(false);
    setNewGoods({
      name: '',
      category: 'furniture',
      location: '',
      description: '',
      estimatedValue: '',
      condition: 'good',
      isInsured: false,
      insuranceDetails: '',
      storageNotes: ''
    });
  };

  const handleDeleteProperty = (index: number) => {
    const updatedProperties = data.properties.filter((_, i) => i !== index);
    onUpdate({ ...data, properties: updatedProperties });
  };

  const handleDeleteGoods = (index: number) => {
    const updatedGoods = data.storedGoods.filter((_, i) => i !== index);
    onUpdate({ ...data, storedGoods: updatedGoods });
  };

  const getPropertyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      residential: 'bg-mpr-interactive-lt text-mpr-navy',
      commercial: 'bg-green-100 text-green-800',
      vacation: 'bg-yellow-100 text-yellow-800',
      investment: 'bg-purple-100 text-purple-800',
      land: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const getGoodsCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      furniture: 'bg-brown-100 text-brown-800',
      electronics: 'bg-mpr-interactive-lt text-mpr-navy',
      jewelry: 'bg-yellow-100 text-yellow-800',
      art: 'bg-purple-100 text-purple-800',
      collectibles: 'bg-red-100 text-red-800',
      documents: 'bg-gray-100 text-gray-800',
      clothing: 'bg-pink-100 text-pink-800',
      tools: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-mpr-interactive-lt text-mpr-navy',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-orange-100 text-orange-800',
      damaged: 'bg-red-100 text-red-800'
    };
    return colors[condition] || colors.good;
  };

  const totalPropertyValue = data.properties.reduce((sum, prop) => {
    const value = parseFloat(prop.estimatedValue.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + value;
  }, 0);

  const totalGoodsValue = data.storedGoods.reduce((sum, goods) => {
    const value = parseFloat(goods.estimatedValue.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + value;
  }, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-mpr-interactive" />
              <div>
                <p className="text-sm text-muted-foreground">Propriétés</p>
                <p className="text-2xl font-bold">{data.properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Biens entreposés</p>
                <p className="text-2xl font-bold">{data.storedGoods.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valeur propriétés</p>
                <p className="text-2xl font-bold">{totalPropertyValue.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valeur biens</p>
                <p className="text-2xl font-bold">{totalGoodsValue.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Propriétés */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Propriétés</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Gérez vos propriétés immobilières et leurs informations
            </p>
          </div>
          <Button onClick={() => setShowPropertyForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Ajouter une propriété</span>
          </Button>
        </div>

        {/* Formulaire d'ajout/édition de propriété */}
        {showPropertyForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPropertyIndex !== null ? 'Modifier la propriété' : 'Ajouter une propriété'}
              </CardTitle>
              <CardDescription>
                Renseignez les informations sur votre propriété
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-type">Type de propriété *</Label>
                  <Select
                    value={newProperty.type}
                    onValueChange={(value) => setNewProperty({ ...newProperty, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-address">Adresse *</Label>
                  <Input
                    id="property-address"
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                    placeholder="123 Rue Principale"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-city">Ville *</Label>
                  <Input
                    id="property-city"
                    value={newProperty.city}
                    onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                    placeholder="Montréal"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-province">Province</Label>
                  <Select
                    value={newProperty.province}
                    onValueChange={(value) => setNewProperty({ ...newProperty, province: value })}
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
                  <Label htmlFor="property-postal">Code postal</Label>
                  <Input
                    id="property-postal"
                    value={newProperty.postalCode}
                    onChange={(e) => setNewProperty({ ...newProperty, postalCode: e.target.value })}
                    placeholder="H1A 1A1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property-description">Description</Label>
                <Textarea
                  id="property-description"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                  placeholder="Description détaillée de la propriété"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-value">Valeur estimée</Label>
                  <Input
                    id="property-value"
                    value={newProperty.estimatedValue}
                    onChange={(e) => setNewProperty({ ...newProperty, estimatedValue: e.target.value })}
                    placeholder="500 000 $"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-mortgage">Informations hypothécaires</Label>
                  <Input
                    id="property-mortgage"
                    value={newProperty.mortgageInfo}
                    onChange={(e) => setNewProperty({ ...newProperty, mortgageInfo: e.target.value })}
                    placeholder="Montant restant, taux d'intérêt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-insurance">Informations d'assurance</Label>
                  <Input
                    id="property-insurance"
                    value={newProperty.insuranceInfo}
                    onChange={(e) => setNewProperty({ ...newProperty, insuranceInfo: e.target.value })}
                    placeholder="Numéro de police, couverture"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-maintenance">Notes d'entretien</Label>
                  <Input
                    id="property-maintenance"
                    value={newProperty.maintenanceNotes}
                    onChange={(e) => setNewProperty({ ...newProperty, maintenanceNotes: e.target.value })}
                    placeholder="Travaux récents, entretien requis"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="property-primary"
                  checked={newProperty.isPrimary}
                  onCheckedChange={(checked) => 
                    setNewProperty({ ...newProperty, isPrimary: checked as boolean })
                  }
                />
                <Label htmlFor="property-primary">Propriété principale</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPropertyForm(false);
                    setEditingPropertyIndex(null);
                    setNewProperty({
                      type: 'residential',
                      address: '',
                      city: '',
                      province: '',
                      postalCode: '',
                      description: '',
                      estimatedValue: '',
                      mortgageInfo: '',
                      insuranceInfo: '',
                      maintenanceNotes: '',
                      isPrimary: false
                    });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingPropertyIndex !== null ? handleUpdateProperty : handleAddProperty}
                  disabled={!newProperty.type || !newProperty.address || !newProperty.city}
                >
                  {editingPropertyIndex !== null ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des propriétés */}
        <div className="space-y-4">
          {data.properties.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune propriété enregistrée</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter vos propriétés immobilières
                </p>
                <Button onClick={() => setShowPropertyForm(true)}>
                  Ajouter votre première propriété
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {data.properties.map((property, index) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-lg">{property.address}</h4>
                          <Badge className={getPropertyTypeColor(property.type)}>
                            {propertyTypes.find(t => t.value === property.type)?.label}
                          </Badge>
                          {property.isPrimary && (
                            <Badge variant="secondary">Principale</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{property.city}, {property.province} {property.postalCode}</span>
                        </div>
                        
                        {property.description && (
                          <p className="text-muted-foreground">{property.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {property.estimatedValue && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Valeur :</strong> {property.estimatedValue}</span>
                            </div>
                          )}
                          
                          {property.mortgageInfo && (
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Hypothèque :</strong> {property.mortgageInfo}</span>
                            </div>
                          )}
                          
                          {property.insuranceInfo && (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Assurance :</strong> {property.insuranceInfo}</span>
                            </div>
                          )}
                        </div>
                        
                        {property.maintenanceNotes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <strong>Entretien :</strong> {property.maintenanceNotes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProperty(index)}
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

      {/* Section Biens entreposés */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Biens entreposés</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Inventaire de vos biens entreposés et leur valeur
            </p>
          </div>
          <Button onClick={() => setShowGoodsForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Ajouter des biens</span>
          </Button>
        </div>

        {/* Formulaire d'ajout/édition de biens */}
        {showGoodsForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingGoodsIndex !== null ? 'Modifier les biens' : 'Ajouter des biens'}
              </CardTitle>
              <CardDescription>
                Renseignez les informations sur vos biens entreposés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goods-name">Nom des biens *</Label>
                  <Input
                    id="goods-name"
                    value={newGoods.name}
                    onChange={(e) => setNewGoods({ ...newGoods, name: e.target.value })}
                    placeholder="Ex : Meubles de salon, Collection de livres"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goods-category">Catégorie *</Label>
                  <Select
                    value={newGoods.category}
                    onValueChange={(value) => setNewGoods({ ...newGoods, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {goodsCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goods-location">Emplacement *</Label>
                  <Input
                    id="goods-location"
                    value={newGoods.location}
                    onChange={(e) => setNewGoods({ ...newGoods, location: e.target.value })}
                    placeholder="Ex : Entrepôt, Cave, Garage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goods-condition">État</Label>
                  <Select
                    value={newGoods.condition}
                    onValueChange={(value) => setNewGoods({ ...newGoods, condition: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goods-description">Description</Label>
                <Textarea
                  id="goods-description"
                  value={newGoods.description}
                  onChange={(e) => setNewGoods({ ...newGoods, description: e.target.value })}
                  placeholder="Description détaillée des biens"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goods-value">Valeur estimée</Label>
                  <Input
                    id="goods-value"
                    value={newGoods.estimatedValue}
                    onChange={(e) => setNewGoods({ ...newGoods, estimatedValue: e.target.value })}
                    placeholder="1 500 $"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goods-insurance-details">Détails d'assurance</Label>
                  <Input
                    id="goods-insurance-details"
                    value={newGoods.insuranceDetails}
                    onChange={(e) => setNewGoods({ ...newGoods, insuranceDetails: e.target.value })}
                    placeholder="Numéro de police, couverture"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goods-storage-notes">Notes d'entreposage</Label>
                <Textarea
                  id="goods-storage-notes"
                  value={newGoods.storageNotes}
                  onChange={(e) => setNewGoods({ ...newGoods, storageNotes: e.target.value })}
                  placeholder="Instructions spéciales, conditions d'entreposage"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goods-insured"
                  checked={newGoods.isInsured}
                  onCheckedChange={(checked) => 
                    setNewGoods({ ...newGoods, isInsured: checked as boolean })
                  }
                />
                <Label htmlFor="goods-insured">Biens assurés</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoodsForm(false);
                    setEditingGoodsIndex(null);
                    setNewGoods({
                      name: '',
                      category: 'furniture',
                      location: '',
                      description: '',
                      estimatedValue: '',
                      condition: 'good',
                      isInsured: false,
                      insuranceDetails: '',
                      storageNotes: ''
                    });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingGoodsIndex !== null ? handleUpdateGoods : handleAddGoods}
                  disabled={!newGoods.name || !newGoods.category || !newGoods.location}
                >
                  {editingGoodsIndex !== null ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des biens entreposés */}
        <div className="space-y-4">
          {data.storedGoods.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun bien entreposé enregistré</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter vos biens entreposés
                </p>
                <Button onClick={() => setShowGoodsForm(true)}>
                  Ajouter vos premiers biens
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {data.storedGoods.map((goods, index) => (
                <Card key={goods.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-lg">{goods.name}</h4>
                          <Badge className={getGoodsCategoryColor(goods.category)}>
                            {goodsCategories.find(c => c.value === goods.category)?.label}
                          </Badge>
                          <Badge className={getConditionColor(goods.condition)}>
                            {conditionOptions.find(c => c.value === goods.condition)?.label}
                          </Badge>
                          {goods.isInsured && (
                            <Badge variant="secondary">Assuré</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{goods.location}</span>
                        </div>
                        
                        {goods.description && (
                          <p className="text-muted-foreground">{goods.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {goods.estimatedValue && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Valeur :</strong> {goods.estimatedValue}</span>
                            </div>
                          )}
                          
                          {goods.insuranceDetails && (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span><strong>Assurance :</strong> {goods.insuranceDetails}</span>
                            </div>
                          )}
                        </div>
                        
                        {goods.storageNotes && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes :</strong> {goods.storageNotes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGoods(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoods(index)}
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
    </div>
  );
};
