import ExtendedIterator from './ExtendedIterator';
import iter from './iter';
import { IteratorOrIterable } from './types';

/** Attaches the index at each value of `arg`. */
export function enumerate<T>(arg: IteratorOrIterable<T>): ExtendedIterator<[number, T]>;
export function enumerate<T>(arg: T): ExtendedIterator<[number, [keyof T, T[keyof T]]]>;
export function enumerate<K, V>(arg: any): ExtendedIterator<[number, [K, V]]>;
export function enumerate(arg: any): ExtendedIterator<[number, any]> {
  return iter(arg)
    .map(((count = 0) => v => [count++, v])()); // prettier-ignore
}
export default enumerate;
