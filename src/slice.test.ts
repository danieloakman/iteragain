import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { pipe, range, slice, toArray } from '.';

describe('slice', () => {
  it('slices array with start and end indices', async function () {
    equal([...slice([1, 2, 3, 4, 5], 1, 3)], [2, 3]);
  });

  it('slices array from start index to end', async function () {
    equal([...slice([1, 2, 3, 4, 5], 1)], [2, 3, 4, 5]);
  });

  it('slices range via pipe', async function () {
    equal(pipe(range(10), slice(1, 5), toArray), [1, 2, 3, 4]);
  });
});
