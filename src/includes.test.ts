import { describe, it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { count, includes, map, pipe, range } from '.';

describe('includes', () => {
  it('returns true when value is in range', async function () {
    equal(includes(range(10), 5), true);
  });

  it('returns false when value is not in range', async function () {
    equal(includes(range(10), 10), false);
  });

  it('pipe includes finds 1 in random sequence', async function () {
    assert(
      pipe(
        count(),
        map(() => Math.floor(Math.random() * 1000) + 1),
        includes(1),
      ),
    );
  });
});
