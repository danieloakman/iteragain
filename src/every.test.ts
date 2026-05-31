import { describe, it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { every, pipe, range } from '.';

describe('every', () => {
  it('should return true when all elements satisfy predicate', async function () {
    equal(
      every(range(10), n => n < 10),
      true,
    );
  });

  it('should return false when any element fails predicate', async function () {
    equal(
      every(range(10), n => n < 5),
      false,
    );
  });

  it('should work with pipe on stepped range', async function () {
    assert(
      pipe(
        range(50, 100, 2),
        every(n => n % 2 === 0),
      ),
    );
  });
});
