import React from "react";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SaveLoad: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === "fr";

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <Card className="bg-white border-2 border-mpr-border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-mpr-navy">
              {isFrench ? "Sauvegarder / Charger" : "Save / Load"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700 space-y-2">
            <p>
              {isFrench
                ? "Enregistrez votre dossier localement et restaurez-le au besoin."
                : "Save your file locally and restore it when needed."}
            </p>
            <p className="text-sm text-gray-500">
              {isFrench
                ? "Zéro nuage — vos données restent sur votre appareil."
                : "Zero cloud — your data stays on your device."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaveLoad;
