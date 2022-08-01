/** An iterator that yields non-overlapping values in chunks (tuples) of a certain `size`. */
export class ChunksIterator<T> implements IterableIterator<T[]> {
  constructor(protected iterator: Iterator<T>, protected length: number, protected fill?: T | null) {}

  [Symbol.iterator](): IterableIterator<T[]> {
    return this;
  }

  next(): IteratorResult<T[]> {
    let chunk: T[] = [];
    for (let i = 0; i < this.length; i++) {
      const next = this.iterator.next();
      if (next.done) {
        if (chunk.length) {
          if (this.fill !== undefined)
            chunk = chunk.concat(Array.from({ length: this.length - chunk.length }, _ => this.fill));
          break;
        }
        return { done: true, value: undefined };
      }
      chunk.push(next.value);
    }
    return { done: false, value: chunk };
  }
}

export default ChunksIterator;
