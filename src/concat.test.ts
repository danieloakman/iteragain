import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { concat, range, toArray } from '..';
it('concat', async function () {
  equal([...concat([1, 2, 3], [], range(4, 7))], [1, 2, 3, 4, 5, 6]);
  // const a = toArray(concat([1, 2, 3, ''], [1, 2, 3]));
  //    ^?
});
