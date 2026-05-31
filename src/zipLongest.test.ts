import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { zipLongest } from '.';

describe('zipLongest', () => {
  it('should zip two arrays of equal length', async function () {
    equal(
      [...zipLongest([1, 2, 3], ['4', '5', '6'])],
      [
        [1, '4'],
        [2, '5'],
        [3, '6'],
      ],
    );
  });

  it('should pad shorter input with undefined', async function () {
    equal(
      [...zipLongest([1, 2, 3], ['4', '5'])],
      [
        [1, '4'],
        [2, '5'],
        [3, undefined],
      ],
    );
  });
});
