/** Caches the values of the input `iterator` into a Map. */
export class CachedIterator<T> implements Iterator<T> {
  public readonly cache = new Map<number, T>();
  protected i = 0;

  constructor(protected iterator: Iterator<T>) {}

  next(): IteratorResult<T> {
    const next = this.iterator.next();
    if (next.done) return next;
    this.cache.set(this.i++, next.value);
    return next;
  }
}

export default CachedIterator;
