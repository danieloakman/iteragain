import { describe, it } from 'bun:test';
import { equal, throws } from './internal/test-utils';
import { MIN_EMPTY_ERROR } from './internal/emptyIteratorError';
import { map, min, pipe, range, shuffle } from '.';

describe('min', () => {
  it('should return the smallest value from a range', async function () {
    equal(min(range(10)), 0);
  });

  it('should accept a selector function', async function () {
    equal(
      min(range(10), n => -n),
      9,
    );
  });

  it('should find min using a selector on shuffled mapped values', async function () {
    equal(
      pipe(
        range(-50, 50),
        shuffle,
        map(n => n.toString()),
        min(n => parseFloat(n)),
      ),
      '-50',
    );
  });

  it('should throw when called on empty input', async function () {
    throws(() => min([]), TypeError, MIN_EMPTY_ERROR);
  });
});
