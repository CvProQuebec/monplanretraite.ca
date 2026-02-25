// screenshot.mjs — Outil de screenshot Puppeteer pour MonPlanRetraite.ca
// Usage: node screenshot.mjs <url> [label]

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire('/tmp/puppeteer-mpr/package.json');
const puppeteer = require('puppeteer');

const url   = process.argv[2] || 'http://localhost:5173';
const label = process.argv[3] || '';

const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
const numbers  = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n) && n > 0);
const next     = numbers.length ? Math.max(...numbers) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const filepath = path.join(dir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/riven/.cache/puppeteer/chrome/win64-140.0.7339.207/chrome-win64/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: filepath, fullPage: false });
await browser.close();

console.log(`Screenshot sauvegardé : ${filepath}`);
