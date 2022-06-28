import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable } from './types';

/** Shorthand for `new ExtendedIterator(toIterator(arg))`. */
export function iter<T>(arg: IteratorOrIterable<T>): ExtendedIterator<T>;
export function iter<T>(arg: T): ExtendedIterator<[keyof T, T[keyof T]]>;
export function iter<K, V>(arg: any): ExtendedIterator<[K, V]>;
export function iter(arg: any): ExtendedIterator<any> {
  return new ExtendedIterator(toIterator(arg));
}

export default iter;
