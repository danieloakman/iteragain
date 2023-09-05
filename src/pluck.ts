import filterMap from './filterMap';
import type { ItOrCurriedIt, IteratorOrIterable } from './types';

/** Maps `key` from `T` in each value of the input iterator. */
export function pluck<T>(arg: IteratorOrIterable<T>, key: keyof T): IterableIterator<T[keyof T]>;
export function pluck<T>(key: keyof T): (arg: IteratorOrIterable<T>) => IterableIterator<T[keyof T]>;
export function pluck(...args: any[]): ItOrCurriedIt<any> {
  if (!args.length || typeof args[0] === 'string') return it => pluck(it, args[0]);
  const key = args[1];
  return filterMap(args[0], item => item[key]);
}

export default pluck;
