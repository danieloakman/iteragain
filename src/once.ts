import { repeat } from './repeat';

export type ItOrCurriedOnce<T> = IterableIterator<T> | ((value: T) => IterableIterator<T>);

/** Returns an iterator that yields `value` exactly once. */
export function once<T>(): (value: T) => IterableIterator<T>;
export function once<T>(value: T): IterableIterator<T>;
export function once<T>(value?: T): ItOrCurriedOnce<T> {
  if (!arguments.length) return (v: T) => repeat(v, 1);
  return repeat(value as T, 1);
}

export default once;
