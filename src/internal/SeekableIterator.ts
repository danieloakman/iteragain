import { Tuple } from './types';

/**
 * Wraps `iterator` to allow for seeking backwards and forwards. An internal cache of length `maxLength` is kept and
 * progressively added to when iterating forwards.
 */
export class SeekableIterator<T> implements IterableIterator<T> {
  protected cache: T[] = [];
  protected i = 0;
  protected iteratorDone = false;

  constructor(protected iterator: Iterator<T>, protected maxLength = Infinity) {}

  get elements(): readonly T[] {
    return this.cache;
  }

  get done(): boolean {
    // If the iterator is done, then determine if `i` is at the end of the cache.
    return this.iteratorDone ? (!this.cache.length || this.i >= this.cache.length) : false;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  public next(...args: any[]): IteratorResult<T> {
    if (this.done) return { done: true, value: undefined };
    const cachedValue = this.cache[this.i++];
    if (cachedValue !== undefined) return { done: false, value: cachedValue };
    const next = this.iterator.next(...args as any);
    if (next.done) this.iteratorDone = true;
    else this.add(next.value);
    return next;
  }

  /**
   * Seeks forward/backwards to the index `i`. `i` may be any positive or negative number. Negative numbers seek
   * starting from the end of the internal cache (e.g. -1 is the last element).
   */
  public seek(i: number): void {
    if (i < 0) i = (this.cache.length + i);
    if (i > this.i) while (this.i < i && !this.done) this.next();
    else if (i < this.i) this.i = i;
  }

  /**
   * Peek ahead of where the current iteration is. This doesn't consume any values of the iterator.
   * @param ahead optional, the number of elements to peek ahead.
   */
  public peek<N extends number = 1>(ahead: N = 1 as N): Tuple<T, N> {
    const result: IteratorResult<T>[] = [];
    for (let i = 0; i < ahead; i++) result.push(this.next().value);
    this.i -= ahead;
    return result as Tuple<T, N>;
  }

  /** Add `value` to the `cache`. */
  private add(value: T) {
    this.cache.push(value);
    if (this.cache.length > this.maxLength) this.cache.shift();
  }
}

export default SeekableIterator;
