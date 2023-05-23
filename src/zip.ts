import toIterator from './toIterator';
import { IteratorOrIterable } from './types';
import ZipIterator from './internal/ZipIterator';

/** Aggregates any number of iterables into one. Stops when one of the iterables is empty. */
export function zip<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): IterableIterator<[A, B]>;
export function zip<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): IterableIterator<[A, B, C]>;
export function zip(...args: IteratorOrIterable<any>[]): IterableIterator<any[]>;
export function zip(...args: IteratorOrIterable<any>[]) {
  return new ZipIterator(args.map(toIterator));
}

export default zip;
