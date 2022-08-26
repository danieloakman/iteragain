/* eslint-disable no-console */
import { walkdirSync } from 'more-node-fs';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import iter from '../src/iter';
import { format } from 'prettier';

function genUnformattedTest(testNames: string[]): string {
  if (!testNames.length) return '';
  return `
  ${testNames.length < 2 ? 'it' : 'describe'}('${testNames.shift()}', async function () {
    ${genUnformattedTest(testNames)}
  });
  `.trim();
}
function genTest(testNames: string[]): string {
  return format(genUnformattedTest(testNames), { parser: 'typescript' });
}

(async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: new:test <group/test/name>');
    process.exit(1);
  }

  const testNames = process.argv[2].split(/\/|\\/);
  const testFile = readFileSync(join(__dirname, '../test/index.test.ts'), { encoding: 'utf-8' });
  const newTest = format(genTest(testNames), { parser: 'typescript' });
  console.log(newTest);
  // TODO: add newTest to testFile in correct order.
})();
