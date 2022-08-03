import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable, ObjectEntry } from './internal/types';

/** Shorthand for `new ExtendedIterator(toIterator(arg))`. */
export function iter<T>(arg: IteratorOrIterable<T>): ExtendedIterator<T>;
export function iter(arg: Record<PropertyKey, any>): ExtendedIterator<ObjectEntry>;
export function iter(arg: any): ExtendedIterator<any> {
  return new ExtendedIterator(toIterator(arg));
}

export default iter;
