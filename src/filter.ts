import FilterIterator from './internal/FilterIterator';
import { IteratorOrIterable, Predicate } from './internal/types';
import toIterator from './toIterator';

/**
 * Returns a new iterator that has each element in this iterator filtered by the predicate.
 * @param predicate A function that returns a truthy value to indicate to keep that value.
 */
export function filter<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>) {
  return new FilterIterator(toIterator(arg), predicate);
}

export default filter;
