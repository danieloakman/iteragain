import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * @lazy
 * Reverses the input iterator's order. Note that in order to reverse, it will attempt to iterate fully once, which
 * could cause significant memory usage. So because of this, only use on finite iterators.
 */
export function reverse<T>(arg: IteratorOrIterable<T>): IterableIterator<T> {
  let next: IteratorResult<T>;
  let it = toIterator(arg);
  const result: T[] = [];
  while (!(next = it.next()).done) result.unshift(next.value);
  it = toIterator(result);
  it[Symbol.iterator] = function () { return this; };
  return it as IterableIterator<T>;
}

export default reverse;
