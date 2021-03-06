/** An iterator that only yields values beginning from `start` (inclusive) and ending at `end` (exclusive). */
export class SliceIterator<T> implements Iterator<T> {
  protected i = 0;
  constructor(protected iterator: Iterator<T>, protected start: number, protected end: number) {}

  next() {
    let result: IteratorResult<T>;
    while (!(result = this.iterator.next()).done && this.i++ < this.start);
    if (this.i <= this.end) return result;
    return { done: true, value: undefined };
  }
}

export default SliceIterator;
