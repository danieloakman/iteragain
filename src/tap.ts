import TapIterator from './internal/TapIterator';
import { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Tap into the input iterator by supplying `func` which is passed each value of this iterator. The return value of
 * func is unused and this method is purely designed for a designated place to perform side effects.
 * @example
 *  toArray(tap(map([1, 2, 3], n => n * 2), console.log));
 *  // logs 2, 4, 6 to the console
 */
export function tap<T>(arg: IteratorOrIterable<T>, func: (value: T) => any) {
  return new TapIterator(toIterator(arg), func);
}

export default tap;
