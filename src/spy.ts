import concat from './concat';
import { IteratorOrIterable, Tuple } from './types';
import take from './take';
import toIterator from './toIterator';

/**
 * Returns a 2 length tuple containing the head of the input `iterator` and a new iterator containing the same
 * values as `iterator`.
 */
export function spy<T, TAhead extends number = 1>(
  iterator: IteratorOrIterable<T>,
  ahead: TAhead = 1 as TAhead,
): [Tuple<T, TAhead>, IterableIterator<T>] {
  const it = toIterator(iterator);
  const next = take(it, ahead);
  return [next, concat(next, it)];
}

export default spy;
