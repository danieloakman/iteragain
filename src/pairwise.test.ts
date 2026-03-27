import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { pairwise, range } from '..';
it('pairwise', async function () {
  equal(
    [...pairwise(range(10))],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
    ],
  );
});
