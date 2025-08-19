import React from 'react';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { SimpleNavigation } from '../components/layout/header/SimpleNavigation';

const RetraiteEntreeFr: React.FC = () => {
  return (
    <Phase2Wrapper 
      theme="premium" 
      showParticles={true} 
      showPhysics={true}
      enableThemeRotation={true}
      enableAdaptiveLayout={true}
    >
      <SimpleNavigation />
      
      {/* Hero Section avec thème premium */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Planificateur de retraite
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
              Planifiez votre retraite avec des outils professionnels et des analyses avancées
            </p>
          </div>

          {/* Section Planification financière complète */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 text-center">
              Planification financière complète
            </h2>
            <p className="text-lg text-gray-700 text-center mb-12 max-w-4xl mx-auto">
              Notre plateforme unique vous permet de gérer l'ensemble de votre planification financière, budgétaire et fiscale pour une retraite sereine et optimisée.
            </p>

            {/* Cartes de fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gestion du flux de trésorerie */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">
                  Gestion du flux de trésorerie (cashflow)
                </h3>
                <p className="text-blue-700 text-center text-sm">
                  Analysez et optimisez vos flux de dépenses pour maximiser vos économies
                </p>
              </div>

              {/* Stratégies de décaissement */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2 text-center">
                  Stratégies de décaissement
                </h3>
                <p className="text-green-700 text-center text-sm">
                  Déterminez le meilleur moment pour retirer de vos investissements
                </p>
              </div>

              {/* Planification des dépenses */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2 text-center">
                  Planification des dépenses
                </h3>
                <p className="text-purple-700 text-center text-sm">
                  Évaluez l'impact des gros achats sur vos revenus futurs
                </p>
              </div>

              {/* Optimisation fiscale */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">
                  Optimisation fiscale
                </h3>
                <p className="text-blue-700 text-center text-sm">
                  Minimisez vos impôts avec des stratégies de retrait intelligentes
                </p>
              </div>
            </div>
          </div>

          {/* Section Comparaison des plans */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Comparaison des plans
            </h2>
            <p className="text-xl text-blue-100 text-center mb-12 max-w-3xl mx-auto">
              Découvrez ce qui est inclus dans chaque plan et choisissez celui qui correspond à vos besoins
            </p>

            {/* Tableau de comparaison */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-blue-600">
                    <th className="py-4 px-6 text-white font-semibold text-lg">Fonctionnalité</th>
                    <th className="py-4 px-6 text-center">
                      <div className="text-white font-semibold">Gratuit</div>
                      <div className="text-blue-200 text-sm">Gratuit</div>
                    </th>
                    <th className="py-4 px-6 text-center">
                      <div className="text-white font-semibold">Professionnel</div>
                      <div className="text-blue-200 text-sm">119,99$/an</div>
                    </th>
                    <th className="py-4 px-6 text-center">
                      <div className="text-white font-semibold">Ultime</div>
                      <div className="text-blue-200 text-sm">239,99$/an</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-blue-100">
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Planification de base</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Gestion du profil personnel</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Calculs de retraite de base</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Gestion de l'épargne</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Gestion du cashflow</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Projets de dépenses</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Stratégies de décaissement</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Simulations Monte Carlo</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Optimisation fiscale</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Conseils personnalisés par IA</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Rapports détaillés</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Export PDF</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6">Support prioritaire</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Nos forfaits annuels */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
              Nos forfaits annuels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan Gratuit */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Essai
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuit</h3>
                  <p className="text-gray-600 mb-4">Commencez votre planification retraite</p>
                  <div className="text-4xl font-bold text-gray-900">0$</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Gestion de cashflow de base
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1 projet de dépense
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Planification de base
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sauvegarde locale
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Commencer gratuitement
                </button>
              </div>

              {/* Plan Professionnel */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-500 relative hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full">
                    Recommandé
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Professionnel</h3>
                  <p className="text-gray-600 mb-4">Pour une planification avancée</p>
                  <div className="text-4xl font-bold text-gray-900">119,99 $</div>
                  <p className="text-gray-500 text-sm">par an</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Gestion avancée du cashflow
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Stratégies de décaissement
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100 simulations Monte Carlo
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Projets de dépenses multiples
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Optimisation fiscale de base
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Choisir Professionnel
                </button>
              </div>

              {/* Plan Ultime */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Premium
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ultime</h3>
                  <p className="text-gray-600 mb-4">Solution complète avec IA</p>
                  <div className="text-4xl font-bold text-gray-900">239,99 $</div>
                  <p className="text-gray-500 text-sm">par an</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Gestion experte du cashflow
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Stratégies de décaissement avec IA
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Simulations Monte Carlo illimitées
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Optimisation fiscale avancée
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Conseils personnalisés par IA
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Choisir Ultimate
                </button>
              </div>
            </div>
          </div>

          {/* Section Avertissement important */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 md:p-12 mb-16">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                  Avertissement important
                </h3>
                <p className="text-yellow-700 text-lg mb-6">
                  Cette plateforme de planification financière est un outil éducatif et informatif qui ne remplace en aucun cas une consultation avec un professionnel qualifié.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-3">VOS RESPONSABILITÉS :</h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Consultez un planificateur financier autorisé pour les décisions importantes
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Vérifiez la validité fiscale de vos stratégies avec un fiscaliste
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Obtenez des conseils juridiques pour la planification successorale
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-3">AVANTAGES DE NOTRE SOLUTION :</h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Gagnez du temps en préparant votre dossier à l'avance
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Réduisez le nombre de rencontres avec vos professionnels
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Reprenez le contrôle de vos finances avec des outils professionnels
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Optimisez vos consultations grâce à une meilleure compréhension
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Bienvenue et code promo */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">M</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Bienvenue Gerald Dore !
              </h2>
              <p className="text-green-100 text-lg mb-8">
                Avez-vous un code promo ? Débloquez des fonctionnalités supplémentaires !
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Entrez votre code promo...."
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
                  />
                  <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Phase2Wrapper>
  );
};

export default RetraiteEntreeFr;
