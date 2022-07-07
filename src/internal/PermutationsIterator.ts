import RangeIterator from './RangeIterator';
import toArray from '../toArray';
import { Tuple } from './types';

/** Returns all successive `size` length permutations of the input `iterator`. */
export class PermutationsIterator<T, Size extends number> implements Iterator<Tuple<T, Size>> {
  protected pool: T[];
  /** Tuple size. */
  protected size: Size;
  protected indices: number[];
  protected cycles: number[];
  protected started = false;

  constructor(iterator: Iterator<T>, size?: Size) {
    this.pool = toArray(iterator);
    this.size = size ?? this.pool.length as Size;
    if (this.size > this.pool.length) this.next = () => ({ done: true, value: undefined });
    this.indices = toArray(new RangeIterator(0, this.pool.length, 1, 1));
    this.cycles = toArray(new RangeIterator(this.pool.length, this.pool.length - this.size, -1));
  }

  protected get value(): Tuple<T, Size> {
    return this.indices.slice(0, this.size).map(i => this.pool[i]) as Tuple<T, Size>;
  }

  next(): IteratorResult<Tuple<T, Size>> {
    if (!this.started) {
      this.started = true;
      return { done: false, value: this.value };
    }
    for (let i = this.size - 1; i > -1; i--) {
      this.cycles[i]--;
      if (this.cycles[i] === 0) {
        const first = this.indices[i];
        for (let j = i; j < this.indices.length - 1; j++) this.indices[j] = this.indices[j + 1];
        this.indices[this.indices.length - 1] = first;
        this.cycles[i] = this.pool.length - i;
      } else {
        const j = this.cycles[i];
        const negJ = this.pool.length - j;
        [this.indices[i], this.indices[negJ]] = [this.indices[negJ], this.indices[i]];
        return { done: false, value: this.value };
      }
    }
    return { done: true, value: undefined };
  }
}

export default PermutationsIterator;
