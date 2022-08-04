import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Reduces the input iterator to a single value. */
export function reduce<T>(arg: IteratorOrIterable<T>, reducer: (accumulator: T, value: T) => T): T;
export function reduce<T, R>(arg: IteratorOrIterable<T>, reducer: (accumulator: R, value: T) => R, initialValue: R): R;
export function reduce<T, R>(arg: IteratorOrIterable<T>, reducer: (accumulator: T | R, value: T) => R): R;
export function reduce<T, R>(
  arg: IteratorOrIterable<T>,
  reducer: (accumulator: R | T, value: T) => R,
  initialValue?: R,
): R {
  const it = toIterator(arg);
  let next: IteratorResult<T>;
  let accumulator = initialValue ?? it.next().value;
  while (!(next = it.next()).done) accumulator = reducer(accumulator, next.value);
  return accumulator;
}

export default reduce;
