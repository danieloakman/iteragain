import { IteratorOrIterable } from './internal/types';
import toArray from './toArray';

export function shuffle<T>(arg: IteratorOrIterable<T>): IterableIterator<T> {
  const values = toArray(arg);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values[Symbol.iterator]();
}

export default shuffle;
