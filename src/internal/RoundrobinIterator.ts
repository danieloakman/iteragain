export class RoundrobinIterator implements Iterator<any> {
  protected i = 0;

  constructor(protected iterators: Iterator<any>[]) {}

  next(): IteratorResult<any> {
    if (!this.iterators.length) return { done: true, value: undefined };
    const next = this.iterators[this.i].next();
    if (next.done) {
      this.iterators.splice(this.i, 1);
      this.i %= this.iterators.length;
      return this.next();
    }
    this.i = (this.i + 1) % this.iterators.length;
    return next;
  }
}

export default RoundrobinIterator;
