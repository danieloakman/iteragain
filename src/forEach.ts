import type { Callback, IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Iterate an iterator using the `array.prototype.forEach` style of method. */
export function forEach<T extends IteratorOrIterable<any>>(arg: T, callback: Callback<IterSource<T>>): void;
export function forEach<T extends IteratorOrIterable<any>>(callback: Callback<IterSource<T>>): (arg: T) => void;
export function forEach(...args: any[]): void | ((arg: IteratorOrIterable<unknown>) => void) {
  if (args.length === 1) return (arg: IteratorOrIterable<unknown>) => forEach(arg, args[0]);
  const it = toIterator(args[0]);
  const callback = args[1];
  let next: IteratorResult<unknown>;
  while (!(next = it.next()).done) callback(next.value);
}

export default forEach;
