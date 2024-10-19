import type { IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns the maximum value from the input iterator. */
export function max<T extends IteratorOrIterable<unknown>>(
  iteratee?: Iteratee<IterSource<T>, number>,
): (arg: T) => IterSource<T>;
export function max<T extends IteratorOrIterable<unknown>>(
  arg: T,
  iteratee?: Iteratee<IterSource<T>, number>,
): IterSource<T>;
export function max(...args: any[]): unknown {
  if (!args.length || typeof args[0] === 'function') return (it: IteratorOrIterable<unknown>) => max(it, args[0]);
  const it = toIterator(args[0]);
  const iteratee: Iteratee<unknown, number> = args[1] ?? ((x: unknown): unknown => x);
  let next = it.next();
  let result = { value: next.value, comparison: iteratee(next.value) };
  while (!(next = it.next()).done) {
    const comparison = iteratee(next.value);
    if (comparison > result.comparison) result = { value: next.value, comparison };
  }
  return result.value;
}

export default max;
