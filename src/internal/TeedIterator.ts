import SeekableIterator from './SeekableIterator';

export class TeedIterator<T> implements IterableIterator<T> {
  constructor(protected i: number, protected seekable: SeekableIterator<T>, protected indices: number[]) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    this.seekable.seek(this.indices[this.i] + 1);
    const value = this.seekable.elements[this.indices[this.i]];
    if (value === undefined) return { done: true, value: undefined };
    this.indices[this.i]++;
    return { done: false, value };
  }
}

export default TeedIterator;
