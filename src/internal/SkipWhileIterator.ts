/**
 * @deprecated Use `DropWhileIterator` instead as "drop" is the more used name for this kind of behaviour of iterators
 * in JS.
 * @description Skips values in the input `iterator` while the predicate returns a truthy value.
 */
export class SkipWhileIterator<T> implements IterableIterator<T> {
  protected skipped = false;

  constructor(protected iterator: Iterator<T>, protected predicate: (value: T) => any) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    if (this.skipped) return this.iterator.next();
    let next: IteratorResult<T>;
    do next = this.iterator.next();
    while (!next.done && this.predicate(next.value));
    this.skipped = true;
    return next;
  }
}

export default SkipWhileIterator;
