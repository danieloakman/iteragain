/** An iterator that concatenates other iterators together, in the order they are in the `iterators` arg. */
export class ConcatIterator implements Iterator<any> {
  constructor(protected iterators: Iterator<any>[]) {}

  next(): IteratorResult<any> {
    if (!this.iterators.length) return { done: true, value: undefined };
    const next = this.iterators[0].next();
    if (!next.done) return next;
    this.iterators.shift();
    return this.next();
  }
}

export default ConcatIterator;
