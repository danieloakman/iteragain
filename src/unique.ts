import type { ItOrCurriedIt, IterSource, IteratorOrIterable, UniqueParams } from './types';
import toIterator from './toIterator';
import FilterIterator from './internal/FilterIterator';

/**
 * @lazy
 * Filters `arg` iterator to only unique values.
 * @param iteratee Iteratee to use to transform each value before being tested for uniqueness.
 * @param justSeen If true, will only test for uniqueness with the last value in the iterator and not all values.
 */
export function unique<T extends IteratorOrIterable<unknown>>(
  params: UniqueParams<T>,
): (arg: T) => IterableIterator<IterSource<T>>;
export function unique<T extends IteratorOrIterable<unknown>>(
  arg: T,
  params?: UniqueParams<IterSource<T>>,
): IterableIterator<IterSource<T>>;
export function unique(...args: any[]): ItOrCurriedIt<unknown> {
  if (typeof args[0] === 'function' || !args.length) return it => unique(it, args[0]);
  const it = toIterator(args[0]);
  args[1] = args[1] ?? ((v: unknown) => v);
  const { iteratee = (v: unknown) => v, justSeen = false } =
    typeof args[1] === 'function' ? { iteratee: args[1] } : args[1];
  if (justSeen) {
    let lastValue: unknown;
    return new FilterIterator(it, value => {
      value = iteratee(value);
      if (!lastValue || value !== lastValue) {
        lastValue = value;
        return true;
      }
      return false;
    });
  }

  const seen = new Set<unknown>();
  return new FilterIterator(it, value => {
    value = iteratee(value);
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}

export default unique;
