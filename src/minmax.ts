import { Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/** Returns the minimum and maximum from the input iterator as a tuple: `[min, max]`. */
export function minmax<T>(
  arg: IteratorOrIterable<T>,
  iteratee: Iteratee<T, number> = v => v as unknown as number,
): [T, T] {
  const it = toIterator(arg);
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
