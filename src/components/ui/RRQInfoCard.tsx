import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X,
  FileText,
  Shield
} from 'lucide-react';

interface RRQInfoCardProps {
  isFrench: boolean;
  isVisible?: boolean;
  onClose?: () => void;
  showAsModal?: boolean;
}

const RRQInfoCard: React.FC<RRQInfoCardProps> = ({ 
  isFrench, 
  isVisible = true, 
  onClose,
  showAsModal = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const content = (
    <Card className={`${showAsModal ? 'fixed inset-4 z-50 max-w-4xl mx-auto my-8 overflow-y-auto' : ''} bg-gradient-to-br from-blue-900/95 to-indigo-900/95 border-2 border-blue-400 shadow-2xl backdrop-blur-sm`}>
      {showAsModal && (
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      <CardHeader className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-b border-blue-400">
        <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          {isFrench ? 'Demande de rente RRQ - Information importante' : 'QPP Pension Application - Important Information'}
        </CardTitle>
        <CardDescription className="text-blue-200 text-lg">
          {isFrench 
            ? 'Délais et procédures pour éviter toute carence dans vos prestations'
            : 'Deadlines and procedures to avoid any gaps in your benefits'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Résumé principal */}
        <Alert className="border-green-400 bg-green-900/20 text-green-200">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <AlertDescription className="text-base font-semibold">
            {isFrench 
              ? '📋 Vous pouvez demander votre rente du RRQ jusqu\'à 12 mois à l\'avance. Il est recommandé de faire la demande au moins 3 mois avant la date souhaitée.'
              : '📋 You can apply for your QPP pension up to 12 months in advance. It is recommended to apply at least 3 months before your desired date.'
            }
          </AlertDescription>
        </Alert>

        {/* Délais détaillés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Délai maximal */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h4 className="font-bold text-blue-300">
                  {isFrench ? 'Délai maximal' : 'Maximum Deadline'}
                </h4>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-2">12 mois</div>
              <p className="text-sm text-gray-300">
                {isFrench 
                  ? 'Vous ne pouvez pas présenter votre demande plus de 12 mois avant la date de premier paiement souhaitée.'
                  : 'You cannot submit your application more than 12 months before your desired first payment date.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Délai recommandé */}
          <Card className="bg-green-800/50 border-green-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h4 className="font-bold text-green-300">
                  {isFrench ? 'Délai recommandé' : 'Recommended Deadline'}
                </h4>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-2">3 mois</div>
              <p className="text-sm text-gray-300">
                {isFrench 
                  ? 'Retraite Québec suggère de soumettre votre demande au moins 3 mois avant le début du versement.'
                  : 'Retraite Québec suggests submitting your application at least 3 months before the start of payments.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Délai minimal */}
          <Card className="bg-orange-800/50 border-orange-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-orange-400" />
                <h4 className="font-bold text-orange-300">
                  {isFrench ? 'Délai minimal' : 'Minimum Deadline'}
                </h4>
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-2">90 jours</div>
              <p className="text-sm text-gray-300">
                {isFrench 
                  ? 'Le formulaire doit être reçu au moins 90 jours avant le premier jour du mois de votre retraite.'
                  : 'The form must be received at least 90 days before the first day of the month of your retirement.'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information critique */}
        <Alert className="border-red-400 bg-red-900/20 text-red-200">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <AlertDescription className="text-base">
            <strong>{isFrench ? 'Important :' : 'Important:'}</strong> {
              isFrench 
                ? 'Pour être admissible à la rente, vous devez avoir cessé d\'occuper tout emploi visé par un régime de retraite.'
                : 'To be eligible for the pension, you must have stopped working in any job covered by a pension plan.'
            }
          </AlertDescription>
        </Alert>

        {/* Section détaillée (expandable) */}
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900"
          >
            <Info className="w-4 h-4 mr-2" />
            {isFrench 
              ? (isExpanded ? 'Masquer les détails' : 'Voir plus de détails')
              : (isExpanded ? 'Hide details' : 'See more details')
            }
          </Button>

          {isExpanded && (
            <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
              <h4 className="text-lg font-bold text-blue-300 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {isFrench ? 'Détails importants' : 'Important Details'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-300 mb-2">
                    {isFrench ? 'Pourquoi 3 mois à l\'avance ?' : 'Why 3 months in advance?'}
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    <li>{isFrench ? 'Temps de traitement administratif' : 'Administrative processing time'}</li>
                    <li>{isFrench ? 'Vérification des documents' : 'Document verification'}</li>
                    <li>{isFrench ? 'Éviter les retards de paiement' : 'Avoid payment delays'}</li>
                    <li>{isFrench ? 'Assurer la continuité des revenus' : 'Ensure income continuity'}</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-300 mb-2">
                    {isFrench ? 'Conséquences d\'un retard' : 'Consequences of Delay'}
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    <li>{isFrench ? 'Interruption des prestations' : 'Benefit interruption'}</li>
                    <li>{isFrench ? 'Stress financier inutile' : 'Unnecessary financial stress'}</li>
                    <li>{isFrench ? 'Complications administratives' : 'Administrative complications'}</li>
                    <li>{isFrench ? 'Retard dans les premiers paiements' : 'Delay in first payments'}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-900/30 rounded-lg">
                <h5 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {isFrench ? 'Calendrier de planification suggéré' : 'Suggested Planning Timeline'}
                </h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>{isFrench ? '12 mois avant :' : '12 months before:'}</span>
                    <span>{isFrench ? 'Première éligibilité de demande' : 'First eligibility to apply'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? '6 mois avant :' : '6 months before:'}</span>
                    <span>{isFrench ? 'Période idéale pour commencer' : 'Ideal time to start'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? '3 mois avant :' : '3 months before:'}</span>
                    <span className="text-green-400 font-semibold">{isFrench ? 'Délai recommandé' : 'Recommended deadline'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? '90 jours avant :' : '90 days before:'}</span>
                    <span className="text-orange-400 font-semibold">{isFrench ? 'Délai minimal absolu' : 'Absolute minimum deadline'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions recommandées */}
        <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30">
          <CardContent className="p-4">
            <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {isFrench ? 'Actions recommandées' : 'Recommended Actions'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-green-300">{isFrench ? 'Avant la demande :' : 'Before applying:'}</strong>
                <ul className="list-disc list-inside mt-1 text-gray-300 space-y-1">
                  <li>{isFrench ? 'Rassembler tous les documents' : 'Gather all documents'}</li>
                  <li>{isFrench ? 'Confirmer la date de fin d\'emploi' : 'Confirm employment end date'}</li>
                  <li>{isFrench ? 'Calculer le montant estimé' : 'Calculate estimated amount'}</li>
                </ul>
              </div>
              <div>
                <strong className="text-blue-300">{isFrench ? 'Après la demande :' : 'After applying:'}</strong>
                <ul className="list-disc list-inside mt-1 text-gray-300 space-y-1">
                  <li>{isFrench ? 'Suivre le statut de la demande' : 'Track application status'}</li>
                  <li>{isFrench ? 'Répondre rapidement aux demandes' : 'Respond quickly to requests'}</li>
                  <li>{isFrench ? 'Planifier la transition financière' : 'Plan financial transition'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

  if (showAsModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};

export default RRQInfoCard;
