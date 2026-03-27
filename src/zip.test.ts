import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { zip } from '.';
it('zip', async function () {
  equal(
    [...zip([1, 2, 3], ['4', '5', '6'])],
    [
      [1, '4'],
      [2, '5'],
      [3, '6'],
    ],
  );
  equal(
    [...zip([1, 2, 3], ['4', '5'])],
    [
      [1, '4'],
      [2, '5'],
    ],
  );
});
