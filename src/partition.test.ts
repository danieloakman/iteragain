import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { partition, pipe, range } from '..';
it('partition', async function () {
  equal(
    partition([1, 2, 3, 4, 5], n => n % 2 === 0),
    [
      [1, 3, 5],
      [2, 4],
    ],
  );
  equal(
    pipe(
      range(15, 20),
      partition(n => n % 2),
    ),
    [
      [16, 18],
      [15, 17, 19],
    ],
  );
});
