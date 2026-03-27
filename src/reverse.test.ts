import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { map, range, reverse } from '.';
it('reverse', async function () {
  equal([...reverse(range(10))], [...range(9, -1)]);
  const mapper = (n: number) => n * n;
  equal([...map(reverse(range(10)), mapper)], [...map(range(9, -1), mapper)]);
});
