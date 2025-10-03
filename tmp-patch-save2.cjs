const fs = require('fs');
const file = 'src/pages/MaRetraite.tsx';
let s = fs.readFileSync(file, 'utf8');
const startMarker = '  const save = async () => {';
const endMarker = '  }'; // first closing brace line followed by ;
const si = s.indexOf(startMarker);
if (si === -1) throw new Error('save() start not found');
// find end by locating '}\r\n\r\n  const sportsOptions'
const sportsIdx = s.indexOf('\n\n  const sportsOptions', si);
if (sportsIdx === -1) throw new Error('sportsOptions marker not found');
const before = s.slice(0, si);
const after = s.slice(sportsIdx);
const replacement = `  const save = async () => {
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

`;
// ensure import
if (!s.includes("EnhancedSaveManager")) {
  s = s.replace("import '../../senior-unified-styles.css';", "import '../../senior-unified-styles.css';\nimport { EnhancedSaveManager } from '@/services/EnhancedSaveManager';");
}
const content = s.slice(0, s.indexOf('import', 0)) + s.slice(s.indexOf('import', 0));
fs.writeFileSync(file, before + replacement + after, 'utf8');
