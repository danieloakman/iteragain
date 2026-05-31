import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { concat, range } from '.';

describe('concat', () => {
  it('should concatenate multiple iterables in order', async function () {
    equal([...concat([1, 2, 3], [], range(4, 7))], [1, 2, 3, 4, 5, 6]);
  });

  // const a = toArray(concat([1, 2, 3, ''], [1, 2, 3]));
  //    ^?
});
