import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { chunks, pipe, range, toArray } from '.';
it('chunks', async function () {
  equal([...chunks([1, 2, 3, 4, 5], 2)], [[1, 2], [3, 4], [5]]);
  equal(pipe(range(1, 11), chunks(3, -1), toArray), [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, -1, -1],
  ]);
});
