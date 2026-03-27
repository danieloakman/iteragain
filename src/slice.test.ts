import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { pipe, range, slice, toArray } from '.';
it('slice', async function () {
  equal([...slice([1, 2, 3, 4, 5], 1, 3)], [2, 3]);
  equal([...slice([1, 2, 3, 4, 5], 1)], [2, 3, 4, 5]);
  equal(pipe(range(10), slice(1, 5), toArray), [1, 2, 3, 4]);
});
