const fs = require('fs');
const path = require('path');
const file = path.join('src', 'pages', 'Home.tsx');
let text = fs.readFileSync(file, 'utf8');

// 1) Add articlesHeading const if missing
if (!text.includes('const articlesHeading')) {
  const insertAfter = 'const totalBlogCount';
  const idx = text.indexOf(insertAfter);
  if (idx !== -1) {
    const endOfLine = text.indexOf('\n', text.indexOf('\n', idx) + 1);
    const addition = `\n  const articlesHeading = isFrench ? "Bibliothèque d'articles — 44+ articles" : \`Articles library — \${totalBlogCount}+ pieces\`;\n`;
    text = text.slice(0, endOfLine + 1) + addition + text.slice(endOfLine + 1);
  }
}

// 2) Replace heading content with {articlesHeading}
text = text.replace(/\{\s*isFrench\s*\?\s*`Bibli[\s\S]*?pieces`\s*\}/, '{articlesHeading}');

// 3) Update FR disclaimers array: remove two bullets and shorten the plans one
text = text.replace(
  /(const disclaimers = useMemo\([\s\S]*?\? \[)([\s\S]*?)\]\s*:\s*\[/,
  (m, p1, p2) => {
    // Build new FR array
    const fr = [
      "Outil éducatif seulement : aucun conseil financier, fiscal ou juridique personnalisé.",
      "Données 100 % locales : elles restent sur votre appareil (chiffrement AES-256).",
      "Plans annuels uniquement",
    ];
    return p1 + '\n            ' + fr.map(s => JSON.stringify(s)).join(',\n            ') + '\n          ] : [';
  }
);

// 4) Remove FR FAQ item "Avez-vous des promotions ?"
text = text.replace(
  /(const faqItems = useMemo\([\s\S]*?\? \[)([\s\S]*?)\](\s*:\s*\[)/,
  (m, p1, body, tail) => {
    // Split crude objects; remove the one containing the question
    const parts = body.split(/},\s*\{/).map((seg, i, arr) => (i===0?seg: '{'+seg) + (i<arr.length-1?'}':''));
    const filtered = parts.filter(seg => !seg.includes("Avez-vous des promotions"));
    const rebuilt = filtered.join(',\n            ');
    return p1 + rebuilt + ']' + tail;
  }
);

fs.writeFileSync(file, text, 'utf8');
console.log('Applied French homepage copy updates.');
