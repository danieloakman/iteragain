import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './test-utils';
import { filter, flatMap, nth, pipe, range, shuffle, toIterator } from '..';
it('nth', async function () {
  equal(nth(range(10), 3), 3);
  equal(nth(range(10), -3), undefined);
  equal(nth(toIterator({ a: 1, b: 2 }), 1), ['b', 2, { a: 1, b: 2 }]);
  pipe(
    range(50),
    flatMap(n => [n + 50, n.toString()]),
    shuffle,
    filter((v): v is number => typeof v === 'number'),
    nth(10),
    n => assert(n && n > 50),
  );
});
