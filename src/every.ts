import type { IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/** Return true if every element in this iterator matches the predicate. */
export function every<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): boolean;
export function every<T>(predicate: Predicate<T>): (arg: IteratorOrIterable<T>) => boolean;
export function every(...args: any[]): boolean | ((arg: IteratorOrIterable<unknown>) => boolean) {
  if (args.length === 1) return it => every(it, args[0]);
  const it = toIterator(args[0]);
  const predicate: Predicate<unknown> = args[1];
  let next: IteratorResult<unknown>;
  while (!(next = it.next()).done) if (!predicate(next.value)) return false;
  return true;
}

export default every;
