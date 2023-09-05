import {
  IteratorOrIterable,
  FlattenDeep,
  FlattenDepth1,
  FlattenDepth2,
  FlattenDepth3,
  FlattenDepth4,
  FlattenDepth5,
  ItOrCurriedIt,
} from './types';
import FlattenIterator from './internal/FlattenIterator';
import toIterator from './toIterator';

/**
 * Flattens an iterator or iterable.
 * @param arg The iterator or iterable to flatten.
 * @param depth The number of levels to flatten (default: Infinity, i.e. deeply).
 */
export function flatten<T extends IteratorOrIterable<any>>(arg: T): IterableIterator<FlattenDeep<T>>;
export function flatten<T extends IteratorOrIterable<any>>(arg: T, depth: 1): IterableIterator<FlattenDepth1<T>>;
export function flatten<T extends IteratorOrIterable<any>>(depth: 1): (arg: T) => IterableIterator<FlattenDepth1<T>>;
export function flatten<T extends IteratorOrIterable<any>>(arg: T, depth: 2): IterableIterator<FlattenDepth2<T>>;
export function flatten<T extends IteratorOrIterable<any>>(depth: 2): (arg: T) => IterableIterator<FlattenDepth2<T>>;
export function flatten<T extends IteratorOrIterable<any>>(arg: T, depth: 3): IterableIterator<FlattenDepth3<T>>;
export function flatten<T extends IteratorOrIterable<any>>(depth: 3): (arg: T) => IterableIterator<FlattenDepth3<T>>;
export function flatten<T extends IteratorOrIterable<any>>(arg: T, depth: 4): IterableIterator<FlattenDepth4<T>>;
export function flatten<T extends IteratorOrIterable<any>>(depth: 4): (arg: T) => IterableIterator<FlattenDepth4<T>>;
export function flatten<T extends IteratorOrIterable<any>>(arg: T, depth: 5): IterableIterator<FlattenDepth5<T>>;
export function flatten<T extends IteratorOrIterable<any>>(depth: 5): (arg: T) => IterableIterator<FlattenDepth5<T>>;
export function flatten<T extends IteratorOrIterable<any>>(arg: T, depth: number): IterableIterator<unknown>;
export function flatten(...args: any[]): ItOrCurriedIt<any> {
  return new FlattenIterator(toIterator(args[0]), args[1] ?? Infinity);
}

export default flatten;
