import { describe, it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { includes, iter, range, shuffle, toArray } from '.';

describe('shuffle', () => {
  it('should return a permutation of the same elements', async function () {
    const shuffled = [...shuffle(range(10))];
    equal(shuffled.length, 10);
    equal(
      shuffled.sort((a: number, b: number) => a - b),
      range(10).toArray(),
    );
  });

  it('should produce deterministic output with a fixed seed', async function () {
    const expected = [3, 4, 1, 2];
    iter(range(10)).forEach(() => {
      equal(toArray(shuffle([3, 1, 2, 4], 0.5)), expected);
    });
  });

  it('should produce the same output for the same seed', async function () {
    iter(range(0, 1.1, 0.1)).forEach(seed => {
      const nums = range(100);
      equal(toArray(shuffle(nums, seed)), toArray(shuffle(nums, seed)));
    });
  });

  it('should not include undefined for edge-case seeds', async function () {
    assert(!includes(shuffle(range(10), 1), undefined));
    assert(!includes(shuffle(range(10), -1), undefined));
    assert(!includes(shuffle(range(10), -0.00001), undefined));
    assert(!includes(shuffle(range(10), 0.99999), undefined));
    assert(!includes(shuffle(range(10), 0), undefined));
    assert(!includes(shuffle(range(10), -0), undefined));
  });
});
