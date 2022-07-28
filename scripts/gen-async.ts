/* eslint-disable no-console */
import { walkdirSync } from 'more-node-fs';
import iter from '../src/iter';
import { join, basename, dirname } from 'path';
import { watchFile, unlinkSync, readFileSync, writeFileSync } from 'fs';

type AsyncableFile = {
  src: string;
  dest: string;
  contents: string;
};

const ASYNCABLE = /\/\* *asyncable:[a-z]+ *\*\//gim;
const COMMENT = /^\/\*|\*\/$/g;

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function* matches(regex: RegExp, str: string) {
  regex = new RegExp(regex.source, iter(iter(regex.flags).toSet().values()).join(''));
  let match: RegExpExecArray | null;
  while ((match = regex.exec(str))) yield match;
}

function stringSplice(str: string, index: number, count = 1, add = '') {
  if (index < 0 || count < 0) throw new Error('index and count parameters cannot be less than zero');
  return str.slice(0, index) + add + str.slice(index + count);
}

function asyncifyFile(file: AsyncableFile) {
  let newContents = file.contents.replace(ASYNCABLE, '').trimStart();
  for (const match of matches(/\/\*[a-z]:.+\*\//g, newContents)) {
    const [command, arg] = match[0].split(':').map(str => str.replace(COMMENT, ''));
    switch (command) {
      case 'i':
        newContents = stringSplice(newContents, match.index, match[0].length, arg);
        break;
    }
  }
  console.log(`Compiled "${file.dest}"`);
  writeFileSync(file.dest, newContents);
}

const WATCH_MODE = process.argv.includes('--watch') || process.argv.includes('-w');

iter(walkdirSync(join(__dirname, '../src')))
  .filter(file => file.stats.isFile())
  .map(({ path }) => {
    const contents = readFileSync(path, 'utf8');
    if (ASYNCABLE.test(contents)) {
      const destFileName = contents.match(ASYNCABLE)?.[0].replace(COMMENT, '').split(':')[1].trim() ?? '';
      const dest = join(dirname(path), destFileName);
      if (path === dest) return null;
      return {
        src: path,
        dest,
        contents,
      };
    }
    return null;
  })
  .filter(Boolean)
  .tap(file => {
    if (WATCH_MODE) {
      console.log(`Watching "${basename(file.src)}"`);
      watchFile(file.src, (_curr, _prev) => {
        asyncifyFile(file);
      });
    } else asyncifyFile(file);
  })
  .exhaust();
