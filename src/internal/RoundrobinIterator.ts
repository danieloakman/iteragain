export class RoundrobinIterator implements IterableIterator<any> {
  protected i = 0;

  constructor(protected iterators: Iterator<any>[]) {}

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  next(...args: any[]): IteratorResult<any> {
    if (!this.iterators.length) return { done: true, value: undefined };
    const next = this.iterators[this.i].next(...(args as any));
    if (next.done) {
      this.iterators.splice(this.i, 1);
      this.i %= this.iterators.length;
      return this.next(...(args as any));
    }
    this.i = (this.i + 1) % this.iterators.length;
    return next;
  }
}

export default RoundrobinIterator;
