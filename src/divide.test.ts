import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { divide, map, pipe, range, toArray } from '..';
it('divide', async function () {
  equal(
    divide(range(1, 4), 3).map(v => toArray(v)),
    [[1], [2], [3]],
  );
  equal(
    divide(range(1, 7), 3).map(v => toArray(v)),
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  );
  equal(
    divide(range(1, 4), 5).map(v => [...v]),
    [[1], [2], [3], [], []],
  );
  {
    const arr = pipe(range(1, 7), divide(2), map(toArray), toArray);
    expectType<number[][]>(arr);
    equal(arr, [
      [1, 2, 3],
      [4, 5, 6],
    ]);
  }
  // const a = toArray(divide(range(1, 4), 2));
  //    ^?
});
