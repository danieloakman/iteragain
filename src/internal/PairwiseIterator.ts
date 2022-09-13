/** An iterator that pairs adjacent values in the input `Iterator<T>` together like: [T, T] */
export class PairwiseIterator<T> implements IterableIterator<[T, T]> {
  protected prev: IteratorResult<T> = null;

  constructor(protected iterator: Iterator<T>) {}

  [Symbol.iterator](): IterableIterator<[T, T]> {
    return this;
  }

  next(): IteratorResult<[T, T]> {
    if (!this.prev && (this.prev = this.iterator.next()).done) return { done: true, value: undefined };

    const next = this.iterator.next();
    if (next.done) return { done: true, value: undefined };
    const value: [T, T] = [this.prev.value, next.value];
    this.prev = next;
    return { done: false, value };
  }
}

export default PairwiseIterator;
