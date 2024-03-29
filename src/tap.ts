import TapIterator from './internal/TapIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Tap into the input iterator by supplying `func` which is passed each value of this iterator. The return value of
 * func is unused and this method is purely designed for a designated place to perform side effects.
 * @example
 *  toArray(tap(map([1, 2, 3], n => n * 2), console.log));
 *  // logs 2, 4, 6 to the console
 */
export function tap<T extends IteratorOrIterable<unknown>>(
  arg: T,
  func: (value: IterSource<T>) => any,
): IterableIterator<IterSource<T>>;
export function tap<T extends IteratorOrIterable<unknown>>(
  func: (value: IterSource<T>) => any,
): (arg: T) => IterableIterator<IterSource<T>>;
export function tap(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return it => tap(it, args[0]);
  return new TapIterator(toIterator(args[0]), args[1]);
}

export default tap;
