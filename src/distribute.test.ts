import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { distribute, pipe, range, toArray } from '..';
it('distribute', async function () {
  equal(
    [...distribute(range(3), 3)].map(v => toArray(v)),
    [[0], [1], [2]],
  );
  equal(
    [...distribute(range(6), 2)].map(v => toArray(v)),
    [
      [0, 2, 4],
      [1, 3, 5],
    ],
  );
  equal(
    pipe(range(5), distribute(4), v => v.map(toArray)),
    [[0, 4], [1], [2], [3]],
  );
  // const a = toArray(distribute(['', 2], 2));
  //    ^?
});
