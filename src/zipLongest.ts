import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable } from './types';
import ZipLongestIterator from './internal/ZipLongestIterator';

/** Aggregates any number of iterables into one. Stops when all of the iterables is empty. */
export function zipLongest<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[A, B]>;
export function zipLongest<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): ExtendedIterator<[A, B, C]>;
export function zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
export function zipLongest(...args: IteratorOrIterable<any>[]) {
  return new ExtendedIterator(new ZipLongestIterator(args.map(toIterator)));
}

export default zipLongest;
