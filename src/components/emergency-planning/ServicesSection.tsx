import React from 'react';
import { Monitor } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { EmergencyData } from './types';

interface ServicesSectionProps {
  data: EmergencyData;
  setData: (data: EmergencyData) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ data, setData }) => {
  const { t } = useLanguage();

  return (
    <div className="form-section">
      <div style={{
        backgroundColor: '#e0e7ff',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Monitor size={20} />
        <h2 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e40af'}}>
          {t.emergencyPlanning.services.title}
        </h2>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#475569',
          backgroundColor: '#e2e8f0',
          padding: '12px 16px',
          borderRadius: '4px',
          margin: '0 0 24px 0'
        }}>
          {t.emergencyPlanning.services.onlineAccountsTitle}
        </h3>

        {/* Cellulaire */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.cellular}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.provider}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.telecom?.fournisseur || ''}
                onChange={(e) => setData({...data, telecom: {...data.telecom, fournisseur: e.target.value}})}
                placeholder={t.emergencyPlanning.services.cellularProviderPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.phoneNumber}</label>
              <input
                type="tel"
                className="form-input senior-form-input"
                value={data.telecom?.numeroTelephone || ''}
                onChange={(e) => setData({...data, telecom: {...data.telecom, numeroTelephone: e.target.value}})}
                placeholder={t.emergencyPlanning.services.phonePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.telecom?.numeroCompte || ''}
                onChange={(e) => setData({...data, telecom: {...data.telecom, numeroCompte: e.target.value}})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Internet */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.internet}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.provider}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.internet?.fournisseur || ''}
                onChange={(e) => setData({...data, internet: {...data.internet, fournisseur: e.target.value}})}
                placeholder={t.emergencyPlanning.services.internetProviderPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.phoneNumber}</label>
              <input
                type="tel"
                className="form-input senior-form-input"
                value={data.internet?.numeroTelephone || ''}
                onChange={(e) => setData({...data, internet: {...data.internet, numeroTelephone: e.target.value}})}
                placeholder={t.emergencyPlanning.services.phonePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.internet?.numeroCompte || ''}
                onChange={(e) => setData({...data, internet: {...data.internet, numeroCompte: e.target.value}})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Amazon */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.amazon}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.subscriptionName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.amazonNom || ''}
                onChange={(e) => setData({...data, amazonNom: e.target.value})}
                placeholder={t.emergencyPlanning.services.fullNamePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.amazonCompte || ''}
                onChange={(e) => setData({...data, amazonCompte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Abonnements récurrents */}
        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#475569', backgroundColor: '#e2e8f0', padding: '12px 16px', borderRadius: '4px', margin: '32px 0 24px 0'}}>
          {t.emergencyPlanning.services.recurringSubscriptions}
        </h3>

        {/* Netflix / Abonnement */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.netflix}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.subscriptionName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.netflixNom || ''}
                onChange={(e) => setData({...data, netflixNom: e.target.value})}
                placeholder={t.emergencyPlanning.services.fullNamePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.netflixCompte || ''}
                onChange={(e) => setData({...data, netflixCompte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Spotify */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.spotify}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.subscriptionName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.spotifyNom || ''}
                onChange={(e) => setData({...data, spotifyNom: e.target.value})}
                placeholder={t.emergencyPlanning.services.fullNamePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.spotifyCompte || ''}
                onChange={(e) => setData({...data, spotifyCompte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Autres abonnements/Services */}
        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#475569', backgroundColor: '#e2e8f0', padding: '12px 16px', borderRadius: '4px', margin: '32px 0 24px 0'}}>
          {t.emergencyPlanning.services.otherSubscriptions}
        </h3>

        {/* Service générique 1 */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.service}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.serviceName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service1Nom || ''}
                onChange={(e) => setData({...data, service1Nom: e.target.value})}
                placeholder={t.emergencyPlanning.services.servicePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.subscriptionName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service1Abonnement || ''}
                onChange={(e) => setData({...data, service1Abonnement: e.target.value})}
                placeholder={t.emergencyPlanning.services.fullNamePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service1Compte || ''}
                onChange={(e) => setData({...data, service1Compte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Service générique 2 */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.service}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.serviceName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service2Nom || ''}
                onChange={(e) => setData({...data, service2Nom: e.target.value})}
                placeholder={t.emergencyPlanning.services.servicePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.subscriptionName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service2Abonnement || ''}
                onChange={(e) => setData({...data, service2Abonnement: e.target.value})}
                placeholder={t.emergencyPlanning.services.fullNamePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service2Compte || ''}
                onChange={(e) => setData({...data, service2Compte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Service générique 3 */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.service}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.serviceName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service3Nom || ''}
                onChange={(e) => setData({...data, service3Nom: e.target.value})}
                placeholder={t.emergencyPlanning.services.servicePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.subscriptionName}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service3Abonnement || ''}
                onChange={(e) => setData({...data, service3Abonnement: e.target.value})}
                placeholder={t.emergencyPlanning.services.fullNamePlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.service3Compte || ''}
                onChange={(e) => setData({...data, service3Compte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Programmes de loyauté */}
        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#475569', backgroundColor: '#e2e8f0', padding: '12px 16px', borderRadius: '4px', margin: '32px 0 24px 0'}}>
          {t.emergencyPlanning.services.loyaltyPrograms}
        </h3>

        {/* Air Canada */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.airCanada}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.emailAddress}</label>
              <input
                type="email"
                className="form-input senior-form-input"
                value={data.airCanadaCourriel || ''}
                onChange={(e) => setData({...data, airCanadaCourriel: e.target.value})}
                placeholder={t.emergencyPlanning.services.emailPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.password}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.airCanadaMotDePasse || ''}
                onChange={(e) => setData({...data, airCanadaMotDePasse: e.target.value})}
                placeholder={t.emergencyPlanning.services.passwordPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.accountNumber}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.airCanadaCompte || ''}
                onChange={(e) => setData({...data, airCanadaCompte: e.target.value})}
                placeholder={t.emergencyPlanning.services.accountPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Air Miles */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.airMiles}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.emailAddress}</label>
              <input
                type="email"
                className="form-input senior-form-input"
                value={data.airMilesCourriel || ''}
                onChange={(e) => setData({...data, airMilesCourriel: e.target.value})}
                placeholder={t.emergencyPlanning.services.emailPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.password}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.airMilesMotDePasse || ''}
                onChange={(e) => setData({...data, airMilesMotDePasse: e.target.value})}
                placeholder={t.emergencyPlanning.services.passwordPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>Numéro de compte</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.airMilesCompte || ''}
                onChange={(e) => setData({...data, airMilesCompte: e.target.value})}
                placeholder="XXXXXXXXXX"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Aéroplan Loyalty Program */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.aeroplan}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.emailAddress}</label>
              <input
                type="email"
                className="form-input senior-form-input"
                value={data.aeroplanCourriel || ''}
                onChange={(e) => setData({...data, aeroplanCourriel: e.target.value})}
                placeholder={t.emergencyPlanning.services.emailPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.password}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.aeroplanMotDePasse || ''}
                onChange={(e) => setData({...data, aeroplanMotDePasse: e.target.value})}
                placeholder={t.emergencyPlanning.services.passwordPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>Numéro de compte</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.aeroplanCompte || ''}
                onChange={(e) => setData({...data, aeroplanCompte: e.target.value})}
                placeholder="XXXXXXXXXX"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Marriott Bonvoy (Pts) */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.marriott}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.emailAddress}</label>
              <input
                type="email"
                className="form-input senior-form-input"
                value={data.marriottCourriel || ''}
                onChange={(e) => setData({...data, marriottCourriel: e.target.value})}
                placeholder={t.emergencyPlanning.services.emailPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.password}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.marriottMotDePasse || ''}
                onChange={(e) => setData({...data, marriottMotDePasse: e.target.value})}
                placeholder={t.emergencyPlanning.services.passwordPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>Numéro de compte</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.marriottCompte || ''}
                onChange={(e) => setData({...data, marriottCompte: e.target.value})}
                placeholder="XXXXXXXXXX"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* Hilton Honors */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.hilton}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.emailAddress}</label>
              <input
                type="email"
                className="form-input senior-form-input"
                value={data.hiltonCourriel || ''}
                onChange={(e) => setData({...data, hiltonCourriel: e.target.value})}
                placeholder={t.emergencyPlanning.services.emailPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.password}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.hiltonMotDePasse || ''}
                onChange={(e) => setData({...data, hiltonMotDePasse: e.target.value})}
                placeholder={t.emergencyPlanning.services.passwordPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>Numéro de compte</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.hiltonCompte || ''}
                onChange={(e) => setData({...data, hiltonCompte: e.target.value})}
                placeholder="XXXXXXXXXX"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>

        {/* World Hyatt */}
        <div className="item-card" style={{marginBottom: '24px'}}>
          <h4 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937'}}>{t.emergencyPlanning.services.hyatt}</h4>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.emailAddress}</label>
              <input
                type="email"
                className="form-input senior-form-input"
                value={data.hyattCourriel || ''}
                onChange={(e) => setData({...data, hyattCourriel: e.target.value})}
                placeholder={t.emergencyPlanning.services.emailPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>{t.emergencyPlanning.services.password}</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.hyattMotDePasse || ''}
                onChange={(e) => setData({...data, hyattMotDePasse: e.target.value})}
                placeholder={t.emergencyPlanning.services.passwordPlaceholder}
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
            <div className="form-field">
              <label className="form-label" style={{fontSize: '18px', fontWeight: '500'}}>Numéro de compte</label>
              <input
                type="text"
                className="form-input senior-form-input"
                value={data.hyattCompte || ''}
                onChange={(e) => setData({...data, hyattCompte: e.target.value})}
                placeholder="XXXXXXXXXX"
                style={{fontSize: '18px', minHeight: '48px', padding: '12px 16px'}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;