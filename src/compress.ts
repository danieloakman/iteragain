import CompressIterator from './internal/CompressIterator';
import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Filters/compresses the input iterator to only values that correspond to truthy values in `selectors`.
 * @param selectors An iterator or iterable of falsey or truthy values to select which values to keep in this
 * iterator.
 */
export function compress<T>(arg: IteratorOrIterable<T>, selectors: IteratorOrIterable<any>) {
  return new CompressIterator(toIterator(arg), toIterator(selectors));
}

export default compress;
