import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { toArray, unzip, zip } from '.';

describe('unzip', () => {
  it('should unzip rows into columns', async function () {
    const rows: [string, number][] = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ];
    equal(unzip(rows).map(toArray), [
      ['a', 'b', 'c'],
      [1, 2, 3],
    ]);
  });

  it('should round-trip zip and unzip', async function () {
    equal(unzip(zip('abc', [1, 2])).map(toArray), [
      ['a', 'b'],
      [1, 2],
    ]);
  });

  it('should treat scalar iterable as single column', async function () {
    equal([...unzip([0, 1, 2])[0]!], [0, 1, 2]);
  });
});
