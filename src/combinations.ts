import CombinationsIterator from './internal/CombinationsIterator';
import { IteratorOrIterable, Tuple } from './internal/types';
import toIterator from './toIterator';

/**
 * Returns `size` length subsequences of the input iterator.
 * @see https://docs.python.org/3/library/itertools.html#itertools.combinations for more info.
 * @see https://docs.python.org/3/library/itertools.html#itertools.combinations_with_replacement for more info.
 * @param size The size of each combination.
 * @param withReplacement Whether or not to allow duplicate elements in the combinations.
 */
export function combinations<T, Size extends number>(arg: IteratorOrIterable<T>, size: Size, withReplacement = false): IterableIterator<Tuple<T, Size>> {
  return new CombinationsIterator(toIterator(arg), size, withReplacement);
}

export default combinations;
