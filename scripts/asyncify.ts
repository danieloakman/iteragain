/* eslint-disable no-console */
import { walkdirSync } from 'more-node-fs';
import iter from '../src/iter';
import { join, basename, dirname } from 'path';
import { watchFile, unlinkSync, readFileSync, writeFileSync, existsSync, Stats } from 'fs';

type AsyncableFile = {
  src: string;
  dest: string;
  contents: string;
};

const ASYNCABLE = /\/\* *asyncable:[a-z]+ *\*\//gim;
const COMMENT = /^ *\/\*|\*\/ *$/g;

function createFile(path: string, stats: Stats): AsyncableFile | null {
  if (!stats.isFile()) return null;
  const contents = readFileSync(path, 'utf8');
  if (ASYNCABLE.test(contents)) {
    const destFileName = contents.match(ASYNCABLE)?.[0].replace(COMMENT, '').split(':')[1].trim() ?? '';
    if (!destFileName) throw new Error(`No destination file name found in "${path}"`);
    const dest = join(dirname(path), destFileName) + '.ts';
    if (path === dest) return null;
    if (existsSync(dest)) unlinkSync(dest);
    return {
      src: path,
      dest,
      contents,
    };
  }
  return null;
}

function stringSplice(str: string, index: number, count = 1, add = '') {
  if (index < 0 || count < 0) throw new Error('index and count parameters cannot be less than zero');
  return str.slice(0, index) + add + str.slice(index + count);
}

function asyncifyFile(file: AsyncableFile) {
  let newContents = file.contents.replace(ASYNCABLE, '').trimStart();
  const regex = /\/\*[a-z]{1,2}:[^*/]+\*\/ */;
  let match: ReturnType<typeof String.prototype.match>;
  while ((match = newContents.match(regex)) !== null) {
    if (typeof match.index !== 'number') continue;
    const [command, argStr] = match[0].split(':').map(str => str.replace(COMMENT, ''));
    const args = argStr.split(',').map(str => str.trim());
    switch (command) {
      case 'i':
        // Insert
        newContents = stringSplice(newContents, match.index, match[0].length, args[0]);
        break;
      case 'r': {
        // Replace:
        const start = match.index;
        const end = start + match[0].length;
        let sliced = newContents.slice(end);
        if (args.length > 1) {
          sliced = sliced.replace(args[0], args[1]);
          newContents = stringSplice(newContents, start, newContents.length - start, sliced);
        } else {
          const nextWord = sliced.match(/[A-z<>]+/)?.[0] ?? '';
          if (!nextWord) throw new Error('Could not find next word');
          newContents = stringSplice(newContents, start, (end + nextWord.length) - start, args[0]);
        }
        break;
      } case 'ra':
        // Replace all:
        newContents = stringSplice(newContents, match.index, match[0].length)
          .trim()
          .replace(new RegExp(args[0], 'g'), args[1]);
        break;
      case 'c': {
        // Comment line:
        let startOfLine = -1;
        for (let i = match.index - 1; i > -1; i--)
          if (newContents[i] === '\n') {
            startOfLine = i;
            break;
          }
        newContents = stringSplice(newContents, match.index, match[0].length);
        if (startOfLine !== -1) newContents = stringSplice(newContents, startOfLine + 1, 0, '// ');
        break;
      }
    }
  }
  console.log(`Compiled "${file.dest}"`);
  writeFileSync(file.dest, newContents);
}

const CLEAN_MODE = process.argv.includes('--clean') || process.argv.includes('-c');
const WATCH_MODE = process.argv.includes('--watch') || process.argv.includes('-w');

iter(walkdirSync(join(__dirname, '../src')))
  .filterMap(({ path, stats }) => createFile(path, stats))
  .tap(file => {
    if (CLEAN_MODE) return;
    if (WATCH_MODE) {
      console.log(`Watching "${basename(file.src)}"`);
      watchFile(file.src, (currentStats, _prev) => {
        asyncifyFile(createFile(file.src, currentStats) as AsyncableFile);
      });
    }
    asyncifyFile(file);
  })
  .consume();
