import { IteratorOrIterable, Awaited } from './types';
import toArray from './toArray';

/** Calls `Promise.all` on all collected values. */
export function promiseAll<T>(arg: IteratorOrIterable<T>): Promise<Awaited<T>[]> {
  return Promise.all(toArray(arg)) as Promise<Awaited<T>[]>;
}

export default promiseAll;
