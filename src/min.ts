import type { IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns the minimum value from the input iterator. */
export function min<T extends IteratorOrIterable<unknown>>(
  iteratee?: Iteratee<IterSource<T>, number>,
): (arg: T) => IterSource<T>;
export function min<T extends IteratorOrIterable<unknown>>(
  arg: T,
  iteratee?: Iteratee<IterSource<T>, number>,
): IterSource<T>;
export function min(...args: any[]): unknown {
  if (!args.length || typeof args[0] === 'function') return (it: IteratorOrIterable<unknown>) => min(it, args[0]);
  const it = toIterator(args[0]);
  const iteratee: Iteratee<unknown, number> = args[1] ?? ((x: unknown) => x);
  let next = it.next();
  let result = { value: next.value, comparison: iteratee(next.value) };
  while (!(next = it.next()).done) {
    const comparison = iteratee(next.value);
    if (comparison < result.comparison) result = { value: next.value, comparison };
  }
  return result.value;
}

export default min;
