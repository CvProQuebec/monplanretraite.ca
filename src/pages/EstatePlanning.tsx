import React from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EstatePlanning: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  return (
    <div className='min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50'>
      <div className='container mx-auto px-6 py-10'>
        <Card className='bg-white border-2 border-mpr-border shadow-xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold text-mpr-navy'>
              {isFrench ? 'Planification successorale' : 'Estate Planning'}
            </CardTitle>
          </CardHeader>
          <CardContent className='text-center text-gray-700 space-y-2'>
            <p>
              {isFrench 
                ? 'Préparez votre héritage et protégez vos proches.'
                : 'Prepare your legacy and protect your loved ones.'}
            </p>
            <p className='text-sm text-gray-500'>
              {isFrench 
                ? 'Version anglaise harmonisée avec la page FR.'
                : 'English version aligned with the FR page.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstatePlanning;
