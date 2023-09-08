import type { ItOrCurriedIt, IterSource, IteratorOrIterable } from './types';
import toArray from './toArray';

/** Collects all values from the input iterator, then sorts them. */
export function sort<T extends IteratorOrIterable<unknown>>(
  comparator?: (a: IterSource<T>, b: IterSource<T>) => number,
): (arg: T) => IterableIterator<IterSource<T>>;
export function sort<T extends IteratorOrIterable<unknown>>(
  arg: T,
  comparator?: (a: IterSource<T>, b: IterSource<T>) => number,
): IterableIterator<IterSource<T>>;
export function sort(...args: any[]): ItOrCurriedIt<unknown> {
  if (!args.length || typeof args[0] === 'function') return it => sort(it, args[0]);
  return toArray(args[0]).sort(args[1])[Symbol.iterator]();
}

export default sort;
