import FilterMapIterator from './internal/FilterMapIterator';
import { Iteratee, IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Maps and filters the input iterator in the same `iteratee` function.
 * @param iteratee A function that maps each value in this iterator to a new value and also filters out any that
 * return a nullish value.
 */
export function filterMap<T, R>(arg: IteratorOrIterable<T>, iteratee: Iteratee<T, R>) {
  return new FilterMapIterator(toIterator(arg), iteratee);
}

export default filterMap;
