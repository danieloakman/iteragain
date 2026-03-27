import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { pipe, range, shuffle, sort, toArray } from '..';
it('sort', async function () {
  equal([...sort([3, 1, 2])], [1, 2, 3]);
  equal([...sort([3, 1, 2], (a, b) => b - a)], [3, 2, 1]);
  equal([...sort([3, 1, 2], (a, b) => a - b)], [1, 2, 3]);
  equal([...sort([3, 1, 3, 2])], [1, 2, 3, 3]);
  equal(pipe(range(10), shuffle, sort, toArray), pipe(range(10), toArray));
  equal(
    pipe(
      range(10),
      shuffle,
      sort((a, b) => b - a),
      toArray,
    ),
    pipe(range(9, -1), toArray),
  );
  equal(pipe(range(10), shuffle, sort(), toArray), pipe(range(10), toArray));
});
