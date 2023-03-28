import { IteratorOrIterable } from './internal/types';
import toArray from './toArray';

/** Calls `Promise.race` on all collected values. */
export function promiseRace<T>(arg: IteratorOrIterable<T>) {
  return Promise.race(toArray(arg));
}

export default promiseRace;
