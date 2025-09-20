import React from "react";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SpendingPlanning: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <Card className="bg-white border-2 border-blue-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">
              {isFrench ? "Planification des dépenses" : "Spending Planning"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 space-y-2">
            <p>
              {isFrench
                ? "Préparez vos dépenses par catégories, projets et saisons."
                : "Prepare your expenses by categories, projects and seasons."}
            </p>
            <p className="text-sm text-gray-500">
              {isFrench
                ? "Texte simple et clair pour la clientèle 50–90 ans."
                : "Simple, clear text for the 50–90 audience."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpendingPlanning;
