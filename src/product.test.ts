import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { product, range } from '.';

describe('product', () => {
  it('should compute the cartesian product with repeat 2', async function () {
    equal(
      [...product([range(2)], 2)],
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
    );
  });

  it('should compute the cartesian product of iterables', async function () {
    equal(
      [...product(['ABCD', 'xy'])],
      [
        ['A', 'x'],
        ['A', 'y'],
        ['B', 'x'],
        ['B', 'y'],
        ['C', 'x'],
        ['C', 'y'],
        ['D', 'x'],
        ['D', 'y'],
      ],
    );
  });

  it('should compute the cartesian product with repeat 3', async function () {
    equal(
      [...product([range(2)], 3)],
      [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 1],
        [1, 0, 0],
        [1, 0, 1],
        [1, 1, 0],
        [1, 1, 1],
      ],
    );
  });
});
