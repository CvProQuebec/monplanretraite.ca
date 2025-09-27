// Lightweight runner that transpiles scripts/audit-nav.ts with TypeScript and executes it.
// No network, no writes under src/**.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const here = __dirname;
const tsPath = path.join(here, 'audit-nav.ts');
const src = fs.readFileSync(tsPath, 'utf8');
const out = ts.transpileModule(src, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2019,
    jsx: ts.JsxEmit.React,
  },
  fileName: 'audit-nav.ts',
}).outputText;

// Execute in-place without writing temp files
// Wrap as a CommonJS module
const Module = module.constructor;
const m = new Module();
m._compile(out, 'audit-nav.cjs');

