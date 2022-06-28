import { IteratorOrIterable } from './types';
import toIterator from './toIterator';

export function partition<T>(arg: IteratorOrIterable<T>, predicate: (value: T) => any): [T[], T[]] {
  const falsey: T[] = [];
  const truthy: T[] = [];
  let next: IteratorResult<T>;
  while (!(next = toIterator(arg).next()).done) (predicate(next.value) ? truthy : falsey).push(next.value);
  return [falsey, truthy];
}

export default partition;
