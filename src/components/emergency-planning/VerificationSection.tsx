import React from 'react';
import { CheckCircle, Calendar, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface VerificationSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const VerificationSection: React.FC<VerificationSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  // Calcul du pourcentage de complétion (champs essentiels)
  const computeCompletion = () => {
    const essentials: Array<{ id: string; ok: boolean; label: string }> = [
      // Personnel
      { id: 'prenom', ok: !!data.prenom, label: 'Prénom' },
      { id: 'nom', ok: !!data.nom, label: 'Nom' },
      { id: 'dateNaissance', ok: !!data.dateNaissance, label: 'Date de naissance' },
      { id: 'telephone', ok: !!data.telephone, label: 'Téléphone' },
      { id: 'adresse', ok: !!data.adresse, label: 'Adresse' },
      // Contact d’urgence
      { id: 'contactUrgenceNom', ok: !!data.contactUrgenceNom, label: 'Contact d’urgence — Nom' },
      { id: 'contactUrgenceTelephone', ok: !!data.contactUrgenceTelephone, label: 'Contact d’urgence — Téléphone' },
      // Médical de base
      { id: 'medecinFamilleNom', ok: !!data.medecinFamilleNom, label: 'Médecin de famille — Nom' },
      { id: 'medecinFamilleTelephone', ok: !!data.medecinFamilleTelephone, label: 'Médecin de famille — Téléphone' },
      // Finances (au moins un compte avec no + institution)
      { id: 'compteInstitution', ok: (data.comptesBancaires || []).some(c => !!c.institution), label: 'Institution bancaire (au moins une)' },
      { id: 'compteNumero', ok: (data.comptesBancaires || []).some(c => !!c.numeroCompte), label: 'Numéro de compte (au moins un)' },
      // Testament (si possédé, il faut l’emplacement)
      { id: 'testament', ok: !data.possedeTestament || !!data.lieuTestament, label: 'Emplacement du testament (si possédé)' }
    ];

    const total = essentials.length;
    const completed = essentials.filter(e => e.ok).length;
    const percentage = Math.round((completed / Math.max(1, total)) * 100);

    return { essentials, completed, total, percentage };
  };

  const completion = computeCompletion();

  const updateDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setData({...data, dateMAJ: today});
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseignée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const checklistItems = [
    {
      id: 'employer',
      task: t.emergencyPlanning.verification?.contactEmployer || 'Contacter l\'employeur',
      priority: 'high',
      description: t.emergencyPlanning.verification?.employerDesc || 'Aviser du décès et s\'informer des prestations'
    },
    {
      id: 'executor',
      task: t.emergencyPlanning.verification?.contactExecutor || 'Contacter l\'exécuteur testamentaire',
      priority: 'high',
      description: t.emergencyPlanning.verification?.executorDesc || 'Entamer le processus de succession'
    },
    {
      id: 'death-certificates',
      task: t.emergencyPlanning.verification?.deathCertificates || 'Obtenir des copies du certificat de décès',
      priority: 'high',
      description: t.emergencyPlanning.verification?.certificatesDesc || 'Nécessaire pour toutes les démarches (minimum 10 copies)'
    },
    {
      id: 'financial-institutions',
      task: t.emergencyPlanning.verification?.contactBanks || 'Contacter les institutions financières',
      priority: 'high',
      description: t.emergencyPlanning.verification?.banksDesc || 'Bloquer les comptes et s\'informer des procédures'
    },
    {
      id: 'insurance',
      task: t.emergencyPlanning.verification?.contactInsurance || 'Aviser les compagnies d\'assurance',
      priority: 'medium',
      description: t.emergencyPlanning.verification?.insuranceDesc || 'Vie, habitation, automobile, santé'
    },
    {
      id: 'subscriptions',
      task: t.emergencyPlanning.verification?.cancelSubscriptions || 'Annuler les abonnements et services',
      priority: 'medium',
      description: t.emergencyPlanning.verification?.subscriptionsDesc || 'Services récurrents, abonnements, loyauté'
    },
    {
      id: 'government',
      task: t.emergencyPlanning.verification?.notifyGovernment || 'Aviser les organismes gouvernementaux',
      priority: 'medium',
      description: t.emergencyPlanning.verification?.governmentDesc || 'CRA, RRQ, SV, AE, etc.'
    },
    {
      id: 'digital-assets',
      task: t.emergencyPlanning.verification?.manageDigitalAssets || 'Gérer les actifs numériques',
      priority: 'low',
      description: t.emergencyPlanning.verification?.digitalAssetsDesc || 'Comptes en ligne, médias sociaux, cryptomonnaies'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch(priority) {
      case 'high': return t.emergencyPlanning.verification?.highPriority || 'Urgent';
      case 'medium': return t.emergencyPlanning.verification?.mediumPriority || 'Important';
      case 'low': return t.emergencyPlanning.verification?.lowPriority || 'À faire';
      default: return priority;
    }
  };

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <CheckCircle size={24} />
        {t.emergencyPlanning.verification?.title || 'Liste de vérification'}
      </h2>

      {/* Progression — Complétion globale des champs essentiels */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>
          {t.emergencyPlanning.verification?.completionTitle || 'Progression de complétion (champs essentiels)'}
        </h3>
        <div aria-label="Progression" style={{width: '100%', background: '#e5e7eb', height: '14px', borderRadius: '999px', overflow: 'hidden'}}>
          <div
            style={{
              width: `${completion.percentage}%`,
              background: completion.percentage >= 80 ? '#10b981' : completion.percentage >= 50 ? '#f59e0b' : '#ef4444',
              height: '100%'
            }}
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', color: '#374151'}}>
          <span>{completion.completed} / {completion.total} {t.emergencyPlanning.verification?.fieldsCompleted || 'champs complétés'}</span>
          <span>{completion.percentage}%</span>
        </div>
        <details style={{marginTop: '8px'}}>
          <summary style={{cursor: 'pointer', fontSize: '14px', color: '#1f2937'}}>
            {t.emergencyPlanning.verification?.details || 'Détails'}
          </summary>
          <ul style={{marginTop: '8px', paddingLeft: '18px', fontSize: '14px'}}>
            {completion.essentials.map(item => (
              <li key={item.id} style={{color: item.ok ? '#10b981' : '#ef4444'}}>
                {item.ok ? '✔' : '✖'} {item.label}
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Informations de mise à jour */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0}}>
            {t.emergencyPlanning.verification?.lastUpdate || 'Dernière mise à jour'}
          </h3>
          <button
            onClick={updateDate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <RefreshCcw size={16} />
            {t.emergencyPlanning.verification?.updateNow || 'Mettre à jour maintenant'}
          </button>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Calendar size={20} color="#6b7280" />
          <span style={{fontSize: '16px', color: '#1f2937'}}>
            {formatDate(data.dateMAJ)}
          </span>
          <div className="form-field" style={{marginLeft: 'auto', minWidth: '120px'}}>
            <label className="form-label">{t.emergencyPlanning.verification?.version || 'Version'}</label>
            <input
              type="text"
              className="form-input"
              value={data.version || '1.0'}
              onChange={(e) => setData({...data, version: e.target.value})}
              placeholder="1.0"
            />
          </div>
        </div>
      </div>

      {/* Liste de vérification */}
      <div className="item-card">
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          {t.emergencyPlanning.verification?.emergencyTasks || 'Tâches importantes pour vos proches en cas d\'urgence'}
        </h3>
        
        <div style={{marginBottom: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px'}}>
          <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
            {t.emergencyPlanning.verification?.instructionsNote || 'Cette liste aide vos proches à savoir quelles démarches entreprendre. Imprimez-la et conservez-la avec vos documents importants.'}
          </p>
        </div>

        <div style={{display: 'grid', gap: '12px'}}>
          {checklistItems.map((item, index) => (
            <div 
              key={item.id}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                <div style={{
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginTop: '2px'
                }}>
                  {index + 1}
                </div>
                
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>
                      {item.task}
                    </h4>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: getPriorityColor(item.priority),
                      color: 'white'
                    }}>
                      {getPriorityLabel(item.priority)}
                    </span>
                  </div>
                  
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note finale */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        borderLeft: '4px solid #0ea5e9'
      }}>
        <p style={{margin: 0, fontSize: '14px', color: '#0c4a6e'}}>
          <strong>{t.emergencyPlanning.verification?.finalNote || 'Note importante'} :</strong>{' '}
          {t.emergencyPlanning.verification?.finalNoteText || 'Cette planification d\'urgence doit être révisée régulièrement et partagée avec vos proches de confiance. Assurez-vous qu\'ils savent où trouver ce document et comprennent son utilisation.'}
        </p>
      </div>
    </div>
  );
};

export default VerificationSection;
