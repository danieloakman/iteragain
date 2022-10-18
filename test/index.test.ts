import { ok as assert, deepStrictEqual as equal, notDeepStrictEqual as notEqual, throws } from 'assert';
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
} from '../src/index';
import FunctionIterator from '../src/internal/FunctionIterator';
import ObjectIterator from '../src/internal/ObjectIterator';
// import asyncMap from '../src/asyncMap';
// import asyncToArray from '../src/asyncToArray';

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

describe('internal', function () {
  describe('ExtendedIterator', function () {
    it('does implement IterableIterator', async function () {
      const iterator = iter([1, 2, 3]);
      assert(isIterable(iterator) && isIterator(iterator));
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
          ['a', 'b'],
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

    it('compress', async function () {
      equal(iter([1, 2, 3]).compress([0, 1, 0]).toArray(), [2]);
      equal(iter('abcdef').compress([1, 0, 1, 0, 1, 1]).join(''), 'acef');
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
      equal(shuffled.sort((a: number, b: number) => a - b), range(100).toArray());
    });

    it('peek', async function () {
      const itA = iter([1, 2, 3, 4, 5]);
      equal(itA.peek(), [1]);
      equal(itA.peek(1), [1]);
      equal(itA.peek(3), [1, 2, 3]);
      equal(itA.toArray(), [1, 2, 3, 4, 5]);
      equal(itA.peek(), []);
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
      equal(iterator.take(), []);
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
      100,
    );
    equal([...it], [...range(0, 100, 2)]);
    equal([...it], []);
  });

  it('ObjectIterator', async function () {
    this.timeout(5000);
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

it('chunks', async function () {
  equal([...chunks([1, 2, 3, 4, 5], 2)], [[1, 2], [3, 4], [5]]);
  // equal(iter([1, 2, 3, 4, 5]).chunks(3, 0).toArray(), [
  //   [1, 2, 3],
  //   [4, 5, 0],
  // ]);
  // equal(iter([1, 2, 3, 4, 5]).chunks(6).toArray(), [[1, 2, 3, 4, 5]]);
  // equal(iter([1, 2, 3, 4, 5]).chunks(6, 0).toArray(), [[1, 2, 3, 4, 5, 0]]);
  // equal(iter([]).chunks(5).toArray(), []);
});

it('combinations', async function () {
  equal([...combinations([0, 1], 2)], [[0, 1]]);
});

it('compress', async function () {
  equal([...compress([1, 2, 3, 4, 5], [1, 1, 0, 0, 1])], [1, 2, 5]);
});

it('concat', async function () {
  equal([...concat([1, 2, 3], [], range(4, 7))], [1, 2, 3, 4, 5, 6]);
});

it('consume', async function () {
  const arr: number[] = [];
  equal(consume(tap(range(3), n => arr.push(n))), undefined);
  equal(arr, [0, 1, 2]);
});

it('count', async function () {
  equal(take(count(), 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it('cycle', async function () {
  equal(take(cycle([1, 2, 3]), 10), [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]);
  equal([...cycle(range(3), 1)], [0, 1, 2, 0, 1, 2]);
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
});

it('dropWhile', async function () {
  equal([...dropWhile(range(10), n => n < 5)], [5, 6, 7, 8, 9]);
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
});

it('filter', async function () {
  equal([...filter(range(10), n => n % 2 === 0)], [0, 2, 4, 6, 8]);
});

it('filterMap', async function () {
  equal([...filterMap(range(10), n => (n % 2 === 0 ? n : null))], [0, 2, 4, 6, 8]);
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
});

it('flatten', async function () {
  equal([...flatten([[1], [2, 3]])], [1, 2, 3]);
  equal([...flatten([[1], [2, 3], [4, 5]])], [1, 2, 3, 4, 5]);
  equal([...flatten([[1], [[2], 3]], 2)], [1, 2, 3]);
  equal([...flatten([[1], [[2], 3]], 1)], [1, [2], 3]);
  equal([...flatten([[1], [[2], 3]], 0)], [[1], [[2], 3]]);
  equal([...flatten('abc')], ['a', 'b', 'c']);
});

it('forEach', async function () {
  const arr: number[] = [];
  forEach(range(10), n => arr.push(n));
  equal(arr, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it('includes', async function () {
  equal(includes(range(10), 5), true);
  equal(includes(range(10), 10), false);
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

it('map', async function () {
  equal([...map(range(10), n => n * n)], [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
});

it('max', async function () {
  equal(max(range(10)), 9);
  equal(
    max(range(10), n => -n),
    0,
  );
});

it('min', async function () {
  equal(min(range(10)), 0);
  equal(
    min(range(10), n => -n),
    9,
  );
});

it('minmax', async function () {
  equal(minmax(range(10)), [0, 9]);
  equal(
    minmax(range(10), n => -n),
    [9, 0],
  );
});

it('nth', async function () {
  equal(nth(range(10), 3), 3);
  equal(nth(range(10), -3), undefined);
  equal(nth(toIterator({ a: 1, b: 2 }), 1), ['b', 2, { a: 1, b: 2 }]);
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
});

it('permutations', async function () {
  equal(
    [...permutations([1, 2, 3], 3)],
    [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ],
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

it('quantify', async function () {
  equal(
    quantify(range(10), n => n % 2 === 0),
    5,
  );
});

it('range', async function () {
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
  let r = range(3);
  equal([...r, ...r], [0, 1, 2, 0, 1, 2]);
  assert(range(3).equal(range(0, 3, 1)));
  // @ts-ignore
  assert(range().toArray(), []);
  // Is still subject to floating numbers rounding errors:
  throws(() => equal(range(0, 5, 0.3).toArray(), [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7]));
  assert(range(0, Infinity, 13).includes(26));

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
  const empty = seekable([]);
  equal(empty.seek(10), undefined);
  equal([...empty], []);
});

it('slice', async function () {
  equal([...slice([1, 2, 3, 4, 5], 1, 3)], [2, 3]);
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

it('spy', async function () {
  const [value, it] = spy(range(10));
  equal(value, [0]);
  equal(spy(it, 10)[0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
  throws(() => toIterator(null));
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
