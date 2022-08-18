import concat from './concat';
import { IteratorOrIterable } from './internal/types';
import take from './take';
import toIterator from './toIterator';

/**
 * Returns a 2 length tuple containing the head of the input `iterator` and a new iterator containing the same
 * values as `iterator`.
 */
export function spy<T>(iterator: IteratorOrIterable<T>): [T, IterableIterator<T>]
export function spy<T>(iterator: IteratorOrIterable<T>, ahead: number): [T[], IterableIterator<T>]
export function spy<T>(iterator: IteratorOrIterable<T>, ahead?: number): [T[]|T, IterableIterator<T>] {
  const it = toIterator(iterator);
  const next = take(it, ahead);
  return [typeof ahead === 'number' ? next : next[0], concat(next, it)];
}

export default spy;
