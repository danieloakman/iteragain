/* asyncify(asyncMap) */
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(Iteratee, AsyncIteratee) */
/* ra(map, asyncMap) */
/* ra(toIterator,toAsyncIterator) */
/* ra(MapIterator, AsyncMapIterator) */

import MapIterator from './internal/MapIterator';
import type { ItOrCurriedIt, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns a new iterator that maps each element in the input iterator to a new value. */
export function map<T, R>(arg: IteratorOrIterable<T>, iteratee: Iteratee<T, R>): IterableIterator<R>;
export function map<T, R>(iteratee: Iteratee<T, R>): (arg: IteratorOrIterable<T>) => IterableIterator<R>;
export function map(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return it => map(it, args[0]);
  return new MapIterator(toIterator(args[0]), args[1]);
}

export default map;
