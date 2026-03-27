import { it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { map, permutations, pipe, some } from '.';
it('permutations', async function () {
  const result1 = [...permutations([1, 2, 3], 3)];
  equal(result1, [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ]);
  const k = (nums: number[]) => nums.join(',');
  const result2 = result1.map(k);
  assert(
    pipe(
      [1, 2, 3],
      permutations(3),
      map(v => {
        v.reverse();
        return v;
      }),
      some(v => result2.includes(k(v))),
    ),
  );
});
