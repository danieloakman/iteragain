import { ok as assert, deepStrictEqual, notDeepStrictEqual as notEqual, throws } from 'assert';
import {
  isIterable,
  isIterator,
  iter,
  concat,
  range,
  enumerate,
  flatten,
  toIterator,
  zip,
  zipLongest,
  partition,
  repeat,
  cycle,
  count,
  product,
  take,
  chunks,
  combinations,
  compress,
  resume,
  dropWhile,
  filter,
  filterMap,
  pairwise,
  permutations,
  slice,
  takeWhile,
  map,
  tap,
  triplewise,
  windows,
  tee,
  every,
  forEach,
  nth,
  quantify,
  reduce,
  some,
  roundrobin,
  distribute,
  toArray,
  divide,
  unique,
  unzip,
  spy,
  consume,
  reverse,
  seekable,
  min,
  max,
  minmax,
  find,
  findIndex,
  includes,
  shuffle,
  pluck,
  sort,
  length,
  flatMap,
  promiseAll,
  promiseRace,
  groupBy,
  arrayLike,
  pipe,
} from '..';
import FunctionIterator from '../internal/FunctionIterator';
import ObjectIterator from '../internal/ObjectIterator';
import SeekableIterator from '../internal/SeekableIterator';

/**
 * Expect value to be `T`, and return it to allow for piping/chaining.
 * This doesn't actually *do* anything, it's just for type checking in tests.
 */
const expectType = <T>(value: T) => value;

/** Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
const equal = <T>(actual: T, expected: T, message?: string | Error) => deepStrictEqual(actual, expected, message);

// import asyncMap from '../asyncMap';
// import asyncToArray from '../asyncToArray';

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

describe('internal', function () {
  describe('ExtendedIterator', function () {
    it('does implement IterableIterator', async function () {
      const iterator = iter([1, 2, 3]);
      assert(isIterable(iterator) && isIterator(iterator));
    });

    it("Doesn't reassign internal iterator", async () => {
      {
        const it1 = iter([1, 2, 3]);
        const it2 = it1.map(n => (n * 2).toString());
        equal(it2.toArray(), ['2', '4', '6']);
        equal(it1.toArray(), [], 'it1 should be empty');
      }
      {
        const it1 = iter('abc');
        const it2 = it1.map(n => n.toUpperCase().charCodeAt(0));
        equal(it2.toArray(), [65, 66, 67]);
        equal(it1.toArray(), [], 'it1 should be empty');
      }
    });

    it('[Symbol.iterator]', async function () {
      const iterator1 = iter([1, 2, 3]);
      equal([...iterator1[Symbol.iterator]()], [1, 2, 3]);
      equal([...iterator1[Symbol.iterator]()], []);
      const iterator2 = iter([1, 2, 3]).map(x => x * x);
      equal([...iterator2[Symbol.iterator]()], [1, 4, 9]);
      equal([...iterator2[Symbol.iterator]()], []);
      const iterator3 = iter([1, 2, 3]);
      for (const x of iterator3) if (x === 2) break;
      equal([...iterator3], [3]);
    });

    it('toString', async function () {
      equal(iter([]).toString(), 'ExtendedIterator');
    });

    it('length', async function () {
      equal(iter([]).length(), 0);
      equal(iter([1, 2, 3]).length(), 3);
    });

    it('map', async function () {
      equal(
        iter([1, 2, 3])
          .map(n => n * n)
          .map(n => n.toString())
          .toArray(),
        ['1', '4', '9'],
      );
    });

    it('filter', async function () {
      equal(
        iter([1, 2, 3])
          .filter(n => n % 2 === 0)
          .toArray(),
        [2],
      );
      equal(
        iter([1, 2, 3])
          .filter(n => n < 0)
          .toArray(),
        [],
      );
      equal(iter([]).filter(Boolean).toArray(), []);
      type A = { a: number };
      type B = { b: number };
      const isA = (v: any): v is A => typeof v.a === 'number';
      const arr: (A | B)[] = [{ a: 1 }, { b: 2 }, { a: 3 }, { b: 4 }];
      equal(iter(arr).filter(isA).toArray(), [{ a: 1 }, { a: 3 }]);
      equal(iter(['a', undefined]).filter(Boolean).toArray(), ['a']);
      equal(
        iter(['a', 1, 2, 'b'])
          .filter(v => typeof v === 'string')
          .toArray(),
        ['a', 'b'],
      );
      const isNullish = (v: any): v is null | undefined => v == null || v === undefined;
      equal(
        iter(['a', undefined, 'b', 3, null, /asd/])
          .filter(v => !isNullish(v))
          .filter(v => v instanceof RegExp)
          .toArray(),
        [/asd/],
      );
    });

    it('filterMap', async function () {
      equal(
        iter([1, 2, 3])
          .filterMap(n => (n % 2 === 0 ? (n * n).toString() : undefined))
          .toArray(),
        ['4'],
      );
    });

    it('reduce', async function () {
      const sum = (a: any, b: any) => a + b;
      equal(iter([1, 2, 3]).reduce(sum, 0), 6);
      equal(iter([1, 2, 3, 4]).reduce(sum), 10);
      equal(iter([1, 2, 3]).reduce(sum, ''), '123');
    });

    it('quantify', async function () {
      equal(
        iter([1, 2, 3]).quantify(n => n > 1),
        2,
      );
    });

    it('min', async function () {
      equal(iter([1, 2, 3]).min(), 1);
      equal(iter('123a0A').min(), '0');
    });

    it('max', async function () {
      equal(iter([1, 2, 3]).max(), 3);
      equal(iter('123a0A').max(), 'a');
    });

    it('minmax', async function () {
      equal(iter([1, 2, 3]).minmax(), [1, 3]);
      equal(iter('123a0A').minmax(), ['0', 'a']);
      equal(iter(['1', 0, '2']).minmax(), [0, '2']);
    });

    it('concat', async function () {
      equal(iter([1, 2, 3]).concat([4, 5, 6]).toArray(), [1, 2, 3, 4, 5, 6]);
      // const a = iter([1, 2, 3]).concat(['1']).concat([[1]]);
      //    ^?
    });

    it('prepend', async function () {
      equal(iter([1, 2, 3]).prepend([0]).toArray(), [0, 1, 2, 3]);
    });

    it('slice', async function () {
      const arr = [1, 2, 3, 4, 5];
      equal(iter(arr).slice(2, 4).toArray(), arr.slice(2, 4));
      equal(iter(arr).slice(2).toArray(), arr.slice(2));
      notEqual(iter(arr).slice(2, -1).toArray(), arr.slice(2, -1));
      equal(iter(arr).slice().toArray(), arr.slice());
    });

    it('flatten', async function () {
      equal(
        iter([1, [2], [[3]]])
          .flatten(1)
          .toArray(),
        [1, 2, [3]],
      );
      equal(
        iter([1, [2], [[3]]])
          .flatten(2)
          .toArray(),
        [1, 2, 3],
      );
      equal(
        iter([[[1, [2], [[3]]]]])
          .flatten()
          .toArray(),
        [1, 2, 3],
      );

      equal(
        iter(range(2))
          .map(() => iter(range(2)).map(() => iter(range(2)).permutations(2)))
          .flatten(2)
          .toArray(),
        [
          [0, 1],
          [1, 0],
          [0, 1],
          [1, 0],
          [0, 1],
          [1, 0],
          [0, 1],
          [1, 0],
        ],
      );
    });

    it('every & some', async function () {
      equal(
        iter([1, 2, 3]).every(n => n % 2 === 0),
        false,
      );
      equal(
        iter([2, 4, 6]).every(n => n % 2 === 0),
        true,
      );
      equal(
        iter([1, 2, 3]).some(n => n % 2 === 0),
        true,
      );
      equal(
        iter([1, 2, 3]).some(n => n > 3),
        false,
      );
    });

    it('sort', async function () {
      equal(iter([1, 2, 3]).sort().toArray(), [1, 2, 3]);
      equal(iter([3, 2, 1]).sort().toArray(), [1, 2, 3]);
      equal(
        iter([1, 2, 3])
          .sort((a, b) => b - a)
          .toArray(),
        [3, 2, 1],
      );
      equal(
        iter([3, 2, 1])
          .sort((a, b) => b - a)
          .toArray(),
        [3, 2, 1],
      );
      equal(iter([3, 2, 1, 3]).sort().toArray(), [1, 2, 3, 3]);
    });

    it('enumerate', async function () {
      equal(
        iter([1, 2, 3])
          .enumerate()
          .map(([i, n]) => [i, n * n])
          .toArray(),
        [
          [0, 1],
          [1, 4],
          [2, 9],
        ],
      );
    });

    it('zip & zipLongest', async function () {
      equal(
        iter([1, 2, 3])
          .zip(iter([4, 5]))
          .toArray(),
        [
          [1, 4],
          [2, 5],
        ],
      );
      equal(
        iter([1, 2, 3])
          .zipLongest(iter([4, 5]))
          .toArray(),
        [
          [1, 4],
          [2, 5],
          [3, undefined],
        ],
      );
    });

    it('takeWhile', async function () {
      equal(
        iter([1, 4, 6, 4, 1])
          .takeWhile(n => n < 5)
          .toArray(),
        [1, 4],
      );
      equal(
        iter([1, 2, 3])
          .takeWhile(n => n < 2)
          .toArray(),
        [1],
      );
      equal(
        iter([1, 2, 3])
          .takeWhile(n => n > 2)
          .toArray(),
        [],
      );
    });

    it('dropWhile', async function () {
      equal(
        iter([1, 4, 6, 4, 1])
          .dropWhile(n => n < 5)
          .toArray(),
        [6, 4, 1],
      );
      equal(
        iter([1, 2, 3])
          .dropWhile(n => n < 2)
          .toArray(),
        [2, 3],
      );
      equal(
        iter([1, 2, 3])
          .dropWhile(n => n > 2)
          .toArray(),
        [1, 2, 3],
      );
    });

    it('pairwise', async function () {
      equal(iter([1, 2, 3]).pairwise().toArray(), [
        [1, 2],
        [2, 3],
      ]);
      equal(iter([1, 2]).pairwise().toArray(), [[1, 2]]);
      equal(iter([1]).pairwise().toArray(), []);
      equal(iter([]).pairwise().toArray(), []);
    });

    it('triplewise', async function () {
      equal(iter(range(5)).triplewise().toArray(), [
        [0, 1, 2],
        [1, 2, 3],
        [2, 3, 4],
      ]);
      equal(iter([]).triplewise().toArray(), []);
    });

    it('unique', async function () {
      equal(iter([1, 1, 3, 3, 2, 2]).unique().toArray(), [1, 3, 2]);
      equal(iter('AAAABBBCCDAABBB').unique().join(''), 'ABCD');
      equal(iter('AAAABBBCCDAABBB').unique({ justSeen: true }).join(''), 'ABCDAB');
      equal(
        iter('ABBCcAD')
          .unique({ iteratee: v => v.toLowerCase() })
          .join(''),
        'ABCD',
      );
    });

    it('unzip', async function () {
      equal(
        iter([
          ['a', 1],
          ['b', 2],
        ])
          .unzip()
          .map(v => v.toArray()),
        [
          // TODO: look into this
          // @ts-expect-error
          ['a', 'b'],
          // @ts-expect-error
          [1, 2],
        ],
      );
      equal(
        iter([1, 2, 3])
          .unzip()
          .map(v => v.toArray()),
        [[1, 2, 3]],
      );
    });

    it('chunks', async function () {
      equal(iter([1, 2, 3, 4, 5]).chunks(2).toArray(), [[1, 2], [3, 4], [5]]);
      equal(iter([1, 2, 3, 4, 5]).chunks(3, 0).toArray(), [
        [1, 2, 3],
        [4, 5, 0],
      ]);
      equal(iter([1, 2, 3, 4, 5]).chunks(6).toArray(), [[1, 2, 3, 4, 5]]);
      equal(iter([1, 2, 3, 4, 5]).chunks(6, 0).toArray(), [[1, 2, 3, 4, 5, 0]]);
      equal(iter([]).chunks(5).toArray(), []);
    });

    it('windows', async function () {
      equal(iter([1, 2, 3]).windows(1, 1).toArray(), [[1], [2], [3]]);
      equal(iter([1, 2, 3]).windows(2, 1).toArray(), [
        [1, 2],
        [2, 3],
      ]);
      equal(iter([1, 2, 3]).windows(3, 1).toArray(), [[1, 2, 3]]);
      equal(iter([1, 2, 3]).windows(4, 1).toArray(), []);
      equal(iter([]).windows(5, 1).toArray(), []);
      equal(iter([1, 2, 3, 4, 5]).windows(2, 3).toArray(), [
        [1, 2],
        [4, 5],
      ]);
      equal(iter([1, 2, 3, 4, 5]).windows(3, 4, 0).toArray(), [
        [1, 2, 3],
        [5, 0, 0],
      ]);
    });

    it('tee', async function () {
      const [a, b] = iter([1, 2, 3]).tee(2);
      equal(a.toArray(), [1, 2, 3]);
      equal(b.toArray(), [1, 2, 3]);
    });

    it('promiseAll', async function () {
      equal(iter([1, 2, 3]).toArray(), [1, 2, 3]);
      equal(iter([]).toArray(), []);
      const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
      equal(
        await iter(range(3))
          .map(n => sleep(n))
          .map(p => p.then(n => n * 10))
          .promiseAll(),
        [0, 10, 20],
      );
    });

    it('promiseRace', async function () {
      const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
      equal(
        await iter([3, 1, 2])
          .map(n => sleep(n * 10))
          .promiseRace(),
        10,
      );
    });

    it('cycle', async function () {
      equal(iter([1, 2, 3]).cycle(2).toArray(), [1, 2, 3, 1, 2, 3, 1, 2, 3]);
      equal(iter([1, 2, 3]).cycle().take(7), [1, 2, 3, 1, 2, 3, 1]);
    });

    it('distribute', async function () {
      equal(
        iter(range(3))
          .distribute(2)
          .map(v => v.toArray()),
        [[0, 2], [1]],
      );
      equal(
        iter(range(6))
          .distribute(2)
          .map(v => v.toArray()),
        [
          [0, 2, 4],
          [1, 3, 5],
        ],
      );
      equal(
        iter(range(6))
          .distribute(3)
          .map(v => v.toArray()),
        [
          [0, 3],
          [1, 4],
          [2, 5],
        ],
      );
    });

    it('divide', async function () {
      equal(
        iter(range(3))
          .divide(2)
          .map(v => v.toArray()),
        [[0, 1], [2]],
      );
      equal(
        iter(range(10))
          .divide(3)
          .map(v => v.toArray()),
        [
          [0, 1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      );
      equal(
        iter([])
          .divide(3)
          .map(v => v.toArray()),
        [[], [], []],
      );
    });

    it('resume', async function () {
      let iterator = iter([1, 2, 3]).resume(1);
      equal(iterator.toArray(), [1, 2, 3]);
      equal(iterator.toArray(), [1, 2, 3]);
      equal(iterator.toArray(), []);
      iterator = iter([1, 2, 3]).resume();
      iter(range(10)).forEach(() => equal(iterator.toArray(), [1, 2, 3]));
    });

    it('reverse', async function () {
      equal(iter([1, 2, 3]).reverse().toArray(), [3, 2, 1]);
      equal(iter([]).reverse().toArray(), []);
    });

    it('pluck', async function () {
      equal(
        iter([{ a: 1 }, { a: 2 }, { a: 3 }])
          .pluck('a')
          .toArray(),
        [1, 2, 3],
      );
      equal(
        iter([{ a: 1, b: 2 }, { a: 2 }, { a: 3 }])
          .pluck('b')
          .toArray(),
        [2],
      );
      equal(iter({ a: 1 }).pluck(0).toArray(), ['a']);
    });

    it('compress', async function () {
      equal(iter([1, 2, 3]).compress([0, 1, 0]).toArray(), [2]);
      equal(iter('abcdef').compress([1, 0, 1, 0, 1, 1]).join(''), 'acef');
      equal(
        pipe('*hi*', compress([0, 1, 1, 0]), toArray, v => v.join('')),
        'hi',
      );
    });

    it('permutations', async function () {
      equal(iter([0, 1]).permutations().toArray(), [
        [0, 1],
        [1, 0],
      ]);
      equal(iter([0, 1, 2]).permutations().toArray(), [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
      ]);
      equal(iter('abcd').permutations(2).toArray(), [
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['b', 'a'],
        ['b', 'c'],
        ['b', 'd'],
        ['c', 'a'],
        ['c', 'b'],
        ['c', 'd'],
        ['d', 'a'],
        ['d', 'b'],
        ['d', 'c'],
      ]);
      equal(iter('abc').permutations(4).toArray(), []);
    });

    it('combinations', async function () {
      equal(iter([0, 1]).combinations(2).toArray(), [[0, 1]]);
      equal(iter('ABCD').combinations(2).toArray(), [
        ['A', 'B'],
        ['A', 'C'],
        ['A', 'D'],
        ['B', 'C'],
        ['B', 'D'],
        ['C', 'D'],
      ]);
      equal(iter('ABC').combinations(2, true).toArray(), [
        ['A', 'A'],
        ['A', 'B'],
        ['A', 'C'],
        ['B', 'B'],
        ['B', 'C'],
        ['C', 'C'],
      ]);
      equal(iter(range(4)).combinations(3).toArray(), [
        [0, 1, 2],
        [0, 1, 3],
        [0, 2, 3],
        [1, 2, 3],
      ]);
      equal(iter([0, 1]).combinations(1).toArray(), [[0], [1]]);
      equal([...iter(range(2)).combinations(5)], []);
    });

    it('product', async function () {
      equal(iter('abcd').product(['xy']).toArray(), [
        ['a', 'x'],
        ['a', 'y'],
        ['b', 'x'],
        ['b', 'y'],
        ['c', 'x'],
        ['c', 'y'],
        ['d', 'x'],
        ['d', 'y'],
      ]);
      equal(iter(range(2)).product(2).toArray(), [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
    });

    it('join', async function () {
      equal(iter([1, 2, 3]).join(), '1,2,3');
      equal(iter([1, 2, 3]).join(''), '123');
      equal(iter([1, 2, 3]).join('-'), '1-2-3');
    });

    it('find', async function () {
      equal(
        iter([1, 2, 3]).find(n => n > 2),
        3,
      );
      equal(
        iter([1, 2, 3]).find(n => n > 4),
        undefined,
      );
    });

    it('findIndex', async function () {
      equal(
        iter([1, 2, 3]).findIndex(n => n > 2),
        2,
      );
      equal(
        iter([1, 2, 3]).findIndex(n => n > 4),
        -1,
      );
    });

    it('flatMap', async function () {
      // @ts-ignore
      const arr = [1, 2, 3].flatMap(n => [n, n * 2]);
      equal(
        iter([1, 2, 3])
          .flatMap(n => [n, n * 2])
          .toArray(),
        arr,
      );
    });

    it('groupBy', async function () {
      const groupBy = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .sort((a, b) => (a % 2) - (b % 2))
        .groupBy(n => n % 2)
        .toArray();
      equal(groupBy, [
        [0, [2, 4, 6, 8, 10]],
        [1, [1, 3, 5, 7, 9]],
      ]);
      equal(iter([]).groupBy().toArray(), []);
      equal(
        iter([{ a: 1 }])
          .groupBy('a')
          .map(v => v[0])
          .toArray(),
        [1],
      );
      equal(iter('abc').groupBy().pluck(0).toArray(), ['a', 'b', 'c']);
    });

    it('includes', async function () {
      equal(iter([1, 2, 3]).includes(2), true);
      equal(iter([1, 2, 3]).includes(4), false);
    });

    it('consume & tap', async function () {
      let mapWasCalled = 0;
      const f = () => mapWasCalled++;
      equal(iter([1, 2, 3]).tap(f).consume(), undefined);
      equal(mapWasCalled, 3);
      const iterator = iter([1, 2, 3]);
      mapWasCalled = 0;
      equal(iterator.tap(f).consume(2), undefined);
      equal(mapWasCalled, 2);
      equal(iterator.toArray(), [3]);
      // Test the deprecated exhaust method:
      equal(iterator.exhaust(), undefined);
    });

    it('shuffle', async function () {
      const shuffled = iter(range(100)).shuffle().toArray();
      equal(shuffled.length, 100);
      equal(
        shuffled.sort((a: number, b: number) => a - b),
        range(100).toArray(),
      );
    });

    it('peek', async function () {
      const itA = iter([1, 2, 3, 4, 5]);
      equal(itA.peek(), [1]);
      equal(itA.peek(1), [1]);
      equal(itA.peek(3), [1, 2, 3]);
      equal(itA.toArray(), [1, 2, 3, 4, 5]);
      // @ts-expect-error
      equal(itA.peek(), []);
      // @ts-expect-error
      equal(itA.peek(3), []);
      equal(iter([1]).peek(2), [1]);
      const itB = iter(zip('abc', 'abc'));
      equal(itB.peek(), [['a', 'a']]);
      equal(itB.peek(1), [['a', 'a']]);
    });

    it('take', async function () {
      const iterator = iter([1, 2, 3, 4, 5]);
      equal(iterator.take(), [1]);
      equal(iterator.take(2), [2, 3]);
      equal(iterator.take(1), [4]);
      equal(iterator.toArray(), [5]);
      // @ts-expect-error
      equal(iterator.take(), []);
      // @ts-expect-error
      equal(iterator.take(3), []);
      equal(iter([1]).take(2), [1]);
    });

    it('partition', async function () {
      equal(
        iter([1, 2, 3, 4, 5]).partition(n => n % 2 === 0),
        [
          [1, 3, 5],
          [2, 4],
        ],
      );
    });

    it('nth', async function () {
      equal(iter([1, 2, 3, 4, 5]).nth(2), 3);
      equal(iter([1, 2, 3, 4, 5]).nth(5), undefined);
      equal(iter([1, 2, 3, 4, 5]).nth(-6), undefined);
    });

    it('toSet', async function () {
      const nums = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const set = iter(nums)
        .filter(n => n % 2 === 0)
        .toSet();
      assert(nums.filter(n => n % 2 === 0).every(n => set.has(n)));
    });

    it('toMap', async function () {
      const map = iter(range(10))
        .map(n => [n, n * 2])
        .toMap();
      iter(range(10)).forEach(n => assert(map.get(n) === n * 2));
      const map2 = iter(range(10))
        .map(n => [n.toString(), n * 2])
        .toMap<string, number>();
      iter(range(10)).forEach(n => assert(map2.get(n.toString()) === n * 2));
      const map3 = iter(range(10))
        .map(n => [n.toString(), { n: n * 2 }])
        .toMap<string, { n: number }>();
      iter(range(10)).forEach(n => assert(map3.get(n.toString())?.n === n * 2));
      // This iterator's type does not extend `any[]`:
      throws(() => iter(range(10)).toMap());
    });
  });

  // it('CachedIterator', async function () {
  //   const it = new CachedIterator(range(10));
  //   equal([...it], [...range(10)]);
  //   assert(it.cache.has(3) && it.cache.has(7));
  // });

  it('FunctionIterator', async function () {
    const it = new FunctionIterator(
      (
        (n = 0) =>
        () =>
          n++ * 2
      )(),
      100 as const,
    );
    equal([...it], [...range(0, 100, 2)]);
    equal([...it], []);
    const it2 = iter(
      (
        (t = 0) =>
        (n?: number) => {
          if (typeof n === 'number') t += n;
          return t;
        }
      )(),
    ).map(n => n + 10);
    equal(it2.next(1).value, 11);
    equal(it2.next(2).value, 13);
    equal(it2.next(3).value, 16);
    function* sum(): Generator<number> {
      let t = 0;
      while (true) {
        const n = yield t;
        if (typeof n === 'number') t += n;
      }
    }
    const it3 = iter(sum());
    equal(it3.next(0).value, 0);
    equal(it3.next(1).value, 1);
    equal(it3.next(2).value, 3);
    equal(it3.next(3).value, 6);
  });

  it('ObjectIterator', async function () {
    this.timeout(5000);
    this.slow(2000);
    const obj = { a: 1 };
    equal([...new ObjectIterator(obj)], [['a', 1, obj]]);
    const obj2 = { a: 1, b: { c: 2, d: { e: 3 } }, f: 4 };
    equal(
      [...new ObjectIterator(obj2, 'pre-order-DFS')].map(([k]) => k),
      ['a', 'b', 'c', 'e', 'd', 'f'],
    );
    const obj3 = { a: 1, b: { c: 2 } } as Record<string, any>;
    const obj4 = { circle: obj3 } as Record<string, any>;
    obj3.b.circle = obj4;
    throws(() => [...new ObjectIterator(obj3, 'pre-order-DFS')].map(([k]) => k));
  });
});

// it('asyncMap', async function () {
//   this.timeout(10000);
//   async function* nums(n: number) {
//     for (let i = 0; i < n; i++) {
//       await sleep(1);
//       yield i;
//     }
//   }
//   const it = asyncMap(nums(5), async v => v * 2);
//   equal(await asyncToArray(it), [0, 2, 4, 6, 8]);
// });

it('arrayLike', async function () {
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

it('chunks', async function () {
  equal([...chunks([1, 2, 3, 4, 5], 2)], [[1, 2], [3, 4], [5]]);
  equal(pipe(range(1, 11), chunks(3, -1), toArray), [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, -1, -1],
  ]);
});

it('combinations', async function () {
  equal([...combinations([0, 1], 2)], [[0, 1]]);
  equal(pipe([0, 1, 2], combinations(2, true), take(3)), [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});

it('compress', async function () {
  equal([...compress([1, 2, 3, 4, 5], [1, 1, 0, 0, 1])], [1, 2, 5]);
});

it('concat', async function () {
  equal([...concat([1, 2, 3], [], range(4, 7))], [1, 2, 3, 4, 5, 6]);
  // const a = toArray(concat([1, 2, 3, ''], [1, 2, 3]));
  //    ^?
});

it('consume', async function () {
  const arr: number[] = [];
  equal(consume(tap(range(3), n => arr.push(n))), undefined);
  equal(arr, [0, 1, 2]);
  equal(
    pipe(
      range(5, 10),
      tap(n => arr.push(n)),
      consume,
    ),
    undefined,
  );
  equal(arr, [0, 1, 2, 5, 6, 7, 8, 9]);
  equal(
    pipe(
      range(5, 10),
      tap(n => arr.push(n)),
      consume(1),
    ),
    undefined,
  );
  equal(arr, [0, 1, 2, 5, 6, 7, 8, 9, 5]);
});

it('count', async function () {
  equal(take(count(), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it('cycle', async function () {
  equal(take(cycle([1, 2, 3]), 10), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  equal([...cycle(range(3), 1)], [0, 1, 2, 0, 1, 2]);
  equal(pipe(range(1, 4), cycle, take(10)), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  equal(pipe(range(1, 4), cycle(2), toArray), [1, 2, 3, 1, 2, 3, 1, 2, 3]);
});

it('distribute', async function () {
  equal(
    [...distribute(range(3), 3)].map(v => toArray(v)),
    [[0], [1], [2]],
  );
  equal(
    [...distribute(range(6), 2)].map(v => toArray(v)),
    [
      [0, 2, 4],
      [1, 3, 5],
    ],
  );
  equal(
    pipe(range(5), distribute(4), v => v.map(toArray)),
    [[0, 4], [1], [2], [3]],
  );
  // const a = toArray(distribute(['', 2], 2));
  //    ^?
});

it('divide', async function () {
  equal(
    divide(range(1, 4), 3).map(v => toArray(v)),
    [[1], [2], [3]],
  );
  equal(
    divide(range(1, 7), 3).map(v => toArray(v)),
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  );
  equal(
    divide(range(1, 4), 5).map(v => [...v]),
    [[1], [2], [3], [], []],
  );
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

it('dropWhile', async function () {
  equal([...dropWhile(range(10), n => n < 5)], [5, 6, 7, 8, 9]);
  equal(
    pipe(
      count(),
      dropWhile(n => n < 10),
      take(5),
    ),
    [10, 11, 12, 13, 14],
  );
  // const a = toArray(dropWhile(range(10), n => n < 10));
  //    ^?
});

it('enumerate', async function () {
  equal(
    [...enumerate([{ a: 1 }, { b: 2 }])],
    [
      [0, { a: 1 }],
      [1, { b: 2 }],
    ],
  );
});

it('every', async function () {
  equal(
    every(range(10), n => n < 10),
    true,
  );
  equal(
    every(range(10), n => n < 5),
    false,
  );
  assert(
    pipe(
      range(50, 100, 2),
      every(n => n % 2 === 0),
    ),
  );
});

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

it('filterMap', async function () {
  equal([...filterMap(range(10), n => (n % 2 === 0 ? n : null))], [0, 2, 4, 6, 8]);
  equal(
    pipe(
      range(10),
      filterMap(n => (n > 4 ? n.toString() : undefined)),
      take(3),
    ),
    ['5', '6', '7'],
  );
  // const a = toArray(filterMap([1, 2, 3, null, ''], n => n));
  //    ^?
});

it('find', async function () {
  equal(
    find(range(10), n => n === 5),
    5,
  );
  equal(
    find(range(10), n => n === 10),
    undefined,
  );
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

it('findIndex', async function () {
  equal(
    findIndex(range(10), n => n === 5),
    5,
  );
  equal(
    findIndex(range(10), n => n === 10),
    -1,
  );
  equal(
    pipe(
      range(5, 10),
      findIndex(n => n === 8),
    ),
    3,
  );
});

it('flatMap', async function () {
  const a = [1, 2, [3]].flatMap(n => n);
  equal([...flatMap([1, 2, [3]], n => n)], a);
  function dotsEitherSide(n: number[]) {
    return flatMap(n, n => [n - 0.1, n, n + 0.1]);
  }
  equal(expectType<number[]>([...dotsEitherSide([1, 2, 3])]), [0.9, 1, 1.1, 1.9, 2, 2.1, 2.9, 3, 3.1]);
  function repeatNums(n: number[]) {
    return flatMap(n, n => repeat(n, n));
  }
  equal([...repeatNums([1, 2, 3])], [1, 2, 2, 3, 3, 3]);
  function chars(...strings: string[]) {
    return flatMap(strings, str => [...str]);
  }
  equal(expectType<string[]>([...chars('abc', 'def')]), ['a', 'b', 'c', 'd', 'e', 'f']);
  equal([...flatMap(['123'], str => str)], ['123']);
  equal(
    pipe(
      'abcde',
      flatMap(str => [str, str.charCodeAt(0)]),
      toArray,
      expectType<(string | number)[]>,
    ),
    ['a', 97, 'b', 98, 'c', 99, 'd', 100, 'e', 101],
  );
  expectType<IterableIterator<number | string | Buffer>>(flatMap([1, 2, 3], n => [n, n.toString(), Buffer.from('')]));
});

it('flatten', async function () {
  equal([...flatten([[1], [2, 3, 4], [5, [[[[[[6]]]]]]]])], [1, 2, 3, 4, 5, 6]);
  equal([...flatten([[1], [2, 3], [4, 5]])], [1, 2, 3, 4, 5]);
  equal([...flatten([[1], [[2], 3]], 2)], [1, 2, 3]);
  equal([...flatten([[1], [[2], 3]], 1)], [1, [2], 3]);
  equal([...flatten([[1], [[2], 3]], 0)], [[1], [[2], 3]]);
  equal([...flatten('abc')], ['a', 'b', 'c']);
  equal([...flatten(['abc'])], ['abc']);
  equal(
    [
      ...flatten(
        map(range(3), () => range(2)),
        1,
      ),
    ],
    [0, 1, 0, 1, 0, 1],
  );
  pipe(
    ['a', [[1], [[[[[2], [[[3]]]]]]]]],
    flatten,
    expectType<IterableIterator<number>>,
    filter((v): v is number => typeof v === 'number'),
    toArray,
    v => (assert(v.length), v),
    forEach(n => assert(typeof n === 'number')),
  );
  // const a = toArray(flatten([[1, 2, 3, '', [['']]], [['']]], 1));
  // //    ^?
});

it('forEach', async function () {
  const arr: number[] = [];
  forEach(range(10), n => arr.push(n));
  equal(arr, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  pipe(
    range(10),
    shuffle,
    filter(n => n > 5),
    expectType<IterableIterator<number>>,
    forEach(n => assert(n > 5)),
  );
});

it('groupBy', async function () {
  equal(
    [...groupBy('AAAABBBCCDAABBB')].map(v => v[0]),
    ['A', 'B', 'C', 'D', 'A', 'B'],
  );
  equal(
    [...groupBy('AAAABBBCCD')].map(v => v[1].join('')),
    ['AAAA', 'BBB', 'CC', 'D'],
  );
  equal(toArray(map(groupBy([{ a: 1 }, { a: 2 }, { a: 3 }], 'a'), v => v[0])), [1, 2, 3]);
  equal(
    toArray(
      map(
        groupBy([1, 2, 3, 4, 5], v => v % 2),
        v => v[0],
      ),
    ),
    [1, 0, 1, 0, 1],
  );
  equal(toArray(map(groupBy([true, true, false, false]), v => v[0])), [true, false]);
  equal(
    toArray(
      map(
        groupBy([{ a: 1 }, { a: 1 }, { a: 3 }], v => v.a),
        v => v[0],
      ),
    ),
    [1, 3],
  );
});

it('includes', async function () {
  equal(includes(range(10), 5), true);
  equal(includes(range(10), 10), false);
  assert(
    pipe(
      count(),
      map(() => Math.floor(Math.random() * 1000) + 1),
      includes(1),
    ),
  );
});

it('isIterable', async function () {
  assert(isIterable([1, 2, 3]));
  assert(isIterable('abc'));
  assert(isIterable(new Set([1, 2, 3])));
  assert(
    isIterable(
      new Map([
        [1, 2],
        [3, 4],
      ]),
    ),
  );
  assert(isIterable(new Int8Array([1, 2, 3])));
  assert(isIterable(Buffer.from('abc')));
  assert(!isIterable(null));
});

it('isIterator', async function () {
  assert(
    isIterator(
      (function* () {
        yield 1;
      })(),
    ),
  );
  assert(isIterator({ next() {} }));
  assert(!isIterator(null));
});

it('iter', async function () {
  equal(
    iter([1, 2, 3])
      .map(n => n * n)
      .toArray(),
    [1, 4, 9],
  );
  equal(
    iter({ a: 1, b: 2, c: 3 })
      .map(v => [v[0], v[1] * 2])
      .toArray(),
    [
      ['a', 2],
      ['b', 4],
      ['c', 6],
    ],
  );
  // Probably won't end up handling this, as it would slow down `iter` a bit.
  throws(() => iter({ next() {} }).toArray());
  /** @returns post-order-DFS traversal of `obj` by using the `reviver` cb of `JSON.parse`. */
  function jsonStrParse(obj: any): [string, any][] {
    const result: any[] = [];
    JSON.parse(JSON.stringify(obj), (k, v) => (result.push([k, v]), v));
    return result.slice(0, result.length - 1);
  }
  const obj = { a: 1, b: { c: 2, d: { e: 3 } }, f: 4 };
  equal(
    [...iter(obj).map(v => v[0])],
    iter(jsonStrParse(obj))
      .map(v => v[0])
      .toArray(),
  );
});

