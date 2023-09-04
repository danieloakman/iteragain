import ChunksIterator from './internal/ChunksIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable, Tuple } from './types';
import toIterator from './toIterator';

/**
 * Yields non-overlapping chunks (tuples) of `length` from the input iterator.
 * @param length The length of each chunk, must be greater than 0.
 * @param fill Optional, the value to fill the last chunk with if it's not the same length as the rest of the iterator.
 * @example
 * [...chunks([1,2,3,4,5,6,7,8,9], 3)] // [[1,2,3], [4,5,6], [7,8,9]]
 * [...chunks([1,2,3,4,5,6,7,8,9], 2, 0)] // [[1,2], [3,4], [5,6], [7,8], [9, 0]]
 */
export function chunks<T extends IteratorOrIterable<any>, Size extends number>(
  arg: T,
  length: Size,
  fill?: T,
): IterableIterator<Tuple<IterSource<T>, Size>>;
export function chunks<T extends IteratorOrIterable<any>, Size extends number>(
  length: Size,
  fill?: T,
): (arg: T) => IterableIterator<Tuple<IterSource<T>, Size>>;
export function chunks(...args: any[]): ItOrCurriedIt<any> {
  if (typeof args[0] === 'number') return (it: IteratorOrIterable<any>) => chunks(it, args[0], args[1]);
  return new ChunksIterator(toIterator(args[0]), args[1], args[2]);
}

export default chunks;
