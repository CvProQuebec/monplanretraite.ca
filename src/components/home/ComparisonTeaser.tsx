import React from 'react';
import { Link } from 'react-router-dom';

export function ComparisonTeaser({ className = '' }: { className?: string }) {
  return (
    <div className={`comparison-teaser bg-mpr-interactive-lt rounded-lg p-8 border-2 border-mpr-border ${className}`}>
      <div className="teaser-content text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos calculs vs autres calculateurs</h2>

        <div className="advantage-highlight mb-6">
          <div className="text-5xl font-bold text-green-600 mb-2">+47&nbsp;000&nbsp;$</div>
          <p className="text-xl text-gray-700">en moyenne de différence grâce aux normes IPF 2025</p>
        </div>

        <div className="features-list mb-6">
          <div className="feature-item flex items-center justify-center mb-3">
            <span className="feature-icon text-green-600 text-2xl mr-4">✓</span>
            <span className="text-lg">Normes IPF 2025 officielles</span>
          </div>
          <div className="feature-item flex items-center justify-center mb-3">
            <span className="feature-icon text-green-600 text-2xl mr-4">✓</span>
            <span className="text-lg">Table de mortalité CPM2014</span>
          </div>
          <div className="feature-item flex items-center justify-center">
            <span className="feature-icon text-green-600 text-2xl mr-4">✓</span>
            <span className="text-lg">Spécialement conçu pour le Québec</span>
          </div>
        </div>

        <Link
          to="/comparaison"
          className="cta-button inline-block bg-mpr-interactive text-white text-xl font-bold py-4 px-8 rounded-lg hover:bg-mpr-interactive-dk transition-colors"
        >
          Voir la comparaison détaillée
        </Link>
      </div>
    </div>
  );
}

export default ComparisonTeaser;
