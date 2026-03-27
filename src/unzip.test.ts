import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { toArray, unzip, zip } from '.';
it('unzip', async function () {
  equal(
    unzip([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]).map(toArray),
    [
      ['a', 'b', 'c'],
      [1, 2, 3],
    ],
  );
  equal(unzip(zip('abc', [1, 2])).map(toArray), [
    ['a', 'b'],
    [1, 2],
  ]);
  // @ts-expect-error
  equal([...unzip([0, 1, 2])[0]], [0, 1, 2]);
});
