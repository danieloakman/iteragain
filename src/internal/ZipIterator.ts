export class ZipIterator implements IterableIterator<any> {
  constructor(protected iterators: Iterator<any>[]) {}

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  next(): IteratorResult<any> {
    const values = [];
    for (const iterator of this.iterators) {
      const { value, done } = iterator.next();
      if (done) return { done, value: undefined };
      values.push(value);
    }
    return { value: values, done: false };
  }
}

export default ZipIterator;
