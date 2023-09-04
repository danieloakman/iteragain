import type { IteratorOrIterable, UniqueParams } from './types';
import toIterator from './toIterator';
import FilterIterator from './internal/FilterIterator';

/**
 * @lazy
 * Filters `arg` iterator to only unique values.
 * @param iteratee Iteratee to use to transform each value before being tested for uniqueness.
 * @param justSeen If true, will only test for uniqueness with the last value in the iterator and not all values.
 */
export function unique<T>(arg: IteratorOrIterable<T>, params: UniqueParams<T> = v => v): IterableIterator<T> {
  const { iteratee = (v: T) => v, justSeen = false } = typeof params === 'function' ? { iteratee: params } : params;
  if (justSeen) {
    let lastValue: T;
    return new FilterIterator(toIterator(arg), value => {
      value = iteratee(value);
      if (!lastValue || value !== lastValue) {
        lastValue = value;
        return true;
      }
      return false;
    });
  }
  const seen = new Set<T>();
  return new FilterIterator(toIterator(arg), value => {
    value = iteratee(value);
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}

export default unique;
