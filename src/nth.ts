import type { IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Iterates and finds the element at `index`. Returns undefined if not found.
 * @param index The index to find. Only supports positive indices.
 */
export function nth<T>(arg: IteratorOrIterable<T>, index: number): T | undefined;
export function nth<T>(index: number): (arg: IteratorOrIterable<T>) => T | undefined;
export function nth(...args: any[]): unknown {
  if (args.length === 1) return (arg: IteratorOrIterable<unknown>) => nth(arg, args[0]);
  const it = toIterator(args[0]);
  const index = args[1];
  let i = 0;
  let next: IteratorResult<unknown>;
  while (!(next = it.next()).done && index !== i++);
  return next.value;
}

export default nth;
