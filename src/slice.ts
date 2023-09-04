import SliceIterator from './internal/SliceIterator';
import type { IteratorOrIterable } from './types';
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
export function slice<T>(arg: IteratorOrIterable<T>, start: number, end?: number): IterableIterator<T> {
  return new SliceIterator(toIterator(arg), start, end);
}

export default slice;
