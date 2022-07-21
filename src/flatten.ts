import ExtendedIterator from './internal/ExtendedIterator';
import { IteratorOrIterable, FlattenDeep, FlattenDepth1, FlattenDepth2, FlattenDepth3, FlattenDepth4, FlattenDepth5 } from './internal/types';
import FlattenIterator from './internal/FlattenIterator';
import toIterator from './toIterator';

/**
 * Flattens an iterator or iterable.
 * @param arg The iterator or iterable to flatten.
 * @param depth The number of levels to flatten (default: Infinity, i.e. deeply).
 */
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 1): ExtendedIterator<FlattenDepth1<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 2): ExtendedIterator<FlattenDepth2<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 3): ExtendedIterator<FlattenDepth3<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 4): ExtendedIterator<FlattenDepth4<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: 5): ExtendedIterator<FlattenDepth5<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>): ExtendedIterator<FlattenDeep<T>>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth: number): ExtendedIterator<any>;
export function flatten<T>(arg: IteratorOrIterable<T>, depth = Infinity) {
  return new ExtendedIterator(new FlattenIterator(toIterator(arg), depth));
}

export default flatten;
