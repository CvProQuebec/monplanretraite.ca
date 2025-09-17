import React, { useState } from 'react';
import { Smartphone, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface NumeriqueSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const NumeriqueSection: React.FC<NumeriqueSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();
  const [showPasswords, setShowPasswords] = useState(false);

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
            <label className="form-label">
              {t.emergencyPlanning.digital?.passwordManagerName || 'Nom du gestionnaire'}
            </label>
            <input
              type="text"
              className="form-input"
              value={data.gestionnaireMDP || ''}
              onChange={(e) => setData({...data, gestionnaireMDP: e.target.value})}
              placeholder="Ex: 1Password, LastPass, Bitwarden"
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              {t.emergencyPlanning.digital?.masterPassword || 'Mot de passe principal'}
            </label>
            <div style={{position: 'relative'}}>
              <input
                type={showPasswords ? "text" : "password"}
                className="form-input"
                style={{paddingRight: '40px'}}
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
              fontSize: '14px'
            }}
          >
            <Plus size={16} />
            {t.emergencyPlanning.digital?.addAccount || 'Ajouter un compte'}
          </button>
        </div>

        {(data.comptesEnLigne || []).map((compte) => (
          <div key={compte.id} className="item-card" style={{marginBottom: '12px'}}>
            <div className="item-header">
              <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
                {compte.plateforme || 'Nouveau compte'}
              </h4>
              <button
                className="delete-button"
                onClick={() => removeCompteEnLigne(compte.id)}
                aria-label="Supprimer ce compte"
                title="Supprimer ce compte"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  {t.emergencyPlanning.digital?.platform || 'Plateforme'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={compte.plateforme}
                  onChange={(e) => updateCompteEnLigne(compte.id, 'plateforme', e.target.value)}
                  placeholder="Ex: Gmail, Facebook, Banque, etc."
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  {t.emergencyPlanning.digital?.email || 'Courriel'}
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={compte.courriel}
                  onChange={(e) => updateCompteEnLigne(compte.id, 'courriel', e.target.value)}
                  placeholder="exemple@courriel.com"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  {t.emergencyPlanning.digital?.password || 'Mot de passe'}
                </label>
                <div style={{position: 'relative'}}>
                  <input
                    type={showPasswords ? "text" : "password"}
                    className="form-input"
                    style={{paddingRight: '40px'}}
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
            fontSize: '16px',
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
        <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
          <strong>{t.emergencyPlanning.digital?.securityNote || 'Note de sécurité'} :</strong>{' '}
          {t.emergencyPlanning.digital?.securityNoteText || 'Ces informations sensibles doivent être stockées de manière sécurisée et accessibles uniquement aux personnes de confiance en cas d\'urgence.'}
        </p>
      </div>
    </div>
  );
};

export default NumeriqueSection;