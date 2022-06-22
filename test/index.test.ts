import { ok as assert, deepStrictEqual as equal, notDeepStrictEqual as notEqual } from 'assert';
import { isIterable, isIterator, iter, concat, range } from '../src/index';

describe('ExtendedIterator', function () {
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

  it('reduce', async function () {
    const sum = (a: any, b: any) => a + b;
    equal(iter([1, 2, 3]).reduce(sum, 0), 6);
    equal(iter([1, 2, 3, 4]).reduce(sum), 10);
    equal(iter([1, 2, 3]).reduce(sum, ''), '123');
  });

  it('concat', async function () {
    equal(
      iter([1, 2, 3])
        .concat(iter([4, 5, 6]))
        .toArray(),
      [1, 2, 3, 4, 5, 6],
    );
  });

  it('slice', async function () {
    const arr = [1, 2, 3, 4, 5];
    equal(iter(arr).slice(2, 4).toArray(), arr.slice(2, 4));
    equal(iter(arr).slice(2).toArray(), arr.slice(2));
    notEqual(iter(arr).slice(2, -1).toArray(), arr.slice(2, -1));
  });

  it('take', async function () {
    equal(iter([1, 2, 3]).take(2).toArray(), [1, 2]);
    equal(iter([1, 2, 3]).take(0).toArray(), []);
  });
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
});

it('isIterator', async function () {
  assert(
    isIterator(
      (function* () {
        yield 1;
      })(),
    ),
  );
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
});

it('concat', async function () {
  equal(concat([1, 2, 3], [], [4, 5, 6]).toArray(), [1, 2, 3, 4, 5, 6]);
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
  equal(range(2, 1, 1).toArray(), []);
  equal(range(Infinity).take(10).toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  equal(range(-Infinity).take(10).toArray(), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]);
  equal(range(1, 0).toArray(), [1]);
  equal(range(10, 0, 1).toArray(), []);

  for (const args of [[10], [-10], [0, 10, 2], [0, -10, -2], [2, 10, 3], [-10, 0], [10, 0], [10, 0, 1]] as [number, number, number][]) {
    const r = range(...args);
    const nums = r.toArray();
    assert(nums.every(n => r.includes(n)), `${nums} should be a subset of ${r}`);
    assert(!r.includes(Math.min(...nums) - 1));
    assert(!r.includes(Math.max(...nums) + 1));
    equal(nums.length, r.length, `[${nums}] should have the same length as ${r}`);
  }
});
