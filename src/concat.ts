import { IteratorOrIterable } from './types';
import ExtendedIterator from './ExtendedIterator';
import toIterator from './toIterator';

function* concatGen(...args: IteratorOrIterable<any>[]) {
  let next: IteratorResult<any>;
  for (let arg of args) {
    arg = toIterator(arg);
    while (!(next = arg.next()).done) yield next.value;
  }
}

/** Concatenates any number of iterator/iterables together, one after another. */
export function concat<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<A | B>;
export function concat<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): ExtendedIterator<A | B | C>;
export function concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any>
export function concat(...args: IteratorOrIterable<any>[]): ExtendedIterator<any> {
  return new ExtendedIterator(concatGen(...args));
}
