import { IteratorOrIterable } from './types';
import toIterator from './toIterator';
import PairwiseIterator from './internal/PairwiseIterator';

/**
 * Return a new iterator of pairs (tuples) of the values in the input one. The number of pairs will always be one fewer
 * than the input. Will be empty if the input has fewer than two values.
 * @example
 * iter([1,2,3]).pairwise().toArray() // [[1,2], [2,3]]
 * iter([1]).pairwise().toArray() // []
 */
export function pairwise<T>(arg: IteratorOrIterable<T>) {
  return new PairwiseIterator(toIterator(arg));
}

export default pairwise;
