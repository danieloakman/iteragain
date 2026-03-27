import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { zipLongest } from '.';
it('zipLongest', async function () {
  equal(
    [...zipLongest([1, 2, 3], ['4', '5', '6'])],
    [
      [1, '4'],
      [2, '5'],
      [3, '6'],
    ],
  );
  equal(
    [...zipLongest([1, 2, 3], ['4', '5'])],
    [
      [1, '4'],
      [2, '5'],
      [3, undefined],
    ],
  );
});
