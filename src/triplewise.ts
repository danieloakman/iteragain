import TriplewiseIterator from './internal/TripleWiseIterator';
import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Returns a new iterator of triplets (tuples) of the values in input. The number of triplets will always be two
 * fewer than the number of values in this iterator. Will be empty if input has fewer than three values.
 */
export function triplewise<T>(arg: IteratorOrIterable<T>) {
  return new TriplewiseIterator(toIterator(arg));
}

export default triplewise;
