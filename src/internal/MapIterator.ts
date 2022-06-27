/** An iterator that takes an input Iterator<T> and maps it's values to the type `R`. */
export class MapIterator<T, R> implements Iterator<R> {
  constructor(protected iterator: Iterator<T>, protected iteratee: (value: T) => R) {}

  next(): IteratorResult<R> {
    const { value, done } = this.iterator.next();
    return { value: done ? undefined : this.iteratee(value), done };
  }
}
export default MapIterator;
