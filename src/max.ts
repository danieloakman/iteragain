import type { Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns the maximum value from the input iterator. */
export function max<T>(iteratee?: Iteratee<T, number>): (arg: IteratorOrIterable<T>) => T;
export function max<T>(arg: IteratorOrIterable<T>, iteratee?: Iteratee<T, number>): T;
export function max(...args: any[]): unknown {
  if (!args.length || typeof args[0] === 'function') return (it: IteratorOrIterable<unknown>) => max(it, args[0]);
  const it = toIterator(args[0]);
  const iteratee: Iteratee<unknown, number> = args[1] ?? ((x: unknown) => x);
  let next = it.next();
  let result = { value: next.value, comparison: iteratee(next.value) };
  while (!(next = it.next()).done) {
    const comparison = iteratee(next.value);
    if (comparison > result.comparison) result = { value: next.value, comparison };
  }
  return result.value;
}

export default max;
