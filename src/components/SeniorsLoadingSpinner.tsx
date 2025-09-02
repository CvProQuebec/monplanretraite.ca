import React from 'react';

const SeniorsLoadingSpinner: React.FC = () => {
  return (
    <div className="loading-seniors min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="spinner-large animate-spin rounded-full h-24 w-24 border-4 border-blue-300 border-t-blue-600"></div>
      <p className="text-xl button-text">Préparation de vos calculs...</p>
    </div>
  );
};

export default SeniorsLoadingSpinner;
