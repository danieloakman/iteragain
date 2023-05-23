import { IteratorOrIterable } from './types';
import toIterator from './toIterator';
import MapIterator from './internal/MapIterator';

/** Attaches the index at each value of `arg`. */
export function enumerate<T>(arg: IteratorOrIterable<T>): IterableIterator<[number, T]>;
export function enumerate(arg: any): IterableIterator<[number, any]> {
  return new MapIterator(toIterator(arg), ((count = 0) => v => [count++, v])()); // prettier-ignore
}

export default enumerate;
