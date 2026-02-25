// Composant pour l'impression et la signature des directives médicales anticipées
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Printer, 
  Download, 
  FileText, 
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Heart,
  Info
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface MedicalDirectivesPrintProps {
  directives: any;
  consultationSiConscient: boolean;
  personneConfiancePrincipale: string;
  personneConfianceSecondaire: string;
  aideMedicaleAMourir: string;
  autresDocumentsIntentions: string;
  mandatInaptitude: any;
  commentairesDirectives: string;
  dateMiseAJour: string;
}

export const MedicalDirectivesPrint: React.FC<MedicalDirectivesPrintProps> = ({
  directives,
  consultationSiConscient,
  personneConfiancePrincipale,
  aideMedicaleAMourir,
  autresDocumentsIntentions,
  mandatInaptitude,
  commentairesDirectives,
  dateMiseAJour
}) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    // Ici on pourrait implémenter la génération PDF
    // Pour l'instant, on utilise l'impression
    handlePrint();
  };

  const formatChoice = (choice: string) => {
    switch (choice) {
      case 'oui': return '✅ Oui';
      case 'non': return '❌ Non';
      case 'famille': return '👥 À discuter avec ma famille';
      case 'non_specifie': return '❓ Non spécifié';
      default: return choice;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return new Date().toLocaleDateString('fr-CA');
    return new Date(dateString).toLocaleDateString('fr-CA');
  };

  return (
    <div className="space-y-6">
      {/* En-tête d'impression */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <FileText className="w-5 h-5" />
            {isEnglish ? 'Print & Sign Medical Directives' : 'Imprimer et signer les directives médicales'}
          </CardTitle>
          <CardDescription className="text-purple-700">
            {isEnglish 
              ? 'Generate a printable version of your medical directives for legal purposes'
              : 'Générez une version imprimable de vos directives médicales à des fins légales'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700">
              <Printer className="w-4 h-4 mr-2" />
              {isEnglish ? 'Print' : 'Imprimer'}
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {isEnglish ? 'Download PDF' : 'Télécharger PDF'}
            </Button>
          </div>
          
          <Alert className="border-mpr-border bg-mpr-interactive-lt">
            <Info className="h-4 w-4 text-mpr-interactive" />
            <AlertDescription className="text-mpr-navy">
              <strong>Conseil :</strong> {isEnglish 
                ? 'Print this document, sign it, and keep it with your important papers. Consider having it notarized for legal validity.'
                : 'Imprimez ce document, signez-le et conservez-le avec vos papiers importants. Considérez le faire notarier pour sa validité légale.'
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Version imprimable */}
      <div ref={printRef} className="bg-white p-8 space-y-6 print:p-0">
        {/* En-tête du document */}
        <div className="text-center border-b-2 border-gray-300 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEnglish ? 'Medical Directives' : 'Directives médicales anticipées'}
          </h1>
          <p className="text-lg text-gray-600">
            {isEnglish ? 'Advance Medical Directives' : 'Directives médicales anticipées'}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {isEnglish ? 'Document created on' : 'Document créé le'} : {formatDate(dateMiseAJour)}
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isEnglish ? 'Personal Information' : 'Informations personnelles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {isEnglish ? 'Full Name' : 'Nom complet'}
              </Label>
              <Input 
                placeholder={isEnglish ? 'Enter your full name' : 'Entrez votre nom complet'}
                className="mt-1 border-gray-300"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {isEnglish ? 'Date of Birth' : 'Date de naissance'}
              </Label>
              <Input 
                type="date"
                className="mt-1 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Directives médicales */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {isEnglish ? 'Medical Directives' : 'Directives médicales'}
          </h2>

          {/* Situations d'urgence critique */}
          <div>
            <h3 className="text-lg font-medium text-red-900 mb-3">
              🚨 {isEnglish ? 'Critical Emergency Situations' : 'Situations d\'urgence critique'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isEnglish ? 'Cardiac resuscitation' : 'Réanimation cardiaque'} :</span>
                <span className="font-medium">{formatChoice(directives?.reanimationCardiaque || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Artificial ventilation' : 'Ventilation artificielle'} :</span>
                <span className="font-medium">{formatChoice(directives?.ventilationArtificielle || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Defibrillation' : 'Défibrillation'} :</span>
                <span className="font-medium">{formatChoice(directives?.defibrillation || 'non_specifie')}</span>
              </div>
            </div>
          </div>

          {/* Traitements médicaux */}
          <div>
            <h3 className="text-lg font-medium text-mpr-navy mb-3">
              💊 {isEnglish ? 'Medical Treatments' : 'Traitements médicaux'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isEnglish ? 'IV antibiotics' : 'Antibiotiques IV'} :</span>
                <span className="font-medium">{formatChoice(directives?.antibiotiquesIV || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Blood transfusions' : 'Transfusions sanguines'} :</span>
                <span className="font-medium">{formatChoice(directives?.transfusions || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Chemotherapy' : 'Chimiothérapie'} :</span>
                <span className="font-medium">{formatChoice(directives?.chimiotherapie || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Dialysis' : 'Dialyse'} :</span>
                <span className="font-medium">{formatChoice(directives?.dialyse || 'non_specifie')}</span>
              </div>
            </div>
          </div>

          {/* Alimentation et hydratation */}
          <div>
            <h3 className="text-lg font-medium text-green-900 mb-3">
              🥤 {isEnglish ? 'Nutrition and Hydration' : 'Alimentation et hydratation'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isEnglish ? 'Gastric tube' : 'Sonde gastrique'} :</span>
                <span className="font-medium">{formatChoice(directives?.sondeGastrique || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'IV hydration' : 'Hydratation IV'} :</span>
                <span className="font-medium">{formatChoice(directives?.hydratationIV || 'non_specifie')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEnglish ? 'Parenteral nutrition' : 'Nutrition parentale'} :</span>
                <span className="font-medium">{formatChoice(directives?.nutritionParentale || 'non_specifie')}</span>
              </div>
            </div>
          </div>

                     {/* Soins de fin de vie */}
           <div>
             <h3 className="text-lg font-medium text-purple-900 mb-3">
               🕊️ {isEnglish ? 'End-of-Life Care' : 'Soins de fin de vie'}
             </h3>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span>{isEnglish ? 'Palliative care' : 'Soins palliatifs'} :</span>
                 <span className="font-medium">{formatChoice(directives?.soinsPalliatifs || 'non_specifie')}</span>
               </div>
               <div className="flex justify-between">
                 <span>{isEnglish ? 'Pain sedation' : 'Sédation pour douleur'} :</span>
                 <span className="font-medium">{formatChoice(directives?.sedation || 'non_specifie')}</span>
               </div>
               <div className="flex justify-between">
                 <span>{isEnglish ? 'Care location preference' : 'Préférence de lieu'} :</span>
                 <span className="font-medium">
                   {directives?.preferenceLieu === 'domicile' ? '🏠 À domicile' :
                    directives?.preferenceLieu === 'hopital' ? '🏥 À l\'hôpital' :
                    directives?.preferenceLieu === 'centre_soins' ? '🏥 Centre de soins' : '❓ Non spécifié'}
                 </span>
               </div>
             </div>
           </div>

           {/* Don d'organes et tissus */}
           <div>
             <h3 className="text-lg font-medium text-emerald-900 mb-3">
               🫀 {isEnglish ? 'Organ and Tissue Donation' : 'Don d\'organes et tissus'}
             </h3>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span>{isEnglish ? 'Organ donation consent' : 'Consentement au don d\'organes'} :</span>
                 <span className="font-medium">{formatChoice(directives?.donOrganes || 'non_specifie')}</span>
               </div>
               {directives?.donOrganes === 'oui' && (
                 <>
                   <div className="flex justify-between">
                     <span>{isEnglish ? 'Family notified' : 'Proches avertis'} :</span>
                     <span className="font-medium">{formatChoice(directives?.prochesAvertis || 'non_specifie')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{isEnglish ? 'Driver\'s license checked' : 'Permis de conduire coché'} :</span>
                     <span className="font-medium">{formatChoice(directives?.permisConduireCoche || 'non_specifie')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{isEnglish ? 'Specific organs' : 'Organes spécifiques'} :</span>
                     <span className="font-medium">
                       {directives?.organesSpecifiques === 'tous' ? '✅ Tous les organes' :
                        directives?.organesSpecifiques === 'certains' ? '🔵 Certains seulement' :
                        directives?.organesSpecifiques === 'aucun' ? '❌ Aucun' : '❓ Non spécifié'}
                     </span>
                   </div>
                   <div className="flex justify-between">
                     <span>{isEnglish ? 'Tissues' : 'Tissus'} :</span>
                     <span className="font-medium">{formatChoice(directives?.tissus || 'non_specifie')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{isEnglish ? 'Donation conditions' : 'Conditions du don'} :</span>
                     <span className="font-medium">
                       {directives?.conditionsDon === 'mort_cerebrale' ? '🧠 Mort cérébrale seulement' :
                        directives?.conditionsDon === 'arret_cardiaque' ? '💓 Arrêt cardiaque aussi' :
                        directives?.conditionsDon === 'les_deux' ? '🔄 Les deux conditions' : '❓ Non spécifié'}
                     </span>
                   </div>
                   {directives?.restrictionsOrganes && (
                     <div className="flex justify-between">
                       <span>{isEnglish ? 'Restrictions' : 'Restrictions'} :</span>
                       <span className="font-medium text-xs">{directives.restrictionsOrganes}</span>
                     </div>
                   )}
                   {directives?.contactDon && (
                     <div className="flex justify-between">
                       <span>{isEnglish ? 'Contact person' : 'Personne de contact'} :</span>
                       <span className="font-medium">{directives.contactDon}</span>
                     </div>
                   )}
                 </>
               )}
             </div>
           </div>
        </div>

        {/* Consultation et validation */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-mpr-navy mb-3">
            👥 {isEnglish ? 'Consultation and Validation' : 'Consultation et validation'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{isEnglish ? 'Consult me if conscious' : 'Me consulter si conscient'} :</span>
              <span className="font-medium">{consultationSiConscient ? '✅ Oui' : '❌ Non'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isEnglish ? 'Primary trusted person' : 'Personne de confiance principale'} :</span>
              <span className="font-medium">{personneConfiancePrincipale || 'Non spécifié'}</span>
            </div>
          </div>
        </div>

        {/* Documents légaux */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-green-900 mb-3">
            📋 {isEnglish ? 'Legal Documents' : 'Documents légaux'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{isEnglish ? 'Medical assistance in dying' : 'Aide médicale à mourir'} :</span>
              <span className="font-medium">
                {aideMedicaleAMourir === 'oui' ? '✅ Procédures entamées' :
                 aideMedicaleAMourir === 'non' ? '❌ Aucune procédure' :
                 aideMedicaleAMourir === 'a_discuter' ? '👥 À discuter' : '❓ Non spécifié'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{isEnglish ? 'Mandate in case of incapacity' : 'Mandat en cas d\'inaptitude'} :</span>
              <span className="font-medium">
                {mandatInaptitude?.possede ? '✅ Possédé' : '❌ Non possédé'}
              </span>
            </div>
            {mandatInaptitude?.possede && (
              <div className="flex justify-between">
                <span>{isEnglish ? 'Location' : 'Emplacement'} :</span>
                <span className="font-medium">{mandatInaptitude?.emplacement || 'Non spécifié'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Commentaires */}
        {commentairesDirectives && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              💭 {isEnglish ? 'Additional Comments' : 'Commentaires additionnels'}
            </h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {commentairesDirectives}
            </p>
          </div>
        )}

        {/* Espace pour signature */}
        <div className="border-t-2 border-gray-300 pt-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {isEnglish ? 'Signature' : 'Signature'}
              </Label>
              <div className="mt-2 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {isEnglish ? 'Sign here' : 'Signez ici'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {isEnglish ? 'Date' : 'Date'}
              </Label>
              <Input 
                type="date"
                className="mt-2 border-gray-300"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Témoins (optionnel) */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            👥 {isEnglish ? 'Witnesses (Optional)' : 'Témoins (Optionnel)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {isEnglish ? 'Witness 1' : 'Témoin 1'}
              </Label>
              <Input 
                placeholder={isEnglish ? 'Name and relationship' : 'Nom et relation'}
                className="mt-1 border-gray-300"
              />
              <div className="mt-2 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-500 text-xs">
                  {isEnglish ? 'Signature' : 'Signature'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                {isEnglish ? 'Witness 2' : 'Témoin 2'}
              </Label>
              <Input 
                placeholder={isEnglish ? 'Name and relationship' : 'Nom et relation'}
                className="mt-1 border-gray-300"
              />
              <div className="mt-2 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-500 text-xs">
                  {isEnglish ? 'Signature' : 'Signature'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="border-t-2 border-gray-300 pt-4 mt-8 text-center text-sm text-gray-500">
          <p>
            {isEnglish 
              ? 'This document should be kept with your important papers and shared with your family and healthcare providers.'
              : 'Ce document doit être conservé avec vos papiers importants et partagé avec votre famille et vos fournisseurs de soins.'
            }
          </p>
          <p className="mt-2">
            {isEnglish 
              ? 'Consider having this document notarized for legal validity.'
              : 'Considérez faire notarier ce document pour sa validité légale.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
