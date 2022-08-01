import { IterSource } from './types';

/** An iterator that concatenates other iterators together, in the order they are in the `iterators` arg. */
export class ConcatIterator<T extends Array<Iterator<any>>> implements Iterator<IterSource<T[number]>> {
  constructor(protected iterators: T) {}

  next(): IteratorResult<IterSource<T[number]>> {
    if (!this.iterators.length) return { done: true, value: undefined };
    const next = this.iterators[0].next();
    if (!next.done) return next;
    this.iterators.shift();
    return this.next();
  }
}

export default ConcatIterator;
