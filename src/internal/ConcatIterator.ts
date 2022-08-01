import { IterSource } from './types';

/** An iterator that concatenates other iterators together, in the order they are in the `iterators` arg. */
export class ConcatIterator<T extends Array<Iterator<any>>> implements IterableIterator<IterSource<T[number]>> {
  constructor(protected iterators: T) {}

  [Symbol.iterator](): IterableIterator<IterSource<T[number]>> {
    return this;
  }

  next(): IteratorResult<IterSource<T[number]>> {
    if (!this.iterators.length) return { done: true, value: undefined };
    const next = this.iterators[0].next();
    if (!next.done) return next;
    this.iterators.shift();
    return this.next();
  }
}

export default ConcatIterator;
