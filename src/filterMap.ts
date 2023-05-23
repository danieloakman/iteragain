import FilterMapIterator from './internal/FilterMapIterator';
import { IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Maps and filters the input iterator in the same `iteratee` function.
 * @param iteratee A function that maps each value in this iterator to a new value and also filters out any that
 * return a nullish value.
 */
export function filterMap<T extends IteratorOrIterable<any>, R>(arg: T, iteratee: Iteratee<IterSource<T>, R>) {
  return new FilterMapIterator(toIterator(arg), iteratee);
}

export default filterMap;
