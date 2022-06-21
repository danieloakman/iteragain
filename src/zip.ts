import ExtendedIterator from './ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable } from './types';

function* zipGen (...args: IteratorOrIterable<any>[]) {
  const iterators = args.map(toIterator);
  loop: while (true) {
    const values = [];
    for (const iterator of iterators) {
      const { value, done } = iterator.next();
      if (done) break loop;
      values.push(value);
    }
    yield values;
  }
}

/** Aggregates any number of iterables into one. Stops when one of the iterables is empty. */
export function zip<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[A, B]>;
export function zip<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): ExtendedIterator<[A, B, C]>;
export function zip(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
export function zip(...args: IteratorOrIterable<any>[]) {
  return new ExtendedIterator(zipGen(...args));
}
