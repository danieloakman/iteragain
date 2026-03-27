import { it } from 'bun:test';
import { assert } from './internal/test-utils';
import { isIterator } from '.';
it('isIterator', async function () {
  assert(
    isIterator(
      (function* () {
        yield 1;
      })(),
    ),
  );
  assert(isIterator({ next() { } }));
  assert(!isIterator(null));
});
