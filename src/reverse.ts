import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * @lazy
 * Reverses the input iterator's order. Note that in order to reverse, it will attempt to iterate fully once, which
 * could cause significant memory usage. So because of this, only use on finite iterators.
 */
export function reverse<T>(arg: IteratorOrIterable<T>): IterableIterator<T> {
  let next: IteratorResult<T>;
  const it = toIterator(arg);
  const result: T[] = [];
  while (!(next = it.next()).done) result.unshift(next.value);
  return Object.assign(toIterator(result), {
    [Symbol.iterator]() {
      return this;
    },
  }) as IterableIterator<T>;
}

export default reverse;
