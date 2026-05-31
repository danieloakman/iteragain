import { describe, it } from 'bun:test';
import { equal, expectType, throws } from './internal/test-utils';
import { filter, pipe, range, toArray, windows } from '.';

describe('windows', () => {
  it('should create sliding windows of the given size and step', async function () {
    equal(
      [...windows([1, 2, 3, 4, 5], 3, 1)],
      [
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ],
    );
  });

  it('should work with filtered ranges in a pipe', async function () {
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
  });

  it('should support a fill value for incomplete windows', async function () {
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

  it('should throw when size is zero', async function () {
    throws(() => [...windows([1, 2, 3], 0, 1)], RangeError);
  });

  it('should throw when step is zero', async function () {
    throws(() => [...windows([1, 2, 3], 2, 0)], RangeError);
  });
});
