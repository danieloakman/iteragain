import toIterator from './toIterator';
import type { IteratorOrIterable } from './types';

/** Consumes the input iterator and returns the number of values/items in it. */
export function length<T>(arg: IteratorOrIterable<T>): number {
  let result = 0;
  const it = toIterator(arg);
  while (!it.next().done) result++;
  return result;
}

export default length;
