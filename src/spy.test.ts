import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { count, map, pipe, range, spy } from '.';

describe('spy', () => {
  it('should capture consumed values from an iterator', async function () {
    const [value, it] = spy(range(10));
    equal(value, [0]);
    equal(spy(it, 10)[0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should work in a pipe', async function () {
    equal(
      pipe(
        count(),
        map(n => n + 1),
        spy(3),
        v => v[0],
      ),
      [1, 2, 3],
    );
  });
});
