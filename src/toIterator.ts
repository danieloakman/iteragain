import ObjectIterator from './internal/ObjectIterator';
import { IteratorOrIterable, ObjectEntry } from './internal/types';
import isIterable from './isIterable';
import isIterator from './isIterator';

/** Converts most objects that can be an `Iterator` into one. */
export function toIterator<T>(arg: IteratorOrIterable<T>): Iterator<T>;
export function toIterator(arg: Record<PropertyKey, any>): Iterator<ObjectEntry>;
export function toIterator(arg: any): any {
  if (isIterator(arg)) return arg;
  if (isIterable(arg)) return arg[Symbol.iterator]();
  if (typeof arg === 'object' && arg !== null) return new ObjectIterator(arg);
  throw new Error(`typeof arg '${typeof arg}' could not be coerced into an Iterator`);
}

export default toIterator;
