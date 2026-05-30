import { it } from 'bun:test';
import { equal, expectType, throws } from './internal/test-utils';
import { MAX_EMPTY_ERROR } from './internal/emptyIteratorError';
import { map, max, pipe, range, shuffle } from '.';
it('max', async function () {
  equal(max(range(10)), 9);
  equal(
    max(range(10), n => -n),
    0,
  );
  equal(pipe(range(10), shuffle, expectType<IterableIterator<number>>, max, expectType<number>), 9);
  equal(
    pipe(
      range(10),
      map(n => [n, (n * n).toString()] as const),
      shuffle,
      max(v => parseFloat(v[1])),
      expectType<readonly [number, string]>,
    ),
    [9, '81'],
  );
  throws(() => max([]), TypeError, MAX_EMPTY_ERROR);
});
