import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { filter, map, pipe, range, toArray } from '.';
it('filter', async function () {
  equal([...filter(range(10), n => n % 2 === 0)], [0, 2, 4, 6, 8]);
  type A = { a: number };
  type B = { b: number };
  const isA = (v: any): v is A => typeof v.a === 'number';
  const arr: (A | B)[] = [{ a: 1 }, { b: 2 }, { a: 3 }, { b: 4 }];
  equal(
    [...filter(arr, isA)].map(v => v.a),
    [1, 3],
  );
  equal(
    [...filter(arr, (v): v is B => 'b' in v && typeof v.b === 'number')].map(v => v.b),
    [2, 4],
  );
  equal(
    arr.filter(isA).map(v => v.a),
    [1, 3],
  );
  equal(
    pipe(
      range(10),
      filter(n => n > 5 && n % 2 === 0),
      toArray,
    ),
    [6, 8],
  );
  // const a = toArray(filter([1, 2, 3, ''], n => typeof n === 'number'));
  // //    ^?
  // const b = toArray(map(filter([1, 2, 3], n => n === 1), n => n.toString()));
  // //    ^?
});
