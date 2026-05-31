import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { repeat, take } from '.';

describe('repeat', () => {
  it('should repeat value indefinitely when taken', async function () {
    equal(take(repeat(1), 5), [1, 1, 1, 1, 1]);
  });

  it('should repeat value a fixed number of times', async function () {
    equal([...repeat(1, 5)], [1, 1, 1, 1, 1]);
  });
});
