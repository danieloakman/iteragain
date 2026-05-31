import { it } from 'bun:test';
import { equal, throws } from './internal/test-utils';
import { REDUCE_EMPTY_ERROR } from './internal/emptyIteratorError';
import { pipe, range, reduce } from '.';
it('reduce', async function () {
  equal(
    reduce(range(10), (acc, n) => acc + n),
    45,
  );
  equal(
    pipe(
      range(5),
      reduce((acc, n) => acc + n),
    ),
    10,
  );
  equal(
    pipe(
      range(10),
      reduce((acc, s) => acc + s, ''),
    ),
    '0123456789',
  );
  throws(() => reduce([] as number[], (acc, n) => acc + n), TypeError, REDUCE_EMPTY_ERROR);
  equal(
    reduce([] as number[], (acc, n) => acc + n, 0),
    0,
  );
});
