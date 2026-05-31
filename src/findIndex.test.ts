import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { findIndex, pipe, range } from '.';

describe('findIndex', () => {
  it('returns index of matching element in range', async function () {
    equal(
      findIndex(range(10), n => n === 5),
      5,
    );
  });

  it('returns -1 when no match', async function () {
    equal(
      findIndex(range(10), n => n === 10),
      -1,
    );
  });

  it('finds index via pipe on sliced range', async function () {
    equal(
      pipe(
        range(5, 10),
        findIndex(n => n === 8),
      ),
      3,
    );
  });
});
