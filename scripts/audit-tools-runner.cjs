const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const here = __dirname;
const tsPath = path.join(here, 'audit-tools.ts');
const src = fs.readFileSync(tsPath, 'utf8');
const out = ts.transpileModule(src, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2019,
    jsx: ts.JsxEmit.React,
  },
  fileName: 'audit-tools.ts',
}).outputText;

const Module = module.constructor;
const m = new Module();
m._compile(out, 'audit-tools.cjs');

