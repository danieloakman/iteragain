import ExtendedIterator from './ExtendedIterator';

function* rangeGen(...params: any[]) {
  let start = 0,
    stop = 0,
    step: number;
  if (params.length === 1) stop = params[0];
  else if (params.length > 1) [start, stop, step] = params;
  if (typeof step !== 'number') step = Math.sign(stop - start);
  const stepSign = Math.sign(step);
  if (stepSign === 0) return;

  for (let i = start; Math.sign(stop - i) === stepSign; i += step) yield i;
}

/**
 * Returns a ExtendedIterator for all numbers starting at the start index and one step before
 * the stop index.
 * @param start The start index (inclusive) (default: 0).
 * @param stop The stop index (exclusive).
 * @param step The optional amount to increment each step by, can be positive or
 * negative (default: Math.sign(stop - start)).
 */
export function range(stop: number): ExtendedIterator<number>;
export function range(start: number, stop: number): ExtendedIterator<number>;
export function range(start: number, stop: number, step: number): ExtendedIterator<number>;
export function range(...params: any[]): ExtendedIterator<number> {
  return new ExtendedIterator(rangeGen(...params));
}
export default range;
