import toIterator from '../toIterator';

/**
 * Continues iterating through the input `iterator` a certain number of times. When the input iterator is done it
 * returns `{ done: true, value: undefined }` first before resuming back to the beginning again.
 */
export class ResumeIterator<T> implements IterableIterator<T> {
  protected values: T[] = [];

  constructor(
    protected iterator: Iterator<T>,
    protected times: number,
  ) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(...args: any[]): IteratorResult<T> {
    const next = this.iterator.next(...(args as any));
    if (next.done && this.times-- > 0) {
      this.iterator = toIterator(this.values.splice(0, this.values.length));
      return next;
    }
    this.values.push(next.value);
    return next;
  }
}

export default ResumeIterator;
