import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { compress } from '.';
it('compress', async function () {
  equal([...compress([1, 2, 3, 4, 5], [1, 1, 0, 0, 1])], [1, 2, 5]);
});
