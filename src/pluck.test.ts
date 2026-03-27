import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { map, pipe, pluck, range, take } from '.';
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
