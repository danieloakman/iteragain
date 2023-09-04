import DropWhileIterator from './internal/DropWhileIterator';
import type { ItOrCurriedIt, IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/**
 * Drop/skip values in the input iterator while the passed `predicate` returns a truthy value.
 * @param arg The input iterator or iterable.
 * @param predicate The function to call for each value.
 */
export function dropWhile<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): IterableIterator<T>;
export function dropWhile<T>(predicate: Predicate<T>): (arg: IteratorOrIterable<T>) => IterableIterator<T>;
export function dropWhile(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return it => dropWhile(it, args[0]);
  return new DropWhileIterator(toIterator(args[0]), args[1]);
}

export default dropWhile;
