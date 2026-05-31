import { describe, it } from 'bun:test';
import { assert } from './internal/test-utils';
import { isIterable } from '.';

describe('isIterable', () => {
  it('returns true for arrays', async function () {
    assert(isIterable([1, 2, 3]));
  });

  it('returns true for strings', async function () {
    assert(isIterable('abc'));
  });

  it('returns true for Set', async function () {
    assert(isIterable(new Set([1, 2, 3])));
  });

  it('returns true for Map', async function () {
    assert(
      isIterable(
        new Map([
          [1, 2],
          [3, 4],
        ]),
      ),
    );
  });

  it('returns true for typed arrays', async function () {
    assert(isIterable(new Int8Array([1, 2, 3])));
  });

  it('returns true for Buffer', async function () {
    assert(isIterable(Buffer.from('abc')));
  });

  it('returns false for null', async function () {
    assert(!isIterable(null));
  });
});
