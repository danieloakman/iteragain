import { describe, it } from 'bun:test';
import { equal, notEqual, assert, throws } from './test-utils';
import { compress, isIterable, isIterator, iter, pipe, range, toArray, zip } from '..';

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
    equal(
      iter([1, 2, 3])
        .concat(['1'])
        .concat([[1]])
        .toArray(),
      [1, 2, 3, '1', [1]],
    );
    equal(iter([-2, -1]).concat(range(3)).toArray(), [-2, -1, 0, 1, 2]);
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
    equal(iter([]).join('-'), '');
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
