import { it } from 'bun:test';
import { equal } from './internal/test-utils';
import { repeat, take } from '.';
it('repeat', async function () {
  equal(take(repeat(1), 5), [1, 1, 1, 1, 1]);
  equal([...repeat(1, 5)], [1, 1, 1, 1, 1]);
});
