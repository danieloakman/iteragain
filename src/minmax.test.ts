import { describe, it } from 'bun:test';
import { equal, expectType, throws } from './internal/test-utils';
import { MINMAX_EMPTY_ERROR } from './internal/emptyIteratorError';
import { map, minmax, pipe, range, shuffle } from '.';

describe('minmax', () => {
  it('should return the smallest and largest values from a range', async function () {
    equal(minmax(range(10)), [0, 9]);
  });

  it('should accept a selector function', async function () {
    equal(
      minmax(range(10), n => -n),
      [9, 0],
    );
  });

  it('should find min and max using a selector on shuffled mapped values', async function () {
    equal(
      pipe(
        range(-50, 50),
        map(n => n * n),
        shuffle,
        map(n => n.toString()),
        minmax(n => parseFloat(n)),
        expectType<[string, string]>,
      ),
      ['0', '2500'],
    );
  });

  it('should throw when called on empty input', async function () {
    throws(() => minmax([]), TypeError, MINMAX_EMPTY_ERROR);
  });
});
