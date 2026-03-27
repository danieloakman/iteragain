import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { map, minmax, pipe, range, shuffle } from '..';
it('minmax', async function () {
  equal(minmax(range(10)), [0, 9]);
  equal(
    minmax(range(10), n => -n),
    [9, 0],
  );
  equal(
    pipe(
      range(-50, 50),
      map(n => n * n),
      shuffle,
      map(n => n.toString()),
      minmax(n => parseFloat(n)),
      expectType<[string, string]>,
    ),
    ['0', '2500'],
  );
});
