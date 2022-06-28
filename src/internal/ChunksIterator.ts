/** An iterator that yields values in chunks (tuples) of a certain `size`. */
export class ChunksIterator<T> implements Iterator<T[]> {
  constructor(protected iterator: Iterator<T>, protected size: number, protected fill?: T | null) {}

  next(): IteratorResult<T[]> {
    let chunk: T[] = [];
    for (let i = 0; i < this.size; i++) {
      const next = this.iterator.next();
      if (next.done) {
        if (chunk.length) {
          if (this.fill !== undefined)
            chunk = chunk.concat(Array.from({ length: this.size - chunk.length }, _ => this.fill));
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
