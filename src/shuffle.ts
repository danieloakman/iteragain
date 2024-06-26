import type { IterSource, IteratorOrIterable } from './types';
import toArray from './toArray';

/**
 * Collects all values from the input iterator, then shuffles the order of it's values.
 * @param seed A seed between 0 and 1.
 */
export function shuffle<T extends IteratorOrIterable<any>>(
  arg: T,
  seed: number = Math.random(),
): IterableIterator<IterSource<T>> {
  const values = toArray(arg);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(seed * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values[Symbol.iterator]();
}

export default shuffle;
