import type { ItOrCurriedIt, IterSource, IteratorOrIterable, Tuple } from './types';
import WindowsIterator from './internal/WindowsIterator';
import toIterator from './toIterator';

/**
 * Yields sliding windows (tuples) of `length` from the input iterator. Each window is separated by `offset` number of
 * elements.
 * @param arg The input iterator.
 * @param length The length of each window, must be greater than 0.
 * @param offset The offset of each window from each other. Must be greater than 0.
 * @param fill Optional, the value to fill the last window with if it's not the same length as the rest of the iterator.
 * @example
 * toArray(windows([1,2,3,4,5], 2, 1)) // [[1,2], [2,3], [3,4], [4,5]]
 * toArray(windows([1,2,3,4,5], 2, 3)) // [[1,2], [4,5]]
 * toArray(windows([1,2,3,4,5], 3, 3, 0)) // [[1,2,3], [4,5,0]]
 */
export function windows<T, Length extends number>(
  length: Length,
  offset: number,
  fill: T,
): (arg: IteratorOrIterable<T>) => IterableIterator<Tuple<T, Length>>;
export function windows<T, Length extends number>(
  length: Length,
  offset: number,
): (arg: T) => IterableIterator<IterSource<T>[]>;
export function windows<T, Length extends number>(
  arg: IteratorOrIterable<T>,
  length: Length,
  offset: number,
  fill: T,
): IterableIterator<Tuple<T, Length>>;
export function windows<T, Length extends number>(
  arg: IteratorOrIterable<T>,
  length: Length,
  offset: number,
): IterableIterator<T[]>;
export function windows(...args: any[]): ItOrCurriedIt<unknown> {
  if (typeof args[0] === 'number') return it => windows(it, args[0], args[1], args[2]);
  return new WindowsIterator(toIterator(args[0]), args[1], args[2], args[3]);
}

export default windows;
