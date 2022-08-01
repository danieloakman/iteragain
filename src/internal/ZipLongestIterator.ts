export class ZipLongestIterator implements IterableIterator<any> {
  protected readonly done = new Set<number>();

  constructor(protected iterators: Iterator<any>[]) {}

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  next(): IteratorResult<any> {
    const values = [];
    for (let i = 0; i < this.iterators.length; i++) {
      if (!this.done.has(i)) {
        const next = this.iterators[i].next();
        if (next.done) this.done.add(i);
        values.push(next.value);
      } else values.push(undefined);
    }
    if (values.length === this.done.size) return { done: true, value: undefined };
    return { value: values, done: false };
  }
}

export default ZipLongestIterator;
