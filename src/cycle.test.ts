import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { cycle, pipe, range, take, toArray } from '.';
it('cycle', async function () {
  equal(take(cycle([1, 2, 3]), 10), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  equal([...cycle(range(3), 1)], [0, 1, 2, 0, 1, 2]);
  equal(pipe(range(1, 4), cycle, take(10)), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  equal(pipe(range(1, 4), cycle(2), toArray), [1, 2, 3, 1, 2, 3, 1, 2, 3]);
});
