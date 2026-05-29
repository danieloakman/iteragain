import SeekableIterator from './SeekableIterator';

export class TeedIterator<T> implements IterableIterator<T> {
  constructor(
    protected i: number,
    protected seekable: SeekableIterator<T>,
    protected indices: number[],
  ) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    const index = this.indices[this.i]!;
    this.seekable.seek(index + 1);
    if (index >= this.seekable.elements.length) return { done: true, value: undefined };
    this.indices[this.i]!++;
    return { done: false, value: this.seekable.elements[index]! };
  }
}

export default TeedIterator;
