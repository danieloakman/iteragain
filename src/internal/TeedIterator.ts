import CachedIterator from './CachedIterator';

export class TeedIterator<T> implements IterableIterator<T> {
  protected done = false;

  constructor(protected i: number, protected cachedIterator: CachedIterator<T>, protected indices: number[]) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    if (this.done) return { done: true, value: undefined };
    while (!this.cachedIterator.cache.has(this.indices[this.i]) && !(this.done = this.cachedIterator.next().done));
    const value = this.cachedIterator.cache.get(this.indices[this.i]);
    if (value === undefined) return { done: true, value: undefined };
    this.indices[this.i]++;
    return { done: false, value };
  }
}

export default TeedIterator;
