import React from 'react';
import { Phone } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface ContactsSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  // Fonction utilitaire pour mettre à jour un contact spécifique
  const updateContact = (contactNumber: number, field: string, value: string) => {
    const fieldName = `contact${contactNumber}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    setData({...data, [fieldName]: value});
  };

  // Rendu d'un contact d'urgence
  const renderEmergencyContact = (contactNumber: number) => {
    const nomField = `contact${contactNumber}Nom` as keyof EmergencyData;
    const lienField = `contact${contactNumber}LienRelation` as keyof EmergencyData;
    const telephoneField = `contact${contactNumber}Telephone` as keyof EmergencyData;
    const instructionsField = `contact${contactNumber}Instructions` as keyof EmergencyData;

    return (
      <div key={contactNumber} style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#475569',
          backgroundColor: '#e2e8f0',
          padding: '8px 12px',
          borderRadius: '4px'
        }}>
          {t.emergencyPlanning.contacts.emergencyContact} {contactNumber}
        </h3>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">{t.emergencyPlanning.contacts.contactName}</label>
            <input
              type="text"
              className="form-input"
              value={data[nomField] as string || ''}
              onChange={(e) => updateContact(contactNumber, 'nom', e.target.value)}
              placeholder={t.emergencyPlanning.contacts.contactNamePlaceholder}
            />
          </div>

          <div className="form-field">
            <label className="form-label">{t.emergencyPlanning.contacts.relationshipLabel}</label>
            <input
              type="text"
              className="form-input"
              value={data[lienField] as string || ''}
              onChange={(e) => updateContact(contactNumber, 'lienRelation', e.target.value)}
              placeholder={t.emergencyPlanning.contacts.relationshipPlaceholder}
            />
          </div>

          <div className="form-field">
            <label className="form-label">{t.emergencyPlanning.contacts.phoneNumber}</label>
            <input
              type="tel"
              className="form-input"
              value={data[telephoneField] as string || ''}
              onChange={(e) => updateContact(contactNumber, 'telephone', e.target.value)}
              placeholder={t.emergencyPlanning.contacts.phonePlaceholder}
            />
          </div>
        </div>

        <div className="form-field" style={{marginTop: '16px'}}>
          <label className="form-label">{t.emergencyPlanning.contacts.instructionsLabel}</label>
          <textarea
            className="form-input"
            style={{minHeight: '80px', resize: 'vertical'}}
            value={data[instructionsField] as string || ''}
            onChange={(e) => updateContact(contactNumber, 'instructions', e.target.value)}
            placeholder={t.emergencyPlanning.contacts.instructionsPlaceholder}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="form-section">
      <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Phone size={24} />
        {t.emergencyPlanning.contacts.emergencyContactsTitle}
      </h2>
      
      {renderEmergencyContact(1)}
      {renderEmergencyContact(2)}
      {renderEmergencyContact(3)}
    </div>
  );
};

export default ContactsSection;