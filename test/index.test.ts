import { ok as assert, deepStrictEqual as equals } from 'assert';
import { isIterable, isIterator, iter } from '../src/index';

describe('ExtendedIterator', function () {
  it('map', async function () {
    equals(iter([1, 2, 3].map(n => n * n)).toArray(), [1, 4, 9]);
  });

  it('filter', async function () {
    equals(
      iter([1, 2, 3])
        .filter(n => n % 2 === 0)
        .toArray(),
      [2],
    );
    equals(
      iter([1, 2, 3])
        .filter(n => n < 0)
        .toArray(),
      [],
    );
    equals(iter([]).filter(Boolean).toArray(), []);
  });

  it('reduce', async function () {
    const sum = (a: any, b: any) => a + b;
    equals(iter([1, 2, 3]).reduce(sum, 0), 6);
    equals(iter([1, 2, 3, 4]).reduce(sum), 10);
    equals(iter([1, 2, 3]).reduce(sum, ''), '123');
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
  equals(
    iter([1, 2, 3])
      .map(n => n * n)
      .toArray(),
    [1, 4, 9],
  );
  equals(
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
