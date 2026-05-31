import { describe, it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { filter, flatMap, nth, pipe, range, shuffle, toIterator } from '.';

describe('nth', () => {
  it('returns element at positive index', async function () {
    equal(nth(range(10), 3), 3);
  });

  it('returns undefined for negative index', async function () {
    equal(nth(range(10), -3), undefined);
  });

  it('returns entry from object iterator at index', async function () {
    equal(nth(toIterator({ a: 1, b: 2 }), 1), ['b', 2, { a: 1, b: 2 }]);
  });

  it('finds nth number after shuffle filter in pipe', async function () {
    pipe(
      range(50),
      flatMap(n => [n + 50, n.toString()]),
      shuffle,
      filter((v): v is number => typeof v === 'number'),
      nth(10),
      n => assert(n && n > 50),
    );
  });
});
