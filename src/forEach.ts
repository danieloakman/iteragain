import { Callback, IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Iterate an iterator using the `array.prototype.forEach` style of method. */
export function forEach<T>(arg: IteratorOrIterable<T>, callback: Callback<T>) {
  const it = toIterator(arg);
  let next: IteratorResult<T>;
  while (!(next = it.next()).done) callback(next.value);
}

export default forEach;
