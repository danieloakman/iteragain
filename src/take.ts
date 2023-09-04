import type { IteratorOrIterable, Tuple } from './types';
import toIterator from './toIterator';

/**
 * Take an arbitrary number of items from an iterator/iterable like type of object.
 * @param arg Iterator or Iterable.
 * @param take Number of elements starting from the front of iterable to take (default: 1).
 * @returns Returns the array of elements taken from the front.
 */
export function take<T, Size extends number = 1>(arg: IteratorOrIterable<T>, take?: Size): Tuple<T, Size>;
export function take<T, Size extends number = 1>(take?: Size): (arg: IteratorOrIterable<T>) => Tuple<T, Size>;
export function take(...args: any[]): any[] | ((arg: IteratorOrIterable<any>) => any[]) {
  if (!args.length || (args.length === 1 && typeof args[0] === 'number'))
    return it => take(it, args[0]);
  const results: unknown[] = [];
  const it = toIterator(args[0]);
  let next: IteratorResult<unknown, unknown>;
  let takeN = args[1] ?? 1;
  while (takeN-- > 0 && !(next = it.next()).done) results.push(next.value);
  return results;
}

export default take;
