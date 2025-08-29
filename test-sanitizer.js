// Test script pour déboguer le problème de sanitisation
const { InputSanitizer } = require('./src/utils/inputSanitizer.ts');

// Test de la fonction sanitizeName
const testInput = "Marie Claire Dubois";
console.log("Input:", testInput);
console.log("Output sanitizeName:", InputSanitizer.sanitizeName(testInput));

// Test de la fonction sanitizeUserData
const testData = { prenom2: "Marie Claire Dubois" };
console.log("Input data:", testData);
console.log("Output sanitizeUserData:", InputSanitizer.sanitizeUserData(testData));
