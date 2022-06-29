import { IteratorOrIterable, Tuple } from './internal/types';
import toIterator from './toIterator';
import ChunksIterator from './internal/ChunksIterator';
import ExtendedIterator from './internal/ExtendedIterator';

/**
 * Yields non-overlapping chunks (tuples) of `size` from the input `arg`.
 * @param length The size of each chunk.
 * @param fill Optional, the value to fill the last chunk with if it's not of length `size`.
 * @example
 * chunks([1,2,3,4,5,6,7,8,9], 3).toArray() // [[1,2,3], [4,5,6], [7,8,9]]
 * chunks([1,2,3,4,5,6,7,8,9], 2, 0).toArray() // [[1,2], [3,4], [5,6], [7,8], [9, 0]]
 */
export function chunks<T, Length extends number>(
  arg: IteratorOrIterable<T>,
  length: Length,
  fill?: T,
): ExtendedIterator<Tuple<T, Length>> {
  return new ExtendedIterator(new ChunksIterator(toIterator(arg), length, fill)) as ExtendedIterator<Tuple<T, Length>>;
}

export default chunks;
