import RangeIterator from './internal/RangeIterator';

/**
 * Returns a `RangeIterator` for all numbers starting at the start index and one step before the stop index.
 * @note This functionally behaves the same as Python 3's `range` builtin, with the exception of here:
 * `range(1, 0) == [1]`, whereas in Python, it returns an empty iterator: `[]`.
 * @param start The start index (inclusive) (default: 0).
 * @param stop The stop index (exclusive).
 * @param step The optional amount to increment each step by, can be positive or
 * negative (default: Math.sign(stop - start)).
 */
export function range(stop: number): RangeIterator;
export function range(start: number, stop: number): RangeIterator;
export function range(start: number, stop: number, step: number): RangeIterator;
export function range(...params: ConstructorParameters<typeof RangeIterator>): RangeIterator {
  return new RangeIterator(...params);
}

export default range;
