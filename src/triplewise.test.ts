import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { triplewise } from '.';

describe('triplewise', () => {
  it('should yield consecutive triples', async function () {
    equal(
      [...triplewise([1, 2, 3, 4, 5])],
      [
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ],
    );
  });
});
