const fs = require('fs');
const file = 'src/pages/Home.tsx';
let s = fs.readFileSync(file, 'utf8');
// Replace the English warning line
s = s.replace(/\?\s*Avoid mistakes that could cost you thousands of dollars'?/g, 'Avoid mistakes that could cost you thousands of dollars');
// Replace the French warning with a safe version by matching the word 'erreurs' and 'milliers'
s = s.replace(/['"][^\n]*erreurs[^\n]*milliers[^\n]*dollars['"]/g, '"Évitez des erreurs qui peuvent vous coûter des milliers de dollars"');
fs.writeFileSync(file, s, 'utf8');
console.log('Replaced warning strings.');
