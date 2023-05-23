import {
  IteratorOrIterable,
  FlattenDeep,
  FlattenDepth1,
  FlattenDepth2,
  FlattenDepth3,
  FlattenDepth4,
  FlattenDepth5,
} from './types';
import FlattenIterator from './internal/FlattenIterator';
import toIterator from './toIterator';

/**
 * Flattens an iterator or iterable.
 * @param arg The iterator or iterable to flatten.
 * @param depth The number of levels to flatten (default: Infinity, i.e. deeply).
 */
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 1): IterableIterator<FlattenDepth1<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 2): IterableIterator<FlattenDepth2<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 3): IterableIterator<FlattenDepth3<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 4): IterableIterator<FlattenDepth4<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 5): IterableIterator<FlattenDepth5<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>): IterableIterator<FlattenDeep<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: number): IterableIterator<any>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth = Infinity) {
  return new FlattenIterator(toIterator(arg), depth);
}

export default flatten;