it('length', async function () {
  equal(length(range(10)), 10);
  equal(length(range(0)), 0);
  equal(length(range(1)), 1);
  equal(length(range(100)), 100);
});

it('map', async function () {
  const result = [...map(range(10), n => n * n)];
  equal(result, [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
  equal(result, [
    ...pipe(
      range(10),
      map(v => v * v),
      expectType<IterableIterator<number>>,
    ),
  ]);
  expectType<(number | string)[][]>(toArray(map([1, 3], n => [n, n.toString()])));
  expectType<(readonly [number, string])[]>(toArray(map([1, 3], n => [n, n.toString()] as const)));
});

it('max', async function () {
  equal(max(range(10)), 9);
  equal(
    max(range(10), n => -n),
    0,
  );
  equal(pipe(range(10), shuffle, expectType<IterableIterator<number>>, max, expectType<number>), 9);
  equal(
    pipe(
      range(10),
      map(n => [n, (n * n).toString()] as const),
      shuffle,
      max(v => parseFloat(v[1])),
      expectType<readonly [number, string]>,
    ),
    [9, '81'],
  );
});

it('min', async function () {
  equal(min(range(10)), 0);
  equal(
    min(range(10), n => -n),
    9,
  );
  equal(
    pipe(
      range(-50, 50),
      shuffle,
      map(n => n.toString()),
      min(n => parseFloat(n)),
    ),
    '-50',
  );
});

it('minmax', async function () {
  equal(minmax(range(10)), [0, 9]);
  equal(
    minmax(range(10), n => -n),
    [9, 0],
  );
  equal(
    pipe(
      range(-50, 50),
      map(n => n * n),
      shuffle,
      map(n => n.toString()),
      minmax(n => parseFloat(n)),
      expectType<[string, string]>,
    ),
    ['0', '2500'],
  );
});

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

it('pairwise', async function () {
  equal(
    [...pairwise(range(10))],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
    ],
  );
});

it('partition', async function () {
  equal(
    partition([1, 2, 3, 4, 5], n => n % 2 === 0),
    [
      [1, 3, 5],
      [2, 4],
    ],
  );
  equal(
    pipe(
      range(15, 20),
      partition(n => n % 2),
    ),
    [
      [16, 18],
      [15, 17, 19],
    ],
  );
});

it('permutations', async function () {
  const result1 = [...permutations([1, 2, 3], 3)];
  equal(result1, [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ]);
  const k = (nums: number[]) => nums.join(',');
  const result2 = result1.map(k);
  assert(
    pipe(
      [1, 2, 3],
      permutations(3),
      map(v => {
        v.reverse();
        return v;
      }),
      some(v => result2.includes(k(v))),
    ),
  );
});

it('pluck', async function () {
  equal([...pluck([{ a: 1 }, { a: 2 }, { a: 3 }], 'a')], [1, 2, 3]);
  equal(
    // @ts-expect-error
    [...pluck([{ a: 1 }, { a: 2 }, { a: 3 }], 'b')],
    [],
  );
  equal(
    pipe(
      range(5),
      map(n => ({ n, rand: Math.random() })),
      pluck('n'),
      take(3),
      v => {
        expectType<number[]>(v);
        return v;
      },
    ),
    [0, 1, 2],
  );
});

it('product', async function () {
  equal(
    [...product([range(2)], 2)],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  );
  equal(
    [...product(['ABCD', 'xy'])],
    [
      ['A', 'x'],
      ['A', 'y'],
      ['B', 'x'],
      ['B', 'y'],
      ['C', 'x'],
      ['C', 'y'],
      ['D', 'x'],
      ['D', 'y'],
    ],
  );
  equal(
    [...product([range(2)], 3)],
    [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 1, 1],
    ],
  );
});

