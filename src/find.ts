import type { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/**
 * Finds the first value that passes a truthy value to `predicate`, then returns it. Only consumes the iterator's
 * values up to the found value, then stops. So if it's not found, then the iterator is exhausted.
 */
export function find<T, V extends T>(arg: IteratorOrIterable<T>, predicate: (value: T) => value is V): V | undefined;
export function find<T, V extends T>(predicate: (value: T) => value is V): (arg: IteratorOrIterable<T>) => V | undefined;
export function find<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): T | undefined;
export function find<T>(predicate: Predicate<T>): (arg: IteratorOrIterable<T>) => T | undefined;
export function find(...args: any[]): any | ((arg: IteratorOrIterable<unknown>) => unknown) {
  if (args.length === 1) return (it: IteratorOrIterable<unknown>) => find(it, args[0]);
  const it = toIterator(args[0]);
  const predicate: Predicate<unknown> = args[1];
  let next: IteratorResult<unknown>;
  while (!(next = it.next()).done) if (predicate(next.value)) return next.value;
}

export default find;
