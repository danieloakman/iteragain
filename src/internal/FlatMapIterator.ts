import type { Iteratee, IteratorOrIterable } from '../types';
import toIterator from '../toIterator';
import isIterable from '../isIterable';
import isIterator from '../isIterator';

/** Maps and flattens an iterator by a depth of 1. */
export class FlatMapIterator<T, R> implements IterableIterator<R> {
  protected inner: Iterator<R> | null = null;

  constructor(
    protected readonly iterator: Iterator<T>,
    protected readonly iteratee: Iteratee<T, R | IteratorOrIterable<R>>,
  ) {}

  [Symbol.iterator](): IterableIterator<R> {
    return this;
  }

  next(...args: any[]): IteratorResult<R> {
    if (this.inner) {
      const next = this.inner.next(...(args as any));
      if (next.done) {
        this.inner = null;
        return this.next(...args);
      }
      return next;
    }
    const next = this.iterator.next(...(args as any));
    if (next.done) return next;
    const value = this.iteratee(next.value);
    if (typeof value !== 'string') {
      if (isIterator(value)) {
        this.inner = value;
        return this.next(...args);
      } else if (isIterable(value)) {
        this.inner = toIterator(value);
        return this.next(...args);
      }
    }
    return { value, done: false };
  }
}

export default FlatMapIterator;
