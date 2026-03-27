import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { pipe, toArray, unique } from '..';
it('unique', async function () {
  equal([...unique([1, 1, 3, 3, 2, 2])], [1, 3, 2]);
  equal([...unique('AAAABBBCCDAABBB')].join(''), 'ABCD');
  equal([...unique('AAAABBBCCDAABBB', { justSeen: true })].join(''), 'ABCDAB');
  equal([...unique('ABBCcAD', { iteratee: v => v.toLowerCase() })].join(''), 'ABCD');
  equal([...unique('ABBCcAD', v => v.toLowerCase())].join(''), 'ABCD');
  equal(
    pipe(
      'AAaaaABBBbBCaaDdCaadD',
      unique(v => v.toLowerCase()),
      toArray,
    ).join(''),
    'ABCD',
  );
});
