export interface SavedFileMeta {
  name: string;
  when: string; // ISO date
  method: 'fs' | 'download';
}

const SESSION_META_KEY = 'mpr:lastSaves';

function addMeta(meta: SavedFileMeta) {
  try {
    const existing = sessionStorage.getItem(SESSION_META_KEY);
    const arr: SavedFileMeta[] = existing ? JSON.parse(existing) : [];
    arr.unshift(meta);
    sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(arr.slice(0, 5)));
  } catch {}
}

export const FileSaveService = {
  async saveUserData(userData: any, suggestedName?: string) {
    // Avant sauvegarde, s'assurer que toutes les ventilations de dépenses sont présentes
    const breakdownKeys = [
      'logementBreakdown','servicesPublicsBreakdown','assurancesBreakdown','telecomBreakdown',
      'alimentationBreakdown','transportBreakdown','santeBreakdown','loisirsBreakdown'
    ];
    const snapshot = JSON.parse(JSON.stringify(userData || {}));
    snapshot.cashflow = snapshot.cashflow || {};
    for (const bk of breakdownKeys) {
      if (snapshot.cashflow[bk] == null) snapshot.cashflow[bk] = {};
    }
    const name = suggestedName || `retirement-data-${new Date().toISOString().split('T')[0]}.json`;
    const payload = JSON.stringify(snapshot, null, 2);

    // Try File System Access API
    const anyWindow: any = window as any;
    if (anyWindow.showSaveFilePicker) {
      try {
        const handle = await anyWindow.showSaveFilePicker({
          suggestedName: name,
          types: [{ description: 'Données MonPlanRetraite.ca', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(new Blob([payload], { type: 'application/json' }));
        await writable.close();
        addMeta({ name: handle.name || name, when: new Date().toISOString(), method: 'fs' });
        return { ok: true };
      } catch (e) {
        // fallthrough to download
      }
    }

    // Fallback: force download
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addMeta({ name, when: new Date().toISOString(), method: 'download' });
    return { ok: true };
  },

  getRecentSaves(): SavedFileMeta[] {
    try {
      const raw = sessionStorage.getItem(SESSION_META_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
};

export default FileSaveService;
