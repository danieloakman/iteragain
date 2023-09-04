/* asyncify(AsyncMapIterator) */
/* ra(MapIterator, AsyncMapIterator) */
/* ra(IterableIterator, AsyncIterableIterator) */
/* ra(Symbol.iterator, Symbol.asyncIterator) */
/* ra('IteratorResult<R>', 'Promise<IteratorResult<R>>') */
/* ra(Iteratee, AsyncIteratee) */
/* ra(' Iterator', ' AsyncIterator') */

import type { Iteratee } from '../types';

/** An iterator that takes an input Iterator<T> and maps it's values to the type `R`. */
export class MapIterator<T, R> implements IterableIterator<R> {
  constructor(protected iterator: Iterator<T>, protected iteratee: Iteratee<T, R>) {}

  [Symbol.iterator](): IterableIterator<R> {
    return this;
  }

  /*i(async)*/ next(...args: any[]): IteratorResult<R> {
    const { value, done } = /*i(await)*/ this.iterator.next(...(args as any));
    if (done) return { done: true, value: undefined };
    return { value: /*i(await)*/ this.iteratee(value), done };
  }
}

export default MapIterator;
