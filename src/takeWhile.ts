import TakeWhileIterator from './internal/TakeWhileIterator';
import { IteratorOrIterable, Predicate } from './internal/types';
import toIterator from './toIterator';

/**
 * Take all elements from the input iterator while the given `predicate` returns a truthy value.
 * @param arg The input iterator.
 * @param predicate A function to call for each value.
 */
export function takeWhile<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>) {
  return new TakeWhileIterator(toIterator(arg), predicate);
}

export default takeWhile;
