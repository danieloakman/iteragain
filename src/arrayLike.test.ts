import { it, describe } from 'bun:test';
import { equal, assert, throws } from './internal/test-utils';
import { arrayLike } from './arrayLike';
import { iter, range } from './';

describe('arrayLike', () => {
  it('basic functionality', async function () {
    const arr = arrayLike(iter(range(100)).map(n => n * 2));
    equal(arr.length, 0);
    equal(arr[0], 0);
    equal(arr[1], 2);
    equal(arr[2], 4);
    equal(arr[50], 100);
    equal(arr.length, 51);
    equal(arr[25], 50);
    equal(
      arr.slice(0, 5).map(n => n * 2),
      [0, 4, 8, 12, 16],
    );
    assert(!(100 in arr));
    assert(25 in arr);
    equal(arr[-1], 100);
    // @ts-expect-error
    throws(() => (arr[0] = 5));
    equal(arr['something' as unknown as number], undefined);
    assert(Object.keys(arr).includes('25'));
    // @ts-expect-error
    throws(() => delete arr[0]);
    throws(() => Object.defineProperty(arr, 0, { value: 5 }));
    const arr2 = arrayLike(range(100, 110));
    equal(arr2.length, 0);
    equal([...arr2], [...range(100, 110)]);
    const arr3 = arrayLike(range(3));
    equal([...arr3], [0, 1, 2]);
    equal(arr3[0], 0);
  });
});
