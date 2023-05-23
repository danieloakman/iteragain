import { IteratorOrIterable, Tuple } from './types';
import toIterator from './toIterator';

/**
 * Take an arbitrary number of items from an iterator/iterable like type of object.
 * @param arg Iterator or Iterable.
 * @param take Number of elements starting from the front of iterable to take (default: 1).
 * @returns Returns the array of elements taken from the front.
 */
export function take<T, Size extends number = 1>(arg: IteratorOrIterable<T>, take: Size = 1 as Size): Tuple<T, Size> {
  const results: T[] = [];
  const it = toIterator(arg);
  let next: IteratorResult<T, any>;
  while (take-- > 0 && !(next = it.next()).done) results.push(next.value);
  return results as Tuple<T, Size>;
}

export default take;
