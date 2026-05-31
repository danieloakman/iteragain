import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { tap } from '.';

describe('tap', () => {
  it('should pass through values while invoking a side effect', async function () {
    const arr: number[] = [];
    const it = tap([1, 2, 3], n => arr.push(n * 2));
    equal([...it], [1, 2, 3]);
    equal(arr, [2, 4, 6]);
  });
});
