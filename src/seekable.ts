import { IteratorOrIterable } from './types';
import SeekableIterator from './internal/SeekableIterator';
import toIterator from './toIterator';

/**
 * Wraps the input iterator to allow for seeking backwards and forwards through its values. An internal cache of length
 * `maxLength` is kept and progressively added to when iterating forwards.
 */
export function seekable<T>(arg: IteratorOrIterable<T>, maxLength = Infinity) {
  return new SeekableIterator(toIterator(arg), maxLength);
}

export default seekable;
