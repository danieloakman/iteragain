import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { count, map, pipe, range, spy } from '.';
it('spy', async function () {
  const [value, it] = spy(range(10));
  equal(value, [0]);
  equal(spy(it, 10)[0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  equal(
    pipe(
      count(),
      map(n => n + 1),
      spy(3),
      v => v[0],
    ),
    [1, 2, 3],
  );
});
