import { ItOrCurriedIt, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Reduces the input iterator to a single value. */
export function reduce<T>(arg: IteratorOrIterable<T>, reducer: (accumulator: T, value: T) => T): T;
export function reduce<T>(reducer: (accumulator: T, value: T) => T): (arg: IteratorOrIterable<T>) => T;
export function reduce<T, R>(arg: IteratorOrIterable<T>, reducer: (accumulator: R, value: T) => R, initialValue: R): R;
export function reduce<T, R>(reducer: (accumulator: R, value: T) => R, initialValue: R): (arg: IteratorOrIterable<T>) => R;
export function reduce<T, R>(arg: IteratorOrIterable<T>, reducer: (accumulator: T | R, value: T) => R): R;
export function reduce<T, R>(reducer: (accumulator: T | R, value: T) => R): (arg: IteratorOrIterable<T>) => R;
export function reduce(...args: any[]): ItOrCurriedIt<any> {
  if (typeof args[0] === 'function') return it => reduce(it, args[0], args[1]);
  const it = toIterator(args[0]);
  let next: IteratorResult<any>;
  let accumulator = args[2] ?? it.next().value;
  const reducer = args[1];
  while (!(next = it.next()).done) accumulator = reducer(accumulator, next.value);
  return accumulator;
}

export default reduce;
