import { IteratorOrIterable } from './internal/types';
import toArray from './toArray';

/** Calls `Promise.all` on all collected values. */
export function promiseAll<T>(arg: IteratorOrIterable<T>) {
  return Promise.all(toArray(arg));
}

export default promiseAll;
