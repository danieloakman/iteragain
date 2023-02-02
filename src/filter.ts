import FilterIterator from './internal/FilterIterator';
import { IteratorOrIterable, Predicate, StrictPredicate } from './internal/types';
import toIterator from './toIterator';

/**
 * Returns a new iterator that has each element in this iterator filtered by the predicate.
 * @param predicate A function that returns a truthy value to indicate to keep that value.
 */
export function filter<T, S extends T>(arg: IteratorOrIterable<T>, predicate: StrictPredicate<T, S>): FilterIterator<S>;
export function filter<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): FilterIterator<T>;
export function filter(arg: IteratorOrIterable<any>, predicate: (value: any) => any) {
  return new FilterIterator(toIterator(arg), predicate);
}

export default filter;
