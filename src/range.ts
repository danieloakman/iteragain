import ExtendedIterator from './ExtendedIterator';
import EmptyIterator from './internal/EmptyIterator';
import RangeIterator from './internal/RangeIterator';

class Range extends ExtendedIterator<number> {
  /** The start of this range of numbers (inclusive). */
  public readonly start: number;
  /** The stop/end point of this range of numbers (exclusive). */
  public readonly stop: number;
  /** Each iteration is increased by this amount. */
  public readonly step: number;
  /** The length of this range of numbers. */
  public readonly length: number;
  /** The sign of `step`. */
  private readonly stepSign: number;

  constructor(...params: any[]) {
    let start = 0,
      stop = 0,
      step: number;
    if (params.length === 1) stop = params[0];
    else if (params.length > 1) [start, stop, step] = params;
    if (typeof step !== 'number') step = Math.sign(stop - start);
    const stepSign = Math.sign(step);
    if (stepSign === 0) super(new EmptyIterator());
    else super(new RangeIterator(start, stop, step, stepSign));

    this.start = start;
    this.stop = stop;
    this.step = step;
    this.stepSign = stepSign;
    // If the start is not in this range, then it's 0, otherwise calc normally.
    this.length = this.includes(start) ? Math.abs(Math.ceil((stop - start) / step)) : 0;
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

  /** Returns the index that this number is at in this range. */
  index(number: number): number {
    return (number - this.start) / this.step;
  }

  /** Returns true if this range is equal to another. */
  equal(other: Range): boolean {
    return this.start === other.start && this.stop === other.stop && this.step === other.step;
  }

  toString() {
    return `Range(${this.start}, ${this.stop}, ${this.step})`;
  }
}

/**
 * Returns a `Range` object (that extends ExtendedIterator) for all numbers starting at the start index and one step
 * before the stop index.
 * @note This functionally behaves the same as Python 3's `range` builtin, with the exception of here:
 * `range(1, 0) == [1]`, whereas in Python, it returns an empty iterator: `[]`.
 * @param start The start index (inclusive) (default: 0).
 * @param stop The stop index (exclusive).
 * @param step The optional amount to increment each step by, can be positive or
 * negative (default: Math.sign(stop - start)).
 */
export function range(stop: number): Range;
export function range(start: number, stop: number): Range;
export function range(start: number, stop: number, step: number): Range;
export function range(...params: any[]): Range {
  return new Range(...params);
}
export default range;
