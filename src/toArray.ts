import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Converts an iterator or iterable into an array by iterating over all it's values and collecting them. */
export function toArray<T>(iteratorOrIterable: IteratorOrIterable<T>): T[] {
  const iterator = toIterator(iteratorOrIterable);
  const result: T[] = [];
  let next: IteratorResult<T>;
  while (!(next = iterator.next()).done) result.push(next.value);
  return result;
}

export default toArray;
