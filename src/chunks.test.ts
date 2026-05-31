import { describe, it } from 'bun:test';
import { equal, throws } from './internal/test-utils';
import { chunks, pipe, range, toArray } from '.';

describe('chunks', () => {
  it('should split iterable into fixed-size chunks', async function () {
    equal([...chunks([1, 2, 3, 4, 5], 2)], [[1, 2], [3, 4], [5]]);
  });

  it('should pad final chunk with fill value via pipe', async function () {
    equal(pipe(range(1, 11), chunks(3, -1), toArray), [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, -1, -1],
    ]);
  });

  it('should throw when chunk size is zero', async function () {
    throws(() => [...chunks([1, 2, 3], 0)], RangeError);
  });
});
