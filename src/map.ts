/* asyncify(asyncMap) */
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(Iteratee, AsyncIteratee) */
/* ra(map, asyncMap) */
/* ra(toIterator,toAsyncIterator) */
/* ra(MapIterator, AsyncMapIterator) */

import MapIterator from './internal/MapIterator';
import type { ItOrCurriedIt, IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns a new iterator that maps each element in the input iterator to a new value. */
export function map<T extends IteratorOrIterable<any>, R>(
  iteratee: Iteratee<IterSource<T>, R>,
): (arg: T) => IterableIterator<IterSource<T>>;
export function map<T extends IteratorOrIterable<any>, R>(
  arg: T,
  iteratee: Iteratee<IterSource<T>, R>,
): IterableIterator<IterSource<T>>;
export function map(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return (it: IteratorOrIterable<any>) => map(it, args[0]);
  return new MapIterator(toIterator(args[0]), args[1]);
}

export default map;
