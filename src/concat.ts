import type { IteratorOrIterable, IterSource } from './types';
import toIterator from './toIterator';
import ConcatIterator from './internal/ConcatIterator';

/** Concatenates any number of iterator/iterables together, one after another. */
export function concat<T extends IteratorOrIterable<any>[]>(...args: T) {
  return new ConcatIterator(args.map(toIterator) as Iterator<IterSource<T[number]>>[]);
}

export default concat;
