import { IteratorOrIterable } from './internal/types';
import SeekableIterator from './internal/SeekableIterator';
import toIterator from './toIterator';

export function seekable<T>(arg: IteratorOrIterable<T>, maxLength = Infinity) {
  return new SeekableIterator(toIterator(arg), maxLength);
}

export default seekable;
