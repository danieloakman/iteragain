import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
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
});
