import { describe, it } from 'bun:test';
import { equal, assert, throws } from './internal/test-utils';
import { isIterator, toArray, toIterator } from '.';

describe('toIterator', () => {
  it('should wrap an iterable in an iterator', async function () {
    const it1 = toIterator([1, 2, 3]);
    assert(isIterator(it1));
  });

  it('should throw for null and undefined', async function () {
    // @ts-expect-error
    throws(() => toIterator(null));
    // @ts-expect-error
    throws(() => toIterator(undefined));
  });

  it('should wrap a generator function with a limit', async function () {
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
  });

  it('should wrap a generator function that doubles values', async function () {
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
});
