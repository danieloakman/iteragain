import { it } from 'bun:test';
import { assert } from './internal/test-utils';
import { isIterable } from '.';
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
