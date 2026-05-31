import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import { groupBy, map, toArray } from '.';

describe('groupBy', () => {
  it('groups consecutive characters and yields keys', async function () {
    equal(
      [...groupBy('AAAABBBCCDAABBB')].map(v => v[0]),
      ['A', 'B', 'C', 'D', 'A', 'B'],
    );
  });

  it('groups consecutive characters and joins values', async function () {
    equal(
      [...groupBy('AAAABBBCCD')].map(v => v[1].join('')),
      ['AAAA', 'BBB', 'CC', 'D'],
    );
  });

  it('groups objects by property key', async function () {
    equal(toArray(map(groupBy([{ a: 1 }, { a: 2 }, { a: 3 }], 'a'), v => v[0])), [1, 2, 3]);
  });

  it('groups numbers by modulo function', async function () {
    equal(
      toArray(
        map(
          groupBy([1, 2, 3, 4, 5], v => v % 2),
          v => v[0],
        ),
      ),
      [1, 0, 1, 0, 1],
    );
  });

  it('groups booleans into consecutive runs', async function () {
    equal(toArray(map(groupBy([true, true, false, false]), v => v[0])), [true, false]);
  });

  it('groups objects by computed key function', async function () {
    equal(
      toArray(
        map(
          groupBy([{ a: 1 }, { a: 1 }, { a: 3 }], v => v.a),
          v => v[0],
        ),
      ),
      [1, 3],
    );
  });
});
