import { IteratorOrIterable } from './internal/types';
import toArray from './toArray';


/** Collects all values from the input iterator, then sorts them. */
export function sort<T>(arg: IteratorOrIterable<T>, comparator?: (a: T, b: T) => number) {
  return toArray(arg).sort(comparator)[Symbol.iterator]();
}

export default sort;
