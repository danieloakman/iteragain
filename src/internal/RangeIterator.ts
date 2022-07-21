/** Yields numbers inside a range. When `next.done` is true, resets the internal counter back to `start`. */
export class RangeIterator implements Iterator<number> {
  protected i = this.start;
  constructor(
    protected readonly start: number,
    protected readonly stop: number,
    protected readonly step: number,
    protected readonly stepSign: number = Math.sign(step),
  ) {}

  next(): IteratorResult<number> {
    if (Math.sign(this.stop - this.i) !== this.stepSign) {
      this.i = this.start;
      return { done: true, value: undefined };
    }
    const value = this.i;
    this.i += this.step;
    return { done: false, value };
  }
}

export default RangeIterator;
