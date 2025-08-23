// src/pages/RetraiteModuleFr.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/retirement-module.css';

const RetraiteModuleFr: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  useEffect(() => {
    console.log('🔍 RetraiteModuleFr - Composant chargé');
  }, []);

  // Gérer les paramètres d'URL pour la section active
  useEffect(() => {
    const section = searchParams.get('section');
    console.log('🔍 RetraiteModuleFr - useSearchParams.get("section"):', section);
    console.log('🔍 RetraiteModuleFr - searchParams.toString():', searchParams.toString());
    console.log('🔍 RetraiteModuleFr - window.location.search:', window.location.search);
    console.log('🔍 RetraiteModuleFr - window.location.href:', window.location.href);
    
    // Détection de secours depuis window.location
    const urlParams = new URLSearchParams(window.location.search);
    const sectionFromURL = urlParams.get('section');
    console.log('🔍 RetraiteModuleFr - Section depuis window.location:', sectionFromURL);
    
    // Test direct avec l'URL actuelle
    const currentUrl = new URL(window.location.href);
    const sectionFromCurrentUrl = currentUrl.searchParams.get('section');
    console.log('🔍 RetraiteModuleFr - Section depuis URL actuelle:', sectionFromCurrentUrl);
    
    if (section) {
      console.log('🔍 Section détectée dans l\'URL (useSearchParams):', section);
      console.log('🔍 Ancienne section active:', activeSection);
      setActiveSection(section);
      console.log('🔍 Nouvelle section active définie:', section);
    } else if (sectionFromURL) {
      console.log('🔍 Section détectée depuis window.location:', sectionFromURL);
      console.log('🔍 Ancienne section active:', activeSection);
      setActiveSection(sectionFromURL);
      console.log('🔍 Nouvelle section active définie (secours):', sectionFromURL);
    } else {
      console.log('🔍 Aucune section détectée dans l\'URL');
    }
  }, [searchParams]); // Retiré activeSection des dépendances pour éviter la boucle infinie

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    url.searchParams.set('section', newSection);
    window.history.replaceState({}, '', url.toString());
  };

  // Thèmes différents selon la section pour une expérience immersive
  const getSectionTheme = (section: string) => {
    switch (section) {
      case 'dashboard': return 'auto';
      case 'savings': return 'morning';
      case 'cashflow': return 'evening';
      case 'cpp': return 'afternoon';
      case 'combined-pension': return 'premium';
      case 'advanced-expenses': return 'creative';
      case 'tax': return 'night';
      case 'simulator': return 'premium';
      case 'session': return 'morning';
      case 'backup-security': return 'night';
      case 'reports': return 'evening';
      case 'premium-features': return 'premium';
      case 'demos': return 'auto';
      default: return 'auto';
    }
  };

  // Fonction supprimée - plus de vérification d'accès interne

  // Ancien système de tabs supprimé - navigation gérée par UniformHeader

  // Fonctions de plan supprimées - plus utilisées

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Contenu de la section active directement sous le menu */}
      <div className="container mx-auto px-6 py-8">
        <RetirementApp 
          activeSection={activeSection || new URLSearchParams(window.location.search).get('section') || 'dashboard'} 
          onSectionChange={handleSectionChange}
          onDataLoad={(data) => console.log('Données chargées:', data)}
        />
      </div>
    </div>
  );
};

export default RetraiteModuleFr;
