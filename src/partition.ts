import { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Partitions this iterator into a tuple of `[falsey, truthy]` corresponding to what `predicate` returns for each
 * value.
 */
export function partition<T>(arg: IteratorOrIterable<T>, predicate: (value: T) => any): [T[], T[]] {
  const iterator = toIterator(arg);
  const falsey: T[] = [];
  const truthy: T[] = [];
  let next: IteratorResult<T>;
  while (!(next = iterator.next()).done) (predicate(next.value) ? truthy : falsey).push(next.value);
  return [falsey, truthy];
}

export default partition;
