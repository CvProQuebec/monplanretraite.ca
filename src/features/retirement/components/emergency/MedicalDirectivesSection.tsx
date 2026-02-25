// Composant pour les directives médicales anticipées détaillées
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  AlertTriangle, 
  Info, 
  Shield,
  User,
  FileText,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface MedicalDirectives {
  // Situations d'urgence critique
  reanimationCardiaque: 'oui' | 'non' | 'famille' | 'non_specifie';
  ventilationArtificielle: 'oui' | 'non' | 'famille' | 'non_specifie';
  defibrillation: 'oui' | 'non' | 'famille' | 'non_specifie';
  
  // Traitements médicaux
  antibiotiquesIV: 'oui' | 'non' | 'famille' | 'non_specifie';
  transfusions: 'oui' | 'non' | 'famille' | 'non_specifie';
  chimiotherapie: 'oui' | 'non' | 'famille' | 'non_specifie';
  dialyse: 'oui' | 'non' | 'famille' | 'non_specifie';
  
  // Alimentation et hydratation
  sondeGastrique: 'oui' | 'non' | 'famille' | 'non_specifie';
  hydratationIV: 'oui' | 'non' | 'famille' | 'non_specifie';
  nutritionParentale: 'oui' | 'non' | 'famille' | 'non_specifie';
  
  // Soins de fin de vie
  soinsPalliatifs: 'oui' | 'non' | 'famille' | 'non_specifie';
  sedation: 'oui' | 'non' | 'famille' | 'non_specifie';
  preferenceLieu: 'domicile' | 'hopital' | 'centre_soins' | 'non_specifie';
  
  // Situations neurologiques
  ventilationProlongee: 'oui' | 'non' | 'famille' | 'non_specifie';
  tracheotomie: 'oui' | 'non' | 'famille' | 'non_specifie';
  
  // Don d'organes et tissus
  donOrganes: 'oui' | 'non' | 'famille' | 'non_specifie';
  prochesAvertis: 'oui' | 'non' | 'a_faire' | 'non_specifie';
  permisConduireCoche: 'oui' | 'non' | 'a_verifier' | 'non_specifie';
  organesSpecifiques: 'tous' | 'certains' | 'aucun' | 'non_specifie';
  tissus: 'oui' | 'non' | 'certains' | 'non_specifie';
  conditionsDon: 'mort_cerebrale' | 'arret_cardiaque' | 'les_deux' | 'non_specifie';
  restrictionsOrganes: string;
  contactDon: string;
}

interface MedicalDirectivesSectionProps {
  directives: MedicalDirectives;
  consultationSiConscient: boolean;
  personneConfiancePrincipale: string;
  personneConfianceSecondaire: string;
  aideMedicaleAMourir: 'oui' | 'non' | 'a_discuter' | 'non_specifie';
  autresDocumentsIntentions: string;
  mandatInaptitude: {
    possede: boolean;
    disponible: boolean;
    emplacement: string;
  };
  commentairesDirectives: string;
  onUpdate: (field: string, value: any) => void;
}

