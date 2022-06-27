/** An iterator that concatenates other iterators together, in the order they are in the `iterators` arg. */
export class ConcatIterator implements Iterator<any> {
  constructor(protected readonly iterators: Iterator<any>[]) {}

  next(): IteratorResult<any> {
    const next = this.iterators[0].next();
    if (!next.done) return next;
    this.iterators.shift();
    return this.iterators.length ? this.next() : { done: true, value: undefined };
  }
}

export default ConcatIterator;
