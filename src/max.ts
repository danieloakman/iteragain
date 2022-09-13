import { Iteratee, IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Returns the maximum value from the input iterator. */
export function max<T>(arg: IteratorOrIterable<T>, iteratee: Iteratee<T, number> = v => v as unknown as number): T {
  const it = toIterator(arg);
  let next = it.next();
  let max = { value: next.value, comparison: iteratee(next.value) };
  while (!(next = it.next()).done) {
    const comparison = iteratee(next.value);
    if (comparison > max.comparison) max = { value: next.value, comparison };
  }
  return max.value;
}

export default max;
