/** Drops/skips values in the input `iterator` while the predicate returns a truthy value. */
export class DropWhileIterator<T> implements IterableIterator<T> {
  protected dropped = false;

  constructor(protected iterator: Iterator<T>, protected predicate: (value: T) => any) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(...args: any[]): IteratorResult<T> {
    if (this.dropped) return this.iterator.next(...(args as any));
    let next: IteratorResult<T>;
    do next = this.iterator.next(...(args as any));
    while (!next.done && this.predicate(next.value));
    this.dropped = true;
    return next;
  }
}

export default DropWhileIterator;
