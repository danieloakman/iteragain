/* eslint-disable no-console */

/*
 * Creates a new Iterator class skeleton with a given file name.
 */
import { promises, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

(async () => {
  process.argv[2];
  if (process.argv.length < 3) {
    console.error('Usage: new:function <file-name>');
    process.exit(1);
  }

  const fileName = process.argv[2].replace(/\.ts$/gi, '');
  const filePath = join(__dirname, `../src/${fileName}.ts`);
  if (existsSync(filePath)) {
    console.error(`File ${fileName}.ts already exists.`);
    process.exit(1);
  }
  await promises.writeFile(
    filePath,
    `
import { IteratorOrIterable } from './internal/types';

/** @todo // TODO: Implement */
export function ${fileName}<T>(arg: IteratorOrIterable<T>): IterableIterator<T> {
  throw new Error(\`Not implemented, typeof arg: \${typeof arg}\`);
}

export default ${fileName};
  `.trim() + '\n',
  );
  console.log(`Created "${filePath}"`);
  execSync(`code ${filePath}`);

  // TODO: add to index.ts as well.
})();
