import ExtendedIterator from './ExtendedIterator';

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

    super({
      iterator: Range.iterator(start, stop, step, stepSign),
      next () {
        const next = this.iterator.next();
        if (next.done)
          // Re-initialise the iterator if we've reached the end.
          this.iterator = Range.iterator(start, stop, step, stepSign);
        return next;
      }
    });

    this.start = start;
    this.stop = stop;
    this.step = step;
    this.stepSign = stepSign;
    // If the start is not in this range, then it's 0, otherwise calc normally.
    this.length = this.includes(start) ? Math.abs(Math.ceil((stop - start) / step)) : 0;
  }

  protected static *iterator(start: number, stop: number, step: number, stepSign: number) {
    if (stepSign === 0) return;
    for (let i = start; Math.sign(stop - i) === stepSign; i += step) yield i;
  }

  /** Returns true if `n` is inside of this range. */
  includes(n: number): boolean {
    if ((n - this.start) % this.step !== 0) return false;
    return this.stepSign > 0 ? n >= this.start && n < this.stop : n <= this.start && n > this.stop;
  }

  /** Returns the number at `index` in this range. */
  nth(index: number): number {
    const num = index >= 0 ? this.start + index * this.step : this.stop + index * this.step;
    return this.includes(num) ? num : undefined;
  }

  /** Returns true if this range is equal to another. */
  equal(other: Range) {
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
