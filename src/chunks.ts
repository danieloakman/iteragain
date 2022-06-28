import { IteratorOrIterable } from './types';
import toIterator from './toIterator';
import ChunksIterator from './internal/ChunksIterator';
import ExtendedIterator from './internal/ExtendedIterator';

export function chunks<T, N extends number>(arg: IteratorOrIterable<T>, size: N, fill?: T) {
  return new ExtendedIterator(new ChunksIterator(toIterator(arg), size, fill));
}

export default chunks;
