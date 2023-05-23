import { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/** Return true if every element in this iterator matches the predicate. */
export function every<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): boolean {
  const it = toIterator(arg);
  let next: IteratorResult<T>;
  while (!(next = it.next()).done) if (!predicate(next.value)) return false;
  return true;
}

export default every;
