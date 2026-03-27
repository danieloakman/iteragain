import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { count, includes, map, pipe, range } from '..';
it('includes', async function () {
  equal(includes(range(10), 5), true);
  equal(includes(range(10), 10), false);
  assert(
    pipe(
      count(),
      map(() => Math.floor(Math.random() * 1000) + 1),
      includes(1),
    ),
  );
});
