// Onglet des contacts d'urgence
// Respectant la typographie québécoise (espaces avant : et $, pas avant ; ! ?)

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, User, Mail, Link as LinkIcon, AlertTriangle, Info } from 'lucide-react';
import { EmergencyContact } from '../../types/emergency-info';

interface EmergencyContactsTabProps {
  data: EmergencyContact[];
  onUpdate: (contacts: EmergencyContact[]) => void;
}

export const EmergencyContactsTab: React.FC<EmergencyContactsTabProps> = ({ data, onUpdate }) => {
  // Mettre à jour un contact spécifique
  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...data];
    newContacts[index] = { ...newContacts[index], [field]: value };
    onUpdate(newContacts);
  };

  // Ajouter un nouveau contact
  const addContact = () => {
    if (data.length < 5) { // Limite à 5 contacts pour la version gratuite
      const newContact: EmergencyContact = {
        nom: '',
        telephone: '',
        adresseCourriel: '',
        lien: ''
      };
      onUpdate([...data, newContact]);
    }
  };

  // Supprimer un contact
  const removeContact = (index: number) => {
    if (data.length > 1) {
      const newContacts = data.filter((_, i) => i !== index);
      onUpdate(newContacts);
    }
  };

  // Vérifier si un contact est complet
  const isContactComplete = (contact: EmergencyContact) => {
    return contact.nom.trim() !== '' && contact.telephone.trim() !== '';
  };

  // Compter les contacts complets
  const contactsCompletes = data.filter(isContactComplete).length;

  return (
    <div className="space-y-6">
      {/* En-tête de l'onglet */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Phone className="w-5 h-5" />
            Contacts d'urgence - à consulter en premier
          </CardTitle>
          <CardDescription className="text-red-700">
            Ces contacts seront les premiers à être appelés en cas d'urgence, d'accident ou d'incapacité.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Note importante */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Important :</strong> Assurez-vous que ces personnes savent qu'elles sont vos contacts d'urgence 
          et qu'elles ont accès à ce document en cas de besoin.
        </AlertDescription>
      </Alert>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression des contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{contactsCompletes}</div>
              <div className="text-sm text-blue-600">Contacts complets</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.length}</div>
              <div className="text-sm text-green-600">Contacts totaux</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.length > 0 ? Math.round((contactsCompletes / data.length) * 100) : 0}
              </div>
              <div className="text-sm text-purple-600">% complétés</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(0, 3 - contactsCompletes)}
              </div>
              <div className="text-sm text-orange-600">À compléter</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des contacts */}
      <div className="space-y-4">
        {data.map((contact, index) => (
          <Card key={index} className={`border-2 ${isContactComplete(contact) ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Contact d'urgence {index + 1}
                  {isContactComplete(contact) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Complet
                    </Badge>
                  )}
                </CardTitle>
                {data.length > 1 && (
                  <button
                    onClick={() => removeContact(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor={`nom-${index}`} className="text-sm font-medium">
                    Nom complet *
                  </Label>
                  <Input
                    id={`nom-${index}`}
                    value={contact.nom}
                    onChange={(e) => updateContact(index, 'nom', e.target.value)}
                    placeholder="Ex : Jean Tremblay"
                    className={contact.nom.trim() === '' ? 'border-red-300' : ''}
                  />
                  {contact.nom.trim() === '' && (
                    <p className="text-red-600 text-xs">Le nom est obligatoire</p>
                  )}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor={`telephone-${index}`} className="text-sm font-medium">
                    Téléphone *
                  </Label>
                  <Input
                    id={`telephone-${index}`}
                    value={contact.telephone}
                    onChange={(e) => updateContact(index, 'telephone', e.target.value)}
                    placeholder="Ex : 514 555-0123"
                    className={contact.telephone.trim() === '' ? 'border-red-300' : ''}
                  />
                  {contact.telephone.trim() === '' && (
                    <p className="text-red-600 text-xs">Le téléphone est obligatoire</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Adresse courriel */}
                <div className="space-y-2">
                  <Label htmlFor={`courriel-${index}`} className="text-sm font-medium">
                    Adresse courriel
                  </Label>
                  <Input
                    id={`courriel-${index}`}
                    type="email"
                    value={contact.adresseCourriel}
                    onChange={(e) => updateContact(index, 'adresseCourriel', e.target.value)}
                    placeholder="Ex : jean.tremblay@email.com"
                  />
                </div>

                {/* Lien de parenté */}
                <div className="space-y-2">
                  <Label htmlFor={`lien-${index}`} className="text-sm font-medium">
                    Lien de parenté
                  </Label>
                  <Input
                    id={`lien-${index}`}
                    value={contact.lien}
                    onChange={(e) => updateContact(index, 'lien', e.target.value)}
                    placeholder="Ex : Conjoint, Enfant, Ami"
                  />
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="space-y-2">
                <Label htmlFor={`notes-${index}`} className="text-sm font-medium">
                  Notes ou instructions spéciales
                </Label>
                <Textarea
                  id={`notes-${index}`}
                  value={contact.relation || ''}
                  onChange={(e) => updateContact(index, 'relation', e.target.value)}
                  placeholder="Ex : Disponible 24 h/24, Médecin de famille, Avocat..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bouton d'ajout */}
      {data.length < 5 && (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <button
              onClick={addContact}
              className="w-full p-4 text-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Ajouter un contact d'urgence</span>
            </button>
          </CardContent>
        </Card>
      )}

      {/* Limite de la version gratuite */}
      {data.length >= 5 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Limite de la version gratuite :</strong> Vous avez atteint le maximum de 5 contacts d'urgence. 
            Passez au plan Professionnel pour ajouter plus de contacts et accéder à toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      )}

      {/* Conseils d'utilisation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Conseils pour vos contacts d'urgence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-800">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Choisissez des personnes de confiance</strong> qui peuvent prendre des décisions importantes en votre nom
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Assurez-vous qu'elles sont disponibles</strong> et peuvent être jointes rapidement
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Informez-les de leur rôle</strong> et donnez-leur accès à ce document
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Mettez à jour régulièrement</strong> leurs coordonnées et informations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
