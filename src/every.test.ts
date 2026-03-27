import { it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { every, pipe, range } from '.';
it('every', async function () {
  equal(
    every(range(10), n => n < 10),
    true,
  );
  equal(
    every(range(10), n => n < 5),
    false,
  );
  assert(
    pipe(
      range(50, 100, 2),
      every(n => n % 2 === 0),
    ),
  );
});
