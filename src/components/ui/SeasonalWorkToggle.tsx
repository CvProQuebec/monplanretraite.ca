import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import SeasonalJobsManager from './SeasonalJobsManager';

interface SeasonalWorkToggleProps {
  personNumber: 1 | 2;
  personName: string;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
}

const SeasonalWorkToggle: React.FC<SeasonalWorkToggleProps> = ({
  personNumber,
  personName,
  userData,
  onDataChange,
  isFrench
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      setIsExpanded(true);
    }
  };

  const seasonalJobsData = personNumber === 1 
    ? userData?.personal?.seasonalJobs1 || []
    : userData?.personal?.seasonalJobs2 || [];

  return (
    <div className="space-y-4">
      {/* Bouton d'activation */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-amber-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isFrench ? 'Emploi saisonnier' : 'Seasonal Work'}
            </h3>
            <p className="text-sm text-gray-600">
              {isFrench 
                ? 'Gérez vos emplois saisonniers avec périodes et gains'
                : 'Manage your seasonal jobs with periods and earnings'
              }
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleToggle}
          variant={isEnabled ? "destructive" : "default"}
          className={isEnabled 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-amber-500 hover:bg-amber-600 text-white"
          }
        >
          {isEnabled ? (
            <>
              <X className="w-4 h-4 mr-2" />
              {isFrench ? 'Désactiver' : 'Disable'}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              {isFrench ? 'Activer' : 'Enable'}
            </>
          )}
        </Button>
      </div>

      {/* Module emploi saisonnier (affiché seulement si activé) */}
      {isEnabled && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-200 shadow-lg">
          <CardHeader className="border-b-4 border-amber-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                {isFrench ? 'Gestion des emplois saisonniers' : 'Seasonal Jobs Management'} - {personName}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-amber-600 hover:text-amber-800"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          
          {isExpanded && (
            <CardContent className="p-6">
              <SeasonalJobsManager
                personNumber={personNumber}
                personName={personName}
                data={seasonalJobsData}
                onDataChange={(data) => {
                  const field = personNumber === 1 ? 'seasonalJobs1' : 'seasonalJobs2';
                  onDataChange({ [field]: data });
                }}
                isFrench={isFrench}
              />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default SeasonalWorkToggle;
