import { describe, it } from 'bun:test';
import { equal, throws } from './test-utils';
import ObjectIterator from './ObjectIterator';

describe('ObjectIterator', () => {
  it('should yield own enumerable entries for a flat object', async function () {
    const obj = { a: 1 };
    equal([...new ObjectIterator(obj)], [['a', 1, obj]]);
  });

  it('should traverse nested objects in pre-order-DFS', async function () {
    const obj2 = { a: 1, b: { c: 2, d: { e: 3 } }, f: 4 };
    equal(
      [...new ObjectIterator(obj2, 'pre-order-DFS')].map(([k]) => k),
      ['a', 'b', 'c', 'e', 'd', 'f'],
    );
  });

  it(
    'should throw on circular references in pre-order-DFS',
    async function () {
      const obj3 = { a: 1, b: { c: 2 } } as Record<string, any>;
      const obj4 = { circle: obj3 } as Record<string, any>;
      obj3.b.circle = obj4;
      throws(() => [...new ObjectIterator(obj3, 'pre-order-DFS')].map(([k]) => k));
    },
    { timeout: 120_000 },
  );
});
