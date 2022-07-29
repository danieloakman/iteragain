/* eslint-disable no-console */
import { walkdirSync } from 'more-node-fs';
import iter from '../src/iter';
import { join, basename, dirname } from 'path';
import { watchFile, unlinkSync, readFileSync, writeFileSync, existsSync } from 'fs';

type AsyncableFile = {
  src: string;
  dest: string;
  contents: string;
};

const ASYNCABLE = /\/\* *asyncable:[a-z]+ *\*\//gim;
const COMMENT = /^ *\/\*|\*\/ *$/g;

function stringSplice(str: string, index: number, count = 1, add = '') {
  if (index < 0 || count < 0) throw new Error('index and count parameters cannot be less than zero');
  return str.slice(0, index) + add + str.slice(index + count);
}

function asyncifyFile(file: AsyncableFile) {
  let newContents = file.contents.replace(ASYNCABLE, '').trimStart();
  const regex = /\/\*[a-z]:[^*/]+\*\/ */g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(newContents))) {
    const [command, argStr] = match[0].split(':').map(str => str.replace(COMMENT, ''));
    const args = argStr.split(',').map(str => str.trim());
    switch (command) {
      case 'i':
        newContents = stringSplice(newContents, match.index, match[0].length, args[0]);
        break;
      case 'r': {
        const start = match.index;
        const end = start + match[0].length;
        let sliced = newContents.slice(end);
        if (args.length > 1) {
          sliced = sliced.replace(args[0], args[1]);
          newContents = stringSplice(newContents, start, newContents.length - start, sliced);
        } else {
          const nextWord = sliced.match(/[A-z]+/)?.[0] ?? '';
          if (!nextWord) throw new Error('Could not find next word');
          newContents = stringSplice(newContents, start, (end + nextWord.length) - start, args[0]);
        }
        break;
      }
    }
  }
  console.log(`Compiled "${file.dest}"`);
  writeFileSync(file.dest, newContents);
}

const WATCH_MODE = process.argv.includes('--watch') || process.argv.includes('-w');

iter(walkdirSync(join(__dirname, '../src')))
  .filterMap(({ path, stats }) => {
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
  })
  .tap(file => {
    if (WATCH_MODE) {
      console.log(`Watching "${basename(file.src)}"`);
      watchFile(file.src, (_curr, _prev) => {
        asyncifyFile(file);
      });
    } else asyncifyFile(file);
  })
  .exhaust();
