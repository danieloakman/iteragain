/** An iterator that takes an input Iterator<T> and maps it's values to the type `R`. */
export class MapIterator<T, R> implements IterableIterator<R> {
  constructor(protected iterator: Iterator<T>, protected iteratee: (value: T) => R) {}

  [Symbol.iterator](): IterableIterator<R> {
    return this;
  }

  next(): IteratorResult<R> {
    const { value, done } = this.iterator.next();
    return { value: done ? undefined : this.iteratee(value), done };
  }
}
export default MapIterator;
