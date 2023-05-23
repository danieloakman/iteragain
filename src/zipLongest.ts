import toIterator from './toIterator';
import { IteratorOrIterable } from './types';
import ZipLongestIterator from './internal/ZipLongestIterator';

/** Aggregates any number of iterables into one. Stops when all of the iterables is empty. */
export function zipLongest<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): IterableIterator<[A, B]>;
export function zipLongest<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): IterableIterator<[A, B, C]>;
export function zipLongest(...args: IteratorOrIterable<any>[]): IterableIterator<any[]>;
export function zipLongest(...args: IteratorOrIterable<any>[]) {
  return new ZipLongestIterator(args.map(toIterator));
}

export default zipLongest;
