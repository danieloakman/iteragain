import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { pipe, range, takeWhile, toArray } from '.';

describe('takeWhile', () => {
  it('should take elements while the predicate is true', async function () {
    equal([...takeWhile([1, 2, 3, 4, 5], n => n < 3)], [1, 2]);
  });

  it('should work with ranges in a pipe', async function () {
    equal(
      pipe(
        range(-10, 10),
        takeWhile(n => n < 0),
        toArray,
      ),
      pipe(range(-10, 0), toArray),
    );
  });
});
