import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable } from './types';
import ZipIterator from './internal/ZipIterator';

/** Aggregates any number of iterables into one. Stops when one of the iterables is empty. */
export function zip<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[A, B]>;
export function zip<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): ExtendedIterator<[A, B, C]>;
export function zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
export function zip(...args: IteratorOrIterable<any>[]) {
  return new ExtendedIterator(new ZipIterator(args.map(toIterator)));
}

export default zip;
