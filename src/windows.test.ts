import { it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import { filter, pipe, range, toArray, windows } from '.';
it('windows', async function () {
  equal(
    [...windows([1, 2, 3, 4, 5], 3, 1)],
    [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ],
  );
  equal(
    pipe(
      range(10),
      filter(n => n % 2 === 1),
      windows(2, 1),
      toArray,
      expectType<number[][]>,
    ),
    [
      [1, 3],
      [3, 5],
      [5, 7],
      [7, 9],
    ],
  );
  equal(
    pipe(
      range(10),
      filter(n => n % 2 === 0),
      expectType<IterableIterator<number>>,
      windows(2, 1, -1),
      toArray,
      expectType<[number, number][]>,
    ),
    [
      [0, 2],
      [2, 4],
      [4, 6],
      [6, 8],
      [8, -1],
    ],
  );
});
