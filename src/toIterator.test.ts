import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { isIterator, toArray, toIterator } from '..';
it('toIterator', async function () {
  const it1 = toIterator([1, 2, 3]);
  assert(isIterator(it1));
  // @ts-expect-error
  throws(() => toIterator(null));
  // @ts-expect-error
  throws(() => toIterator(undefined));
  equal(
    toArray(
      toIterator(
        (
          (i = 0) =>
          () =>
            i++
        )(),
        3,
      ),
    ),
    [0, 1, 2],
  );
  equal(
    toArray(
      toIterator(
        (
          (n = 1) =>
          () =>
            (n = n * 2)
        )(),
        1024,
      ),
    ),
    [2, 4, 8, 16, 32, 64, 128, 256, 512],
  );
});
