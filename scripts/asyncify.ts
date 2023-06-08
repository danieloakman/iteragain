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
  args: (RegExp | string)[];
};

const ASYNCIFY = /\/\* *asyncify\(['"]?[a-z]+['"]?\) *\*\//gim;
const COMMENT = /^ *\/\*|\*\/ *$/g;
const COMMAND_AND_ARGS = /\/\* *[A-z]+(\((('[^*/()"']+'|"[^*/()"']+"|\/[^*/()"']+\/\w*|[^*/()"']+),? *)*\))? *\*\//;

function createFile(path: string, stats: Stats): AsyncableFile | null {
  if (!stats.isFile()) return null;
  const contents = readFileSync(path, 'utf8');
  const match = contents.match(ASYNCIFY);
  if (match) {
    const {
      args: [destFileName],
    } = parseCommand(match[0]);
    if (!destFileName) throw new Error(`No destination file name found in "${path}"`);
    if (destFileName instanceof RegExp) throw new Error('Destination file name cannot be a RegExp');
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

/** Parses a regular expression as a string represented like: "/something/ig". */
function parseRegExp(str: string): RegExp {
  if (!str) throw new Error('Cannot convert empty string to RegExp');
  const flags = str.substring(str.lastIndexOf('/') + 1);
  const source = str.substring(1, str.lastIndexOf('/'));
  return new RegExp(source, flags);
}

function parseCommand(rawCommand: string): AsyncifyCommand {
  const [cmd, argStr] = rawCommand.split('(').map(str => str.replace(COMMENT, '').trim());
  const args =
    argStr?.split(',').map(str => {
      str = str.replace(')', '').trim();
      return str[0] === '/' ? parseRegExp(str) : str.replace(/['"]/g, '');
    }) ?? [];
  return { cmd, args };
}

function asyncifyFile(file: AsyncableFile) {
  try {
    let newContents = file.contents.replace(ASYNCIFY, '').trimStart();
    let match: ReturnType<typeof String.prototype.match>;
    while ((match = newContents.match(COMMAND_AND_ARGS)) !== null) {
      if (typeof match.index !== 'number') continue;
      const { cmd, args } = parseCommand(match[0]);
      switch (cmd) {
        case 'insert':
        case 'i':
          if (typeof args[0] !== 'string') throw new Error("Insert command's argument must be a string");
          newContents = stringSplice(newContents, match.index, match[0].length, args[0]);
          break;
        case 'replace':
        case 'r': {
          const start = match.index;
          const end = start + match[0].length;
          let sliced = newContents.slice(end);
          if (args.length > 1) {
            if (typeof args[1] !== 'string') throw new Error("Replace command's second argument must be a string");
            sliced = sliced.replace(args[0], args[1]);
            newContents = stringSplice(newContents, start, newContents.length - start, sliced);
          } else {
            const nextWord = sliced.match(/[A-z<>]+/)?.[0] ?? '';
            if (!nextWord) throw new Error('Could not find next word');
            if (typeof args[0] !== 'string')
              throw new Error("Replace command's first argument must be a string if no second argument is provided");
            newContents = stringSplice(newContents, start, end + nextWord.length - start, args[0]);
          }
          break;
        }
        case 'replaceAll':
        case 'ra':
          if (typeof args[1] !== 'string') throw new Error("ReplaceAll command's second argument must be a string");
          newContents = stringSplice(newContents, match.index, match[0].length).replace(
            new RegExp(args[0], 'g'),
            args[1],
          );
          break;
        case 'comment':
        case 'c': {
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
          newContents = stringSplice(newContents, match.index, match[0].length);
          if (startOfLine !== -1) newContents = stringSplice(newContents, startOfLine, 0, '// ');
          break;
        }
      }
    }

    // Remove whitespace at the end of each line:
    newContents = newContents.trimStart().replace(/ +$/gm, '');

    console.log(`Compiled "${file.dest}"`);
    writeFileSync(file.dest, newContents);
  } catch (err) {
    console.error(`Error asyncifying file "${file.src}":`, err.message);
  }
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
