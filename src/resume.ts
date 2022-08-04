import { IteratorOrIterable } from './internal/types';

/** @todo // TODO: Implement */
export function resume<T>(arg: IteratorOrIterable<T>): IterableIterator<T> {
  throw new Error(`Not implemented, typeof arg: ${typeof arg}`);
}

export default resume;
