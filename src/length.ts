import { IteratorOrIterable } from './internal/types';
import reduce from './reduce';

/** Consumes the input iterator and returns the number of values/items in it. */
export function length<T>(arg: IteratorOrIterable<T>): number {
  return reduce(arg, (acc, _) => acc + 1, 0);
}

export default length;
