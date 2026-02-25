import React from "react";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RealEstatePage: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <Card className="bg-white border-2 border-mpr-border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-mpr-navy">
              {isFrench ? "Immobilier" : "Real Estate"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 space-y-2">
            <p>
              {isFrench
                ? "Gérez vos propriétés et voyez l'impact sur votre retraite."
                : "Manage your properties and see the impact on your retirement."}
            </p>
            <p className="text-sm text-gray-500">
              {isFrench
                ? "Décisions simples : garder, vendre ou louer."
                : "Simple choices: keep, sell or rent."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstatePage;
