const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const here = __dirname;
const tsPath = path.join(here, 'generate-missing-tool-routes.ts');
if (!fs.existsSync(tsPath)) {
  console.error('Missing generator TS file at', tsPath);
  process.exit(1);
}
const src = fs.readFileSync(tsPath, 'utf8');
const out = ts.transpileModule(src, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2019,
    jsx: ts.JsxEmit.React,
  },
  fileName: 'generate-missing-tool-routes.ts',
}).outputText;

const Module = module.constructor;
const m = new Module();
m._compile(out, 'generate-missing-tool-routes.cjs');

