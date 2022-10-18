/* asyncify(asyncToArray) */
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(toArray, asyncToArray) */
/* ra(toIterator, toAsyncIterator) */

import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Converts an iterator or iterable into an array by iterating over all it's values and collecting them. */
export /*i(async)*/ function toArray<T>(iteratorOrIterable: IteratorOrIterable<T>): /*r(T[], Promise<T[]>)*/T[] {
  const iterator = toIterator(iteratorOrIterable);
  const result: T[] = [];
  let next: IteratorResult<T>;
  while (!(next = /*i(await)*/ iterator.next()).done) result.push(next.value);
  return result;
}

export default toArray;
