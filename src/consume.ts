import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Start iterating through the input iterator, but don't return the values from it.
 * @param arg The iterator or iterable to consume.
 * @param n optional, the number of elements to consume (default: Infinity).
 */
export function consume<T>(arg: IteratorOrIterable<T>, n = Infinity): void {
  const it = toIterator(arg);
  while (n-- > 0 && !it.next().done);
}

export default consume;
