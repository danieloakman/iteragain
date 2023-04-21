import GroupByIterator from './internal/GroupByIterator';
import { IterSource, Iteratee, IteratorOrIterable, KeyIdentifier, KeyIdentifiersValue } from './internal/types';
import toIterator from './toIterator';

/**
 * Groups *consecutive* keys in the input iterator by some key identifier function or property. Functionally equivalent
 * to the itertools.groupby function in Python. Generally the input iterator needs to be sorted by the same key. Each
 * iteration will return the next group of values with the same key, until the key changes. So unless the input iterator
 * is sorted beforehand, you may have broken up groups with the same keys.
 * @param arg The input iterator or iterable.
 * @param key The key identifier function or property name. If left undefined, and the value is a primitive, the value
 * itself is used as a key. Iterators for object like values *must* use a key identifier.
 * @example
 *  groupby('AAAABBBCCDAABBB') // =>
 *    // ['A', ['A', 'A', 'A', 'A']],
 *    // ['B', ['B', 'B', 'B']],
 *    // ['C', ['C', 'C']],
 *    // ['D', ['D']],
 *    // ['A', ['A', 'A']],
 *    // ['B', ['B', 'B', 'B']]
 */
export function groupBy<T extends IteratorOrIterable<string>, U = string>(
  arg: T,
  key?: Iteratee<string, U>,
): IterableIterator<[U, string[]]>;
export function groupBy<T extends IteratorOrIterable<number>, U = number>(
  arg: T,
  key?: Iteratee<number, U>,
): IterableIterator<[U, number[]]>;
export function groupBy<T extends IteratorOrIterable<boolean>, U = boolean>(
  arg: T,
  key?: Iteratee<boolean, U>,
): IterableIterator<[U, boolean[]]>;
export function groupBy<
  T extends IteratorOrIterable<any>,
  K extends KeyIdentifier<IterSource<T>> = Iteratee<IterSource<T>, IterSource<T>>,
>(arg: T, key?: K): IterableIterator<[KeyIdentifiersValue<IterSource<T>, K>, IterSource<T>[]]>;
export function groupBy(arg: IteratorOrIterable<any>, key: KeyIdentifier<any> = v => v) {
  return new GroupByIterator(toIterator(arg), key);
}

export default groupBy;
