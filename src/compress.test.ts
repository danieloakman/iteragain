import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { compress } from '.';

describe('compress', () => {
  it('should select elements by boolean mask', async function () {
    equal([...compress([1, 2, 3, 4, 5], [1, 1, 0, 0, 1])], [1, 2, 5]);
  });
});
