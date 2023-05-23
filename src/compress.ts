import CompressIterator from './internal/CompressIterator';
import { IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Filters/compresses the input iterator to only values that correspond to truthy values in `selectors`.
 * @param selectors An iterator or iterable of falsey or truthy values to select which values to keep in this
 * iterator.
 */
export function compress<T extends IteratorOrIterable<any>>(
  arg: T,
  selectors: IteratorOrIterable<any>,
): IterableIterator<IterSource<T>> {
  return new CompressIterator(toIterator(arg), toIterator(selectors));
}

export default compress;
