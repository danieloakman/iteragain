import CombinationsIterator from './internal/CombinationsIterator';
import { ItOrCurriedIt, IterSource, IteratorOrIterable, Tuple } from './types';
import toIterator from './toIterator';

/**
 * Returns `size` length subsequences of the input iterator.
 * @see https://docs.python.org/3/library/itertools.html#itertools.combinations for more info.
 * @see https://docs.python.org/3/library/itertools.html#itertools.combinations_with_replacement for more info.
 * @param size The size of each combination.
 * @param withReplacement Whether or not to allow duplicate elements in the combinations.
 */
export function combinations<T extends IteratorOrIterable<any>, Size extends number>(
  arg: T,
  size: Size,
  withReplacement?: boolean,
): IterableIterator<Tuple<IterSource<T>, Size>>;
export function combinations<T extends IteratorOrIterable<any>, Size extends number>(
  size: Size,
  withReplacement?: boolean,
): (arg: T) => IterableIterator<Tuple<IterSource<T>, Size>>;
export function combinations(...args: any[]): ItOrCurriedIt<any> {
  if (typeof args[0] === 'number') return (it: IteratorOrIterable<any>) => combinations(it, args[0], args[1]);
  return new CombinationsIterator(toIterator(args[0]), args[1], args[2] ?? false);
}

export default combinations;
