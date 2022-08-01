export class CompressIterator<T> implements IterableIterator<T> {
  constructor(protected iterator: Iterator<T>, protected selectors: Iterator<any>) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    const [next, selector] = [this.iterator.next(), this.selectors.next()];
    if (next.done || selector.done) return { done: true, value: undefined };
    else if (selector.value) return next;
    return this.next();
  }
}

export default CompressIterator;
