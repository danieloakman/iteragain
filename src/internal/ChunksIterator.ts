/** An iterator that yields non-overlapping values in chunks (tuples) of a certain `size`. */
export class ChunksIterator<T> implements IterableIterator<T[]> {
  protected done = false;
  protected chunk: T[] = [];

  constructor(protected iterator: Iterator<T>, protected length: number, protected fill?: T | null) {}

  [Symbol.iterator](): IterableIterator<T[]> {
    return this;
  }

  next(): IteratorResult<T[]> {
    if (this.done) return { done: true, value: undefined };
    for (let i = 0; i < this.length; i++) {
      const next = this.iterator.next();
      if (next.done) {
        this.done = true;
        if (this.chunk.length) {
          if (this.fill !== undefined)
            this.chunk = this.chunk.concat(Array.from({ length: this.length - this.chunk.length }, _ => this.fill));
          break;
        }
        return { done: true, value: undefined };
      }
      this.chunk.push(next.value);
    }
    return { done: false, value: this.chunk.splice(0, this.length) };
  }
}

export default ChunksIterator;
