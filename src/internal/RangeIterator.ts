import toArray from '../toArray';

/**
 * A class for representing a range of numbers and also iterating through them. When `next.done` is true, resets the
 * internal counter back to `start`.
 */
export class RangeIterator implements IterableIterator<number> {
  /** The start of this range of numbers (inclusive). */
  public readonly start: number;
  /** The stop/end point of this range of numbers (exclusive). */
  public readonly stop: number;
  /** Each iteration is increased by this amount. */
  public readonly step: number;

  protected i: number;
  protected _length: number;
  /** The sign of `step`. */
  protected readonly stepSign: number;

  constructor(stop: number);
  constructor(start: number, stop: number);
  constructor(start: number, stop: number, step: number);
  constructor(...params: any[]) {
    let start = 0,
      stop = 0,
      step: number;
    if (params.length === 1) stop = params[0];
    else if (params.length > 1) [start, stop, step] = params;
    if (typeof step !== 'number') step = Math.sign(stop - start);
    const stepSign = Math.sign(step);
    if (stepSign === 0) this.next = () => ({ done: true, value: undefined });

    this.start = this.i = start;
    this.stop = stop;
    this.step = step;
    this.stepSign = stepSign;
    // If the start is not in this range, then it's 0, otherwise calc normally.
    this._length = this.includes(start) ? Math.abs(Math.ceil((stop - start) / step)) : 0;
  }

  /** The length of this range of numbers. */
  get length() {
    return this._length;
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this;
  }

  next(): IteratorResult<number> {
    if (Math.sign(this.stop - this.i) !== this.stepSign) {
      this.i = this.start;
      return { done: true, value: undefined };
    }
    const value = this.i;
    this.i += this.step;
    return { done: false, value };
  }

  /** Returns true if `n` is inside of this range. */
  includes(n: number): boolean {
    if ((n - this.start) % this.step !== 0) return false;
    return this.stepSign > 0 ? n >= this.start && n < this.stop : n <= this.start && n > this.stop;
  }

  /** Returns the number at `index` in this range. `index` can be negative to access indices starting from the end. */
  nth(index: number): number {
    const num = index >= 0 ? this.start + index * this.step : this.stop + index * this.step;
    return this.includes(num) ? num : undefined;
  }

  /** Returns the index that `n` is at in this range. */
  index(n: number): number {
    return (n - this.start) / this.step;
  }

  /** Returns true if this range is equal to another. */
  equal(other: RangeIterator): boolean {
    return this.start === other.start && this.stop === other.stop && this.step === other.step;
  }

  // slice(start: number, end?: number) {}

  toString() {
    return `range(${this.start}, ${this.stop}, ${this.step})`;
  }

  /** Iterates and collects all values into an Array. */
  toArray() {
    return toArray(this);
  }
}

export default RangeIterator;
