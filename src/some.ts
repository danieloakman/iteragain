import type { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/** Return true if only one element in this iterator matches the predicate. */
export function some<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): boolean {
  const it = toIterator(arg);
  let next: IteratorResult<T>;
  while (!(next = it.next()).done) if (predicate(next.value)) return true;
  return false;
}

export default some;
