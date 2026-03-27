import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { product, range } from '..';
it('product', async function () {
  equal(
    [...product([range(2)], 2)],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  );
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
