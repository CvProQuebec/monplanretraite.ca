import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, Settings, BarChart3 } from 'lucide-react';
import RRQSimpleForm from './RRQSimpleForm';
import RRQSummary from './RRQSummary';

interface RRQManagerProps {
  personNumber: 1 | 2;
  personName: string;
  userData: any;
  onDataChange: (data: any) => void;
  isFrench: boolean;
}

const RRQManager: React.FC<RRQManagerProps> = ({
  personNumber,
  personName,
  userData,
  onDataChange,
  isFrench
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'summary'>('input');

  return (
    <Card className="bg-white border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
        <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-3">
          <Flag className="w-8 h-8" />
          {isFrench ? 'RRQ/CPP - Gestion 2025' : 'QPP/CPP - 2025 Management'}
        </CardTitle>
        <p className="text-blue-600">
          {isFrench 
            ? 'Personne ' + personNumber + ' - Configuration et suivi des montants RRQ'
            : 'Person ' + personNumber + ' - RRQ amounts configuration and tracking'
          }
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Onglets */}
        <div className="flex border-b border-gray-200">
          <Button
            variant={activeTab === 'input' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('input')}
            className={`flex-1 rounded-none border-0 ${
              activeTab === 'input' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isFrench ? 'Saisie des données' : 'Data Entry'}
          </Button>
          <Button
            variant={activeTab === 'summary' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('summary')}
            className={`flex-1 rounded-none border-0 ${
              activeTab === 'summary' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {isFrench ? 'Résumé' : 'Summary'}
          </Button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-0">
          {activeTab === 'input' && (
            <RRQSimpleForm
              personNumber={personNumber}
              personName={personName}
              userData={userData}
              onDataChange={onDataChange}
              isFrench={isFrench}
            />
          )}
          {activeTab === 'summary' && (
            <RRQSummary
              personNumber={personNumber}
              userData={userData}
              isFrench={isFrench}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RRQManager;
