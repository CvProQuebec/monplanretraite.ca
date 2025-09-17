import React, { useState } from 'react';
import { MessageSquare, Heart, AlertCircle, Smartphone, Plus, Trash2, Eye, EyeOff, CheckCircle, Calendar, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface InstructionsSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();
  const [showPasswords, setShowPasswords] = useState(false);

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

  const addCompteEnLigne = () => {
    const nouveauCompte = {
      id: generateId(),
      plateforme: '',
      courriel: '',
      motDePasse: ''
    };
    setData({
      ...data, 
      comptesEnLigne: [...(data.comptesEnLigne || []), nouveauCompte]
    });
  };

  const removeCompteEnLigne = (id: string) => {
    setData({
      ...data,
      comptesEnLigne: (data.comptesEnLigne || []).filter(c => c.id !== id)
    });
  };

  const updateCompteEnLigne = (id: string, field: string, value: string) => {
    setData({
      ...data,
      comptesEnLigne: (data.comptesEnLigne || []).map(c =>
        c.id === id ? {...c, [field]: value} : c
      )
    });
  };

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <MessageSquare size={24} />
        {t.emergencyPlanning.instructions?.title || 'Instructions spéciales'}
      </h2>

      {/* Instructions personnelles principales */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Heart size={20} />
          {t.emergencyPlanning.instructions?.personalInstructions || 'Instructions personnelles pour ma famille'}
        </h3>
        
        <div className="form-field">
          <label className="form-label">
            {t.emergencyPlanning.instructions?.mainInstructionsLabel || 'Messages et instructions importantes'}
          </label>
          <textarea
            className="form-input"
            style={{minHeight: '150px', resize: 'vertical'}}
            value={data.instructionsSpeciales || ''}
            onChange={(e) => setData({...data, instructionsSpeciales: e.target.value})}
            placeholder={t.emergencyPlanning.instructions?.mainInstructionsPlaceholder || 
              "Écrivez ici vos messages personnels et instructions importantes pour vos proches :\n\n• Messages d'amour et de réconfort\n• Instructions spéciales concernant vos biens\n• Souhaits particuliers\n• Informations que seuls vos proches doivent connaître\n• Codes d'accès spéciaux\n• Emplacements d'objets importants\n• Personnes à contacter dans des situations spécifiques"}
          />
        </div>
      </div>

      {/* Instructions d'urgence spécifiques */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <AlertCircle size={20} />
          {t.emergencyPlanning.instructions?.emergencyInstructions || 'Instructions d\'urgence spécifiques'}
        </h3>

        <div className="form-grid">
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.instructions?.petsLabel || 'Soins aux animaux de compagnie'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '80px', resize: 'vertical'}}
              value={data.instructionAnimaux || ''}
              onChange={(e) => setData({...data, instructionAnimaux: e.target.value})}
              placeholder="Instructions pour le soin de vos animaux : noms, habitudes, vétérinaire, nourriture préférée, médicaments, etc."
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.instructions?.plantsLabel || 'Entretien des plantes et jardin'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '80px', resize: 'vertical'}}
              value={data.instructionPlantes || ''}
              onChange={(e) => setData({...data, instructionPlantes: e.target.value})}
              placeholder="Instructions pour l'entretien de vos plantes, jardin, potager : arrosage, soins spéciaux, périodes importantes, etc."
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.instructions?.propertyLabel || 'Entretien de la propriété'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '80px', resize: 'vertical'}}
              value={data.instructionPropriete || ''}
              onChange={(e) => setData({...data, instructionPropriete: e.target.value})}
              placeholder="Instructions pour l'entretien de votre propriété : systèmes de chauffage/climatisation, alarmes, codes d'accès, contacts de réparation, entretien saisonnier, etc."
            />
          </div>
        </div>
      </div>

      {/* Instructions techniques et accès */}
      <div className="item-card" style={{marginBottom: '20px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
          {t.emergencyPlanning.instructions?.technicalInstructions || 'Instructions techniques et accès'}
        </h3>

        <div className="form-grid">
          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.instructions?.safeAccessLabel || 'Accès aux coffres-forts et cachettes'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '80px', resize: 'vertical'}}
              value={data.instructionCoffreFort || ''}
              onChange={(e) => setData({...data, instructionCoffreFort: e.target.value})}
              placeholder="Emplacements et codes d'accès aux coffres-forts, cachettes secrètes, boîtes de sécurité, etc."
            />
          </div>

          <div className="form-field" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">
              {t.emergencyPlanning.instructions?.businessLabel || 'Affaires et projets en cours'}
            </label>
            <textarea
              className="form-input"
              style={{minHeight: '100px', resize: 'vertical'}}
              value={data.instructionAffaires || ''}
              onChange={(e) => setData({...data, instructionAffaires: e.target.value})}
              placeholder="Instructions concernant vos affaires, projets en cours, engagements professionnels, contrats importants, etc."
            />
          </div>
        </div>
      </div>

      {/* Messages personnels */}
      <div className="item-card">
        <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Heart size={20} color="#ef4444" />
          {t.emergencyPlanning.instructions?.personalMessages || 'Messages personnels'}
        </h3>

        <div className="form-field">
          <label className="form-label">
            {t.emergencyPlanning.instructions?.finalMessagesLabel || 'Derniers messages pour vos proches'}
          </label>
          <textarea
            className="form-input"
            style={{minHeight: '150px', resize: 'vertical'}}
            value={data.messagesPersonnels || ''}
            onChange={(e) => setData({...data, messagesPersonnels: e.target.value})}
            placeholder={t.emergencyPlanning.instructions?.finalMessagesPlaceholder ||
              "Vos derniers messages d'amour, de gratitude et d'encouragement pour vos proches :\n\n• Pour votre conjoint(e)\n• Pour vos enfants\n• Pour vos parents\n• Pour vos amis proches\n• Pour vos collègues\n\nProfitez de cette section pour exprimer tout ce qui compte vraiment pour vous..."}
          />
        </div>
      </div>

      {/* Section Accès numérique */}
      <div className="item-card" style={{marginTop: '32px', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Smartphone size={24} />
          {t.emergencyPlanning.digital?.title || 'Accès numérique'}
        </h2>

        {/* Gestionnaire de mots de passe */}
        <div className="item-card" style={{marginBottom: '20px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '12px'}}>
            {t.emergencyPlanning.digital?.passwordManager || 'Gestionnaire de mots de passe'}
          </h3>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                {t.emergencyPlanning.digital?.passwordManagerName || 'Nom du gestionnaire'}
              </label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.gestionnaireMDP || ''}
                onChange={(e) => setData({...data, gestionnaireMDP: e.target.value})}
                placeholder="Ex: 1Password, LastPass, Bitwarden"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                {t.emergencyPlanning.digital?.masterPassword || 'Mot de passe principal'}
              </label>
              <div style={{position: 'relative'}}>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-input senior-form-input"
                  style={{paddingRight: '40px', fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                  value={data.motDePassePrincipal || ''}
                  onChange={(e) => setData({...data, motDePassePrincipal: e.target.value})}
                  placeholder="Mot de passe maître"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6b7280'
                  }}
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comptes en ligne importants */}
        <div className="item-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0}}>
              {t.emergencyPlanning.digital?.onlineAccounts || 'Comptes en ligne importants'}
            </h3>
            <button 
              className="add-button" 
              onClick={addCompteEnLigne}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '18px',
                minHeight: '48px'
              }}
            >
              <Plus size={16} />
              {t.emergencyPlanning.digital?.addAccount || 'Ajouter un compte'}
            </button>
          </div>

          {(data.comptesEnLigne || []).map((compte) => (
            <div key={compte.id} className="item-card" style={{marginBottom: '12px'}}>
              <div className="item-header">
                <h4 style={{margin: 0, fontSize: '18px', fontWeight: '600'}}>
                  {compte.plateforme || 'Nouveau compte'}
                </h4>
                <button
                  className="delete-button"
                  onClick={() => removeCompteEnLigne(compte.id)}
                  aria-label="Supprimer ce compte"
                  title="Supprimer ce compte"
                  style={{minHeight: '48px', minWidth: '48px'}}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                    {t.emergencyPlanning.digital?.platform || 'Plateforme'}
                  </label>
                  <input
                    type="text"
                    className="form-input senior-form-input"
                    value={compte.plateforme}
                    onChange={(e) => updateCompteEnLigne(compte.id, 'plateforme', e.target.value)}
                    placeholder="Ex: Gmail, Facebook, Banque, etc."
                    style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                    {t.emergencyPlanning.digital?.email || 'Courriel'}
                  </label>
                  <input
                    type="email"
                    className="form-input senior-form-input"
                    value={compte.courriel}
                    onChange={(e) => updateCompteEnLigne(compte.id, 'courriel', e.target.value)}
                    placeholder="exemple@courriel.com"
                    style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                    {t.emergencyPlanning.digital?.password || 'Mot de passe'}
                  </label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showPasswords ? "text" : "password"}
                      className="form-input senior-form-input"
                      style={{paddingRight: '40px', fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
                      value={compte.motDePasse}
                      onChange={(e) => updateCompteEnLigne(compte.id, 'motDePasse', e.target.value)}
                      placeholder="Mot de passe"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!data.comptesEnLigne || data.comptesEnLigne.length === 0) && (
            <div style={{
              textAlign: 'center', 
              padding: '32px', 
              color: '#6b7280', 
              fontSize: '18px',
              border: '2px dashed #d1d5db',
              borderRadius: '8px'
            }}>
              {t.emergencyPlanning.digital?.noAccounts || 'Aucun compte ajouté. Cliquez sur "Ajouter un compte" pour commencer.'}
            </div>
          )}
        </div>

        {/* Note de sécurité */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{margin: 0, fontSize: '18px', color: '#92400e'}}>
            <strong>{t.emergencyPlanning.digital?.securityNote || 'Note de sécurité'} :</strong>{' '}
            {t.emergencyPlanning.digital?.securityNoteText || 'Ces informations sensibles doivent être stockées de manière sécurisée et accessibles uniquement aux personnes de confiance en cas d\'urgence.'}
          </p>
        </div>
      </div>

      {/* Section Vérification */}
      <div className="item-card" style={{marginTop: '32px', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <CheckCircle size={24} />
          {t.emergencyPlanning.verification?.title || 'Liste de vérification'}
        </h2>

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
                padding: '12px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '500',
                minHeight: '48px'
              }}
            >
              <RefreshCcw size={16} />
              {t.emergencyPlanning.verification?.updateNow || 'Mettre à jour maintenant'}
            </button>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <Calendar size={20} color="#6b7280" />
            <span style={{fontSize: '18px', color: '#1f2937'}}>
              {formatDate(data.dateMAJ)}
            </span>
            <div className="form-field" style={{marginLeft: 'auto', minWidth: '120px'}}>
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>
                {t.emergencyPlanning.verification?.version || 'Version'}
              </label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.version || '1.0'}
                onChange={(e) => setData({...data, version: e.target.value})}
                placeholder="1.0"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Liste de vérification */}
        <div className="item-card">
          <h3 style={{fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px'}}>
            {t.emergencyPlanning.verification?.emergencyTasks || 'Tâches importantes pour vos proches en cas d\'urgence'}
          </h3>
          
          <div style={{marginBottom: '16px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '6px'}}>
            <p style={{margin: 0, fontSize: '18px', color: '#92400e'}}>
              {t.emergencyPlanning.verification?.instructionsNote || 'Cette liste aide vos proches à savoir quelles démarches entreprendre. Imprimez-la et conservez-la avec vos documents importants.'}
            </p>
          </div>

          <div style={{display: 'grid', gap: '12px'}}>
            {checklistItems.map((item, index) => (
              <div 
                key={item.id}
                style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                  <div style={{
                    minWidth: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginTop: '2px'
                  }}>
                    {index + 1}
                  </div>
                  
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                      <h4 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>
                        {item.task}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        backgroundColor: getPriorityColor(item.priority),
                        color: 'white'
                      }}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </div>
                    
                    <p style={{
                      margin: 0,
                      fontSize: '16px',
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
          <p style={{margin: 0, fontSize: '18px', color: '#0c4a6e'}}>
            <strong>{t.emergencyPlanning.verification?.finalNote || 'Note importante'} :</strong>{' '}
            {t.emergencyPlanning.verification?.finalNoteText || 'Cette planification d\'urgence doit être révisée régulièrement et partagée avec vos proches de confiance. Assurez-vous qu\'ils savent où trouver ce document et comprennent son utilisation.'}
          </p>
        </div>
      </div>

      {/* Note de confidentialité */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        borderLeft: '4px solid #f87171'
      }}>
        <p style={{margin: 0, fontSize: '18px', color: '#991b1b'}}>
          <strong>{t.emergencyPlanning.instructions?.confidentialityNote || 'Note de confidentialité'} :</strong>{' '}
          {t.emergencyPlanning.instructions?.confidentialityNoteText || 
            'Ces instructions sont très personnelles et confidentielles. Assurez-vous qu\'elles ne soient accessibles qu\'aux personnes de confiance appropriées. Révisez et mettez à jour ces messages régulièrement pour qu\'ils reflètent toujours vos sentiments actuels.'}
        </p>
      </div>
    </div>
  );
};

export default InstructionsSection;