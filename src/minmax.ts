import type { IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns the minimum and maximum from the input iterator as a tuple: `[min, max]`. */
export function minmax<T extends IteratorOrIterable<unknown>>(
  iteratee?: Iteratee<IterSource<T>, number>,
): (arg: T) => [IterSource<T>, IterSource<T>];
export function minmax<T extends IteratorOrIterable<unknown>>(
  arg: T,
  iteratee?: Iteratee<IterSource<T>, number>,
): [IterSource<T>, IterSource<T>];
export function minmax(...args: any[]): unknown {
  if (!args.length || typeof args[0] === 'function') return (it: IteratorOrIterable<unknown>) => minmax(it, args[0]);
  const it = toIterator(args[0]);
  const iteratee: Iteratee<unknown, number> = args[1] ?? ((x: unknown): unknown => x);
  let next = it.next();
  let min = { value: next.value, comparison: iteratee(next.value) };
  let max = { value: next.value, comparison: iteratee(next.value) };
  while (!(next = it.next()).done) {
    const comparison = iteratee(next.value);
    if (comparison < min.comparison) min = { value: next.value, comparison };
    if (comparison > max.comparison) max = { value: next.value, comparison };
  }
  return [min.value, max.value];
}

export default minmax;
