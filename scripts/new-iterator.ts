/* eslint-disable no-console */

/*
 * Creates a new Iterator class skeleton with a given file name.
 */
import { promises, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

(async () => {
  if (process.argv.length < 3) {
    console.error('Usage: new:iterator <file-name>');
    process.exit(1);
  }

  const fileName = process.argv[2].replace(/(\..+|iterator)$/gi, '').replace(/^./, c => c.toUpperCase()) + 'Iterator';
  const filePath = join(__dirname, `../src/internal/${fileName}.ts`);
  if (existsSync(filePath)) {
    console.error(`File ${fileName}.ts already exists.`);
    process.exit(1);
  }
  await promises.writeFile(
    filePath,
    `
export class ${fileName}<T> implements IterableIterator<T> {
  constructor(protected iterator: Iterator<T>) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    return this.iterator.next();
  }
}

export default ${fileName};
  `.trim() + '\n',
  );
  console.log(`Created "${filePath}"`);
  execSync(`code ${filePath}`);
})();
