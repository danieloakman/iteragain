import { describe, it } from 'bun:test';
import { equal, assert, throws } from './internal/test-utils';
import { range, take } from '.';

describe('range', () => {
  it('should generate values with custom start, stop, and step', async function () {
    equal([...range(5, 10, 2)], [5, 7, 9]);
  });

  it('should generate values from start to stop with step 1', async function () {
    equal([...range(5, 10)], [5, 6, 7, 8, 9]);
  });

  it('should generate descending values with negative step', async function () {
    equal([...range(5, 0, -1)], [5, 4, 3, 2, 1]);
  });

  it('should generate descending values with step -3', async function () {
    equal([...range(5, 0, -3)], [5, 2]);
  });

  it('should generate descending values with step -4', async function () {
    equal([...range(5, 0, -4)], [5, 1]);
  });

  it('should generate descending values with step -2', async function () {
    equal([...range(5, -5, -2)], [5, 3, 1, -1, -3]);
  });

  it('should include stop when descending with default step', async function () {
    equal([...range(4, -1)], [4, 3, 2, 1, 0]);
  });

  it('should return an empty range when start equals stop', async function () {
    equal([...range(10, 10)], []);
  });

  it('should treat a single argument as stop with start 0', async function () {
    equal([...range(10)], [...range(0, 10, 1)]);
  });

  it('should match toArray for a single-argument range', async function () {
    equal([...range(10)], range(10).toArray());
  });

  it('should return an empty range when step direction does not reach stop', async function () {
    equal([...range(2, 1, 1)], []);
  });

  it('should take the first n values from an infinite range', async function () {
    equal(take(range(Infinity), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should take the first n values from a negative infinite range', async function () {
    equal(take(range(-Infinity), 10), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
  });

  it('should include start when descending with default step', async function () {
    equal([...range(1, 0)], [1]);
  });

  it('should return an empty range when ascending step cannot reach stop', async function () {
    equal(range(10, 0, 1).toArray(), []);
  });

  it('should support nth for negative and out-of-bounds indices', async function () {
    equal(range(10).nth(-1), 9);
    equal(range(10).nth(10), undefined);
    equal(range(10).nth(Infinity), undefined);
    equal(range(10).nth(-10), 0);
    equal(range(10).nth(-11), undefined);
    equal(range(10).nth(5), range(10).at(5));
  });

  it('should be iterable multiple times', async function () {
    let r = range(3);
    equal([...r, ...r], [0, 1, 2, 0, 1, 2]);
  });

  it('should be equal to an equivalent range', async function () {
    assert(range(3).equal(range(0, 3, 1)));
  });

  it('should return an empty array when called with no arguments', async function () {
    // @ts-ignore
    assert(range().toArray(), []);
  });

  it('should be subject to floating point rounding errors', async function () {
    // Is still subject to floating numbers rounding errors:
    throws(() => equal(range(0, 5, 0.3).toArray(), [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7]));
  });

  it('should support includes and has for infinite ranges', async function () {
    assert(range(0, Infinity, 13).includes(26));
    assert(range(Infinity).has(10));
    assert(range(-Infinity).has(-10));
  });

  it('should satisfy includes, length, nth, and index invariants', async function () {
    let r: ReturnType<typeof range>;
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
});
