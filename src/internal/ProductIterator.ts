import toArray from '../toArray';

/** Returns the cartesian product of the input `iterators`. */
export class ProductIterator<T> implements IterableIterator<T[]> {
  protected done = false;
  protected pools: T[][] = [];
  protected indices: number[];
  protected i: number;

  constructor(iterators: Iterator<T>[], repeat: number) {
    const iterated = iterators.map(toArray);
    for (let i = 0; i < repeat; i++) this.pools.push(...iterated);
    this.indices = new Array(this.pools.length).fill(0);
  }

  [Symbol.iterator](): IterableIterator<T[]> {
    return this;
  }

  next(): IteratorResult<T[]> {
    if (this.done) return { done: true, value: undefined };
    const value = this.indices.map((v, i) => this.pools[i][v]);
    for (this.i = 0; this.i < this.indices.length; this.i++) {
      if (this.indices[this.pools.length - this.i - 1] < this.pools[this.pools.length - this.i - 1].length - 1) {
        this.indices[this.pools.length - this.i - 1]++;
        break;
      }
    }
    if (this.i === this.indices.length) {
      this.done = true;
      return { done: false, value };
    }
    this.i--;
    while (this.i >= 0) {
      this.indices[this.pools.length - this.i - 1] = 0;
      this.i--;
    }
    return { done: false, value };
  }
}

export default ProductIterator;
