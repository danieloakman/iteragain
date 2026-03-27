import { it } from 'bun:test';
import { equal } from './internal/test-utils';
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
});
