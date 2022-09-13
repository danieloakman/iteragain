import { Iteratee, IteratorOrIterable } from './internal/types';
import toIterator from './toIterator';

/** Returns the minimum value from the input iterator. */
export function min<T>(arg: IteratorOrIterable<T>, iteratee: Iteratee<T, number> = (v: T) => v as unknown as number): T {
  const it = toIterator(arg);
  let next = it.next();
  let min = { value: next.value, comparison: iteratee(next.value) };
  while (!(next = it.next()).done) {
    const comparison = iteratee(next.value);
    if (comparison < min.comparison) min = { value: next.value, comparison };
  }
  return min.value;
}

export default min;
