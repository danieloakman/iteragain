import { it } from 'bun:test';
import { equal, expectType, assert } from './internal/test-utils';
import { filter, forEach, pipe, range, shuffle } from '.';
it('forEach', async function () {
  const arr: number[] = [];
  forEach(range(10), n => arr.push(n));
  equal(arr, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  pipe(
    range(10),
    shuffle,
    filter(n => n > 5),
    expectType<IterableIterator<number>>,
    forEach(n => assert(n > 5)),
  );
});
