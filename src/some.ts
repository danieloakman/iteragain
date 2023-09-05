import type { IterSource, IteratorOrIterable, Predicate } from './types';
import toIterator from './toIterator';

/** Return true if only one element in this iterator matches the predicate. */
export function some<T extends IteratorOrIterable<any>>(arg: T, predicate: Predicate<IterSource<T>>): boolean;
export function some<T extends IteratorOrIterable<any>>(predicate: Predicate<IterSource<T>>): (arg: T) => boolean;
export function some(...args: any[]): boolean | ((arg: IteratorOrIterable<unknown>) => boolean) {
  if (args.length === 1) return it => some(it, args[0]);
  const it = toIterator(args[0]);
  const predicate: Predicate<unknown> = args[1];
  let next: IteratorResult<unknown>;
  while (!(next = it.next()).done) if (predicate(next.value)) return true;
  return false;
}

export default some;
