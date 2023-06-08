/** An iterator that collects (triplets) from the input `Iterator<T>`, like: [T, T, T]. */
export class TriplewiseIterator<T> implements IterableIterator<[T, T, T]> {
  protected prev: T[] = [];

  constructor(protected iterator: Iterator<T>) {}

  [Symbol.iterator](): IterableIterator<[T, T, T]> {
    return this;
  }

  next(...args: any[]): IteratorResult<[T, T, T]> {
    while (this.prev.length !== 3) {
      const next = this.iterator.next(...(args as any));
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
