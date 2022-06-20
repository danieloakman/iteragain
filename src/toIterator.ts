import { IteratorOrIterable } from './types';
import isIterable from './isIterable';
import isIterator from './isIterator';

/** Converts most objects that can be an `Iterator` into one. */
export function toIterator<T>(arg: IteratorOrIterable<T>): Iterator<T>;
export function toIterator<T>(arg: T): Iterator<[keyof T, T[keyof T]]>;
export function toIterator<K, V>(arg: any): Iterator<[K, V]>;
export function toIterator(arg: any): any {
  if (isIterator(arg)) return arg;
  if (isIterable(arg)) return arg[Symbol.iterator]();
  if (typeof arg === 'object' && arg !== null) return Object.entries(arg)[Symbol.iterator]();
  throw new Error('"arg" could not be coerced into an Iterator');
}

export default toIterator;
