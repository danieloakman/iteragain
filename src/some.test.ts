import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { some } from '.';
it('some', async function () {
  equal(
    some([1, 2, 3], n => n > 2),
    true,
  );
  equal(
    some([1, 2, 3], n => n > 4),
    false,
  );
});
