import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { some } from '.';

describe('some', () => {
  it('should return true when predicate matches an element', async function () {
    equal(
      some([1, 2, 3], n => n > 2),
      true,
    );
  });

  it('should return false when predicate matches no elements', async function () {
    equal(
      some([1, 2, 3], n => n > 4),
      false,
    );
  });
});
