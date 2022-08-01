import toArray from '../toArray';
import { Tuple } from './types';

/** Creates `size` length subsequences from the input `iterator`. */
export class CombinationsIterator<T, Size extends number> implements IterableIterator<Tuple<T, Size>> {
  protected pool: T[];
  protected indices: number[];
  protected n: number;
  protected i: number;

  constructor(iterator: Iterator<T>, protected size: Size, protected withReplacement: boolean) {
    this.pool = toArray(iterator);
    this.n = this.pool.length;
    if (this.n < this.size) this.next = () => ({ done: true, value: undefined });
    this.indices = this.withReplacement ? new Array(this.size).fill(0) : Array.from({ length: this.size }, (_, i) => i);
  }

  protected get value() {
    return this.indices.map(i => this.pool[i]) as Tuple<T, Size>;
  }

  [Symbol.iterator](): IterableIterator<Tuple<T, Size>> {
    return this;
  }

  next(): IteratorResult<Tuple<T, Size>> {
    this.next = this.withReplacement
      ? () => {
        for (this.i = this.size - 1; this.i > -1; this.i--) if (this.indices[this.i] !== this.n - 1) break;
        // If the previous for loop finished without breaking, then we've exhausted all combinations:
        if (this.i === -1) return { done: true, value: undefined };
        const v = this.indices[this.i] + 1;
        for (let j = this.i; j < this.size; j++)
          this.indices[j] = v;
        return { done: false, value: this.value };
      }
      : () => {
        for (this.i = this.size - 1; this.i > -1; this.i--)
          if (this.indices[this.i] !== this.i + this.n - this.size) break;
        // If the previous for loop finished without breaking, then we've exhausted all combinations:
        if (this.i === -1) return { done: true, value: undefined };
        this.indices[this.i]++;
        for (let j = this.i + 1; j < this.size; j++)
          this.indices[j] = this.indices[j - 1] + 1;
        return { done: false, value: this.value };
      };
    return { done: false, value: this.value };
  }
}

export default CombinationsIterator;
