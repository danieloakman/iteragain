import toIterator from '../toIterator';

/**
 * Cycles through the input `iterator`'s values a certain number of `times`. So when the input iterator is done, the
 * next iterator result will cycle back to the first value of the input iterator.
 */
export class CycleIterator<T> implements Iterator<T> {
  protected values: T[] = [];
  constructor(protected iterator: Iterator<T>, protected times: number) {}

  next(): IteratorResult<T> {
    const next = this.iterator.next();
    if (next.done && this.times-- > 0) {
      this.iterator = toIterator(this.values.splice(0, this.values.length));
      return this.next();
    }
    this.values.push(next.value);
    return next;
  }
}

export default CycleIterator;
