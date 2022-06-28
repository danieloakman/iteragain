import { IteratorOrIterable } from './types';
import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import ConcatIterator from './internal/ConcatIterator';

/** Concatenates any number of iterator/iterables together, one after another. */
export function concat<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<A | B>;
export function concat<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): ExtendedIterator<A | B | C>;
export function concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any>;
export function concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any> {
  return new ExtendedIterator(new ConcatIterator(args.map(toIterator)));
}

export default concat;
