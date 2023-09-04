import CompressIterator from './internal/CompressIterator';
import { ItOrCurriedIt, IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Filters/compresses the input iterator to only values that correspond to truthy values in `selectors`.
 * @param selectors An iterator or iterable of falsey or truthy values to select which values to keep in this
 * iterator.
 */
export function compress<T extends IteratorOrIterable<any>>(
  arg: T,
  selectors: IteratorOrIterable<any>,
): IterableIterator<IterSource<T>>;
export function compress<T extends IteratorOrIterable<any>>(
  selectors: IteratorOrIterable<any>,
): (arg: T) => IterableIterator<IterSource<T>>;
export function compress(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return it => compress(it, args[0]);
  return new CompressIterator(toIterator(args[0]), toIterator(args[1]));
}

export default compress;
