import ExtendedIterator from './internal/ExtendedIterator';
import toIterator from './toIterator';
import { IteratorOrIterable, ObjectEntry } from './internal/types';

/** Shorthand for `new ExtendedIterator(toIterator(arg))`. */
export function iter<T>(arg: IteratorOrIterable<T>): ExtendedIterator<T>;
export function iter<TFunc extends (...args: any[]) => any>(
  arg: TFunc,
  sentinel?: ReturnType<TFunc>,
): ExtendedIterator<ReturnType<TFunc>>;
export function iter(arg: Record<PropertyKey, any>): ExtendedIterator<ObjectEntry>;
export function iter(arg: any, sentinel?: any): ExtendedIterator<any> {
  return new ExtendedIterator(toIterator(arg, sentinel));
}

export default iter;
