/**
 * @deprecated Use `SeekableIterator` instead.
 * @description Caches the values of the input `iterator` into a Map.
 */
export class CachedIterator<T> implements IterableIterator<T> {
  public readonly cache = new Map<number, T>();
  protected i = 0;
  protected done = false;

  constructor(protected iterator: Iterator<T>) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(...args: any[]): IteratorResult<T> {
    if (this.done) return { done: true, value: undefined };
    const next = this.iterator.next(...(args as any));
    if ((this.done = next.done ?? false)) return next;
    this.cache.set(this.i++, next.value);
    return next;
  }
}

export default CachedIterator;
