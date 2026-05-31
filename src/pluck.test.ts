import { describe, it } from 'bun:test';
import { equal, expectType } from './internal/test-utils';
import { map, pipe, pluck, range, take } from '.';

describe('pluck', () => {
  it('extracts property values from objects', async function () {
    equal([...pluck([{ a: 1 }, { a: 2 }, { a: 3 }], 'a')], [1, 2, 3]);
  });

  it('returns empty array for missing property key', async function () {
    equal(
      // @ts-expect-error
      [...pluck([{ a: 1 }, { a: 2 }, { a: 3 }], 'b')],
      [],
    );
  });

  it('plucks n from mapped objects via pipe with type check', async function () {
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
});
