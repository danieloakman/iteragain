/** Repeats `value` a certain number of times. */
export class RepeatIterator<T> implements Iterator<T> {
  constructor(protected value: T, protected times: number) {}

  next(): IteratorResult<T> {
    if (this.times-- > 0) return { done: false, value: this.value };
    return { done: true, value: undefined };
  }
}

export default RepeatIterator;
