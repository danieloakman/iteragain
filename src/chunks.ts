import ChunksIterator from './internal/ChunksIterator';
import { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Yields non-overlapping chunks (tuples) of `length` from the input iterator.
 * @param length The length of each chunk, must be greater than 0.
 * @param fill Optional, the value to fill the last chunk with if it's not the same length as the rest of the iterator.
 * @example
 * [...chunks([1,2,3,4,5,6,7,8,9], 3)] // [[1,2,3], [4,5,6], [7,8,9]]
 * [...chunks([1,2,3,4,5,6,7,8,9], 2, 0)] // [[1,2], [3,4], [5,6], [7,8], [9, 0]]
 */
export function chunks<T extends IteratorOrIterable<any>, Size extends number>(arg: T, length: Size, fill?: T) {
  return new ChunksIterator(toIterator(arg), length, fill);
}

export default chunks;
