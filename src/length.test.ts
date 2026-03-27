import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { length, range } from '..';
it('length', async function () {
  equal(length(range(10)), 10);
  equal(length(range(0)), 0);
  equal(length(range(1)), 1);
  equal(length(range(100)), 100);
});
