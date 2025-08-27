import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Music, Flower, DollarSign, Church, Users } from 'lucide-react';
import { VolontesFuneraires } from '../../types/succession-planning';

interface FuneraillesFormProps {
  volontes: VolontesFuneraires;
  onUpdate: (volontes: VolontesFuneraires) => void;
}

const typesFunerailles = [
  { value: 'inhumation', label: 'Inhumation (enterrement)', icon: MapPin },
  { value: 'cremation', label: 'Crémation', icon: Heart },
  { value: 'don_corps', label: 'Don du corps à la science', icon: Heart }
];

const typesServices = [
  { value: 'prive', label: 'Service privé (famille proche)' },
  { value: 'public', label: 'Service public (ouvert à tous)' },
  { value: 'memorial', label: 'Service commémoratif (sans dépouille)' }
];

export const FuneraillesForm: React.FC<FuneraillesFormProps> = ({ volontes, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<VolontesFuneraires>(volontes);

  const handleSubmit = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(volontes);
    setIsEditing(false);
  };

  const handleChange = (field: keyof VolontesFuneraires, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Souhaits funéraires</h3>
          <p className="text-sm text-muted-foreground">
            Vos volontés concernant vos funérailles et arrangements finaux
          </p>
        </div>
        <Button 
          onClick={() => setIsEditing(true)} 
          className="flex items-center space-x-2"
          disabled={isEditing}
        >
          <Heart className="h-4 w-4" />
          <span>Modifier mes souhaits</span>
        </Button>
      </div>

      {/* Formulaire d'édition */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Modifier vos souhaits funéraires</CardTitle>
            <CardDescription>
              Exprimez vos volontés pour aider vos proches dans ces moments difficiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de funérailles */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Type de funérailles souhaité</Label>
              <div className="grid grid-cols-1 gap-3">
                {typesFunerailles.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.value} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={type.value}
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor={type.value} className="flex items-center space-x-2 cursor-pointer">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <span>{type.label}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lieu */}
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu souhaité</Label>
              <Input
                id="lieu"
                value={formData.lieu || ''}
                onChange={(e) => handleChange('lieu', e.target.value)}
                placeholder="Ex: Église Sainte-Marie, Salon funéraire Dupuis..."
              />
            </div>

            {/* Salon funéraire et cimetière */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salonFuneraire">Salon funéraire préféré</Label>
                <Input
                  id="salonFuneraire"
                  value={formData.salonFuneraire || ''}
                  onChange={(e) => handleChange('salonFuneraire', e.target.value)}
                  placeholder="Nom du salon funéraire"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cimetiere">Cimetière souhaité</Label>
                <Input
                  id="cimetiere"
                  value={formData.cimetiere || ''}
                  onChange={(e) => handleChange('cimetiere', e.target.value)}
                  placeholder="Nom du cimetière"
                />
              </div>
            </div>

            {/* Cérémonie religieuse */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ceremonieReligieuse"
                checked={formData.ceremonieReligieuse}
                onCheckedChange={(checked) => handleChange('ceremonieReligieuse', checked)}
              />
              <Label htmlFor="ceremonieReligieuse" className="flex items-center space-x-2">
                <Church className="h-4 w-4" />
                <span>Je souhaite une cérémonie religieuse</span>
              </Label>
            </div>

            {/* Type de service */}
            <div className="space-y-2">
              <Label htmlFor="typeService">Type de service</Label>
              <Select
                value={formData.typeService}
                onValueChange={(value: any) => handleChange('typeService', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typesServices.map(service => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget estimé */}
            <div className="space-y-2">
              <Label htmlFor="budgetEstime">Budget estimé ($)</Label>
              <Input
                id="budgetEstime"
                type="number"
                min="0"
                value={formData.budgetEstime || ''}
                onChange={(e) => handleChange('budgetEstime', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Ex: 8000"
              />
            </div>

            {/* Préférences spéciales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="musique">Musique souhaitée</Label>
                <Input
                  id="musique"
                  value={formData.musique || ''}
                  onChange={(e) => handleChange('musique', e.target.value)}
                  placeholder="Ex: Ave Maria, Amazing Grace..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fleurs">Préférences pour les fleurs</Label>
                <Input
                  id="fleurs"
                  value={formData.fleurs || ''}
                  onChange={(e) => handleChange('fleurs', e.target.value)}
                  placeholder="Ex: Roses blanches, pas de fleurs..."
                />
              </div>
            </div>

            {/* Dons en lieu de fleurs */}
            <div className="space-y-2">
              <Label htmlFor="dons_lieu_fleurs">Dons suggérés en lieu de fleurs</Label>
              <Input
                id="dons_lieu_fleurs"
                value={formData.dons_lieu_fleurs || ''}
                onChange={(e) => handleChange('dons_lieu_fleurs', e.target.value)}
                placeholder="Ex: Fondation du cœur, Société canadienne du cancer..."
              />
            </div>

            {/* Volontés spéciales */}
            <div className="space-y-2">
              <Label htmlFor="volontesSpeciales">Volontés spéciales et instructions</Label>
              <Textarea
                id="volontesSpeciales"
                value={formData.volontesSpeciales || ''}
                onChange={(e) => handleChange('volontesSpeciales', e.target.value)}
                placeholder="Décrivez vos souhaits particuliers, lectures, personnes à contacter, objets à inclure..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                Sauvegarder mes souhaits
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Affichage des volontés */
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <h4 className="text-lg font-semibold">Mes souhaits funéraires</h4>
                <Badge className="bg-blue-100 text-blue-800">
                  {typesFunerailles.find(t => t.value === volontes.type)?.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {volontes.lieu && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Lieu :</strong> {volontes.lieu}</span>
                    </div>
                  )}
                  
                  {volontes.salonFuneraire && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Salon funéraire :</strong> {volontes.salonFuneraire}</span>
                    </div>
                  )}
                  
                  {volontes.cimetiere && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Cimetière :</strong> {volontes.cimetiere}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Church className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Cérémonie religieuse :</strong> {volontes.ceremonieReligieuse ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Type de service :</strong> {typesServices.find(s => s.value === volontes.typeService)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {volontes.budgetEstime && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Budget estimé :</strong> {volontes.budgetEstime.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </span>
                    </div>
                  )}
                  
                  {volontes.musique && (
                    <div className="flex items-center space-x-2">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Musique :</strong> {volontes.musique}</span>
                    </div>
                  )}
                  
                  {volontes.fleurs && (
                    <div className="flex items-center space-x-2">
                      <Flower className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Fleurs :</strong> {volontes.fleurs}</span>
                    </div>
                  )}
                  
                  {volontes.dons_lieu_fleurs && (
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Dons suggérés :</strong> {volontes.dons_lieu_fleurs}</span>
                    </div>
                  )}
                </div>
              </div>

              {volontes.volontesSpeciales && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <h5 className="font-semibold text-blue-900 mb-2">Volontés spéciales :</h5>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">{volontes.volontesSpeciales}</p>
                </div>
              )}

              {!volontes.lieu && !volontes.salonFuneraire && !volontes.volontesSpeciales && (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun souhait funéraire spécifique n'a été exprimé.</p>
                  <p className="text-sm mt-2">Cliquez sur "Modifier mes souhaits" pour ajouter vos préférences.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils et informations */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Pourquoi exprimer ses souhaits ?</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Soulager vos proches :</strong> Éviter les décisions difficiles dans un moment de deuil</li>
            <li>• <strong>Respecter vos valeurs :</strong> Assurer que vos convictions soient honorées</li>
            <li>• <strong>Contrôler les coûts :</strong> Éviter les dépenses excessives ou non souhaitées</li>
            <li>• <strong>Personnaliser la cérémonie :</strong> Refléter votre personnalité et vos goûts</li>
            <li>• <strong>Faciliter l'organisation :</strong> Donner des directives claires à votre famille</li>
          </ul>
        </CardContent>
      </Card>

      {/* Informations légales */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">À retenir</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800">
          <ul className="space-y-2 text-sm">
            <li>• Ces souhaits n'ont pas force de loi, mais ils guident vos proches</li>
            <li>• Pour des arrangements contraignants, consultez un notaire</li>
            <li>• Informez votre famille de vos souhaits de votre vivant</li>
            <li>• Considérez les préarrangements funéraires pour garantir vos volontés</li>
            <li>• Mettez à jour vos souhaits si vos préférences changent</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
