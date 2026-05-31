import { describe, it } from 'bun:test';
import { assert } from './internal/test-utils';
import { isIterator } from '.';

describe('isIterator', () => {
  it('returns true for generator iterators', async function () {
    assert(
      isIterator(
        (function* () {
          yield 1;
        })(),
      ),
    );
  });

  it('returns true for objects with next method', async function () {
    assert(isIterator({ next() {} }));
  });

  it('returns false for null', async function () {
    assert(!isIterator(null));
  });
});
