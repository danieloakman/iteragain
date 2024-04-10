import type { ItOrCurriedIt, IterSource, Iteratee, IteratorOrIterable } from './types';
import FlatMapIterator from './internal/FlatMapIterator';
import toIterator from './toIterator';

/**
 * Maps the input iterator to a new value `R` and flattens any resulting iterables or iterators by a depth of 1.
 * Behaves the same as `Array.prototype.flatMap`.
 */
export function flatMap<T extends IteratorOrIterable<unknown>, R>(
  arg: T,
  iteratee: Iteratee<IterSource<T>, R | IteratorOrIterable<R>>,
): IterableIterator<R>;
export function flatMap<T extends IteratorOrIterable<unknown>, R>(
  iteratee: Iteratee<IterSource<T>, R | IteratorOrIterable<R>>,
): (arg: T) => IterableIterator<R>;
export function flatMap(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return it => flatMap(it, args[0]);
  return new FlatMapIterator(toIterator(args[0]), args[1]);
}

export default flatMap;
