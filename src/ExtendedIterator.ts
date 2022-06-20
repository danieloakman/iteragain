export class ExtendedIterator<T> {
  public constructor(protected readonly iterator: Iterator<T> & { iterator?: Iterator<any> }) {}

  get collect() {
    return this.toArray();
  }

  /** Returns a `{ value, done }` object that adheres to the Iterator protocol */
  public next() {
    return this.iterator.next();
  }

  /** Allows usage with "for of" loops */
  public [Symbol.iterator]() {
    return this;
  }

  /** Returns a new ExtendedIterator that maps each element in this iterator to a new value. */
  public map<R>(iteratee: (value: T) => R) {
    return new ExtendedIterator<R>({
      iterator: this.iterator,
      next() {
        const { value, done } = this.iterator.next();
        return { value: !done && iteratee(value), done } as IteratorResult<R>;
      },
    });
  }

  /**
   * Returns a new ExtendedIterator that filters each element in this iterator.
   * @param predicate A function that returns a truthy value to indicate to keep that value.
   */
  public filter(predicate: (element: T) => any) {
    return new ExtendedIterator<T>({
      iterator: this.iterator,
      next() {
        let result: IteratorResult<T>;
        do result = this.iterator.next();
        while (!result.done && !predicate(result.value));
        return result;
      },
    });
  }

  public forEach(callback: (value: T) => void) {
    for (const value of this) callback(value);
  }

  public reduce<R>(reducer: (accumulator: R|T, value: T) => R): R;
  public reduce<R>(reducer: (accumulator: R, value: T) => R, initialValue: R): R;
  public reduce<R>(reducer: (accumulator: R|T, value: T) => R, initialValue?: R): R {
    let accumulator = initialValue ?? this.next().value;
    for (const value of this) accumulator = reducer(accumulator, value);
    return accumulator;
  }

  public toArray(): T[] {
    const result: T[] = [];
    for (const value of this) result.push(value);
    return result;
  }

  public toArray2(): T[] {
    const result: T[] = [];
    result.push(...this);
    return result;
  }

  public toSet() {
    return new Set([...this]);
  }
  public toMap<K, V>() {
    // @ts-ignore
    return new Map<K, V>(this);
  }
}

export default ExtendedIterator;
