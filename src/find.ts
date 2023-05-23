import { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/**
 * Finds the first value that passes a truthy value to `predicate`, then returns it. Only consumes the iterator's
 * values up to the found value, then stops. So if it's not found, then the iterator is exhausted.
 */
export function find<T, V extends T>(arg: IteratorOrIterable<T>, predicate: (value: T) => value is V): V | undefined;
export function find<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): T | undefined;
export function find<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): T | undefined {
  const it = toIterator(arg);
  let next: IteratorResult<T>;
  while (!(next = it.next()).done) if (predicate(next.value)) return next.value;
}

export default find;
