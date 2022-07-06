/** Skips values in the input `iterator` while the predicate returns a truthy value. */
export class SkipWhileIterator<T> implements Iterator<T> {
  constructor(protected iterator: Iterator<T>, protected predicate: (value: T) => any) {}

  next(): IteratorResult<T> {
    let next: IteratorResult<T>;
    do next = this.iterator.next();
    while (!next.done && this.predicate(next.value));
    return next;
  }
}

export default SkipWhileIterator;
