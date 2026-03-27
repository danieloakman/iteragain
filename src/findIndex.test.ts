import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { findIndex, pipe, range } from '.';
it('findIndex', async function () {
  equal(
    findIndex(range(10), n => n === 5),
    5,
  );
  equal(
    findIndex(range(10), n => n === 10),
    -1,
  );
  equal(
    pipe(
      range(5, 10),
      findIndex(n => n === 8),
    ),
    3,
  );
});
