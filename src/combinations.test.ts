import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { combinations, pipe, take } from '..';
it('combinations', async function () {
  equal([...combinations([0, 1], 2)], [[0, 1]]);
  equal(pipe([0, 1, 2], combinations(2, true), take(3)), [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});
