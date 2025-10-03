const fs = require('fs');
const file = 'src/pages/MaRetraite.tsx';
let s = fs.readFileSync(file, 'utf8');
const startMarker = 'const save = async () => {';
const endMarker = '\n\n  const sportsOptions = useMemo(';
const si = s.indexOf(startMarker);
const ei = s.indexOf(endMarker, si);
if (si === -1 || ei === -1) throw new Error('Markers not found for save()');
const before = s.slice(0, si);
const after = s.slice(ei);
const replacement = `const save = async () => {
    setIsSaving(true);
    try {
      const result = await EnhancedSaveManager.saveWithDialog(userData, { includeTimestamp: true });
      if (result.success) {
        alert((isFrench ? 'Données sauvegardées avec succès !\nFichier : ' : 'Saved successfully!\nFile: ') + (result.filename || ''));
      } else {
        const msg = result.blocked
          ? (isFrench ? \`Sauvegarde bloquée par la licence. Raison : ${result.reason || ''}\` : \`Save blocked by license. Reason: ${result.reason || ''}\`)
          : (result.error || (isFrench ? 'Échec de la sauvegarde.' : 'Save failed.'));
        alert(msg);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      alert((isFrench ? 'Erreur lors de la sauvegarde : ' : 'Error saving: ') + message);
    } finally {
      setIsSaving(false);
    }
  };
\n\n  `;
// Ensure import exists
if (!before.includes("EnhancedSaveManager")) {
  s = s.replace("import '../../senior-unified-styles.css';", "import '../../senior-unified-styles.css';\nimport { EnhancedSaveManager } from '@/services/EnhancedSaveManager';");
  // refresh markers since s changed
}
// reread to ensure import added
s = fs.readFileSync(file, 'utf8');
const si2 = s.indexOf(startMarker);
const ei2 = s.indexOf(endMarker, si2);
const content = s.slice(0, si2) + replacement + s.slice(ei2);
fs.writeFileSync(file, content, 'utf8');
