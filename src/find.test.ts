import { describe, it } from 'bun:test';
import { equal, assert } from './internal/test-utils';
import { count, find, map, pipe, range } from '.';

describe('find', () => {
  it('finds matching element in range', async function () {
    equal(
      find(range(10), n => n === 5),
      5,
    );
  });

  it('returns undefined when no match', async function () {
    equal(
      find(range(10), n => n === 10),
      undefined,
    );
  });

  it('pipe find returns random number greater than threshold', async function () {
    const gt = 0.99;
    pipe(
      count(),
      map(() => Math.random()),
      find(n => n > gt),
      n => typeof n === 'number' && n > gt,
      assert,
    );
    // function isStr(v: any): v is string {
    //   return typeof v === 'string';
    // }
    // const a = find([1, 2, 3, ''], isStr);
    // //    ^?
  });
});
