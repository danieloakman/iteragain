import { IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/**
 * Iterates and finds the element at `index`. Returns undefined if not found.
 * @param index The index to find. Only supports positive indices.
 */
export function nth<T>(arg: IteratorOrIterable<T>, index: number): T | undefined {
  const it = toIterator(arg);
  let i = 0;
  let next: IteratorResult<T>;
  while (!(next = it.next()).done && index !== i++);
  return next.value;
}

export default nth;
