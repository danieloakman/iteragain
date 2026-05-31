import { describe, it } from 'bun:test';
import { equal, expectType, throws } from './internal/test-utils';
import { MAX_EMPTY_ERROR } from './internal/emptyIteratorError';
import { map, max, pipe, range, shuffle } from '.';

describe('max', () => {
  it('should return the largest value from a range', async function () {
    equal(max(range(10)), 9);
  });

  it('should accept a selector function', async function () {
    equal(
      max(range(10), n => -n),
      0,
    );
  });

  it('should infer correct types through a pipe', async function () {
    equal(pipe(range(10), shuffle, expectType<IterableIterator<number>>, max, expectType<number>), 9);
  });

  it('should find max using a selector on shuffled mapped values', async function () {
    equal(
      pipe(
        range(10),
        map(n => [n, (n * n).toString()] as const),
        shuffle,
        max(v => parseFloat(v[1])),
        expectType<readonly [number, string]>,
      ),
      [9, '81'],
    );
  });

  it('should throw when called on empty input', async function () {
    throws(() => max([]), TypeError, MAX_EMPTY_ERROR);
  });
});
