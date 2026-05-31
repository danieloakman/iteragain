import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { pipe, toArray, unique } from '.';

describe('unique', () => {
  it('should remove duplicate numbers', async function () {
    equal([...unique([1, 1, 3, 3, 2, 2])], [1, 3, 2]);
  });

  it('should remove duplicate characters from a string', async function () {
    equal([...unique('AAAABBBCCDAABBB')].join(''), 'ABCD');
  });

  it('should remove consecutive duplicates with justSeen', async function () {
    equal([...unique('AAAABBBCCDAABBB', { justSeen: true })].join(''), 'ABCDAB');
  });

  it('should remove consecutive duplicates from numbers with justSeen', async function () {
    equal(toArray(unique([0, 0, 1, 1, 0], { justSeen: true })), [0, 1, 0]);
  });

  it('should remove consecutive duplicates from strings with justSeen', async function () {
    equal(toArray(unique(['', '', 'a', 'a', ''], { justSeen: true })), ['', 'a', '']);
  });

  it('should remove consecutive duplicates from booleans with justSeen', async function () {
    equal(toArray(unique([false, false, true], { justSeen: true })), [false, true]);
  });

  it('should deduplicate using an iteratee option', async function () {
    equal([...unique('ABBCcAD', { iteratee: v => v.toLowerCase() })].join(''), 'ABCD');
  });

  it('should deduplicate using an iteratee function argument', async function () {
    equal([...unique('ABBCcAD', v => v.toLowerCase())].join(''), 'ABCD');
  });

  it('should deduplicate through a pipe with an iteratee', async function () {
    equal(
      pipe(
        'AAaaaABBBbBCaaDdCaadD',
        unique(v => v.toLowerCase()),
        toArray,
      ).join(''),
      'ABCD',
    );
  });
});
