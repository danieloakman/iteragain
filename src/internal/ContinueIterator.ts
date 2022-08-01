import toIterator from '../toIterator';

/**
 * Continues iterating through the input `iterator` a certain number of times. When the input iterator is done it
 * returns `{ done: true, value: undefined }` first before continuing back to the beginning again.
 */
export class ContinueIterator<T> implements IterableIterator<T> {
  protected values: T[] = [];

  constructor(protected iterator: Iterator<T>, protected continues: number) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    const next = this.iterator.next();
    if (next.done && this.continues-- > 0) {
      this.iterator = toIterator(this.values.splice(0, this.values.length));
      return next;
    }
    this.values.push(next.value);
    return next;
  }
}

export default ContinueIterator;
