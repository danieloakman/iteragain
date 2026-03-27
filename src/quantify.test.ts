import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { pipe, quantify, range } from '.';
it('quantify', async function () {
  equal(
    quantify(range(10), n => n % 2 === 0),
    5,
  );
  equal(
    pipe(
      range(5, 50),
      quantify(n => n % 2 === 0),
    ),
    22,
  );
});
