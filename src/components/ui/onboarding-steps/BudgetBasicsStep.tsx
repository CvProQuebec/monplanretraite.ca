/**
 * Étape des bases du budget
 */

import React, { useState } from 'react';
import { Calculator, PieChart, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../card';
import { Button } from '../button';
import { Progress } from '../progress';

interface BudgetBasicsStepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const BudgetBasicsStep: React.FC<BudgetBasicsStepProps> = ({ onComplete, onSkip }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const sections = [
    {
      title: "Qu'est-ce qu'un budget ?",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Un budget est un plan qui vous aide à gérer votre argent en comparant vos revenus et vos dépenses.
          </p>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">Formule simple</h4>
              </div>
              <div className="text-center text-lg font-mono bg-white p-3 rounded border">
                Revenus - Dépenses = Surplus (ou Déficit)
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Les 3 types de dépenses",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 mb-2">🏠 Dépenses fixes (essentielles)</h4>
                <p className="text-sm text-red-700 mb-2">Montant identique chaque mois</p>
                <div className="text-xs text-red-600">
                  Exemples : Loyer, assurances, paiements de prêt
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-orange-800 mb-2">🛒 Dépenses variables (nécessaires)</h4>
                <p className="text-sm text-orange-700 mb-2">Montant qui varie mais nécessaires</p>
                <div className="text-xs text-orange-600">
                  Exemples : Épicerie, essence, électricité
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">🎬 Dépenses discrétionnaires (plaisir)</h4>
                <p className="text-sm text-green-700 mb-2">Optionnelles, pour le plaisir</p>
                <div className="text-xs text-green-600">
                  Exemples : Restaurants, loisirs, vêtements non-essentiels
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "La règle 50/30/20",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Une méthode simple pour répartir votre budget :
          </p>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-12 h-8 bg-red-500 rounded mr-3"></div>
              <div className="flex-1">
                <div className="font-semibold">50% - Besoins essentiels</div>
                <div className="text-sm text-gray-600">Logement, nourriture, transport, assurances</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-8 bg-blue-500 rounded mr-3"></div>
              <div className="flex-1">
                <div className="font-semibold">30% - Désirs et loisirs</div>
                <div className="text-sm text-gray-600">Restaurants, divertissement, achats non-essentiels</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-8 bg-green-500 rounded mr-3"></div>
              <div className="flex-1">
                <div className="font-semibold">20% - Épargne et dettes</div>
                <div className="text-sm text-gray-600">Fonds d'urgence, REER, CELI, remboursement de dettes</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quiz rapide",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            Testez vos connaissances :
          </p>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">
                Dans quelle catégorie classeriez-vous "l'abonnement Netflix" ?
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'fixed', label: 'Dépense fixe essentielle' },
                  { id: 'variable', label: 'Dépense variable nécessaire' },
                  { id: 'discretionary', label: 'Dépense discrétionnaire' }
                ].map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="netflix"
                      value={option.id}
                      checked={answers.netflix === option.id}
                      onChange={(e) => setAnswers(prev => ({ ...prev, netflix: e.target.value }))}
                      className="text-blue-600"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {answers.netflix === 'discretionary' && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Correct !</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Netflix est un divertissement, donc une dépense discrétionnaire.
                  </p>
                </div>
              )}
              {answers.netflix && answers.netflix !== 'discretionary' && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                  <div className="flex items-center text-orange-800">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Pas tout à fait...</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Netflix est un divertissement, donc une dépense discrétionnaire (optionnelle).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* En-tête avec progression - Version compacte */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            Les bases du budget
          </h2>
          <span className="text-sm text-gray-500">
            {currentSection + 1} / {sections.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Contenu de la section courante - Scrollable */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-semibold mb-3 text-blue-800">
            {sections[currentSection].title}
          </h3>
          <div className="flex-1 overflow-y-auto">
            {sections[currentSection].content}
          </div>
        </CardContent>
      </Card>

      {/* Navigation - Toujours visible en bas */}
      <div className="flex justify-between items-center pt-3 border-t">
        <Button
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 0}
          size="sm"
        >
          Précédent
        </Button>

        <div className="flex space-x-2">
          {currentSection < sections.length - 1 ? (
            <Button onClick={nextSection} size="sm">
              Suivant
            </Button>
          ) : (
            <Button 
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Étape terminée !
            </Button>
          )}
        </div>
      </div>

      {/* Conseils pratiques - Version compacte */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-3">
          <h4 className="font-semibold text-yellow-800 mb-1 text-sm">💡 Conseil</h4>
          <p className="text-xs text-yellow-700">
            Notez vos dépenses pendant une semaine pour découvrir où va votre argent !
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetBasicsStep;
