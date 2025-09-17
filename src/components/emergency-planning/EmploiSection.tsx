import React from 'react';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface EmploiSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const EmploiSection: React.FC<EmploiSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Briefcase size={24} />
        {t.emergencyPlanning.employment.title}
      </h2>
      
      <div className="form-grid">
        {/* 1. Nom de l'employeur (entreprise) */}
        <div className="form-field">
          <label className="form-label">Nom de l'employeur (entreprise)</label>
          <input
            type="text"
            className="form-input"
            value={data.employeur}
            onChange={(e) => setData({...data, employeur: e.target.value})}
            placeholder="Nom de l'entreprise"
          />
        </div>

        {/* 2. Téléphone employeur */}
        <div className="form-field">
          <label className="form-label">Téléphone employeur</label>
          <input
            type="tel"
            className="form-input"
            value={data.employeurTelephone}
            onChange={(e) => setData({...data, employeurTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        {/* 3. Adresse du lieu de travail */}
        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Adresse du lieu de travail</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.adresseTravail}
            onChange={(e) => setData({...data, adresseTravail: e.target.value})}
            placeholder="Adresse complète du lieu de travail"
          />
        </div>

        {/* 4. Poste occupé */}
        <div className="form-field">
          <label className="form-label">Poste occupé</label>
          <input
            type="text"
            className="form-input"
            value={data.poste}
            onChange={(e) => setData({...data, poste: e.target.value})}
            placeholder="Votre titre de poste"
          />
        </div>

        {/* 5. Département/service */}
        <div className="form-field">
          <label className="form-label">Département/service</label>
          <input
            type="text"
            className="form-input"
            value={data.departement}
            onChange={(e) => setData({...data, departement: e.target.value})}
            placeholder="Département ou service"
          />
        </div>

        {/* 6. Numéro d'employé */}
        <div className="form-field">
          <label className="form-label">Numéro d'employé</label>
          <input
            type="text"
            className="form-input"
            value={data.numeroEmploye}
            onChange={(e) => setData({...data, numeroEmploye: e.target.value})}
            placeholder="Numéro d'employé"
          />
        </div>

        {/* 7. RH Personne-ressource Nom */}
        <div className="form-field">
          <label className="form-label">RH Personne-ressource Nom</label>
          <input
            type="text"
            className="form-input"
            value={data.rhContactNom}
            onChange={(e) => setData({...data, rhContactNom: e.target.value})}
            placeholder="Nom du contact aux ressources humaines"
          />
        </div>

        {/* 8. RH Personne-ressource Courriel */}
        <div className="form-field">
          <label className="form-label">RH Personne-ressource Courriel</label>
          <input
            type="email"
            className="form-input"
            value={data.rhContactCourriel}
            onChange={(e) => setData({...data, rhContactCourriel: e.target.value})}
            placeholder="courriel@entreprise.com"
          />
        </div>

        {/* 9. RH Personne-ressource Téléphone */}
        <div className="form-field">
          <label className="form-label">RH Personne-ressource Téléphone</label>
          <input
            type="tel"
            className="form-input"
            value={data.rhContactTelephone}
            onChange={(e) => setData({...data, rhContactTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        {/* 10. Nom du superviseur immédiat */}
        <div className="form-field">
          <label className="form-label">Nom du superviseur immédiat</label>
          <input
            type="text"
            className="form-input"
            value={data.superviseur}
            onChange={(e) => setData({...data, superviseur: e.target.value})}
            placeholder="Nom du superviseur"
          />
        </div>

        {/* 11. Courriel du superviseur immédiat */}
        <div className="form-field">
          <label className="form-label">Courriel du superviseur immédiat</label>
          <input
            type="email"
            className="form-input"
            value={data.superviseurCourriel}
            onChange={(e) => setData({...data, superviseurCourriel: e.target.value})}
            placeholder="superviseur@entreprise.com"
          />
        </div>

        {/* 12. Téléphone du superviseur immédiat */}
        <div className="form-field">
          <label className="form-label">Téléphone du superviseur immédiat</label>
          <input
            type="tel"
            className="form-input"
            value={data.superviseurTelephone}
            onChange={(e) => setData({...data, superviseurTelephone: e.target.value})}
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        {/* 13. Avantages sociaux */}
        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Avantages sociaux</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.avantagesSociaux}
            onChange={(e) => setData({...data, avantagesSociaux: e.target.value})}
            placeholder="Assurance maladie, dentaire, REER collectif, etc."
          />
        </div>

        {/* 14. Instructions spécifiques pour l'employeur */}
        <div className="form-field" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Instructions spécifiques pour l'employeur</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data.instructionsEmployeur}
            onChange={(e) => setData({...data, instructionsEmployeur: e.target.value})}
            placeholder="Instructions spéciales pour l'employeur en cas d'urgence"
          />
        </div>
      </div>
    </div>
  );
};

export default EmploiSection;