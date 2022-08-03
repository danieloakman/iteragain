import ProductIterator from './internal/ProductIterator';
import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Returns the cartesian product of the input `iterators`.
 * @param iterators Other iterators.
 * @param repeat Optional number of times to repeat the input `iterators`.
 * @see https://docs.python.org/3/library/itertools.html#itertools.product for more info, as it does the same.
 */
export function product<T>(iterators: IteratorOrIterable<T>[], repeat = 1): IterableIterator<T[]> {
  return new ProductIterator(iterators.map(toIterator) as Iterator<T>[], repeat);
}

export default product;
