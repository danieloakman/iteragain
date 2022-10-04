/* eslint-disable no-console */
import { walkdirSync } from 'more-node-fs';
import { iter } from '../src';
import { join, basename, dirname } from 'path';
import { watchFile, unlinkSync, readFileSync, writeFileSync, existsSync, Stats } from 'fs';

const CLEAN_MODE = process.argv.includes('--clean') || process.argv.includes('-c');
const WATCH_MODE = process.argv.includes('--watch') || process.argv.includes('-w');

type AsyncableFile = {
  src: string;
  dest: string;
  contents: string;
};

type AsyncifyCommand = {
  cmd: string;
  args: string[];
}

const ASYNCIFY = /\/\* *asyncify\([a-z]+\) *\*\//gim;
const COMMENT = /^ *\/\*|\*\/ *$/g;
const COMMAND_AND_ARGS = /\/\* *[a-z]{1,2}\([^*/]*\) *\*\//;
// const NEW_LINE_OR_CARRIAGE_RETURN = /\r|\n/;

function createFile(path: string, stats: Stats): AsyncableFile | null {
  if (!stats.isFile()) return null;
  const contents = readFileSync(path, 'utf8');
  const match = contents.match(ASYNCIFY);
  if (match) {
    const { args: [destFileName] } = parseCommand(match[0]);
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

function parseCommand(rawCommand: string): AsyncifyCommand {
  try {
    const [cmd, argStr] = rawCommand.split('(').map(str => str.replace(COMMENT, '').trim());
    const args = argStr.split(',').map(str => str.replace(')', '').trim());
    return { cmd, args };
  } catch (err) {
    console.error(`Error parsing command "${rawCommand}"\n`, err.stack);
    return { cmd: '', args: [] };
  }
}

function asyncifyFile(file: AsyncableFile) {
  let newContents = file.contents.replace(ASYNCIFY, '').trimStart();
  let match: ReturnType<typeof String.prototype.match>;
  while ((match = newContents.match(COMMAND_AND_ARGS)) !== null) {
    if (typeof match.index !== 'number') continue;
    const { cmd, args } = parseCommand(match[0]);
    switch (cmd) {
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
        loop: for (let i = match.index - 1; i > -1; i--) {
          if (newContents[i] === '\n') {
            for (let j = i + 1; j < newContents.length; j++) {
              if (newContents[j] !== ' ') {
                startOfLine = j;
                break loop;
              }
            }
          }
        }
        // const endOfLine = iter(newContents.slice(match.index))
        //   .zip(count(match.index))
        //   .takeWhile(([char]) => !NEW_LINE_OR_CARRIAGE_RETURN.test(char))
        //   .reverse()
        //   .find(([char]) => char !== ' ')?.[1] ?? -1;
        newContents = stringSplice(newContents, match.index, match[0].length);
        if (startOfLine !== -1) newContents = stringSplice(newContents, startOfLine, 0, '// ');
        // if (endOfLine !== -1) newContents = stringSplice(newContents, endOfLine, ???, '');
        break;
      }
    }
  }
  console.log(`Compiled "${file.dest}"`);
  writeFileSync(file.dest, newContents);
}

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
