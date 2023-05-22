import isIterable from '../isIterable';
import isIterator from '../isIterator';
import toIterator from '../toIterator';

/** Flattens an iterator `depth` number of levels. */
export class FlattenIterator implements IterableIterator<any> {
  protected inner: Iterator<any> | null = null;

  constructor(protected iterator: Iterator<any>, protected depth: number) {}

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  next(...args: any[]): IteratorResult<any> {
    if (this.depth < 1) return this.iterator.next(...args as any);
    let next: IteratorResult<any>;
    if (this.inner) {
      next = this.inner.next(...args as any);
      if (next.done) {
        this.inner = null;
        return this.next(...args as any);
      }
      return next;
    }
    next = this.iterator.next(...args as any);
    if (typeof next.value !== 'string') {
      if (isIterator(next.value)) {
        this.inner = new FlattenIterator(next.value, this.depth - 1);
        return this.next(...args as any);
      } else if (isIterable(next.value)) {
        this.inner = new FlattenIterator(toIterator(next.value), this.depth - 1);
        return this.next(...args as any);
      }
    }
    return next;
  }
}

export default FlattenIterator;
