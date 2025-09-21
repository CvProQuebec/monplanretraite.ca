// TEMPLATE UNIFIÉ - PAGE PROFIL MonPlanRetraite.ca
// À adapter selon votre structure exacte de données PersonalData

import React from 'react';
import { useRetirementData } from '../hooks/useRetirementData';

const ProfilePage: React.FC = () => {
  const { userData, updateUserData } = useRetirementData();
  const personal = userData?.personal || {};

  const handlePersonalChange = (field: string, value: any, personIndex?: number) => {
    if (personIndex !== undefined) {
      // Pour les données spécifiques à une personne
      updateUserData({
        personal: {
          ...personal,
          [`person${personIndex + 1}`]: {
            ...personal[`person${personIndex + 1}`],
            [field]: value
          }
        }
      });
    } else {
      // Pour les données communes
      updateUserData({
        personal: {
          ...personal,
          [field]: value
        }
      });
    }
  };

  return (
    <div className="mpr-container">
      <h1>Profil Personnel</h1>
      
      {/* SECTION 1: INFORMATIONS GÉNÉRALES */}
      <div className="mpr-section">
        <h2 className="mpr-section-title">Informations générales</h2>
        
        <div className="mpr-form">
          <div className="mpr-form-row cols-3">
            <div className="mpr-field">
              <label htmlFor="province">Province</label>
              <select 
                id="province"
                value={personal.province || 'QC'}
                onChange={(e) => handlePersonalChange('province', e.target.value)}
              >
                <option value="QC">Québec</option>
                <option value="ON">Ontario</option>
                <option value="BC">Colombie-Britannique</option>
                <option value="AB">Alberta</option>
                {/* Ajouter autres provinces */}
              </select>
            </div>
            
            <div className="mpr-field">
              <label htmlFor="maritalStatus">Statut marital</label>
              <select 
                id="maritalStatus"
                value={personal.maritalStatus || 'single'}
                onChange={(e) => handlePersonalChange('maritalStatus', e.target.value)}
              >
                <option value="single">Célibataire</option>
                <option value="married">Marié(e)</option>
                <option value="common-law">Union de fait</option>
                <option value="divorced">Divorcé(e)</option>
                <option value="widowed">Veuf/Veuve</option>
              </select>
            </div>
            
            <div className="mpr-field">
              <label htmlFor="retirementGoalAge">Âge retraite souhaité</label>
              <input 
                id="retirementGoalAge"
                type="number"
                min="55"
                max="70"
                value={personal.retirementGoalAge || 65}
                onChange={(e) => handlePersonalChange('retirementGoalAge', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERSONNE 1 */}
      <div className="mpr-section">
        <h2 className="mpr-section-title">Personne 1 (Principal)</h2>
        
        <div className="mpr-form">
          <div className="mpr-form-row cols-3">
            <div className="mpr-field">
              <label htmlFor="person1_name">Prénom</label>
              <input 
                id="person1_name"
                type="text"
                value={personal.person1?.name || ''}
                onChange={(e) => handlePersonalChange('name', e.target.value, 0)}
                placeholder="Votre prénom"
              />
            </div>
            
            <div className="mpr-field">
              <label htmlFor="person1_age">Âge actuel</label>
              <input 
                id="person1_age"
                type="number"
                min="18"
                max="100"
                value={personal.person1?.age || ''}
                onChange={(e) => handlePersonalChange('age', parseInt(e.target.value), 0)}
              />
            </div>
            
            <div className="mpr-field">
              <label htmlFor="person1_status">Statut actuel</label>
              <select 
                id="person1_status"
                value={personal.person1?.employmentStatus || 'employed'}
                onChange={(e) => handlePersonalChange('employmentStatus', e.target.value, 0)}
              >
                <option value="employed">Actif/Travaille</option>
                <option value="unemployed">Sans emploi</option>
                <option value="retired">Retraité(e)</option>
                <option value="self-employed">Travailleur autonome</option>
                <option value="student">Étudiant(e)</option>
              </select>
            </div>
          </div>
          
          <div className="mpr-form-row cols-2">
            <div className="mpr-field">
              <label htmlFor="person1_birthDate">Date de naissance</label>
              <input 
                id="person1_birthDate"
                type="date"
                value={personal.person1?.birthDate || ''}
                onChange={(e) => handlePersonalChange('birthDate', e.target.value, 0)}
              />
            </div>
            
            <div className="mpr-field">
              <label htmlFor="person1_retirementAge">Âge retraite prévu</label>
              <input 
                id="person1_retirementAge"
                type="number"
                min="55"
                max="70"
                value={personal.person1?.plannedRetirementAge || 65}
                onChange={(e) => handlePersonalChange('plannedRetirementAge', parseInt(e.target.value), 0)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PERSONNE 2 (SI COUPLE) */}
      {(personal.maritalStatus === 'married' || personal.maritalStatus === 'common-law') && (
        <div className="mpr-section">
          <h2 className="mpr-section-title">Personne 2 (Conjoint)</h2>
          
          <div className="mpr-form">
            <div className="mpr-form-row cols-3">
              <div className="mpr-field">
                <label htmlFor="person2_name">Prénom</label>
                <input 
                  id="person2_name"
                  type="text"
                  value={personal.person2?.name || ''}
                  onChange={(e) => handlePersonalChange('name', e.target.value, 1)}
                  placeholder="Prénom du conjoint"
                />
              </div>
              
              <div className="mpr-field">
                <label htmlFor="person2_age">Âge actuel</label>
                <input 
                  id="person2_age"
                  type="number"
                  min="18"
                  max="100"
                  value={personal.person2?.age || ''}
                  onChange={(e) => handlePersonalChange('age', parseInt(e.target.value), 1)}
                />
              </div>
              
              <div className="mpr-field">
                <label htmlFor="person2_status">Statut actuel</label>
                <select 
                  id="person2_status"
                  value={personal.person2?.employmentStatus || 'employed'}
                  onChange={(e) => handlePersonalChange('employmentStatus', e.target.value, 1)}
                >
                  <option value="employed">Actif/Travaille</option>
                  <option value="unemployed">Sans emploi</option>
                  <option value="retired">Retraité(e)</option>
                  <option value="self-employed">Travailleur autonome</option>
                  <option value="student">Étudiant(e)</option>
                </select>
              </div>
            </div>
            
            <div className="mpr-form-row cols-2">
              <div className="mpr-field">
                <label htmlFor="person2_birthDate">Date de naissance</label>
                <input 
                  id="person2_birthDate"
                  type="date"
                  value={personal.person2?.birthDate || ''}
                  onChange={(e) => handlePersonalChange('birthDate', e.target.value, 1)}
                />
              </div>
              
              <div className="mpr-field">
                <label htmlFor="person2_retirementAge">Âge retraite prévu</label>
                <input 
                  id="person2_retirementAge"
                  type="number"
                  min="55"
                  max="70"
                  value={personal.person2?.plannedRetirementAge || 65}
                  onChange={(e) => handlePersonalChange('plannedRetirementAge', parseInt(e.target.value), 1)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PRÉFÉRENCES */}
      <div className="mpr-section">
        <h2 className="mpr-section-title">Préférences et objectifs</h2>
        
        <div className="mpr-form">
          <div className="mpr-form-row cols-2">
            <div className="mpr-field">
              <label htmlFor="riskTolerance">Tolérance au risque</label>
              <select 
                id="riskTolerance"
                value={personal.riskTolerance || 'moderate'}
                onChange={(e) => handlePersonalChange('riskTolerance', e.target.value)}
              >
                <option value="conservative">Conservateur</option>
                <option value="moderate">Modéré</option>
                <option value="aggressive">Agressif</option>
              </select>
            </div>
            
            <div className="mpr-field">
              <label htmlFor="retirementIncome">Revenu retraite souhaité</label>
              <input 
                id="retirementIncome"
                type="number"
                step="1000"
                value={personal.targetRetirementIncome || ''}
                onChange={(e) => handlePersonalChange('targetRetirementIncome', parseInt(e.target.value))}
                placeholder="60000"
              />
            </div>
          </div>
          
          <div className="mpr-form-row cols-1">
            <div className="mpr-field span-3">
              <label htmlFor="retirementGoals">Objectifs de retraite</label>
              <textarea 
                id="retirementGoals"
                rows={3}
                value={personal.retirementGoals || ''}
                onChange={(e) => handlePersonalChange('retirementGoals', e.target.value)}
                placeholder="Décrivez vos objectifs et rêves pour la retraite..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOUTONS D'ACTION */}
      <div className="mpr-form">
        <div className="mpr-form-row cols-3">
          <button 
            className="mpr-btn mpr-btn-secondary"
            onClick={() => window.history.back()}
          >
            ← Retour
          </button>
          
          <button 
            className="mpr-btn mpr-btn-primary"
            onClick={() => {
              // Logique de sauvegarde
              console.log('Profil sauvegardé:', personal);
            }}
          >
            💾 Sauvegarder
          </button>
          
          <button 
            className="mpr-btn mpr-btn-primary"
            onClick={() => {
              // Navigation vers page suivante
              window.location.href = '/revenus';
            }}
          >
            Suivant: Revenus →
          </button>
        </div>
      </div>

      {/* RÉSULTATS/APERÇU */}
      <div className="mpr-result-grid">
        <div className="mpr-result-card">
          <div className="mpr-result-amount">
            {personal.person1?.age || 0} ans
          </div>
          <div className="mpr-result-label">Âge actuel</div>
        </div>
        
        <div className="mpr-result-card">
          <div className="mpr-result-amount">
            {(personal.retirementGoalAge || 65) - (personal.person1?.age || 0)} ans
          </div>
          <div className="mpr-result-label">Temps avant retraite</div>
        </div>
        
        <div className="mpr-result-card">
          <div className="mpr-result-amount">
            {personal.targetRetirementIncome ? 
              new Intl.NumberFormat('fr-CA', { 
                style: 'currency', 
                currency: 'CAD',
                maximumFractionDigits: 0
              }).format(personal.targetRetirementIncome) : 
              'À définir'
            }
          </div>
          <div className="mpr-result-label">Objectif revenu</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;