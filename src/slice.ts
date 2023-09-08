import SliceIterator from './internal/SliceIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Works like `Array.prototype.slice`, returns a new slice of this iterator.
 * @note This does not support negative `start` and `end` indices, as it's not possible to know the length of the
 * iterator while iterating.
 * @param arg The input iterator to slice.
 * @param start The index to start at (inclusive).
 * @param end The index to end at (exclusive).
 * @returns A new iterator that only includes the elements between `start` and `end`.
 */
export function slice<T extends IteratorOrIterable<unknown>>(
  arg: T,
  start: number,
  end?: number,
): IterableIterator<IterSource<T>>;
export function slice<T extends IteratorOrIterable<unknown>>(
  start: number,
  end?: number,
): (arg: T) => IterableIterator<IterSource<T>>;
export function slice(...args: any[]): ItOrCurriedIt<unknown> {
  if (typeof args[0] === 'number') return it => slice(it, args[0], args[1]);
  return new SliceIterator(toIterator(args[0]), args[1], args[2]);
}

export default slice;
