import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { cycle, pipe, range, take, toArray } from '.';

describe('cycle', () => {
  it('should repeat iterable values when taken', async function () {
    equal(take(cycle([1, 2, 3]), 10), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  });

  it('should cycle a limited number of times', async function () {
    equal([...cycle(range(3), 1)], [0, 1, 2, 0, 1, 2]);
  });

  it('should cycle via pipe and take', async function () {
    equal(pipe(range(1, 4), cycle, take(10)), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  });

  it('should cycle a fixed number of times via pipe', async function () {
    equal(pipe(range(1, 4), cycle(2), toArray), [1, 2, 3, 1, 2, 3, 1, 2, 3]);
  });

  it('should be done immediately for empty input', async function () {
    equal(cycle([]).next(), { done: true, value: undefined });
  });

  it('should yield nothing when taking from empty cycle', async function () {
    equal([...take(cycle([]), 3)], []);
  });
});
