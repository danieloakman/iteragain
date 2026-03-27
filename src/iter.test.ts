import { it } from 'bun:test';
import { equal, expectType, assert, throws } from './internal/test-utils';
import { iter } from '.';
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
  throws(() => iter({ next() { } }).toArray());
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
