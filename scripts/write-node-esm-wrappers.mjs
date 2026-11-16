import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const cjsDir = join(root, 'dist/cjs');
const nodeDir = join(root, 'dist/node');

mkdirSync(nodeDir, { recursive: true });

/** @param {string} cjsPath */
function analyzeExports(cjsPath) {
  const content = readFileSync(cjsPath, 'utf8');
  const hasDefaultAssign = /exports\.default\s*=/.test(content);
  const named = [
    ...new Set(
      [...content.matchAll(/exports\.(\w+)\s*=/g)]
        .map((m) => m[1])
        .filter((n) => n !== 'default' && n !== '__esModule'),
    ),
  ];
  return { hasDefaultAssign, named };
}

/**
 * @param {string} basename
 * @param {string} relCjs
 */
function generateWrapper(basename, relCjs) {
  const cjsPath = join(cjsDir, `${basename}.js`);
  const { hasDefaultAssign, named } = analyzeExports(cjsPath);
  const lines = [`import * as mod from '${relCjs}';`, ''];
  for (const n of named) {
    lines.push(`export const ${n} = mod.${n};`);
  }
  if (hasDefaultAssign) {
    const def = named.includes(basename)
      ? `mod.${basename}`
      : named.length === 1
        ? `mod.${named[0]}`
        : `mod.default`;
    lines.push(`export default ${def};`);
  }
  return lines.join('\n') + '\n';
}

const require = createRequire(join(root, 'package.json'));

for (const file of readdirSync(cjsDir)) {
  if (!file.endsWith('.js')) continue;
  const basename = file.replace(/\.js$/, '');
  const cjsPath = join(cjsDir, file);
  if (!/exports\.\w+\s*=/.test(readFileSync(cjsPath, 'utf8'))) continue;
  writeFileSync(join(nodeDir, file), generateWrapper(basename, `../cjs/${file}`));
}

const indexNames = Object.keys(require(join(cjsDir, 'index.js'))).filter(
  (k) => k !== '__esModule' && k !== 'default',
);
const indexLines = [`import * as mod from '../cjs/index.js';`, ''];
for (const name of indexNames.sort()) {
  indexLines.push(`export const ${name} = mod.${name};`);
}
writeFileSync(join(nodeDir, 'index.js'), indexLines.join('\n') + '\n');