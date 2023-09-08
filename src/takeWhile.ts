import TakeWhileIterator from './internal/TakeWhileIterator';
import type { ItOrCurriedIt, IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/**
 * Take all elements from the input iterator while the given `predicate` returns a truthy value.
 * @param arg The input iterator.
 * @param predicate A function to call for each value.
 */
export function takeWhile<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): IterableIterator<T>;
export function takeWhile<T>(predicate: Predicate<T>): (arg: IteratorOrIterable<T>) => IterableIterator<T>;
export function takeWhile(...args: any[]): ItOrCurriedIt<unknown> {
  if (args.length === 1) return it => takeWhile(it, args[0]);
  return new TakeWhileIterator(toIterator(args[0]), args[1]);
}

export default takeWhile;
