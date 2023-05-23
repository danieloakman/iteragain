/* asyncify(toAsyncIterator)*/
/* ra(IteratorOrIterable, AsyncIteratorOrIterable) */
/* ra(toIterator, toAsyncIterator) */
/* ra(isIterable, isAsyncIterable) */
/* ra(isIterator, isAsyncIterator) */
/* ra(' Iterator', ' AsyncIterator') */

import ObjectIterator from './internal/ObjectIterator';
import { IteratorOrIterable } from './types';
import isIterable from './isIterable';
import isIterator from './isIterator';
import FunctionIterator from './internal/FunctionIterator';

/**
 * Converts most objects that can be an `Iterator` into one. The supported inputs are:
 * - An `Iterator`, will return the input as is/unchanged.
 * - An `Iterable`, will return the input with it's `Symbol.iterator` property called. So this includes any object that
 * has a `Symbol.iterator` property. Like Arrays, Strings, Maps, Sets, etc.
 * - Any `function` with an optional `sentinel` argument, will return a `FunctionIterator`. This iterator will call the
 * input `func` once per `next()` call and will stop once the value of `sentinel` (default: undefined) is returned from
 * `func`.
 * - Any other non-nullable object, will return an ObjectIterator that iterates over the input object's own properties
 * deeply.
 */
export function toIterator<T>(it: IteratorOrIterable<T>): Iterator<T>;
export function toIterator<TFunc extends (...args: any[]) => /*r(Promise<any>)*/ any, TSentinel = undefined>(
  func: TFunc,
  sentinel?: TSentinel,
): FunctionIterator<TFunc, TSentinel>;
export function toIterator(object: Record<PropertyKey, any>): ObjectIterator<any>;
export function toIterator(...args: any[]): any {
  if (isIterator(args[0])) return args[0];
  if (isIterable(args[0])) return args[0][Symbol.iterator]();
  if (typeof args[0] === 'object' && args[0] !== null) return new ObjectIterator(args[0]); /*c*/
  if (typeof args[0] === 'function') return new FunctionIterator(args[0], args[1]); /*c*/
  throw new TypeError(`Cannot convert ${typeof args[0]} to an iterator.`);
}

export default toIterator;
