import { Predicate } from './types';

/** Take values from the input `iterator` while the predicate returns a truthy value. */
export class TakeWhileIterator<T> implements Iterator<T> {
  protected done = false;

  constructor(protected iterator: Iterator<T>, protected predicate: Predicate<T>) {}

  next(): IteratorResult<T> {
    if (this.done) return { done: true, value: undefined };
    const next = this.iterator.next();
    if (next.done || !this.predicate(next.value)) {
      this.done = true;
      return this.next();
    }
    return next;
  }
}

export default TakeWhileIterator;
