import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { fixCorruptedBirthDates, checkForCorruptedDates } from './utils/dateFixUtility';

// Vérifier et corriger les dates corrompues au démarrage
if (checkForCorruptedDates()) {
  console.log('🔧 Dates corrompues détectées, correction en cours...');
  fixCorruptedBirthDates();
} else {
  console.log('✅ Aucune date corrompue détectée');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
