import FilterMapIterator from './internal/FilterMapIterator';
import type { ItOrCurriedIt, IterSource, Iteratee, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Maps and filters the input iterator in the same `iteratee` function.
 * @param iteratee A function that maps each value in this iterator to a new value and also filters out any that
 * return a nullish value.
 */
export function filterMap<T extends IteratorOrIterable<any>, R>(arg: T, iteratee: Iteratee<IterSource<T>, R>): IterableIterator<R>;
export function filterMap<T extends IteratorOrIterable<any>, R>(iteratee: Iteratee<IterSource<T>, R>): (arg: T) => IterableIterator<R>;
export function filterMap(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return (it: IteratorOrIterable<any>) => filterMap(it, args[0] as Iteratee<any, any>);
  return new FilterMapIterator(toIterator(args[0]), args[1]);
}

export default filterMap;
