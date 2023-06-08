import { Tuple } from '../types';

/** An iterator that yields non-overlapping values in chunks (tuples) of a certain `size`. */
export class ChunksIterator<T, Size extends number> implements IterableIterator<Tuple<T, Size>> {
  protected done = false;
  protected chunk: T[] = [];

  constructor(protected iterator: Iterator<T>, protected length: Size, protected fill?: T | undefined) {}

  [Symbol.iterator](): IterableIterator<Tuple<T, Size>> {
    return this;
  }

  next(...args: any[]): IteratorResult<Tuple<T, Size>> {
    if (this.done) return { done: true, value: undefined };
    for (let i = 0; i < this.length; i++) {
      const next = this.iterator.next(...(args as any));
      if (next.done) {
        this.done = true;
        if (this.chunk.length) {
          if (this.fill !== undefined) {
            this.chunk = this.chunk.concat(
              Array.from({ length: this.length - this.chunk.length }, _ => this.fill as T),
            );
          }
          break;
        }
        return { done: true, value: undefined };
      }
      this.chunk.push(next.value);
    }
    return { done: false, value: this.chunk.splice(0, this.length) as Tuple<T, Size> };
  }
}

export default ChunksIterator;
