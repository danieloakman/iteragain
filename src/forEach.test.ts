import { describe, it } from 'bun:test';
import { equal, expectType, assert } from './internal/test-utils';
import { filter, forEach, pipe, range, shuffle } from '.';

describe('forEach', () => {
  it('collects all elements via callback', async function () {
    const arr: number[] = [];
    forEach(range(10), n => arr.push(n));
    equal(arr, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('asserts each element is greater than 5 after shuffle and filter in pipe', async function () {
    pipe(
      range(10),
      shuffle,
      filter(n => n > 5),
      expectType<IterableIterator<number>>,
      forEach(n => assert(n > 5)),
    );
  });
});
