import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { map, range, reverse } from '.';

describe('reverse', () => {
  it('reverses range iterator', async function () {
    equal([...reverse(range(10))], [...range(9, -1)]);
  });

  it('maps reversed range same as reversed native range', async function () {
    const mapper = (n: number) => n * n;
    equal([...map(reverse(range(10)), mapper)], [...map(range(9, -1), mapper)]);
  });
});
