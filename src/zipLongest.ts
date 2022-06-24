import ExtendedIterator from './ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable } from './types';

function* zipLongestGen(...args: any) {
  const iterators = args.map(toIterator);
  while (true) {
    let allDone = true;
    const values = iterators.map(iterator => {
      const { value, done } = iterator.next();
      if (!done) allDone = false;
      return value;
    });
    if (allDone) break;
    yield values;
  }
}

/** Aggregates any number of iterables into one. Stops when all of the iterables is empty. */
export function zipLongest<A, B>(a: IteratorOrIterable<A>, b: IteratorOrIterable<B>): ExtendedIterator<[A, B]>;
export function zipLongest<A, B, C>(
  a: IteratorOrIterable<A>,
  b: IteratorOrIterable<B>,
  c: IteratorOrIterable<C>,
): ExtendedIterator<[A, B, C]>;
export function zipLongest(...args: IteratorOrIterable<any>[]): ExtendedIterator<any[]>;
export function zipLongest(...args: IteratorOrIterable<any>[]) {
  return new ExtendedIterator(zipLongestGen(...args));
}

export default zipLongest;
