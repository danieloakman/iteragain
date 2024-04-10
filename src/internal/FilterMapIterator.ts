/** Maps the input iterator to a new value of type `R` and filters out any values that are nullish. */
export class FilterMapIterator<T, R> implements IterableIterator<NonNullable<R>> {
  constructor(
    protected iterator: Iterator<T>,
    protected iteratee: (value: T) => R,
  ) {}

  [Symbol.iterator](): IterableIterator<NonNullable<R>> {
    return this;
  }

  next(...args: any[]): IteratorResult<NonNullable<R>> {
    const next = this.iterator.next(...(args as any));
    if (next.done) return { value: undefined, done: true };
    const value = this.iteratee(next.value);
    if (value === null || value === undefined) return this.next(...(args as any));
    return { value: value as NonNullable<R>, done: false };
  }
}

export default FilterMapIterator;
