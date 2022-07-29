import isIterable from '../isIterable';
import isIterator from '../isIterator';
import toIterator from '../toIterator';

/** Flattens an iterator `depth` number of levels. */
export class FlattenIterator implements Iterator<any> {
  protected inner: Iterator<any> = null;
  constructor(protected iterator: Iterator<any>, protected depth: number) {}

  next() {
    if (this.depth < 1) return this.iterator.next();
    let next: IteratorResult<any>;
    if (this.inner) {
      next = this.inner.next();
      if (next.done) {
        this.inner = null;
        return this.next();
      }
    } else next = this.iterator.next();
    if (typeof next.value !== 'string' && isIterable(next.value) || isIterator(next.value)) {
      this.inner = new FlattenIterator(toIterator(next.value), this.depth - 1);
      return this.inner.next();
    }
    return next;
  }
}

export default FlattenIterator;
