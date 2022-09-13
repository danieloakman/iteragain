import { IteratorOrIterable, Predicate } from './internal/types';
import reduce from './reduce';

/** Returns the number of times the `predicate` returns a truthy value. */
export function quantify<T>(arg: IteratorOrIterable<T>, predicate: Predicate<T>): number {
  return reduce(arg, (acc, v) => acc + (predicate(v) ? 1 : 0), 0);
}

export default quantify;
