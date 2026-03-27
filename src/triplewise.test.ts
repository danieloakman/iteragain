import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { triplewise } from '..';
it('triplewise', async function () {
  equal(
    [...triplewise([1, 2, 3, 4, 5])],
    [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ],
  );
});
