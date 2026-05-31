import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { distribute, pipe, range, toArray } from '.';

describe('distribute', () => {
  it('distributes one element per bucket', async function () {
    equal(
      [...distribute(range(3), 3)].map(v => toArray(v)),
      [[0], [1], [2]],
    );
  });

  it('distributes elements round-robin into two buckets', async function () {
    equal(
      [...distribute(range(6), 2)].map(v => toArray(v)),
      [
        [0, 2, 4],
        [1, 3, 5],
      ],
    );
  });

  it('distributes range into four buckets via pipe', async function () {
    equal(
      pipe(range(5), distribute(4), v => v.map(toArray)),
      [[0, 4], [1], [2], [3]],
    );
    // const a = toArray(distribute(['', 2], 2));
    //    ^?
  });
});
