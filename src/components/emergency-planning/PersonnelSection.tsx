import React from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface PersonnelSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
  showPasswords: boolean;
}

const PersonnelSection: React.FC<PersonnelSectionProps> = ({ 
  data, 
  setData, 
  showPasswords 
}) => {
  const { t } = useLanguage();

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <User size={24} />
        {t.emergencyPlanning.personal.title}
      </h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.firstName}</label>
          <input
            type="text"
            className="form-input"
            value={data.prenom}
            onChange={(e) => setData({...data, prenom: e.target.value})}
            placeholder="Votre prénom"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.lastName}</label>
          <input
            type="text"
            className="form-input"
            value={data.nom}
            onChange={(e) => setData({...data, nom: e.target.value})}
            placeholder="Votre nom de famille"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.birthDate}</label>
          <input
            type="date"
            className="form-input"
            value={data.dateNaissance}
            onChange={(e) => setData({...data, dateNaissance: e.target.value})}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.phone}</label>
          <input
            type="tel"
            className="form-input"
            value={data.telephone}
            onChange={(e) => setData({...data, telephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.email}</label>
          <input
            type="email"
            className="form-input"
            value={data.courriel}
            onChange={(e) => setData({...data, courriel: e.target.value})}
            placeholder="votre@courriel.com"
          />
        </div>

        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">{t.emergencyPlanning.personal.address}</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.adresse}
            onChange={(e) => setData({...data, adresse: e.target.value})}
            placeholder="Adresse complète avec ville et code postal"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.sin}</label>
          <input
            type="text"
            className="form-input"
            value={showPasswords ? data.nas : data.nas.replace(/./g, '*')}
            onChange={(e) => setData({...data, nas: e.target.value})}
            placeholder="XXX-XXX-XXX"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.healthCard}</label>
          <input
            type="text"
            className="form-input"
            value={showPasswords ? data.assuranceMaladie : data.assuranceMaladie.replace(/./g, '*')}
            onChange={(e) => setData({...data, assuranceMaladie: e.target.value})}
            placeholder="XXXX XXXX XX"
          />
        </div>

        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">{t.emergencyPlanning.personal.allergies}</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.allergies}
            onChange={(e) => setData({...data, allergies: e.target.value})}
            placeholder="Allergies connues ou 'Aucune'"
          />
        </div>

        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">{t.emergencyPlanning.personal.medicalConditions}</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.conditionsMedicales}
            onChange={(e) => setData({...data, conditionsMedicales: e.target.value})}
            placeholder="Conditions médicales importantes ou 'Aucune'"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.emergencyContact}</label>
          <input
            type="text"
            className="form-input"
            value={data.contactUrgenceNom}
            onChange={(e) => setData({...data, contactUrgenceNom: e.target.value})}
            placeholder="Nom du contact d'urgence"
          />
        </div>

        <div className="form-field">
          <label className="form-label">{t.emergencyPlanning.personal.emergencyContactPhone}</label>
          <input
            type="tel"
            className="form-input"
            value={data.contactUrgenceTelephone}
            onChange={(e) => setData({...data, contactUrgenceTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonnelSection;