import concat from './concat';
import type { IterSource, IteratorOrIterable, Tuple } from './types';
import take from './take';
import toIterator from './toIterator';

/**
 * Returns a 2 length tuple containing the head of the input `iterator` and a new iterator containing the same
 * values as `iterator`.
 */
export function spy<T extends IteratorOrIterable<unknown>, TAhead extends number = 1>(
  ahead?: TAhead,
): (arg: T) => [Tuple<IterSource<T>, TAhead>, IterableIterator<IterSource<T>>];
export function spy<T extends IteratorOrIterable<unknown>, TAhead extends number = 1>(
  iterator: T,
  ahead?: TAhead,
): [Tuple<IterSource<T>, TAhead>, IterableIterator<IterSource<T>>];
export function spy(
  ...args: any[]
): [unknown[], IterableIterator<unknown>] | ((arg: any) => [unknown[], IterableIterator<unknown>]) {
  if (!args.length || typeof args[0] === 'number') return it => spy(it, args[0]);
  const it = toIterator(args[0]);
  const next = take(it, args[1]);
  return [next, concat(next, it)];
}

export default spy;
