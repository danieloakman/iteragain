import isIterable from '../isIterable';
import isIterator from '../isIterator';
import toIterator from '../toIterator';

/** Flattens an iterator `depth` number of levels. */
export class FlattenIterator implements IterableIterator<any> {
  protected inner: Iterator<any> = null;

  constructor(protected iterator: Iterator<any>, protected depth: number) {}

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  next() {
    if (this.depth < 1) return this.iterator.next();
    let next: IteratorResult<any>;
    if (this.inner) {
      next = this.inner.next();
      if (next.done) {
        this.inner = null;
        return this.next();
      }
      return next;
    }
    next = this.iterator.next();
    if (typeof next.value !== 'string') {
      if (isIterator(next.value)) {
        this.inner = new FlattenIterator(next.value, this.depth - 1);
        return this.next();
      } else if (isIterable(next.value)) {
        this.inner = new FlattenIterator(toIterator(next.value), this.depth - 1);
        return this.next();
      }
    }
    return next;
  }
}

export default FlattenIterator;
