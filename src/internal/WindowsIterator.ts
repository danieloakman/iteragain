/** An Iterator that yields windows or tuples of various sizes and offsets/intervals from the input `iterator`. */
export class WindowsIterator<T> implements IterableIterator<T[]> {
  protected prev: T[] = [];
  protected nextResult: IteratorResult<T> = { done: false, value: undefined };
  /** The number of elements inbetween windows. */
  protected readonly unused = this.offset - this.length;

  constructor(protected iterator: Iterator<T>, protected length: number, protected offset: number, protected fill?: T) {}

  [Symbol.iterator](): IterableIterator<T[]> {
    return this;
  }

  next(...args: any[]): IteratorResult<T[]> {
    if (this.nextResult.done) return this.nextResult;
    while (this.prev.length < this.length && !(this.nextResult = this.iterator.next(...args as any)).done)
      this.prev.push(this.nextResult.value);
    if (this.prev.length < this.length) {
      if (this.fill === undefined || !this.prev.length) return this.nextResult as IteratorResult<T[]>;
      this.prev.push(...Array.from({ length: this.length - this.prev.length }, _ => this.fill));
    }
    // Remove unused elements:
    for (let i = 0; i < this.unused; i++) this.iterator.next(...args as any);
    const value = this.prev.slice();
    this.prev.splice(0, this.offset);
    return { done: false, value };
  }
}

export default WindowsIterator;
