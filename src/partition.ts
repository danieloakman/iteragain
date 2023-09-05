import type { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/**
 * Partitions this iterator into a tuple of `[falsey, truthy]` corresponding to what `predicate` returns for each
 * value.
 */
export function partition<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): [T[], T[]];
export function partition<T>(predicate: Predicate<T>): (arg: IteratorOrIterable<T>) => [T[], T[]]
export function partition<T>(...args: any[]): [T[], T[]] | ((arg: IteratorOrIterable<T>) => [T[], T[]]) {
  if (args.length === 1) return (arg: IteratorOrIterable<T>) => partition(arg, args[0]);
  const iterator = toIterator(args[0]);
  const predicate: Predicate<T> = args[1];
  const falsey: T[] = [];
  const truthy: T[] = [];
  let next: IteratorResult<T>;
  while (!(next = iterator.next()).done) (predicate(next.value) ? truthy : falsey).push(next.value);
  return [falsey, truthy];
}

export default partition;
