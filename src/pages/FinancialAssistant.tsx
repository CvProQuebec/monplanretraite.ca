import React from "react";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialAssistant: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <Card className="bg-white border-2 border-blue-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">
              {isFrench ? "Assistant financier" : "Personal Financial Assistant"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 space-y-2">
            <p>
              {isFrench
                ? "Votre copilote pour éviter les grosses erreurs financières."
                : "Your co‑pilot to avoid costly financial mistakes."}
            </p>
            <p className="text-sm text-gray-500">
              {isFrench
                ? "Version anglaise alignée avec la page française."
                : "English version aligned with the French page."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialAssistant;
