import { it } from 'bun:test';
import { equal, throws } from './internal/test-utils';
import { MIN_EMPTY_ERROR } from './internal/emptyIteratorError';
import { map, min, pipe, range, shuffle } from '.';
it('min', async function () {
  equal(min(range(10)), 0);
  equal(
    min(range(10), n => -n),
    9,
  );
  equal(
    pipe(
      range(-50, 50),
      shuffle,
      map(n => n.toString()),
      min(n => parseFloat(n)),
    ),
    '-50',
  );
  throws(() => min([]), TypeError, MIN_EMPTY_ERROR);
});
