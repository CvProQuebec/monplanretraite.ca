import React from "react";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const IncomePage: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <Card className="bg-white border-2 border-blue-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">
              {isFrench ? "Revenus" : "Income"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 space-y-2">
            <p>
              {isFrench
                ? "Entrez vos revenus et voyez l'impact sur votre plan."
                : "Enter your income and see the impact on your plan."}
            </p>
            <p className="text-sm text-gray-500">
              {isFrench
                ? "Inclut salaires, pensions, rentes et plus."
                : "Includes salaries, pensions, annuities and more."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomePage;
