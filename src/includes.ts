import type { IteratorOrIterable } from './types';
import some from './some';

export function includes<T>(arg: IteratorOrIterable<T>, value: T): boolean;
export function includes<T>(value: T): (arg: IteratorOrIterable<T>) => boolean;
export function includes<T>(...args: any[]): boolean | ((arg: IteratorOrIterable<T>) => boolean) {
  if (args.length === 1) return (arg: IteratorOrIterable<T>) => includes(arg, args[0]);
  const value = args[1];
  return some(args[0], v => v === value);
}

export default includes;
