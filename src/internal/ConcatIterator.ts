/** An iterator that concatenates other iterators together, in the order they are in the `iterators` arg. */
export class ConcatIterator implements Iterator<any> {
  protected nextIterator = this.iterators.shift();
  constructor(protected iterators: Iterator<any>[]) {}

  next(): IteratorResult<any> {
    const next = this.nextIterator.next();
    if (!next.done) return next;
    if (this.iterators.length) {
      this.nextIterator = this.iterators.shift();
      return this.next();
    }
    return { done: true, value: undefined };
  }
}

export default ConcatIterator;
