import { describe, it } from 'bun:test';
import { equal } from './internal/test-utils';
import empty from './empty';
import EmptyIterator from './internal/EmptyIterator';

describe('empty', () => {
  it('should yield nothing', async function () {
    equal([...empty()], []);
  });

  it('should be immediately done', async function () {
    equal(empty().next(), { done: true, value: undefined });
  });

  it('should be re-iterable', async function () {
    const it = empty<number>();
    equal([...it, ...it], []);
  });

  it('should expose EmptyIterator protocol methods', async function () {
    const it = new EmptyIterator();
    equal(it[Symbol.iterator](), it);
    equal(it.next(), { done: true, value: undefined });
  });
});
