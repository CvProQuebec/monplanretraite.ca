const fs = require('fs');
const file = 'src/pages/MaRetraite.tsx';
let s = fs.readFileSync(file, 'utf8');
const startMarker = '  const save = async () => {';
const endMarker = '\n  const sportsOptions = useMemo(';
const si = s.indexOf(startMarker);
const ei = s.indexOf(endMarker, si);
if (si === -1 || ei === -1) { throw new Error('Markers not found. si='+si+' ei='+ei); }
const before = s.slice(0, si);
const after = s.slice(ei);
const replacement = [
  '  const save = async () => {',
  '    setIsSaving(true);',
  '    try {',
  '      const result = await EnhancedSaveManager.saveWithDialog(userData, { includeTimestamp: true });',
  '      if (result.success) {',
  "        alert((isFrench ? 'Données sauvegardées avec succès !\\nFichier : ' : 'Saved successfully!\\nFile: ') + (result.filename || ''));",
  '      } else {',
  '        const msg = result.blocked',
  "          ? (isFrench ? 'Sauvegarde bloquée par la licence. Raison : ' + (result.reason || '') : 'Save blocked by license. Reason: ' + (result.reason || ''))",
  "          : (result.error || (isFrench ? 'Échec de la sauvegarde.' : 'Save failed.'));",
  '        alert(msg);',
  '      }',
  '    } catch (e) {',
  '      const message = e instanceof Error ? e.message : String(e);',
  "      alert((isFrench ? 'Erreur lors de la sauvegarde : ' : 'Error saving: ') + message);",
  '    } finally {',
  '      setIsSaving(false);',
  '    }',
  '  };',
  '',
].join('\n');
if (!s.includes("EnhancedSaveManager")) {
  s = s.replace("import '../../senior-unified-styles.css';", "import '../../senior-unified-styles.css';\nimport { EnhancedSaveManager } from '@/services/EnhancedSaveManager';");
}
const updated = s.slice(0, si) + replacement + after;
fs.writeFileSync(file, updated, 'utf8');
