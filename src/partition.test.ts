import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { partition, pipe, range } from '.';

describe('partition', () => {
  it('splits array into odd and even partitions', async function () {
    equal(
      partition([1, 2, 3, 4, 5], n => n % 2 === 0),
      [
        [1, 3, 5],
        [2, 4],
      ],
    );
  });

  it('partitions range via pipe', async function () {
    equal(
      pipe(
        range(15, 20),
        partition(n => n % 2),
      ),
      [
        [16, 18],
        [15, 17, 19],
      ],
    );
  });
});
