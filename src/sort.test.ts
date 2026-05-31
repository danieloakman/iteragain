import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { pipe, range, shuffle, sort, toArray } from '.';

describe('sort', () => {
  it('sorts array in ascending order by default', async function () {
    equal([...sort([3, 1, 2])], [1, 2, 3]);
  });

  it('sorts array in descending order with comparator', async function () {
    equal([...sort([3, 1, 2], (a, b) => b - a)], [3, 2, 1]);
  });

  it('sorts array in ascending order with explicit comparator', async function () {
    equal([...sort([3, 1, 2], (a, b) => a - b)], [1, 2, 3]);
  });

  it('preserves duplicate values when sorting', async function () {
    equal([...sort([3, 1, 3, 2])], [1, 2, 3, 3]);
  });

  it('sorts shuffled range to original order via pipe', async function () {
    equal(pipe(range(10), shuffle, sort, toArray), pipe(range(10), toArray));
  });

  it('sorts shuffled range in descending order via pipe', async function () {
    equal(
      pipe(
        range(10),
        shuffle,
        sort((a, b) => b - a),
        toArray,
      ),
      pipe(range(9, -1), toArray),
    );
  });

  it('sorts shuffled range with default comparator via pipe', async function () {
    equal(pipe(range(10), shuffle, sort(), toArray), pipe(range(10), toArray));
  });
});
