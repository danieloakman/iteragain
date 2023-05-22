/* asyncify(asyncToArray) */
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(toArray, asyncToArray) */
/* ra(toIterator, toAsyncIterator) */

import { IterSource, IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Converts an iterator or iterable into an array by iterating over all it's values and collecting them. */
export /*i(async)*/ function toArray<T extends IteratorOrIterable<any>>(iteratorOrIterable: T): /*r(T[], Promise<T[]>)*/IterSource<T>[] {
  const iterator = toIterator(iteratorOrIterable);
  const result: IterSource<T>[] = [];
  let next: IteratorResult<IterSource<T>>;
  while (!(next = /*i(await)*/ iterator.next()).done) result.push(next.value);
  return result;
}

export default toArray;
