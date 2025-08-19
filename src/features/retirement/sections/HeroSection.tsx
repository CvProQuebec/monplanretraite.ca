// src/features/retirement/sections/HeroSection.tsx
import React from 'react';
import { Target, Shield, Lock } from 'lucide-react';
import DataBackupManager from '../components/DataBackupManager';
import { SessionAlert } from '../components/SessionAlert';
import { BackupSecurityTips } from '../components/BackupSecurityTips';
import { PlanIndicator } from '../components/PlanIndicator';
import { useRetirementData } from '../hooks/useRetirementData';

export const HeroSection: React.FC = () => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');
  const { userData, updateUserData } = useRetirementData();

  // Fonction pour mettre à jour toutes les données à partir d'une sauvegarde
  const handleDataLoad = (newData: any) => {
    try {
      console.log('🔄 Début du chargement des données:', newData);
      
      // Vérifier que les données sont valides
      if (!newData || typeof newData !== 'object') {
        console.error('❌ Données invalides reçues:', newData);
        return;
      }
      
      // REMPLACEMENT COMPLET des données utilisateur
      // Au lieu de mettre à jour section par section, on remplace tout
      console.log('🔄 Remplacement complet des données utilisateur...');
      
      // Utiliser directement setUserData du hook pour un remplacement complet
      // Cela évite les problèmes de mise à jour partielle
      if (typeof updateUserData === 'function') {
        // Si updateUserData existe, l'utiliser pour chaque section
        Object.keys(newData).forEach(section => {
          if (section in userData) {
            console.log(`🔄 Mise à jour de la section: ${section}`);
            updateUserData(section as keyof typeof userData, newData[section]);
          } else {
            console.warn(`⚠️ Section inconnue ignorée: ${section}`);
          }
        });
      } else {
        console.warn('⚠️ updateUserData non disponible - données non mises à jour');
      }
      
      console.log('✅ Chargement des données terminé avec succès');
      
      // Afficher une notification de succès
      // Note: useToast n'est pas disponible ici, on utilise une alerte simple
      if (typeof window !== 'undefined') {
        alert('✅ Données chargées avec succès !');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      
      // Afficher une notification d'erreur
      if (typeof window !== 'undefined') {
        alert(`❌ Erreur lors du chargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  const securityText = {
    fr: {
          title: "100 % sécuritaire et confidentiel",
          description: "Vos données sont sauvegardées localement, à l'emplacement de votre choix. Aucune information ne transite par nos serveurs."
        },
        en: {
          title: "100% Secure and Confidential", 
          description: "Your data is saved locally, at the location of your choice. No information is transmitted through our servers."
    }
  };

  const text = isFrench ? securityText.fr : securityText.en;

  return (
    <section className="bg-gradient-to-br from-charcoal-600 to-charcoal-800 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* En-tête avec icône et titre */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mr-6 shadow-lg">
              <Target className="w-10 h-10 text-charcoal-900" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {isFrench ? 'Planification de retraite' : 'Retirement Planning'}
            </h1>
          </div>
          
          {/* Sous-titre principal */}
          <p className="text-2xl md:text-3xl mb-6 text-gray-100 leading-relaxed max-w-4xl mx-auto font-medium">
            {isFrench 
              ? 'Optimisez votre retraite avec notre outil complet de planification.'
              : 'Optimize your retirement with our comprehensive planning tool.'
            }
          </p>

          {/* Zone de sécurité et sauvegarde */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20 max-w-5xl mx-auto">
            {/* Alerte de session */}
            <SessionAlert />
            
            {/* Message de sécurité */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">{text.title}</h3>
                <Lock className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-200 text-base leading-tight max-w-2xl mx-auto line-clamp-2">
                {text.description}
              </p>
            </div>

            {/* Message de responsabilité */}
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 mb-4">
              <p className="text-yellow-100 text-sm text-center font-medium">
                {isFrench 
                  ? '⚠️ Vous êtes responsables de vos données, aucune copie en cache. Sauvegardez vos données régulièrement.'
                  : '⚠️ You are responsible for your data, no cached copies. Back up your data regularly.'
                }
              </p>
            </div>

                         {/* Composant de sauvegarde */}
             <div className="max-w-lg mx-auto">
               <DataBackupManager 
                 data={userData} 
                 onDataLoad={handleDataLoad} 
               />
             </div>

             {/* Indicateur de plan utilisateur */}
             <div className="max-w-md mx-auto mt-6">
               <PlanIndicator />
             </div>

             {/* Conseils de sécurité pour la sauvegarde */}
             <div className="max-w-4xl mx-auto mt-8">
               <BackupSecurityTips />
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 };