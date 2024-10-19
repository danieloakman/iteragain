import TriplewiseIterator from './internal/TriplewiseIterator';
import type { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Returns a new iterator of triplets (tuples) of the values in input. The number of triplets will always be two
 * fewer than the number of values in this iterator. Will be empty if input has fewer than three values.
 */
export function triplewise<T>(arg: IteratorOrIterable<T>): IterableIterator<[T, T, T]> {
  return new TriplewiseIterator(toIterator(arg));
}

export default triplewise;
