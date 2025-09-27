const fs = require('fs');
const path = require('path');
const file = path.join('src','pages','Home.tsx');
let s = fs.readFileSync(file,'utf8');
const startMarker = '{/* SECTION 4: Plan comparison - SIMPLIFIED VERSION (70% shorter) */}';
const start = s.indexOf(startMarker);
if (start !== -1) {
  const endMarker = '\n      <Card className="bg-amber-50';
  const end = s.indexOf(endMarker, start);
  if (end !== -1) {
    s = s.slice(0, start) + s.slice(end);
    fs.writeFileSync(file, s, 'utf8');
    console.log('Legacy plans block removed.');
  } else {
    console.log('End marker not found; no change.');
  }
} else {
  console.log('Start marker not found; no change.');
}
