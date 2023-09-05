import toIterator from './toIterator';
import type { IteratorOrIterable, Predicate } from './types';

/** Returns the number of times the `predicate` returns a truthy value. */
export function quantify<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): number;
export function quantify<T>(predicate: Predicate<T>): (arg: IteratorOrIterable<T>) => number;
export function quantify(...args: any[]): number | ((arg: IteratorOrIterable<any>) => number) {
  if (args.length === 1) return it => quantify(it, args[0]);
  const predicate: Predicate<any> = args[1];
  let result = 0;
  const it = toIterator(args[0]);
  let next: IteratorResult<any>;
  while (!(next = it.next()).done) if (predicate(next.value)) result++;
  return result;
}

export default quantify;
