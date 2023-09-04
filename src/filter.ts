import FilterIterator from './internal/FilterIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable, Predicate, StrictPredicate } from './types';
import toIterator from './toIterator';

/**
 * Returns a new iterator that has each element in this iterator filtered by the predicate.
 * @param predicate A function that returns a truthy value to indicate to keep that value.
 */
export function filter<T extends IteratorOrIterable<any>>(
  arg: T,
  predicate: BooleanConstructor,
): IterableIterator<NonNullable<T>>;
export function filter<T extends IteratorOrIterable<any>>(
  predicate: BooleanConstructor,
): (arg: T) => IterableIterator<NonNullable<T>>;
export function filter<T extends IteratorOrIterable<any>, S extends IterSource<T>>(
  arg: T,
  predicate: StrictPredicate<IterSource<T>, S>,
): IterableIterator<S>;
export function filter<T extends IteratorOrIterable<any>, S extends IterSource<T>>(
  predicate: StrictPredicate<IterSource<T>, S>,
): (arg: T) => IterableIterator<S>;
export function filter<T extends IteratorOrIterable<any>>(
  arg: T,
  predicate: Predicate<IterSource<T>>,
): IterableIterator<IterSource<T>>;
export function filter<T extends IteratorOrIterable<any>>(
  predicate: Predicate<IterSource<T>>,
): (arg: T) => IterableIterator<IterSource<T>>;
export function filter(...args: any[]): ItOrCurriedIt<any> {
  if (args.length === 1) return it => filter(it, args[0]);
  return new FilterIterator(toIterator(args[0]), args[1]);
}

export default filter;
