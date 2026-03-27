import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { range, take } from '.';
it('take', async function () {
  const arr = range(10).toArray();
  equal(take(arr, 3), [0, 1, 2]);
  equal(take(arr, 3), [0, 1, 2]);
  const it = range(10);
  equal(take(it, 3), [0, 1, 2]);
  equal(take(it, 3), [3, 4, 5]);
  equal(take(it), [6]);
});
