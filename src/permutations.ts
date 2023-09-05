import PermutationsIterator from './internal/PermutationsIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable, Tuple } from './types';
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
export function permutations<T extends IteratorOrIterable<any>, Size extends number>(
  size: Size,
): (arg: T) => IterableIterator<Tuple<IterSource<T>, Size>>;
export function permutations<T extends IteratorOrIterable<any>, Size extends number>(
  arg: T,
  size: Size,
): IterableIterator<Tuple<IterSource<T>, Size>>;
export function permutations(...args: any[]): ItOrCurriedIt<unknown> {
  if (args.length === 1) return (arg: IteratorOrIterable<unknown>) => permutations(arg, args[0]);
  return new PermutationsIterator(toIterator(args[0]), args[1]);
}

export default permutations;
