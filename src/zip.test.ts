import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { zip } from '.';

describe('zip', () => {
  it('should zip two arrays of equal length', async function () {
    equal(
      [...zip([1, 2, 3], ['4', '5', '6'])],
      [
        [1, '4'],
        [2, '5'],
        [3, '6'],
      ],
    );
  });

  it('should zip until shortest input is exhausted', async function () {
    equal(
      [...zip([1, 2, 3], ['4', '5'])],
      [
        [1, '4'],
        [2, '5'],
      ],
    );
  });
});
