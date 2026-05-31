import { describe, it } from 'bun:test';
import { equal, expectType, assert } from './internal/test-utils';
import { filter, flatten, forEach, map, pipe, range, toArray } from '.';

describe('flatten', () => {
  it('flattens deeply nested arrays to single level', async function () {
    equal([...flatten([[1], [2, 3, 4], [5, [[[[[[6]]]]]]]])], [1, 2, 3, 4, 5, 6]);
  });

  it('flattens shallow nested arrays', async function () {
    equal([...flatten([[1], [2, 3], [4, 5]])], [1, 2, 3, 4, 5]);
  });

  it('flattens to depth 2', async function () {
    equal([...flatten([[1], [[2], 3]], 2)], [1, 2, 3]);
  });

  it('flattens to depth 1 preserving inner arrays', async function () {
    equal([...flatten([[1], [[2], 3]], 1)], [1, [2], 3]);
  });

  it('returns unchanged structure at depth 0', async function () {
    equal([...flatten([[1], [[2], 3]], 0)], [[1], [[2], 3]]);
  });

  it('spreads string characters', async function () {
    equal([...flatten('abc')], ['a', 'b', 'c']);
  });

  it('does not spread string inside array', async function () {
    equal([...flatten(['abc'])], ['abc']);
  });

  it('flattens mapped range iterators at depth 1', async function () {
    equal(
      [
        ...flatten(
          map(range(3), () => range(2)),
          1,
        ),
      ],
      [0, 1, 0, 1, 0, 1],
    );
  });

  it('filters numbers from deeply nested mixed structure via pipe', async function () {
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
});
