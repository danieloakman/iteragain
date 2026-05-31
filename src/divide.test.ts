import { describe, it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import { divide, map, pipe, range, toArray } from '.';

describe('divide', () => {
  it('divides range into three equal parts of one element', async function () {
    equal(
      divide(range(1, 4), 3).map(v => toArray(v)),
      [[1], [2], [3]],
    );
  });

  it('divides range into three parts of two elements', async function () {
    equal(
      divide(range(1, 7), 3).map(v => toArray(v)),
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    );
  });

  it('pads with empty parts when parts exceed elements', async function () {
    equal(
      divide(range(1, 4), 5).map(v => [...v]),
      [[1], [2], [3], [], []],
    );
  });

  it('divides range into two parts via pipe with correct types', async function () {
    {
      const arr = pipe(range(1, 7), divide(2), map(toArray), toArray);
      expectType<number[][]>(arr);
      equal(arr, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    }
    // const a = toArray(divide(range(1, 4), 2));
    //    ^?
  });
});
