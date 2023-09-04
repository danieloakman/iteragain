import toIterator from './toIterator';
import type { IteratorOrIterable } from './types';

/** Converts any Iterator or Iterable into a IterableIterator. */
export function toIterableIterator<T>(arg: IteratorOrIterable<T>): IterableIterator<T> {
  const iterator = toIterator(arg);
  return Object.assign(iterator, {
    [Symbol.iterator]() {
      return this;
    },
  }) as IterableIterator<T>;
}

export default toIterableIterator;