it('promiseAll', async function () {
  this.slow(500);
  const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
  const [it1, it2] = tee(
    iter(range(10)).map(n => n * 10),
    2,
  );
  equal(await promiseAll(map(it1, sleep)), toArray(it2));
});

it('promiseRace', async function () {
  const sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));
  equal(await promiseRace(map([20, 10, 30], sleep)), 10);
});

it('quantify', async function () {
  equal(
    quantify(range(10), n => n % 2 === 0),
    5,
  );
  equal(
    pipe(
      range(5, 50),
      quantify(n => n % 2 === 0),
    ),
    22,
  );
});

it('range', async function () {
  this.slow(300);
  equal([...range(5, 10, 2)], [5, 7, 9]);
  equal([...range(5, 10)], [5, 6, 7, 8, 9]);
  equal([...range(5, 0, -1)], [5, 4, 3, 2, 1]);
  equal([...range(5, 0, -3)], [5, 2]);
  equal([...range(5, 0, -4)], [5, 1]);
  equal([...range(5, -5, -2)], [5, 3, 1, -1, -3]);
  equal([...range(4, -1)], [4, 3, 2, 1, 0]);
  equal([...range(10, 10)], []);
  equal([...range(10)], [...range(0, 10, 1)]);
  equal([...range(10)], range(10).toArray());
  equal([...range(2, 1, 1)], []);
  equal(take(range(Infinity), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  equal(take(range(-Infinity), 10), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
  equal([...range(1, 0)], [1]);
  equal(range(10, 0, 1).toArray(), []);
  equal(range(10).nth(-1), 9);
  equal(range(10).nth(10), undefined);
  equal(range(10).nth(Infinity), undefined);
  equal(range(10).nth(-10), 0);
  equal(range(10).nth(-11), undefined);
  equal(range(10).nth(5), range(10).at(5));
  let r = range(3);
  equal([...r, ...r], [0, 1, 2, 0, 1, 2]);
  assert(range(3).equal(range(0, 3, 1)));
  // @ts-ignore
  assert(range().toArray(), []);
  // Is still subject to floating numbers rounding errors:
  throws(() => equal(range(0, 5, 0.3).toArray(), [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7]));
  assert(range(0, Infinity, 13).includes(26));
  assert(range(Infinity).has(10));
  assert(range(-Infinity).has(-10));

  for (const args of [
    [10],
    [-10],
    [0, 10, 2],
    [0, -10, -2],
    [2, 10, 3],
    [-10, 0],
    [10, 0],
    [10, 0, 1],
    [0, 5, 0.25],
  ] as [number, number, number][]) {
    r = range(...args);
    const nums = r.toArray();
    assert(
      nums.every(n => r.includes(n)),
      `${nums} should be a subset of ${r}`,
    );
    assert(!r.includes(Math.min(...nums) - 1));
    assert(!r.includes(Math.max(...nums) + 1));
    equal(nums.length, r.length, `[${nums}] should have the same length as ${r}`);
    assert(nums.every((n, i) => n === r.nth(i) && r.index(n) === i));
  }
});

it('reduce', async function () {
  equal(
    reduce(range(10), (acc, n) => acc + n),
    45,
  );
  equal(
    pipe(
      range(5),
      reduce((acc, n) => acc + n),
    ),
    10,
  );
  equal(
    pipe(
      range(10),
      reduce((acc, s) => acc + s, ''),
    ),
    '0123456789',
  );
});

it('repeat', async function () {
  equal(take(repeat(1), 5), [1, 1, 1, 1, 1]);
  equal([...repeat(1, 5)], [1, 1, 1, 1, 1]);
});

it('resume', async function () {
  let it = resume(range(2), 1);
  equal([...it, ...it, ...it], [0, 1, 0, 1]);
  it = resume(range(2));
  equal([...it], [0, 1]);
  const it2 = pipe(
    [5, 8, 13],
    map(n => n.toString()),
    resume(1),
    v => {
      expectType<IterableIterator<string>>(v);
      return v;
    },
  );
  equal([...it2, ...it2, ...it2], ['5', '8', '13', '5', '8', '13']);
});

it('reverse', async function () {
  equal([...reverse(range(10))], [...range(9, -1)]);
  const mapper = (n: number) => n * n;
  equal([...map(reverse(range(10)), mapper)], [...map(range(9, -1), mapper)]);
});

it('roundrobin', async function () {
  equal([...roundrobin([1, 2, 3], [4, 5, 6])], [1, 4, 2, 5, 3, 6]);
  equal([...roundrobin('ABC', 'D', 'EF')], ['A', 'D', 'E', 'B', 'F', 'C']);
});

it('seekable', async function () {
  {
    const it = seekable(count(), 5);
    const toValues = <T extends IteratorResult<any>[]>(...itResults: T) => itResults.map(it => it.value);
    equal(toValues(it.next(), it.next(), it.next()), [0, 1, 2]);
    it.seek(0);
    equal(toValues(it.next(), it.next(), it.next()), [0, 1, 2]);
    equal(it.elements, [0, 1, 2]);
    equal(it.peek(), [it.next().value]);
    it.seek(10);
    equal(it.elements, [5, 6, 7, 8, 9]);
    it.seek(-1);
    equal(it.peek(), [9]);
  }
  {
    const empty = seekable([]);
    equal(empty.seek(10), undefined);
  }
  {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
      return true;
    };
    const primes = pipe(count(), filter(isPrime), seekable(100));
    expectType<SeekableIterator<number>>(primes);
    primes.seek(5);
    equal(primes.next().value, 13);
  }
  equal(
    pipe(
      range(10),
      seekable(1),
      v => (v.seek(100), v),
      v => v.next().value,
    ),
    undefined,
  );
});

it('shuffle', async function () {
  const shuffled = [...shuffle(range(10))];
  equal(shuffled.length, 10);
  equal(
    shuffled.sort((a: number, b: number) => a - b),
    range(10).toArray(),
  );
  const expected = [3, 4, 1, 2];
  iter(range(10)).forEach(() => {
    equal(toArray(shuffle([3, 1, 2, 4], 0.5)), expected);
  });
  iter(range(0, 1.1, 0.1)).forEach(seed => {
    const nums = range(100);
    equal(toArray(shuffle(nums, seed)), toArray(shuffle(nums, seed)));
  });
  assert(includes(shuffle(range(10), 1), undefined));
  assert(includes(shuffle(range(10), -1), undefined));
  assert(includes(shuffle(range(10), -0.00001), undefined));
  assert(!includes(shuffle(range(10), 0.99999), undefined));
  assert(!includes(shuffle(range(10), 0), undefined));
  assert(!includes(shuffle(range(10), -0), undefined));
});

it('slice', async function () {
  equal([...slice([1, 2, 3, 4, 5], 1, 3)], [2, 3]);
  equal([...slice([1, 2, 3, 4, 5], 1)], [2, 3, 4, 5]);
  equal(pipe(range(10), slice(1, 5), toArray), [1, 2, 3, 4]);
});

it('some', async function () {
  equal(
    some([1, 2, 3], n => n > 2),
    true,
  );
  equal(
    some([1, 2, 3], n => n > 4),
    false,
  );
});

it('sort', async function () {
  equal([...sort([3, 1, 2])], [1, 2, 3]);
  equal([...sort([3, 1, 2], (a, b) => b - a)], [3, 2, 1]);
  equal([...sort([3, 1, 2], (a, b) => a - b)], [1, 2, 3]);
  equal([...sort([3, 1, 3, 2])], [1, 2, 3, 3]);
  equal(pipe(range(10), shuffle, sort, toArray), pipe(range(10), toArray));
  equal(
    pipe(
      range(10),
      shuffle,
      sort((a, b) => b - a),
      toArray,
    ),
    pipe(range(9, -1), toArray),
  );
  equal(pipe(range(10), shuffle, sort(), toArray), pipe(range(10), toArray));
});

it('spy', async function () {
  const [value, it] = spy(range(10));
  equal(value, [0]);
  equal(spy(it, 10)[0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  equal(
    pipe(
      count(),
      map(n => n + 1),
      spy(3),
      v => v[0],
    ),
    [1, 2, 3],
  );
});

it('take', async function () {
  const arr = range(10).toArray();
  equal(take(arr, 3), [0, 1, 2]);
  equal(take(arr, 3), [0, 1, 2]);
  const it = range(10);
  equal(take(it, 3), [0, 1, 2]);
  equal(take(it, 3), [3, 4, 5]);
  equal(take(it), [6]);
});

it('takeWhile', async function () {
  equal([...takeWhile([1, 2, 3, 4, 5], n => n < 3)], [1, 2]);
  equal(
    pipe(
      range(-10, 10),
      takeWhile(n => n < 0),
      toArray,
    ),
    pipe(range(-10, 0), toArray),
  );
});

it('tap', async function () {
  const arr: number[] = [];
  const it = tap([1, 2, 3], n => arr.push(n * 2));
  equal([...it], [1, 2, 3]);
  equal(arr, [2, 4, 6]);
});

it('tee', async function () {
  // this.timeout(60000);
  let [a, b] = tee([1, 2, 3], 2).map(v => iter(v));
  a = a.map(x => x * x);
  b = b.map(x => x + x);
  equal(a.take(), [1]);
  equal(b.take(2), [2, 4]);
  equal(a.toArray(), [4, 9]);
  equal(b.toArray(), [6]);
  equal([...tee([1, 2, 3], 1)[0]], [1, 2, 3]);
  equal(
    pipe(range(3), tee(3), ([it1, it2, it3]) => zip(it3, it2, it1), toArray),
    [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
  );
  // const suite = setupSuite('tee');
  // const SIZE = 1e1;
  // suite.add('no clear', () => {
  //   const [a, b] = range(SIZE).tee(2);
  //   a.map(x => x * x).toArray();
  //   b.map(x => x + x).toArray();
  // });
  // suite.add('clear', () => {
  //   const [a, b] = range(SIZE).tee(2, true);
  //   a.map(x => x * x).toArray();
  //   b.map(x => x + x).toArray();
  // });
  // suite.add('no clear, parallel', () => {
  //   let [a, b] = range(SIZE).tee(2);
  //   a = a.map(x => x * x);
  //   b = b.map(x => x + x);
  //   while (true) {
  //     const values: any[] = [];
  //     for (const i of [a, b])
  //       values.push(i.yield());
  //     if (values.every(v => v === undefined)) break;
  //   }
  // });
  // suite.add('clear, parallel', () => {
  //   let [a, b] = range(SIZE).tee(2, true);
  //   a = a.map(x => x * x);
  //   b = b.map(x => x + x);
  //   while (true) {
  //     const values: any[] = [];
  //     for (const i of [a, b])
  //       values.push(i.yield());
  //     if (values.every(v => v === undefined)) break;
  //   }
  // });
  // suite.run();
});

it('toIterator', async function () {
  const it1 = toIterator([1, 2, 3]);
  assert(isIterator(it1));
  // @ts-expect-error
  throws(() => toIterator(null));
  // @ts-expect-error
  throws(() => toIterator(undefined));
  equal(
    toArray(
      toIterator(
        (
          (i = 0) =>
          () =>
            i++
        )(),
        3,
      ),
    ),
    [0, 1, 2],
  );
  equal(
    toArray(
      toIterator(
        (
          (n = 1) =>
          () =>
            (n = n * 2)
        )(),
        1024,
      ),
    ),
    [2, 4, 8, 16, 32, 64, 128, 256, 512],
  );
});

it('triplewise', async function () {
  equal(
    [...triplewise([1, 2, 3, 4, 5])],
    [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ],
  );
});

it('unique', async function () {
  equal([...unique([1, 1, 3, 3, 2, 2])], [1, 3, 2]);
  equal([...unique('AAAABBBCCDAABBB')].join(''), 'ABCD');
  equal([...unique('AAAABBBCCDAABBB', { justSeen: true })].join(''), 'ABCDAB');
  equal([...unique('ABBCcAD', { iteratee: v => v.toLowerCase() })].join(''), 'ABCD');
  equal([...unique('ABBCcAD', v => v.toLowerCase())].join(''), 'ABCD');
  equal(
    pipe(
      'AAaaaABBBbBCaaDdCaadD',
      unique(v => v.toLowerCase()),
      toArray,
    ).join(''),
    'ABCD',
  );
});

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

it('windows', async function () {
  equal(
    [...windows([1, 2, 3, 4, 5], 3, 1)],
    [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ],
  );
  equal(
    pipe(
      range(10),
      filter(n => n % 2 === 1),
      windows(2, 1),
      toArray,
      expectType<number[][]>,
    ),
    [
      [1, 3],
      [3, 5],
      [5, 7],
      [7, 9],
    ],
  );
  equal(
    pipe(
      range(10),
      filter(n => n % 2 === 0),
      expectType<IterableIterator<number>>,
      windows(2, 1, -1),
      toArray,
      expectType<[number, number][]>,
    ),
    [
      [0, 2],
      [2, 4],
      [4, 6],
      [6, 8],
      [8, -1],
    ],
  );
});

it('zip', async function () {
  equal(
    [...zip([1, 2, 3], ['4', '5', '6'])],
    [
      [1, '4'],
      [2, '5'],
      [3, '6'],
    ],
  );
  equal(
    [...zip([1, 2, 3], ['4', '5'])],
    [
      [1, '4'],
      [2, '5'],
    ],
  );
});

it('zipLongest', async function () {
  equal(
    [...zipLongest([1, 2, 3], ['4', '5', '6'])],
    [
      [1, '4'],
      [2, '5'],
      [3, '6'],
    ],
  );
  equal(
    [...zipLongest([1, 2, 3], ['4', '5'])],
    [
      [1, '4'],
      [2, '5'],
      [3, undefined],
    ],
  );
});
