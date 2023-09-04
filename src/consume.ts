import type { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Start iterating through the input iterator, but don't return the values from it.
 * @param arg The iterator or iterable to consume.
 * @param n optional, the number of elements to consume (default: Infinity).
 */
export function consume<T>(n?: number): (arg: IteratorOrIterable<T>) => void;
export function consume<T>(arg: IteratorOrIterable<T>, n?: number): void;
export function consume(...args: any[]): void | ((arg: IteratorOrIterable<any>) => void) {
  if (!args.length || typeof args[0] === 'number') return it => consume(it, args[0]);
  const it = toIterator(args[0]);
  let n = args[1] ?? Infinity;
  while (n-- > 0 && !it.next().done);
}

export default consume;
