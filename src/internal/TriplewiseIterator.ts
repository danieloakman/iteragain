/** An iterator that collects (triplets) from the input `Iterator<T>`, like: [T, T, T]. */
export class TriplewiseIterator<T> implements Iterator<[T, T, T]> {
  protected prev: T[] = [];

  constructor(protected iterator: Iterator<T>) {}

  next(): IteratorResult<[T, T, T]> {
    while (this.prev.length !== 3) {
      const next = this.iterator.next();
      // if (next.done) return (this.next = () => ({ done: true, value: undefined }))();
      if (next.done) return { done: true, value: undefined };
      this.prev.push(next.value);
    }
    const value = this.prev.slice();
    this.prev.shift();
    return { done: false, value } as IteratorResult<[T, T, T]>;
  }
}

export default TriplewiseIterator;
