import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable, ObjectEntry } from './types';

/** Shorthand for `new ExtendedIterator(toIterator(arg))`. */
export function iter<T>(arg: IteratorOrIterable<T>): ExtendedIterator<T>;
export function iter<TFunc extends (...args: any[]) => any, TSentinel = undefined>(
  arg: TFunc,
  sentinel?: TSentinel,
): ExtendedIterator<Exclude<ReturnType<TFunc>, TSentinel>>;
export function iter(arg: Record<PropertyKey, any>): ExtendedIterator<ObjectEntry>;
export function iter(arg: any, sentinel?: any): ExtendedIterator<any> {
  return new ExtendedIterator(toIterator(arg, sentinel));
}

export default iter;
