import { IteratorOrIterable } from './internal/types';
import some from './some';

export function includes<T>(arg: IteratorOrIterable<T>, value: T): boolean {
  return some(arg, v => v === value);
}

export default includes;
