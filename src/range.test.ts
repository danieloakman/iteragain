import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { length, range, take } from '..';
it('range', async function () {
  equal([...range(5, 10, 2)], [5, 7, 9]);
  equal([...range(5, 10)], [5, 6, 7, 8, 9]);
  equal([...range(5, 0, -1)], [5, 4, 3, 2, 1]);
  equal([...range(5, 0, -3)], [5, 2]);
  equal([...range(5, 0, -4)], [5, 1]);
  equal([...range(5, -5, -2)], [5, 3, 1, -1, -3]);
  equal([...range(4, -1)], [4, 3, 2, 1, 0]);
  equal([...range(10, 10)], []);
  equal([...range(10)], [...range(0, 10, 1)]);
  equal([...range(10)], range(10).toArray());
  equal([...range(2, 1, 1)], []);
  equal(take(range(Infinity), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  equal(take(range(-Infinity), 10), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
  equal([...range(1, 0)], [1]);
  equal(range(10, 0, 1).toArray(), []);
  equal(range(10).nth(-1), 9);
  equal(range(10).nth(10), undefined);
  equal(range(10).nth(Infinity), undefined);
  equal(range(10).nth(-10), 0);
  equal(range(10).nth(-11), undefined);
  equal(range(10).nth(5), range(10).at(5));
  let r = range(3);
  equal([...r, ...r], [0, 1, 2, 0, 1, 2]);
  assert(range(3).equal(range(0, 3, 1)));
  // @ts-ignore
  assert(range().toArray(), []);
  // Is still subject to floating numbers rounding errors:
  throws(() => equal(range(0, 5, 0.3).toArray(), [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7]));
  assert(range(0, Infinity, 13).includes(26));
  assert(range(Infinity).has(10));
  assert(range(-Infinity).has(-10));

  for (const args of [
    [10],
    [-10],
    [0, 10, 2],
    [0, -10, -2],
    [2, 10, 3],
    [-10, 0],
    [10, 0],
    [10, 0, 1],
    [0, 5, 0.25],
  ] as [number, number, number][]) {
    r = range(...args);
    const nums = r.toArray();
    assert(
      nums.every(n => r.includes(n)),
      `${nums} should be a subset of ${r}`,
    );
    assert(!r.includes(Math.min(...nums) - 1));
    assert(!r.includes(Math.max(...nums) + 1));
    equal(nums.length, r.length, `[${nums}] should have the same length as ${r}`);
    assert(nums.every((n, i) => n === r.nth(i) && r.index(n) === i));
  }
});
