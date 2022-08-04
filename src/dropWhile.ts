import DropWhileIterator from './internal/DropWhileIterator';
import { IteratorOrIterable, Predicate } from './internal/types';
import toIterator from './toIterator';

/**
 * Drop/skip values in the input iterator while the passed `predicate` returns a truthy value.
 * @param arg The input iterator or iterable.
 * @param predicate The function to call for each value.
 */
export function dropWhile<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>) {
  return new DropWhileIterator(toIterator(arg), predicate);
}

export default dropWhile;