export const MedicalDirectivesSection: React.FC<MedicalDirectivesSectionProps> = ({
  directives,
  consultationSiConscient,
  personneConfiancePrincipale,
  personneConfianceSecondaire,
  aideMedicaleAMourir,
  autresDocumentsIntentions,
  mandatInaptitude,
  commentairesDirectives,
  onUpdate
}) => {
  
  const updateDirective = (field: keyof MedicalDirectives, value: any) => {
    onUpdate('directivesMedicalesAnticipees', { ...directives, [field]: value });
  };

  const renderChoiceGroup = (
    field: keyof MedicalDirectives,
    label: string,
    description?: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">
        {label}
        {description && (
          <span className="text-xs text-gray-600 font-normal block mt-1">
            {description}
          </span>
        )}
      </Label>
      <div className="flex flex-wrap gap-3">
        {[
          { value: 'oui', label: 'Oui', color: 'bg-green-100 text-green-800 border-green-300' },
          { value: 'non', label: 'Non', color: 'bg-red-100 text-red-800 border-red-300' },
          { value: 'famille', label: 'À discuter avec ma famille', color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border' },
          { value: 'non_specifie', label: 'Non spécifié', color: 'bg-gray-100 text-gray-800 border-gray-300' }
        ].map((choice) => (
          <button
            key={choice.value}
            onClick={() => updateDirective(field, choice.value)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              directives[field] === choice.value
                ? choice.color
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête des directives médicales */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Heart className="w-5 h-5" />
            Directives médicales anticipées
          </CardTitle>
          <CardDescription className="text-purple-700">
            Précisez vos souhaits médicaux à l'avance pour que vos choix soient respectés, même si vous ne pouvez plus parler.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Note importante */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Important :</strong> Ces directives sont des documents légaux qui guident les médecins et protègent vos souhaits. 
          Discutez-en avec votre famille et votre médecin traitant.
        </AlertDescription>
      </Alert>

      {/* Situations d'urgence critique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-900">
            🚨 Situations d'urgence critique
          </CardTitle>
          <CardDescription>
            Ces décisions peuvent sauver votre vie ou affecter votre qualité de vie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderChoiceGroup('reanimationCardiaque', 'Réanimation cardiaque', 'En cas d\'arrêt cardiaque')}
          {renderChoiceGroup('ventilationArtificielle', 'Ventilation artificielle', 'En cas de détresse respiratoire')}
          {renderChoiceGroup('defibrillation', 'Défibrillation', 'Choc électrique en cas d\'arrêt cardiaque')}
        </CardContent>
      </Card>

      {/* Traitements médicaux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-mpr-navy">
            💊 Traitements médicaux
          </CardTitle>
          <CardDescription>
            Votre consentement pour différents types de traitements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderChoiceGroup('antibiotiquesIV', 'Antibiotiques par voie intraveineuse')}
          {renderChoiceGroup('transfusions', 'Transfusions sanguines')}
          {renderChoiceGroup('chimiotherapie', 'Chimiothérapie')}
          {renderChoiceGroup('dialyse', 'Dialyse rénale')}
        </CardContent>
      </Card>

      {/* Alimentation et hydratation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-900">
            🥤 Alimentation et hydratation
          </CardTitle>
          <CardDescription>
            Si vous ne pouvez plus manger ou boire normalement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderChoiceGroup('sondeGastrique', 'Sonde gastrique', 'Nourriture par tube dans l\'estomac')}
          {renderChoiceGroup('hydratationIV', 'Hydratation par perfusion')}
          {renderChoiceGroup('nutritionParentale', 'Nutrition par voie veineuse')}
        </CardContent>
      </Card>

      {/* Soins de fin de vie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-purple-900">
            🕊️ Soins de fin de vie
          </CardTitle>
          <CardDescription>
            Vos préférences pour vos derniers moments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderChoiceGroup('soinsPalliatifs', 'Soins palliatifs', 'Soins de confort en fin de vie')}
          {renderChoiceGroup('sedation', 'Sédation pour soulager la douleur')}
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Préférence de lieu pour les soins
            </Label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'domicile', label: 'À domicile', color: 'bg-green-100 text-green-800 border-green-300' },
                { value: 'hopital', label: 'À l\'hôpital', color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border' },
                { value: 'centre_soins', label: 'Centre de soins', color: 'bg-purple-100 text-purple-800 border-purple-300' },
                { value: 'non_specifie', label: 'Non spécifié', color: 'bg-gray-100 text-gray-800 border-gray-300' }
              ].map((choice) => (
                <button
                  key={choice.value}
                  onClick={() => updateDirective('preferenceLieu', choice.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    directives.preferenceLieu === choice.value
                      ? choice.color
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Situations neurologiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-mpr-navy">
            🧠 Situations neurologiques
          </CardTitle>
          <CardDescription>
            Si vous êtes dans le coma ou inconscient
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderChoiceGroup('ventilationProlongee', 'Ventilation artificielle prolongée', 'Si vous êtes dans le coma')}
          {renderChoiceGroup('tracheotomie', 'Trachéotomie', 'Ouverture dans la trachée pour la ventilation')}
        </CardContent>
      </Card>

      {/* Don d'organes et tissus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-900">
            🫀 Don d'organes et tissus
          </CardTitle>
          <CardDescription>
            Votre consentement pour le don d'organes après votre décès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderChoiceGroup('donOrganes', 'Consentement au don d\'organes', 'Après votre décès')}
          
          {directives.donOrganes === 'oui' && (
            <>
              {renderChoiceGroup('prochesAvertis', 'Avez-vous avisé vos proches ?', 'De votre décision de donner vos organes')}
              {renderChoiceGroup('permisConduireCoche', 'Case cochée sur le permis de conduire', 'Don d\'organes activé')}
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Organes spécifiques
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'tous', label: 'Tous les organes', color: 'bg-green-100 text-green-800 border-green-300' },
                    { value: 'certains', label: 'Certains seulement', color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border' },
                    { value: 'aucun', label: 'Aucun', color: 'bg-red-100 text-red-800 border-red-300' },
                    { value: 'non_specifie', label: 'Non spécifié', color: 'bg-gray-100 text-gray-800 border-gray-300' }
                  ].map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => updateDirective('organesSpecifiques', choice.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        directives.organesSpecifiques === choice.value
                          ? choice.color
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Tissus (cornées, peau, os, etc.)
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'oui', label: 'Tous les tissus', color: 'bg-green-100 text-green-800 border-green-300' },
                    { value: 'certains', label: 'Certains tissus', color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border' },
                    { value: 'non', label: 'Aucun tissu', color: 'bg-red-100 text-red-800 border-red-300' },
                    { value: 'non_specifie', label: 'Non spécifié', color: 'bg-gray-100 text-gray-800 border-gray-300' }
                  ].map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => updateDirective('tissus', choice.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        directives.tissus === choice.value
                          ? choice.color
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Conditions du don
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'mort_cerebrale', label: 'Mort cérébrale seulement', color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border' },
                    { value: 'arret_cardiaque', label: 'Arrêt cardiaque aussi', color: 'bg-green-100 text-green-800 border-green-300' },
                    { value: 'les_deux', label: 'Les deux conditions', color: 'bg-purple-100 text-purple-800 border-purple-300' },
                    { value: 'non_specifie', label: 'Non spécifié', color: 'bg-gray-100 text-gray-800 border-gray-300' }
                  ].map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => updateDirective('conditionsDon', choice.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        directives.conditionsDon === choice.value
                          ? choice.color
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Restrictions ou organes refusés
                </Label>
                <Textarea
                  value={directives.restrictionsOrganes || ''}
                  onChange={(e) => updateDirective('restrictionsOrganes', e.target.value)}
                  placeholder="Ex : Je refuse de donner mon cœur, mes yeux, etc."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Personne de contact pour le don
                </Label>
                <Input
                  value={directives.contactDon || ''}
                  onChange={(e) => updateDirective('contactDon', e.target.value)}
                  placeholder="Ex : Marie - ma fille, pour confirmer le don"
                  className="bg-white"
                />
              </div>
            </>
          )}

          {directives.donOrganes === 'non' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Important :</strong> Si vous refusez le don d'organes, assurez-vous que vos proches connaissent votre décision 
                et respectent votre choix. Cette décision peut être modifiée à tout moment.
              </p>
            </div>
          )}

          {directives.donOrganes === 'famille' && (
            <div className="p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
              <p className="text-sm text-mpr-navy">
                <strong>À discuter :</strong> Parlez de votre décision avec votre famille. Le don d'organes peut sauver des vies 
                et donner un sens à votre départ. Considérez les implications éthiques et médicales.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultation et validation */}
      <Card className="border-mpr-border bg-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="text-mpr-navy">
            👥 Consultation et validation
          </CardTitle>
          <CardDescription>
            Vos préférences pour la prise de décisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consultation-conscient"
                checked={consultationSiConscient}
                onCheckedChange={(checked) => onUpdate('consultationSiConscient', checked)}
              />
              <Label htmlFor="consultation-conscient" className="text-mpr-navy">
                Si je suis conscient, veuillez me consulter pour validation ou approbation
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-mpr-navy">
                Personne de confiance principale
              </Label>
              <Input
                value={personneConfiancePrincipale}
                onChange={(e) => onUpdate('personneConfiancePrincipale', e.target.value)}
                placeholder="Ex : Marie - ma fille"
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-mpr-navy">
                Personne de confiance secondaire
              </Label>
              <Input
                value={personneConfianceSecondaire}
                onChange={(e) => onUpdate('personneConfianceSecondaire', e.target.value)}
                placeholder="Ex : Jean - mon fils"
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents légaux québécois */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">
            📋 Documents légaux québécois
          </CardTitle>
          <CardDescription>
            Vérification de vos documents légaux
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-green-900">
              Aide médicale à mourir
            </Label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'oui', label: 'J\'ai entamé des procédures', color: 'bg-green-100 text-green-800 border-green-300' },
                { value: 'non', label: 'Je n\'ai pas entamé de procédures', color: 'bg-red-100 text-red-800 border-red-300' },
                { value: 'a_discuter', label: 'À discuter avec ma famille', color: 'bg-mpr-interactive-lt text-mpr-navy border-mpr-border' },
                { value: 'non_specifie', label: 'Non spécifié', color: 'bg-gray-100 text-gray-800 border-gray-300' }
              ].map((choice) => (
                <button
                  key={choice.value}
                  onClick={() => onUpdate('aideMedicaleAMourir', choice.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    aideMedicaleAMourir === choice.value
                      ? choice.color
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-green-900">
              Autres documents d'intentions
            </Label>
            <Textarea
              value={autresDocumentsIntentions}
              onChange={(e) => onUpdate('autresDocumentsIntentions', e.target.value)}
              placeholder="Décrivez vos autres préparatifs ou documents..."
              rows={3}
              className="bg-white resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-green-900">
                Mandat en cas d'inaptitude
              </Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandat-possede"
                    checked={mandatInaptitude.possede}
                    onCheckedChange={(checked) => onUpdate('mandatInaptitude', { ...mandatInaptitude, possede: checked })}
                  />
                  <Label htmlFor="mandat-possede" className="text-green-900">
                    J'en possède un
                  </Label>
                </div>

                {mandatInaptitude.possede && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mandat-disponible"
                        checked={mandatInaptitude.disponible}
                        onCheckedChange={(checked) => onUpdate('mandatInaptitude', { ...mandatInaptitude, disponible: checked })}
                      />
                      <Label htmlFor="mandat-disponible" className="text-green-900">
                        Il est disponible au besoin
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-green-900">
                        Où est-il conservé ?
                      </Label>
                      <Input
                        value={mandatInaptitude.emplacement}
                        onChange={(e) => onUpdate('mandatInaptitude', { ...mandatInaptitude, emplacement: e.target.value })}
                        placeholder="Ex : Notaire, Domicile, Banque, etc."
                        className="bg-white"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commentaires et précisions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            💭 Commentaires et précisions
          </CardTitle>
          <CardDescription>
            Ajoutez des informations importantes ou des situations particulières
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Précisions importantes
            </Label>
            <Textarea
              value={commentairesDirectives}
              onChange={(e) => onUpdate('commentairesDirectives', e.target.value)}
              placeholder="Ex : Situations particulières, préférences spécifiques, informations importantes pour les médecins..."
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conseils d'utilisation */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-900">
            💡 Conseils pour vos directives médicales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-purple-800">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Discutez avec votre famille</strong> de vos choix pour qu'ils comprennent vos souhaits
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Consultez votre médecin</strong> pour comprendre les implications de chaque choix
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Mettez à jour régulièrement</strong> vos directives selon l'évolution de votre santé
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Partagez ce document</strong> avec vos proches et votre médecin traitant
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
