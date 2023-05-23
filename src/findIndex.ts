import { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/**
 * Finds the index of the first value that passes a truthy vale to `predicate`, then returns it. Only consumes the
 * iterator's values up to the found value, then stops. So if it's not found, then the iterator is exhausted.
 */
export function findIndex<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): number {
  const it = toIterator(arg);
  let next: IteratorResult<T>;
  let i = -1;
  while ((i++, !(next = it.next()).done)) if (predicate(next.value)) return i;
  return -1;
}

export default findIndex;
