import PermutationsIterator from './internal/PermutationsIterator';
import type { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Returns all successive `size` length permutations of the input iterator. The permutations are emitted in lexicographic
 * ordering according to input. So if input is sorted, the permutations will be in sorted order.
 * Elements in the permutations are treated as unique based on their position in the iterator, not on their value. So
 * if the input iterator is unique, then there will be no repeat values.
 * @see https://docs.python.org/3/library/itertools.html#itertools.permutations for more info.
 * @param arg The input iterator.
 * @param size The size of each permutation, must be greater than 0 and less than or equal to the length of the input
 */
export function permutations<T, Size extends number>(arg: IteratorOrIterable<T>, size: Size) {
  return new PermutationsIterator(toIterator(arg), size);
}

export default permutations;
