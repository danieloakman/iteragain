import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { count, take } from '.';

describe('count', () => {
  it('should count from zero', async function () {
    equal(take(count(), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
