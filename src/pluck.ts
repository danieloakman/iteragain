import filterMap from './filterMap';
import { IteratorOrIterable } from './types';

/** Maps `key` from `T` in each value of the input iterator. */
export function pluck<T>(arg: IteratorOrIterable<T>, key: keyof T): IterableIterator<T[keyof T]> {
  return filterMap(arg, item => item[key]);
}

export default pluck;
