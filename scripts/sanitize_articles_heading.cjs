const fs = require('fs');
const path = require('path');
const file = path.join('src','pages','Home.tsx');
let s = fs.readFileSync(file,'utf8');
s = s.replace(/const articlesHeading[\s\S]*?;\r?\n/, `const articlesHeading = isFrench\n    ? "Bibliothèque d'articles - 44+ articles"\n    : "Articles library - " + totalBlogCount + "+ pieces";\n`);
fs.writeFileSync(file,s,'utf8');
console.log('articlesHeading sanitized');
