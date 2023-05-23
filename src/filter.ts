import FilterIterator from './internal/FilterIterator';
import { IterSource, IteratorOrIterable, Predicate, StrictPredicate } from './types';
import toIterator from './toIterator';

/**
 * Returns a new iterator that has each element in this iterator filtered by the predicate.
 * @param predicate A function that returns a truthy value to indicate to keep that value.
 */
export function filter<T extends IteratorOrIterable<any>, S extends IterSource<T>>(
  arg: T,
  predicate: StrictPredicate<IterSource<T>, S>,
): FilterIterator<S>;
export function filter<T extends IteratorOrIterable<any>>(
  arg: T,
  predicate: Predicate<IterSource<T>>,
): FilterIterator<IterSource<T>>;
export function filter(arg: IteratorOrIterable<any>, predicate: (value: any) => any) {
  return new FilterIterator(toIterator(arg), predicate);
}

export default filter;
