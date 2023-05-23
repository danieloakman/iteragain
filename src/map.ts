/* asyncify(asyncMap) */
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(Iteratee, AsyncIteratee) */
/* ra(map, asyncMap) */
/* ra(toIterator,toAsyncIterator) */
/* ra(MapIterator, AsyncMapIterator) */

import MapIterator from './internal/MapIterator';
import { IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns a new iterator that maps each element in the input iterator to a new value. */
export function map<T extends IteratorOrIterable<any>, R>(arg: T, iteratee: Iteratee<IterSource<T>, R>) {
  return new MapIterator(toIterator(arg), iteratee);
}

export default map;
