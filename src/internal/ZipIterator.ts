export class ZipIterator implements Iterator<any> {
  constructor(protected readonly iterators: Iterator<any>[]) {}

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
