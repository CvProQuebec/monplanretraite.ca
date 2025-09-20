import React from "react";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomeOptimized: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <Card className="bg-white border-2 border-blue-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">
              {isFrench ? "Accueil optimisé" : "Optimized Home"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 space-y-2">
            <p>
              {isFrench
                ? "Version optimisée de la page d'accueil. Contenu réfléchi pour une navigation simple."
                : "Optimized version of the home page. Content designed for simple navigation."}
            </p>
            <p className="text-sm text-gray-500">
              {isFrench
                ? "Cette page sera enrichie pour correspondre entièrement à la version française."
                : "This page will be enriched to fully match the French version."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeOptimized;
