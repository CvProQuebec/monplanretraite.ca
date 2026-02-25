import React, { useEffect, useMemo, useState } from 'react';
import BackgroundBackupService, { type BackupConfig, type BackupMeta } from '@/services/BackgroundBackupService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FormGrid, FormRow, Field } from '@/components/forms/FormGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

function fmtDate(iso?: string, isFr?: boolean): string {
  if (!iso) return isFr ? 'Jamais' : 'Never';
  try {
    const d = new Date(iso);
    return d.toLocaleString(isFr ? 'fr-CA' : 'en-CA');
  } catch {
    return iso;
  }
}

export const BackupManagerPanel: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const t = {
    title: isFr ? 'Gestionnaire de sauvegarde locale' : 'Local Backup Manager',
    desc: isFr
      ? 'Sauvegardez vos données chiffrées sur votre appareil (clé USB, disque local). Aucune donnée n’est transmise. Le site conserve uniquement un pointeur et des métadonnées.'
      : 'Backup your encrypted data to your own device (USB key, local disk). No data leaves your browser. The site only stores a pointer and metadata.',
    sessionPwd: isFr ? 'Mot de passe (session)' : 'Password (session)',
    sessionPwdHelp: isFr
      ? 'Utilisé pour chiffrer/déchiffrer les sauvegardes pendant cette session. Non enregistré de façon permanente.'
      : 'Used to encrypt/decrypt backups during this session. Not stored permanently.',
    setPwd: isFr ? 'Définir le mot de passe' : 'Set password',
    backupNow: isFr ? 'Sauvegarder maintenant' : 'Backup now',
    primary: isFr ? 'Sauvegarde principale' : 'Primary backup',
    secondary: isFr ? 'Sauvegarde secondaire' : 'Secondary backup',
    link: isFr ? 'Lier un fichier…' : 'Link a file…',
    unlink: isFr ? 'Délier' : 'Unlink',
    freq: isFr ? 'Fréquence (minutes)' : 'Frequency (minutes)',
    enableAuto: isFr ? 'Sauvegarde automatique' : 'Auto-backup',
    clearAfter: isFr ? 'Vider les données locales après sauvegarde' : 'Clear local data after backup',
    saveCfg: isFr ? 'Enregistrer la configuration' : 'Save configuration',
    restore: isFr ? 'Restaurer depuis la sauvegarde liée' : 'Restore from linked backup',
    lastBackup: isFr ? 'Dernière sauvegarde' : 'Last backup',
    warnings: {
      second: isFr
        ? 'Important: configurez une sauvegarde secondaire (ex.: 2e clé USB) pour éviter toute perte de données.'
        : 'Important: configure a secondary backup (e.g., second USB key) to avoid any data loss.',
      plans: isFr
        ? 'Si votre forfait est réduit (Pro → Gratuit), les fonctionnalités non incluses sont masquées mais vos données ne sont jamais supprimées.'
        : 'If your plan is downgraded (Pro → Free), non-included features are hidden but your data is never deleted.',
      privacy: isFr
        ? 'Confidentialité: tout est 100% local, chiffré AES-256-GCM. Aucun envoi.'
        : 'Privacy: 100% local, AES-256-GCM encryption. No network uploads.'
    },
    status: isFr ? 'Statut' : 'Status',
    linked: isFr ? 'Lié' : 'Linked',
    notLinked: isFr ? 'Non lié' : 'Not linked',
    enabled: isFr ? 'Activé' : 'Enabled',
    disabled: isFr ? 'Désactivé' : 'Disabled',
  };

  const [cfg, setCfg] = useState<BackupConfig>(() => BackgroundBackupService.getConfig());
  const [meta, setMeta] = useState<BackupMeta>(() => BackgroundBackupService.getMeta());
  const [pwd, setPwd] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    let alive = true;
    // small polling to refresh lastBackup and pointers after actions
    const id = window.setInterval(() => {
      if (!alive) return;
      setMeta(BackgroundBackupService.getMeta());
    }, 1500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const warnSecondary = useMemo(() => BackgroundBackupService.shouldWarnSecondBackup(), [meta, cfg]);

  const handleSaveCfg = async () => {
    setBusy(true);
    try {
      BackgroundBackupService.updateConfig(cfg);
      setMsg(isFr ? 'Configuration enregistrée.' : 'Configuration saved.');
    } catch (e) {
      console.error(e);
      setMsg(isFr ? 'Échec de l’enregistrement.' : 'Failed to save configuration.');
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleSetPwd = () => {
    try {
      BackgroundBackupService.setSessionPassword(pwd);
      setMsg(isFr ? 'Mot de passe de session défini.' : 'Session password set.');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setMsg(isFr ? 'Impossible de définir le mot de passe.' : 'Unable to set password.');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const link = async (which: 'primary' | 'secondary') => {
    setBusy(true);
    try {
      await BackgroundBackupService.linkFile(which);
      setMeta(BackgroundBackupService.getMeta());
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const unlink = async (which: 'primary' | 'secondary') => {
    setBusy(true);
    try {
      await BackgroundBackupService.unlinkFile(which);
      setMeta(BackgroundBackupService.getMeta());
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const doBackupNow = async () => {
    setBusy(true);
    try {
      const pass = pwd || BackgroundBackupService.getSessionPassword() || '';
      if (!pass) {
        setMsg(isFr ? 'Veuillez définir un mot de passe de session.' : 'Please set a session password.');
      } else {
        const ok = await BackgroundBackupService.backupNow(pass);
        setMeta(BackgroundBackupService.getMeta());
        setMsg(ok
          ? (isFr ? 'Sauvegarde terminée.' : 'Backup completed.')
          : (isFr ? 'Aucune donnée à sauvegarder.' : 'No data to backup.'));
      }
    } catch (e) {
      console.error(e);
      setMsg(isFr ? 'Sauvegarde échouée.' : 'Backup failed.');
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const doRestore = async () => {
    setBusy(true);
    try {
      const restored = await BackgroundBackupService.proposeRestoreIfNeeded();
      setMsg(restored
        ? (isFr ? 'Données restaurées depuis la sauvegarde.' : 'Data restored from backup.')
        : (isFr ? 'Aucune restauration effectuée.' : 'No restore performed.'));
    } catch (e) {
      console.error(e);
      setMsg(isFr ? 'Restauration échouée.' : 'Restore failed.');
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {warnSecondary && (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900">
            <AlertDescription>⚠️ {t.warnings.second}</AlertDescription>
          </Alert>
        )}
        <Alert className="border-mpr-border bg-mpr-interactive-lt text-mpr-navy">
          <AlertDescription>🔐 {t.warnings.privacy}</AlertDescription>
        </Alert>
        <Alert className="border-gray-200 bg-gray-50 text-gray-800">
          <AlertDescription>ℹ️ {t.warnings.plans}</AlertDescription>
        </Alert>

        {/* Session password */}
        <FormGrid>
          <FormRow cols={3}>
            <Field label={t.sessionPwd} htmlFor="backup-session-password" span={2}>
              <>
                <Input
                  id="backup-session-password"
                  type="password"
                  placeholder={isFr ? 'Mot de passe de sauvegarde' : 'Backup password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
                <p className="text-xs text-gray-600 mt-1">{t.sessionPwdHelp}</p>
              </>
            </Field>
            <Field label={t.setPwd} htmlFor="backup-session-password-button">
              <Button
                id="backup-session-password-button"
                type="button"
                disabled={busy}
                onClick={handleSetPwd}
              >
                {t.setPwd}
              </Button>
            </Field>
          </FormRow>
        </FormGrid>

        <Separator />

        {/* Link/unlink */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">{t.primary}</CardTitle>
              <CardDescription>
                {isFr ? 'Fichier principal' : 'Primary file'} • {meta.primaryLinked ? <Badge>{t.linked}</Badge> : <Badge variant="secondary">{t.notLinked}</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button disabled={busy} onClick={() => link('primary')}>{t.link}</Button>
              <Button variant="outline" disabled={busy || !meta.primaryLinked} onClick={() => unlink('primary')}>{t.unlink}</Button>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">{t.secondary}</CardTitle>
              <CardDescription>
                {isFr ? 'Fichier secondaire (recommandé)' : 'Secondary file (recommended)'} • {meta.secondaryLinked ? <Badge>{t.linked}</Badge> : <Badge variant="secondary">{t.notLinked}</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button disabled={busy} onClick={() => link('secondary')}>{t.link}</Button>
              <Button variant="outline" disabled={busy || !meta.secondaryLinked} onClick={() => unlink('secondary')}>{t.unlink}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Config */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">{isFr ? 'Configuration' : 'Configuration'}</CardTitle>
            <CardDescription>{isFr ? 'Fréquence et effacement local après sauvegarde.' : 'Frequency and local clear after backup.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormGrid>
              <FormRow cols={3}>
                <Field label={t.freq} htmlFor="backup-frequency">
                  <Input
                    id="backup-frequency"
                    type="number"
                    min={1}
                    value={cfg.frequencyMin}
                    onChange={(e) => setCfg((c) => ({ ...c, frequencyMin: Math.max(1, parseInt(e.target.value || '1', 10)) }))}
                  />
                </Field>
                <Field label={t.enableAuto}>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={cfg.enableAutoBackup ? 'default' : 'outline'}
                      onClick={() => setCfg((c) => ({ ...c, enableAutoBackup: true }))}
                    >
                      {t.enabled}
                    </Button>
                    <Button
                      type="button"
                      variant={!cfg.enableAutoBackup ? 'default' : 'outline'}
                      onClick={() => setCfg((c) => ({ ...c, enableAutoBackup: false }))}
                    >
                      {t.disabled}
                    </Button>
                  </div>
                </Field>
                <Field label={t.clearAfter}>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={cfg.clearLocalAfterBackup ? 'default' : 'outline'}
                      onClick={() => setCfg((c) => ({ ...c, clearLocalAfterBackup: true }))}
                    >
                      {t.enabled}
                    </Button>
                    <Button
                      type="button"
                      variant={!cfg.clearLocalAfterBackup ? 'default' : 'outline'}
                      onClick={() => setCfg((c) => ({ ...c, clearLocalAfterBackup: false }))}
                    >
                      {t.disabled}
                    </Button>
                  </div>
                </Field>
              </FormRow>
            </FormGrid>
            <div className="flex gap-2">
              <Button disabled={busy} onClick={handleSaveCfg}>{t.saveCfg}</Button>
              <Button disabled={busy} onClick={doBackupNow}>{t.backupNow}</Button>
              <Button variant="outline" disabled={busy} onClick={doRestore}>{t.restore}</Button>
            </div>
            <div className="text-sm text-gray-700">
              {t.lastBackup}: <strong>{fmtDate(meta.lastBackupISO, isFr)}</strong>
            </div>
          </CardContent>
        </Card>

        {msg && (
          <Alert className="border-gray-200 bg-gray-50 text-gray-900">
            <AlertDescription>{msg}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BackupManagerPanel;
