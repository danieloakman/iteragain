/** Tap into the values of an iterator. `func` does not modify values passed to it as it's return value is unused. */
export class TapIterator<T> implements IterableIterator<T> {
  constructor(protected iterator: Iterator<T>, protected func: (value: T) => any) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    const next = this.iterator.next();
    if (!next.done) this.func(next.value);
    return next;
  }
}

export default TapIterator;
