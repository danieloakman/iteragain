import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { count, take } from '..';
it('count', async function () {
  equal(take(count(), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
