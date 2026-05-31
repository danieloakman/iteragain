import { describe, it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import { map, pipe, range, toArray } from '.';

describe('map', () => {
  it('should map range values to squares', async function () {
    const result = [...map(range(10), n => n * n)];
    equal(result, [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
    equal(result, [
      ...pipe(
        range(10),
        map(v => v * v),
        expectType<IterableIterator<number>>,
      ),
    ]);
  });

  it('should infer correct types for map', async function () {
    expectType<(number | string)[][]>(toArray(map([1, 3], n => [n, n.toString()])));
    expectType<(readonly [number, string])[]>(toArray(map([1, 3], n => [n, n.toString()] as const)));
  });
});
