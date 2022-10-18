/* asyncify(asyncMap) */
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(Iteratee, AsyncIteratee) */
/* ra(map, asyncMap) */
/* ra(toIterator,toAsyncIterator) */
/* ra(MapIterator, AsyncMapIterator) */

import MapIterator from './internal/MapIterator';
import { Iteratee, IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Returns a new iterator that maps each element in the input iterator to a new value. */
export function map<T, R>(arg: IteratorOrIterable<T>, iteratee: Iteratee<T, R>) {
  return new MapIterator(toIterator(arg), iteratee);
}

export default map;
