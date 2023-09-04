import CycleIterator from './internal/CycleIterator';
import type { ItOrCurriedIt, IterSource, IteratorOrIterable } from './types';
import toIterator from './toIterator';

/**
 * Creates an iterator that cycles through the input iterator's values a certain number of times.
 * @param arg The input iterator.
 * @param times The number of times to cycle through the input iterator's values (default: Infinity).
 */
export function cycle<T extends IteratorOrIterable<any>>(times?: number): (arg: T) => IterableIterator<IterSource<T>>;
export function cycle<T extends IteratorOrIterable<any>>(arg: T, times?: number): IterableIterator<IterSource<T>>;
export function cycle(...args: any[]): ItOrCurriedIt<any> {
  if (!args.length || typeof args[0] === 'number') return it => cycle(it, args[0]);
  return new CycleIterator(toIterator(args[0]), args[1] ?? Infinity);
}

export default cycle;
