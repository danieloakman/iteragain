import { IteratorOrIterable, Awaited } from './internal/types';
import toArray from './toArray';

/** Calls `Promise.race` on all collected values. */
export function promiseRace<T>(arg: IteratorOrIterable<T>): Promise<Awaited<T>> {
  return Promise.race(toArray(arg)) as Promise<Awaited<T>>;
}

export default promiseRace;
