import { it } from 'bun:test';
import { equal, expectType, assert } from './internal/test-utils';
import { filter, flatten, forEach, map, pipe, range, toArray } from '.';
it('flatten', async function () {
  equal([...flatten([[1], [2, 3, 4], [5, [[[[[[6]]]]]]]])], [1, 2, 3, 4, 5, 6]);
  equal([...flatten([[1], [2, 3], [4, 5]])], [1, 2, 3, 4, 5]);
  equal([...flatten([[1], [[2], 3]], 2)], [1, 2, 3]);
  equal([...flatten([[1], [[2], 3]], 1)], [1, [2], 3]);
  equal([...flatten([[1], [[2], 3]], 0)], [[1], [[2], 3]]);
  equal([...flatten('abc')], ['a', 'b', 'c']);
  equal([...flatten(['abc'])], ['abc']);
  equal(
    [
      ...flatten(
        map(range(3), () => range(2)),
        1,
      ),
    ],
    [0, 1, 0, 1, 0, 1],
  );
  pipe(
    ['a', [[1], [[[[[2], [[[3]]]]]]]]],
    flatten,
    expectType<IterableIterator<number>>,
    filter((v): v is number => typeof v === 'number'),
    toArray,
    v => (assert(v.length), v),
    forEach(n => assert(typeof n === 'number')),
  );
  // const a = toArray(flatten([[1, 2, 3, '', [['']]], [['']]], 1));
  // //    ^?
});
