import { describe, it } from 'bun:test';
import { equal, throws } from './internal/test-utils';
import { REDUCE_EMPTY_ERROR } from './internal/emptyIteratorError';
import { pipe, range, reduce } from '.';

describe('reduce', () => {
  it('should sum range with reduce', async function () {
    equal(
      reduce(range(10), (acc, n) => acc + n),
      45,
    );
  });

  it('should sum range via pipe', async function () {
    equal(
      pipe(
        range(5),
        reduce((acc, n) => acc + n),
      ),
      10,
    );
  });

  it('should concatenate range via pipe', async function () {
    equal(
      pipe(
        range(10),
        reduce((acc, s) => acc + s, ''),
      ),
      '0123456789',
    );
  });

  it('should throw on empty input without initial value', async function () {
    throws(() => reduce([] as number[], (acc, n) => acc + n), TypeError, REDUCE_EMPTY_ERROR);
  });

  it('should return initial value for empty input', async function () {
    equal(
      reduce([] as number[], (acc, n) => acc + n, 0),
      0,
    );
  });
});
