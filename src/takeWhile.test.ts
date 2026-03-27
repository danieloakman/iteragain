import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { pipe, range, takeWhile, toArray } from '..';
it('takeWhile', async function () {
  equal([...takeWhile([1, 2, 3, 4, 5], n => n < 3)], [1, 2]);
  equal(
    pipe(
      range(-10, 10),
      takeWhile(n => n < 0),
      toArray,
    ),
    pipe(range(-10, 0), toArray),
  );
});
