import { Iteratee, IteratorOrIterable } from './types';
import FlatMapIterator from './internal/FlatMapIterator';
import toIterator from './toIterator';

/**
 * Maps the input iterator to a new value `R` and flattens any resulting iterables or iterators by a depth of 1.
 * Behaves the same as `Array.prototype.flatMap`.
 */
export function flatMap<T, R>(
  arg: IteratorOrIterable<T>,
  iteratee: Iteratee<T, R | IteratorOrIterable<R>>,
): IterableIterator<R> {
  return new FlatMapIterator(toIterator(arg), iteratee);
}

export default flatMap;
