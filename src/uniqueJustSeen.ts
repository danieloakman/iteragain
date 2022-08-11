import FilterIterator from './internal/FilterIterator';
import { Iteratee, IteratorOrIterable } from './internal/types';

/**
 * @lazy
 * Filters out all repeated values. As in, two consecutive values will never be equal.
 * @param iteratee Optional iteratee to use to transform each value before being tested for uniqueness.
 */
export function uniqueJustSeen<T>(arg: IteratorOrIterable<T>, iteratee: Iteratee<T, any> = v => v): IterableIterator<T> {
  let lastValue: T;
  return new FilterIterator(this.iterator, value => {
    value = iteratee(value);
    if (!lastValue || value !== lastValue) {
      lastValue = value;
      return true;
    }
    return false;
  });
}

export default uniqueJustSeen;
