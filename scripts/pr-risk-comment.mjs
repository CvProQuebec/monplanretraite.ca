#!/usr/bin/env node
import fs from 'fs';

const token = process.env.GITHUB_TOKEN;
const eventPath = process.env.GITHUB_EVENT_PATH;

if (!token) {
  console.error('❌ GITHUB_TOKEN manquant : configurez le secret dans GitHub Actions.');
  process.exit(1);
}

if (!eventPath || !fs.existsSync(eventPath)) {
  console.error('❌ GITHUB_EVENT_PATH introuvable. Ce script doit être exécuté dans GitHub Actions (pull_request).');
  process.exit(1);
}

const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const pullRequest = event.pull_request;
const repository = event.repository;

if (!pullRequest || !repository) {
  console.error('❌ Événement incompatible. Ce workflow doit être déclenché par un pull_request.');
  process.exit(1);
}

const owner = repository.owner.login;
const repo = repository.name;
const pullNumber = pullRequest.number;

const apiBase = 'https://api.github.com';
const baseHeaders = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'mpr-risk-reporter'
};

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: baseHeaders,
    ...options
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Échec requête GitHub ${res.status} ${res.statusText}: ${body}`);
  }
  return res;
}

async function fetchAllPRFiles() {
  const files = [];
  let page = 1;

  while (true) {
    const res = await request(
      `${apiBase}/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`
    );
    const batch = await res.json();
    files.push(...batch);
    if (batch.length < 100) {
      break;
    }
    page += 1;
  }

  return files;
}

function evaluateRisk(files) {
  const riskRules = [
    {
      level: 'Élevé',
      pattern: /(src\/lib\/|secureStorage|BackgroundBackupService|fileCrypto|public\/_headers|security|SecurityMiddleware)/,
      reason: 'Sécurité/chiffrement ou CSP touchés — valider conformité “100 % local” et en-têtes Netlify.'
    },
    {
      level: 'Élevé',
      pattern: /(src\/features\/retirement\/services\/|useRetirementData|TaxOptimizationService|MonteCarloService|BackgroundBackupService)/,
      reason: 'Calculs retraite critiques — impacts possibles sur projections, optimisation fiscale ou sauvegardes.'
    },
    {
      level: 'Moyen',
      pattern: /(src\/services\/|src\/components\/forms\/|src\/pages\/|senior-unified-styles\.css|src\/features\/retirement\/components\/)/,
      reason:
        'UI seniors ou services partagés modifiés — vérifier uniformisation `.mpr-form`, accessibilité et cohérence métier.'
    },
    {
      level: 'Moyen',
      pattern: /(scripts\/|netlify\/|vite\.config|tailwind\.config)/,
      reason: 'Infrastructure de build/déploiement modifiée — risques de régression CI/CD.'
    }
  ];

  const matchedReasons = new Set();
  let highestRisk = 'Faible';

  for (const file of files) {
    const filePath = file.filename;
    for (const rule of riskRules) {
      if (rule.pattern.test(filePath)) {
        matchedReasons.add(rule.reason);
        if (rule.level === 'Élevé') {
          highestRisk = 'Élevé';
        } else if (rule.level === 'Moyen' && highestRisk !== 'Élevé') {
          highestRisk = 'Moyen';
        }
      }
    }
  }

  if (highestRisk === 'Faible' && files.some(f => f.status === 'added' || f.status === 'removed')) {
    highestRisk = 'Moyen';
    matchedReasons.add('Ajout ou suppression de fichiers — valider impact sur la couverture fonctionnelle.');
  }

  return { level: highestRisk, reasons: Array.from(matchedReasons) };
}

function buildSuggestions(files) {
  const suggestions = new Set();

  const touchedPaths = files.map(f => f.filename);

  if (touchedPaths.some(p => /\.tsx?$/.test(p))) {
    suggestions.add('Passer `npm run typecheck && npm run lint` pour sécuriser le typage et les hooks React.');
    suggestions.add(
      'Relire les libellés avec les règles OQLF (espaces avant : % $, titres avec seule la première majuscule, aucun anglicisme).'
    );
  }

  if (touchedPaths.some(p => /(forms|Form|mpr-form|senior-unified-styles\.css)/.test(p))) {
    suggestions.add(
      'Confirmer la grille `.mpr-form` : 1 ligne = 1 label + 1 champ (desktop/mobile), focus visible et labels tronqués.'
    );
  }

  if (touchedPaths.some(p => /(secureStorage|BackgroundBackupService|fileCrypto|public\/_headers)/.test(p))) {
    suggestions.add(
      'Retester l’export/import chiffré (.mpru), le verrouillage 5 min et la CSP (DevTools → Network = 0 fuite).'
    );
  }

  if (touchedPaths.some(p => /(TaxOptimizationService|MonteCarlo|workers|CalculationService)/.test(p))) {
    suggestions.add(
      'Exécuter les scénarios critiques (optimisation fiscale, Monte Carlo, calculs RRQ/SRG) et vérifier le temps de réponse.'
    );
  }

  if (touchedPaths.some(p => /(scripts\/|netlify\/|vite\.config|tailwind\.config)/.test(p))) {
    suggestions.add(
      'Valider le pipeline CI/CD (build Vite, Netlify, bundle-size) et documenter toute variable d’environnement ajoutée.'
    );
  }

  if (suggestions.size === 0) {
    suggestions.add('Confirmer les tests de non-régression (`npm run test`, scénarios seniors critiques).');
  }

  return Array.from(suggestions);
}

// Build immutable Markdown comment
function buildComment({ files, risk, suggestions }) {
  const totalFiles = files.length;
  const totalAdditions = files.reduce((sum, f) => sum + (f.additions || 0), 0);
  const totalDeletions = files.reduce((sum, f) => sum + (f.deletions || 0), 0);

  const topFiles = files
    .slice(0, 10)
    .map(f => `- \`${f.filename}\` (+${f.additions}/-${f.deletions})`)
    .join('\n');

  const reasonsText =
    risk.reasons.length > 0
      ? risk.reasons.map(r => `- ${r}`).join('\n')
      : '- Aucun point critique détecté automatiquement, relecture manuelle requise.';

  const suggestionsText = suggestions.map(s => `- ${s}`).join('\n');

  const commentLines = [
    '<!-- pr-risk-report -->',
    '## Rapport automatisé — Risques & recommandations',
    '',
    '### Synthèse',
    `- PR #${pullNumber} — **${pullRequest.title ?? 'Sans titre'}**`,
    `- Fichiers modifiés : **${totalFiles}**`,
    `- Delta : **+${totalAdditions} / -${totalDeletions}**`,
    '',
    `### Niveau de risque estimé : **${risk.level}**`,
    reasonsText,
    '',
    '### Fichiers examinés (top 10)',
    topFiles || '- (Aucun fichier listé)',
    '',
    '### Pistes de vérification / patchs suggérés',
    suggestionsText,
    '',
    '> ⚠️ Vérification automatisée. Merci de compléter avec les tests manuels seniors, les contrôles OQLF et la checklist sécurité locale.'
  ];

  return commentLines.join('\n');
}

async function upsertComment(body) {
  const commentsRes = await request(
    `${apiBase}/repos/${owner}/${repo}/issues/${pullNumber}/comments?per_page=100`
  );
  const comments = await commentsRes.json();

  const existing = comments.find(comment => comment.body && comment.body.startsWith('<!-- pr-risk-report -->'));

  if (existing) {
    await request(`${apiBase}/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body })
    });
    console.log(`✅ Commentaire de risques mis à jour (id: ${existing.id}).`);
  } else {
    await request(`${apiBase}/repos/${owner}/${repo}/issues/${pullNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body })
    });
    console.log('✅ Commentaire de risques créé.');
  }
}

async function run() {
  try {
    const files = await fetchAllPRFiles();
    if (files.length === 0) {
      console.log('ℹ️ Aucun fichier détecté dans la PR — commentaire annulé.');
      return;
    }

    const risk = evaluateRisk(files);
    const suggestions = buildSuggestions(files);
    const commentBody = buildComment({ files, risk, suggestions });

    await upsertComment(commentBody);
  } catch (error) {
    console.error('❌ Échec de génération du commentaire de risques:', error);
    process.exit(1);
  }
}

await run();
