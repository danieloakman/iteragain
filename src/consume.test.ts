import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { consume, pipe, range, tap } from '..';
it('consume', async function () {
  const arr: number[] = [];
  equal(consume(tap(range(3), n => arr.push(n))), undefined);
  equal(arr, [0, 1, 2]);
  equal(
    pipe(
      range(5, 10),
      tap(n => arr.push(n)),
      consume,
    ),
    undefined,
  );
  equal(arr, [0, 1, 2, 5, 6, 7, 8, 9]);
  equal(
    pipe(
      range(5, 10),
      tap(n => arr.push(n)),
      consume(1),
    ),
    undefined,
  );
  equal(arr, [0, 1, 2, 5, 6, 7, 8, 9, 5]);
});
